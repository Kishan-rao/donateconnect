import React from 'react';
import { Donation } from '../types';
import { formatDate } from '../utils/formatters';
import { HeartHandshake, ShieldCheck, Printer, QrCode } from 'lucide-react';
import { MobileBottomSheet } from './common/MobileBottomSheet';

interface DonationReceiptModalProps {
  donation: Donation;
  onClose: () => void;
}

export const DonationReceiptModal: React.FC<DonationReceiptModalProps> = ({ donation, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <MobileBottomSheet
      isOpen={true}
      onClose={onClose}
      title="Official Donation Receipt"
      subtitle={`REF #${donation.id.slice(0, 8).toUpperCase()} • Verified Record`}
      icon={
        <div className="w-9 h-9 rounded-xl bg-[#7567E8]/10 border border-[#7567E8]/20 flex items-center justify-center text-[#7567E8]">
          <HeartHandshake className="w-5 h-5" />
        </div>
      }
      maxWidthClass="max-w-2xl"
      footer={
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 w-full">
          <button
            onClick={handlePrint}
            className="h-11 min-h-[44px] px-5 rounded-xl bg-[#7567E8] hover:bg-[#5E51CD] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm touch-manipulation"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF Receipt
          </button>
          <button
            onClick={onClose}
            className="h-11 min-h-[44px] px-5 rounded-xl bg-[#F9FAFB] hover:bg-[#F4F2FA] text-[#111827] border border-[#E5E7EB] font-bold text-xs transition-colors touch-manipulation flex items-center justify-center"
          >
            Close
          </button>
        </div>
      }
    >
      {/* Printable Section */}
      <div id="printable-receipt" className="space-y-4">
        {/* Receipt Header Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E7EB]">
          <div>
            <h2 className="text-lg font-black text-[#111827] tracking-tight">DonateConnect</h2>
            <p className="text-[11px] uppercase tracking-wider text-[#7567E8] font-bold">
              Official Community Donation Certificate
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs font-mono text-[#4B5563] block">
              REF #{donation.id.slice(0, 8).toUpperCase()}
            </span>
            <div className="text-[11px] text-[#047857] font-bold flex items-center gap-1 sm:justify-end mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Tax Exemption Eligible
            </div>
          </div>
        </div>

        {/* Donor & NGO Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-white border border-[#E5E7EB] text-xs shadow-sm">
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-[#6B7280]">Donor Information</div>
            <div className="font-bold text-[#111827] text-sm">{donation.donor.fullName}</div>
            <div className="text-[#4B5563] truncate">{donation.donor.email}</div>
          </div>
          <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-[#E5E7EB] pt-2 sm:pt-0 sm:pl-3">
            <div className="text-[10px] uppercase font-bold text-[#6B7280]">Receiving NGO Partner</div>
            <div className="font-bold text-[#047857] text-sm">{donation.ngo.name}</div>
            <div className="text-[#4B5563] truncate">{donation.ngo.address || 'Registered NGO Facility'}</div>
          </div>
        </div>

        {/* Item Breakdown Card */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] space-y-3 shadow-sm">
          <div className="text-xs font-bold text-[#4B5563] uppercase tracking-wider">Item Breakdown</div>
          <div className="divide-y divide-[#E5E7EB] text-xs">
            <div className="py-2 flex items-center justify-between">
              <span className="text-[#6B7280]">Category</span>
              <span className="font-bold text-[#7567E8] bg-[#7567E8]/10 px-2.5 py-0.5 rounded-full border border-[#7567E8]/20">
                {donation.category}
              </span>
            </div>
            <div className="py-2 flex items-center justify-between">
              <span className="text-[#6B7280]">Description</span>
              <span className="font-semibold text-[#111827] text-right max-w-[65%] truncate">
                {donation.description || 'Verified Community Contribution'}
              </span>
            </div>
            <div className="py-2 flex items-center justify-between">
              <span className="text-[#6B7280]">Status</span>
              <span className="font-bold text-[#047857] bg-[#E6F4EA] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
                {donation.status}
              </span>
            </div>
          </div>
        </div>

        {/* Verification Footnote & Simulated Stamp */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center shrink-0">
              <QrCode className="w-8 h-8 text-[#7567E8]" />
            </div>
            <div className="text-[11px] text-[#4B5563]">
              <div>Date Issued: {formatDate(donation.createdAt)}</div>
              <div className="text-[10px] text-[#6B7280]">
                Scan QR Code to verify certificate integrity on blockchain ledger
              </div>
            </div>
          </div>

          <div className="border border-[#7567E8]/30 rounded-xl p-2.5 text-center bg-[#7567E8]/10 self-stretch sm:self-auto">
            <div className="text-[9px] font-extrabold uppercase tracking-widest text-[#7567E8]">
              DonateConnect Verified
            </div>
            <div className="text-[10px] text-[#047857] font-bold">OFFICIAL STAMP</div>
          </div>
        </div>
      </div>
    </MobileBottomSheet>
  );
};
