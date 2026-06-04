import React, { useState } from 'react';
import { useStore } from '@/store/AppStore';
import { HardHat, ArrowRight, Mail, ShieldCheck } from 'lucide-react';

const Login: React.FC = () => {
  const { login, loginAs } = useStore();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [reset, setReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(email)) setError('No active account found for that email. Try a quick login below.');
    else setError('');
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('https://famous.ai/api/crm/6a22031657869cbdab607ad5/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'password-reset', tags: ['password-reset'] }),
      });
    } catch (_) { /* noop */ }
    setResetSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 backdrop-blur mb-4">
            <HardHat className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">FieldFlow</h1>
          <p className="text-blue-100 mt-1">Material requests & work photos, paperless.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6">
          {!reset ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Email</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@fieldco.com"
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Password</label>
                <input value={pw} onChange={(e) => setPw(e.target.value)} type="password" placeholder="••••••••"
                  className="w-full mt-1 px-3 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition">
                Sign In <ArrowRight className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => setReset(true)} className="w-full text-sm text-blue-600 hover:underline">
                Forgot password?
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <h2 className="font-semibold text-slate-800">Reset password</h2>
              {resetSent ? (
                <div className="bg-emerald-50 text-emerald-700 rounded-xl p-4 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" /> Reset link sent to {email || 'your email'}.
                </div>
              ) : (
                <>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@fieldco.com" required
                    className="w-full px-3 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl">Send reset link</button>
                </>
              )}
              <button type="button" onClick={() => { setReset(false); setResetSent(false); }} className="w-full text-sm text-slate-500 hover:underline">Back to sign in</button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Quick demo login</p>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => loginAs('u1')} className="text-sm font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 rounded-xl">Employee</button>
              <button onClick={() => loginAs('m1')} className="text-sm font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 rounded-xl">Manager</button>
              <button onClick={() => loginAs('a1')} className="text-sm font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 rounded-xl">Admin</button>
            </div>
          </div>
        </div>
        <p className="text-center text-blue-200 text-xs mt-4">Field-ready · Works on iPhone & Android</p>
      </div>
    </div>
  );
};

export default Login;
