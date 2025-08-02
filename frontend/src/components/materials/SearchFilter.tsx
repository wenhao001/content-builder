import React, { useState } from 'react';
import { Input, Button, Select, Form, Space } from 'antd';

interface SearchFilterProps {
  onSearch: (filters: { keyword: string; type: string; status: string }) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');

  const handleSearch = () => {
    onSearch({ keyword, type, status });
  };

  const handleReset = () => {
    setKeyword('');
    setType('');
    setStatus('');
    onSearch({ keyword: '', type: '', status: '' });
  };

  return (
    <Form layout="inline" style={{ marginBottom: 16 }}>
      <Form.Item label="关键词" style={{ marginBottom: 8 }}>
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="请输入关键词"
          allowClear
        />
      </Form.Item>
      
      <Form.Item label="类型" style={{ marginBottom: 8 }}>
        <Select
          value={type}
          onChange={setType}
          placeholder="全部类型"
          style={{ width: 120 }}
        >
          <Select.Option value="">全部类型</Select.Option>
          <Select.Option value="image">图片</Select.Option>
          <Select.Option value="video">视频</Select.Option>
          <Select.Option value="audio">音频</Select.Option>
          <Select.Option value="text">文本</Select.Option>
        </Select>
      </Form.Item>
      
      <Form.Item label="状态" style={{ marginBottom: 8 }}>
        <Select
          value={status}
          onChange={setStatus}
          placeholder="全部状态"
          style={{ width: 120 }}
        >
          <Select.Option value="">全部状态</Select.Option>
          <Select.Option value="pending">待审核</Select.Option>
          <Select.Option value="approved">已通过</Select.Option>
          <Select.Option value="rejected">已拒绝</Select.Option>
        </Select>
      </Form.Item>
      
      <Form.Item style={{ marginBottom: 8 }}>
        <Space>
          <Button type="primary" onClick={handleSearch}>
            搜索
          </Button>
          <Button onClick={handleReset}>
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default SearchFilter;