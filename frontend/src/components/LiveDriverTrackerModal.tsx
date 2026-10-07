import React, { useEffect, useState } from 'react';
import { Truck, Phone, ShieldCheck, MapPin, Clock } from 'lucide-react';
import { MobileBottomSheet } from './common/MobileBottomSheet';

interface LiveDriverTrackerModalProps {
  donationTitle: string;
  driverName: string;
  driverPhone: string;
  onClose: () => void;
}

export const LiveDriverTrackerModal: React.FC<LiveDriverTrackerModalProps> = ({
  donationTitle,
  driverName,
  driverPhone,
  onClose,
}) => {
  // Simulated GPS Coordinates animating towards destination
  const [progress, setProgress] = useState(25); // Percentage completed along route
  const [etaMinutes, setEtaMinutes] = useState(8);
  const [driverSpeed, setDriverSpeed] = useState(32); // km/h

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });

      setEtaMinutes((prev) => (prev > 1 ? prev - 1 : 1));
      setDriverSpeed(Math.floor(28 + Math.random() * 10));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <MobileBottomSheet
      isOpen={true}
      onClose={onClose}
      title="Live GPS Driver Tracker"
      subtitle="Real-time route navigation for NGO & Donor"
      icon={
        <div className="w-9 h-9 rounded-xl bg-[#7567E8]/10 border border-[#7567E8]/20 text-[#7567E8] flex items-center justify-center">
          <Truck className="w-5 h-5 animate-pulse" />
        </div>
      }
      maxWidthClass="max-w-lg"
      footer={
        <div className="flex items-center justify-end w-full gap-2">
          <button
            onClick={onClose}
            className="w-full sm:w-auto h-11 min-h-[44px] px-5 rounded-xl font-bold text-xs bg-[#F9FAFB] hover:bg-[#F4F2FA] text-[#111827] border border-[#E5E7EB] transition-colors touch-manipulation flex items-center justify-center"
          >
            Close Tracker
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Live Simulated GPS Radar Map Canvas */}
        <div className="relative bg-[#111827] border border-[#374151] rounded-2xl h-56 overflow-hidden p-4 flex flex-col justify-between shadow-inner">
          {/* Grid pattern background */}
          <div className="absolute inset-0 bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none" />

          {/* Top Status Overlay */}
          <div className="relative z-10 flex items-center justify-between bg-[#1F2937]/90 backdrop-blur-sm p-2.5 rounded-xl border border-[#374151] text-xs">
            <div className="flex items-center gap-2 text-[#34D399] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#34D399] animate-ping" />
              LIVE GPS &bull; {driverSpeed} km/h
            </div>
            <div className="text-gray-300 font-mono flex items-center gap-1 text-xs">
              <Clock className="w-3.5 h-3.5 text-[#9186F2] shrink-0" />
              <span>ETA:</span>
              <span
                className="font-extrabold tracking-wide text-[#FFFFFF] tracker-eta-value"
                style={{ color: '#FFFFFF' }}
              >
                {progress >= 100 ? 'ARRIVED!' : `${etaMinutes} Mins`}
              </span>
            </div>
          </div>

          {/* Animated Route Line & Moving Driver Pin */}
          <div className="relative z-10 my-auto py-4">
            <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 mb-2">
              <span className="flex items-center gap-1 text-gray-200">
                <MapPin className="w-3.5 h-3.5 text-[#FB7185]" /> Pickup Point
              </span>
              <span className="flex items-center gap-1 text-[#34D399]">
                <ShieldCheck className="w-3.5 h-3.5" /> NGO Hub
              </span>
            </div>

            {/* Progress Bar Track */}
            <div className="w-full h-3 bg-gray-800 rounded-full relative overflow-hidden border border-gray-700">
              <div
                className="h-full bg-gradient-to-r from-[#F43F5E] via-[#7567E8] to-[#10B981] transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Live Moving Vehicle Icon */}
            <div
              className="relative -mt-6 transition-all duration-700 ease-out flex flex-col items-center"
              style={{ left: `calc(${Math.min(progress, 90)}% - 16px)` }}
            >
              <div className="w-8 h-8 rounded-full bg-[#7567E8] border-2 border-white text-white flex items-center justify-center shadow-lg shadow-[#7567E8]/50">
                <Truck className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-[#C7D2FE] bg-[#111827] px-1.5 py-0.5 rounded border border-[#7567E8]/40 mt-0.5 whitespace-nowrap">
                {driverName.split(' ')[0]} (Live)
              </span>
            </div>
          </div>

          {/* Bottom GPS Coordinates readout */}
          <div className="relative z-10 flex items-center justify-between text-[10px] text-gray-400 font-mono border-t border-gray-800 pt-2">
            <span>Lat: 28.6139° N, Long: 77.2090° E</span>
            <span className="text-[#9186F2] font-semibold">{progress}% Route Completed</span>
          </div>
        </div>

        {/* Driver Info Card */}
        <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E5E7EB] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#7567E8]/15 border border-[#7567E8]/25 text-[#7567E8] flex items-center justify-center font-bold text-base shrink-0">
              {driverName.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-[#111827] flex items-center gap-1.5 flex-wrap">
                <span className="truncate">{driverName}</span>
                <span className="text-[10px] font-bold text-[#047857] bg-[#E6F4EA] px-2 py-0.5 rounded border border-[#A7F3D0]">
                  Verified Driver
                </span>
              </div>
              <p className="text-xs text-[#4B5563] truncate mt-0.5">Assigned: {donationTitle}</p>
            </div>
          </div>

          <a
            href={`tel:${driverPhone}`}
            className="h-11 min-h-[44px] px-4 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm touch-manipulation shrink-0"
          >
            <Phone className="w-4 h-4" /> Call Driver
          </a>
        </div>
      </div>
    </MobileBottomSheet>
  );
};
