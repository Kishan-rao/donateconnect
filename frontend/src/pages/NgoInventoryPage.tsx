import React, { useEffect, useState } from 'react';
import { getNgoAssignedDonations } from '../api/donationApi';
import { Category, Donation } from '../types';
import { PackageCheck, Shirt, Utensils, BookOpen, PenTool, Gamepad2, Box, RefreshCw, BarChart3, Loader2 } from 'lucide-react';

export const NgoInventoryPage: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const pageResponse = await getNgoAssignedDonations(0, 100);
      const data = pageResponse.content;
      // Filter strictly for DELIVERED items
      setDonations(data.filter((d) => d.status === 'DELIVERED'));
    } catch (err: any) {
      setError(err.message || 'Failed to load inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const categoriesList: { category: Category; label: string; icon: React.FC<{ className?: string }> }[] = [
    { category: 'CLOTHES', label: 'Clothes & Apparel', icon: Shirt },
    { category: 'FOOD', label: 'Food & Groceries', icon: Utensils },
    { category: 'BOOKS', label: 'Books & Literacy', icon: BookOpen },
    { category: 'STATIONERY', label: 'School Supplies', icon: PenTool },
    { category: 'TOYS', label: 'Toys & Children', icon: Gamepad2 },
    { category: 'OTHER', label: 'Other Relief Items', icon: Box },
  ];

  const getCountByCategory = (cat: Category) => {
    return donations.filter((d) => d.category === cat).length;
  };

  const totalDelivered = donations.length;

  return (
    <div className="space-y-4 sm:space-y-6 py-3 sm:py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#111827] tracking-tight flex items-center gap-2.5">
            <PackageCheck className="w-6 h-6 sm:w-8 sm:h-8 text-[#059669]" />
            Relief Inventory Summary
          </h1>
          <p className="text-[#6B7280] text-xs sm:text-sm mt-0.5">
            Breakdown of delivered and verified items received by your organization
          </p>
        </div>

        <button
          onClick={fetchInventory}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-white text-[#4B5563] hover:text-[#111827] hover:bg-[#F4F2FA] transition-colors border border-[#E5E7EB] shadow-xs flex items-center gap-2 text-xs font-bold min-h-[44px] active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Overview Banner: Compact on mobile */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7567E8]">
            Total Items Received
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#111827]">{totalDelivered}</div>
          <p className="text-xs text-[#6B7280]">Fully delivered & verified items</p>
        </div>

        <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#E5E7EB] flex items-center gap-2.5 text-xs text-[#4B5563]">
          <BarChart3 className="w-6 h-6 text-[#059669] shrink-0" />
          <span>Real-time category breakdown based on incoming deliveries</span>
        </div>
      </div>

      {/* Loading / Error / Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border border-[#E5E7EB] rounded-2xl p-4 h-28 animate-pulse shadow-xs" />
          ))}
        </div>
      ) : error ? (
        <div className="p-5 rounded-2xl bg-[#FEE2E2] border border-[#FCA5A5] text-center text-[#DC2626] space-y-2">
          <p className="font-semibold text-xs">{error}</p>
          <button
            onClick={fetchInventory}
            className="px-3.5 py-1.5 rounded-xl bg-[#DC2626] text-white text-xs font-bold"
          >
            Retry Loading
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {categoriesList.map(({ category, label, icon: Icon }) => {
            const count = getCountByCategory(category);
            const percentage = totalDelivered > 0 ? Math.round((count / totalDelivered) * 100) : 0;

            return (
              <div
                key={category}
                className="bg-white border border-[#E5E7EB] hover:border-[#7567E8]/40 rounded-2xl p-3.5 sm:p-5 shadow-xs space-y-2.5 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-[#7567E8]/10 text-[#7567E8]">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-xl sm:text-2xl font-extrabold text-[#111827]">{count}</span>
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#111827] leading-tight truncate">
                    {label}
                  </h3>
                  <p className="text-[10px] text-[#6B7280] uppercase tracking-wider">{category}</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] text-[#6B7280] font-mono">
                    <span>Share</span>
                    <span className="font-bold text-[#111827]">{percentage}%</span>
                  </div>
                  <div className="w-full bg-[#F3F4F6] rounded-full h-1.5 overflow-hidden border border-[#E5E7EB]">
                    <div
                      className="bg-[#7567E8] h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
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
