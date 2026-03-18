import React, { useEffect, useState } from 'react';
import { Layout as AntLayout, Menu, Dropdown, Avatar, Tag, Drawer, Button } from 'antd';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeOutlined, 
  ReadOutlined, 
  BookOutlined, 
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
  ExperimentOutlined,
  SettingOutlined,
  MenuOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const { Header, Content, Footer } = AntLayout;

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    checkAdmin();
    
    // 检测屏幕宽度
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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
      label: <Link to="/" onClick={() => setDrawerVisible(false)}>首页</Link>,
    },
    {
      key: '/vocabulary',
      icon: <BookOutlined />,
      label: <Link to="/vocabulary" onClick={() => setDrawerVisible(false)}>词库管理</Link>,
    },
    {
      key: '/learn',
      icon: <ReadOutlined />,
      label: <Link to="/learn" onClick={() => setDrawerVisible(false)}>单词学习</Link>,
    },
    {
      key: '/test',
      icon: <ExperimentOutlined />,
      label: <Link to="/test" onClick={() => setDrawerVisible(false)}>测试</Link>,
    },
    {
      key: '/progress',
      icon: <BarChartOutlined />,
      label: <Link to="/progress" onClick={() => setDrawerVisible(false)}>学习进度</Link>,
    },
    ...(isAdmin ? [{
      key: '/admin',
      icon: <SettingOutlined />,
      label: <Link to="/admin" onClick={() => setDrawerVisible(false)}>管理员</Link>,
    }] : []),
  ];

  const handleMenuClick = (key: string) => {
    navigate(key);
    setDrawerVisible(false);
  };

  return (
    <AntLayout className="min-h-screen">
      <Header className="bg-white flex items-center justify-between px-4 md:px-6 shadow-sm sticky top-0 z-10">
        <div className="flex items-center">
          <div className="text-lg md:text-xl font-bold text-blue-600 mr-4 md:mr-8">Vocabulary App</div>
          
          {/* PC端菜单 */}
          {!isMobile && (
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={menuItems}
              className="border-none"
              style={{ minWidth: 'auto' }}
            />
          )}
        </div>
        
        <div className="flex items-center">
          {/* 移动端汉堡菜单按钮 */}
          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined style={{ fontSize: '20px' }} />}
              onClick={() => setDrawerVisible(true)}
              className="mr-2"
            />
          )}
          
          <span className="hidden sm:inline mr-4 text-gray-600 text-sm md:text-base">
            你好, {user?.user_metadata?.name || user?.email?.split('@')[0] || '用户'}
            {user?.user_metadata?.isGuest && (
              <Tag color="orange" className="ml-1">游客</Tag>
            )}
            {isAdmin && (
              <Tag color="blue" className="ml-1">管理员</Tag>
            )}
          </span>
          
          {/* 移动端只显示头像 */}
          <Dropdown menu={userMenu} placement="bottomRight">
            <Avatar icon={<UserOutlined />} className="cursor-pointer bg-blue-500" />
          </Dropdown>
        </div>
      </Header>

      {/* 移动端抽屉菜单 */}
      <Drawer
        title={
          <div className="flex items-center justify-between">
            <span className="text-blue-600 font-bold">Vocabulary App</span>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setDrawerVisible(false)}
            />
          </div>
        }
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={280}
        className="mobile-drawer"
      >
        <div className="mb-4 px-2">
          <div className="text-gray-600 text-sm">
            <div className="font-medium mb-2">
              {user?.user_metadata?.name || user?.email?.split('@')[0] || '用户'}
            </div>
            {user?.user_metadata?.isGuest && (
              <Tag color="orange" className="mb-2">游客</Tag>
            )}
            {isAdmin && (
              <Tag color="blue" className="mb-2">管理员</Tag>
            )}
          </div>
        </div>
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="border-none"
          onClick={({ key }) => handleMenuClick(key)}
        />
      </Drawer>

      <Content className="p-4 md:p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </Content>
      <Footer className="text-center text-gray-500 bg-gray-50 text-sm">
        Vocabulary Learning App ©{new Date().getFullYear()} Created with React & Supabase
      </Footer>
    </AntLayout>
  );
}
