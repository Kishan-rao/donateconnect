import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyDonations } from '../api/donationApi';
import { Donation, DonationStatus, PageResponse } from '../types';
import { formatDate } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { CommentThread } from '../components/CommentThread';
import { LiveDriverTrackerModal } from '../components/LiveDriverTrackerModal';
import { DonationDetailModal } from '../components/DonationDetailModal';
import { MobileBottomSheet } from '../components/common/MobileBottomSheet';
import { MobileStatusBadge } from '../components/common/MobileStatusBadge';
import {
  PlusCircle,
  RefreshCw,
  HeartHandshake,
  Tag,
  Building2,
  Calendar,
  Filter,
  MessageSquare,
  Navigation,
  ChevronLeft,
  ChevronRight,
  PackageCheck,
  Eye,
  AlertTriangle,
} from 'lucide-react';

export const MyDonationsPage: React.FC = () => {
  const { user } = useAuth();
  const [pageData, setPageData] = useState<PageResponse<Donation> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Selected Donation for Modals
  const [activeChatDonation, setActiveChatDonation] = useState<Donation | null>(null);
  const [activeTrackerDonation, setActiveTrackerDonation] = useState<Donation | null>(null);
  const [detailDonationId, setDetailDonationId] = useState<string | null>(null);

  const fetchDonations = async (currentPage = page, pageSize = size) => {
    setLoading(true);
    setError(null);
    try {
      const pageResponse = await getMyDonations(currentPage, pageSize);
      setPageData(pageResponse);
    } catch (err: any) {
      setError(err.message || 'Unable to load donation history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations(page, size);
  }, [page, size]);

  const rawDonations = pageData?.content || [];
  const totalElements = pageData?.totalElements || 0;
  const totalPages = pageData?.totalPages || 0;

  const filteredDonations = rawDonations.filter(
    (d) => statusFilter === 'ALL' || d.status === statusFilter
  );

  const totalDonationsCount = totalElements;
  const uniqueNgosCount = new Set(rawDonations.map((d) => d.ngo?.id || d.ngo?.name)).size;
  const deliveredCount = rawDonations.filter((d) => d.status === 'DELIVERED').length;

  return (
    <div className="space-y-5 sm:space-y-6 py-3 sm:py-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#111827] tracking-tight flex items-center gap-2.5">
            <HeartHandshake className="w-6 h-6 sm:w-8 sm:h-8 text-[#7567E8]" />
            My Donations
          </h1>
          <p className="text-[#6B7280] text-xs sm:text-sm mt-0.5">
            View and track your complete donation history
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto w-full sm:w-auto">
          <button
            onClick={() => fetchDonations(page, size)}
            disabled={loading}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white text-[#4B5563] hover:text-[#111827] hover:bg-[#F4F2FA] transition-colors border border-[#E5E7EB] shadow-xs flex items-center justify-center shrink-0 active:scale-95"
            title="Refresh list"
            aria-label="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/donate/new"
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#7567E8] hover:bg-[#7567E8]/90 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xs min-h-[44px] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            New Donation
          </Link>
        </div>
      </div>

      {/* Summary Metrics Section (2-cols on mobile, 3-cols on tablet+) */}
      {!loading && !error && (
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3.5 shadow-xs text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-[#7567E8]/10 text-[#7567E8] flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-semibold text-[#6B7280] uppercase">Total</p>
              <h3 className="text-lg sm:text-2xl font-extrabold text-[#111827]">{totalDonationsCount}</h3>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3.5 shadow-xs text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-[#7567E8]/10 text-[#7567E8] flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-semibold text-[#6B7280] uppercase">NGOs</p>
              <h3 className="text-lg sm:text-2xl font-extrabold text-[#111827]">{uniqueNgosCount}</h3>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3.5 shadow-xs text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-semibold text-[#6B7280] uppercase">Delivered</p>
              <h3 className="text-lg sm:text-2xl font-extrabold text-[#111827]">{deliveredCount}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Horizontal Filter Chips Bar */}
      {!loading && !error && totalElements > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
          <Filter className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0 mr-1 hidden xs:block" />
          {['ALL', 'REQUESTED', 'ACCEPTED', 'PICKED_UP', 'DELIVERED', 'REJECTED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border min-h-[38px] active:scale-95 ${
                statusFilter === status
                  ? 'bg-[#7567E8] text-white border-[#7567E8] shadow-xs'
                  : 'bg-white text-[#4B5563] border-[#E5E7EB] hover:bg-[#F4F2FA] hover:text-[#111827]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-3">
          <div className="w-8 h-8 border-3 border-[#7567E8] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[#6B7280] text-xs font-medium">Loading donation history...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-[#FEE2E2] border border-[#FCA5A5] text-center space-y-3 max-w-md mx-auto my-6">
          <AlertTriangle className="w-8 h-8 text-[#DC2626] mx-auto" />
          <div>
            <h3 className="text-sm font-bold text-[#111827]">Unable to load donation history</h3>
            <p className="text-[#6B7280] text-xs mt-0.5">{error}</p>
          </div>
          <button
            onClick={() => fetchDonations(page, size)}
            className="px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-[#DC2626]/90 text-white font-bold text-xs transition-colors shadow-xs"
          >
            Retry Connection
          </button>
        </div>
      ) : totalElements === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-3 p-6">
          <div className="w-14 h-14 rounded-full bg-[#7567E8]/10 flex items-center justify-center mx-auto text-[#7567E8]">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-lg text-[#111827]">No donations yet</h3>
            <p className="text-[#6B7280] text-xs max-w-xs mx-auto">
              Your donation history will appear here once you submit your first donation.
            </p>
          </div>
          <Link
            to="/donate/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7567E8] hover:bg-[#7567E8]/90 text-white font-bold text-xs sm:text-sm transition-all shadow-xs min-h-[44px]"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            Start a Donation
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table Layout (md+ screens) */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-[#E5E7EB] bg-white shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase font-extrabold border-b border-[#E5E7EB] bg-[#F9FAFB] text-[#4B5563]">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">NGO</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 max-w-xs">Description</th>
                  <th className="py-3 px-4">Pickup Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
                {filteredDonations.map((donation) => (
                  <tr
                    key={donation.id}
                    className="hover:bg-[#F4F2FA] transition-colors cursor-pointer"
                    onClick={() => setDetailDonationId(donation.id)}
                  >
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-[#6B7280]">
                      {formatDate(donation.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 font-bold max-w-[180px] break-words text-[#111827]">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#7567E8] shrink-0" />
                        <span className="truncate">{donation.ngo?.name || 'NGO Partner'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#7567E8]/10 text-[#7567E8] border border-[#7567E8]/20">
                        <Tag className="w-3 h-3" />
                        {donation.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs max-w-xs break-words line-clamp-2 text-[#4B5563]">
                      {donation.description || 'No description provided.'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                      {donation.pickupDate ? (
                        <span className="inline-flex items-center gap-1 text-[#111827] font-semibold">
                          <Calendar className="w-3 h-3 text-[#7567E8]" />
                          {donation.pickupDate}
                        </span>
                      ) : (
                        <span className="text-[#9CA3AF]">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <MobileStatusBadge status={donation.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setDetailDonationId(donation.id)}
                          className="p-2 rounded-lg transition-colors border bg-white hover:bg-[#F4F2FA] text-[#111827] border-[#E5E7EB] shadow-xs"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-[#7567E8]" />
                        </button>
                        <button
                          onClick={() => setActiveTrackerDonation(donation)}
                          className="p-2 rounded-lg transition-colors border bg-[#7567E8]/10 hover:bg-[#7567E8]/20 text-[#7567E8] border-[#7567E8]/20"
                          title="Live Driver GPS"
                        >
                          <Navigation className="w-4 h-4 text-[#7567E8]" />
                        </button>
                        <button
                          onClick={() => setActiveChatDonation(donation)}
                          className="p-2 rounded-lg transition-colors border bg-white hover:bg-[#F4F2FA] text-[#111827] border-[#E5E7EB] shadow-xs"
                          title="Chat with NGO"
                        >
                          <MessageSquare className="w-4 h-4 text-[#4B5563]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Android Mobile Cards Layout (under md screens) */}
          <div className="block md:hidden space-y-3">
            {filteredDonations.map((donation) => (
              <div
                key={donation.id}
                className="border border-[#E5E7EB] rounded-2xl p-4 space-y-3 bg-white shadow-xs active:border-[#7567E8]/50 transition-colors"
              >
                {/* Header: Category + Status Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg border flex items-center gap-1 bg-[#7567E8]/10 text-[#7567E8] border-[#7567E8]/20">
                    <Tag className="w-3 h-3" />
                    {donation.category}
                  </span>
                  <MobileStatusBadge status={donation.status} size="sm" />
                </div>

                {/* NGO & Description */}
                <div>
                  <div className="flex items-center gap-1.5 font-extrabold text-sm mb-1 text-[#111827]">
                    <Building2 className="w-4 h-4 text-[#7567E8] shrink-0" />
                    <span className="truncate">{donation.ngo?.name || 'NGO Partner'}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-[#4B5563] line-clamp-2">
                    {donation.description || 'No description provided.'}
                  </p>
                </div>

                {/* Timing Footer */}
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#E5E7EB] text-[#6B7280]">
                  <span>Requested: {formatDate(donation.createdAt)}</span>
                  {donation.pickupDate && (
                    <span className="flex items-center gap-1 text-[#7567E8] font-bold">
                      <Calendar className="w-3 h-3" />
                      Pickup: {donation.pickupDate}
                    </span>
                  )}
                </div>

                {/* Thumb-Friendly Action Buttons (44px min touch height) */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => setDetailDonationId(donation.id)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold border bg-white hover:bg-[#F4F2FA] text-[#111827] border-[#E5E7EB] shadow-xs min-h-[44px] active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#7567E8]" />
                    Inspect
                  </button>
                  <button
                    onClick={() => setActiveTrackerDonation(donation)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold border bg-[#7567E8]/10 hover:bg-[#7567E8]/20 text-[#7567E8] border-[#7567E8]/20 min-h-[44px] active:scale-95"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#7567E8]" />
                    Live GPS
                  </button>
                  <button
                    onClick={() => setActiveChatDonation(donation)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold border bg-white hover:bg-[#F4F2FA] text-[#111827] border-[#E5E7EB] shadow-xs min-h-[44px] active:scale-95"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#4B5563]" />
                    Chat
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl border border-[#E5E7EB] bg-white shadow-xs">
              <div className="text-xs text-[#6B7280]">
                Page <span className="font-extrabold text-[#111827]">{page + 1}</span> of{' '}
                <span className="font-extrabold text-[#111827]">{totalPages}</span> ({totalElements} items)
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                  disabled={page === 0}
                  className="px-3.5 py-2 rounded-xl border border-[#E5E7EB] text-xs font-bold text-[#4B5563] hover:text-[#111827] disabled:opacity-40 min-h-[38px] active:scale-95 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                <button
                  onClick={() => setPage((prev) => Math.min(totalPages - 1, prev + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-3.5 py-2 rounded-xl border border-[#E5E7EB] text-xs font-bold text-[#4B5563] hover:text-[#111827] disabled:opacity-40 min-h-[38px] active:scale-95 flex items-center gap-1"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>

                <select
                  value={size}
                  onChange={(e) => {
                    setSize(Number(e.target.value));
                    setPage(0);
                  }}
                  className="border text-xs font-semibold rounded-xl px-2.5 py-2 bg-[#F9FAFB] border-[#E5E7EB] text-[#111827] focus:border-[#7567E8] min-h-[38px]"
                >
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                  <option value={50}>50 / page</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Donation Detail Inspector Modal */}
      {detailDonationId && (
        <DonationDetailModal
          donationId={detailDonationId}
          onClose={() => setDetailDonationId(null)}
          onOpenChat={(donation) => setActiveChatDonation(donation)}
          onOpenTracker={(donation) => setActiveTrackerDonation(donation)}
        />
      )}

      {/* Live Driver Tracker Modal */}
      {activeTrackerDonation && (
        <LiveDriverTrackerModal
          donationTitle={`${activeTrackerDonation.category} (${activeTrackerDonation.ngo?.name || 'NGO'})`}
          driverName="Vikram Singh (Volunteer Logistics)"
          driverPhone="+91 98765 43210"
          onClose={() => setActiveTrackerDonation(null)}
        />
      )}

      {/* Direct Chat Bottom Sheet */}
      {activeChatDonation && (
        <MobileBottomSheet
          isOpen={Boolean(activeChatDonation)}
          onClose={() => setActiveChatDonation(null)}
          title={`Chat with ${activeChatDonation.ngo?.name}`}
          subtitle={`Donation #${activeChatDonation.id.slice(0, 8)} (${activeChatDonation.category})`}
          icon={
            <div className="w-9 h-9 rounded-xl bg-[#7567E8]/10 text-[#7567E8] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          }
        >
          <CommentThread donationId={activeChatDonation.id} currentUserId={user?.id} />
        </MobileBottomSheet>
      )}
    </div>
  );
};
