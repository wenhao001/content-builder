import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/providers/ThemeProvider';
import AntdLayout from './components/layout/AntdLayout';
import Dashboard from './pages/Dashboard';
import MaterialUpload from './pages/materials/MaterialUpload';
import MaterialList from './pages/materials/MaterialList';
import MaterialDetail from './pages/materials/MaterialDetail';
import ContentCreation from './pages/content/ContentCreation';
import ContentList from './pages/ContentList';
import ContentGeneration from './pages/ContentGeneration';
import ContentApproval from './pages/ContentApproval';
import Settings from './pages/settings/Settings';
import Profile from './pages/user/Profile';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ErrorPage from './pages/ErrorPage';

// 创建 QueryClient 实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5分钟
      cacheTime: 10 * 60 * 1000, // 10分钟
    },
  },
});

// 创建路由配置
const router = createBrowserRouter([
  {
    path: '/',
    element: <AntdLayout />, 
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'materials', element: <MaterialList /> },
      { path: 'materials/upload', element: <MaterialUpload /> },
      { path: 'materials/:id', element: <MaterialDetail /> },
      { path: 'content/create', element: <ContentGeneration /> },
      { path: 'content/approval', element: <ContentApproval /> },
      { path: 'content/list', element: <ContentList /> },
      { path: 'settings', element: <Settings /> },
      { path: 'profile', element: <Profile /> }
    ]
  },
  { path: '/login', element: <Login /> },
  { path: '404', element: <NotFound /> },
  { path: '*', element: <Navigate to="/404" replace /> }
]);

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;