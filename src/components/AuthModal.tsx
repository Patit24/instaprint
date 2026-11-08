import React, { useState } from 'react';
import { X, User, Mail, Lock, Phone, Building, CheckCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loggedUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name.trim() || email.split('@')[0] || 'Instaprint Client',
      email: email.trim() || 'client@instaprintkolkata.com',
      phone: phone.trim() || '082406 38595',
      company: company.trim() || 'Local Business',
      wishlistProductIds: [],
      addresses: [
        {
          id: 'addr-default',
          label: 'Office',
          fullName: name.trim() || 'Instaprint Client',
          phone: phone.trim() || '082406 38595',
          addressLine1: 'Ground Floor, Shop 106/B, Gopal Lal Tagore Rd',
          landmark: 'Baranagar',
          city: 'Kolkata',
          state: 'West Bengal',
          pincode: '700036',
          isDefault: true
        }
      ]
    };

    onLoginSuccess(loggedUser);
    onClose();
  };

  const handleDemoLogin = () => {
    const demoUser: UserProfile = {
      id: 'usr-101',
      name: 'Debashis Mukherjee',
      email: 'debashis.mukherjee@gmail.com',
      phone: '082406 38595',
      company: 'Bengal Creative Labs',
      wishlistProductIds: ['led-romantic-heart-frame', 'standard-visiting-cards'],
      addresses: [
        {
          id: 'addr-1',
          label: 'Office',
          fullName: 'Debashis Mukherjee',
          phone: '082406 38595',
          addressLine1: 'Ground Floor, Shop 106/B, Gopal Lal Tagore Rd, Joyshree',
          landmark: 'Near Locomotor Disabilities Institute Road',
          city: 'Kolkata',
          state: 'West Bengal',
          pincode: '700036',
          isDefault: true
        }
      ]
    };
    onLoginSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0e121e] border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-brand-500 to-amber-500 flex items-center justify-center text-white shadow-glow-rose font-black text-xl">
            IP
          </div>
          <h3 className="text-2xl font-black text-white">
            {mode === 'login' ? 'Welcome Back' : 'Create Customer Account'}
          </h3>
          <p className="text-xs text-slate-400">
            {mode === 'login'
              ? 'Access saved printing artworks, order tracking & invoices'
              : 'Join Baranagar’s premier custom printing atelier'}
          </p>
        </div>

        {/* Demo Fast Login Button */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full py-2.5 px-4 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-amber-500/25 transition-colors"
        >
          <CheckCircle className="w-4 h-4 text-amber-400" />
          <span>Quick 1-Click Demo Sign In (Debashis Mukherjee)</span>
        </button>

        <div className="flex items-center gap-2 my-2">
          <div className="h-px bg-slate-800 flex-1" />
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">or continue with email</span>
          <div className="h-px bg-slate-800 flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'register' && (
            <>
              <div>
                <label className="text-slate-300 font-medium block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sourav Banerjee"
                    className="w-full bg-[#141824] text-white pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">WhatsApp Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 082406 38595"
                    className="w-full bg-[#141824] text-white pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Company / Studio (Optional)</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Studio 36 Design"
                    className="w-full bg-[#141824] text-white pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-slate-300 font-medium block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. contact@business.com"
                className="w-full bg-[#141824] text-white pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#141824] text-white pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-rose-600 hover:from-brand-500 hover:to-rose-500 text-white font-bold text-xs tracking-wide shadow-glow-rose hover:scale-[1.01] active:scale-[0.99] transition-all mt-2"
          >
            {mode === 'login' ? 'Sign In to Account' : 'Register Account'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-brand-400 font-bold hover:underline"
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-brand-400 font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
