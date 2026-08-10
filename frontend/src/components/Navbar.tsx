import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartHandshake, PlusCircle, Home, LogIn, UserPlus, LogOut, Shield, Building2, PackageCheck, Layers, UserCheck, LayoutDashboard, BarChart3, MapPin, Truck, Lock, Cpu, Recycle, Mic } from 'lucide-react';
import { HealthBadge } from './HealthBadge';
import { NotificationBell } from './NotificationBell';
import { VoiceAssistantModal } from './VoiceAssistantModal';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isNgo = user?.role === 'NGO';
  const isAdmin = user?.role === 'ADMIN';
  const isVolunteer = user?.role === 'VOLUNTEER';
  const isCorporate = user?.role === 'CORPORATE';

  return (
    <>
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-rose-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
                <HeartHandshake className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  DonateConnect
                </span>
                <span className="block text-[10px] uppercase tracking-wider font-semibold text-indigo-400 -mt-1">
                  {isAdmin ? 'Admin Console' : isNgo ? 'NGO Portal' : isVolunteer ? 'Driver Console' : isCorporate ? 'CSR Console' : 'Platform'}
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-800/40 p-1.5 rounded-full border border-slate-800">
              <Link
                to="/"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive('/') ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Home className="w-3.5 h-3.5" /> Home
              </Link>

              <Link
                to="/map"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive('/map') ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" /> Map
              </Link>

              <Link
                to="/lockers"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive('/lockers') ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Lock className="w-3.5 h-3.5" /> Lockers
              </Link>

              <Link
                to="/impact"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive('/impact') ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" /> Impact
              </Link>

              <Link
                to="/blockchain-ledger"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive('/blockchain-ledger') ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" /> Blockchain
              </Link>

              <Link
                to="/circular-market"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive('/circular-market') ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Recycle className="w-3.5 h-3.5" /> Circular
              </Link>

              {isVolunteer && (
                <Link
                  to="/driver-dashboard"
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive('/driver-dashboard') ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" /> Driver
                </Link>
              )}

              {isCorporate && (
                <Link
                  to="/csr-dashboard"
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive('/csr-dashboard') ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" /> CSR
                </Link>
              )}
            </nav>

            {/* User Auth & Voice Assistant Trigger */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowVoiceModal(true)}
                title="Voice AI Booking Assistant"
                className="p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 transition-colors"
              >
                <Mic className="w-4 h-4" />
              </button>

              {isAuthenticated && <NotificationBell />}
              <HealthBadge />

              {isAuthenticated && user ? (
                <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden sm:block text-left">
                      <span className="block text-xs font-semibold text-white leading-tight">
                        {user.fullName}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                        <Shield className="w-2.5 h-2.5" />
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    title="Sign Out"
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition-colors border border-slate-700/60"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                  <Link
                    to="/login"
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors border border-slate-700 flex items-center gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5 text-slate-400" />
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {showVoiceModal && <VoiceAssistantModal onClose={() => setShowVoiceModal(false)} />}
    </>
  );
};
