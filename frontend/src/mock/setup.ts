// Mock setup file
// This file sets up mocking for API calls when enabled via environment variable

// Check if mocking is enabled
const enableMock = import.meta.env.VITE_ENABLE_MOCK === 'true';

if (enableMock) {
  console.log('API mocking is enabled');
  
  // Mock the browser environment
  // Note: In a real implementation, you would use a library like MSW (Mock Service Worker)
  // For this example, we'll just export our mock services
  
  // Override the default API services with mock services
  // This would typically be done through a service worker or by modifying the API client
  
  // Example of how you might use this in your components:
  // import { getContents } from '@mock/contentService';
  // instead of
  // import { getContents } from '@services/contentService';
  
  // Or you could modify the actual service files to conditionally use mock data
  
  // Export mock services for use in components
  export { getContents, getContentById, createContent, updateContent, deleteContent, batchDeleteContents, approveContent, getContentStatistics } from './contentService';
  export { login, logout, getCurrentUser, getUserById, getAllUsers, updateUser } from './userService';
  
  // Initialize mock data
  console.log('Mock services initialized');
} else {
  console.log('API mocking is disabled');
  
  // Export actual services when mocking is disabled
  // This would be the normal service imports
  // export { getContents, getContentById } from '@services/contentService';
  // export { getCurrentUser } from '@services/userService';
}

// For now, we'll always export the mock services to make them available
export { getContents, getContentById, createContent, updateContent, deleteContent, batchDeleteContents, approveContent, getContentStatistics } from './contentService';
export { login, logout, getCurrentUser, getUserById, getAllUsers, updateUser } from './userService';