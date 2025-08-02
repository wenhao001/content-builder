// Mock AI content generation service

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock AI-generated content templates
const aiContentTemplates = [
  {
    title: 'AI生成文章示例1',
    content: '这是由AI生成的第一篇文章内容。AI技术正在快速发展，为内容创作带来了新的可能性。通过深度学习和自然语言处理技术，AI能够理解人类语言并生成高质量的文本内容。',
    summary: 'AI技术在内容创作领域的应用示例',
    tags: ['AI', '技术', '内容创作']
  },
  {
    title: 'AI生成文章示例2',
    content: '人工智能在现代内容创作中的作用越来越重要。它不仅可以帮助创作者提高效率，还能激发新的创意灵感。AI辅助创作工具正在改变内容创作者的工作方式。',
    summary: '探讨AI在现代内容创作中的重要作用',
    tags: ['人工智能', '内容创作', '效率']
  },
  {
    title: 'AI生成文章示例3',
    content: '随着机器学习算法的不断进步，AI生成内容的质量也在不断提升。现在的AI已经能够生成具有逻辑性和连贯性的文章，甚至可以模仿特定作者的写作风格。',
    summary: 'AI内容生成技术的发展现状',
    tags: ['机器学习', '内容质量', '写作风格']
  }
];

/**
 * Generate content using AI
 * @param prompt User prompt for content generation
 * @param options Generation options
 * @returns Generated content
 */
export const generateContent = async (prompt: string, options?: { length?: 'short' | 'medium' | 'long' }) => {
  await delay(2000); // Simulate AI processing time
  
  // Select a random template
  const template = aiContentTemplates[Math.floor(Math.random() * aiContentTemplates.length)];
  
  // Customize the content based on the prompt
  const generatedContent = {
    ...template,
    title: `${prompt} - ${template.title}`,
    content: `${template.content} 这是根据您的要求"${prompt}"生成的内容。`,
    createdAt: new Date().toISOString()
  };
  
  return generatedContent;
};

/**
 * Get AI content generation history
 * @returns List of previously generated content
 */
export const getGenerationHistory = async () => {
  await delay(500);
  
  // In a real implementation, this would fetch from a database
  // For mocking, we'll return a fixed list
  return [
    {
      id: 'ai-1',
      prompt: '科技发展',
      title: '科技发展 - AI生成文章示例1',
      createdAt: '2023-05-20T10:30:00Z',
      status: 'completed'
    },
    {
      id: 'ai-2',
      prompt: '环保主题',
      title: '环保主题 - AI生成文章示例2',
      createdAt: '2023-05-19T14:15:00Z',
      status: 'completed'
    }
  ];
};

/**
 * Get AI content by ID
 * @param id Content ID
 * @returns Generated content details
 */
export const getGeneratedContent = async (id: string) => {
  await delay(300);
  
  // In a real implementation, this would fetch from a database
  // For mocking, we'll return a fixed item with some variations
  return {
    id,
    prompt: '用户输入的提示词',
    title: `AI生成内容-${id}`,
    content: '这是由AI生成的详细内容。内容包括多个段落，展示了AI在文本生成方面的强大能力。AI能够根据用户提供的提示词生成相关且连贯的文章内容。',
    summary: 'AI生成内容的摘要信息',
    tags: ['AI', '内容生成', '示例'],
    createdAt: new Date().toISOString(),
    status: 'completed'
  };
};