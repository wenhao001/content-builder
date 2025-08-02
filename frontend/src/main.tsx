import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { ToastProvider } from './components/ui/useToast';
import './styles/index.css';

// Initialize mock service
const enableMock = (import.meta as any).env?.VITE_ENABLE_MOCK;
if (enableMock === 'true') {
  console.log('Mock service enabled');
  // In a real implementation, you would initialize the mock service here
  // For example, with MSW (Mock Service Worker):
  // import('./mock/setup').then(({ setupMocks }) => setupMocks());
}

// 创建React Query客户端
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5分钟缓存
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </QueryClientProvider>
  </React.StrictMode>
);