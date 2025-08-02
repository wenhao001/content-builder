import React from 'react';

const ContentIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2H4C2.89543 2 2 2.89543 2 4V12C2 13.1046 2.89543 14 4 14H12C13.1046 14 14 13.1046 14 12V4C14 2.89543 13.1046 2 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M5 8H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M5 10H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export default ContentIcon;