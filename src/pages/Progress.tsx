import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Spin } from 'antd';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title as ChartTitle } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, ChartTitle);

const { Title } = Typography;

export default function Progress() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    mastered: 0,
    learning: 0,
    new: 0
  });

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        // 1. Get total words count
        const { data: vocabs } = await supabase
          .from('vocabularies')
          .select('word_count')
          .eq('user_id', user.id);
        
        const totalWords = vocabs?.reduce((acc, v) => acc + (v.word_count || 0), 0) || 0;

        // 2. Get user progress
        const { data: userWords } = await supabase
          .from('user_words')
          .select('status')
          .eq('user_id', user.id);

        const mastered = userWords?.filter(w => w.status === 'mastered').length || 0;
        const learning = userWords?.filter(w => w.status === 'learning').length || 0;
        const newWords = Math.max(0, totalWords - mastered - learning);

        setStats({ mastered, learning, new: newWords });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const doughnutData = {
    labels: ['已掌握', '学习中', '未开始'],
    datasets: [
      {
        data: [stats.mastered, stats.learning, stats.new],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', // Green
          'rgba(255, 206, 86, 0.6)', // Yellow
          'rgba(201, 203, 207, 0.6)', // Grey
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(201, 203, 207, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    datasets: [
      {
        label: '每日学习单词数',
        data: [12, 19, 3, 5, 2, 3, 15], // Mock data for now
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  if (loading) return <div className="flex justify-center p-12"><Spin size="large" /></div>;

  return (
    <div className="space-y-6">
      <Title level={2}>学习进度分析</Title>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card title="整体掌握情况" className="shadow-sm">
            <div className="h-64 flex justify-center">
              <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="近期学习趋势 (模拟数据)" className="shadow-sm">
            <div className="h-64 flex justify-center">
              <Line data={lineData} options={{ maintainAspectRatio: false }} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
