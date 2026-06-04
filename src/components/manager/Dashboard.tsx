import React from 'react';
import { useStore } from '@/store/AppStore';
import { StatusBadge } from '@/components/shared/Badges';
import {
  ClipboardList, AlertTriangle, CheckCircle2, PackageCheck, Truck, Camera, Calendar, TrendingUp,
} from 'lucide-react';

const Stat: React.FC<{ icon: React.ElementType; label: string; value: number; color: string }> = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-4">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}><Icon className="w-5 h-5" /></div>
    <p className="text-2xl font-bold text-slate-800">{value}</p>
    <p className="text-sm text-slate-500">{label}</p>
  </div>
);

const Dashboard: React.FC<{ go: (k: string, id?: string) => void }> = ({ go }) => {
  const { requests, photos, userById } = useStore();
  const monthAgo = Date.now() - 30 * 86400000;

  const open = requests.filter((r) => !['Completed', 'Denied'].includes(r.status)).length;
  const urgent = requests.filter((r) => r.priority === 'Urgent' && r.status !== 'Completed').length;
  const approved = requests.filter((r) => r.status === 'Approved').length;
  const ordered = requests.filter((r) => r.status === 'Ordered').length;
  const delivered = requests.filter((r) => r.status === 'Delivered').length;
  const monthly = requests.filter((r) => +new Date(r.createdAt) > monthAgo).length;

  const byEmp: Record<string, number> = {};
  requests.forEach((r) => { byEmp[r.employeeId] = (byEmp[r.employeeId] || 0) + 1; });
  const top = Object.entries(byEmp).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const recentPhotos = [...photos].sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt)).slice(0, 6);
  const recentReqs = [...requests].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)).slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Manager Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat icon={ClipboardList} label="Open Requests" value={open} color="bg-blue-100 text-blue-600" />
        <Stat icon={AlertTriangle} label="Urgent" value={urgent} color="bg-red-100 text-red-600" />
        <Stat icon={CheckCircle2} label="Approved" value={approved} color="bg-emerald-100 text-emerald-600" />
        <Stat icon={PackageCheck} label="Ordered" value={ordered} color="bg-amber-100 text-amber-600" />
        <Stat icon={Truck} label="Delivered" value={delivered} color="bg-indigo-100 text-indigo-600" />
        <Stat icon={Camera} label="Total Photos" value={photos.length} color="bg-fuchsia-100 text-fuchsia-600" />
        <Stat icon={Calendar} label="This Month" value={monthly} color="bg-sky-100 text-sky-600" />
        <Stat icon={TrendingUp} label="All Requests" value={requests.length} color="bg-slate-100 text-slate-600" />
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => go('requests')} className="bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl">Manage Requests</button>
        <button onClick={() => go('photos')} className="bg-slate-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl">Photo Gallery</button>
        <button onClick={() => go('reports')} className="bg-white border border-slate-200 text-slate-700 text-sm font-semibold px-4 py-2.5 rounded-xl">Export Reports</button>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Top Employees by Volume</h2>
          <div className="space-y-3">
            {top.map(([id, count], i) => (
              <div key={id} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <span className="text-sm font-medium text-slate-700 flex-1">{userById(id)?.name}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2 max-w-[120px]">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(count / top[0][1]) * 100}%` }} />
                </div>
                <span className="text-sm font-bold text-slate-700 w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Recent Activity</h2>
          <div className="divide-y divide-slate-100">
            {recentReqs.map((r) => (
              <button key={r.id} onClick={() => go('detail', r.id)} className="w-full flex items-center justify-between py-2.5 text-left">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{r.itemDescription}</p>
                  <p className="text-xs text-slate-400">{userById(r.employeeId)?.name} · {r.trailerNumber}</p>
                </div>
                <StatusBadge status={r.status} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-800">Recent Photo Uploads</h2>
          <button onClick={() => go('photos')} className="text-sm text-blue-600 font-medium">View all</button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {recentPhotos.map((p) => (
            <div key={p.id} className="relative">
              <img src={p.photoUrl} alt={p.fileName} className="w-full h-20 object-cover rounded-xl" />
              <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">{p.trailerNumber}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
