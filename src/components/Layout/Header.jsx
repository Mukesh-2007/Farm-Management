import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFarmData } from '../../context/FarmDataContext';
import { Bell, ShieldAlert, KeyRound, Check, HelpCircle } from 'lucide-react';

const Header = ({ title = "Dashboard" }) => {
  const { user, demoSwitchRole } = useAuth();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useFarmData();
  const [showNotifications, setShowNotifications] = useState(false);

  if (!user) return null;

  const unreadNotifications = notifications.filter(n => !n.read);
  const unreadCount = unreadNotifications.length;

  const handleRoleChange = (e) => {
    demoSwitchRole(e.target.value);
  };

  const getSeverityBadge = (severity) => {
    if (severity === 'high') return 'bg-rose-500 text-white';
    if (severity === 'medium') return 'bg-amber-500 text-white';
    return 'bg-blue-500 text-white';
  };

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100/90 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm shadow-slate-100/10">
      <div className="flex items-center space-x-2">
        <h1 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center space-x-5">
        {/* Demo Switcher Widget (Styled beautifully like a tool status bar) */}
        <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl shadow-inner hover:bg-slate-100/40 transition-colors">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
            <KeyRound className="w-3.5 h-3.5 text-farm-600 animate-pulse" aria-hidden="true" /> Sandbox Role:
          </span>
          <label htmlFor="role-switcher" className="sr-only">Switch user role</label>
          <select
            id="role-switcher"
            value={user.role}
            onChange={handleRoleChange}
            className="text-xs font-bold bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-farm-500/20 focus:border-farm-500 cursor-pointer shadow-sm hover:border-slate-300 transition-colors"
          >
            <option value="Admin">Admin (Owner)</option>
            <option value="Farm Manager">Farm Manager</option>
            <option value="Farm Worker">Farm Worker</option>
            <option value="Veterinarian">Veterinarian</option>
          </select>
        </div>

        {/* Notifications System */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-400 hover:text-slate-650 hover:bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-xl transition-all relative focus:outline-none focus:ring-2 focus:ring-farm-400 focus:ring-offset-2 cursor-pointer flex items-center justify-center"
            aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
            aria-expanded={showNotifications}
            aria-haspopup="true"
          >
            <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'animate-swing' : ''}`} aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-md shadow-rose-500/20" aria-hidden="true">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-35" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-3.5 w-85 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-150 z-40 py-2.5 animate-in fade-in slide-in-from-top-3 duration-250">
                
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-farm-600" /> Active Alerts
                  </h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[10px] font-bold text-farm-600 hover:text-farm-700 underline focus:outline-none cursor-pointer"
                    >
                      Clear alerts
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto custom-scrollbar divide-y divide-slate-100">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3.5 transition-colors flex items-start gap-3 ${
                          notif.read ? 'opacity-50 bg-white' : 'bg-farm-50/10'
                        }`}
                      >
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider h-fit mt-0.5 ${getSeverityBadge(notif.severity)}`}>
                          {notif.severity}
                        </span>
                        
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs leading-relaxed ${notif.read ? 'text-slate-500' : 'text-slate-700 font-medium'}`}>
                            {notif.message}
                          </p>
                          <span className="text-[9px] text-slate-400 font-semibold block mt-1">{notif.time}</span>
                        </div>
                        
                        {!notif.read && (
                          <button
                            onClick={() => markNotificationAsRead(notif.id)}
                            className="p-1 text-slate-350 hover:text-farm-600 hover:bg-farm-50 rounded-lg transition-colors focus:outline-none cursor-pointer flex-shrink-0"
                            title="Acknowledge Alert"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-10 text-center text-xs text-slate-400 font-medium">
                      All systems clear. No warning triggers.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
