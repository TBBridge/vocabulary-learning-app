import React, { useEffect, useState } from 'react';
import { Layout as AntLayout, Menu, Dropdown, Avatar, Tag } from 'antd';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeOutlined, 
  ReadOutlined, 
  BookOutlined, 
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
  ExperimentOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const { Header, Content, Footer } = AntLayout;

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, [user]);

  const checkAdmin = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', user.id)
        .single();
      setIsAdmin(!!data);
    } catch {
      setIsAdmin(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const userMenu = {
    items: [
      {
        key: 'logout',
        label: '退出登录',
        icon: <LogoutOutlined />,
        onClick: handleSignOut,
      },
    ],
  };

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">首页</Link>,
    },
    {
      key: '/vocabulary',
      icon: <BookOutlined />,
      label: <Link to="/vocabulary">词库管理</Link>,
    },
    {
      key: '/learn',
      icon: <ReadOutlined />,
      label: <Link to="/learn">单词学习</Link>,
    },
    {
      key: '/test',
      icon: <ExperimentOutlined />,
      label: <Link to="/test">测试</Link>,
    },
    {
      key: '/progress',
      icon: <BarChartOutlined />,
      label: <Link to="/progress">学习进度</Link>,
    },
    ...(isAdmin ? [{
      key: '/admin',
      icon: <SettingOutlined />,
      label: <Link to="/admin">管理员</Link>,
    }] : []),
  ];

  return (
    <AntLayout className="min-h-screen">
      <Header className="bg-white flex items-center justify-between px-6 shadow-sm sticky top-0 z-10">
        <div className="flex items-center">
          <div className="text-xl font-bold text-blue-600 mr-8">Vocabulary App</div>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            className="border-none min-w-[500px]"
          />
        </div>
        <div className="flex items-center">
          <span className="mr-4 text-gray-600">
            你好, {user?.user_metadata?.name || user?.email?.split('@')[0] || '用户'}
            {user?.user_metadata?.isGuest && (
              <Tag color="orange" className="ml-2">游客</Tag>
            )}
            {isAdmin && (
              <Tag color="blue" className="ml-2">管理员</Tag>
            )}
          </span>
          <Dropdown menu={userMenu} placement="bottomRight">
            <Avatar icon={<UserOutlined />} className="cursor-pointer bg-blue-500" />
          </Dropdown>
        </div>
      </Header>
      <Content className="p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </Content>
      <Footer className="text-center text-gray-500 bg-gray-50">
        Vocabulary Learning App ©{new Date().getFullYear()} Created with React & Supabase
      </Footer>
    </AntLayout>
  );
}
