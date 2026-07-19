import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Sprout, 
  Syringe, 
  Activity, 
  Database, 
  HeartPulse, 
  ShieldCheck, 
  Users, 
  FileSpreadsheet, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  if (!user) return null;

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (isMobileOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen, isMobile]);

  const role = user.role;

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['Admin', 'Farm Manager', 'Farm Worker', 'Veterinarian']
    },
    {
      label: 'Animal Register',
      path: '/animals',
      icon: Sprout,
      roles: ['Admin', 'Farm Manager', 'Farm Worker', 'Veterinarian']
    },
    {
      label: 'Vaccinations',
      path: '/vaccinations',
      icon: Syringe,
      roles: ['Admin', 'Farm Manager', 'Farm Worker', 'Veterinarian']
    },
    {
      label: 'Disease Tracking',
      path: '/diseases',
      icon: Activity,
      roles: ['Admin', 'Farm Manager', 'Farm Worker', 'Veterinarian']
    },
    {
      label: 'Feed Inventory',
      path: '/feed',
      icon: Database,
      roles: ['Admin', 'Farm Manager', 'Farm Worker']
    },
    {
      label: 'Medicine Inventory',
      path: '/medicine',
      icon: HeartPulse,
      roles: ['Admin', 'Farm Manager', 'Veterinarian']
    },
    {
      label: 'Biosecurity',
      path: '/biosecurity',
      icon: ShieldCheck,
      roles: ['Admin', 'Farm Manager', 'Farm Worker']
    },
    {
      label: 'Workers & Tasks',
      path: '/workers',
      icon: Users,
      roles: ['Admin', 'Farm Manager', 'Farm Worker']
    },
    {
      label: 'Farm Reports',
      path: '/reports',
      icon: FileSpreadsheet,
      roles: ['Admin', 'Farm Manager']
    },
    {
      label: 'System Settings',
      path: '/settings',
      icon: Settings,
      roles: ['Admin']
    }
  ];

  const visibleNavItems = navItems.filter(item => item.roles.includes(role));

  return (
    <>
      {/* Mobile Hamburger Button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-farm-600 text-white rounded-xl shadow-lg hover:bg-farm-700 transition-all focus:outline-none focus:ring-2 focus:ring-farm-400"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm transition-opacity"
        />
      )}

      <aside 
        className={`fixed left-0 top-0 z-40 h-screen bg-farm-950 text-slate-300 flex flex-col border-r border-farm-900/60 shadow-2xl transition-transform duration-300 ease-in-out ${
          isMobile 
            ? `w-72 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`
            : 'w-64 translate-x-0'
        }`}
      >
        {/* Mobile Close Button */}
        {isMobile && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="absolute top-4 right-4 p-2 text-farm-400 hover:text-white transition-colors focus:outline-none"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Brand Header */}
        <div className="p-6 border-b border-farm-900/60 flex items-center space-x-3 bg-farm-950/40">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-farm-500 to-emerald-400 flex items-center justify-center text-white shadow-lg active-glow">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-white text-sm tracking-wider uppercase leading-none">AgriSmart</h2>
            <span className="text-[10px] text-farm-400 font-bold uppercase tracking-widest mt-1 block">Farm Portal</span>
          </div>
        </div>

        {/* Nav Menu */}
        <nav 
          className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 custom-scrollbar"
          role="navigation"
          aria-label="Main navigation"
        >
          {visibleNavItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={idx}
                to={item.path}
                onClick={() => isMobile && setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 text-xs font-bold rounded-xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-farm-400 focus:ring-offset-2 focus:ring-offset-farm-950 ${
                    isActive
                      ? 'bg-gradient-to-r from-farm-600 to-emerald-700 text-white shadow-md glow-farm-sm border border-farm-500/20'
                      : 'text-emerald-100/70 hover:bg-farm-900/50 hover:text-white border border-transparent'
                  }`
                }
                aria-label={item.label}
                aria-current={({ isActive }) => isActive ? 'page' : undefined}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4.5 h-4.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                  <span className="tracking-wide">{item.label}</span>
                </div>
                
                {/* Subtle active bullet dot */}
                {({ isActive }) => isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" aria-hidden="true" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Profile Footer */}
        <div className="p-4 border-t border-farm-900/60 bg-farm-950/20 flex flex-col space-y-3">
          <div className="flex items-center space-x-3 px-2 py-1 bg-farm-900/30 rounded-xl border border-farm-900/20">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-farm-600 to-emerald-800 flex items-center justify-center font-bold text-white uppercase text-xs shadow-inner">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate leading-none">{user.name}</p>
              <span className="text-[9px] font-bold text-farm-400 uppercase tracking-widest mt-1 block">{user.role}</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-950/60 border border-rose-900/40 rounded-xl transition-all duration-300 group cursor-pointer focus:outline-none"
          >
            <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            <span className="tracking-wider">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
