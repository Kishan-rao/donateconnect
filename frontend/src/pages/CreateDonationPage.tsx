import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createDonation, uploadDonationPhoto } from '../api/donationApi';
import { getVerifiedNgos } from '../api/ngoApi';
import { CreateDonationRequest, NGOProfile } from '../types';
import { HeartHandshake, ArrowLeft, Send, Building2, UploadCloud, X, Loader2, Sparkles, Calendar, Tag } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { AiPhotoAnalyzer } from '../components/AiPhotoAnalyzer';

const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_PHOTO_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_PHOTOS = 5;

const getTodayInputValue = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().split('T')[0];
};

interface UploadedPhoto {
  previewUrl: string;
  serverUrl: string;
}

export const CreateDonationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedNgoId = searchParams.get('ngoId') || '';
  const preselectedCategory = searchParams.get('category') || 'CLOTHES';
  const { showSuccess, showError } = useToast();

  const [ngos, setNgos] = useState<NGOProfile[]>([]);
  const [loadingNgos, setLoadingNgos] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [showAiAnalyzer, setShowAiAnalyzer] = useState(false);
  const todayInputValue = getTodayInputValue();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateDonationRequest>({
    defaultValues: {
      ngoId: preselectedNgoId,
      category: preselectedCategory as any,
    },
  });

  const selectedCategory = watch('category');

  useEffect(() => {
    getVerifiedNgos()
      .then((data) => {
        setNgos(data);
        if (preselectedNgoId && data.some((n) => n.id === preselectedNgoId)) {
          setValue('ngoId', preselectedNgoId);
        }
      })
      .catch(() => setNgos([]))
      .finally(() => setLoadingNgos(false));
  }, [preselectedNgoId, setValue]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setPhotoError(null);
    const incomingFiles = Array.from(files);
    const remainingSlots = MAX_PHOTOS - photos.length;

    if (remainingSlots <= 0) {
      setPhotoError(`You can upload up to ${MAX_PHOTOS} photos.`);
      e.target.value = '';
      return;
    }

    const validFiles: File[] = [];

    for (const file of incomingFiles.slice(0, remainingSlots)) {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setPhotoError('Photos must be PNG, JPG, or WEBP images.');
        continue;
      }
      if (file.size > MAX_PHOTO_SIZE_BYTES) {
        setPhotoError('Each photo must be 10 MB or smaller.');
        continue;
      }
      validFiles.push(file);
    }

    if (incomingFiles.length > remainingSlots) {
      setPhotoError(`Only ${remainingSlots} more photo${remainingSlots === 1 ? '' : 's'} can be added.`);
    }

    if (validFiles.length === 0) {
      e.target.value = '';
      return;
    }

    setUploadingPhotos(true);
    const uploaded: UploadedPhoto[] = [];

    for (const file of validFiles) {
      try {
        const previewUrl = URL.createObjectURL(file);
        const serverUrl = await uploadDonationPhoto(file);
        uploaded.push({ previewUrl, serverUrl });
      } catch (err: any) {
        setPhotoError(err.message || 'Failed to upload one or more photos.');
      }
    }

    setPhotos((prev) => [...prev, ...uploaded]);
    setUploadingPhotos(false);
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      const removed = prev[index];
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
    setPhotoError(null);
  };

  const onSubmit = async (data: CreateDonationRequest) => {
    if (photos.length === 0) {
      setPhotoError('Please upload at least one clear photo of the items.');
      return;
    }

    setSubmitting(true);
    setServerError(null);
    setPhotoError(null);
    try {
      await createDonation({
        ...data,
        description: data.description?.trim(),
        photoUrls: photos.map((p) => p.serverUrl),
      });
      showSuccess('Donation request submitted successfully!');
      navigate('/donations');
    } catch (err: any) {
      const msg = err.message || 'Failed to submit donation.';
      setServerError(msg);
      showError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-3 sm:py-6 px-1 sm:px-0 space-y-4 sm:space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#4B5563] hover:text-[#111827] transition-colors p-1 -ml-1 min-h-[40px]"
      >
        <ArrowLeft className="w-4 h-4 text-[#7567E8]" />
        Back to Dashboard
      </button>

      {/* Main Form Container */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-4 sm:p-8 shadow-xs space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-[#E5E7EB]">
          <div className="w-12 h-12 rounded-2xl bg-[#7567E8]/10 text-[#7567E8] border border-[#7567E8]/20 flex items-center justify-center shrink-0 shadow-xs">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] leading-tight">
              Create Donation Request
            </h1>
            <p className="text-[#6B7280] text-xs sm:text-sm mt-0.5">
              Select an NGO partner and describe the essential items to donate
            </p>
          </div>
        </div>

        {serverError && (
          <div className="p-3.5 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] text-xs font-semibold">
            {serverError}
          </div>
        )}

        {/* AI Camera Assistant Toggle */}
        <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E5E7EB] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#111827] font-bold">
            <Sparkles className="w-4 h-4 text-[#7567E8]" />
            <span>AI Item & Category Inspector</span>
          </div>
          <button
            type="button"
            onClick={() => setShowAiAnalyzer(!showAiAnalyzer)}
            className="px-3 py-1.5 rounded-xl bg-white border border-[#E5E7EB] text-xs font-bold text-[#7567E8] hover:bg-[#F4F2FA] transition-all shadow-xs min-h-[36px]"
          >
            {showAiAnalyzer ? 'Hide AI Scanner' : 'Open AI Scanner'}
          </button>
        </div>

        {showAiAnalyzer && (
          <div className="animate-fade-in">
            <AiPhotoAnalyzer
              onCategorySuggested={(cat) => {
                setValue('category', cat);
                showSuccess(`Category auto-selected as ${cat}!`);
              }}
            />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Section 1: NGO Partner */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider">
              1. Select Verified NGO Partner *
            </label>
            {loadingNgos ? (
              <div className="text-xs text-[#6B7280] p-3.5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                Loading verified NGOs...
              </div>
            ) : ngos.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] text-xs flex items-center gap-2">
                <Building2 className="w-4 h-4 shrink-0" />
                <span>No verified NGOs available yet. Please check back soon or contact Admin.</span>
              </div>
            ) : (
              <select
                {...register('ngoId', { required: 'Please select an NGO' })}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 h-12 text-sm sm:text-base text-[#111827] focus:outline-none focus:border-[#7567E8] transition-colors"
              >
                <option value="">-- Choose Verified NGO Partner --</option>
                {ngos.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name} ({n.address})
                  </option>
                ))}
              </select>
            )}
            {errors.ngoId && (
              <p className="text-[#DC2626] text-xs mt-1">{errors.ngoId.message}</p>
            )}
          </div>

          {/* Section 2: Category & Pickup Date (Stacked on mobile, 2-cols on tablet+) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#7567E8]" />
                2. Item Category *
              </label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 h-12 text-sm sm:text-base text-[#111827] focus:outline-none focus:border-[#7567E8] transition-colors"
              >
                <option value="CLOTHES">CLOTHES & APPAREL</option>
                <option value="FOOD">FOOD & GROCERIES</option>
                <option value="BOOKS">BOOKS & EDUCATION</option>
                <option value="STATIONERY">STATIONERY & SCHOOL</option>
                <option value="TOYS">TOYS & GAMES</option>
                <option value="OTHER">OTHER RELIEF ITEMS</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#7567E8]" />
                3. Preferred Pickup Date *
              </label>
              <input
                type="date"
                min={todayInputValue}
                {...register('pickupDate', {
                  required: 'Preferred pickup date is required',
                  validate: (value) =>
                    !value || value >= todayInputValue || 'Pickup date cannot be in the past',
                })}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 h-12 text-sm sm:text-base text-[#111827] focus:outline-none focus:border-[#7567E8] transition-colors"
              />
              {errors.pickupDate && (
                <p className="text-[#DC2626] text-xs mt-1">{errors.pickupDate.message}</p>
              )}
            </div>
          </div>

          {/* Section 3: Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider">
              4. Item Description & Quantity *
            </label>
            <textarea
              rows={3}
              placeholder="Describe items in detail (e.g. 5 winter jackets in good condition, sizes M and L, washed)..."
              {...register('description', {
                required: 'Item description is required',
                validate: (value) => {
                  const trimmed = value?.trim() || '';
                  if (trimmed.length < 20) {
                    return 'Description must be at least 20 characters';
                  }
                  if (trimmed.length > 2000) {
                    return 'Description must be 2000 characters or fewer';
                  }
                  return true;
                },
              })}
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3.5 text-sm sm:text-base text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#7567E8] transition-colors resize-none"
            />
            {errors.description && (
              <p className="text-[#DC2626] text-xs mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Section 4: Item Photos (Mobile-friendly touch upload tile) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider">
                5. Item Photos * ({photos.length}/{MAX_PHOTOS})
              </label>
              <span className="text-[11px] text-[#6B7280]">
                JPG, PNG, WEBP (Max 10MB)
              </span>
            </div>

            {/* Mobile upload trigger tile */}
            <div className="border-2 border-dashed border-[#D1D5DB] hover:border-[#7567E8] rounded-2xl p-4 sm:p-6 text-center transition-colors bg-[#FAF8F5]/80 active:bg-[#F4F2FA]">
              <input
                type="file"
                id="photo-upload"
                multiple
                accept="image/png,image/jpeg,image/webp"
                onChange={handlePhotoUpload}
                disabled={uploadingPhotos}
                className="hidden"
              />
              <label
                htmlFor="photo-upload"
                className="cursor-pointer flex flex-col items-center justify-center gap-2 min-h-[72px]"
              >
                <div className="w-10 h-10 rounded-full bg-[#7567E8]/10 text-[#7567E8] flex items-center justify-center">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-[#7567E8]">
                    Tap to select or take photo
                  </span>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">
                    Clear photos help NGOs quickly verify and approve items
                  </p>
                </div>
              </label>
            </div>

            {photoError && <p className="text-[#DC2626] text-xs mt-1 font-semibold">{photoError}</p>}

            {/* Upload indicator */}
            {uploadingPhotos && (
              <div className="flex items-center gap-2 text-xs text-[#7567E8] font-bold py-1">
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading photo attachment...
              </div>
            )}

            {/* Photo Previews with easy-tap delete badges */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 pt-2">
                {photos.map((photo, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden border-2 border-[#E5E7EB] shadow-xs group"
                  >
                    <img
                      src={photo.previewUrl}
                      alt={`Item photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      aria-label="Remove photo"
                      className="absolute top-1 right-1 w-7 h-7 min-w-[28px] min-h-[28px] rounded-full bg-[#DC2626] text-white flex items-center justify-center shadow-md active:scale-90"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Action CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || uploadingPhotos || ngos.length === 0}
              className="w-full h-13 py-3.5 px-6 rounded-xl bg-[#7567E8] hover:bg-[#7567E8]/90 text-white font-extrabold text-sm shadow-md shadow-[#7567E8]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting Request...
                </>
              ) : uploadingPhotos ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading Photos...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Donation Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
