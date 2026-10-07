import React, { useEffect, useState } from 'react';
import { getAdminDonations } from '../api/donationApi';
import { getVerifiedNgos } from '../api/ngoApi';
import { Donation, NGOProfile, PageResponse } from '../types';
import { formatDate } from '../utils/formatters';
import { MobileStatusBadge } from '../components/common/MobileStatusBadge';
import { PackageCheck, RefreshCw, ChevronLeft, ChevronRight, User, Building2, Tag, Calendar, Loader2 } from 'lucide-react';

export const AdminDonationsPage: React.FC = () => {
  const [pageData, setPageData] = useState<PageResponse<Donation> | null>(null);
  const [ngos, setNgos] = useState<NGOProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedNgoId, setSelectedNgoId] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const pageSize = 10;

  const fetchDonations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminDonations(
        selectedCategory || undefined,
        selectedStatus || undefined,
        selectedNgoId || undefined,
        page,
        pageSize
      );
      setPageData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load donations audit table.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVerifiedNgos().then(setNgos).catch(() => setNgos([]));
  }, []);

  useEffect(() => {
    fetchDonations();
  }, [selectedCategory, selectedStatus, selectedNgoId, page]);

  return (
    <div className="space-y-4 sm:space-y-6 py-3 sm:py-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#111827] tracking-tight flex items-center gap-2.5">
            <PackageCheck className="w-6 h-6 sm:w-8 sm:h-8 text-[#7567E8]" />
            All Donations Audit
          </h1>
          <p className="text-[#6B7280] text-xs sm:text-sm mt-0.5">
            Audit system-wide donation requests across all NGO partners
          </p>
        </div>

        <button
          onClick={fetchDonations}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-white text-[#4B5563] hover:text-[#111827] hover:bg-[#F4F2FA] transition-colors border border-[#E5E7EB] shadow-xs flex items-center gap-2 text-xs font-bold min-h-[44px] active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filter Toolbar: Stacked on mobile, 3-cols on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(0);
            }}
            className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3 h-11 text-xs text-[#111827] focus:outline-none focus:border-[#7567E8]"
          >
            <option value="">All Statuses</option>
            <option value="REQUESTED">REQUESTED</option>
            <option value="ACCEPTED">ACCEPTED</option>
            <option value="PICKED_UP">PICKED_UP</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(0);
            }}
            className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3 h-11 text-xs text-[#111827] focus:outline-none focus:border-[#7567E8]"
          >
            <option value="">All Categories</option>
            <option value="CLOTHES">CLOTHES</option>
            <option value="FOOD">FOOD</option>
            <option value="BOOKS">BOOKS</option>
            <option value="STATIONERY">STATIONERY</option>
            <option value="TOYS">TOYS</option>
            <option value="OTHER">OTHER</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">
            NGO Partner
          </label>
          <select
            value={selectedNgoId}
            onChange={(e) => {
              setSelectedNgoId(e.target.value);
              setPage(0);
            }}
            className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3 h-11 text-xs text-[#111827] focus:outline-none focus:border-[#7567E8]"
          >
            <option value="">All NGOs</option>
            {ngos.map((ngo) => (
              <option key={ngo.id} value={ngo.id}>
                {ngo.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content: Loading, Error, Empty, Desktop Table + Mobile Cards */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-2">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#7567E8]" />
          <p className="text-[#6B7280] text-xs font-medium">Fetching audit records...</p>
        </div>
      ) : error ? (
        <div className="p-5 rounded-2xl bg-[#FEE2E2] border border-[#FCA5A5] text-center text-[#DC2626] space-y-2">
          <p className="font-semibold text-xs">{error}</p>
          <button
            onClick={fetchDonations}
            className="px-3.5 py-1.5 rounded-xl bg-[#DC2626] text-white text-xs font-bold"
          >
            Retry Connection
          </button>
        </div>
      ) : !pageData || !Array.isArray(pageData.content) || pageData.content.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E7EB] space-y-3 p-6 shadow-xs">
          <PackageCheck className="w-12 h-12 text-[#9CA3AF] mx-auto" />
          <h3 className="text-[#111827] font-extrabold text-base">No audit records match filters</h3>
          <p className="text-[#6B7280] text-xs max-w-sm mx-auto">
            Try adjusting your status, category, or NGO dropdown selections.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table (Visible on md+) */}
          <div className="hidden md:block bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#111827]">
                <thead className="bg-[#F9FAFB] text-xs font-extrabold text-[#4B5563] uppercase tracking-wider border-b border-[#E5E7EB]">
                  <tr>
                    <th className="px-5 py-3.5">Donor Name</th>
                    <th className="px-5 py-3.5">Target NGO</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Pickup Date</th>
                    <th className="px-5 py-3.5">Created Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {pageData.content.map((donation) => (
                    <tr key={donation.id} className="hover:bg-[#F4F2FA] transition-colors">
                      <td className="px-5 py-3.5 font-bold text-[#111827]">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-[#7567E8]" />
                          <span>{donation.donor?.fullName || 'Anonymous'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[#4B5563] font-medium">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#7567E8]" />
                          <span>{donation.ngo?.name || 'NGO Partner'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#7567E8]/10 text-[#7567E8] border border-[#7567E8]/20">
                          <Tag className="w-3 h-3" />
                          {donation.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <MobileStatusBadge status={donation.status} size="sm" />
                      </td>
                      <td className="px-5 py-3.5 text-xs text-[#6B7280]">
                        {donation.pickupDate || 'N/A'}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-[#6B7280]">
                        {formatDate(donation.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Android Mobile Cards (Visible under md) */}
          <div className="block md:hidden space-y-3">
            {pageData.content.map((donation) => (
              <div
                key={donation.id}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-4 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-[#7567E8]/10 text-[#7567E8] border border-[#7567E8]/20 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {donation.category}
                  </span>
                  <MobileStatusBadge status={donation.status} size="sm" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-[#111827]">
                    <User className="w-4 h-4 text-[#7567E8] shrink-0" />
                    <span>Donor: {donation.donor?.fullName || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#4B5563]">
                    <Building2 className="w-3.5 h-3.5 text-[#7567E8] shrink-0" />
                    <span>NGO: {donation.ngo?.name || 'NGO Partner'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#E5E7EB] text-[#6B7280]">
                  <span>Created: {formatDate(donation.createdAt)}</span>
                  {donation.pickupDate && (
                    <span className="flex items-center gap-1 text-[#7567E8] font-bold">
                      <Calendar className="w-3 h-3" />
                      {donation.pickupDate}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 text-xs text-[#6B7280]">
            <div>
              Showing Page <span className="font-extrabold text-[#111827]">{pageData.number + 1}</span> of{' '}
              <span className="font-extrabold text-[#111827]">{pageData.totalPages}</span> ({pageData.totalElements} entries)
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                disabled={pageData.number === 0}
                className="px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] text-[#4B5563] hover:text-[#111827] disabled:opacity-40 min-h-[38px] active:scale-95 flex items-center gap-1 font-bold"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button
                onClick={() => setPage((prev) => Math.min(pageData.totalPages - 1, prev + 1))}
                disabled={pageData.number >= pageData.totalPages - 1}
                className="px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] text-[#4B5563] hover:text-[#111827] disabled:opacity-40 min-h-[38px] active:scale-95 flex items-center gap-1 font-bold"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
