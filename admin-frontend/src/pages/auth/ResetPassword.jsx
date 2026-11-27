import React, { useState } from 'react';
import { Form, Input, Button, ConfigProvider, message } from 'antd';
import { LockOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import heroImage from '../../assets/image.png';
import { authService } from '../../services/authService';

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const onFinish = async (values) => {
    if (!token) {
      message.error('Invalid or missing reset token.');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, values.password);
      message.success('Password has been successfully reset. Please login.');
      navigate('/login');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to reset password. Token may be expired.');
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
            className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale-[30%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
          
          <div className="absolute bottom-12 left-12 right-12 z-10 animate-slide-up-delayed">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[24px] p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
              <h1 className="text-white text-4xl font-bold mb-2">Almost There</h1>
              <p className="text-white/90 text-lg font-light">
                Set up your new password to regain access to your account.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 relative">
          <div className="w-full max-w-md bg-white rounded-[24px] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-slide-up">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#0F172A] mb-2">Reset Password 🔄</h2>
              <p className="text-[#64748B] text-base">
                Please enter your new password below.
              </p>
            </div>

            {/* Form */}
            <Form
              name="reset_password"
              onFinish={onFinish}
              layout="vertical"
              requiredMark={false}
              size="large"
            >
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your new password!' }, { min: 6, message: 'Password must be at least 6 characters.' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400 mr-2" />}
                  placeholder="New Password"
                  className="rounded-[12px] h-[48px] border-[#E2E8F0] hover:border-[#15803D] focus:border-[#15803D]"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm your password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords that you entered do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400 mr-2" />}
                  placeholder="Confirm New Password"
                  className="rounded-[12px] h-[48px] border-[#E2E8F0] hover:border-[#15803D] focus:border-[#15803D]"
                />
              </Form.Item>

              <Form.Item className="mb-0 mt-6">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  className="w-full h-[48px] rounded-[12px] bg-[#15803D] hover:bg-[#166534] border-none text-base font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <SaveOutlined className="group-hover:scale-110 transition-transform" /> Save Password
                </Button>
              </Form.Item>
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

export default ResetPassword;
