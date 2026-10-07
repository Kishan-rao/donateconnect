import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getOwnNgoProfile, updateOwnNgoProfile } from '../api/ngoApi';
import { NGOProfile, UpdateNgoProfileDto } from '../types';
import { Building2, ShieldCheck, MapPin, Phone, Save, CheckCircle2, Loader2 } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const NgoProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<NGOProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateNgoProfileDto>();

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOwnNgoProfile();
      setProfile(data);
      setValue('name', data.name);
      setValue('description', data.description || '');
      setValue('address', data.address);
      setValue('phone', data.phone);
    } catch (err: any) {
      setError(err.message || 'Failed to load NGO profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onSubmit = async (data: UpdateNgoProfileDto) => {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const updated = await updateOwnNgoProfile(data);
      setProfile(updated);
      setSuccessMessage('Organization profile updated successfully!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#7567E8] mb-2" />
        <p className="text-[#6B7280] text-xs">Loading your NGO profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-3 sm:py-6 px-1 sm:px-0 space-y-4">
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 sm:p-8 shadow-xs space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-3.5 pb-5 border-b border-[#E5E7EB]">
          <div className="w-13 h-13 rounded-2xl bg-[#7567E8]/10 text-[#7567E8] border border-[#7567E8]/20 flex items-center justify-center shrink-0 shadow-xs">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] leading-tight">
                {profile?.name}
              </h1>
              {profile?.verified && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              )}
            </div>
            <p className="text-[#6B7280] text-xs mt-0.5">
              Account Email: {profile?.user?.email} &bull; Joined {formatDate(profile?.createdAt || '')}
            </p>
          </div>
        </div>

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
              Organization Name *
            </label>
            <input
              type="text"
              {...register('name', { required: 'NGO Name is required' })}
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 h-12 text-sm sm:text-base text-[#111827] focus:outline-none focus:border-[#7567E8] transition-colors"
            />
            {errors.name && (
              <p className="text-[#DC2626] text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
              Facility Address *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                {...register('address', { required: 'Address is required' })}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-10 pr-4 h-12 text-sm sm:text-base text-[#111827] focus:outline-none focus:border-[#7567E8] transition-colors"
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
                {...register('phone', { required: 'Phone is required' })}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-10 pr-4 h-12 text-sm sm:text-base text-[#111827] focus:outline-none focus:border-[#7567E8] transition-colors"
              />
            </div>
            {errors.phone && (
              <p className="text-[#DC2626] text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">
              Organization Mission & Description
            </label>
            <textarea
              rows={3}
              {...register('description')}
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3.5 text-sm sm:text-base text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#7567E8] transition-colors resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full h-12 px-6 rounded-xl bg-[#7567E8] hover:bg-[#7567E8]/90 text-white font-extrabold text-sm shadow-md shadow-[#7567E8]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Organization Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
