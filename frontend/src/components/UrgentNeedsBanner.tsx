import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getActiveUrgentNeeds } from '../api/ngoApi';
import { NgoUrgentNeed } from '../types';

export const UrgentNeedsBanner: React.FC = () => {
  const [urgentNeeds, setUrgentNeeds] = useState<NgoUrgentNeed[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveUrgentNeeds()
      .then((data) => setUrgentNeeds(data))
      .catch(() => setUrgentNeeds([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || urgentNeeds.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-[#FEF2F2] border-y border-[#FCA5A5] py-5 px-4 mb-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center space-x-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DC2626] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#DC2626]"></span>
            </span>
            <h3 className="text-base font-extrabold text-[#111827] tracking-tight flex items-center gap-2">
              🚨 Urgent NGO Appeal Drives
            </h3>
          </div>
          <span className="text-[11px] font-bold text-[#DC2626] bg-[#FEE2E2] px-3 py-1 rounded-full border border-[#FCA5A5] self-start sm:self-auto">
            {urgentNeeds.length} Active Urgent Campaigns
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {urgentNeeds.map((need) => (
            <div
              key={need.id}
              className="bg-white p-4 rounded-2xl border border-[#FCA5A5]/60 hover:border-[#DC2626] transition-all flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FEE2E2] text-[#DC2626] px-2 py-0.5 rounded border border-[#FCA5A5]">
                    {need.category}
                  </span>
                  <span className="text-xs text-[#6B7280] font-semibold truncate">
                    {need.ngo.name}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#111827] mb-1 line-clamp-1">{need.title}</h4>
                <p className="text-xs text-[#4B5563] mb-3 line-clamp-2 leading-relaxed">{need.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-[#E5E7EB] gap-2">
                <span className="text-[11px] text-[#6B7280] truncate">📍 {need.ngo.address}</span>
                <Link
                  to={`/donate/new?ngoId=${need.ngo.id}&category=${need.category}`}
                  className="h-10 min-h-[40px] px-3.5 rounded-xl text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] transition-all shadow-sm shrink-0 flex items-center gap-1 touch-manipulation"
                >
                  Donate &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
