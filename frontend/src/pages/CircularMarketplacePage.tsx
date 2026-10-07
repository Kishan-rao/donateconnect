import React, { useEffect, useState } from 'react';
import { getActiveResourceTrades } from '../api/nextGenApi';
import { NgoResourceTrade } from '../types';
import { Repeat, Building2, Recycle } from 'lucide-react';
import { MobilePageHeader } from '../components/common/MobilePageHeader';

export const CircularMarketplacePage: React.FC = () => {
  const [trades, setTrades] = useState<NgoResourceTrade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveResourceTrades()
      .then((data) => setTrades(data))
      .catch(() => setTrades([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5 py-4 max-w-7xl mx-auto px-4">
      <MobilePageHeader
        title="Zero-Waste Circular Exchange"
        subtitle="Inter-NGO surplus trading board to divert textiles & e-waste from landfills"
        badge={
          <span className="text-[11px] font-bold text-[#047857] bg-[#E6F4EA] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
            {trades.length} Open Trades
          </span>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <div className="bg-white border border-[#E5E7EB] p-3 sm:p-4 rounded-2xl text-center shadow-sm">
          <div className="text-base sm:text-xl font-black text-[#047857]">1,240 kg</div>
          <div className="text-[10px] sm:text-xs text-[#6B7280] font-medium leading-tight mt-0.5">
            Textiles Diverted
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] p-3 sm:p-4 rounded-2xl text-center shadow-sm">
          <div className="text-base sm:text-xl font-black text-[#7567E8]">450 Units</div>
          <div className="text-[10px] sm:text-xs text-[#6B7280] font-medium leading-tight mt-0.5">
            E-Waste Upcycled
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] p-3 sm:p-4 rounded-2xl text-center shadow-sm">
          <div className="text-base sm:text-xl font-black text-[#111827]">12 Active</div>
          <div className="text-[10px] sm:text-xs text-[#6B7280] font-medium leading-tight mt-0.5">
            Surplus Trades
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E7EB] text-[#6B7280] text-sm shadow-sm">
          Loading inter-NGO trade listings...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trades.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                <span className="text-sm font-bold text-[#111827] flex items-center gap-2 truncate">
                  <Building2 className="w-4 h-4 text-[#7567E8] shrink-0" />
                  <span className="truncate">{t.offeringNgo.name}</span>
                </span>
                <span className="text-[10px] font-bold text-[#047857] bg-[#E6F4EA] px-2 py-0.5 rounded-full border border-[#A7F3D0] shrink-0">
                  Active Offer
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 bg-[#FAF8F5] p-3 rounded-xl border border-[#E5E7EB] text-xs">
                <div className="space-y-0.5">
                  <div className="text-[10px] uppercase font-bold text-[#6B7280]">Offering Surplus</div>
                  <div className="text-xs sm:text-sm font-extrabold text-[#7567E8]">
                    {t.offeredQuantity}x {t.offeredCategory}
                  </div>
                </div>
                <div className="space-y-0.5 border-l border-[#E5E7EB] pl-2.5">
                  <div className="text-[10px] uppercase font-bold text-[#6B7280]">In Exchange</div>
                  <div className="text-xs sm:text-sm font-extrabold text-[#047857]">
                    {t.requestedQuantity}x {t.requestedCategory}
                  </div>
                </div>
              </div>

              <button
                onClick={() => alert(`Initiated trade request with ${t.offeringNgo.name}!`)}
                className="w-full h-12 min-h-[48px] rounded-xl bg-[#7567E8] hover:bg-[#5E51CD] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all touch-manipulation"
              >
                <Repeat className="w-4 h-4" /> Propose Resource Exchange &rarr;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
