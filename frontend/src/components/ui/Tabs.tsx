import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultActiveId?: string;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, defaultActiveId, className = '' }) => {
  const [activeTabId, setActiveTabId] = useState(defaultActiveId || tabs[0]?.id || '');

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  return (
    <div className={className}>
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`py-4 px-1 text-sm font-medium ${activeTabId === tab.id
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="py-4">
        {activeTab?.content}
      </div>
    </div>
  );
};

export default Tabs;