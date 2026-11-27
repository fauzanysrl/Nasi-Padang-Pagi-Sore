import React, { useState } from 'react';
import { Form, Input, Button, ConfigProvider, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, UserAddOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import heroImage from '../../assets/image.png';
import { authService } from '../../services/authService';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await authService.register({
        name: values.name,
        email: values.email,
        password: values.password
      });
      message.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      message.error(error.response?.data?.message || 'Registration failed. Please try again.');
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
              <h1 className="text-white text-4xl font-bold mb-2">Join Pagi Sore</h1>
              <p className="text-white/90 text-lg font-light">
                Become part of our authentic culinary journey and manage with excellence.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Register Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 relative">
          <div className="w-full max-w-md bg-white rounded-[24px] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-slide-up">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#0F172A] mb-2">Create Account ✨</h2>
              <p className="text-[#64748B] text-base">
                Sign up to start managing your restaurant.
              </p>
            </div>

            {/* Form */}
            <Form
              name="register"
              onFinish={onFinish}
              layout="vertical"
              requiredMark={false}
              size="large"
            >
              <Form.Item
                name="name"
                rules={[{ required: true, message: 'Please input your full name!' }]}
              >
                <Input 
                  prefix={<UserOutlined className="text-gray-400 mr-2" />} 
                  placeholder="Full Name" 
                  className="rounded-[12px] h-[48px] border-[#E2E8F0] hover:border-[#15803D] focus:border-[#15803D]"
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Invalid email' }]}
              >
                <Input 
                  prefix={<MailOutlined className="text-gray-400 mr-2" />} 
                  placeholder="Email Address" 
                  className="rounded-[12px] h-[48px] border-[#E2E8F0] hover:border-[#15803D] focus:border-[#15803D]"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }, { min: 6, message: 'Password must be at least 6 characters.' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400 mr-2" />}
                  placeholder="Create Password"
                  className="rounded-[12px] h-[48px] border-[#E2E8F0] hover:border-[#15803D] focus:border-[#15803D]"
                />
              </Form.Item>

              <Form.Item className="mb-4 mt-6">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  className="w-full h-[48px] rounded-[12px] bg-[#15803D] hover:bg-[#166534] border-none text-base font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <UserAddOutlined className="group-hover:scale-110 transition-transform" /> Register
                </Button>
              </Form.Item>
              
              <div className="text-center mt-4">
                <span className="text-[#64748B]">Already have an account? </span>
                <Link to="/login" className="text-[#15803D] hover:text-[#166534] font-medium transition-colors">
                  Sign in instead
                </Link>
              </div>
            </Form>
          </div>

          {/* Footer */}
          <div className="absolute bottom-8 text-center text-sm text-[#94A3B8] animate-fade-in">
            <p className="mb-1">© 2026 Pagi Sore Management System</p>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Register;
