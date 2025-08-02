import React from 'react';
import { Card, Button } from '@components/ui';

const NotFound: React.FC = () => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-6">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Button onClick={handleGoHome}>
          Go Back Home
        </Button>
      </Card>
    </div>
  );
};

export default NotFound;