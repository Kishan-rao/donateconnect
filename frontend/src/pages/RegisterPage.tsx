import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { OtpInput } from '../components/OtpInput';
import { RegisterRequest } from '../types';
import { UserPlus, Mail, Lock, User as UserIcon, HeartHandshake, ShieldAlert, ArrowRight, Building2, Truck, Phone, MapPin } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { registerDonor, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // OTP State
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<'DONOR' | 'VOLUNTEER' | 'NGO'>('DONOR');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>();

  const onSubmit = async (data: RegisterRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await registerDonor({ ...data, role: selectedRole });
      if (res && res.requiresOtp) {
        setShowOtp(true);
        setRegisterEmail(data.email);
      } else {
        navigate(selectedRole === 'DONOR' ? '/donations' : '/driver-dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await verifyOtp({ email: registerEmail, otp: otpCode });
      navigate(selectedRole === 'DONOR' ? '/donations' : '/driver-dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid OTP code.');
    } finally {
      setLoading(false);
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
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">Create Account</h1>
          <p className="text-[#6B7280] text-xs sm:text-sm mt-1">
            Join the DonateConnect community relief network
          </p>
        </div>

        <div className="mb-5 p-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] text-xs flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            Public registration is available for <strong>Donors</strong> and <strong>Delivery Partners</strong>. Verified NGO accounts require administrator approval.
          </span>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {!showOtp ? (
          <>
            {/* Mobile Thumb-Friendly Role Selector */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F9FAFB] rounded-2xl mb-6 border border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => setSelectedRole('DONOR')}
                className={`flex items-center justify-center gap-1 py-2.5 px-2 text-xs font-bold rounded-xl transition-all min-h-[44px] active:scale-95 ${
                  selectedRole === 'DONOR'
                    ? 'bg-[#7567E8] text-white shadow-xs'
                    : 'text-[#4B5563] hover:text-[#111827]'
                }`}
              >
                <UserIcon className="w-3.5 h-3.5" />
                Donor
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('VOLUNTEER')}
                className={`flex items-center justify-center gap-1 py-2.5 px-2 text-xs font-bold rounded-xl transition-all min-h-[44px] active:scale-95 ${
                  selectedRole === 'VOLUNTEER'
                    ? 'bg-[#7567E8] text-white shadow-xs'
                    : 'text-[#4B5563] hover:text-[#111827]'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                Delivery
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('NGO')}
                className={`flex items-center justify-center gap-1 py-2.5 px-2 text-xs font-bold rounded-xl transition-all min-h-[44px] active:scale-95 ${
                  selectedRole === 'NGO'
                    ? 'bg-[#7567E8] text-white shadow-xs'
                    : 'text-[#4B5563] hover:text-[#111827]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                NGO
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    {...register('fullName', { required: 'Full name is required' })}
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-10 pr-4 h-12 text-sm sm:text-base text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#7567E8] transition-colors"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-[#DC2626] text-xs mt-1">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="Enter your email address"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-10 pr-4 h-12 text-sm sm:text-base text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#7567E8] transition-colors"
                  />
                </div>
                {errors.email && (
                  <p className="text-[#DC2626] text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    autoComplete="new-password"
                    placeholder="Create a password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    })}
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-10 pr-4 h-12 text-sm sm:text-base text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#7567E8] transition-colors"
                  />
                </div>
                {errors.password && (
                  <p className="text-[#DC2626] text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              {selectedRole === 'NGO' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                      NGO Facility Address *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        autoComplete="street-address"
                        placeholder="Enter NGO facility address"
                        {...register('address', { required: selectedRole === 'NGO' ? 'Address is required' : false })}
                        className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-10 pr-4 h-12 text-sm sm:text-base text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#7567E8] transition-colors"
                      />
                    </div>
                    {errors.address && (
                      <p className="text-[#DC2626] text-xs mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                      Contact Phone *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        placeholder="Enter contact phone number"
                        {...register('phone', { required: selectedRole === 'NGO' ? 'Phone number is required' : false })}
                        className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-10 pr-4 h-12 text-sm sm:text-base text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#7567E8] transition-colors"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-[#DC2626] text-xs mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 px-4 rounded-xl bg-[#7567E8] hover:bg-[#7567E8]/90 text-white font-bold text-sm shadow-md shadow-[#7567E8]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Register Account
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-6 pt-5 border-t border-[#E5E7EB]">
              <p className="text-xs text-[#6B7280]">
                Already have an account?{' '}
                <Link to="/login" className="text-[#7567E8] font-bold hover:underline inline-flex items-center gap-0.5">
                  Sign In <ArrowRight className="w-3 h-3 ml-0.5" />
                </Link>
              </p>
            </div>
          </>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="text-center">
              <p className="text-xs text-[#4B5563]">
                Enter the 6-digit confirmation code sent to <strong className="text-[#111827]">{registerEmail}</strong>.
              </p>
            </div>
            <div>
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
                'Verify & Complete Registration'
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
              Go Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
