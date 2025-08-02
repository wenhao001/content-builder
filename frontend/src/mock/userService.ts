import { User } from '@types/user';

// Mock user data
const mockUsers: User[] = [
  {
    id: 'user1',
    name: '张三',
    email: 'zhangsan@example.com',
    role: 'admin',
    avatar: 'https://example.com/avatars/zhangsan.jpg',
    department: '内容部',
    position: '内容主管',
    createdAt: '2023-01-15T08:30:00Z',
    lastLoginAt: '2023-05-22T10:15:00Z'
  },
  {
    id: 'user2',
    name: '李四',
    email: 'lisi@example.com',
    role: 'editor',
    avatar: 'https://example.com/avatars/lisi.jpg',
    department: '市场部',
    position: '市场专员',
    createdAt: '2023-02-20T09:15:00Z',
    lastLoginAt: '2023-05-22T09:45:00Z'
  },
  {
    id: 'user3',
    name: '王五',
    email: 'wangwu@example.com',
    role: 'author',
    avatar: 'https://example.com/avatars/wangwu.jpg',
    department: '创作部',
    position: '内容创作者',
    createdAt: '2023-03-10T14:20:00Z',
    lastLoginAt: '2023-05-21T16:30:00Z'
  }
];

// Currently logged in user
let currentUser: User | null = null;

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * User login
 * @param email User email
 * @param password User password
 * @returns Logged in user
 */
export const login = async (email: string, password: string) => {
  await delay(500); // Simulate network delay
  
  // In a real scenario, password should be hashed and verified
  // For mock purposes, we'll just check if the email exists
  const user = mockUsers.find(u => u.email === email);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  currentUser = user;
  
  // Store in localStorage for persistence
  localStorage.setItem('user', JSON.stringify(user));
  
  return user;
};

/**
 * User logout
 */
export const logout = async () => {
  await delay(200);
  
  currentUser = null;
  
  // Remove from localStorage
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

/**
 * Get current user profile
 * @returns Current user
 */
export const getCurrentUser = async () => {
  await delay(300);
  
  // Check if user is stored in localStorage
  if (!currentUser) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
    }
  }
  
  if (!currentUser) {
    throw new Error('User not logged in');
  }
  
  return currentUser;
};

/**
 * Get user by ID
 * @param id User ID
 * @returns User details
 */
export const getUserById = async (id: string) => {
  await delay(300);
  
  const user = mockUsers.find(u => u.id === id);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
};

/**
 * Get all users
 * @returns User list
 */
export const getAllUsers = async () => {
  await delay(500);
  
  return mockUsers;
};

/**
 * Update user profile
 * @param id User ID
 * @param data Update data
 * @returns Updated user
 */
export const updateUser = async (id: string, data: Partial<User>) => {
  await delay(500);
  
  const index = mockUsers.findIndex(u => u.id === id);
  
  if (index === -1) {
    throw new Error('User not found');
  }
  
  mockUsers[index] = {
    ...mockUsers[index],
    ...data
  };
  
  // If updating current user, update localStorage
  if (currentUser && currentUser.id === id) {
    currentUser = mockUsers[index];
    localStorage.setItem('user', JSON.stringify(currentUser));
  }
  
  return mockUsers[index];
};