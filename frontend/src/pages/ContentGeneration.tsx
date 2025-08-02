import React, { useState } from 'react';
import { Button, Card, Form, Input, Space, Spin, Typography } from 'antd';
import { generateContent } from '@mock/aiService';
import type { FormProps } from 'antd';
import { createStyles } from 'antd-style';

const { Title, Paragraph } = Typography;

// 使用 antd-style 创建样式
const useStyles = createStyles(({ token }) => ({
  container: {
    marginBottom: 24,
  },
  errorCard: {
    marginBottom: 24,
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '40px',
  },
  contentTags: {
    marginTop: 24,
  },
  contentActions: {
    marginTop: 24,
  },
}));

interface ContentForm {
  prompt: string;
  length: 'short' | 'medium' | 'long';
}

const ContentGeneration: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // 使用 antd-style 样式
  const { styles } = useStyles();

  const onFinish: FormProps<ContentForm>['onFinish'] = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const content = await generateContent(values.prompt, { length: values.length });
      setGeneratedContent(content);
    } catch (err) {
      setError('内容生成失败，请稍后重试');
      console.error('Failed to generate content:', err);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed: FormProps<ContentForm>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div>
      <Title level={2}>AI内容创作</Title>
      <Paragraph>使用AI技术快速生成高质量内容</Paragraph>
      
      <Card className={styles.container}>
        <Form
          form={form}
          name="contentGeneration"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item<ContentForm>
            label="内容主题"
            name="prompt"
            rules={[{ required: true, message: '请输入内容主题!' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入您想要生成内容的主题或关键词" />
          </Form.Item>
          
          <Form.Item<ContentForm>
            label="内容长度"
            name="length"
            initialValue="medium"
          >
            <Space>
              <Button type={form.getFieldValue('length') === 'short' ? 'primary' : 'default'} 
                onClick={() => form.setFieldsValue({ length: 'short' })}>
                短
              </Button>
              <Button type={form.getFieldValue('length') === 'medium' ? 'primary' : 'default'} 
                onClick={() => form.setFieldsValue({ length: 'medium' })}>
                中
              </Button>
              <Button type={form.getFieldValue('length') === 'long' ? 'primary' : 'default'} 
                onClick={() => form.setFieldsValue({ length: 'long' })}>
                长
              </Button>
            </Space>
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              生成内容
            </Button>
          </Form.Item>
        </Form>
      </Card>
      
      {error && (
        <Card className={styles.errorCard}>
          <Typography.Text type="danger">{error}</Typography.Text>
        </Card>
      )}
      
      {loading && (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
          <p>AI正在生成内容，请稍候...</p>
        </div>
      )}
      
      {generatedContent && !loading && (
        <Card title="生成的内容">
          <Title level={4}>{generatedContent.title}</Title>
          <Paragraph>
            <blockquote>{generatedContent.summary}</blockquote>
          </Paragraph>
          <Paragraph>
            {generatedContent.content}
          </Paragraph>
          <div className={styles.contentTags}>
            <Space>
              {generatedContent.tags?.map((tag: string, index: number) => (
                <Button key={index} type="dashed" size="small">
                  {tag}
                </Button>
              ))}
            </Space>
          </div>
          <div className={styles.contentActions}>
            <Space>
              <Button type="primary">保存内容</Button>
              <Button>重新生成</Button>
              <Button>导出</Button>
            </Space>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ContentGeneration;