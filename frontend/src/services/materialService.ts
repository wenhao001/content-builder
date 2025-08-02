import axios from 'axios';
import { MaterialDTO, MaterialQueryParams, MaterialUploadRequest, MaterialUpdateRequest, MaterialStatistics } from '@types/material';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 可添加认证token等
api.interceptors.request.use(
  (config) => {
    // 示例: 添加认证token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 统一错误处理
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 统一错误处理逻辑
    console.error('API Error:', error);
    const errorMessage = error.response?.data?.message || '操作失败，请重试';
    // 可以在这里触发全局错误提示
    return Promise.reject(new Error(errorMessage));
  }
);

/**
 * 获取素材列表
 * @param params 查询参数
 * @returns 分页素材列表
 */
export const getMaterials = async (params: MaterialQueryParams) => {
  return api.get<{
    content: MaterialDTO[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }>('/materials', { params });
};

/**
 * 获取素材详情
 * @param id 素材ID
 * @returns 素材详情
 */
export const getMaterialById = async (id: number) => {
  return api.get<MaterialDTO>(`/materials/${id}`);
};

/**
 * 上传素材
 * @param data 上传数据
 * @returns 新创建的素材
 */
export const uploadMaterial = async (data: MaterialUploadRequest) => {
  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('name', data.name);
  formData.append('materialType', data.materialType);
  if (data.description) formData.append('description', data.description);
  if (data.tags) formData.append('tags', data.tags);

  return api.post<MaterialDTO>('/materials/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * 更新素材信息
 * @param id 素材ID
 * @param data 更新数据
 * @returns 更新后的素材
 */
export const updateMaterial = async (id: number, data: MaterialUpdateRequest) => {
  return api.put<MaterialDTO>(`/materials/${id}`, data);
};

/**
 * 删除素材
 * @param id 素材ID
 * @returns 操作结果
 */
export const deleteMaterial = async (id: number) => {
  return api.delete<{
    success: boolean;
    message: string;
  }>(`/materials/${id}`);
};

/**
 * 批量删除素材
 * @param ids 素材ID数组
 * @returns 操作结果
 */
export const batchDeleteMaterials = async (ids: number[]) => {
  return api.delete<{
    success: boolean;
    message: string;
    deletedCount: number;
  }>('/materials/batch', {
    data: { ids },
  });
};

/**
 * 生成素材下载链接
 * @param id 素材ID
 * @param userId 用户ID
 * @returns 下载链接
 */
export const generateDownloadUrl = async (id: number, userId: string) => {
  return api.post<string>(`/materials/${id}/download`, { userId });
};

/**
 * 获取素材统计信息
 * @returns 统计数据
 */
export const getMaterialStatistics = async () => {
  return api.get<MaterialStatistics>('/materials/statistics');
};

/**
 * 获取热门素材
 * @param limit 获取数量
 * @returns 热门素材列表
 */
export const getPopularMaterials = async (limit: number = 5) => {
  return api.get<MaterialDTO[]>(`/materials/popular?limit=${limit}`);
};

/**
 * 获取最近上传的素材
 * @param limit 获取数量
 * @returns 最近上传的素材列表
 */
export const getRecentMaterials = async (limit: number = 5) => {
  return api.get<MaterialDTO[]>(`/materials/recent?limit=${limit}`);
};

/**
 * 搜索素材
 * @param keyword 搜索关键词
 * @param params 其他查询参数
 * @returns 搜索结果
 */
export const searchMaterials = async (keyword: string, params: Omit<MaterialQueryParams, 'search'> = {}) => {
  return getMaterials({ ...params, search: keyword });
};

export default api;