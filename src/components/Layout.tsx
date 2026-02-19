import React from 'react';
import { Layout as AntLayout, Menu, Button, Dropdown, Avatar } from 'antd';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeOutlined, 
  ReadOutlined, 
  BookOutlined, 
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
  ExperimentOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Header, Content, Footer } = AntLayout;

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

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
            你好, {user?.user_metadata?.name || user?.email}
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
