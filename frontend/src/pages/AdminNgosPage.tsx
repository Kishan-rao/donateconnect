import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createNgoByAdmin, deleteNgoByAdmin, getAllNgosAdmin, verifyNgoByAdmin } from '../api/ngoApi';
import { CreateNgoRequest, NGOProfile } from '../types';
import { MobileBottomSheet } from '../components/common/MobileBottomSheet';
import { Building2, Plus, ShieldCheck, ShieldAlert, Trash2, Check, RefreshCw, AlertTriangle, Phone, MapPin, Mail, Loader2 } from 'lucide-react';

export const AdminNgosPage: React.FC = () => {
  const [ngos, setNgos] = useState<NGOProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Delete Confirmation Modal
  const [deleteTarget, setDeleteTarget] = useState<NGOProfile | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateNgoRequest>();

  const fetchNgos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllNgosAdmin();
      setNgos(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load NGO list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNgos();
  }, []);

  const handleVerifyToggle = async (id: string, currentStatus: boolean) => {
    try {
      const updated = await verifyNgoByAdmin(id, !currentStatus);
      setNgos((prev) => prev.map((n) => (n.id === id ? updated : n)));
    } catch (err: any) {
      alert('Verification update failed: ' + err.message);
    }
  };

  const handleCreateNgo = async (data: CreateNgoRequest) => {
    setCreateLoading(true);
    setCreateError(null);
    try {
      const created = await createNgoByAdmin(data);
      setNgos((prev) => [...prev, created]);
      setIsAddModalOpen(false);
      reset();
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create NGO account.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteNgoByAdmin(deleteTarget.id);
      setNgos((prev) => prev.filter((n) => n.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      alert('Failed to remove NGO: ' + err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 py-3 sm:py-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#111827] tracking-tight flex items-center gap-2.5">
            <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#7567E8]" />
            Manage NGO Partners
          </h1>
          <p className="text-[#6B7280] text-xs sm:text-sm mt-0.5">
            Verify organizations, manage partner accounts, and create new credentials
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto w-full sm:w-auto">
          <button
            onClick={fetchNgos}
            disabled={loading}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white text-[#4B5563] hover:text-[#111827] hover:bg-[#F4F2FA] transition-colors border border-[#E5E7EB] shadow-xs flex items-center justify-center shrink-0 active:scale-95"
            title="Refresh NGO list"
            aria-label="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#7567E8] hover:bg-[#7567E8]/90 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xs min-h-[44px] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 text-white" />
            Add NGO Partner
          </button>
        </div>
      </div>

      {/* Content: Loading, Error, Empty, Desktop Table + Mobile Cards */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-2">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#7567E8]" />
          <p className="text-[#6B7280] text-xs font-medium">Loading NGO profiles...</p>
        </div>
      ) : error ? (
        <div className="p-5 rounded-2xl bg-[#FEE2E2] border border-[#FCA5A5] text-center text-[#DC2626] space-y-2">
          <p className="font-semibold text-xs">{error}</p>
          <button
            onClick={fetchNgos}
            className="px-3.5 py-1.5 rounded-xl bg-[#DC2626] text-white text-xs font-bold"
          >
            Retry Loading
          </button>
        </div>
      ) : ngos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E7EB] space-y-3 p-6 shadow-xs">
          <Building2 className="w-12 h-12 text-[#9CA3AF] mx-auto" />
          <h3 className="text-[#111827] font-extrabold text-base">No NGO profiles created yet</h3>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7567E8] text-white font-bold text-xs transition-colors min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            Add First NGO
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table (Visible on md+) */}
          <div className="hidden md:block bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#111827]">
                <thead className="bg-[#F9FAFB] text-xs font-extrabold text-[#4B5563] uppercase tracking-wider border-b border-[#E5E7EB]">
                  <tr>
                    <th className="px-5 py-3.5">NGO Name</th>
                    <th className="px-5 py-3.5">Account Email</th>
                    <th className="px-5 py-3.5">Address / Phone</th>
                    <th className="px-5 py-3.5">Verified Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {ngos.map((ngo) => (
                    <tr key={ngo.id} className="hover:bg-[#F4F2FA] transition-colors">
                      <td className="px-5 py-3.5 font-bold text-[#111827]">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#7567E8]" />
                          <span>{ngo.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[#4B5563] font-mono text-xs">
                        {ngo.user?.email || 'N/A'}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-[#4B5563]">
                        <div>{ngo.address}</div>
                        <div className="text-[11px] text-[#6B7280]">{ngo.phone}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        {ngo.verified ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-lg bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
                            <ShieldCheck className="w-3.5 h-3.5" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-lg bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
                            <ShieldAlert className="w-3.5 h-3.5" /> Unverified
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleVerifyToggle(ngo.id, ngo.verified)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors border flex items-center gap-1 min-h-[36px] ${
                              ngo.verified
                                ? 'bg-white hover:bg-[#F4F2FA] text-[#4B5563] border-[#E5E7EB]'
                                : 'bg-[#ECFDF5] hover:bg-[#059669] text-[#047857] hover:text-white border-[#A7F3D0]'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            {ngo.verified ? 'Unverify' : 'Verify'}
                          </button>
                          <button
                            onClick={() => setDeleteTarget(ngo)}
                            className="p-2 rounded-xl bg-white hover:bg-[#FEE2E2] text-[#DC2626] border border-[#E5E7EB] transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                            title="Remove NGO"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Android Mobile Cards (Visible under md) */}
          <div className="block md:hidden space-y-3">
            {ngos.map((ngo) => (
              <div
                key={ngo.id}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-4 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-extrabold text-sm text-[#111827]">
                    <Building2 className="w-4 h-4 text-[#7567E8] shrink-0" />
                    <span>{ngo.name}</span>
                  </div>
                  {ngo.verified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
                      <ShieldAlert className="w-3 h-3" /> Unverified
                    </span>
                  )}
                </div>

                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E5E7EB] text-xs space-y-1 text-[#4B5563]">
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-[#7567E8] shrink-0" />
                    <span>{ngo.user?.email || 'No email provided'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#7567E8] shrink-0" />
                    <span>{ngo.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#7567E8] shrink-0" />
                    <span>{ngo.phone}</span>
                  </div>
                </div>

                {/* Thumb-friendly mobile actions (min 44px height) */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleVerifyToggle(ngo.id, ngo.verified)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 min-h-[44px] active:scale-95 ${
                      ngo.verified
                        ? 'bg-white hover:bg-[#F4F2FA] text-[#4B5563] border-[#E5E7EB]'
                        : 'bg-[#ECFDF5] hover:bg-[#059669] text-[#047857] hover:text-white border-[#A7F3D0]'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    {ngo.verified ? 'Unverify' : 'Verify'}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(ngo)}
                    className="py-2.5 px-3 rounded-xl bg-white hover:bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA] text-xs font-bold flex items-center justify-center gap-1.5 min-h-[44px] active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD NGO MOBILE BOTTOM SHEET / MODAL */}
      <MobileBottomSheet
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New NGO Partner"
        subtitle="Create credentials and facility profile for a non-profit partner"
        icon={
          <div className="w-9 h-9 rounded-xl bg-[#7567E8]/10 text-[#7567E8] flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
        }
      >
        <div className="space-y-4">
          {createError && (
            <div className="p-3.5 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] text-xs font-semibold">
              {createError}
            </div>
          )}

          <form onSubmit={handleSubmit(handleCreateNgo)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#374151] uppercase mb-1">
                NGO Organization Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Hope Foundation"
                {...register('name', { required: 'NGO name is required' })}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 h-12 text-sm sm:text-base text-[#111827] focus:outline-none focus:border-[#7567E8]"
              />
              {errors.name && <p className="text-[#DC2626] text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#374151] uppercase mb-1">
                Account Email *
              </label>
              <input
                type="email"
                placeholder="contact@ngo.org"
                {...register('email', { required: 'Email is required' })}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 h-12 text-sm sm:text-base text-[#111827] focus:outline-none focus:border-[#7567E8]"
              />
              {errors.email && <p className="text-[#DC2626] text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#374151] uppercase mb-1">
                Initial Password *
              </label>
              <input
                type="password"
                placeholder="Minimum 6 characters"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 h-12 text-sm sm:text-base text-[#111827] focus:outline-none focus:border-[#7567E8]"
              />
              {errors.password && <p className="text-[#DC2626] text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#374151] uppercase mb-1">
                Facility Address *
              </label>
              <input
                type="text"
                placeholder="123 Community Hub Road, City"
                {...register('address', { required: 'Address is required' })}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 h-12 text-sm sm:text-base text-[#111827] focus:outline-none focus:border-[#7567E8]"
              />
              {errors.address && <p className="text-[#DC2626] text-xs mt-1">{errors.address.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#374151] uppercase mb-1">
                Contact Phone *
              </label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                {...register('phone', { required: 'Phone is required' })}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 h-12 text-sm sm:text-base text-[#111827] focus:outline-none focus:border-[#7567E8]"
              />
              {errors.phone && <p className="text-[#DC2626] text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                disabled={createLoading}
                className="w-full sm:flex-1 h-12 rounded-xl bg-[#7567E8] hover:bg-[#7567E8]/90 text-white font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
              >
                {createLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating NGO...
                  </>
                ) : (
                  'Create NGO Account'
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-full sm:w-auto h-12 px-5 rounded-xl bg-white border border-[#E5E7EB] text-[#4B5563] text-xs font-bold hover:bg-[#F4F2FA] transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </MobileBottomSheet>

      {/* CONFIRMATION BOTTOM SHEET FOR DELETE */}
      <MobileBottomSheet
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Removal"
        maxWidthClass="max-w-md"
        icon={
          <div className="w-9 h-9 rounded-xl bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        }
      >
        <div className="space-y-4 text-center sm:text-left py-2">
          <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
            Are you sure you want to permanently delete <strong>{deleteTarget?.name}</strong>? This action will remove the organization profile and login access.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              onClick={handleDeleteConfirm}
              disabled={deleteLoading}
              className="w-full sm:flex-1 h-12 rounded-xl bg-[#DC2626] hover:bg-[#DC2626]/90 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
            >
              {deleteLoading ? 'Removing...' : 'Confirm Remove'}
            </button>
            <button
              onClick={() => setDeleteTarget(null)}
              disabled={deleteLoading}
              className="w-full sm:w-auto h-12 px-5 rounded-xl bg-white border border-[#E5E7EB] text-[#4B5563] text-xs font-bold hover:bg-[#F4F2FA] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </MobileBottomSheet>
    </div>
  );
};
