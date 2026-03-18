import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Radio, Typography, Select, Result, Spin, message, Progress as AntProgress, Tag, Row, Col, Space, Divider } from 'antd';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { builtinWords } from '../data/builtinWords';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface Question {
  word: string;
  meaning: string;
  phonetic: string;
  etymology: string;
  options: string[];
  correctIndex: number;
}

export default function Test() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'setup' | 'testing' | 'result'>('setup');
  const [testType, setTestType] = useState<'builtin' | 'custom'>('builtin');
  const [vocabularies, setVocabularies] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedVocab, setSelectedVocab] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [wrongWords, setWrongWords] = useState<Question[]>([]);

  // Fetch custom vocabularies
  useEffect(() => {
    async function fetchVocabs() {
      if (!user) return;
      const { data } = await supabase.from('vocabularies').select('id, name').eq('user_id', user.id);
      if (data) {
        setVocabularies(data);
        if (data.length > 0) setSelectedVocab(data[0].id);
      }
    }
    fetchVocabs();
  }, [user]);

  const getMasteredWordsForDay = (day: number): string[] => {
    if (!user) return [];
    const saved = localStorage.getItem(`mastered_${user.id}_${day}`);
    return saved ? JSON.parse(saved) : [];
  };

  const availableDays = useMemo(() => {
    if (!user) return [];
    return builtinWords.filter(day => {
      const mastered = getMasteredWordsForDay(day.day);
      return mastered.length > 0;
    });
  }, [user, selectedDay]);

  const startTest = async () => {
    if (testType === 'custom' && !selectedVocab) {
      message.error('请选择词库');
      return;
    }

    setLoading(true);
    try {
      let allWords: { word: string; meaning: string; phonetic: string; etymology: string }[] = [];

      if (testType === 'builtin') {
        const dayData = builtinWords.find(d => d.day === selectedDay);
        if (!dayData) {
          message.error('请选择有效的天数');
          setLoading(false);
          return;
        }
        allWords = dayData.words.map(w => ({
          word: w.word,
          meaning: w.meaning,
          phonetic: w.phonetic,
          etymology: w.etymology
        }));
      } else {
        const { data: words } = await supabase
          .from('words')
          .select('word, meaning, phonetic, etymology')
          .eq('vocabulary_id', selectedVocab);

        if (!words || words.length < 4) {
          message.error('词库单词数量不足（至少需要4个）');
          setLoading(false);
          return;
        }
        allWords = words.map(w => ({
          word: w.word,
          meaning: w.meaning,
          phonetic: w.phonetic || '',
          etymology: w.etymology || ''
        }));
      }

      if (allWords.length < 4) {
        message.error('单词数量不足，至少需要4个');
        setLoading(false);
        return;
      }

      // Generate questions: for each word, pick 3 distractors
      const generatedQuestions: Question[] = allWords.map(currentWord => {
        const distractors = allWords
          .filter(w => w.word !== currentWord.word)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map(w => w.meaning);

        const options = [...distractors, currentWord.meaning].sort(() => 0.5 - Math.random());
        const correctIndex = options.indexOf(currentWord.meaning);

        return {
          word: currentWord.word,
          meaning: currentWord.meaning,
          phonetic: currentWord.phonetic,
          etymology: currentWord.etymology,
          options,
          correctIndex
        };
      });

      setQuestions(generatedQuestions);
      setCurrentQIndex(0);
      setUserAnswers({});
      setWrongWords([]);
      setShowReview(false);
      setStep('testing');
    } catch (err) {
      console.error(err);
      message.error('生成测试失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (optionIndex: number) => {
    setUserAnswers(prev => ({ ...prev, [currentQIndex]: optionIndex }));
  };

  const submitTest = () => {
    let correctCount = 0;
    const wrong: Question[] = [];

    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctIndex) {
        correctCount++;
      } else {
        wrong.push(q);
      }
    });

    setWrongWords(wrong);

    // Update mastered status for builtin mode - mark wrong ones as not mastered
    if (testType === 'builtin' && user && wrong.length > 0) {
      const key = `mastered_${user.id}_${selectedDay}`;
      const saved: string[] = JSON.parse(localStorage.getItem(key) || '[]');
      const wrongWordsList = wrong.map(w => w.word);
      const updated = saved.filter(w => !wrongWordsList.includes(w));
      localStorage.setItem(key, JSON.stringify(updated));

      // Also update day progress
      const progKey = `dayProgress_${user.id}`;
      const progs: any[] = JSON.parse(localStorage.getItem(progKey) || '[]');
      const updatedProgs = progs.map(p =>
        p.day === selectedDay ? { ...p, mastered: updated.length } : p
      );
      localStorage.setItem(progKey, JSON.stringify(updatedProgs));
    }

    setStep('result');
  };

  // Setup page
  if (step === 'setup') {
    return (
      <div className="max-w-2xl mx-auto mt-8 space-y-6">
        <Title level={2}>单词测验</Title>
        <Paragraph type="secondary">
          测试你学过的单词，找出还未掌握的单词。未答对的单词会自动标记为需要复习。
        </Paragraph>

        <Card title="测试设置" className="shadow-md">
          <div className="space-y-6">
            <div>
              <Text className="block mb-2">测试模式</Text>
              <Radio.Group
                value={testType}
                onChange={e => setTestType(e.target.value)}
              >
                <Radio.Button value="builtin">内置词库（按天）</Radio.Button>
                <Radio.Button value="custom">自定义词库</Radio.Button>
              </Radio.Group>
            </div>

            {testType === 'builtin' ? (
              <div>
                <Text className="block mb-2">选择天数</Text>
                <Select
                  className="w-full"
                  value={selectedDay}
                  onChange={setSelectedDay}
                >
                  {availableDays.length === 0 ? (
                    <Option value={1} disabled>暂无已学天数</Option>
                  ) : (
                    availableDays.map(d => {
                      const mastered = getMasteredWordsForDay(d.day).length;
                      return (
                        <Option key={d.day} value={d.day}>
                          Day {d.day} - {d.theme} ({mastered}个已学)
                        </Option>
                      );
                    })
                  )}
                </Select>
                {availableDays.length === 0 && (
                  <div className="mt-2">
                    <Button type="link" onClick={() => navigate('/learn')}>
                      先去学习一些单词
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <Text className="block mb-2">选择词库</Text>
                <Select
                  className="w-full"
                  value={selectedVocab}
                  onChange={val => setSelectedVocab(val)}
                  placeholder="请选择"
                >
                  {vocabularies.map(v => (
                    <Option key={v.id} value={v.id}>{v.name}</Option>
                  ))}
                </Select>
                {vocabularies.length === 0 && (
                  <div className="mt-2">
                    <Button type="link" onClick={() => navigate('/vocabulary')}>
                      先导入词库
                    </Button>
                  </div>
                )}
              </div>
            )}

            <Button
              type="primary"
              block
              size="large"
              onClick={startTest}
              loading={loading}
              disabled={testType === 'builtin' ? availableDays.length === 0 : vocabularies.length === 0}
            >
              开始测验
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Result page
  if (step === 'result') {
    const correctCount = questions.length - wrongWords.length;
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= 80;

    return (
      <div className="max-w-3xl mx-auto mt-8 space-y-6">
        <Result
          status={passed ? 'success' : 'warning'}
          title={passed ? '测验通过！' : '继续加油！'}
          subTitle={`得分: ${score}分 | 答对 ${correctCount} / ${questions.length} 题`}
          extra={[
            <Button type="primary" key="review" onClick={() => setShowReview(!showReview)}>
              {showReview ? '收起详情' : '查看详情'}
            </Button>,
            <Button key="retry" onClick={() => setStep('setup')}>
              再次测验
            </Button>,
            <Button key="learn" onClick={() => navigate('/learn')}>
              返回学习
            </Button>,
          ]}
        />

        {wrongWords.length > 0 && (
          <Card
            title={
              <span>
                未掌握的单词 <Tag color="red">{wrongWords.length} 个</Tag>
              </span>
            }
            className="shadow-md"
          >
            <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <Text type="warning">
                以下单词已被标记为"未掌握"，建议返回学习页面重新复习。
              </Text>
            </div>
            {wrongWords.map((q, idx) => {
              const userAnswer = userAnswers[questions.indexOf(q)];
              return (
                <div key={idx} className="mb-4 p-4 bg-red-50 rounded-lg border border-red-100">
                  <Row gutter={16}>
                    <Col span={12}>
                      <div className="font-bold text-lg">{q.word}</div>
                      <div className="text-gray-500 text-sm">[{q.phonetic}]</div>
                    </Col>
                    <Col span={12}>
                      <div className="text-red-500 mb-1">
                        你的选择: {userAnswer !== undefined ? q.options[userAnswer] : '未作答'}
                      </div>
                      <div className="text-green-600 font-medium">
                        正确答案: {q.meaning}
                      </div>
                    </Col>
                  </Row>
                  {q.etymology && (
                    <div className="mt-2 text-sm text-yellow-700 bg-yellow-50 p-2 rounded">
                      {q.etymology}
                    </div>
                  )}
                </div>
              );
            })}
          </Card>
        )}

        {showReview && (
          <Card title="答题详情" className="shadow-md">
            {questions.map((q, idx) => {
              const isCorrect = userAnswers[idx] === q.correctIndex;
              return (
                <div
                  key={idx}
                  className={`mb-3 p-3 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}
                >
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Text strong>{q.word}</Text>
                    </Col>
                    <Col>
                      {isCorrect ? (
                        <Tag color="green">正确</Tag>
                      ) : (
                        <Tag color="red">错误</Tag>
                      )}
                    </Col>
                  </Row>
                  <div className="mt-1">
                    <Text type="secondary">
                      你的选择: {userAnswers[idx] !== undefined ? q.options[userAnswers[idx]] : '未作答'}
                    </Text>
                  </div>
                  {!isCorrect && (
                    <div className="mt-1">
                      <Text className="text-green-600">正确: {q.meaning}</Text>
                    </div>
                  )}
                </div>
              );
            })}
          </Card>
        )}

        {wrongWords.length === 0 && (
          <Card className="text-center py-8">
            <Title level={4} className="text-green-600">全部答对！太棒了！</Title>
            <Paragraph>所有单词已掌握，可以开始下一天的学习了。</Paragraph>
            {testType === 'builtin' && selectedDay < builtinWords.length && (
              <Button
                type="primary"
                size="large"
                onClick={() => navigate('/learn')}
                className="bg-green-500 border-none"
              >
                开始 Day {selectedDay + 1} 的学习
              </Button>
            )}
          </Card>
        )}
      </div>
    );
  }

  // Testing page
  const currentQ = questions[currentQIndex];
  const progressPercent = Math.round(((currentQIndex + 1) / questions.length) * 100);
  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <Title level={3}>
          {testType === 'builtin' ? `Day ${selectedDay} 测验` : '词汇测验'}
        </Title>
        <div className="text-gray-500">
          {currentQIndex + 1} / {questions.length}
        </div>
      </div>

      <AntProgress percent={progressPercent} showInfo={false} strokeColor="#1890ff" />

      <Card className="shadow-lg py-8">
        <div className="text-center mb-4">
          <Tag color="blue">第 {currentQIndex + 1} 题</Tag>
          <Tag color="geekblue">已答 {answeredCount} 题</Tag>
        </div>

        <Title level={2} className="text-center mb-2">{currentQ.word}</Title>
        <div className="text-center text-gray-400 mb-8">[{currentQ.phonetic}]</div>

        <div className="space-y-3 max-w-lg mx-auto">
          {currentQ.options.map((opt, idx) => {
            const isSelected = userAnswers[currentQIndex] === idx;
            return (
              <Button
                key={idx}
                block
                size="large"
                className={`h-auto py-3 px-4 text-left whitespace-normal text-sm ${
                  isSelected
                    ? 'border-blue-500 text-blue-600 bg-blue-50 font-medium'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleAnswer(idx)}
              >
                <span className="font-bold mr-2 text-gray-400">{String.fromCharCode(65 + idx)}.</span>
                {opt}
              </Button>
            );
          })}
        </div>

        <Divider />

        <div className="flex justify-between items-center">
          <Button
            disabled={currentQIndex === 0}
            onClick={() => setCurrentQIndex(prev => prev - 1)}
          >
            上一题
          </Button>

          <Space>
            {currentQIndex < questions.length - 1 ? (
              <Button
                type="primary"
                onClick={() => setCurrentQIndex(prev => prev + 1)}
              >
                下一题
              </Button>
            ) : (
              <Button
                type="primary"
                danger
                size="large"
                onClick={submitTest}
                disabled={answeredCount < questions.length}
              >
                {answeredCount < questions.length
                  ? `还有 ${questions.length - answeredCount} 题未答`
                  : '提交试卷'}
              </Button>
            )}
          </Space>

          <div className="w-16 text-right">
            <Tag color="blue">{answeredCount}/{questions.length}</Tag>
          </div>
        </div>
      </Card>
    </div>
  );
}
