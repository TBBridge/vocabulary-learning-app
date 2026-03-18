import React, { useEffect, useState } from 'react';
import { Card, Table, Typography, Statistic, Row, Col, Tag, Spin, message, Tabs } from 'antd';
import { UserOutlined, BookOutlined, TrophyOutlined, ClockCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

interface UserStats {
  id: string;
  email: string;
  name: string;
  created_at: string;
  total_words_learned: number;
  total_tests_taken: number;
  average_score: number;
  last_active: string;
  is_guest: boolean;
}

interface VocabularyStats {
  id: string;
  name: string;
  word_count: number;
  created_at: string;
}

export default function Admin() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [vocabStats, setVocabStats] = useState<VocabularyStats[]>([]);
  const [totalWordsLearned, setTotalWordsLearned] = useState(0);
  const [totalTests, setTotalTests] = useState(0);

  useEffect(() => {
    if (user) {
      checkAdminAndFetchData();
    }
  }, [user]);

  const checkAdminAndFetchData = async () => {
    if (!user) return;

    try {
      // 检查是否是管理员
      const { data: adminCheck, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (adminError || !adminCheck) {
        message.error('您没有管理员权限');
        window.location.href = '/';
        return;
      }

      // 获取数据
      await Promise.all([
        fetchUserStats(),
        fetchVocabStats(),
        fetchOverallStats(),
      ]);

    } catch (error) {
      console.error('Error checking admin:', error);
      message.error('验证管理员权限失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      // 从 user_learning_stats 视图获取用户统计
      const { data, error } = await supabase
        .from('user_learning_stats')
        .select('*')
        .order('total_words_learned', { ascending: false });

      if (error) {
        // 如果视图不存在，使用备选方案
        console.log('View not found, using fallback');
        await fetchUserStatsFallback();
        return;
      }
      setUserStats(data || []);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      await fetchUserStatsFallback();
    }
  };

  const fetchUserStatsFallback = async () => {
    try {
      // 备选方案：从 user_words 和 tests 表聚合数据
      const { data: userWords, error: uwError } = await supabase
        .from('user_words')
        .select('user_id, status, last_reviewed');

      const { data: tests, error: testError } = await supabase
        .from('tests')
        .select('user_id, score, completed_at, word_count');

      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, name, created_at, is_guest');

      if (uwError || testError || profileError) {
        throw new Error('Failed to fetch data');
      }

      // 聚合用户统计
      const statsMap = new Map<string, UserStats>();
      
      // 初始化用户
      (profiles || []).forEach(p => {
        statsMap.set(p.id, {
          id: p.id,
          email: p.email || '',
          name: p.name || p.email?.split('@')[0] || 'Unknown',
          created_at: p.created_at,
          total_words_learned: 0,
          total_tests_taken: 0,
          average_score: 0,
          last_active: p.created_at,
          is_guest: p.is_guest || false,
        });
      });

      // 统计学习数据
      (userWords || []).forEach(uw => {
        const stat = statsMap.get(uw.user_id);
        if (stat) {
          if (uw.status === 'mastered') {
            stat.total_words_learned++;
          }
          if (uw.last_reviewed) {
            stat.last_active = uw.last_reviewed > stat.last_active ? uw.last_reviewed : stat.last_active;
          }
        }
      });

      // 统计测试数据
      (tests || []).forEach(t => {
        const stat = statsMap.get(t.user_id);
        if (stat && t.completed_at) {
          stat.total_tests_taken++;
          if (t.score !== null && t.word_count) {
            // 累计分数计算平均
            stat.average_score = Math.round(
              ((stat.average_score * (stat.total_tests_taken - 1)) + (t.score / t.word_count * 100)) 
              / stat.total_tests_taken
            );
          }
        }
      });

      setUserStats(Array.from(statsMap.values()));
    } catch (error) {
      console.error('Error in fallback:', error);
      setUserStats([]);
    }
  };

  const fetchVocabStats = async () => {
    try {
      const { data, error } = await supabase
        .from('vocabularies')
        .select('id, name, word_count, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVocabStats(data || []);
    } catch (error) {
      console.error('Error fetching vocab stats:', error);
    }
  };

  const fetchOverallStats = async () => {
    try {
      // 获取总学习单词数
      const { count: masteredCount } = await supabase
        .from('user_words')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'mastered');

      // 获取总测试数
      const { count: testCount } = await supabase
        .from('tests')
        .select('*', { count: 'exact', head: true })
        .not('completed_at', 'is', null);

      setTotalWordsLearned(masteredCount || 0);
      setTotalTests(testCount || 0);
    } catch (error) {
      console.error('Error fetching overall stats:', error);
    }
  };

  const userColumns = [
    {
      title: '用户',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: UserStats) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" className="text-xs">{record.email}</Text>
          {record.is_guest && <Tag color="orange" className="ml-2">游客</Tag>}
        </div>
      ),
    },
    {
      title: '已学单词',
      dataIndex: 'total_words_learned',
      key: 'total_words_learned',
      sorter: (a: UserStats, b: UserStats) => a.total_words_learned - b.total_words_learned,
      render: (count: number) => (
        <span className="text-green-600 font-medium">{count}</span>
      ),
    },
    {
      title: '完成测试',
      dataIndex: 'total_tests_taken',
      key: 'total_tests_taken',
      sorter: (a: UserStats, b: UserStats) => a.total_tests_taken - b.total_tests_taken,
    },
    {
      title: '平均分数',
      dataIndex: 'average_score',
      key: 'average_score',
      sorter: (a: UserStats, b: UserStats) => a.average_score - b.average_score,
      render: (score: number) => (
        <span className={score >= 80 ? 'text-green-600' : score >= 60 ? 'text-blue-600' : 'text-red-600'}>
          {score > 0 ? `${score}%` : '-'}
        </span>
      ),
    },
    {
      title: '最后活跃',
      dataIndex: 'last_active',
      key: 'last_active',
      render: (date: string) => date ? new Date(date).toLocaleString('zh-CN') : '-',
    },
    {
      title: '注册时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => date ? new Date(date).toLocaleDateString('zh-CN') : '-',
    },
  ];

  const vocabColumns = [
    {
      title: '词库名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong><BookOutlined className="mr-2" />{text}</Text>,
    },
    {
      title: '单词数量',
      dataIndex: 'word_count',
      key: 'word_count',
      sorter: (a: VocabularyStats, b: VocabularyStats) => a.word_count - b.word_count,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => date ? new Date(date).toLocaleDateString('zh-CN') : '-',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Title level={2}>
        <SettingOutlined className="mr-2" />
        管理员控制台
      </Title>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={userStats.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="已学单词总数"
              value={totalWordsLearned}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="完成测试数"
              value={totalTests}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="词库数量"
              value={vocabStats.length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 详细数据 */}
      <Card>
        <Tabs
          defaultActiveKey="users"
          items={[
            {
              key: 'users',
              label: '用户学习情况',
              children: (
                <Table
                  dataSource={userStats}
                  columns={userColumns}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 800 }}
                  locale={{ emptyText: '暂无用户数据' }}
                />
              ),
            },
            {
              key: 'vocabularies',
              label: '词库管理',
              children: (
                <Table
                  dataSource={vocabStats}
                  columns={vocabColumns}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  locale={{ emptyText: '暂无词库' }}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
