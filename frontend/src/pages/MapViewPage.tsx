import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getVerifiedNgos } from '../api/ngoApi';
import { NGOProfile } from '../types';
import { MapPin, Phone, Building2, ShieldCheck, HeartHandshake, Navigation, List, Map as MapIcon, Loader2 } from 'lucide-react';

export const MapViewPage: React.FC = () => {
  const [ngos, setNgos] = useState<NGOProfile[]>([]);
  const [selectedNgo, setSelectedNgo] = useState<NGOProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');

  useEffect(() => {
    getVerifiedNgos()
      .then((data) => {
        setNgos(data);
        if (Array.isArray(data) && data.length > 0) setSelectedNgo(data[0]);
      })
      .catch(() => setNgos([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6 py-3 sm:py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#111827] tracking-tight flex items-center gap-2.5">
          <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-[#7567E8]" />
          NGO & Pickup Hub Map
        </h1>
        <p className="text-[#6B7280] text-xs sm:text-sm mt-0.5">
          Locate verified non-profit partners and collection centers across India
        </p>
      </div>

      {/* Mobile View Switcher (Visible under lg) */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB] lg:hidden">
        <button
          onClick={() => setMobileView('list')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all min-h-[44px] active:scale-95 ${
            mobileView === 'list'
              ? 'bg-[#7567E8] text-white shadow-xs'
              : 'text-[#4B5563] hover:text-[#111827]'
          }`}
        >
          <List className="w-4 h-4" />
          Hub Directory ({ngos.length})
        </button>
        <button
          onClick={() => setMobileView('map')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all min-h-[44px] active:scale-95 ${
            mobileView === 'map'
              ? 'bg-[#7567E8] text-white shadow-xs'
              : 'text-[#4B5563] hover:text-[#111827]'
          }`}
        >
          <MapIcon className="w-4 h-4" />
          Map Radar View
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* NGO Directory Sidebar (Shown on mobile if mobileView === 'list', always on lg) */}
        <div
          className={`bg-white border border-[#E5E7EB] rounded-3xl p-4 flex flex-col h-[480px] sm:h-[540px] shadow-xs ${
            mobileView === 'list' ? 'block' : 'hidden lg:flex'
          }`}
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E5E7EB]">
            <span className="text-xs font-extrabold text-[#111827]">
              Verified Hub Partners ({ngos.length})
            </span>
            <span className="text-[10px] bg-[#ECFDF5] text-[#047857] px-2 py-0.5 rounded font-bold border border-[#A7F3D0]">
              Active GPS
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {loading ? (
              <div className="text-center py-16 text-xs text-[#6B7280]">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#7567E8] mb-2" />
                Loading map markers...
              </div>
            ) : ngos.length === 0 ? (
              <div className="text-center py-16 text-xs text-[#6B7280]">
                No verified NGOs found.
              </div>
            ) : (
              ngos.map((ngo) => (
                <div
                  key={ngo.id}
                  onClick={() => {
                    setSelectedNgo(ngo);
                    setMobileView('map');
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer min-h-[48px] active:scale-[0.98] ${
                    selectedNgo?.id === ngo.id
                      ? 'bg-[#7567E8]/10 border-[#7567E8] shadow-xs'
                      : 'bg-[#FAF8F5] border-[#E5E7EB] hover:border-[#D1D5DB]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs sm:text-sm font-extrabold text-[#111827] truncate">
                      {ngo.name}
                    </h4>
                    <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0" />
                  </div>
                  <p className="text-xs text-[#6B7280] line-clamp-1 mb-2">{ngo.address}</p>
                  <div className="flex items-center justify-between text-[11px] text-[#7567E8] font-bold">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {ngo.phone}
                    </span>
                    <span className="text-[#059669]">View Hub &rarr;</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Visual Simulated Map Display (Shown on mobile if mobileView === 'map', always on lg) */}
        <div
          className={`lg:col-span-2 bg-white border border-[#E5E7EB] rounded-3xl p-4 sm:p-6 relative overflow-hidden flex flex-col justify-between min-h-[480px] sm:min-h-[540px] shadow-xs ${
            mobileView === 'map' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Top Info Bar */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#FAF8F5] p-3 rounded-2xl border border-[#E5E7EB] mb-4">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#7567E8] animate-pulse" />
              <span className="text-xs font-bold text-[#111827]">
                {selectedNgo ? `Selected Hub: ${selectedNgo.name}` : 'Select a hub from directory'}
              </span>
            </div>
            <span className="text-[10px] text-[#6B7280] font-mono">
              GPS: 28.6139° N, 77.2090° E (Metro Hub Node)
            </span>
          </div>

          {/* Interactive Pin Showcase Canvas */}
          <div className="relative z-10 flex-1 bg-[#FAF8F5] rounded-2xl border border-[#E5E7EB] p-4 sm:p-6 flex flex-col justify-center items-center text-center">
            {selectedNgo ? (
              <div className="max-w-md w-full bg-white p-5 sm:p-6 rounded-2xl border border-[#7567E8]/20 shadow-lg space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#7567E8]/10 text-[#7567E8] border border-[#7567E8]/20 flex items-center justify-center mx-auto">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#059669] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
                    Verified Relief Center
                  </span>
                  <h3 className="text-lg font-extrabold text-[#111827] mt-2 mb-1">
                    {selectedNgo.name}
                  </h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed line-clamp-2">
                    {selectedNgo.description || 'Verified non-profit partner collection hub.'}
                  </p>
                </div>

                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E5E7EB] text-xs text-[#4B5563] text-left space-y-1">
                  <div>📍 <strong>Address:</strong> {selectedNgo.address}</div>
                  <div>📞 <strong>Phone:</strong> {selectedNgo.phone}</div>
                </div>

                <Link
                  to={`/donate/new?ngoId=${selectedNgo.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#7567E8] hover:bg-[#7567E8]/90 text-white font-bold text-xs shadow-xs min-h-[44px] active:scale-[0.98]"
                >
                  <HeartHandshake className="w-4 h-4 text-white" />
                  Schedule Direct Donation Pickup &rarr;
                </Link>
              </div>
            ) : (
              <div className="text-[#6B7280] text-xs">
                Select an NGO partner pin to view hub dispatch coordinates
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
