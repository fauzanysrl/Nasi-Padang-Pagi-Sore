import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, ConfigProvider, message } from 'antd';
import { MailOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import heroImage from '../../assets/image.png';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = await authService.login({
        email: values.email,
        password: values.password
      });
      // Store token and redirect
      login(data.token, data.user);
      message.success('Login successful!');
      navigate('/');
    } catch (error) {
      message.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#15803D',
          fontFamily: '"Poppins", sans-serif',
          colorTextBase: '#0F172A',
          colorTextSecondary: '#64748B',
          borderRadius: 12,
        },
      }}
    >
      <div className="flex min-h-screen bg-[#F8FAFC]">
        {/* Left Section - Hero Image */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-black overflow-hidden animate-fade-in">
          <img
            src={heroImage}
            alt="Pagi Sore Authentic Minang Culinary"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
          
          <div className="absolute bottom-12 left-12 right-12 z-10 animate-slide-up-delayed">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[24px] p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
              <h1 className="text-white text-4xl font-bold mb-2">Pagi Sore</h1>
              <p className="text-white/90 text-lg font-light">
                The Pinnacle of Authentic Minang Culinary Heritage.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 relative">
          <div className="w-full max-w-md bg-white rounded-[24px] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-slide-up">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#0F172A] mb-2">Welcome Back 👋</h2>
              <p className="text-[#64748B] text-base">
                Sign in to access the Pagi Sore Admin Dashboard.
              </p>
            </div>

            {/* Form */}
            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              layout="vertical"
              requiredMark={false}
              size="large"
            >
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Invalid email' }]}
              >
                <Input 
                  prefix={<MailOutlined className="text-gray-400 mr-2" />} 
                  placeholder="Enter your email" 
                  className="rounded-[12px] h-[48px] border-[#E2E8F0] hover:border-[#15803D] focus:border-[#15803D]"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400 mr-2" />}
                  placeholder="Enter your password"
                  className="rounded-[12px] h-[48px] border-[#E2E8F0] hover:border-[#15803D] focus:border-[#15803D]"
                />
              </Form.Item>

              <div className="flex items-center justify-between mb-6">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="text-[#64748B]">Remember me</Checkbox>
                </Form.Item>
                <Link className="text-[#15803D] hover:text-[#166534] font-medium transition-colors" to="/forgot-password">
                  Forgot Password?
                </Link>
              </div>

              <Form.Item className="mb-4">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  className="w-full h-[48px] rounded-[12px] bg-[#15803D] hover:bg-[#166534] border-none text-base font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <LoginOutlined className="group-hover:translate-x-1 transition-transform" /> Login to Dashboard
                </Button>
              </Form.Item>
              
              <div className="text-center mt-4">
                <span className="text-[#64748B]">Don't have an account? </span>
                <Link to="/register" className="text-[#15803D] hover:text-[#166534] font-medium transition-colors">
                  Register here
                </Link>
              </div>
            </Form>
          </div>

          {/* Footer */}
          <div className="absolute bottom-8 text-center text-sm text-[#94A3B8] animate-fade-in">
            <p className="mb-1">© 2026 Pagi Sore Management System</p>
            <div className="space-x-2">
              <a href="#" className="hover:text-[#64748B] transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-[#64748B] transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Login;
