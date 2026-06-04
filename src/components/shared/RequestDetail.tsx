import React, { useState } from 'react';
import { useStore } from '@/store/AppStore';
import { STATUSES, RequestStatus } from '@/lib/types';
import { StatusBadge, PriorityBadge } from './Badges';
import { ArrowLeft, Truck, Clock, Image as ImageIcon, Check, X } from 'lucide-react';

const RequestDetail: React.FC<{ id: string; back: () => void }> = ({ id, back }) => {
  const { requests, photos, userById, currentUser, updateStatus, updateManagerNotes } = useStore();
  const req = requests.find((r) => r.id === id);
  const [noteDraft, setNoteDraft] = useState(req?.managerNotes || '');
  const isManager = currentUser?.role === 'manager' || currentUser?.role === 'admin';

  if (!req) return <button onClick={back} className="text-blue-600">← Back</button>;
  const emp = userById(req.employeeId);
  const related = photos.filter((p) => p.requestId === req.id || p.trailerNumber === req.trailerNumber);

  const actions: { status: RequestStatus; cls: string }[] = [
    { status: 'Approved', cls: 'bg-blue-600' },
    { status: 'Denied', cls: 'bg-red-600' },
    { status: 'Ordered', cls: 'bg-amber-500' },
    { status: 'Delivered', cls: 'bg-indigo-600' },
    { status: 'Completed', cls: 'bg-emerald-600' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <button onClick={back} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm font-medium"><ArrowLeft className="w-4 h-4" /> Back</button>

      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-800">{req.itemDescription}</h1>
            <p className="text-slate-500 mt-1">Quantity: {req.quantity}</p>
          </div>
          <StatusBadge status={req.status} />
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <PriorityBadge priority={req.priority} />
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-50 rounded-full px-2.5 py-0.5"><Truck className="w-3.5 h-3.5" /> {req.trailerNumber}</span>
        </div>
        <dl className="grid grid-cols-2 gap-4 mt-5 text-sm">
          <Info label="Employee" value={emp?.name || '—'} />
          <Info label="Created" value={new Date(req.createdAt).toLocaleString()} />
          <Info label="Updated" value={new Date(req.updatedAt).toLocaleString()} />
          <Info label="Priority" value={req.priority} />
        </dl>
        {req.notes && <div className="mt-4 bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-400 mb-1">Employee notes</p><p className="text-sm text-slate-700">{req.notes}</p></div>}
        {req.managerNotes && <div className="mt-3 bg-blue-50 rounded-xl p-3"><p className="text-xs text-blue-400 mb-1">Manager notes</p><p className="text-sm text-blue-800">{req.managerNotes}</p></div>}
      </div>

      {isManager && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
          <h2 className="font-semibold text-slate-800">Manager Actions</h2>
          <div className="flex flex-wrap gap-2">
            {actions.map((a) => (
              <button key={a.status} onClick={() => updateStatus(req.id, a.status)}
                className={`${a.cls} text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 ${req.status === a.status ? 'opacity-60' : ''}`}>
                {a.status === 'Approved' && <Check className="w-4 h-4" />}{a.status === 'Denied' && <X className="w-4 h-4" />}{a.status}
              </button>
            ))}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Manager notes</label>
            <textarea value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} rows={2} className="w-full px-3.5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
            <button onClick={() => updateManagerNotes(req.id, noteDraft)} className="mt-2 bg-slate-800 text-white text-sm font-semibold px-4 py-2 rounded-xl">Save Notes</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-4"><Clock className="w-5 h-5 text-slate-400" /> Status Timeline</h2>
        <ol className="space-y-3">
          {req.history.map((h, i) => (
            <li key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mt-1" />
                {i < req.history.length - 1 && <div className="w-0.5 flex-1 bg-slate-200" />}
              </div>
              <div className="pb-1">
                <p className="text-sm font-medium text-slate-700">{h.status}</p>
                <p className="text-xs text-slate-400">{userById(h.by)?.name || h.by} · {new Date(h.at).toLocaleString()}</p>
                {h.note && <p className="text-xs text-slate-500 mt-0.5">{h.note}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>

      {related.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-4"><ImageIcon className="w-5 h-5 text-slate-400" /> Related Photos ({related.length})</h2>
          <div className="grid grid-cols-3 gap-2">
            {related.slice(0, 6).map((p) => <img key={p.id} src={p.photoUrl} alt={p.fileName} className="w-full h-24 object-cover rounded-xl" />)}
          </div>
        </div>
      )}
    </div>
  );
};

const Info: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div><dt className="text-xs text-slate-400">{label}</dt><dd className="text-slate-700 font-medium">{value}</dd></div>
);

export default RequestDetail;
