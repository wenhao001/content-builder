import { ContentDTO, ContentQueryParams, ContentCreateRequest, ContentUpdateRequest, ContentApprovalRequest, ContentStatistics } from '@types/content';

// Mock data
let mockContents: ContentDTO[] = [
  {
    id: 1,
    title: 'AI技术在内容创作中的应用',
    content: '随着人工智能技术的不断发展，AI在内容创作领域的应用越来越广泛。从自动生成文章到视频剪辑，AI正在改变内容创作者的工作方式。',
    summary: '介绍AI技术在内容创作中的应用',
    authorId: 'user1',
    authorName: '张三',
    status: 'published',
    tags: ['AI', '内容创作', '技术'],
    categoryId: 1,
    categoryName: '技术文章',
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T14:45:00Z',
    publishedAt: '2023-05-15T15:00:00Z',
    viewCount: 1250,
    likeCount: 87,
    commentCount: 23,
    coverImageUrl: 'https://example.com/images/ai-content.jpg',
    sourceMaterials: [1, 2]
  },
  {
    id: 2,
    title: '如何提高内容营销效果',
    content: '内容营销是现代企业推广的重要手段。要提高内容营销效果，需要关注目标受众、内容质量、发布渠道等多个方面。',
    summary: '分享提高内容营销效果的方法',
    authorId: 'user2',
    authorName: '李四',
    status: 'approved',
    tags: ['内容营销', '推广', '策略'],
    categoryId: 2,
    categoryName: '营销策略',
    createdAt: '2023-05-18T09:15:00Z',
    updatedAt: '2023-05-18T16:20:00Z',
    viewCount: 890,
    likeCount: 42,
    commentCount: 15,
    coverImageUrl: 'https://example.com/images/marketing.jpg'
  },
  {
    id: 3,
    title: '社交媒体内容创作技巧',
    content: '在社交媒体平台上创作吸引人的内容需要掌握一些技巧。包括视觉设计、文案撰写、发布时间等多个要素。',
    summary: '社交媒体内容创作的实用技巧',
    authorId: 'user3',
    authorName: '王五',
    status: 'submitted',
    tags: ['社交媒体', '内容创作', '技巧'],
    categoryId: 3,
    categoryName: '创作技巧',
    createdAt: '2023-05-20T14:30:00Z',
    updatedAt: '2023-05-20T14:30:00Z',
    viewCount: 0,
    likeCount: 0,
    commentCount: 0
  },
  {
    id: 4,
    title: '视频内容制作趋势分析',
    content: '视频内容在近年来呈现爆发式增长。从短视频到直播，各种形式的视频内容都在吸引着大量用户。',
    summary: '分析当前视频内容制作的趋势',
    authorId: 'user1',
    authorName: '张三',
    status: 'draft',
    tags: ['视频', '趋势', '分析'],
    categoryId: 4,
    categoryName: '行业分析',
    createdAt: '2023-05-22T11:20:00Z',
    updatedAt: '2023-05-22T11:20:00Z'
  }
];

let nextId = 5;

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get content list
 * @param params Query parameters
 * @returns Paginated content list
 */
export const getContents = async (params: ContentQueryParams) => {
  await delay(500); // Simulate network delay
  
  const { page = 1, size = 10, status, search } = params;
  
  // Filter contents based on parameters
  let filteredContents = [...mockContents];
  
  if (status) {
    filteredContents = filteredContents.filter(content => content.status === status);
  }
  
  if (search) {
    filteredContents = filteredContents.filter(content => 
      content.title.includes(search) || 
      content.content.includes(search) ||
      (content.tags && content.tags.some(tag => tag.includes(search)))
    );
  }
  
  // Sort by createdAt descending
  filteredContents.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Paginate
  const start = (page - 1) * size;
  const end = start + size;
  const paginatedContents = filteredContents.slice(start, end);
  
  return {
    content: paginatedContents,
    totalElements: filteredContents.length,
    totalPages: Math.ceil(filteredContents.length / size),
    size,
    number: page
  };
};

/**
 * Get content by ID
 * @param id Content ID
 * @returns Content details
 */
export const getContentById = async (id: number) => {
  await delay(300);
  const content = mockContents.find(c => c.id === id);
  if (!content) {
    throw new Error('Content not found');
  }
  return content;
};

/**
 * Create new content
 * @param data Content data
 * @returns Created content
 */
export const createContent = async (data: ContentCreateRequest) => {
  await delay(500);
  
  const newContent: ContentDTO = {
    id: nextId++,
    ...data,
    authorId: 'currentUser',
    authorName: '当前用户',
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockContents.push(newContent);
  return newContent;
};

/**
 * Update content
 * @param id Content ID
 * @param data Update data
 * @returns Updated content
 */
export const updateContent = async (id: number, data: ContentUpdateRequest) => {
  await delay(500);
  
  const index = mockContents.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error('Content not found');
  }
  
  mockContents[index] = {
    ...mockContents[index],
    ...data,
    updatedAt: new Date().toISOString()
  };
  
  return mockContents[index];
};

/**
 * Delete content
 * @param id Content ID
 * @returns Operation result
 */
export const deleteContent = async (id: number) => {
  await delay(300);
  
  const index = mockContents.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error('Content not found');
  }
  
  mockContents.splice(index, 1);
  
  return {
    success: true,
    message: 'Content deleted successfully'
  };
};

/**
 * Batch delete contents
 * @param ids Content IDs
 * @returns Operation result
 */
export const batchDeleteContents = async (ids: number[]) => {
  await delay(500);
  
  const deletedCount = ids.filter(id => {
    const index = mockContents.findIndex(c => c.id === id);
    if (index !== -1) {
      mockContents.splice(index, 1);
      return true;
    }
    return false;
  }).length;
  
  return {
    success: true,
    message: `Successfully deleted ${deletedCount} contents`,
    deletedCount
  };
};

/**
 * Approve or reject content
 * @param data Approval data
 * @returns Updated content
 */
export const approveContent = async (data: ContentApprovalRequest) => {
  await delay(500);
  
  const { id, status, remark } = data;
  
  const index = mockContents.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error('Content not found');
  }
  
  mockContents[index] = {
    ...mockContents[index],
    status,
    updatedAt: new Date().toISOString(),
    ...(status === 'approved' && { publishedAt: new Date().toISOString() })
  };
  
  return mockContents[index];
};

/**
 * Get content statistics
 * @returns Statistics data
 */
export const getContentStatistics = async () => {
  await delay(500);
  
  const totalCount = mockContents.length;
  const byStatus: Record<string, number> = {};
  const byCategory: Record<string, number> = {};
  
  mockContents.forEach(content => {
    // Count by status
    byStatus[content.status] = (byStatus[content.status] || 0) + 1;
    
    // Count by category
    if (content.categoryName) {
      byCategory[content.categoryName] = (byCategory[content.categoryName] || 0) + 1;
    }
  });
  
  // Generate publish trend (last 7 days)
  const publishTrend = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const count = mockContents.filter(c => 
      c.publishedAt && c.publishedAt.toString().startsWith(dateStr)
    ).length;
    
    publishTrend.push({ date: dateStr, count });
  }
  
  // Get recent contents (last 5)
  const recentContents = [...mockContents]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  const statistics: ContentStatistics = {
    totalCount,
    byStatus,
    byCategory,
    publishTrend,
    recentContents
  };
  
  return statistics;
};