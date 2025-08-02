import React from 'react';
import { Card, Button } from '@components/ui';

const ErrorPage: React.FC = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="text-6xl font-bold text-red-500 mb-4">!</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Something Went Wrong</h1>
        <p className="text-gray-600 mb-6">
          An unexpected error occurred. Please try reloading the page.
        </p>
        <Button onClick={handleReload}>
          Reload Page
        </Button>
      </Card>
    </div>
  );
};

export default ErrorPage;