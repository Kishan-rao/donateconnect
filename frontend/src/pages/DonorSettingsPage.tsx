import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { MobilePageHeader } from '../components/common/MobilePageHeader';
import {
  User,
  Bell,
  LogOut,
  ChevronRight,
  Trash2,
  Lock,
  Mail,
  Sliders,
} from 'lucide-react';

export const DonorSettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  // Local storage persisted preferences
  const [pushEnabled, setPushEnabled] = useState<boolean>(() => {
    return localStorage.getItem('dc-pref-push') !== 'false';
  });

  const [emailReceipts, setEmailReceipts] = useState<boolean>(() => {
    return localStorage.getItem('dc-pref-email-receipts') !== 'false';
  });

  const [sosAlerts, setSosAlerts] = useState<boolean>(() => {
    return localStorage.getItem('dc-pref-sos-alerts') !== 'false';
  });

  const [maskPin, setMaskPin] = useState<boolean>(() => {
    return localStorage.getItem('dc-pref-mask-pin') === 'true';
  });

  const [hapticFeedback, setHapticFeedback] = useState<boolean>(() => {
    return localStorage.getItem('dc-pref-haptic') !== 'false';
  });

  const handleToggle = (
    key: string,
    currentVal: boolean,
    setter: (val: boolean) => void,
    label: string
  ) => {
    const nextVal = !currentVal;
    setter(nextVal);
    localStorage.setItem(key, String(nextVal));
    if (nextVal) {
      showSuccess(`${label} enabled`);
    } else {
      showError(`${label} disabled`);
    }
  };

  const handleClearCache = () => {
    // Clear non-auth temporary keys
    const authKeys = ['dc-token', 'dc-user', 'token', 'user'];
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && !authKeys.includes(k) && !k.startsWith('dc-pref-')) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    showSuccess('Temporary app cache cleared successfully');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  const initial = user.fullName
    ? user.fullName.charAt(0).toUpperCase()
    : user.email.charAt(0).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto py-3 sm:py-6 px-1 sm:px-0 space-y-4">
      <MobilePageHeader
        title="Settings"
        subtitle="Manage your account preferences, notifications, and app experience"
        showBack={true}
        onBack={() => navigate(-1)}
      />

      {/* 1. Account Settings Card */}
      <section className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E5E7EB]">
          <User className="w-4 h-4 text-[#7567E8]" />
          <h2 className="text-sm font-bold text-[#111827] uppercase tracking-wider">
            Account Settings
          </h2>
        </div>

        <div className="flex items-center gap-3.5 bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E5E7EB]">
          <div className="w-12 h-12 rounded-full bg-[#7567E8] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-base font-extrabold text-[#111827] truncate">
              {user.fullName || 'Registered Donor'}
            </h3>
            <p className="text-xs text-[#6B7280] truncate">{user.email}</p>
            <span className="inline-block text-[10px] font-bold text-[#7567E8] bg-[#7567E8]/10 px-2 py-0.5 rounded-md mt-1 border border-[#7567E8]/20">
              Role: {user.role}
            </span>
          </div>
          <Link
            to="/donor/profile"
            className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#7567E8] hover:bg-[#F4F2FA] text-xs font-bold shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors active:scale-95"
            title="Edit Profile"
          >
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-2 text-xs text-[#4B5563]">
          <div className="flex items-center justify-between py-2">
            <span className="flex items-center gap-1.5 text-[#6B7280]">
              <Mail className="w-3.5 h-3.5 text-[#7567E8]" /> Primary Email
            </span>
            <span className="font-semibold text-[#111827] truncate max-w-[60%]">
              {user.email}
            </span>
          </div>
        </div>

        <Link
          to="/donor/profile"
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#FAF8F5] hover:bg-[#F4F2FA] text-[#111827] font-bold text-xs border border-[#E5E7EB] transition-colors min-h-[44px] active:scale-[0.98]"
        >
          View Full Profile & Contributions
        </Link>
      </section>

      {/* 2. Notification Preferences Card */}
      <section className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#7567E8]" />
            <h2 className="text-sm font-bold text-[#111827] uppercase tracking-wider">
              Notification Preferences
            </h2>
          </div>
          <span className="text-[10px] font-bold text-[#047857] bg-[#E6F4EA] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
            Local Device
          </span>
        </div>

        <div className="space-y-3">
          {/* Push Notifications */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E7EB] gap-3">
            <div className="min-w-0 flex-1">
              <span className="block text-xs font-bold text-[#111827]">
                Pickup & Delivery Updates
              </span>
              <p className="text-[11px] text-[#6B7280] leading-tight mt-0.5">
                Real-time alerts when NGOs accept or drivers pick up donations
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={pushEnabled}
              onClick={() =>
                handleToggle(
                  'dc-pref-push',
                  pushEnabled,
                  setPushEnabled,
                  'Pickup notifications'
                )
              }
              className={`w-12 h-7 rounded-full p-1 transition-colors min-h-[44px] min-w-[48px] flex items-center justify-center active:scale-95 ${
                pushEnabled ? 'bg-[#7567E8]' : 'bg-[#D1D5DB]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  pushEnabled ? 'translate-x-2.5' : '-translate-x-2.5'
                }`}
              />
            </button>
          </div>

          {/* Email Receipts */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E7EB] gap-3">
            <div className="min-w-0 flex-1">
              <span className="block text-xs font-bold text-[#111827]">
                80G Tax Exemption Receipts
              </span>
              <p className="text-[11px] text-[#6B7280] leading-tight mt-0.5">
                Send printable donation certificate upon verified delivery
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={emailReceipts}
              onClick={() =>
                handleToggle(
                  'dc-pref-email-receipts',
                  emailReceipts,
                  setEmailReceipts,
                  'Receipt notifications'
                )
              }
              className={`w-12 h-7 rounded-full p-1 transition-colors min-h-[44px] min-w-[48px] flex items-center justify-center active:scale-95 ${
                emailReceipts ? 'bg-[#7567E8]' : 'bg-[#D1D5DB]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  emailReceipts ? 'translate-x-2.5' : '-translate-x-2.5'
                }`}
              />
            </button>
          </div>

          {/* Urgent SOS Drives */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E7EB] gap-3">
            <div className="min-w-0 flex-1">
              <span className="block text-xs font-bold text-[#111827]">
                Disaster SOS & Urgent Drives
              </span>
              <p className="text-[11px] text-[#6B7280] leading-tight mt-0.5">
                Emergency notices when disaster relief appeal drives are activated
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={sosAlerts}
              onClick={() =>
                handleToggle(
                  'dc-pref-sos-alerts',
                  sosAlerts,
                  setSosAlerts,
                  'SOS drive alerts'
                )
              }
              className={`w-12 h-7 rounded-full p-1 transition-colors min-h-[44px] min-w-[48px] flex items-center justify-center active:scale-95 ${
                sosAlerts ? 'bg-[#7567E8]' : 'bg-[#D1D5DB]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  sosAlerts ? 'translate-x-2.5' : '-translate-x-2.5'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Privacy & Security Card */}
      <section className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E5E7EB]">
          <Lock className="w-4 h-4 text-[#7567E8]" />
          <h2 className="text-sm font-bold text-[#111827] uppercase tracking-wider">
            Privacy & Security
          </h2>
        </div>

        <div className="space-y-3">
          {/* Smart Locker PIN Masking */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E7EB] gap-3">
            <div className="min-w-0 flex-1">
              <span className="block text-xs font-bold text-[#111827]">
                Auto-Mask Locker Access PIN
              </span>
              <p className="text-[11px] text-[#6B7280] leading-tight mt-0.5">
                Hide 6-digit contactless locker PIN codes until explicitly tapped
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={maskPin}
              onClick={() =>
                handleToggle(
                  'dc-pref-mask-pin',
                  maskPin,
                  setMaskPin,
                  'Locker PIN masking'
                )
              }
              className={`w-12 h-7 rounded-full p-1 transition-colors min-h-[44px] min-w-[48px] flex items-center justify-center active:scale-95 ${
                maskPin ? 'bg-[#7567E8]' : 'bg-[#D1D5DB]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  maskPin ? 'translate-x-2.5' : '-translate-x-2.5'
                }`}
              />
            </button>
          </div>

          {/* Clear Cache */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E7EB] gap-3">
            <div className="min-w-0 flex-1">
              <span className="block text-xs font-bold text-[#111827]">
                Clear Local Application Cache
              </span>
              <p className="text-[11px] text-[#6B7280] leading-tight mt-0.5">
                Reset offline queries and cached directory listings
              </p>
            </div>
            <button
              type="button"
              onClick={handleClearCache}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5] text-xs font-bold min-h-[44px] flex items-center gap-1.5 transition-colors active:scale-95 shrink-0 shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        </div>
      </section>

      {/* 4. App Preferences */}
      <section className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E5E7EB]">
          <Sliders className="w-4 h-4 text-[#7567E8]" />
          <h2 className="text-sm font-bold text-[#111827] uppercase tracking-wider">
            App Preferences
          </h2>
        </div>

        <div className="space-y-3">
          {/* Haptic Feedback */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E7EB] gap-3">
            <div className="min-w-0 flex-1">
              <span className="block text-xs font-bold text-[#111827]">
                Touch Press Feedback
              </span>
              <p className="text-[11px] text-[#6B7280] leading-tight mt-0.5">
                Subtle micro-animations when tapping buttons and cards
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={hapticFeedback}
              onClick={() =>
                handleToggle(
                  'dc-pref-haptic',
                  hapticFeedback,
                  setHapticFeedback,
                  'Touch feedback'
                )
              }
              className={`w-12 h-7 rounded-full p-1 transition-colors min-h-[44px] min-w-[48px] flex items-center justify-center active:scale-95 ${
                hapticFeedback ? 'bg-[#7567E8]' : 'bg-[#D1D5DB]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  hapticFeedback ? 'translate-x-2.5' : '-translate-x-2.5'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Sign Out Button Card */}
      <section className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 shadow-xs">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full py-3 px-4 rounded-xl bg-[#FEE2E2] hover:bg-[#FCA5A5]/40 text-[#DC2626] font-extrabold text-xs border border-[#FCA5A5] transition-colors flex items-center justify-center gap-2 min-h-[48px] active:scale-[0.98]"
        >
          <LogOut className="w-4 h-4" />
          Sign Out of DonateConnect
        </button>
      </section>
    </div>
  );
};
