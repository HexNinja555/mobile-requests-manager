import React from 'react';
import { useStore } from '@/store/AppStore';
import { STATUSES } from '@/lib/types';
import { exportToExcel } from '@/lib/exportXlsx';
import { Download, Users, Truck, Calendar, PieChart, AlertTriangle, Camera } from 'lucide-react';

const Reports: React.FC = () => {
  const { requests, photos, userById, users } = useStore();

  const byEmp: Record<string, number> = {};
  const byTrailer: Record<string, number> = {};
  const byMonth: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  requests.forEach((r) => {
    byEmp[r.employeeId] = (byEmp[r.employeeId] || 0) + 1;
    byTrailer[r.trailerNumber] = (byTrailer[r.trailerNumber] || 0) + 1;
    const m = new Date(r.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
    byMonth[m] = (byMonth[m] || 0) + 1;
    byStatus[r.status] = (byStatus[r.status] || 0) + 1;
  });
  const urgent = requests.filter((r) => r.priority === 'Urgent').length;
  const photosByTrailer: Record<string, number> = {};
  const photosByEmp: Record<string, number> = {};
  photos.forEach((p) => { photosByTrailer[p.trailerNumber] = (photosByTrailer[p.trailerNumber] || 0) + 1; photosByEmp[p.employeeId] = (photosByEmp[p.employeeId] || 0) + 1; });

  const exportEmp = () => exportToExcel('materials_by_employee', Object.entries(byEmp).map(([id, c]) => ({ Employee: userById(id)?.name, Requests: c, Photos: photosByEmp[id] || 0 })));
  const exportTrailer = () => exportToExcel('materials_by_trailer', Object.entries(byTrailer).map(([t, c]) => ({ Trailer: t, Requests: c, Photos: photosByTrailer[t] || 0 })));
  const exportMonthly = () => exportToExcel('monthly_summary', Object.entries(byMonth).map(([m, c]) => ({ Month: m, Requests: c })));
  const exportPhotos = () => exportToExcel('photo_inventory', photos.map((p) => ({ File: p.fileName, Trailer: p.trailerNumber, Employee: userById(p.employeeId)?.name, Uploaded: new Date(p.uploadedAt).toLocaleDateString() })));

  const Card: React.FC<{ title: string; icon: React.ElementType; rows: [string, number][]; onExport: () => void }> = ({ title, icon: Icon, rows, onExport }) => {
    const max = Math.max(...rows.map((r) => r[1]), 1);
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Icon className="w-5 h-5 text-blue-600" /> {title}</h2>
          <button onClick={onExport} className="flex items-center gap-1 text-emerald-600 text-sm font-semibold"><Download className="w-4 h-4" /> Excel</button>
        </div>
        <div className="space-y-2.5">
          {rows.slice(0, 6).map(([label, val]) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-sm text-slate-600 w-28 truncate">{label}</span>
              <div className="flex-1 bg-slate-100 rounded-full h-2.5"><div className="bg-blue-500 h-full rounded-full" style={{ width: `${(val / max) * 100}%` }} /></div>
              <span className="text-sm font-bold text-slate-700 w-8 text-right">{val}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl border border-slate-200 p-4"><AlertTriangle className="w-6 h-6 text-red-500 mb-2" /><p className="text-2xl font-bold text-slate-800">{urgent}</p><p className="text-sm text-slate-500">Urgent Requests</p></div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4"><PieChart className="w-6 h-6 text-blue-500 mb-2" /><p className="text-2xl font-bold text-slate-800">{requests.length}</p><p className="text-sm text-slate-500">Total Requests</p></div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4"><Camera className="w-6 h-6 text-fuchsia-500 mb-2" /><p className="text-2xl font-bold text-slate-800">{photos.length}</p><p className="text-sm text-slate-500">Total Photos</p></div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4"><Users className="w-6 h-6 text-emerald-500 mb-2" /><p className="text-2xl font-bold text-slate-800">{users.filter((u) => u.role === 'employee').length}</p><p className="text-sm text-slate-500">Employees</p></div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={exportEmp} className="bg-emerald-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5"><Download className="w-4 h-4" /> Requests by Employee</button>
        <button onClick={exportTrailer} className="bg-emerald-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5"><Download className="w-4 h-4" /> Trailer Summary</button>
        <button onClick={exportMonthly} className="bg-emerald-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5"><Download className="w-4 h-4" /> Monthly Summary</button>
        <button onClick={exportPhotos} className="bg-emerald-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5"><Download className="w-4 h-4" /> Photo Inventory</button>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card title="Materials by Employee" icon={Users} rows={Object.entries(byEmp).map(([id, c]) => [userById(id)?.name || id, c] as [string, number]).sort((a, b) => b[1] - a[1])} onExport={exportEmp} />
        <Card title="Materials by Trailer" icon={Truck} rows={Object.entries(byTrailer).sort((a, b) => b[1] - a[1])} onExport={exportTrailer} />
        <Card title="Monthly Request Summary" icon={Calendar} rows={Object.entries(byMonth)} onExport={exportMonthly} />
        <Card title="Status Breakdown" icon={PieChart} rows={STATUSES.map((s) => [s, byStatus[s] || 0])} onExport={() => exportToExcel('status_breakdown', STATUSES.map((s) => ({ Status: s, Count: byStatus[s] || 0 })))} />
      </div>
    </div>
  );
};

export default Reports;
