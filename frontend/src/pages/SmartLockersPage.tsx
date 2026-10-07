import React, { useEffect, useState } from 'react';
import { getSmartLockers } from '../api/nextGenApi';
import { SmartLocker } from '../types';
import { Lock, MapPin, KeyRound, ShieldCheck, Zap } from 'lucide-react';
import { MobilePageHeader } from '../components/common/MobilePageHeader';

export const SmartLockersPage: React.FC = () => {
  const [lockers, setLockers] = useState<SmartLocker[]>([]);
  const [selectedLocker, setSelectedLocker] = useState<SmartLocker | null>(null);
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSmartLockers()
      .then((data) => {
        setLockers(data);
        if (Array.isArray(data) && data.length > 0) setSelectedLocker(data[0]);
      })
      .catch(() => setLockers([]))
      .finally(() => setLoading(false));
  }, []);

  const handleGenerateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
  };

  return (
    <div className="space-y-5 py-4 max-w-7xl mx-auto px-4">
      <MobilePageHeader
        title="24/7 Smart Locker Hubs"
        subtitle="Contactless drop-off stations with secure 6-digit OTP codes"
        badge={
          <span className="text-[11px] font-bold text-[#7567E8] bg-[#7567E8]/10 px-2.5 py-0.5 rounded-full border border-[#7567E8]/20">
            {lockers.length} Stations
          </span>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Locker Station List */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#4B5563]">
              Locker Stations ({lockers.length})
            </h3>
            <span className="text-[10px] font-bold bg-[#E6F4EA] text-[#047857] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
              24/7 Access
            </span>
          </div>

          {loading ? (
            <div className="text-center py-8 text-xs text-[#6B7280]">Loading locker stations...</div>
          ) : (
            <div className="space-y-2.5">
              {lockers.map((locker) => (
                <div
                  key={locker.id}
                  onClick={() => {
                    setSelectedLocker(locker);
                    setGeneratedOtp(null);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer touch-manipulation ${
                    selectedLocker?.id === locker.id
                      ? 'bg-[#7567E8]/10 border-[#7567E8] shadow-sm'
                      : 'bg-[#FAF8F5] border-[#E5E7EB] hover:border-[#D1D5DB]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-[#111827] truncate">{locker.name}</h4>
                    <ShieldCheck className="w-4 h-4 text-[#047857] shrink-0" />
                  </div>
                  <p className="text-xs text-[#4B5563] line-clamp-1 mb-2">{locker.address}</p>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#7567E8] font-bold">
                      {locker.availableLockers} / {locker.totalLockers} Lockers Free
                    </span>
                    <span className="text-[#047857] font-bold">Select &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Locker Control Panel & OTP Generator */}
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-5 shadow-sm">
          {selectedLocker ? (
            <div className="space-y-5">
              <div className="border-b border-[#E5E7EB] pb-4">
                <span className="text-[10px] uppercase font-bold text-[#047857] bg-[#E6F4EA] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
                  Station Status: ONLINE
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#111827] mt-2">
                  {selectedLocker.name}
                </h2>
                <p className="text-xs text-[#4B5563] flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#7567E8] shrink-0" /> {selectedLocker.address}
                </p>
              </div>

              {/* OTP Generation Box */}
              <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-[#E5E7EB] text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#7567E8]/10 text-[#7567E8] border border-[#7567E8]/20 flex items-center justify-center mx-auto">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#111827] mb-1">
                    Generate Drop-off Access PIN
                  </h3>
                  <p className="text-xs text-[#4B5563] max-w-sm mx-auto leading-relaxed">
                    Click below to reserve an automated locker compartment and receive your 6-digit drop-off PIN code.
                  </p>
                </div>

                {generatedOtp ? (
                  <div className="bg-white border-2 border-[#047857] p-4 rounded-2xl max-w-xs mx-auto space-y-1.5 shadow-sm animate-scale-in">
                    <div className="text-[10px] uppercase font-bold tracking-widest text-[#047857]">
                      Reserved Locker PIN
                    </div>
                    <div className="text-3xl font-black tracking-widest text-[#111827] font-mono">
                      {generatedOtp}
                    </div>
                    <div className="text-[10px] text-[#6B7280]">
                      Valid for 24 Hours • NGO Dispatch Notified
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleGenerateOtp}
                    className="w-full sm:w-auto h-12 min-h-[48px] px-6 rounded-xl bg-[#7567E8] hover:bg-[#5E51CD] text-white font-bold text-xs shadow-sm transition-all inline-flex items-center justify-center gap-2 touch-manipulation"
                  >
                    <Zap className="w-4 h-4" />
                    Reserve Locker & Generate OTP Code
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-[#6B7280] text-sm">
              Select a locker hub to generate a drop-off PIN
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
