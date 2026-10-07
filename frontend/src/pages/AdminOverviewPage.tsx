import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats, getPendingUsers, approveUser } from '../api/adminApi';
import { AdminStats, User } from '../types';
import { Shield, Building2, PackageCheck, Clock, CheckCircle2, RefreshCw, ArrowRight, Layers, UserCheck, Loader2 } from 'lucide-react';

export const AdminOverviewPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, pendingData] = await Promise.all([
        getAdminStats(),
        getPendingUsers(),
      ]);
      setStats(statsData);
      setPendingUsers(pendingData);
    } catch (err: any) {
      setError(err.message || 'Failed to load admin statistics.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    setActionLoading(userId);
    try {
      await approveUser(userId);
      setPendingUsers(pendingUsers.filter((u) => u.id !== userId));
    } catch (err: any) {
      alert(err.message || 'Failed to approve user');
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6 py-3 sm:py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#111827] tracking-tight flex items-center gap-2.5">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-[#7567E8]" />
            Admin Overview
          </h1>
          <p className="text-[#6B7280] text-xs sm:text-sm mt-0.5">
            Platform statistics, partner verifications, and user account approvals
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-white text-[#4B5563] hover:text-[#111827] hover:bg-[#F4F2FA] transition-colors border border-[#E5E7EB] shadow-xs flex items-center gap-2 text-xs font-bold min-h-[44px] active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Stats
        </button>
      </div>

      {/* 4 Stat Cards: Compact 2x2 Grid on Mobile, 4-col on Desktop */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-[#E5E7EB] rounded-2xl p-4 h-28 animate-pulse shadow-xs" />
          ))}
        </div>
      ) : error ? (
        <div className="p-5 rounded-2xl bg-[#FEE2E2] border border-[#FCA5A5] text-center text-[#DC2626] space-y-2">
          <p className="font-semibold text-xs">{error}</p>
          <button
            onClick={fetchData}
            className="px-3.5 py-1.5 rounded-xl bg-[#DC2626] text-white text-xs font-bold"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {/* Total Donations */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-3.5 sm:p-5 shadow-xs flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#7567E8]/10 text-[#7567E8] flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-xl sm:text-2xl font-extrabold text-[#111827]">
                {stats?.totalDonations || 0}
              </span>
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#111827]">Total Donations</h3>
              <p className="text-[10px] text-[#6B7280]">Submitted requests</p>
            </div>
          </div>

          {/* Active/Verified NGOs */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-3.5 sm:p-5 shadow-xs flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl sm:text-2xl font-extrabold text-[#059669]">
                {stats?.verifiedNgos || 0}
              </span>
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#111827]">Verified NGOs</h3>
              <p className="text-[10px] text-[#6B7280]">Active non-profits</p>
            </div>
          </div>

          {/* Pending Requests */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-3.5 sm:p-5 shadow-xs flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-xl sm:text-2xl font-extrabold text-[#D97706]">
                {stats?.pendingRequests || 0}
              </span>
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#111827]">Pending Requests</h3>
              <p className="text-[10px] text-[#6B7280]">Awaiting response</p>
            </div>
          </div>

          {/* Completed Deliveries */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-3.5 sm:p-5 shadow-xs flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-xl sm:text-2xl font-extrabold text-[#0284C7]">
                {stats?.completedDeliveries || 0}
              </span>
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#111827]">Fulfilled</h3>
              <p className="text-[10px] text-[#6B7280]">Completed deliveries</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Link
          to="/admin/ngos"
          className="bg-white border border-[#E5E7EB] hover:border-[#7567E8]/40 rounded-2xl p-4 sm:p-5 transition-all flex items-center justify-between shadow-xs active:scale-[0.99]"
        >
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-extrabold text-[#111827] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#7567E8]" />
              Manage NGO Partners
            </h3>
            <p className="text-xs text-[#6B7280]">
              Create NGO accounts, toggle verified status, and manage partner accounts.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-[#9CA3AF] shrink-0 ml-3" />
        </Link>

        <Link
          to="/admin/donations"
          className="bg-white border border-[#E5E7EB] hover:border-[#7567E8]/40 rounded-2xl p-4 sm:p-5 transition-all flex items-center justify-between shadow-xs active:scale-[0.99]"
        >
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-extrabold text-[#111827] flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-[#7567E8]" />
              Audit All Donations
            </h3>
            <p className="text-xs text-[#6B7280]">
              Audit system-wide donations with filters for status, category, and partner.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-[#9CA3AF] shrink-0 ml-3" />
        </Link>
      </div>

      {/* Pending User Approvals Section */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#7567E8]/10 text-[#7567E8] flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#111827]">
              Pending User Approvals ({pendingUsers.length})
            </h2>
            <p className="text-xs text-[#6B7280]">
              Approve newly registered accounts requesting platform access
            </p>
          </div>
        </div>

        {loading ? (
          <div className="h-20 bg-[#F9FAFB] rounded-xl animate-pulse" />
        ) : pendingUsers.length === 0 ? (
          <div className="text-center py-8 bg-[#FAF8F5] rounded-2xl border border-[#E5E7EB]">
            <CheckCircle2 className="w-10 h-10 text-[#059669] mx-auto mb-2 opacity-60" />
            <p className="text-xs font-bold text-[#4B5563]">No pending account approvals</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {pendingUsers.map((u) => (
              <div
                key={u.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E7EB]"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-extrabold text-sm text-[#111827]">{u.fullName || 'Anonymous'}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#7567E8]/10 text-[#7567E8] border border-[#7567E8]/20">
                      {u.role}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7280]">
                    {u.email} • Joined {new Date(u.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleApprove(u.id)}
                  disabled={actionLoading === u.id}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#059669] hover:bg-[#059669]/90 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 min-h-[44px] shadow-xs active:scale-95"
                >
                  {actionLoading === u.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Approve Account
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
