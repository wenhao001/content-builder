export interface ContentDTO {
  id: number;
  title: string;
  content: string;
  summary?: string;
  authorId: string;
  authorName: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'published';
  tags?: string[];
  categoryId?: number;
  categoryName?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  publishedAt?: string | Date;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  coverImageUrl?: string;
  sourceMaterials?: number[]; // 关联的素材ID
}

export interface ContentQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  status?: string;
  search?: string;
  tags?: string;
  authorId?: string;
  categoryId?: number;
  startDate?: string;
  endDate?: string;
}

export interface ContentCreateRequest {
  title: string;
  content: string;
  summary?: string;
  tags?: string[];
  categoryId?: number;
  coverImageUrl?: string;
  sourceMaterials?: number[];
}

export interface ContentUpdateRequest {
  title?: string;
  content?: string;
  summary?: string;
  tags?: string[];
  categoryId?: number;
  status?: 'draft' | 'submitted' | 'approved' | 'rejected' | 'published';
  coverImageUrl?: string;
  sourceMaterials?: number[];
}

export interface ContentApprovalRequest {
  id: number;
  status: 'approved' | 'rejected';
  remark?: string;
}

export interface ContentStatistics {
  totalCount: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
  publishTrend: { date: string; count: number }[];
  recentContents: ContentDTO[];
}