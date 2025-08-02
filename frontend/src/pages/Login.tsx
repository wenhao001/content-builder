import React, { useState } from 'react';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '@mock/userService';
import { useNavigate } from 'react-router-dom';
import { createStyles } from 'antd-style';

const { Title } = Typography;

// 使用 antd-style 创建样式
const useStyles = createStyles(({ token }) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#f0f2f5',
  },
  card: {
    width: 400,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  testAccount: {
    textAlign: 'center',
  },
}));

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // 使用 antd-style 样式
  const { styles } = useStyles();

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success('登录成功');
      navigate('/');
    } catch (error: any) {
      console.error('Login failed:', error);
      message.error(error.message || '登录失败，请检查邮箱和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.title}>
          <Title level={3}>内容平台</Title>
          <p>请使用您的账户登录</p>
        </div>
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<LoginForm>
            name="email"
            rules={[{ required: true, message: '请输入邮箱!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="邮箱" />
          </Form.Item>

          <Form.Item<LoginForm>
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
          
          <div className={styles.testAccount}>
            <p>测试账户:</p>
            <p>zhangsan@example.com / password</p>
            <p>lisi@example.com / password</p>
            <p>wangwu@example.com / password</p>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;