import React from 'react';
import { Card } from '@components/ui';

const ContentCreation: React.FC = () => {
  return (
    <div className="p-6">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Content Creation</h1>
        <p className="text-gray-600">
          This is the content creation page.
        </p>
      </Card>
    </div>
  );
};

export default ContentCreation;