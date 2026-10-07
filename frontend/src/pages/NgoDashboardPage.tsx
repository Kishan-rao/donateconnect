import React, { useEffect, useState } from 'react';
import { getNgoAssignedDonations, updateDonationStatusByNgo } from '../api/donationApi';
import { Donation, DonationStatus } from '../types';
import { formatDate } from '../utils/formatters';
import { LiveDriverTrackerModal } from '../components/LiveDriverTrackerModal';
import { MobileStatusBadge } from '../components/common/MobileStatusBadge';
import { getPhotoUrl } from '../utils/photoHelper';
import {
  Building2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Truck,
  PackageCheck,
  User,
  Calendar,
  Tag,
  Filter,
  Inbox,
  Navigation,
  Loader2,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const NgoDashboardPage: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [activeTrackerDonation, setActiveTrackerDonation] = useState<Donation | null>(null);

  const fetchDonations = async () => {
    setLoading(true);
    setError(null);
    try {
      const pageResponse = await getNgoAssignedDonations(0, 100);
      const data = pageResponse.content;
      // Sort newest first
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setDonations(sorted);
    } catch (err: any) {
      setError(err.message || 'Failed to load assigned donations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: DonationStatus) => {
    setActionLoadingId(id);
    try {
      const updated = await updateDonationStatusByNgo(id, newStatus);
      setDonations((prev) => prev.map((d) => (d.id === id ? updated : d)));
      showSuccess(`Donation status updated to ${newStatus}`);
    } catch (err: any) {
      showError('Status update failed: ' + err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredDonations = donations.filter(
    (d) => statusFilter === 'ALL' || d.status === statusFilter
  );

  return (
    <div className="space-y-4 sm:space-y-6 py-3 sm:py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#111827] tracking-tight flex items-center gap-2.5">
            <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#7567E8]" />
            Assigned Donations
          </h1>
          <p className="text-[#6B7280] text-xs sm:text-sm mt-0.5">
            Manage incoming requests and update pickup & delivery status
          </p>
        </div>

        <button
          onClick={fetchDonations}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-white text-[#4B5563] hover:text-[#111827] hover:bg-[#F4F2FA] transition-colors border border-[#E5E7EB] shadow-xs flex items-center gap-2 text-xs font-bold min-h-[44px] active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh List
        </button>
      </div>

      {/* Filter Tabs Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
        <Filter className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0 mr-1 hidden xs:block" />
        {['ALL', 'REQUESTED', 'ACCEPTED', 'PICKED_UP', 'DELIVERED', 'REJECTED'].map((status) => {
          const count =
            status === 'ALL'
              ? donations.length
              : donations.filter((d) => d.status === status).length;

          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 min-h-[38px] active:scale-95 ${
                statusFilter === status
                  ? 'bg-[#7567E8] text-white border-[#7567E8] shadow-xs'
                  : 'bg-white text-[#4B5563] border-[#E5E7EB] hover:bg-[#F4F2FA] hover:text-[#111827]'
              }`}
            >
              <span>{status}</span>
              <span
                className={`px-1.5 py-0.2 rounded-md text-[10px] font-extrabold ${
                  statusFilter === status
                    ? 'bg-white/20 text-white'
                    : 'bg-[#F3F4F6] text-[#4B5563]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-3 animate-pulse shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="w-20 h-5 bg-[#F3F4F6] rounded-full" />
                <div className="w-16 h-5 bg-[#F3F4F6] rounded" />
              </div>
              <div className="w-3/4 h-5 bg-[#F3F4F6] rounded" />
              <div className="w-full h-12 bg-[#F3F4F6] rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-[#FEE2E2] border border-[#FCA5A5] text-center text-[#DC2626] space-y-3 max-w-md mx-auto my-6">
          <p className="font-semibold text-xs sm:text-sm">{error}</p>
          <button
            onClick={fetchDonations}
            className="px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-[#DC2626]/90 text-white text-xs font-bold transition-colors shadow-xs"
          >
            Retry Connection
          </button>
        </div>
      ) : filteredDonations.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E7EB] space-y-3 shadow-xs p-6">
          <Inbox className="w-12 h-12 text-[#9CA3AF] mx-auto" />
          <h3 className="text-[#111827] font-extrabold text-base">No assigned donations</h3>
          <p className="text-[#6B7280] text-xs max-w-sm mx-auto">
            {donations.length === 0
              ? 'No donors have assigned donation requests to your organization yet.'
              : `No donations matching status "${statusFilter}".`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredDonations.map((donation) => (
            <div
              key={donation.id}
              className="bg-white border border-[#E5E7EB] hover:border-[#7567E8]/40 rounded-2xl p-4 sm:p-5 transition-all flex flex-col justify-between shadow-xs space-y-3"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-[#7567E8]/10 text-[#7567E8] border border-[#7567E8]/20 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {donation.category}
                  </span>
                  <MobileStatusBadge status={donation.status} size="sm" />
                </div>

                <div className="flex items-center gap-2 text-[#111827] font-bold text-sm">
                  <User className="w-4 h-4 text-[#7567E8] shrink-0" />
                  <span className="truncate">Donor: {donation.donor?.fullName || 'Anonymous'}</span>
                </div>

                <p className="text-[#4B5563] text-xs leading-relaxed line-clamp-2">
                  {donation.description || 'No item description provided.'}
                </p>

                {donation.photoUrls && donation.photoUrls.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar">
                    {donation.photoUrls.map((url, idx) => (
                      <img
                        key={idx}
                        src={getPhotoUrl(url)}
                        alt="Item photo"
                        className="w-14 h-14 object-cover rounded-xl border border-[#E5E7EB] shrink-0"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-[#E5E7EB] pt-3 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#7567E8]" />
                    <span>Requested: {formatDate(donation.createdAt)}</span>
                  </div>
                  {donation.pickupDate && (
                    <span className="text-[#7567E8] font-bold">Pickup: {donation.pickupDate}</span>
                  )}
                </div>

                {/* Live GPS Driver Tracking Trigger */}
                <button
                  onClick={() => setActiveTrackerDonation(donation)}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#7567E8]/10 hover:bg-[#7567E8]/20 text-[#7567E8] text-xs font-bold border border-[#7567E8]/20 transition-all flex items-center justify-center gap-1.5 min-h-[40px] active:scale-[0.98]"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#7567E8]" />
                  Track Driver Live GPS Location &rarr;
                </button>

                {/* Workflow Action Buttons (min 44px touch height) */}
                <div className="pt-1">
                  {actionLoadingId === donation.id ? (
                    <div className="w-full py-2.5 text-center text-xs text-[#7567E8] font-bold flex items-center justify-center gap-2 min-h-[44px]">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating status...
                    </div>
                  ) : donation.status === 'REQUESTED' ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleStatusUpdate(donation.id, 'ACCEPTED')}
                        className="py-2.5 px-3 rounded-xl bg-[#ECFDF5] hover:bg-[#059669] text-[#047857] hover:text-white font-bold text-xs transition-colors border border-[#A7F3D0] flex items-center justify-center gap-1.5 min-h-[44px] active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(donation.id, 'REJECTED')}
                        className="py-2.5 px-3 rounded-xl bg-[#FEF2F2] hover:bg-[#DC2626] text-[#B91C1C] hover:text-white font-bold text-xs transition-colors border border-[#FECACA] flex items-center justify-center gap-1.5 min-h-[44px] active:scale-95"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  ) : donation.status === 'ACCEPTED' ? (
                    <button
                      onClick={() => handleStatusUpdate(donation.id, 'PICKED_UP')}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#FFFBEB] hover:bg-[#D97706] text-[#B45309] hover:text-white font-bold text-xs transition-colors border border-[#FDE68A] flex items-center justify-center gap-2 min-h-[44px] active:scale-[0.98]"
                    >
                      <Truck className="w-4 h-4" />
                      Mark Picked Up
                    </button>
                  ) : donation.status === 'PICKED_UP' ? (
                    <button
                      onClick={() => handleStatusUpdate(donation.id, 'DELIVERED')}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#ECFDF5] hover:bg-[#059669] text-[#047857] hover:text-white font-bold text-xs transition-colors border border-[#A7F3D0] flex items-center justify-center gap-2 min-h-[44px] active:scale-[0.98]"
                    >
                      <PackageCheck className="w-4 h-4" />
                      Mark Delivered
                    </button>
                  ) : donation.status === 'DELIVERED' ? (
                    <div className="w-full py-2.5 text-center text-xs font-bold text-[#047857] bg-[#ECFDF5] rounded-xl border border-[#A7F3D0] min-h-[40px] flex items-center justify-center">
                      ✓ Delivered & Inspected
                    </div>
                  ) : (
                    <div className="w-full py-2.5 text-center text-xs font-bold text-[#B91C1C] bg-[#FEF2F2] rounded-xl border border-[#FECACA] min-h-[40px] flex items-center justify-center">
                      ✗ Donation Rejected
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Uber-Style Live Driver Tracker Modal */}
      {activeTrackerDonation && (
        <LiveDriverTrackerModal
          donationTitle={`${activeTrackerDonation.category} (Donor: ${activeTrackerDonation.donor?.fullName || 'Anonymous'})`}
          driverName="Vikram Singh (Volunteer Logistics Coordinator)"
          driverPhone="+91 98765 43210"
          onClose={() => setActiveTrackerDonation(null)}
        />
      )}
    </div>
  );
};
