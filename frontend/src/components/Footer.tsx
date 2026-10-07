import React from 'react';
import { HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-[#FAF8F5] border-t border-[#E5E7EB] text-[#4B5563] py-6 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-extrabold text-sm text-[#111827]">
            <HeartHandshake className="w-5 h-5 text-[#7567E8]" />
            <span>DonateConnect</span>
          </div>
          <p className="text-[#6B7280]">
            Empowering communities through verified non-profit giving and zero-waste logistics.
          </p>
        </div>
      </div>
    </footer>
  );
};
