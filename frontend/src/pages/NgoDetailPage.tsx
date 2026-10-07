import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getNgoById } from '../api/ngoApi';
import { NGOProfile } from '../types';
import { Building2, ShieldCheck, MapPin, Phone, Mail, ArrowLeft, HeartHandshake, Calendar, Loader2 } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const NgoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ngo, setNgo] = useState<NGOProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getNgoById(id)
      .then(setNgo)
      .catch((err) => setError(err.message || 'Failed to load NGO profile.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#7567E8] mb-2" />
        <p className="text-[#6B7280] text-xs">Loading NGO profile...</p>
      </div>
    );
  }

  if (error || !ngo) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 rounded-2xl bg-[#FEE2E2] border border-[#FCA5A5] text-center text-[#DC2626] space-y-4">
        <p className="font-semibold text-xs sm:text-sm">{error || 'NGO profile not found.'}</p>
        <button
          onClick={() => navigate('/ngos')}
          className="px-4 py-2.5 rounded-xl bg-white text-[#111827] text-xs font-bold border border-[#E5E7EB] hover:bg-[#F4F2FA] transition-colors"
        >
          Back to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-3 sm:py-6 px-1 sm:px-0 space-y-4 sm:space-y-6">
      <button
        onClick={() => navigate('/ngos')}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#4B5563] hover:text-[#111827] transition-colors p-1 -ml-1 min-h-[40px]"
      >
        <ArrowLeft className="w-4 h-4 text-[#7567E8]" />
        Back to NGO Directory
      </button>

      {/* Main Profile Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-5 sm:p-8 shadow-xs space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E5E7EB]">
          <div className="flex items-start gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#7567E8]/10 text-[#7567E8] border border-[#7567E8]/20 flex items-center justify-center shrink-0 shadow-xs">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] leading-tight">
                  {ngo.name}
                </h1>
                {ngo.verified && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-[#6B7280] text-xs mt-1">
                Verified Community Partner &bull; Active since {formatDate(ngo.createdAt)}
              </p>
            </div>
          </div>

          <Link
            to={`/donate/new?ngoId=${ngo.id}`}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#7567E8] hover:bg-[#7567E8]/90 text-white font-extrabold text-sm shadow-md shadow-[#7567E8]/25 transition-all flex items-center justify-center gap-2 min-h-[48px] active:scale-[0.98]"
          >
            <HeartHandshake className="w-5 h-5 text-white" />
            Donate to this NGO
          </Link>
        </div>

        {/* Details Grid: Stacked on mobile, 2-cols on tablet+ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-2">
            <h2 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">
              About the Organization
            </h2>
            <p className="text-[#111827] text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              {ngo.description || 'This organization has not provided a detailed description yet.'}
            </p>
          </div>

          <div className="bg-[#FAF8F5] p-4 sm:p-5 rounded-2xl border border-[#E5E7EB] space-y-3">
            <h2 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">
              Facility & Contact
            </h2>

            <div className="space-y-2.5 text-xs text-[#111827]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#7567E8] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] text-[#6B7280] uppercase font-bold">Address</span>
                  <span>{ngo.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#7567E8] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] text-[#6B7280] uppercase font-bold">Phone</span>
                  <span>{ngo.phone}</span>
                </div>
              </div>

              {ngo.user?.email && (
                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-[#7567E8] shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] text-[#6B7280] uppercase font-bold">Email</span>
                    <span>{ngo.user.email}</span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2.5 pt-2 border-t border-[#E5E7EB]">
                <Calendar className="w-4 h-4 text-[#7567E8] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] text-[#6B7280] uppercase font-bold">Joined</span>
                  <span>{formatDate(ngo.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
