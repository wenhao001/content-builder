import React, { useState } from 'react';
import { Card, Button, Form, Input, Alert, Typography } from 'antd';

const { Title, Text } = Typography;

const Profile: React.FC = () => {
  const [form] = Form.useForm();
  const [successMessage, setSuccessMessage] = useState('');
  
  const initialValues = {
    name: '张三',
    email: 'zhangsan@example.com',
    department: '市场部',
    position: '内容运营专员'
  };
  
  const handleSubmit = (values: any) => {
    // In a real app, you would save these settings to a database
    console.log('Saving profile:', values);
    setSuccessMessage('个人信息已保存');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  return (
    <div>
      <div>
        <Title level={2}>个人资料</Title>
        <Text type="secondary">管理和编辑您的个人资料信息</Text>
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
            label="姓名"
            name="name"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          
          <Form.Item
            label="邮箱"
            name="email"
            rules={[{ 
              required: true, 
              type: 'email', 
              message: '请输入有效的邮箱地址' 
            }]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          
          <Form.Item
            label="部门"
            name="department"
            rules={[{ required: true, message: '请输入部门' }]}
          >
            <Input placeholder="请输入部门" />
          </Form.Item>
          
          <Form.Item
            label="职位"
            name="position"
            rules={[{ required: true, message: '请输入职位' }]}
          >
            <Input placeholder="请输入职位" />
          </Form.Item>
          
          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Button type="primary" htmlType="submit">
              保存信息
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;