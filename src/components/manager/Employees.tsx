import React, { useState } from 'react';
import { useStore } from '@/store/AppStore';
import { Role } from '@/lib/types';
import { UserPlus, X, Power, Mail, Phone } from 'lucide-react';

const Employees: React.FC = () => {
  const { users, requests, photos, addUser, updateUser } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'employee' as Role });

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    addUser({ ...form, active: true });
    setForm({ name: '', email: '', phone: '', role: 'employee' });
    setOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Employees</h1>
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl"><UserPlus className="w-4 h-4" /> Add Employee</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {users.map((u) => {
          const reqs = requests.filter((r) => r.employeeId === u.id).length;
          const pics = photos.filter((p) => p.employeeId === u.id).length;
          return (
            <div key={u.id} className={`bg-white rounded-2xl border p-4 ${u.active ? 'border-slate-200' : 'border-red-200 opacity-70'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{u.name}</p>
                  <span className="inline-block mt-1 text-xs font-semibold capitalize bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{u.role}</span>
                </div>
                <button onClick={() => updateUser(u.id, { active: !u.active })} title="Toggle active" className={`p-1.5 rounded-lg ${u.active ? 'text-emerald-600 bg-emerald-50' : 'text-red-500 bg-red-50'}`}><Power className="w-4 h-4" /></button>
              </div>
              <div className="mt-3 space-y-1 text-sm text-slate-500">
                <p className="flex items-center gap-2 truncate"><Mail className="w-3.5 h-3.5" /> {u.email}</p>
                <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {u.phone}</p>
              </div>
              <div className="flex gap-2 mt-3 text-xs">
                <span className="flex-1 bg-slate-50 rounded-lg py-2 text-center"><span className="font-bold text-slate-700 block">{reqs}</span> Requests</span>
                <span className="flex-1 bg-slate-50 rounded-lg py-2 text-center"><span className="font-bold text-slate-700 block">{pics}</span> Photos</span>
              </div>
              <select value={u.role} onChange={(e) => updateUser(u.id, { role: e.target.value as Role })} className="w-full mt-3 px-3 py-2 rounded-xl border border-slate-200 text-sm">
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          );
        })}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4" onClick={() => setOpen(false)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={save} className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between"><h2 className="text-lg font-bold text-slate-800">Add Employee</h2><button type="button" onClick={() => setOpen(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="w-full px-3.5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full px-3.5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="w-full px-3.5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })} className="w-full px-3.5 py-3 rounded-xl border border-slate-200">
              <option value="employee">Employee</option><option value="manager">Manager</option><option value="admin">Admin</option>
            </select>
            <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl">Add Employee</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Employees;
