import React, { useState } from 'react';
import { Card, Button, Form, Input, Alert, Typography, Select } from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

const Settings: React.FC = () => {
  const [form] = Form.useForm();
  const [successMessage, setSuccessMessage] = useState('');
  
  const initialValues = {
    siteName: '内容构建平台',
    contactEmail: 'admin@example.com',
    pageSize: 10
  };
  
  const handleSubmit = (values: any) => {
    // In a real app, you would save these settings to a database
    console.log('Saving settings:', values);
    setSuccessMessage('设置已保存');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  return (
    <div>
      <div>
        <Title level={2}>系统设置</Title>
        <Text type="secondary">配置和管理系统的全局设置</Text>
      </div>
      
      <Card>
        {successMessage && (
          <Alert
            message={successMessage}
            type="success"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={initialValues}
          style={{ maxWidth: 800 }}
        >
          <Form.Item
            label="站点名称"
            name="siteName"
            rules={[{ required: true, message: '请输入站点名称' }]}
          >
            <Input placeholder="请输入站点名称" />
          </Form.Item>
          
          <Form.Item
            label="联系邮箱"
            name="contactEmail"
            rules={[{ 
              required: true, 
              type: 'email', 
              message: '请输入有效的邮箱地址' 
            }]}
          >
            <Input placeholder="请输入联系邮箱" />
          </Form.Item>
          
          <Form.Item
            label="每页显示条数"
            name="pageSize"
            rules={[{ required: true, message: '请选择每页显示条数' }]}
          >
            <Select placeholder="请选择每页显示条数">
              <Option value={10}>10条/页</Option>
              <Option value={20}>20条/页</Option>
              <Option value={50}>50条/页</Option>
              <Option value={100}>100条/页</Option>
            </Select>
          </Form.Item>
          
          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Button type="primary" htmlType="submit">
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Settings;