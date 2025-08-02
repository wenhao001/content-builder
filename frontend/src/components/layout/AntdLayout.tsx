import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown, Badge, Input, Spin, Switch, Space, Typography } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, BellOutlined, SearchOutlined, DashboardOutlined, FileTextOutlined, FolderOutlined, SettingOutlined, EditOutlined, AuditOutlined, FileSearchOutlined, FileImageOutlined, UploadOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { getCurrentUser } from '@mock/userService';
import type { User } from '@/types/user';
import Breadcrumb from '@components/ui/Breadcrumb';
import { createStyles } from 'antd-style';
import { useTheme } from '@/components/providers/ThemeProvider';

const { Header, Sider, Content } = Layout;

// 简化样式定义，使用antd默认样式
const useStyles = createStyles(({ token }) => ({
  header: {
    padding: 0,
    background: token.colorBgContainer,
    boxShadow: token.boxShadow,
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    height: '64px',
  },
  searchInput: {
    width: 200,
    [`@media (max-width: 768px)`]: {
      width: 120,
    },
    [`@media (max-width: 480px)`]: {
      display: 'none',
    },
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    gap: 8,
    padding: '8px 12px',
    borderRadius: token.borderRadius,
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: token.colorBgTextHover,
    },
  },
  themeSwitch: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  mobileOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
    display: 'none',
    [`@media (max-width: 768px)`]: {
      display: 'block',
    },
  },
}));


// Navigation menu items
const navItems: MenuProps['items'] = [
  {
    key: 'dashboard',
    label: (
      <span>
        <DashboardOutlined />
        <span>控制台</span>
      </span>
    ),
  },
  {
    key: 'content-generation',
    label: (
      <span>
        <FileTextOutlined />
        <span>内容生成</span>
      </span>
    ),
    children: [
      { key: '/content/create', label: (
        <span>
          <EditOutlined />
          <span>AI创作</span>
        </span>
      ) },
      { key: '/content/approval', label: (
        <span>
          <AuditOutlined />
          <span>内容审核</span>
        </span>
      ) },
      { key: '/content/list', label: (
        <span>
          <FileSearchOutlined />
          <span>内容列表</span>
        </span>
      ) },
    ],
  },
  {
    key: 'materials',
    label: (
      <span>
        <FolderOutlined />
        <span>素材管理</span>
      </span>
    ),
    children: [
      { key: '/materials', label: (
        <span>
          <FileImageOutlined />
          <span>素材列表</span>
        </span>
      ) },
      { key: '/materials/upload', label: (
        <span>
          <UploadOutlined />
          <span>上传素材</span>
        </span>
      ) },
    ],
  },
  {
    key: 'profile',
    label: (
      <span>
        <UserOutlined />
        <span>个人资料</span>
      </span>
    ),
  },
  {
    key: 'settings',
    label: (
      <span>
        <SettingOutlined />
        <span>系统设置</span>
      </span>
    ),
  },
];

const AntdLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // 使用主题
  const { themeMode, toggleTheme } = useTheme();
  const isDarkMode = themeMode === 'dark';
  
  // 使用 antd-style 样式
  const { styles } = useStyles();

  // Handle route changes
  useEffect(() => {
    // Find the matching menu key based on current path
    const currentPath = location.pathname;
    setSelectedKeys([currentPath]);
  }, [location.pathname]);

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        // If not logged in, redirect to login page
        // But only if we're not already on the login page
        if (location.pathname !== '/login') {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [navigate, location.pathname]);

  // Handle menu click
  const handleMenuClick: MenuProps['onClick'] = ({ key }: { key: string }) => {
    setSelectedKeys([key]);
    navigate(key);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // In a real implementation, you would import and call the logout service
      // For now, we'll just clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still navigate to login page even if logout fails
      navigate('/login');
    }
  };

  // User menu items
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: '个人资料',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      label: '系统设置',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 移动端遮罩层 */}
      {mobileMenuOpen && (
        <div 
          className={styles.mobileOverlay}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={200}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: mobileMenuOpen ? 1000 : 'auto',
          transform: window.innerWidth <= 768 && !mobileMenuOpen ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'transform 0.3s ease',
        }}
        className={mobileMenuOpen ? 'sider-mobile' : ''}
      >
        <div style={{ 
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold',
          gap: '12px',
          background: '#001529',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }} onClick={() => navigate('/dashboard')}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            backgroundColor: '#fff', 
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#1890ff'
          }}>
            C
          </div>
          {!collapsed && <span>内容平台</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          items={navItems}
          style={{ height: 'calc(100vh - 64px)', borderRight: 0 }}
          onClick={({ key }) => {
            handleMenuClick({ key } as any);
            if (mobileMenuOpen) {
              setMobileMenuOpen(false);
            }
          }}
        />
      </Sider>
      
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh'
        }}
      >
        <Header style={{ padding: 0, background: '#fff', boxShadow: '0 1px 4px rgba(0,21,41,.08)', position: 'sticky', top: 0, zIndex: 99 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: '64px' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => {
                if (window.innerWidth <= 768) {
                  setMobileMenuOpen(!mobileMenuOpen);
                } else {
                  setCollapsed(!collapsed);
                }
              }}
              size="large"
              style={{ fontSize: '18px' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Input
                prefix={<SearchOutlined />}
                placeholder="搜索..."
                style={{ width: 200 }}
              />
              
              {/* 主题切换开关 */}
              <Space style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SunOutlined style={{ color: isDarkMode ? '#666' : '#faad14' }} />
                <Switch
                  checked={isDarkMode}
                  onChange={toggleTheme}
                  checkedChildren={<MoonOutlined />}
                  unCheckedChildren={<SunOutlined />}
                />
                <MoonOutlined style={{ color: isDarkMode ? '#722ed1' : '#666' }} />
              </Space>
              
              <Badge count={3}>
                <BellOutlined style={{ fontSize: '18px', color: '#666', cursor: 'pointer' }} />
              </Badge>
              
              <Dropdown 
                menu={{ items: userMenuItems }} 
                trigger={['click']}
                placement="bottomRight"
                arrow={{ pointAtCenter: true }}
              >
                <Button 
                  type="text" 
                  size="large"
                  icon={
                    loading ? (
                      <Spin size="small" />
                    ) : currentUser?.avatar ? (
                      <Avatar src={currentUser.avatar} size="small" />
                    ) : (
                      <Avatar icon={<UserOutlined />} size="small" />
                    )
                  }
                >
                  <span style={{ fontSize: '14px', fontWeight: 500, marginLeft: 8 }}>
                    {loading ? '加载中...' : currentUser?.name || '用户'}
                  </span>
                </Button>
              </Dropdown>
            </div>
          </div>
        </Header>
        <Content style={{
          margin: '24px 16px',
          padding: 24,
          minHeight: 280,
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Breadcrumb />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AntdLayout;