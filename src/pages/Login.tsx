import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const { Title, Text } = Typography;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        throw error;
      }

      message.success('登录成功');
      navigate('/');
    } catch (err: any) {
      console.error(err);
      if (err.message.includes('Email not confirmed')) {
        setError('您的邮箱尚未验证，请检查您的邮箱并点击验证链接。');
      } else if (err.message.includes('Invalid login credentials')) {
        setError('邮箱或密码错误，请重试。');
      } else {
        setError(err.message || '登录失败，请检查邮箱和密码');
      }
    } finally {
      setLoading(false);
    }
  };

  // 游客登录 - 使用匿名方式
  const handleGuestLogin = async () => {
    setGuestLoading(true);
    setError(null);
    try {
      // 生成一个随机的游客邮箱和密码
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const guestEmail = `guest_${timestamp}_${randomStr}@vocabulary.app`;
      const guestPassword = `Guest_${randomStr}_${timestamp}`;

      const { error: signUpError } = await supabase.auth.signUp({
        email: guestEmail,
        password: guestPassword,
        options: {
          data: {
            name: `游客${randomStr.toUpperCase()}`,
            isGuest: true,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      // 注册成功后立即登录
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: guestEmail,
        password: guestPassword,
      });

      if (signInError) {
        throw signInError;
      }

      message.success('游客登录成功');
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.message || '游客登录失败，请稍后重试');
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg rounded-xl">
        <div className="text-center mb-8">
          <Title level={2} className="text-blue-600">Vocabulary App</Title>
          <Text type="secondary">欢迎回来，请登录您的账户</Text>
        </div>

        {error && (
          <Alert
            message="登录失败"
            description={error}
            type="error"
            showIcon
            className="mb-4"
          />
        )}

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱地址' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="邮箱" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>

          <Divider>
            <Text type="secondary" className="text-xs">或者</Text>
          </Divider>

          <Button
            type="default"
            block
            size="large"
            icon={<UserSwitchOutlined />}
            loading={guestLoading}
            onClick={handleGuestLogin}
            className="mb-4"
          >
            游客登录（无需注册）
          </Button>

          <div className="text-center">
            <Text>还没有账号？ <Link to="/register">立即注册</Link></Text>
          </div>
        </Form>
      </Card>
    </div>
  );
}
