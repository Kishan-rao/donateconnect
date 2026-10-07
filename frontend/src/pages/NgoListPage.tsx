import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVerifiedNgos } from '../api/ngoApi';
import { NGOProfile } from '../types';
import { Building2, Search, ShieldCheck, MapPin, Phone, ArrowRight, HeartHandshake, Loader2 } from 'lucide-react';

export const NgoListPage: React.FC = () => {
  const navigate = useNavigate();
  const [ngos, setNgos] = useState<NGOProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchNgos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVerifiedNgos();
      setNgos(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load NGO partners.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNgos();
  }, []);

  const filteredNgos = ngos.filter(
    (ngo) =>
      ngo.name.toLowerCase().includes(search.toLowerCase()) ||
      (ngo.description && ngo.description.toLowerCase().includes(search.toLowerCase())) ||
      ngo.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6 py-3 sm:py-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#111827] tracking-tight flex items-center gap-2.5">
          <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#7567E8]" />
          Verified NGO Partners
        </h1>
        <p className="text-[#6B7280] text-xs sm:text-sm mt-0.5">
          Discover verified non-profit organizations accepting donations
        </p>
      </div>

      {/* Search Input (48px touch target with 16px text) */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Search NGO by name, city, or cause..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-[#E5E7EB] rounded-2xl pl-10 pr-4 h-12 text-sm sm:text-base text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#7567E8] transition-colors shadow-xs"
        />
      </div>

      {/* NGO Grid */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs space-y-2">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#7567E8]" />
          <p className="text-[#6B7280] text-xs font-medium">Fetching verified partners...</p>
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
      ) : filteredNgos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E7EB] space-y-3 p-6 shadow-xs">
          <Building2 className="w-12 h-12 text-[#9CA3AF] mx-auto" />
          <h3 className="text-[#111827] font-extrabold text-base">No verified NGOs found</h3>
          <p className="text-[#6B7280] text-xs max-w-sm mx-auto">
            {ngos.length === 0
              ? 'No verified NGO profiles are registered in the system yet.'
              : 'Try clearing or modifying your search filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
          {filteredNgos.map((ngo) => (
            <div
              key={ngo.id}
              className="bg-white border border-[#E5E7EB] hover:border-[#7567E8]/40 rounded-2xl p-4 sm:p-5 transition-all flex flex-col justify-between shadow-xs space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-[#111827] mb-1">{ngo.name}</h3>
                <p className="text-[#4B5563] text-xs leading-relaxed line-clamp-2">
                  {ngo.description || 'Verified non-governmental organization.'}
                </p>
              </div>

              <div className="border-t border-[#E5E7EB] pt-3 space-y-2 text-xs text-[#6B7280]">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-[#7567E8] shrink-0" />
                  <span>{ngo.address}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#7567E8] shrink-0" />
                  <span>{ngo.phone}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => navigate(`/ngos/${ngo.id}`)}
                    className="py-2.5 px-3 rounded-xl bg-white hover:bg-[#F4F2FA] text-[#111827] border border-[#E5E7EB] font-bold text-xs transition-colors flex items-center justify-center gap-1 min-h-[44px] active:scale-95"
                  >
                    Details <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => navigate(`/donate/new?ngoId=${ngo.id}`)}
                    className="py-2.5 px-3 rounded-xl bg-[#7567E8] hover:bg-[#7567E8]/90 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 min-h-[44px] active:scale-95 shadow-xs"
                  >
                    <HeartHandshake className="w-3.5 h-3.5" />
                    Donate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
