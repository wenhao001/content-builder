export interface MaterialDTO {
  id: number;
  name: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  materialType: 'image' | 'video' | 'audio' | 'text' | string;
  description?: string;
  uploaderId: string;
  status: 'active' | 'pending' | 'disabled' | string;
  createdAt: string | Date;
  updatedAt: string | Date;
  md5Hash?: string;
  tags?: string;
  downloadCount?: number;
  lastDownloadTime?: string | Date;
}

export interface MaterialQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  materialType?: string;
  status?: string;
  search?: string;
  tags?: string;
  uploaderId?: string;
  startDate?: string;
  endDate?: string;
}

export interface MaterialUploadRequest {
  name: string;
  file: File;
  materialType: string;
  description?: string;
  tags?: string;
}

export interface MaterialUpdateRequest {
  name?: string;
  description?: string;
  tags?: string;
  status?: string;
  materialType?: string;
}

export interface MaterialStatistics {
  totalCount: number;
  totalSize: number;
  byType: Record<string, number>;
  uploadTrend: { date: string; count: number }[];
  recentUploads: MaterialDTO[];
}