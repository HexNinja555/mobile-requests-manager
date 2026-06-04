import React, { useState, useMemo } from 'react';
import { useStore } from '@/store/AppStore';
import { STATUSES, PRIORITIES, RequestStatus, Priority } from '@/lib/types';
import RequestCard from '@/components/shared/RequestCard';
import { exportToExcel } from '@/lib/exportXlsx';
import { Search, Download, Filter } from 'lucide-react';

const ManageRequests: React.FC<{ go: (k: string, id?: string) => void }> = ({ go }) => {
  const { requests, userById } = useStore();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<RequestStatus | 'All'>('All');
  const [priority, setPriority] = useState<Priority | 'All'>('All');

  const list = useMemo(() => {
    return requests.filter((r) => {
      const emp = userById(r.employeeId)?.name.toLowerCase() || '';
      const match = !q || r.trailerNumber.toLowerCase().includes(q.toLowerCase()) || emp.includes(q.toLowerCase()) || r.itemDescription.toLowerCase().includes(q.toLowerCase());
      return match && (status === 'All' || r.status === status) && (priority === 'All' || r.priority === priority);
    });
  }, [requests, q, status, priority, userById]);

  const exportExcel = () => {
    exportToExcel('material_requests', list.map((r) => ({
      ID: r.id, Employee: userById(r.employeeId)?.name, Trailer: r.trailerNumber, Item: r.itemDescription,
      Quantity: r.quantity, Priority: r.priority, Status: r.status, ManagerNotes: r.managerNotes,
      Created: new Date(r.createdAt).toLocaleDateString(),
    })));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-slate-800">Requests</h1>
        <button onClick={exportExcel} className="flex items-center gap-2 bg-emerald-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl"><Download className="w-4 h-4" /> Export Excel</button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search trailer #, employee, or item..." className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Filter className="w-4 h-4 text-slate-400" />
          <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="px-3 py-2 rounded-xl border border-slate-200 text-sm">
            <option value="All">All Statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="px-3 py-2 rounded-xl border border-slate-200 text-sm">
            <option value="All">All Priorities</option>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <span className="text-sm text-slate-400 ml-auto">{list.length} result(s)</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {list.map((r) => <RequestCard key={r.id} req={r} showEmployee onClick={() => go('detail', r.id)} />)}
      </div>
    </div>
  );
};

export default ManageRequests;
