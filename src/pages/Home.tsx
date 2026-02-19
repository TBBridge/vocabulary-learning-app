import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Button, Typography, Spin } from 'antd';
import { BookOutlined, RocketOutlined, BarChartOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const { Title, Paragraph } = Typography;

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    vocabCount: 0,
    wordCount: 0,
    masteredCount: 0,
    learningCount: 0
  });

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;

      try {
        // Fetch vocabulary count
        const { count: vocabCount, error: vocabError } = await supabase
          .from('vocabularies')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (vocabError) throw vocabError;

        // Fetch user_words stats
        const { data: userWords, error: wordsError } = await supabase
          .from('user_words')
          .select('status')
          .eq('user_id', user.id);

        if (wordsError) throw wordsError;

        const mastered = userWords?.filter(w => w.status === 'mastered').length || 0;
        const learning = userWords?.filter(w => w.status === 'learning').length || 0;
        
        // Fetch total words count (approximation or from vocabularies)
        // For now, let's just sum up word_count from vocabularies
        const { data: vocabData, error: vocabDataError } = await supabase
          .from('vocabularies')
          .select('word_count')
          .eq('user_id', user.id);
          
        if (vocabDataError) throw vocabDataError;
        
        const totalWords = vocabData?.reduce((acc, curr) => acc + (curr.word_count || 0), 0) || 0;

        setStats({
          vocabCount: vocabCount || 0,
          wordCount: totalWords,
          masteredCount: mastered,
          learningCount: learning
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spin size="large" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Title level={2}>欢迎回来, {user?.user_metadata?.name || '学习者'}!</Title>
        <Paragraph type="secondary">坚持学习，每天进步一点点。</Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="词库数量"
              value={stats.vocabCount}
              prefix={<BookOutlined className="text-blue-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="总词汇量"
              value={stats.wordCount}
              prefix={<BarChartOutlined className="text-purple-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="正在学习"
              value={stats.learningCount}
              prefix={<RocketOutlined className="text-orange-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="已掌握"
              value={stats.masteredCount}
              prefix={<RocketOutlined className="text-green-500" />}
              suffix={<span className="text-xs text-gray-400">词</span>}
            />
          </Card>
        </Col>
      </Row>

      <div className="mt-8">
        <Title level={3}>快速开始</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card 
              hoverable 
              className="text-center h-full flex flex-col justify-center items-center border-blue-100 bg-blue-50"
              onClick={() => navigate('/learn')}
            >
              <RocketOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '16px' }} />
              <Title level={4}>开始学习</Title>
              <Paragraph>继续您的单词记忆之旅</Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card 
              hoverable 
              className="text-center h-full flex flex-col justify-center items-center border-green-100 bg-green-50"
              onClick={() => navigate('/vocabulary')}
            >
              <PlusCircleOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '16px' }} />
              <Title level={4}>导入词库</Title>
              <Paragraph>上传Excel文件扩充词汇量</Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card 
              hoverable 
              className="text-center h-full flex flex-col justify-center items-center border-purple-100 bg-purple-50"
              onClick={() => navigate('/test')}
            >
              <BarChartOutlined style={{ fontSize: '32px', color: '#722ed1', marginBottom: '16px' }} />
              <Title level={4}>能力测试</Title>
              <Paragraph>检验您的学习成果</Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
