import React, { useState } from 'react';
import { useStore } from '@/store/AppStore';
import RequestCard from '@/components/shared/RequestCard';
import { FilePlus, Camera, Search, Truck, Bell } from 'lucide-react';

const EmployeeHome: React.FC<{ go: (k: string, id?: string) => void }> = ({ go }) => {
  const { currentUser, requests } = useStore();
  const [search, setSearch] = useState('');

  const mine = requests.filter((r) => r.employeeId === currentUser?.id);
  const open = mine.filter((r) => !['Completed', 'Denied'].includes(r.status));
  const filtered = search ? mine.filter((r) => r.trailerNumber.toLowerCase().includes(search.toLowerCase())) : open;
  const recent = [...mine].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)).slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-slate-500">Welcome back,</p>
        <h1 className="text-2xl font-bold text-slate-800">{currentUser?.name}</h1>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => go('new-request')} className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-5 flex flex-col items-start gap-3 transition shadow-sm">
          <FilePlus className="w-7 h-7" />
          <span className="font-semibold text-left">Submit Material Request</span>
        </button>
        <button onClick={() => go('upload')} className="bg-slate-800 hover:bg-slate-900 text-white rounded-2xl p-5 flex flex-col items-start gap-3 transition shadow-sm">
          <Camera className="w-7 h-7" />
          <span className="font-semibold text-left">Upload Work Photos</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-2"><Truck className="w-4 h-4" /> Quick trailer search</label>
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="e.g. #1234"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-slate-800 mb-3">{search ? `Results for "${search}"` : 'My open requests'}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {filtered.length === 0 && <p className="text-sm text-slate-400">No requests found.</p>}
          {filtered.map((r) => <RequestCard key={r.id} req={r} onClick={() => go('detail', r.id)} />)}
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><Bell className="w-4 h-4" /> Recent status updates</h2>
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
          {recent.map((r) => (
            <button key={r.id} onClick={() => go('detail', r.id)} className="w-full flex items-center justify-between p-3.5 text-left hover:bg-slate-50">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{r.itemDescription}</p>
                <p className="text-xs text-slate-400">{r.trailerNumber} · {new Date(r.updatedAt).toLocaleDateString()}</p>
              </div>
              <span className="text-xs font-semibold text-blue-600">{r.status}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeHome;
