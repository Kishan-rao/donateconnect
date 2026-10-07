import React, { useEffect, useState } from 'react';
import { getMyVolunteerTasks, getAvailablePickups, claimVolunteerPickup, updateVolunteerTaskStatus } from '../api/volunteerApi';
import { Donation, PageResponse, VolunteerTask } from '../types';
import { useToast } from '../context/ToastContext';
import { Truck, CheckCircle2, MapPin, Calendar, Clock, RefreshCw, PackageSearch, ChevronRight, Loader2 } from 'lucide-react';

type DashboardTab = 'my-tasks' | 'available';

export const DriverDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('my-tasks');
  const [tasks, setTasks] = useState<VolunteerTask[]>([]);
  const [available, setAvailable] = useState<PageResponse<Donation> | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  const fetchMyTasks = async () => {
    setLoading(true);
    try {
      const data = await getMyVolunteerTasks();
      setTasks(data);
    } catch {
      showError('Failed to load volunteer tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailable = async (page = 0) => {
    setLoading(true);
    try {
      const data = await getAvailablePickups(page, 20);
      setAvailable(data);
    } catch {
      showError('Failed to load available pickups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'my-tasks') {
      fetchMyTasks();
    } else {
      fetchAvailable();
    }
  }, [activeTab]);

  const handleStatusChange = async (taskId: string, status: VolunteerTask['status']) => {
    try {
      const updated = await updateVolunteerTaskStatus(taskId, status);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      showSuccess(`Task updated to ${status}`);
    } catch (err: any) {
      showError(err.message || 'Failed to update task status');
    }
  };

  const handleClaim = async (donationId: string) => {
    setClaiming(donationId);
    try {
      await claimVolunteerPickup(donationId);
      showSuccess('Pickup claimed successfully!');
      setActiveTab('my-tasks');
    } catch (err: any) {
      showError(err.message || 'Failed to claim pickup');
    } finally {
      setClaiming(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 py-3 sm:py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#111827] tracking-tight flex items-center gap-2.5">
            <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-[#7567E8]" />
            Driver Console
          </h1>
          <p className="text-[#6B7280] text-xs sm:text-sm mt-0.5">
            Claim and fulfill community donation pickups to NGO relief centers
          </p>
        </div>

        <button
          onClick={() => (activeTab === 'my-tasks' ? fetchMyTasks() : fetchAvailable())}
          disabled={loading}
          className="self-start sm:self-auto w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white text-[#4B5563] hover:text-[#111827] hover:bg-[#F4F2FA] transition-colors border border-[#E5E7EB] shadow-xs flex items-center justify-center shrink-0 active:scale-95"
          aria-label="Refresh tasks"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Android Segmented Switcher Tabs */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB]">
        <button
          onClick={() => setActiveTab('my-tasks')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[44px] active:scale-[0.98] ${
            activeTab === 'my-tasks'
              ? 'bg-[#7567E8] text-white shadow-xs'
              : 'text-[#4B5563] hover:text-[#111827]'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>My Tasks</span>
          {tasks.length > 0 && (
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-md font-extrabold ${
                activeTab === 'my-tasks' ? 'bg-white/20 text-white' : 'bg-[#E5E7EB] text-[#111827]'
              }`}
            >
              {tasks.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('available')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[44px] active:scale-[0.98] ${
            activeTab === 'available'
              ? 'bg-[#7567E8] text-white shadow-xs'
              : 'text-[#4B5563] hover:text-[#111827]'
          }`}
        >
          <PackageSearch className="w-4 h-4" />
          <span>Available Pickups</span>
          {available && (
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-md font-extrabold ${
                activeTab === 'available' ? 'bg-white/20 text-white' : 'bg-[#E5E7EB] text-[#111827]'
              }`}
            >
              {available.totalElements}
            </span>
          )}
        </button>
      </div>

      {/* ---- MY TASKS TAB ---- */}
      {activeTab === 'my-tasks' && (
        <>
          {loading ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E7EB] text-[#6B7280] text-xs font-medium space-y-2">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#7567E8]" />
              <p>Loading your dispatch routes...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E7EB] space-y-3 p-6 shadow-xs">
              <Truck className="w-12 h-12 text-[#9CA3AF] mx-auto" />
              <h3 className="text-[#111827] font-extrabold text-base">No active pickup assignments</h3>
              <p className="text-[#6B7280] text-xs max-w-sm mx-auto">
                Switch to{' '}
                <button
                  onClick={() => setActiveTab('available')}
                  className="text-[#7567E8] font-bold underline"
                >
                  Available Pickups
                </button>{' '}
                to claim an open donation delivery.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3.5 shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#7567E8] bg-[#7567E8]/10 px-2.5 py-0.5 rounded-lg border border-[#7567E8]/20">
                        {task.donation.category}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-[#FAF8F5] text-[#111827] border border-[#E5E7EB] font-mono">
                        {task.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-[#111827] mb-1">
                      → {task.donation.ngo?.name}
                    </h3>
                    <p className="text-xs text-[#4B5563] mb-3 line-clamp-2">
                      {task.donation.description || 'Standard packaged donation.'}
                    </p>

                    <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E5E7EB] text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[#111827]">
                        <MapPin className="w-3.5 h-3.5 text-[#7567E8] shrink-0" />
                        <span className="truncate">
                          <strong>NGO Hub:</strong> {task.donation.ngo?.address}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#111827]">
                        <Calendar className="w-3.5 h-3.5 text-[#7567E8] shrink-0" />
                        <span>
                          <strong>Pickup Date:</strong> {task.donation.pickupDate || 'Flexible'}
                        </span>
                      </div>
                      {task.routeNotes && (
                        <div className="flex items-center gap-1.5 text-[#6B7280]">
                          <Clock className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                          <span>
                            <strong>Notes:</strong> {task.routeNotes}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Task Status Transition Buttons */}
                  <div className="border-t border-[#E5E7EB] pt-3 flex items-center gap-2">
                    <button
                      onClick={() => handleStatusChange(task.id, 'IN_TRANSIT')}
                      disabled={task.status !== 'CLAIMED'}
                      className="flex-1 py-2.5 px-2 rounded-xl bg-[#FFFBEB] hover:bg-[#D97706] disabled:opacity-40 text-[#B45309] hover:text-white text-xs font-bold transition-all border border-[#FDE68A] min-h-[44px] flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Truck className="w-4 h-4" />
                      Mark In-Transit
                    </button>
                    <button
                      onClick={() => handleStatusChange(task.id, 'COMPLETED')}
                      disabled={task.status !== 'IN_TRANSIT'}
                      className="flex-1 py-2.5 px-2 rounded-xl bg-[#ECFDF5] hover:bg-[#059669] disabled:opacity-40 text-[#047857] hover:text-white text-xs font-bold transition-all border border-[#A7F3D0] min-h-[44px] flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Mark Completed
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ---- AVAILABLE PICKUPS TAB ---- */}
      {activeTab === 'available' && (
        <>
          {loading ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E7EB] text-[#6B7280] text-xs font-medium space-y-2">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#7567E8]" />
              <p>Loading available pickups...</p>
            </div>
          ) : !available || !Array.isArray(available.content) || available.content.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E7EB] space-y-3 p-6 shadow-xs">
              <PackageSearch className="w-12 h-12 text-[#9CA3AF] mx-auto" />
              <h3 className="text-[#111827] font-extrabold text-base">No available pickups right now</h3>
              <p className="text-[#6B7280] text-xs max-w-sm mx-auto">
                Check back shortly — accepted donations appear here once approved by NGO partners.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                {available.content.map((donation) => (
                  <div
                    key={donation.id}
                    className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3 shadow-xs hover:border-[#7567E8]/30 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#059669] bg-[#ECFDF5] px-2.5 py-0.5 rounded-lg border border-[#A7F3D0]">
                          {donation.category}
                        </span>
                        <span className="text-xs text-[#9CA3AF] font-mono">
                          #{donation.id.substring(0, 8)}
                        </span>
                      </div>
                      <h3 className="text-sm font-extrabold text-[#111827] mb-1">
                        {donation.ngo?.name}
                      </h3>
                      <p className="text-xs text-[#4B5563] line-clamp-2">{donation.description}</p>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 mt-3 text-xs text-[#6B7280]">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#7567E8] shrink-0" />
                          {donation.ngo?.address || 'N/A'}
                        </span>
                        {donation.pickupDate && (
                          <span className="flex items-center gap-1 shrink-0 text-[#7567E8] font-semibold">
                            <Calendar className="w-3.5 h-3.5" />
                            {donation.pickupDate}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleClaim(donation.id)}
                      disabled={claiming === donation.id}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#7567E8] hover:bg-[#7567E8]/90 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 min-h-[44px] shadow-xs active:scale-[0.98]"
                    >
                      {claiming === donation.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Claiming...
                        </>
                      ) : (
                        <>
                          <ChevronRight className="w-4 h-4" />
                          Claim Pickup Delivery
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {available.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => fetchAvailable(available.number - 1)}
                    disabled={available.number === 0}
                    className="px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] text-[#4B5563] text-xs font-bold disabled:opacity-40 min-h-[38px] active:scale-95"
                  >
                    ← Previous
                  </button>
                  <span className="text-xs text-[#6B7280]">
                    Page {available.number + 1} of {available.totalPages}
                  </span>
                  <button
                    onClick={() => fetchAvailable(available.number + 1)}
                    disabled={available.number >= available.totalPages - 1}
                    className="px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] text-[#4B5563] text-xs font-bold disabled:opacity-40 min-h-[38px] active:scale-95"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
