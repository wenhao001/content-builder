import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createStyles } from 'antd-style';

// 使用 antd-style 创建样式
const useStyles = createStyles(({ token }) => ({
  breadcrumb: {
    marginBottom: '16px',
  },
  breadcrumbList: {
    display: 'flex',
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  breadcrumbItem: {
    display: 'flex',
    alignItems: 'center',
  },
  separator: {
    margin: '0 8px',
    color: '#ccc',
  },
  currentItem: {
    color: '#999',
  },
  link: {
    color: '#1890ff',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

interface BreadcrumbItem {
  path: string;
  label: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items = [] }) => {
  const location = useLocation();
  
  // 使用 antd-style 样式
  const { styles } = useStyles();
  
  // 默认的面包屑路径映射
  const defaultPathMap: Record<string, string> = {
    '/dashboard': '控制台',
    '/materials': '素材管理',
    '/materials/upload': '上传素材',
    '/content/create': 'AI创作',
    '/content/approval': '内容审核',
    '/content/list': '内容列表',
    '/settings': '系统设置',
    '/profile': '个人资料'
  };
  
  // 如果没有传入items，则根据当前路径自动生成
  const breadcrumbItems = items.length > 0 ? items : generateBreadcrumbItems(location.pathname, defaultPathMap);
  
  function generateBreadcrumbItems(pathname: string, pathMap: Record<string, string>): BreadcrumbItem[] {
    const parts = pathname.split('/').filter(part => part !== '');
    
    // 特殊处理根路径
    if (parts.length === 0) {
      return [{ path: '/', label: '首页' }];
    }
    
    const items: BreadcrumbItem[] = [{ path: '/', label: '首页' }];
    
    // 构建路径
    let currentPath = '';
    parts.forEach((part, index) => {
      currentPath += `/${part}`;
      
      // 查找匹配的标签
      const label = pathMap[currentPath] || part;
      items.push({ path: currentPath, label });
    });
    
    return items;
  }
  
  if (breadcrumbItems.length <= 1) {
    return null;
  }
  
  return (
    <nav className={`breadcrumb ${styles.breadcrumb}`}>
      <ol className={`breadcrumb-list ${styles.breadcrumbList}`}>
        {breadcrumbItems.map((item, index) => (
          <li 
            key={item.path} 
            className={`breadcrumb-item ${styles.breadcrumbItem}`}
          >
            {index > 0 && (
              <span className={styles.separator}>/</span>
            )}
            {index === breadcrumbItems.length - 1 ? (
              <span className={styles.currentItem}>{item.label}</span>
            ) : (
              <Link 
                to={item.path} 
                className={styles.link}
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;