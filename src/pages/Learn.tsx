import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Select, Empty, Spin, message, Row, Col } from 'antd';
import { CheckOutlined, CloseOutlined, ReloadOutlined, SoundOutlined } from '@ant-design/icons';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface Word {
  id: string;
  word: string;
  phonetic: string;
  meaning: string;
  etymology: string;
  example: string;
  example_translation: string;
}

export default function Learn() {
  const { user } = useAuth();
  const [vocabularies, setVocabularies] = useState<any[]>([]);
  const [selectedVocab, setSelectedVocab] = useState<string | null>(null);
  const [learningWords, setLearningWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  // Fetch vocabularies on mount
  useEffect(() => {
    async function fetchVocabs() {
      if (!user) return;
      const { data } = await supabase.from('vocabularies').select('id, name').eq('user_id', user.id);
      if (data && data.length > 0) {
        setVocabularies(data);
        setSelectedVocab(data[0].id); // Default to first
      }
    }
    fetchVocabs();
  }, [user]);

  // Fetch words when vocabulary changes
  useEffect(() => {
    if (selectedVocab && user) {
      fetchWords();
    }
  }, [selectedVocab, user]);

  const fetchWords = async () => {
    if (!selectedVocab || !user) return;
    setLoading(true);
    setSessionComplete(false);
    setCurrentIndex(0);
    setShowAnswer(false);

    try {
      // Logic: Get words that are NOT mastered, limit 10 for a session
      // This requires complex query. For simplicity:
      // 1. Get words from vocab
      // 2. Filter out words user has mastered (client side or join)
      
      // Let's try a simpler approach: Get random 10 words from this vocab
      const { data: words, error } = await supabase
        .from('words')
        .select('*')
        .eq('vocabulary_id', selectedVocab)
        .limit(50); // Fetch more to filter locally

      if (error) throw error;

      if (!words || words.length === 0) {
        setLearningWords([]);
        setLoading(false);
        return;
      }

      // Shuffle and pick 10
      const shuffled = words.sort(() => 0.5 - Math.random()).slice(0, 10);
      setLearningWords(shuffled);
    } catch (err) {
      console.error(err);
      message.error('获取单词失败');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async (status: 'mastered' | 'learning') => {
    if (!user || learningWords.length === 0) return;

    const currentWord = learningWords[currentIndex];

    // Update status in DB
    try {
      const { error } = await supabase
        .from('user_words')
        .upsert({
          user_id: user.id,
          word_id: currentWord.id,
          status: status,
          last_reviewed: new Date().toISOString()
        }, { onConflict: 'user_id,word_id' });

      if (error) throw error;
    } catch (err) {
      console.error('Error updating progress:', err);
    }

    if (currentIndex < learningWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      setSessionComplete(true);
    }
  };

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  if (loading) return <div className="flex justify-center p-12"><Spin size="large" /></div>;

  if (vocabularies.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="暂无词库，请先导入"
      >
        <Button type="primary" href="/vocabulary">去导入</Button>
      </Empty>
    );
  }

  if (sessionComplete) {
    return (
      <Card className="text-center py-12">
        <Title level={3} className="text-green-600">本次学习完成！</Title>
        <Paragraph>您已完成了这组单词的学习。</Paragraph>
        <Button type="primary" icon={<ReloadOutlined />} onClick={fetchWords}>再来一组</Button>
      </Card>
    );
  }

  if (learningWords.length === 0) {
    return (
      <div className="text-center p-12">
        <Title level={4}>该词库暂无单词或已全部学完</Title>
        <Button onClick={fetchWords}>刷新重试</Button>
      </div>
    );
  }

  const currentWord = learningWords[currentIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <Title level={2}>单词学习</Title>
        <Select 
          value={selectedVocab} 
          style={{ width: 200 }} 
          onChange={setSelectedVocab}
        >
          {vocabularies.map(v => (
            <Option key={v.id} value={v.id}>{v.name}</Option>
          ))}
        </Select>
      </div>

      <div className="text-center text-gray-500 mb-2">
        进度: {currentIndex + 1} / {learningWords.length}
      </div>

      <Card className="shadow-md min-h-[400px] flex flex-col justify-center relative">
        <div className="text-center space-y-6">
          <div>
            <Title level={1} className="mb-2">{currentWord.word}</Title>
            <div className="flex justify-center items-center space-x-2 text-gray-500 text-lg">
              <span>{currentWord.phonetic && `[${currentWord.phonetic}]`}</span>
              <Button 
                type="text" 
                shape="circle" 
                icon={<SoundOutlined />} 
                onClick={(e) => { e.stopPropagation(); playAudio(currentWord.word); }}
              />
            </div>
          </div>

          {!showAnswer ? (
            <div className="py-12 cursor-pointer" onClick={() => setShowAnswer(true)}>
              <Button type="dashed" size="large">点击查看释义</Button>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div>
                <Text strong className="text-xl text-blue-600">{currentWord.meaning}</Text>
              </div>
              
              {currentWord.etymology && (
                <div className="bg-yellow-50 p-4 rounded-lg mx-auto max-w-lg">
                  <Text strong className="text-yellow-700 block mb-1">词根词缀</Text>
                  <Text>{currentWord.etymology}</Text>
                </div>
              )}

              {(currentWord.example || currentWord.example_translation) && (
                <div className="text-left bg-gray-50 p-4 rounded-lg mx-auto max-w-lg">
                   <Text strong className="text-gray-700 block mb-1">例句</Text>
                   <p className="mb-1">{currentWord.example}</p>
                   <p className="text-gray-500">{currentWord.example_translation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {showAnswer && (
        <Row gutter={16} className="mt-6">
          <Col span={12}>
            <Button 
              block 
              size="large" 
              danger 
              icon={<CloseOutlined />} 
              onClick={() => handleNext('learning')}
              className="h-12 text-lg"
            >
              不认识
            </Button>
          </Col>
          <Col span={12}>
            <Button 
              block 
              size="large" 
              type="primary" 
              className="bg-green-500 hover:bg-green-600 h-12 text-lg border-none"
              icon={<CheckOutlined />} 
              onClick={() => handleNext('mastered')}
            >
              认识
            </Button>
          </Col>
        </Row>
      )}
    </div>
  );
}
