import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="w-full max-w-md mx-auto py-8 sm:py-16 px-2 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-[#FEE2E2] border border-[#FECACA] text-[#DC2626] flex items-center justify-center mx-auto shadow-xs">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">Access Restricted</h1>
        <p className="text-[#6B7280] text-xs sm:text-sm leading-relaxed mt-2 max-w-xs mx-auto">
          You do not have the required permissions to view this console. Please sign in with an authorized role account.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
        <Link
          to="/"
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#7567E8] hover:bg-[#7567E8]/90 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 min-h-[44px] shadow-xs active:scale-95"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
        <Link
          to="/login"
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-[#F4F2FA] text-[#4B5563] font-bold text-xs border border-[#E5E7EB] transition-colors flex items-center justify-center gap-2 min-h-[44px] shadow-xs active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Switch Account
        </Link>
      </div>
    </div>
  );
};
