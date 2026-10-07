import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, HeartHandshake, LogOut, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DonorProfilePage: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const initial = user.fullName
    ? user.fullName.charAt(0).toUpperCase()
    : user.email.charAt(0).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto py-3 sm:py-6 px-1 sm:px-0 space-y-4">
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 sm:p-8 shadow-xs space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 pb-5 border-b border-[#E5E7EB] text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-[#7567E8] flex items-center justify-center text-white font-extrabold text-3xl shadow-md shadow-[#7567E8]/20 shrink-0">
            {initial}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
              {user.fullName || 'Generous Donor'}
            </h1>
            <p className="text-xs text-[#6B7280] mt-0.5">{user.email}</p>
            <div className="mt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7567E8]/10 text-[#7567E8] font-bold text-[11px] uppercase tracking-wider border border-[#7567E8]/20">
                <Shield className="w-3.5 h-3.5" />
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E5E7EB] space-y-1">
            <div className="flex items-center gap-2 text-[#6B7280]">
              <User className="w-4 h-4 text-[#7567E8]" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Full Name</span>
            </div>
            <p className="text-sm sm:text-base font-bold text-[#111827] pl-6">
              {user.fullName || 'Not provided'}
            </p>
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E5E7EB] space-y-1">
            <div className="flex items-center gap-2 text-[#6B7280]">
              <Mail className="w-4 h-4 text-[#7567E8]" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Email Address</span>
            </div>
            <p className="text-sm sm:text-base font-bold text-[#111827] pl-6 truncate">
              {user.email}
            </p>
          </div>
        </div>

        {/* Actions (48px thumb buttons) */}
        <div className="pt-2 border-t border-[#E5E7EB] space-y-2.5">
          <Link
            to="/donations"
            className="w-full h-12 flex items-center justify-center gap-2 px-6 bg-[#7567E8] hover:bg-[#7567E8]/90 text-white font-bold rounded-xl transition-all shadow-xs active:scale-[0.98]"
          >
            <HeartHandshake className="w-4 h-4 text-white" />
            View My Donation History
          </Link>

          <button
            onClick={() => logout()}
            className="w-full h-12 flex items-center justify-center gap-2 px-6 bg-white hover:bg-[#FEE2E2] text-[#DC2626] font-bold rounded-xl transition-colors border border-[#FECACA] active:scale-[0.98]"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
