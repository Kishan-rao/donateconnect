import React, { useEffect, useState } from 'react';
import { getCorporateDrives } from '../api/corporateApi';
import { CorporateDrive } from '../types';
import { Building2, Calendar, Target, Award, Download, CheckCircle2, Loader2 } from 'lucide-react';

export const CorporateDashboardPage: React.FC = () => {
  const [drives, setDrives] = useState<CorporateDrive[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCorporateDrives()
      .then((data) => setDrives(data))
      .catch(() => setDrives([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6 py-3 sm:py-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#111827] tracking-tight flex items-center gap-2.5">
            <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#7567E8]" />
            Corporate CSR Hub
          </h1>
          <p className="text-[#6B7280] text-xs sm:text-sm mt-0.5">
            Enterprise CSR donation drives, sustainability metrics, and ESG compliance tracking
          </p>
        </div>

        <button
          onClick={() => alert('Exporting ESG & CSR Audit Compliance PDF Report...')}
          className="px-4 py-2.5 rounded-xl bg-[#7567E8] hover:bg-[#7567E8]/90 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs self-start sm:self-auto min-h-[44px] active:scale-[0.98]"
        >
          <Download className="w-4 h-4 text-white" />
          Export CSR Report
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E7EB] text-[#6B7280] text-xs font-medium space-y-2 shadow-xs">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#7567E8]" />
          <p>Loading corporate CSR campaign drives...</p>
        </div>
      ) : drives.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E7EB] space-y-3 p-6 shadow-xs">
          <Building2 className="w-12 h-12 text-[#9CA3AF] mx-auto" />
          <h3 className="text-[#111827] font-extrabold text-base">No active corporate CSR drives</h3>
          <p className="text-[#6B7280] text-xs max-w-sm mx-auto">
            Corporate accounts can organize employee donation drives and track real-time impact.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {drives.map((drive) => {
            const progress = Math.min(
              100,
              Math.round((drive.collectedItemCount / drive.targetItemCount) * 100)
            );
            return (
              <div
                key={drive.id}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 space-y-4 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E7EB] pb-3.5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7567E8] bg-[#7567E8]/10 px-2.5 py-0.5 rounded-lg border border-[#7567E8]/20">
                      {drive.companyName}
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#111827] mt-1">
                      {drive.campaignTitle}
                    </h3>
                  </div>
                  <div className="text-xs text-[#6B7280] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#7567E8]" />
                    <span>
                      {drive.startDate} &mdash; {drive.endDate}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#4B5563] leading-relaxed">{drive.description}</p>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#6B7280]">Campaign Goal Progress</span>
                    <span className="text-[#7567E8] font-bold">
                      {drive.collectedItemCount} / {drive.targetItemCount} Items ({progress}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#F3F4F6] h-3 rounded-full overflow-hidden border border-[#E5E7EB]">
                    <div
                      className="bg-gradient-to-r from-[#7567E8] to-[#059669] h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Metrics 3-grid */}
                <div className="grid grid-cols-3 gap-2.5 pt-1 text-center text-xs">
                  <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E5E7EB]">
                    <div className="text-[10px] text-[#6B7280] uppercase font-bold">Donated</div>
                    <div className="text-base font-extrabold text-[#111827] mt-0.5">
                      {drive.collectedItemCount}
                    </div>
                  </div>
                  <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E5E7EB]">
                    <div className="text-[10px] text-[#6B7280] uppercase font-bold">CO₂ Offset</div>
                    <div className="text-base font-extrabold text-[#059669] mt-0.5">
                      {(drive.collectedItemCount * 4.2).toFixed(1)} kg
                    </div>
                  </div>
                  <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E5E7EB]">
                    <div className="text-[10px] text-[#6B7280] uppercase font-bold">Status</div>
                    <div className="text-[11px] font-extrabold text-[#7567E8] mt-1 uppercase">
                      Active
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
