import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { OtpInput } from '../components/OtpInput';
import { LoginRequest } from '../types';
import { LogIn, Mail, Lock, HeartHandshake, ArrowRight, ShieldCheck, Truck, Building2, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'DONOR' | 'NGO' | 'ADMIN' | 'VOLUNTEER'>('DONOR');

  // OTP State
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loginEmail, setLoginEmail] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginRequest>();

  const handleRoleSelect = (role: 'DONOR' | 'NGO' | 'ADMIN' | 'VOLUNTEER') => {
    setSelectedRole(role);
    // Auto-fill demo credentials for seamless testing
    if (role === 'DONOR') {
      setValue('email', 'priya.patel@gmail.com');
      setValue('password', 'donor123');
    } else if (role === 'NGO') {
      setValue('email', 'contact@goonj.org');
      setValue('password', 'password123');
    } else if (role === 'ADMIN') {
      setValue('email', 'admin@donateconnect.in');
      setValue('password', 'admin123');
    } else if (role === 'VOLUNTEER') {
      setValue('email', 'delivery@example.com');
      setValue('password', 'driver123');
    }
  };

  const onSubmit = async (data: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await login(data);
      if (res && res.requiresOtp) {
        setShowOtp(true);
        setLoginEmail(data.email);
      } else {
        routeUser(res?.user);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await verifyOtp({ email: loginEmail, otp: otpCode });
      routeUser(user);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const routeUser = (user: any) => {
    if (user.role === 'DONOR') {
      navigate('/donations');
    } else if (user.role === 'NGO') {
      navigate('/ngo-dashboard');
    } else if (user.role === 'ADMIN') {
      navigate('/admin');
    } else if (user.role === 'VOLUNTEER') {
      navigate('/driver-dashboard');
    } else if (user.role === 'CORPORATE') {
      navigate('/csr-dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-4 sm:py-8 px-1 sm:px-0">
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 sm:p-8 shadow-sm">
        {/* Branding & Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#7567E8]/10 border border-[#7567E8]/20 text-[#7567E8] flex items-center justify-center mx-auto mb-3 shadow-xs">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
            {showOtp
              ? 'Verify OTP'
              : selectedRole === 'ADMIN'
              ? 'Admin Sign In'
              : selectedRole === 'NGO'
              ? 'NGO Partner Sign In'
              : selectedRole === 'VOLUNTEER'
              ? 'Driver Sign In'
              : 'Welcome Back'}
          </h1>
          <p className="text-[#6B7280] text-xs sm:text-sm mt-1">
            {showOtp
              ? `Enter the 6-digit code sent to ${loginEmail}`
              : 'Sign in to access your DonateConnect account'}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {!showOtp ? (
          <>
            {/* Mobile Thumb-Friendly Role Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-[#F9FAFB] rounded-2xl mb-6 border border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => handleRoleSelect('DONOR')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-2 text-xs font-bold rounded-xl transition-all min-h-[44px] active:scale-95 ${
                  selectedRole === 'DONOR'
                    ? 'bg-[#7567E8] text-white shadow-xs'
                    : 'text-[#4B5563] hover:text-[#111827]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Donor
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('NGO')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-2 text-xs font-bold rounded-xl transition-all min-h-[44px] active:scale-95 ${
                  selectedRole === 'NGO'
                    ? 'bg-[#7567E8] text-white shadow-xs'
                    : 'text-[#4B5563] hover:text-[#111827]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                NGO
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('VOLUNTEER')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-2 text-xs font-bold rounded-xl transition-all min-h-[44px] active:scale-95 ${
                  selectedRole === 'VOLUNTEER'
                    ? 'bg-[#7567E8] text-white shadow-xs'
                    : 'text-[#4B5563] hover:text-[#111827]'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                Driver
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('ADMIN')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-2 text-xs font-bold rounded-xl transition-all min-h-[44px] active:scale-95 ${
                  selectedRole === 'ADMIN'
                    ? 'bg-[#7567E8] text-white shadow-xs'
                    : 'text-[#4B5563] hover:text-[#111827]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="name@example.com"
                    {...register('email', { required: 'Email is required' })}
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-10 pr-4 h-12 text-sm sm:text-base text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#7567E8] transition-colors"
                  />
                </div>
                {errors.email && (
                  <p className="text-[#DC2626] text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    {...register('password', { required: 'Password is required' })}
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-10 pr-4 h-12 text-sm sm:text-base text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#7567E8] transition-colors"
                  />
                </div>
                {errors.password && (
                  <p className="text-[#DC2626] text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 px-4 rounded-xl bg-[#7567E8] hover:bg-[#7567E8]/90 text-white font-bold text-sm shadow-md shadow-[#7567E8]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4 text-white" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-6 pt-5 border-t border-[#E5E7EB]">
              <p className="text-xs text-[#6B7280]">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-[#7567E8] font-bold hover:underline inline-flex items-center gap-0.5"
                >
                  Register as Donor <ArrowRight className="w-3 h-3 ml-0.5" />
                </Link>
              </p>
            </div>
          </>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-2 text-center">
                6-Digit Security OTP
              </label>
              <div className="pt-1">
                <OtpInput value={otpCode} onChange={setOtpCode} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otpCode.length !== 6}
              className="w-full h-12 px-4 rounded-xl bg-[#7567E8] hover:bg-[#7567E8]/90 text-white font-bold text-sm shadow-md shadow-[#7567E8]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Verify & Continue'
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowOtp(false);
                setError(null);
              }}
              className="w-full h-12 px-4 rounded-xl bg-white hover:bg-[#F4F2FA] text-[#4B5563] font-bold text-sm transition-all flex items-center justify-center border border-[#E5E7EB] active:scale-[0.98]"
            >
              Cancel & Go Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
