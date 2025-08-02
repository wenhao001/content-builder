import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { uploadMaterial } from '@services/materialService';
import { Button, Card, Input, Select, Progress, Form, Typography, Upload, Space, message, Alert } from 'antd';
import { InboxOutlined, FileOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;



const MaterialUpload: React.FC = () => {
  const navigate = useNavigate();
  // 初始化表单
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  // 文件类型验证
  const allowedFileTypes = {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'],
    video: ['video/mp4', 'video/mpeg', 'video/quicktime'],
    audio: ['audio/mpeg', 'audio/wav', 'audio/mp3'],
    text: ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  };

  // 处理文件上传
  const uploadMutation = useMutation({
    mutationFn: (data: FormData) => uploadMaterial(data, (progress) => {
      setUploadProgress(Math.round(progress * 100));
    }),
    onSuccess: () => {
      message.success('素材上传成功');
      form.resetFields();
      setSelectedFile(null);
      setUploadProgress(0);
      navigate('/materials');
    },
    onError: (error: any) => {
      message.error(error.message || '素材上传失败，请重试');
      setUploadProgress(0);
      console.error('上传失败:', error);
    }
  });

  // 表单提交处理
  const onFinish = (values: any) => {
    if (!selectedFile) {
      message.error('请选择文件');
      return;
    }

    // 验证文件类型
    const fileType = values.materialType;
    if (!allowedFileTypes[fileType as keyof typeof allowedFileTypes].includes(selectedFile.type)) {
      message.error(`不支持的文件类型，请上传${fileType === 'image' ? '图片' : fileType === 'video' ? '视频' : fileType === 'audio' ? '音频' : '文本'}文件`);
      return;
    }

    // 验证文件大小 (100MB)
    if (selectedFile.size > 100 * 1024 * 1024) {
      message.error('文件大小不能超过100MB');
      return;
    }

    // 创建FormData
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('materialType', values.materialType);
    if (values.description) formData.append('description', values.description);
    if (values.tags) formData.append('tags', values.tags);
    formData.append('uploaderId', '1'); // 实际应用中应该从认证系统获取用户ID

    // 执行上传
    uploadMutation.mutate(formData);
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };



  return (
    <div>
      <Title level={2}>上传素材</Title>
      <Text type="secondary">请填写素材信息并上传文件</Text>

      <Card style={{ marginTop: 24 }}>
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            style={{ maxWidth: 800, margin: '0 auto' }}
          >
          {errorMessage && (
            <Alert
              message={errorMessage}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          {/* 文件上传区域 */}
          <Form.Item
            label="选择文件"
            name="file"
            rules={[{ required: true, message: '请选择文件' }]}
          >
            <Dragger
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
              maxCount={1}
              beforeUpload={(file) => {
                setSelectedFile(file);
                return false;
              }}
              onRemove={() => setSelectedFile(null)}
            >
              {selectedFile ? (
                <Space>
                  <FileOutlined style={{ fontSize: 24 }} />
                  <div>
                    <div>{selectedFile.name}</div>
                    <Text type="secondary">
                      {formatFileSize(selectedFile.size)} • {selectedFile.type}
                    </Text>
                  </div>
                </Space>
              ) : (
                <div>
                  <InboxOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                  <p className="ant-upload-text">拖放文件到此处或点击上传</p>
                  <p className="ant-upload-hint">支持图片、视频、音频和文本文件，最大100MB</p>
                </div>
              )}
            </Dragger>
          </Form.Item>

          {/* 上传进度 */}
          {uploadMutation.isPending && uploadProgress > 0 && (
            <div style={{ marginBottom: 16 }}>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Text>上传中...</Text>
                <Text>{uploadProgress}%</Text>
              </Space>
              <Progress percent={uploadProgress} />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* 素材类型 */}
            <Form.Item
              label="素材类型"
              name="materialType"
              rules={[{ required: true, message: '请选择素材类型' }]}
            >
              <Select placeholder="请选择类型">
                <Select.Option value="image">图片</Select.Option>
                <Select.Option value="video">视频</Select.Option>
                <Select.Option value="audio">音频</Select.Option>
                <Select.Option value="text">文本</Select.Option>
              </Select>
            </Form.Item>

            {/* 标签 */}
            <Form.Item label="标签" name="tags">
              <Input placeholder="输入标签，用逗号分隔" />
            </Form.Item>
          </div>

          {/* 描述 */}
          <Form.Item label="描述" name="description">
            <TextArea rows={4} placeholder="输入素材描述..." maxLength={500} showCount />
          </Form.Item>

          {/* 操作按钮 */}
          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => navigate('/materials')} disabled={uploadMutation.isPending}>
                取消
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={uploadMutation.isPending}
                disabled={!selectedFile}
              >
                确认上传
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default MaterialUpload;