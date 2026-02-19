import React, { useState, useEffect } from 'react';
import { Card, Button, Radio, Typography, Select, Steps, Result, Spin, message, Progress as AntProgress } from 'antd';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;
const { Option } = Select;

interface Question {
  word: any;
  options: any[];
  correctOptionId: string;
}

export default function Test() {
  const { user } = useAuth();
  const [step, setStep] = useState<'setup' | 'testing' | 'result'>('setup');
  const [vocabularies, setVocabularies] = useState<any[]>([]);
  const [config, setConfig] = useState({ vocabId: '', count: 10 });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchVocabs() {
      if (!user) return;
      const { data } = await supabase.from('vocabularies').select('id, name').eq('user_id', user.id);
      if (data) setVocabularies(data);
    }
    fetchVocabs();
  }, [user]);

  const startTest = async () => {
    if (!config.vocabId) {
      message.error('请选择词库');
      return;
    }
    setLoading(true);
    try {
      // 1. Fetch words
      const { data: allWords } = await supabase
        .from('words')
        .select('*')
        .eq('vocabulary_id', config.vocabId);

      if (!allWords || allWords.length < 4) {
        message.error('词库单词数量不足以生成测试（至少需要4个单词）');
        setLoading(false);
        return;
      }

      // 2. Generate Questions
      const testWords = allWords.sort(() => 0.5 - Math.random()).slice(0, config.count);
      const generatedQuestions = testWords.map(word => {
        // Pick 3 distractors
        const distractors = allWords
          .filter(w => w.id !== word.id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        
        const options = [...distractors, word].sort(() => 0.5 - Math.random());
        
        return {
          word: word,
          options: options,
          correctOptionId: word.id
        };
      });

      setQuestions(generatedQuestions);
      setCurrentQIndex(0);
      setUserAnswers({});
      setStep('testing');
    } catch (err) {
      console.error(err);
      message.error('生成测试失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (optionId: string) => {
    setUserAnswers(prev => ({ ...prev, [currentQIndex]: optionId }));
  };

  const submitTest = async () => {
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctOptionId) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    
    // Optional: Save test result to DB (Skipped for brevity, but recommended)
    
    setStep('result');
  };

  if (step === 'setup') {
    return (
      <div className="max-w-xl mx-auto mt-12">
        <Card title="测试设置" className="shadow-md">
          <div className="space-y-6">
            <div>
              <Text className="block mb-2">选择词库</Text>
              <Select 
                className="w-full" 
                placeholder="请选择"
                onChange={val => setConfig({...config, vocabId: val})}
              >
                {vocabularies.map(v => (
                  <Option key={v.id} value={v.id}>{v.name}</Option>
                ))}
              </Select>
            </div>
            <div>
              <Text className="block mb-2">题目数量</Text>
              <Radio.Group 
                value={config.count} 
                onChange={e => setConfig({...config, count: e.target.value})}
              >
                <Radio.Button value={10}>10题</Radio.Button>
                <Radio.Button value={20}>20题</Radio.Button>
                <Radio.Button value={50}>50题</Radio.Button>
              </Radio.Group>
            </div>
            <Button type="primary" block size="large" onClick={startTest} loading={loading}>
              开始测试
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (step === 'result') {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <Result
          status={score >= 60 ? 'success' : 'warning'}
          title={`测试得分: ${score}分`}
          subTitle={`共 ${questions.length} 题，答对 ${Math.round(score / 100 * questions.length)} 题`}
          extra={[
            <Button type="primary" key="console" onClick={() => setStep('setup')}>
              再次测试
            </Button>,
            <Button key="buy" onClick={() => window.location.href = '/'}>
              返回首页
            </Button>,
          ]}
        />
        <Card title="错题回顾" className="mt-6">
           {questions.map((q, idx) => {
             const isCorrect = userAnswers[idx] === q.correctOptionId;
             if (isCorrect) return null;
             return (
               <div key={idx} className="mb-4 p-3 bg-red-50 rounded border border-red-100">
                 <div className="font-bold text-lg">{q.word.word}</div>
                 <div className="text-red-500">你的选择: {q.options.find(o => o.id === userAnswers[idx])?.meaning || '未作答'}</div>
                 <div className="text-green-600">正确答案: {q.word.meaning}</div>
               </div>
             );
           })}
           {questions.every((q, i) => userAnswers[i] === q.correctOptionId) && <div className="text-center text-green-500">全对！太棒了！</div>}
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQIndex];
  const progressPercent = Math.round(((currentQIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
         <Title level={3}>词汇测试</Title>
         <div className="text-gray-500">
           {currentQIndex + 1} / {questions.length}
         </div>
      </div>
      <AntProgress percent={progressPercent} showInfo={false} />
      
      <Card className="shadow-lg py-8">
        <Title level={2} className="text-center mb-12">{currentQ.word.word}</Title>
        
        <div className="space-y-4 max-w-lg mx-auto">
          {currentQ.options.map(opt => (
            <Button
              key={opt.id}
              block
              size="large"
              className={`h-auto py-3 text-left whitespace-normal ${userAnswers[currentQIndex] === opt.id ? 'border-blue-500 text-blue-500 bg-blue-50' : ''}`}
              onClick={() => handleAnswer(opt.id)}
            >
              {opt.meaning}
            </Button>
          ))}
        </div>

        <div className="flex justify-between mt-12 px-8">
          <Button 
            disabled={currentQIndex === 0}
            onClick={() => setCurrentQIndex(prev => prev - 1)}
          >
            上一题
          </Button>
          {currentQIndex < questions.length - 1 ? (
            <Button 
              type="primary" 
              onClick={() => setCurrentQIndex(prev => prev + 1)}
            >
              下一题
            </Button>
          ) : (
             <Button type="primary" danger onClick={submitTest}>
               提交试卷
             </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
