import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Button, Card, Badge, Skeleton, Alert, Tabs, Input, Select, Form, Space, Typography, Modal, Spin } from 'antd';
import { getMaterialById, updateMaterial, deleteMaterial } from '@services/materialService';
import { generateDownloadUrl } from '@services/materialService';
import { MaterialDTO } from '../../types/material';
import { message } from 'antd';
import { ExclamationCircleOutlined, DownloadOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined, HistoryOutlined } from '@ant-design/icons';

const MaterialDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<MaterialDTO>>({});
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [form] = Form.useForm();

  // 获取素材详情
  const { data: materialData, isLoading, error } = useQuery({
    queryKey: ['material', id],
    queryFn: () => getMaterialById(Number(id)),
    enabled: !!id,
  });
  
  const material = materialData?.data;

  // 更新素材信息
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MaterialDTO> }) => updateMaterial(id, data),
    onSuccess: () => {
      messageApi.success('素材信息更新成功');
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['material', id] });
    },
    onError: (error: any) => {
      messageApi.error(error.message || '素材信息更新失败');
      console.error('更新素材失败:', error);
    },
    onSettled: () => {
      setUpdateLoading(false);
    }
  });

  // 删除素材
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteMaterial(id),
    onSuccess: () => {
      messageApi.success('素材删除成功');
      navigate('/materials');
    },
    onError: (error: any) => {
      messageApi.error(error.message || '素材删除失败');
      console.error('删除素材失败:', error);
    }
  });

  // 初始化编辑表单
  React.useEffect(() => {
    if (material) {
      setEditForm({
        name: material.name,
        description: material.description,
        tags: material.tags,
        status: material.status,
        materialType: material.materialType
      });
    }
  }, [material]);

  // 处理表单变更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // 处理编辑提交
  const handleEditSubmit = () => {
    if (!material || !id) return;

    setUpdateLoading(true);
    updateMutation.mutate({
      id: Number(id),
      data: editForm
    });
  };

  // 处理下载
  const handleDownload = async () => {
      if (!material || !id) return;

      setDownloadLoading(true);
      try {
        const response = await generateDownloadUrl(Number(id), '1'); // 用户ID应从认证系统获取
        window.open(response.data as string, '_blank');
      } catch (error: any) {
        messageApi.error(error.message || '生成下载链接失败');
        console.error('下载失败:', error);
      } finally {
        setDownloadLoading(false);
      }
    };

  // 处理删除
  const handleDelete = () => {
    if (!id) return;
    deleteMutation.mutate(Number(id));
  };

  // 获取素材类型图标
  const getMaterialTypeIcon = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'image': return 'fa-image';
      case 'video': return 'fa-video-camera';
      case 'audio': return 'fa-music';
      case 'text': return 'fa-file-text';
      default: return 'fa-file';
    }
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (error) {
    return (
      <div className="error-container">
        {contextHolder}
        <Alert
          message="获取素材详情失败"
          type="error"
          showIcon
          action={
            <Button type="default" onClick={() => navigate('/materials')}>
              返回素材列表
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="material-detail-page">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button
              type="default"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/materials')}
            >
              返回列表
            </Button>
            <Typography.Title level={2} style={{ margin: 0 }}>素材详情</Typography.Title>
          </div>
          <Space>
            {isEditing ? (
              <>
                <Button
                  onClick={() => setIsEditing(false)}
                  disabled={updateLoading}
                >
                  取消
                </Button>
                <Button
                  type="primary"
                  onClick={handleEditSubmit}
                  loading={updateLoading}
                >
                  保存
                </Button>
              </>
            ) : (
              <>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  删除
                </Button>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => setIsEditing(true)}
                >
                  编辑
                </Button>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={handleDownload}
                  loading={downloadLoading}
                >
                  下载
                </Button>
              </>
            )}
          </Space>
        </div>
      </div>

      <div className="material-detail-content">
        <div className="main-content">
          <Card style={{ marginBottom: 24 }}>
            <div className="material-header">
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <Skeleton.Avatar active size={64} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <Skeleton.Input active style={{ width: 256, height: 24 }} />
                    <Skeleton.Input active style={{ width: 160, height: 16 }} />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ backgroundColor: '#f0f5ff', padding: 16, borderRadius: 8 }}>
                    <i className={`fa ${getMaterialTypeIcon(material.materialType)} text-3xl`} style={{ color: '#1890ff' }}></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Typography.Title level={3} style={{ margin: 0 }}>
                      {isEditing ? (
                        <Input
                          name="name"
                          value={editForm.name || ''}
                          onChange={handleInputChange}
                          size="large"
                        />
                      ) : (
                        material.name
                      )}
                    </Typography.Title>
                    <Typography.Text type="secondary">
                      ID: {material?.id} • 上传于 {material?.createdAt ? format(new Date(material.createdAt), 'yyyy-MM-dd HH:mm') : 'N/A'}
                    </Typography.Text>
                  </div>
                  <Badge
                    status={
                      material.status === 'active' ? 'success' :
                      material.status === 'pending' ? 'warning' : 'error'
                    }
                    text={
                      material.status === 'active' ? '已激活' :
                      material.status === 'pending' ? '待审核' : '已禁用'
                    }
                  />
                </div>
              )}
            </div>
          </Card>

          <Tabs
              defaultActiveKey="overview"
           items={[
              {
                key: 'overview',
                label: '概览',
                children: (
                  <div style={{ marginTop: 16 }}>
                    <Card>
                      <div className="card-content">
                        {material?.materialType === 'image' && (
                          <div style={{ marginBottom: 24 }}>
                            {isLoading ? (
                              <Skeleton.Image active style={{ width: '100%', height: 320 }} />
                            ) : (
                              <img
                                src={material?.fileUrl}
                                alt={material?.name}
                                style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 8 }}
                                loading="lazy"
                              />
                            )}
                          </div>
                        )}

                        {material?.materialType === 'video' && (
                          <div style={{ marginBottom: 24 }}>
                            {isLoading ? (
                              <Skeleton.Image active style={{ width: '100%', height: 320 }} />
                            ) : (
                              <video
                                src={material?.fileUrl}
                                controls
                                style={{ width: '100%', maxHeight: 400, borderRadius: 8 }}
                              />
                            )}
                          </div>
                        )}

                        {material?.materialType === 'audio' && (
                          <div style={{ marginBottom: 24 }}>
                            {isLoading ? (
                              <Skeleton.Input active style={{ width: '100%', height: 80 }} />
                            ) : (
                              <audio
                                src={material?.fileUrl}
                                controls
                                style={{ width: '100%' }}
                              />
                            )}
                          </div>
                        )}

                        {material?.materialType === 'text' && (
                          <div style={{ marginBottom: 24, textAlign: 'center', padding: 48 }}>
                            {isLoading ? (
                              <Skeleton.Image active style={{ width: '100%', height: 320 }} />
                            ) : (
                              <div>
                                <i className={`fa ${getMaterialTypeIcon(material?.materialType || '')} text-5xl`} style={{ color: '#d9d9d9', marginBottom: 16 }}></i>
                                <Typography.Text type="secondary">文本文件预览无法显示，请下载查看</Typography.Text>
                              </div>
                            )}
                          </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                          <Form.Item label="素材类型">
                            {isLoading ? (
                              <Skeleton.Input active style={{ width: 120 }} />
                            ) : isEditing ? (
                              <Select
                                value={editForm.materialType || ''}
                                onChange={(value) => setEditForm(prev => ({ ...prev, materialType: value }))}
                                style={{ width: 120 }}
                              >
                                <Select.Option value="image">图片</Select.Option>
                                <Select.Option value="video">视频</Select.Option>
                                <Select.Option value="audio">音频</Select.Option>
                                <Select.Option value="text">文本</Select.Option>
                              </Select>
                            ) : (
                              <Badge status="default" text={material?.materialType} />
                            )}
                          </Form.Item>

                          <Form.Item label="文件大小">
                            {isLoading ? (
                              <Skeleton.Input active style={{ width: 120 }} />
                            ) : (
                              <Typography.Text>{material?.fileSize ? formatFileSize(material.fileSize) : 'N/A'}</Typography.Text>
                            )}
                          </Form.Item>

                          <Form.Item label="文件类型">
                            {isLoading ? (
                              <Skeleton.Input active style={{ width: 160 }} />
                            ) : (
                              <Typography.Text>{material?.fileType || 'N/A'}</Typography.Text>
                            )}
                          </Form.Item>

                          <Form.Item label="下载次数">
                            {isLoading ? (
                              <Skeleton.Input active style={{ width: 120 }} />
                            ) : (
                              <Typography.Text>
                                {material?.downloadCount || 0} 次
                                {material?.lastDownloadTime && (
                                  <Typography.Text type="secondary" style={{ marginLeft: 8 }}>
                                    (最近: {format(new Date(material.lastDownloadTime), 'yyyy-MM-dd')})
                                  </Typography.Text>
                                )}
                              </Typography.Text>
                            )}
                          </Form.Item>

                          <Form.Item label="上传者">
                            {isLoading ? (
                              <Skeleton.Input active style={{ width: 120 }} />
                            ) : (
                              <Typography.Text>{material?.uploaderId || 'N/A'}</Typography.Text>
                            )}
                          </Form.Item>

                          <Form.Item label="状态">
                            {isLoading ? (
                              <Skeleton.Input active style={{ width: 120 }} />
                            ) : isEditing ? (
                              <Select
                                value={editForm.status || ''}
                                onChange={(value) => setEditForm(prev => ({ ...prev, status: value }))}
                                style={{ width: 120 }}
                              >
                                <Select.Option value="active">已激活</Select.Option>
                                <Select.Option value="pending">待审核</Select.Option>
                                <Select.Option value="disabled">已禁用</Select.Option>
                              </Select>
                            ) : (
                              <Badge
                                status={
                                  material?.status === 'active' ? 'success' :
                                  material?.status === 'pending' ? 'warning' : 'error'
                                }
                                text={
                                  material?.status === 'active' ? '已激活' :
                                  material?.status === 'pending' ? '待审核' : '已禁用'
                                }
                              />
                            )}
                          </Form.Item>
                        </div>

                        <Form.Item label="描述" style={{ marginTop: 24 }}>
                          {isLoading ? (
                            <Skeleton.Input active style={{ width: '100%', height: 128 }} />
                          ) : isEditing ? (
                            <Input.TextArea
                              value={editForm.description || ''}
                              onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                              rows={5}
                            />
                          ) : (
                            <Typography.Text>
                              {material?.description || <Typography.Text type="secondary" italic>无描述</Typography.Text>}
                            </Typography.Text>
                          )}
                        </Form.Item>

                        <Form.Item label="标签" style={{ marginTop: 24 }}>
                          {isLoading ? (
                            <Skeleton.Input active style={{ width: '100%' }} />
                          ) : isEditing ? (
                            <Input
                              value={editForm.tags || ''}
                              onChange={(e) => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
                              placeholder="输入标签，用逗号分隔"
                            />
                          ) : (
                            <Space wrap>
                              {material?.tags
                                ? material.tags.split(',').map((tag: string) => (
                                  <Badge key={tag} status="default" text={tag} />
                                ))
                                : <Typography.Text type="secondary" italic>无标签</Typography.Text>}
                            </Space>
                          )}
                        </Form.Item>
                  </div>
                </Card>
              </div>
            ) },
            { key: 'details', label: '详细信息', children: (
              <div style={{ marginTop: 16 }}>
                <Card>
                  <Form layout="horizontal">
                    <Form.Item label="创建时间">
                      {isLoading ? (
                        <Skeleton.Input active style={{ width: 200 }} />
                      ) : (
                        <Typography.Text>
                          {material?.createdAt ? format(new Date(material.createdAt), 'yyyy-MM-dd HH:mm:ss') : 'N/A'}
                        </Typography.Text>
                      )}
                    </Form.Item>

                    <Form.Item label="更新时间">
                      {isLoading ? (
                        <Skeleton.Input active style={{ width: 200 }} />
                      ) : (
                        <Typography.Text>
                          {material?.updatedAt ? format(new Date(material.updatedAt), 'yyyy-MM-dd HH:mm:ss') : 'N/A'}
                        </Typography.Text>
                      )}
                    </Form.Item>

                    <Form.Item label="文件URL">
                      {isLoading ? (
                        <Skeleton.Input active style={{ width: '100%' }} />
                      ) : (
                        <Typography.Link href={material?.fileUrl || '#'} target="_blank" rel="noopener noreferrer">
                            {material?.fileUrl || 'N/A'}
                          </Typography.Link>
                      )}
                    </Form.Item>

                    <Form.Item label="文件MD5">
                      {isLoading ? (
                        <Skeleton.Input active style={{ width: 320 }} />
                      ) : (
                        <Typography.Text style={{ fontFamily: 'monospace', fontSize: 12 }}>
                            {material?.md5Hash || '未设置'}
                          </Typography.Text>
                      )}
                    </Form.Item>
                  </Form>
                </Card>
              </div>
            ) },
            { key: 'usage', label: '使用记录', children: (
              <div style={{ marginTop: 16 }}>
                <Card>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {isLoading ? (
                      <>
                        <Skeleton.Input active style={{ width: '100%', height: 80 }} />
                        <Skeleton.Input active style={{ width: '100%', height: 80 }} />
                        <Skeleton.Input active style={{ width: '100%', height: 80 }} />
                      </>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '32px 0' }}>
                        <HistoryOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 8 }} />
                        <Typography.Text type="secondary">暂无使用记录</Typography.Text>
                      </div>
                    )}
                  </Space>
                </Card>
              </div>
            ) }
          ]}
          className="mb-6"
        />
        </div>
      </div>

      <Modal
        title="确认删除"
        open={deleteDialogOpen}
        onOk={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        okText="确认删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p>确定要删除此素材吗？此操作不可撤销。</p>
      </Modal>
    </div>
  );
};

export default MaterialDetail;