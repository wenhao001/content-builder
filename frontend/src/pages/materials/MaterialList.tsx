import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Table,
  Button,
  Select,
  Card,
  Badge,
  Skeleton,
  Pagination,
  Typography,
  Space,
  message,
  Popconfirm,
  Input
} from 'antd';
import {
  getMaterials,
  deleteMaterial,
} from '@services/materialService';
import { MaterialDTO } from '../../types/material';
import { SearchFilter } from '@components/materials';

const { Title, Text } = Typography;
const { Option } = Select;

const MaterialList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    materialType: '',
    status: '',
  });
  const [materialToDelete, setMaterialToDelete] = useState<number | null>(null);

  // 获取素材列表数据
  const { data: materialData, isLoading, refetch } = useQuery({
    queryKey: ['materials', page, pageSize, searchParams],
    queryFn: () => getMaterials({
      page: page - 1, // API是从0开始的页码
      size: pageSize,
      ...searchParams
    }),
  });
  
  const data = materialData?.data;

  // 处理搜索和筛选
  const handleSearch = (params: typeof searchParams) => {
    setSearchParams(params);
    setPage(1); // 重置到第一页
  };

  // 执行删除操作
  const confirmDelete = async (id: number) => {
    try {
      await deleteMaterial(id);
      message.success('素材删除成功');
      refetch(); // 重新获取数据
    } catch (error) {
      message.error('素材删除失败');
      console.error('删除素材失败:', error);
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

  // 获取素材类型对应的图标
  const getMaterialTypeIcon = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'image':
        return 'fa-image';
      case 'video':
        return 'fa-video-camera';
      case 'audio':
        return 'fa-music';
      case 'text':
        return 'fa-file-text';
      default:
        return 'fa-file';
    }
  };

  return (
    <div>
      <div>
        <Title level={2}>素材管理</Title>
        <Text type="secondary">管理和查看所有上传的素材</Text>
      </div>

      <Card style={{ marginBottom: 24 }}>
        <SearchFilter onSearch={handleSearch} />
      </Card>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>素材列表</Title>
          <Space>
            <Text type="secondary">每页显示:</Text>
            <Select
              value={pageSize}
              onChange={setPageSize}
              style={{ width: 80 }}
            >
              <Option value={10}>10条</Option>
              <Option value={20}>20条</Option>
              <Option value={50}>50条</Option>
              <Option value={100}>100条</Option>
            </Select>
          </Space>
        </div>

        <Table
          dataSource={data?.content}
          loading={isLoading}
          rowKey="id"
          pagination={false}
          locale={{
            emptyText: (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ color: '#999', fontSize: 16, marginBottom: 16 }}>
                  没有找到素材
                </div>
                <Button type="primary">
                  <Link to="/materials/upload">上传素材</Link>
                </Button>
              </div>
            )
          }}
        >
          <Table.Column
            title="名称"
            key="name"
            render={(_, record: MaterialDTO) => (
              <Space>
                <div style={{ 
                  width: 40, 
                  height: 40, 
                  backgroundColor: '#f0f2ff', 
                  borderRadius: 8, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#3f51b5'
                }}>
                  <i className={`fa ${getMaterialTypeIcon(record.materialType)}`}></i>
                </div>
                <div>
                  <Link to={`/materials/${record.id}`} style={{ color: '#1890ff' }}>
                    {record.name}
                  </Link>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    {record.uploaderId}
                  </div>
                </div>
              </Space>
            )}
          />
          <Table.Column
            title="类型"
            key="type"
            render={(_, record: MaterialDTO) => (
              <Badge status="default" text={record.materialType} />
            )}
          />
          <Table.Column
            title="大小"
            key="size"
            render={(_, record: MaterialDTO) => formatFileSize(record.fileSize)}
          />
          <Table.Column
            title="上传时间"
            key="createdAt"
            render={(_, record: MaterialDTO) => 
              format(new Date(record.createdAt!), 'yyyy-MM-dd HH:mm')
            }
          />
          <Table.Column
            title="状态"
            key="status"
            render={(_, record: MaterialDTO) => (
              <Badge 
                status={
                  record.status === 'active' ? 'success' :
                  record.status === 'pending' ? 'processing' : 'default'
                } 
                text={
                  record.status === 'active' ? '已激活' :
                  record.status === 'pending' ? '待审核' : '已禁用'
                } 
              />
            )}
          />
          <Table.Column
            title="标签"
            key="tags"
            render={(_, record: MaterialDTO) => (
              <Space size="small">
                {record.tags?.split(',').map((tag) => (
                  <Badge key={tag} status="default" text={tag} />
                ))}
              </Space>
            )}
          />
          <Table.Column
            title="操作"
            key="actions"
            render={(_, record: MaterialDTO) => (
              <Space size="small">
                <Button type="link" size="small">
                  <Link to={`/materials/${record.id}`}>查看</Link>
                </Button>
                <Button type="link" size="small">
                  <Link to={`/materials/${record.id}/edit`}>编辑</Link>
                </Button>
                <Popconfirm
                  title="确认删除"
                  description="确定要删除此素材吗？此操作不可撤销。"
                  onConfirm={() => confirmDelete(record.id!)}
                  okText="确认"
                  cancelText="取消"
                >
                  <Button type="link" size="small" danger>
                    删除
                  </Button>
                </Popconfirm>
              </Space>
            )}
          />
        </Table>

        {/* 分页控件 */}
        {!isLoading && data && data.totalElements > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
            <Text type="secondary">
              显示 {Math.min((page - 1) * pageSize + 1, data?.totalElements || 0)} -
              {Math.min(page * pageSize, data?.totalElements || 0)} 条，共 {data?.totalElements || 0} 条
            </Text>
            <Pagination
              current={page}
              total={data?.totalElements || 0}
              pageSize={pageSize}
              onChange={setPage}
              showSizeChanger={false}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default MaterialList;