import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '@services/userService';
import { User } from '@types/user';
import logo from '@assets/logo.svg';
import Breadcrumb from '@components/ui/Breadcrumb';
import { DashboardIcon, MaterialsIcon, ContentIcon, ProfileIcon, SettingsIcon } from '@components/icons';
import './Layout.css';

// 导航菜单数据
const navItems = [
  { path: '/dashboard', icon: DashboardIcon, label: '控制台' },
  { path: '/materials', icon: MaterialsIcon, label: '素材管理', children: [
    { path: '/materials', label: '素材列表' },
    { path: '/materials/upload', label: '上传素材' }
  ]},
  { path: '/content', icon: ContentIcon, label: '内容创作', children: [
    { path: '/content/create', label: '创建内容' },
    { path: '/content/list', label: '内容列表' }
  ]},
  { path: '/profile', icon: ProfileIcon, label: '个人资料' },
  { path: '/settings', icon: SettingsIcon, label: '系统设置' }
];

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePath, setActivePath] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // 获取用户信息
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['userProfile'],
    queryFn: getUserProfile
  });

  // 处理窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 处理路由变化
  useEffect(() => {
    setActivePath(location.pathname);
    // 在小屏幕上导航后自动收起侧边栏
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // 切换侧边栏
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // 登出处理
  const handleLogout = () => {
    // 清除本地存储
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // 判断是否为活跃路径
  const isActive = (path: string) => {
    return activePath.startsWith(path) && path !== '/';
  };

  // 渲染导航菜单项
  const renderNavItems = (items: any[], level = 0) => {
    return (
      <ul className={`nav-list level-${level}`}>
        {items.map((item) => (
          <li key={item.path || item.label} className="nav-item">
            {item.children ? (
              <>                
                <div className={`nav-link parent ${isActive(item.path) ? 'active' : ''}`}>
                  <item.icon className="mr-2" />
                  <span>{item.label}</span>
                  <i className={`fa fa-chevron-down ml-auto transition-transform ${isActive(item.path) ? 'rotate-180' : ''}`}></i>
                </div>
                {isActive(item.path) && renderNavItems(item.children, level + 1)}
              </>
            ) : (
              <Link
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <item.icon className="mr-2" />
                <span>{item.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="app-container">
      {/* 侧边栏 */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <img src={logo} alt="Content Builder" />
            <h1>Content Builder</h1>
          </div>
          <button
            className="toggle-btn" 
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? '收起侧边栏' : '展开侧边栏'}
          >
            <i className={`fa ${sidebarOpen ? 'fa-angle-left' : 'fa-angle-right'}`}></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          {renderNavItems(navItems)}
        </nav>
      </aside>

      {/* 主内容区 */}
      <main className="main-content">
        {/* 顶部导航 */}
        <header className="main-header">
          <div className="header-left">
            <button
              className="menu-btn" 
              onClick={toggleSidebar}
              aria-label={sidebarOpen ? '收起侧边栏' : '展开侧边栏'}
            >
              <i className={`fa ${sidebarOpen ? 'fa-bars' : 'fa-bars'}`}></i>
            </button>
          </div>

          <div className="header-right">
            <div className="search-bar">
              <input
                type="text"
                placeholder="搜索..."
                className="search-input"
              />
              <i className="fa fa-search search-icon"></i>
            </div>

            <div className="notification-icon">
              <i className="fa fa-bell-o"></i>
              <span className="badge">3</span>
            </div>

            <div className="user-menu">
              <div className="user-avatar">
                {isLoading ? (
                  <div className="skeleton-avatar"></div>
                ) : (
                  <img
                    src={user?.avatar || 'https://via.placeholder.com/40'} 
                    alt={user?.name || 'User'}
                  />
                )}
              </div>
              <div className="user-info">
                <div className="user-name">
                  {isLoading ? <div className="skeleton-text w-24"></div> : user?.name || '未登录'}
                </div>
                <div className="user-role">
                  {isLoading ? <div className="skeleton-text w-16"></div> : user?.role || '访客'}
                </div>
              </div>
              <div className="dropdown-menu">
                <div className="dropdown-content">
                  <Link to="/profile" className="dropdown-item">
                    <i className="fa fa-user mr-2"></i>个人资料
                  </Link>
                  <Link to="/settings" className="dropdown-item">
                    <i className="fa fa-cog mr-2"></i>设置
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item text-danger">
                    <i className="fa fa-sign-out mr-2"></i>退出登录
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <div className="page-content">
          <Breadcrumb />
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;