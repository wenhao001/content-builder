import React, { useState, useEffect } from 'react';
import { Button, Card, List, Space, Tag, Typography, Modal, message } from 'antd';
import { getContents, deleteContent, approveContent } from '@mock/contentService';
import type { ContentDTO } from '@types/content';
import { createStyles } from 'antd-style';

const { Title, Text, Paragraph } = Typography;

// 使用 antd-style 创建样式
const useStyles = createStyles(({ token }) => ({
  container: {
    marginTop: 24,
  },
  description: {
    marginTop: 8,
  },
  modalContent: {
    marginBottom: 16,
  },
  contentTags: {
    marginTop: 24,
  },
  contentMeta: {
    marginTop: 24,
  },
}));

const ContentList: React.FC = () => {
  const [contents, setContents] = useState<ContentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<ContentDTO | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  
  // 使用 antd-style 样式
  const { styles } = useStyles();

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const data = await getContents();
        setContents(data);
      } catch (error) {
        console.error('Failed to fetch contents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, []);

  const handleViewDetail = (content: ContentDTO) => {
    setSelectedContent(content);
    setDetailModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContent(id);
      setContents(contents.filter(content => content.id !== id));
      message.success('内容删除成功');
    } catch (error) {
      console.error('Failed to delete content:', error);
      message.error('内容删除失败');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveContent(id, { status: 'approved' });
      setContents(contents.map(content => 
        content.id === id ? { ...content, status: 'approved' } : content
      ));
      message.success('内容审核通过');
    } catch (error) {
      console.error('Failed to approve content:', error);
      message.error('内容审核失败');
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'default';
      case 'pending': return 'orange';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'published': return 'blue';
      default: return 'default';
    }
  };

  const statusText = (status: string) => {
    switch (status) {
      case 'draft': return '草稿';
      case 'pending': return '待审核';
      case 'approved': return '已通过';
      case 'rejected': return '已拒绝';
      case 'published': return '已发布';
      default: return status;
    }
  };

  return (
    <div>
      <Title level={2}>内容列表</Title>
      <Text>管理系统中的所有内容</Text>
      
      <Card className={styles.container}>
        <List
          loading={loading}
          dataSource={contents}
          renderItem={item => (
            <List.Item
              key={item.id}
              actions={[
                <Button type="link" onClick={() => handleViewDetail(item)}>
                  查看
                </Button>,
                <Button type="link" onClick={() => handleApprove(item.id)} disabled={item.status === 'approved' || item.status === 'published'}>
                  审核通过
                </Button>,
                <Button type="link" danger onClick={() => handleDelete(item.id)}>
                  删除
                </Button>
              ]}
            >
              <List.Item.Meta
                title={item.title}
                description={
                  <div>
                    <div>{item.summary}</div>
                    <Space className={styles.description}>
                      <Tag color="blue">{item.category}</Tag>
                      <Tag color={statusColor(item.status)}>
                        {statusText(item.status)}
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
      
      <Modal
        title="内容详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedContent && (
          <div>
            <Title level={4}>{selectedContent.title}</Title>
            <Space className={styles.modalContent}>
              <Tag color="blue">{selectedContent.category}</Tag>
              <Tag color={statusColor(selectedContent.status)}>
                {statusText(selectedContent.status)}
              </Tag>
            </Space>
            <Paragraph>
              <blockquote>{selectedContent.summary}</blockquote>
            </Paragraph>
            <Paragraph>
              {selectedContent.content}
            </Paragraph>
            <div className={styles.contentTags}>
              <Space>
                {selectedContent.tags?.map((tag, index) => (
                  <Button key={index} type="dashed" size="small">
                    {tag}
                  </Button>
                ))}
              </Space>
            </div>
            <div className={styles.contentMeta}>
              <Text type="secondary">创建时间: {new Date(selectedContent.createdAt).toLocaleString()}</Text>
              {selectedContent.updatedAt && (
                <Text className={styles.updateTime} type="secondary">
                  更新时间: {new Date(selectedContent.updatedAt).toLocaleString()}
                </Text>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ContentList;