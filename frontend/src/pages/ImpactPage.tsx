import React, { useEffect, useState } from 'react';
import { getImpactMetrics } from '../api/ngoApi';
import { ImpactMetrics } from '../types';
import { BarChart3, Leaf, Droplets, Wind, Sparkles, Loader2 } from 'lucide-react';

export const ImpactPage: React.FC = () => {
  const [metrics, setMetrics] = useState<ImpactMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  // Interactive Impact Calculator State
  const [calcCategory, setCalcCategory] = useState<'CLOTHES' | 'FOOD' | 'BOOKS'>('CLOTHES');
  const [calcQuantity, setCalcQuantity] = useState<number>(10);

  useEffect(() => {
    getImpactMetrics()
      .then((data) => setMetrics(data))
      .catch(() => setMetrics(null))
      .finally(() => setLoading(false));
  }, []);

  const calculateImpact = () => {
    switch (calcCategory) {
      case 'CLOTHES':
        return {
          co2: (calcQuantity * 3.6).toFixed(1),
          water: (calcQuantity * 2700).toLocaleString(),
          desc: `Donating ${calcQuantity} garments saves ${calcQuantity * 2700} liters of water and diverts textile waste from landfills!`,
        };
      case 'FOOD':
        return {
          co2: (calcQuantity * 2.5).toFixed(1),
          water: (calcQuantity * 850).toLocaleString(),
          desc: `Providing ${calcQuantity} meals prevents ${(calcQuantity * 0.4).toFixed(1)} kg of organic landfill methane emissions.`,
        };
      case 'BOOKS':
        return {
          co2: (calcQuantity * 1.8).toFixed(1),
          water: (calcQuantity * 300).toLocaleString(),
          desc: `Sharing ${calcQuantity} textbooks empowers students with lifelong literacy and saves pulp resources.`,
        };
      default:
        return { co2: '0', water: '0', desc: '' };
    }
  };

  const calculated = calculateImpact();

  return (
    <div className="space-y-4 sm:space-y-6 py-3 sm:py-6 max-w-5xl mx-auto">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-white rounded-3xl border border-[#E5E7EB] p-5 sm:p-8 shadow-xs">
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-widest bg-[#ECFDF5] text-[#047857] px-3 py-1 rounded-full border border-[#A7F3D0] inline-flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-[#059669]" /> Community & Environmental Metrics
          </span>
          <h1 className="text-xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Impact Analytics & Sustainability
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5563] max-w-2xl leading-relaxed">
            Real-time tracking of community donations, active NGO relief drives, and estimated carbon offset achieved through zero-waste item reuse.
          </p>
        </div>
      </div>

      {/* Global Stat Cards Grid (2-column on mobile, 5 on lg) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-4">
        <div className="bg-white border border-[#E5E7EB] p-3.5 sm:p-4 rounded-2xl text-center shadow-xs">
          <div className="text-xl sm:text-2xl font-extrabold text-[#7567E8] mb-0.5">
            {loading ? '...' : metrics?.totalDonations || 0}
          </div>
          <div className="text-[10px] sm:text-xs text-[#6B7280] font-bold uppercase tracking-wider">
            Total Donations
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] p-3.5 sm:p-4 rounded-2xl text-center shadow-xs">
          <div className="text-xl sm:text-2xl font-extrabold text-[#059669] mb-0.5">
            {loading ? '...' : metrics?.deliveredDonations || 0}
          </div>
          <div className="text-[10px] sm:text-xs text-[#6B7280] font-bold uppercase tracking-wider">
            Items Delivered
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] p-3.5 sm:p-4 rounded-2xl text-center shadow-xs">
          <div className="text-xl sm:text-2xl font-extrabold text-[#7567E8] mb-0.5">
            {loading ? '...' : metrics?.totalNgosSupported || 0}
          </div>
          <div className="text-[10px] sm:text-xs text-[#6B7280] font-bold uppercase tracking-wider">
            NGO Partners
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] p-3.5 sm:p-4 rounded-2xl text-center shadow-xs">
          <div className="text-xl sm:text-2xl font-extrabold text-[#D97706] mb-0.5">
            {loading ? '...' : metrics?.totalActiveDonors || 0}
          </div>
          <div className="text-[10px] sm:text-xs text-[#6B7280] font-bold uppercase tracking-wider">
            Active Donors
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] p-3.5 sm:p-4 rounded-2xl text-center shadow-xs col-span-2 lg:col-span-1">
          <div className="text-xl sm:text-2xl font-extrabold text-[#DC2626] mb-0.5">
            {loading ? '...' : `${metrics?.estimatedCo2SavedKg || 0} kg`}
          </div>
          <div className="text-[10px] sm:text-xs text-[#6B7280] font-bold uppercase tracking-wider">
            CO₂ Offset
          </div>
        </div>
      </div>

      {/* Main Content Grid: Category Breakdown + Calculator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Distribution Chart */}
        <div className="bg-white border border-[#E5E7EB] p-4 sm:p-6 rounded-2xl shadow-xs space-y-4">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-[#111827] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#7567E8]" />
              Donations by Category
            </h3>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Distribution across community relief categories
            </p>
          </div>

          <div className="space-y-3.5 pt-1">
            {metrics?.donationsByCategory &&
              Object.entries(metrics.donationsByCategory).map(([cat, count]) => {
                const total = metrics.totalDonations || 1;
                const percentage = Math.round((count / total) * 100);
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#111827]">{cat}</span>
                      <span className="text-[#7567E8]">
                        {count} items ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#F3F4F6] h-2 rounded-full overflow-hidden border border-[#E5E7EB]">
                      <div
                        className="bg-[#7567E8] h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Interactive Impact Calculator */}
        <div className="bg-white border border-[#E5E7EB] p-4 sm:p-6 rounded-2xl shadow-xs space-y-4">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-[#111827] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7567E8]" />
              Interactive Impact Calculator
            </h3>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Estimate environmental savings prior to donating
            </p>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-[#374151] uppercase mb-1">
                Category
              </label>
              <select
                value={calcCategory}
                onChange={(e) => setCalcCategory(e.target.value as any)}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3.5 h-12 text-sm text-[#111827] focus:outline-none focus:border-[#7567E8]"
              >
                <option value="CLOTHES">Clothes & Apparel</option>
                <option value="FOOD">Food & Groceries</option>
                <option value="BOOKS">Books & Learning Materials</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#111827] mb-1">
                <span>Quantity: {calcQuantity} Items / Servings</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={calcQuantity}
                onChange={(e) => setCalcQuantity(Number(e.target.value))}
                className="w-full accent-[#7567E8] h-8 cursor-pointer"
              />
            </div>

            <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E5E7EB] space-y-2">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-white p-2.5 rounded-xl border border-[#E5E7EB]">
                  <div className="text-[10px] text-[#6B7280] uppercase font-bold flex items-center justify-center gap-1">
                    <Wind className="w-3 h-3 text-[#059669]" /> CO₂ Saved
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-[#059669] mt-0.5">
                    {calculated.co2} kg
                  </div>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-[#E5E7EB]">
                  <div className="text-[10px] text-[#6B7280] uppercase font-bold flex items-center justify-center gap-1">
                    <Droplets className="w-3 h-3 text-[#0284C7]" /> Water Saved
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-[#7567E8] mt-0.5">
                    {calculated.water} L
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-[#4B5563] text-center italic">{calculated.desc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
