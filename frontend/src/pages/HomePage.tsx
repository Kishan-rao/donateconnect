import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getVerifiedNgos } from '../api/ngoApi';
import { NGOProfile } from '../types';
import { UrgentNeedsBanner } from '../components/UrgentNeedsBanner';
import {
  HeartHandshake,
  ArrowRight,
  Zap,
  Building2,
  ShieldCheck,
  MapPin,
  Phone,
  BarChart3,
  Loader2,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [ngos, setNgos] = useState<NGOProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVerifiedNgos()
      .then((data: NGOProfile[]) => setNgos(data.slice(0, 3)))
      .catch(() => setNgos([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 sm:space-y-10 py-3 sm:py-6">
      {/* Urgent Appeal Campaigns Banner */}
      <UrgentNeedsBanner />

      {/* Hero Section: Mobile-First Android Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-[#E5E7EB] p-5 sm:p-8 md:p-12 shadow-xs">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-[#7567E8]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-[#E36A9A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7567E8]/10 border border-[#7567E8]/20 text-[11px] font-bold text-[#7567E8]">
            <Zap className="w-3.5 h-3.5" />
            <span>Verified Community Giving Platform</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#111827] leading-tight">
            Connecting Generosity With{' '}
            <span className="text-[#7567E8]">Verified NGOs</span>
          </h1>

          <p className="text-xs sm:text-base leading-relaxed text-[#4B5563] max-w-xl mx-auto">
            DonateConnect empowers donors to share clothes, food, books, and essential goods with verified non-profits, track deliveries with live GPS, and support communities.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 pt-2">
            <Link
              to="/donate/new"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#7567E8] hover:bg-[#7567E8]/90 text-white font-extrabold text-sm shadow-md shadow-[#7567E8]/25 transition-all flex items-center justify-center gap-2 min-h-[48px] active:scale-[0.98]"
            >
              <HeartHandshake className="w-5 h-5 text-white" />
              Start a Donation
            </Link>
            <Link
              to="/impact"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-[#111827] font-bold text-sm hover:bg-[#F4F2FA] transition-colors border border-[#E5E7EB] flex items-center justify-center gap-2 shadow-xs min-h-[48px] active:scale-[0.98]"
            >
              <BarChart3 className="w-4 h-4 text-[#7567E8]" />
              View Impact Report <ArrowRight className="w-4 h-4 text-[#4B5563]" />
            </Link>
          </div>
        </div>
      </section>

      {/* Verified NGOs Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-[#111827] flex items-center gap-2">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#7567E8]" />
              Verified NGO Partners
            </h2>
            <p className="text-[#6B7280] text-xs sm:text-sm mt-0.5">
              Verified non-profit organizations accepting community relief
            </p>
          </div>

          <Link
            to="/ngos"
            className="text-xs font-bold text-[#7567E8] hover:underline flex items-center gap-1 min-h-[40px]"
          >
            View All &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-2">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#7567E8]" />
            <p className="text-[#6B7280] text-xs">Loading verified partners...</p>
          </div>
        ) : ngos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#E5E7EB] space-y-2 shadow-xs p-5">
            <Building2 className="w-10 h-10 text-[#9CA3AF] mx-auto" />
            <h3 className="text-[#111827] font-bold text-sm">No verified NGOs registered yet</h3>
            <p className="text-[#6B7280] text-xs max-w-sm mx-auto">
              Admins can register and verify non-profit partners from the admin dashboard.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5">
            {ngos.map((ngo) => (
              <div
                key={ngo.id}
                className="bg-white border border-[#E5E7EB] hover:border-[#7567E8]/40 rounded-2xl p-4 sm:p-5 transition-all flex flex-col justify-between shadow-xs space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified NGO
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-[#111827] mb-1">{ngo.name}</h3>
                  <p className="text-[#4B5563] text-xs leading-relaxed line-clamp-2">
                    {ngo.description || 'Verified non-governmental partner organization.'}
                  </p>
                </div>

                <div className="border-t border-[#E5E7EB] pt-3 space-y-1.5 text-xs text-[#6B7280]">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#7567E8] shrink-0" />
                    <span>{ngo.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#7567E8] shrink-0" />
                    <span>{ngo.phone}</span>
                  </div>

                  <div className="pt-2">
                    <Link
                      to={`/donate/new?ngoId=${ngo.id}`}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#FAF8F5] hover:bg-[#7567E8] text-[#7567E8] hover:text-white font-bold text-xs border border-[#E5E7EB] transition-colors flex items-center justify-center gap-1.5 min-h-[44px] active:scale-95"
                    >
                      <HeartHandshake className="w-4 h-4" />
                      Donate to {ngo.name.split(' ')[0]}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
