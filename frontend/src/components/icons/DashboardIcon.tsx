import React from 'react';

const DashboardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 6L8 2L14 6V12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14H4C3.46957 14 2.96086 13.7893 2.58579 13.4142C2.21071 13.0391 2 12.5304 2 12V6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 8V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 8V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 8V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export default DashboardIcon;