import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, AlertCircle, ArrowRight, ShieldCheck, User, Shield, Briefcase, Heart } from 'lucide-react';
import FormField from '../components/Common/FormField';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setForgotSent(false);

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    }
  };

  const handleQuickLogin = async (quickEmail, quickPassword) => {
    setError('');
    setEmail(quickEmail);
    setPassword(quickPassword);
    try {
      await login(quickEmail, quickPassword);
      navigate('/dashboard');
    } catch (err) {
      setError('Quick login failed');
    }
  };

  const handleForgotClick = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email first to receive reset instructions.');
      return;
    }
    setError('');
    setForgotSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-farm-50/70 via-slate-50 to-clay-50/40">
      
      {/* Decorative Gradient Glow Orbs for visual wow factor */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-farm-300/15 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-clay-300/10 blur-3xl" />
      
      <div className="max-w-md w-full space-y-6 relative z-10">
        
        {/* Logo and Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-farm-600 to-emerald-400 items-center justify-center text-white shadow-xl shadow-farm-600/20 active-glow">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">AgriSmart Portal</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Digital Farm Management Portal (SIH25006)</p>
        </div>

        {/* Card Panel */}
        <div className="glass-card rounded-3xl p-8 border border-white shadow-2xl relative">
          
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl flex items-start space-x-2 text-xs font-semibold">
                <AlertCircle className="w-4.5 h-4.5 flex-shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {forgotSent && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold">
                Reset link sent to <span className="underline font-bold">{email}</span>. Check your inbox.
              </div>
            )}

            <FormField
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. manager@farm.com"
              required
            />

            <div className="space-y-1.5">
              <FormField
                label="Password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <div className="text-right">
                <a
                  href="#forgot"
                  onClick={handleForgotClick}
                  className="text-xs font-bold text-farm-650 hover:text-farm-700 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-farm-600 to-emerald-700 hover:from-farm-750 hover:to-emerald-850 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-farm-600/10 hover:shadow-farm-600/20 hover-lift transition-all flex items-center justify-center space-x-2 disabled:opacity-70 focus:outline-none cursor-pointer mt-2"
            >
              {loading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Logins */}
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-3.5">
            <div className="flex items-center justify-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-farm-650" />
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                Quick Access Sandbox Logins
              </h3>
              <span className="w-1.5 h-1.5 rounded-full bg-farm-650" />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@farm.com', 'admin123')}
                className="p-3 border border-slate-100 hover:border-farm-300 hover:bg-farm-50/20 rounded-2xl text-left flex items-start gap-2.5 transition-all cursor-pointer hover:shadow-sm"
              >
                <div className="p-1.5 rounded-lg bg-farm-50 text-farm-600 flex-shrink-0 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-800 block">Owner Admin</span>
                  <span className="text-[9px] text-slate-400 font-semibold truncate block">admin@farm.com</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('manager@farm.com', 'manager123')}
                className="p-3 border border-slate-100 hover:border-farm-300 hover:bg-farm-50/20 rounded-2xl text-left flex items-start gap-2.5 transition-all cursor-pointer hover:shadow-sm"
              >
                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 flex-shrink-0 mt-0.5">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-800 block">Farm Manager</span>
                  <span className="text-[9px] text-slate-400 font-semibold truncate block">manager@farm.com</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('worker@farm.com', 'worker123')}
                className="p-3 border border-slate-100 hover:border-farm-300 hover:bg-farm-50/20 rounded-2xl text-left flex items-start gap-2.5 transition-all cursor-pointer hover:shadow-sm"
              >
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-800 block">Farm Worker</span>
                  <span className="text-[9px] text-slate-400 font-semibold truncate block">worker@farm.com</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('vet@farm.com', 'vet123')}
                className="p-3 border border-slate-100 hover:border-farm-300 hover:bg-farm-50/20 rounded-2xl text-left flex items-start gap-2.5 transition-all cursor-pointer hover:shadow-sm"
              >
                <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 flex-shrink-0 mt-0.5">
                  <Heart className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-800 block">Veterinarian</span>
                  <span className="text-[9px] text-slate-400 font-semibold truncate block">vet@farm.com</span>
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
