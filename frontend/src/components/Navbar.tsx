import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HeartHandshake,
  Home,
  LogIn,
  UserPlus,
  Shield,
  Building2,
  BarChart3,
  MapPin,
  Truck,
  Lock,
  Cpu,
  Recycle,
  Mic,
  ChevronDown,
  Menu,
  X,
  PlusCircle,
  PackageSearch,
  PackageCheck,
  User,
  LogOut,
} from 'lucide-react';
import { HealthBadge } from './HealthBadge';
import { NotificationBell } from './NotificationBell';
import { VoiceAssistantModal } from './VoiceAssistantModal';
import { ProfileDropdown } from './ProfileDropdown';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isDonor = user?.role === 'DONOR';
  const isNgo = user?.role === 'NGO';
  const isAdmin = user?.role === 'ADMIN';
  const isVolunteer = user?.role === 'VOLUNTEER';
  const isCorporate = user?.role === 'CORPORATE';

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  // Close drawer on Escape key
  useEffect(() => {
    if (!drawerOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen]);

  const navLinkClass = (path: string) =>
    `flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
      isActive(path)
        ? 'bg-[#7567E8] text-white shadow-sm font-bold'
        : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F4F2FA]'
    }`;

  const drawerLinkClass = (path: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all min-h-[44px] ${
      isActive(path)
        ? 'bg-[#7567E8] text-white shadow-sm font-bold'
        : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F4F2FA]'
    }`;

  // Role-aware mobile bottom navigation items
  const getBottomNavItems = () => {
    if (!isAuthenticated || !user) {
      return [
        { path: '/', label: 'Home', icon: Home },
        { path: '/map', label: 'Map', icon: MapPin },
        { path: '/lockers', label: 'Lockers', icon: Lock },
        { path: '/impact', label: 'Impact', icon: BarChart3 },
        { path: '/login', label: 'Sign In', icon: LogIn },
      ];
    }

    switch (user.role) {
      case 'DONOR':
        return [
          { path: '/', label: 'Home', icon: Home },
          { path: '/map', label: 'Map', icon: MapPin },
          { path: '/donate/new', label: 'Donate', icon: PlusCircle, isPrimary: true },
          { path: '/donations', label: 'Donations', icon: PackageSearch },
          { path: '/donor/profile', label: 'Profile', icon: User },
        ];
      case 'NGO':
        return [
          { path: '/ngo-dashboard', label: 'Assigned', icon: Building2 },
          { path: '/ngo-dashboard/inventory', label: 'Stock', icon: PackageSearch },
          { path: '/map', label: 'Map', icon: MapPin },
          { path: '/ngo-dashboard/profile', label: 'Profile', icon: User },
        ];
      case 'VOLUNTEER':
        return [
          { path: '/driver-dashboard', label: 'Tasks', icon: Truck },
          { path: '/map', label: 'Map', icon: MapPin },
          { path: '/lockers', label: 'Lockers', icon: Lock },
          { path: '/impact', label: 'Impact', icon: BarChart3 },
        ];
      case 'CORPORATE':
        return [
          { path: '/csr-dashboard', label: 'CSR', icon: Building2 },
          { path: '/map', label: 'Map', icon: MapPin },
          { path: '/impact', label: 'Impact', icon: BarChart3 },
          { path: '/circular-market', label: 'Circular', icon: Recycle },
        ];
      case 'ADMIN':
        return [
          { path: '/admin', label: 'Admin', icon: Shield },
          { path: '/admin/ngos', label: 'NGOs', icon: Building2 },
          { path: '/admin/donations', label: 'Audit', icon: PackageCheck },
          { path: '/admin/profile', label: 'Profile', icon: User },
        ];
      default:
        return [
          { path: '/', label: 'Home', icon: Home },
          { path: '/map', label: 'Map', icon: MapPin },
          { path: '/donations', label: 'Donations', icon: PackageSearch },
          { path: '/donor/profile', label: 'Profile', icon: User },
        ];
    }
  };

  const bottomNavItems = getBottomNavItems();

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 sm:gap-6 h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#7567E8] flex items-center justify-center shadow-md shadow-[#7567E8]/20 group-hover:scale-105 transition-transform duration-200">
                <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-extrabold text-[#111827]">
                  DonateConnect
                </span>
                <span className="block text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-[#7567E8] -mt-1">
                  {isAdmin
                    ? 'Admin Console'
                    : isNgo
                    ? 'NGO Portal'
                    : isVolunteer
                    ? 'Driver Console'
                    : isCorporate
                    ? 'CSR Console'
                    : 'Platform'}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 bg-[#F9FAFB] p-1.5 rounded-full border border-[#E5E7EB]">
              <Link to="/" className={navLinkClass('/')}>
                <Home className="w-3.5 h-3.5" /> Home
              </Link>

              <Link to="/map" className={navLinkClass('/map')}>
                <MapPin className="w-3.5 h-3.5" /> Map
              </Link>

              <Link to="/lockers" className={navLinkClass('/lockers')}>
                <Lock className="w-3.5 h-3.5" /> Lockers
              </Link>

              <Link to="/impact" className={navLinkClass('/impact')}>
                <BarChart3 className="w-3.5 h-3.5" /> Impact
              </Link>

              <Link to="/blockchain-ledger" className={navLinkClass('/blockchain-ledger')}>
                <Cpu className="w-3.5 h-3.5" /> Blockchain
              </Link>

              <Link to="/circular-market" className={navLinkClass('/circular-market')}>
                <Recycle className="w-3.5 h-3.5" /> Circular
              </Link>

              {isVolunteer && (
                <Link to="/driver-dashboard" className={navLinkClass('/driver-dashboard')}>
                  <Truck className="w-3.5 h-3.5" /> Driver
                </Link>
              )}

              {isCorporate && (
                <Link to="/csr-dashboard" className={navLinkClass('/csr-dashboard')}>
                  <Building2 className="w-3.5 h-3.5" /> CSR
                </Link>
              )}
            </nav>

            {/* User Auth, Tools & Mobile Menu Trigger */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShowVoiceModal(true)}
                title="Voice AI Booking Assistant"
                className="w-10 h-10 min-w-[40px] min-h-[40px] sm:w-10 sm:h-10 rounded-xl bg-[#7567E8]/10 hover:bg-[#7567E8]/20 text-[#7567E8] border border-[#7567E8]/20 transition-colors flex items-center justify-center"
              >
                <Mic className="w-4 h-4" />
              </button>

              {isAuthenticated && <NotificationBell />}
              
              <div className="hidden xs:block">
                <HealthBadge />
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-5 bg-[#E5E7EB] shrink-0" />

              {isAuthenticated && user ? (
                <div className="relative">
                  {/* Profile trigger button */}
                  <button
                    onClick={() => setProfileOpen((prev) => !prev)}
                    aria-haspopup="true"
                    aria-expanded={profileOpen}
                    title="Account menu"
                    className="flex items-center gap-1.5 sm:gap-2 rounded-xl px-2 sm:px-2.5 py-1.5 hover:bg-[#F4F2FA] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7567E8] min-h-[40px]"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#7567E8] flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                      {(user.fullName ? user.fullName : user.email).charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden sm:block text-left">
                      <span className="block text-xs font-bold text-[#111827] leading-tight">
                        {user.fullName}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#7567E8] uppercase tracking-wider">
                        <Shield className="w-2.5 h-2.5" />
                        {user.role}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[#4B5563] transition-transform duration-150 ${
                        profileOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Profile Dropdown */}
                  <ProfileDropdown
                    isOpen={profileOpen}
                    onClose={() => setProfileOpen(false)}
                  />
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F9FAFB] text-[#111827] font-semibold text-xs transition-colors border border-[#E5E7EB] flex items-center gap-1.5 shadow-sm min-h-[40px]"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#4B5563]" />
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-3.5 py-2 rounded-xl bg-[#7567E8] hover:bg-[#7567E8]/90 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm min-h-[40px]"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Drawer Hamburger Button */}
              <button
                onClick={() => setDrawerOpen(true)}
                aria-label="Open mobile navigation menu"
                aria-expanded={drawerOpen}
                className="lg:hidden w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white hover:bg-[#F4F2FA] text-[#111827] border border-[#E5E7EB] flex items-center justify-center transition-colors shadow-sm"
              >
                <Menu className="w-5 h-5 text-[#111827]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer Sheet */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#111827]/40 backdrop-blur-sm transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl p-5 flex flex-col justify-between overflow-y-auto border-l border-[#E5E7EB] z-10">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#7567E8] flex items-center justify-center text-white shadow-sm">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-extrabold text-base text-[#111827]">
                      DonateConnect
                    </span>
                    <span className="block text-[10px] font-bold text-[#7567E8] uppercase tracking-wider -mt-0.5">
                      {user?.role ? `${user.role} Portal` : 'Navigation'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-xl text-[#4B5563] hover:text-[#111827] hover:bg-[#F4F2FA] min-w-[40px] min-h-[40px] flex items-center justify-center"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links List */}
              <div className="space-y-1">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280] px-3 mb-2">
                  Discovery & Features
                </div>
                <Link to="/" className={drawerLinkClass('/')}>
                  <Home className="w-4 h-4 text-[#7567E8]" /> Home
                </Link>
                <Link to="/map" className={drawerLinkClass('/map')}>
                  <MapPin className="w-4 h-4 text-[#7567E8]" /> Interactive Map
                </Link>
                <Link to="/lockers" className={drawerLinkClass('/lockers')}>
                  <Lock className="w-4 h-4 text-[#7567E8]" /> Smart Lockers
                </Link>
                <Link to="/impact" className={drawerLinkClass('/impact')}>
                  <BarChart3 className="w-4 h-4 text-[#7567E8]" /> Impact Analytics
                </Link>
                <Link to="/blockchain-ledger" className={drawerLinkClass('/blockchain-ledger')}>
                  <Cpu className="w-4 h-4 text-[#7567E8]" /> Blockchain Ledger
                </Link>
                <Link to="/circular-market" className={drawerLinkClass('/circular-market')}>
                  <Recycle className="w-4 h-4 text-[#7567E8]" /> Circular Market
                </Link>

                {/* Role Specific Consoles */}
                {isAuthenticated && (
                  <div className="pt-4 border-t border-[#E5E7EB] mt-4 space-y-1">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280] px-3 mb-2">
                      Your Role Console
                    </div>
                    {isDonor && (
                      <>
                        <Link to="/donate/new" className={drawerLinkClass('/donate/new')}>
                          <PlusCircle className="w-4 h-4 text-[#7567E8]" /> New Donation
                        </Link>
                        <Link to="/donations" className={drawerLinkClass('/donations')}>
                          <PackageSearch className="w-4 h-4 text-[#7567E8]" /> My Donations
                        </Link>
                        <Link to="/donor/profile" className={drawerLinkClass('/donor/profile')}>
                          <User className="w-4 h-4 text-[#7567E8]" /> Donor Profile
                        </Link>
                      </>
                    )}
                    {isNgo && (
                      <>
                        <Link to="/ngo-dashboard" className={drawerLinkClass('/ngo-dashboard')}>
                          <Building2 className="w-4 h-4 text-[#7567E8]" /> Assigned Requests
                        </Link>
                        <Link to="/ngo-dashboard/inventory" className={drawerLinkClass('/ngo-dashboard/inventory')}>
                          <PackageSearch className="w-4 h-4 text-[#7567E8]" /> Relief Inventory
                        </Link>
                        <Link to="/ngo-dashboard/profile" className={drawerLinkClass('/ngo-dashboard/profile')}>
                          <User className="w-4 h-4 text-[#7567E8]" /> NGO Profile
                        </Link>
                      </>
                    )}
                    {isVolunteer && (
                      <Link to="/driver-dashboard" className={drawerLinkClass('/driver-dashboard')}>
                        <Truck className="w-4 h-4 text-[#7567E8]" /> Volunteer Driver Console
                      </Link>
                    )}
                    {isCorporate && (
                      <Link to="/csr-dashboard" className={drawerLinkClass('/csr-dashboard')}>
                        <Building2 className="w-4 h-4 text-[#7567E8]" /> Corporate CSR Console
                      </Link>
                    )}
                    {isAdmin && (
                      <>
                        <Link to="/admin" className={drawerLinkClass('/admin')}>
                          <Shield className="w-4 h-4 text-[#7567E8]" /> Admin Overview
                        </Link>
                        <Link to="/admin/ngos" className={drawerLinkClass('/admin/ngos')}>
                          <Building2 className="w-4 h-4 text-[#7567E8]" /> Manage NGO Partners
                        </Link>
                        <Link to="/admin/donations" className={drawerLinkClass('/admin/donations')}>
                          <PackageCheck className="w-4 h-4 text-[#7567E8]" /> Audit Donations
                        </Link>
                        <Link to="/admin/profile" className={drawerLinkClass('/admin/profile')}>
                          <User className="w-4 h-4 text-[#7567E8]" /> Admin Profile
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer Auth Section */}
            <div className="pt-4 border-t border-[#E5E7EB]">
              {isAuthenticated && user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-9 h-9 rounded-full bg-[#7567E8] flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {(user.fullName ? user.fullName : user.email).charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#111827] truncate">{user.fullName}</p>
                      <p className="text-[10px] text-[#6B7280] truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setDrawerOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#FEE2E2] text-[#DC2626] font-bold text-xs hover:bg-[#FCA5A5]/40 transition-colors min-h-[44px]"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    className="py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm min-h-[44px]"
                  >
                    <LogIn className="w-3.5 h-3.5" /> Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="py-2.5 rounded-xl bg-[#7567E8] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm min-h-[44px]"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Role-Aware Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#E5E7EB] px-2 py-1.5 safe-pb shadow-lg md:hidden"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {bottomNavItems.map((item) => {
            const ItemIcon = item.icon;
            const active = isActive(item.path);

            if (item.isPrimary) {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex flex-col items-center justify-center relative -mt-5"
                  aria-label={item.label}
                >
                  <div className="w-12 h-12 rounded-full bg-[#7567E8] text-white flex items-center justify-center shadow-lg shadow-[#7567E8]/30 border-2 border-white transform hover:scale-105 transition-transform">
                    <ItemIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold text-[#7567E8] mt-0.5">
                    {item.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all min-w-[56px] min-h-[44px] ${
                  active
                    ? 'text-[#7567E8] font-extrabold bg-[#7567E8]/10'
                    : 'text-[#4B5563] hover:text-[#111827]'
                }`}
              >
                <ItemIcon className={`w-5 h-5 ${active ? 'text-[#7567E8]' : 'text-[#6B7280]'}`} />
                <span className="text-[10px] font-semibold mt-0.5 truncate max-w-[64px]">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {showVoiceModal && <VoiceAssistantModal onClose={() => setShowVoiceModal(false)} />}
    </>
  );
};

