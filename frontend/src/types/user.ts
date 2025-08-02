export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'author';
  avatar?: string;
  department?: string;
  position?: string;
  createdAt: string; // ISO 8601 format
  lastLoginAt?: string; // ISO 8601 format
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserUpdateRequest {
  name?: string;
  email?: string;
  avatar?: string;
  department?: string;
  position?: string;
}