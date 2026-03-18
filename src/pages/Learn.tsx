import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Typography, Select, Empty, Spin, message, Row, Col, Progress, Badge, Tag } from 'antd';
import { CheckOutlined, CloseOutlined, ReloadOutlined, SoundOutlined, CalendarOutlined, BookOutlined } from '@ant-design/icons';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { builtinWords, DayWords } from '../data/builtinWords';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface Word {
  id?: string;
  word: string;
  phonetic: string;
  meaning: string;
  etymology: string;
  example: string;
  example_translation: string;
}

interface DayProgress {
  day: number;
  total: number;
  mastered: number;
}

export default function Learn() {
  const { user } = useAuth();
  const [mode, setMode] = useState<'builtin' | 'custom'>('builtin');
  const [vocabularies, setVocabularies] = useState<any[]>([]);
  const [selectedVocab, setSelectedVocab] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [learningWords, setLearningWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [dayProgresses, setDayProgresses] = useState<DayProgress[]>([]);
  const [marking, setMarking] = useState(false);

  const dayCount = builtinWords.length;

  // Fetch custom vocabularies (包括共享词库)
  useEffect(() => {
    async function fetchVocabs() {
      if (!user) return;
      const { data } = await supabase
        .from('vocabularies')
        .select('id, name')
        .or(`is_public.eq.true,user_id.eq.${user.id}`);
      if (data && data.length > 0) {
        setVocabularies(data);
        setSelectedVocab(data[0].id);
      }
    }
    fetchVocabs();
  }, [user]);

  // Load day progress from localStorage
  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(`dayProgress_${user.id}`);
    if (saved) {
      setDayProgresses(JSON.parse(saved));
    } else {
      // Initialize all days
      const init = builtinWords.map(d => ({ day: d.day, total: d.words.length, mastered: 0 }));
      setDayProgresses(init);
    }
  }, [user]);

  // Save day progress to localStorage
  const saveDayProgress = (day: number, masteredCount: number) => {
    if (!user) return;
    const updated = dayProgresses.map(p => p.day === day ? { ...p, mastered: masteredCount } : p);
    if (!updated.find(p => p.day === day)) {
      updated.push({ day, total: 25, mastered: masteredCount });
    }
    setDayProgresses(updated);
    localStorage.setItem(`dayProgress_${user.id}`, JSON.stringify(updated));
  };

  const loadBuiltinDay = async (day: number) => {
    setLoading(true);
    setSessionComplete(false);
    setCurrentIndex(0);
    setShowAnswer(false);

    const dayData = builtinWords.find(d => d.day === day);
    if (!dayData) {
      setLoading(false);
      return;
    }

    // Check already mastered words for this day
    const savedMastered = localStorage.getItem(`mastered_${user?.id}_${day}`);
    const masteredWords: string[] = savedMastered ? JSON.parse(savedMastered) : [];

    // Filter out mastered words, get remaining
    const remaining = dayData.words.filter(w => !masteredWords.includes(w.word));
    if (remaining.length === 0) {
      setLearningWords([]);
      setLoading(false);
      return;
    }

    setLearningWords(remaining);
    setLoading(false);
  };

  // Load custom vocab words
  useEffect(() => {
    if (mode === 'custom' && selectedVocab && user) {
      fetchCustomWords();
    }
  }, [selectedVocab, user, mode]);

  const fetchCustomWords = async () => {
    if (!selectedVocab || !user) return;
    setLoading(true);
    setSessionComplete(false);
    setCurrentIndex(0);
    setShowAnswer(false);

    try {
      const { data: words, error } = await supabase
        .from('words')
        .select('*')
        .eq('vocabulary_id', selectedVocab)
        .limit(50);

      if (error) throw error;
      if (!words || words.length === 0) {
        setLearningWords([]);
        setLoading(false);
        return;
      }

      const shuffled = words.sort(() => 0.5 - Math.random()).slice(0, 25);
      setLearningWords(shuffled);
    } catch (err) {
      console.error(err);
      message.error('获取单词失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mode === 'builtin') {
      loadBuiltinDay(selectedDay);
    }
  }, [selectedDay, mode]);

  const handleNext = async (status: 'mastered' | 'learning') => {
    if (learningWords.length === 0) return;
    setMarking(true);

    const currentWord = learningWords[currentIndex];

    // For builtin mode, save progress locally
    if (mode === 'builtin' && user) {
      const key = `mastered_${user.id}_${selectedDay}`;
      const saved: string[] = JSON.parse(localStorage.getItem(key) || '[]');
      
      if (status === 'mastered' && !saved.includes(currentWord.word)) {
        saved.push(currentWord.word);
        localStorage.setItem(key, JSON.stringify(saved));
      }

      // Recalculate day progress
      const dayData = builtinWords.find(d => d.day === selectedDay);
      if (dayData) {
        const allMastered: string[] = JSON.parse(localStorage.getItem(`mastered_${user.id}_${selectedDay}`) || '[]');
        saveDayProgress(selectedDay, allMastered.length);
      }
    }

    // Also update DB for custom mode
    if (mode === 'custom' && user) {
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
    }

    setMarking(false);

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

  const isDayComplete = (day: number) => {
    const prog = dayProgresses.find(p => p.day === day);
    return prog ? prog.mastered >= prog.total : false;
  };

  const isDayStarted = (day: number) => {
    const prog = dayProgresses.find(p => p.day === day);
    return prog ? prog.mastered > 0 : false;
  };

  const currentDayData = useMemo(() => builtinWords.find(d => d.day === selectedDay), [selectedDay]);

  if (loading) return <div className="flex justify-center p-12"><Spin size="large" /></div>;

  if (mode === 'builtin') {
    // Show day selection when not in session
    if (!sessionComplete && learningWords.length === 0 && !loading) {
      const dayProg = dayProgresses.find(p => p.day === selectedDay);
      const allDone = dayProg ? dayProg.mastered >= dayProg.total : false;

      return (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <Title level={2}>每日单词学习</Title>
            <Select
              value={mode}
              style={{ width: 160 }}
              onChange={(v) => { setMode(v); setLearningWords([]); }}
            >
              <Option value="builtin">内置词库</Option>
              <Option value="custom">自定义词库</Option>
            </Select>
          </div>

          <Card className="shadow-sm" title={`学习进度 (${dayProgresses.reduce((a, b) => a + b.mastered, 0)} / ${dayCount * 25})`}>
            <Progress percent={Math.round(dayProgresses.reduce((a, b) => a + b.mastered, 0) / (dayCount * 25) * 100)} />
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {builtinWords.map(day => {
              const prog = dayProgresses.find(p => p.day === day.day);
              const mastered = prog ? prog.mastered : 0;
              const done = mastered >= day.words.length;
              const started = mastered > 0;

              return (
                <Card
                  key={day.day}
                  hoverable
                  className={selectedDay === day.day ? 'ring-2 ring-blue-400' : ''}
                  onClick={() => setSelectedDay(day.day)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <Badge count={day.day} style={{ backgroundColor: done ? '#52c41a' : '#1890ff' }} />
                    {done && <Tag color="green">已完成</Tag>}
                    {started && !done && <Tag color="orange">进行中</Tag>}
                  </div>
                  <div className="font-medium text-sm mb-1">{day.theme}</div>
                  <Progress
                    percent={Math.round(mastered / day.words.length * 100)}
                    size="small"
                    status={done ? 'success' : 'active'}
                  />
                  <div className="text-xs text-gray-400 mt-1">{mastered}/{day.words.length} 已掌握</div>
                </Card>
              );
            })}
          </div>

          {selectedDay && (
            <Card className="text-center shadow-md">
              <CalendarOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
              <Title level={3}>{currentDayData?.theme}</Title>
              <Paragraph type="secondary">每天学习25个单词，通过词根词缀法记忆</Paragraph>
              {allDone ? (
                <div>
                  <Tag color="green" style={{ fontSize: 16, padding: '4px 16px' }}>
                    <CheckOutlined /> 已全部掌握
                  </Tag>
                  <div className="mt-4">
                    <Button type="primary" onClick={() => { loadBuiltinDay(selectedDay); }}>
                      <ReloadOutlined /> 复习本天单词
                    </Button>
                  </div>
                </div>
              ) : (
                <Button type="primary" size="large" onClick={() => loadBuiltinDay(selectedDay)}>
                  <BookOutlined /> {isDayStarted(selectedDay) ? '继续学习' : '开始学习'}
                </Button>
              )}
            </Card>
          )}
        </div>
      );
    }
  }

  if (sessionComplete) {
    const mastered = mode === 'builtin'
      ? (dayProgresses.find(p => p.day === selectedDay)?.mastered || 0)
      : 0;
    const total = mode === 'builtin'
      ? (builtinWords.find(d => d.day === selectedDay)?.words.length || 25)
      : learningWords.length;

    return (
      <Card className="text-center py-12">
        <Title level={3} className="text-green-600">本次学习完成！</Title>
        {mode === 'builtin' && (
          <div className="mb-4">
            <Progress
              type="circle"
              percent={Math.round(mastered / total * 100)}
              format={() => `${mastered}/${total}`}
              size={120}
            />
          </div>
        )}
        <Paragraph>您已完成了这组单词的学习。学完后可以进行测验来检验掌握程度。</Paragraph>
        <Row gutter={16} justify="center">
          <Col>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={() => {
                if (mode === 'builtin') {
                  // Reset day progress to allow re-learning
                  loadBuiltinDay(selectedDay);
                } else {
                  fetchCustomWords();
                }
              }}
            >
              再来一组
            </Button>
          </Col>
          <Col>
            <Button
              icon={<CheckOutlined />}
              onClick={() => window.location.href = '/test'}
              className="bg-green-500 hover:bg-green-600 border-none text-white"
            >
              去测验
            </Button>
          </Col>
        </Row>
      </Card>
    );
  }

  if (mode === 'custom' && vocabularies.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="暂无词库，请先导入"
      >
        <Button type="primary" href="/vocabulary">去导入</Button>
      </Empty>
    );
  }

  if (learningWords.length === 0) {
    return (
      <div className="text-center p-12">
        <Title level={4}>没有需要学习的单词</Title>
        <Button onClick={() => mode === 'builtin' ? loadBuiltinDay(selectedDay) : fetchCustomWords()}>刷新重试</Button>
      </div>
    );
  }

  const currentWord = learningWords[currentIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <Title level={2}>
          {mode === 'builtin' ? `Day ${selectedDay}` : '单词学习'}
        </Title>
        <div className="flex items-center gap-4">
          {mode === 'builtin' && (
            <Select value={selectedDay} style={{ width: 180 }} onChange={setSelectedDay}>
              {builtinWords.map(d => (
                <Option key={d.day} value={d.day}>
                  Day {d.day} - {isDayComplete(d.day) ? '✅' : isDayStarted(d.day) ? '🔄' : '📖'} {d.theme}
                </Option>
              ))}
            </Select>
          )}
          {mode === 'custom' && (
            <Select value={selectedVocab} style={{ width: 200 }} onChange={setSelectedVocab}>
              {vocabularies.map(v => (
                <Option key={v.id} value={v.id}>{v.name}</Option>
              ))}
            </Select>
          )}
          <Select value={mode} style={{ width: 120 }} onChange={(v) => { setMode(v); setLearningWords([]); setSessionComplete(false); }}>
            <Option value="builtin">内置词库</Option>
            <Option value="custom">自定义词库</Option>
          </Select>
        </div>
      </div>

      {mode === 'builtin' && currentDayData && (
        <Card size="small" className="bg-blue-50 border-blue-200">
          <Text strong className="text-blue-700">
            <CalendarOutlined /> {currentDayData.theme}
          </Text>
          <Text className="ml-2 text-gray-500">通过词根词缀法学习，理解单词的构成</Text>
        </Card>
      )}

      <div className="text-center text-gray-500 mb-2">
        进度: {currentIndex + 1} / {learningWords.length}
      </div>
      <Progress
        percent={Math.round(((currentIndex + 1) / learningWords.length) * 100)}
        showInfo={false}
        strokeColor={{ from: '#108ee9', to: '#87d068' }}
      />

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
                <div className="bg-yellow-50 p-4 rounded-lg mx-auto max-w-lg border border-yellow-200">
                  <Text strong className="text-yellow-700 block mb-1">词根词缀分析</Text>
                  <Text>{currentWord.etymology}</Text>
                </div>
              )}

              {(currentWord.example || currentWord.example_translation) && (
                <div className="text-left bg-gray-50 p-4 rounded-lg mx-auto max-w-lg border border-gray-200">
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
              loading={marking}
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
              loading={marking}
            >
              认识
            </Button>
          </Col>
        </Row>
      )}
    </div>
  );
}
