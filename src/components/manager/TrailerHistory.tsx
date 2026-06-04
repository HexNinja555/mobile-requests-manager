import React from 'react';
import { useStore } from '@/store/AppStore';
import { StatusBadge, PriorityBadge } from '@/components/shared/Badges';
import { exportToExcel } from '@/lib/exportXlsx';
import { ArrowLeft, Truck, Download, FileArchive } from 'lucide-react';

const TrailerHistory: React.FC<{ trailerNumber: string; back: () => void; go: (k: string, id?: string) => void }> = ({ trailerNumber, back, go }) => {
  const { requests, photos, userById } = useStore();
  const reqs = requests.filter((r) => r.trailerNumber === trailerNumber);
  const pics = photos.filter((p) => p.trailerNumber === trailerNumber);

  const exportHistory = () => exportToExcel(`trailer_${trailerNumber.replace('#', '')}`, reqs.map((r) => ({
    Item: r.itemDescription, Qty: r.quantity, Priority: r.priority, Status: r.status,
    Employee: userById(r.employeeId)?.name, Created: new Date(r.createdAt).toLocaleDateString(),
  })));

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <button onClick={back} className="flex items-center gap-1.5 text-slate-500 text-sm font-medium"><ArrowLeft className="w-4 h-4" /> Back</button>
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Truck className="w-9 h-9" />
          <div>
            <p className="text-blue-100 text-sm">Trailer History</p>
            <h1 className="text-2xl font-bold">{trailerNumber}</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={exportHistory} className="bg-white/20 text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5"><Download className="w-4 h-4" /> Export</button>
          <button onClick={() => alert('Photo package ZIP would download (placeholder).')} className="bg-white/20 text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5"><FileArchive className="w-4 h-4" /> Photos ZIP</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center"><p className="text-3xl font-bold text-blue-600">{reqs.length}</p><p className="text-sm text-slate-500">Requests</p></div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center"><p className="text-3xl font-bold text-emerald-600">{pics.length}</p><p className="text-sm text-slate-500">Photos</p></div>
      </div>

      <div>
        <h2 className="font-semibold text-slate-800 mb-3">Material Requests</h2>
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
          {reqs.length === 0 && <p className="p-4 text-sm text-slate-400">No requests for this trailer.</p>}
          {reqs.map((r) => (
            <button key={r.id} onClick={() => go('detail', r.id)} className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50">
              <div><p className="text-sm font-medium text-slate-700">{r.itemDescription}</p><p className="text-xs text-slate-400">Qty {r.quantity} · {userById(r.employeeId)?.name}</p></div>
              <div className="flex gap-2"><PriorityBadge priority={r.priority} /><StatusBadge status={r.status} /></div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-slate-800 mb-3">Completed-Work Photos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {pics.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <img src={p.photoUrl} alt={p.fileName} className="w-full h-24 object-cover" />
              <p className="text-[11px] text-slate-500 p-1.5 truncate">{new Date(p.uploadedAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrailerHistory;
