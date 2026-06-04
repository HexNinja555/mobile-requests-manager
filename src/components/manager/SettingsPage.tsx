import React, { useState } from 'react';
import { Bell, Mail, Shield, Database, CheckCircle2 } from 'lucide-react';

const Toggle: React.FC<{ on: boolean; onClick: () => void }> = ({ on, onClick }) => (
  <button onClick={onClick} className={`w-12 h-7 rounded-full transition relative ${on ? 'bg-blue-600' : 'bg-slate-200'}`}>
    <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
  </button>
);

const SettingsPage: React.FC = () => {
  const [notify, setNotify] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);
  const [email, setEmail] = useState('');
  const [saved, setSaved] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('https://famous.ai/api/crm/6a22031657869cbdab607ad5/subscribe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'settings-alerts', tags: ['manager', 'alerts'] }),
      });
    } catch (_) {}
    setSaved(true);
  };

  const Row: React.FC<{ icon: React.ElementType; title: string; desc: string; children: React.ReactNode }> = ({ icon: Icon, title, desc, children }) => (
    <div className="flex items-center gap-4 p-4">
      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"><Icon className="w-5 h-5 text-slate-600" /></div>
      <div className="flex-1 min-w-0"><p className="font-medium text-slate-800">{title}</p><p className="text-sm text-slate-400">{desc}</p></div>
      {children}
    </div>
  );

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
        <Row icon={Bell} title="In-app notifications" desc="Alerts for new requests & status changes"><Toggle on={notify} onClick={() => setNotify(!notify)} /></Row>
        <Row icon={Mail} title="Email alerts" desc="Email me when urgent requests arrive"><Toggle on={emailAlerts} onClick={() => setEmailAlerts(!emailAlerts)} /></Row>
        <Row icon={Shield} title="Auto-approve Low priority" desc="Skip manual review for low-priority items"><Toggle on={autoApprove} onClick={() => setAutoApprove(!autoApprove)} /></Row>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-3"><Mail className="w-5 h-5 text-blue-600" /> Alert email address</h2>
        {saved ? (
          <div className="bg-emerald-50 text-emerald-700 rounded-xl p-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Subscribed {email} to alerts.</div>
        ) : (
          <form onSubmit={subscribe} className="flex gap-2">
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alerts@fieldco.com" className="flex-1 px-3.5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
            <button type="submit" className="bg-blue-600 text-white font-semibold px-5 rounded-xl">Save</button>
          </form>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-2"><Database className="w-5 h-5 text-slate-500" /> Backend</h2>
        <p className="text-sm text-slate-500">Configured for Supabase Auth, Postgres & Storage. Photo uploads use signed URLs; status changes are audit-logged.</p>
      </div>
    </div>
  );
};

export default SettingsPage;
