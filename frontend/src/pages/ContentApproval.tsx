import React, { useState, useEffect } from 'react';
import { Button, Card, List, Space, Tag, Typography } from 'antd';
import { getContents } from '@mock/contentService';
import type { ContentDTO } from '../types/content';
import { createStyles } from 'antd-style';

const { Title, Text } = Typography;

// 使用 antd-style 创建样式
const useStyles = createStyles(({ token }) => ({
  container: {
    marginTop: 24,
  },
  description: {
    marginTop: 8,
  },
}));

const ContentApproval: React.FC = () => {
  const [contents, setContents] = useState<ContentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 使用 antd-style 样式
  const { styles } = useStyles();

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const data = await getContents({ status: 'submitted' });
        setContents(data.content);
      } catch (error) {
        console.error('Failed to fetch contents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, []);

  const handleApprove = async (id: number) => {
    // In a real implementation, you would call the approve service
    console.log(`Approving content with id: ${id}`);
    // Update the UI to reflect the approval
    setContents(contents.map(content => 
      content.id === id ? { ...content, status: 'approved' } : content
    ));
  };

  const handleReject = async (id: number) => {
    // In a real implementation, you would call the reject service
    console.log(`Rejecting content with id: ${id}`);
    // Update the UI to reflect the rejection
    setContents(contents.map(content => 
      content.id === id ? { ...content, status: 'rejected' } : content
    ));
  };

  return (
    <div>
      <Title level={2}>内容审核</Title>
      <Text>审核待发布的内容</Text>
      
      <Card className={styles.container}>
        <List
          loading={loading}
          dataSource={contents}
          renderItem={item => (
            <List.Item
              key={item.id}
              actions={[
                <Button type="primary" onClick={() => handleApprove(item.id)}>
                  通过
                </Button>,
                <Button onClick={() => handleReject(item.id)}>
                  拒绝
                </Button>
              ]}
            >
              <List.Item.Meta
                title={item.title}
                description={
                  <div>
                    <div>{item.summary}</div>
                    <Space className={styles.description}>
                      <Tag color="blue">{item.categoryName}</Tag>
                      <Tag color={item.status === 'submitted' ? 'orange' : item.status === 'approved' ? 'green' : 'red'}>
                        {item.status === 'submitted' ? '待审核' : item.status === 'approved' ? '已通过' : '已拒绝'}
                      </Tag>
                      <Text type="secondary">创建时间: {new Date(item.createdAt).toLocaleString()}</Text>
                    </Space>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default ContentApproval;