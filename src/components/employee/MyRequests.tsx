import React, { useState } from 'react';
import { useStore } from '@/store/AppStore';
import { STATUSES, RequestStatus } from '@/lib/types';
import RequestCard from '@/components/shared/RequestCard';
import { ClipboardList } from 'lucide-react';

const MyRequests: React.FC<{ go: (k: string, id?: string) => void }> = ({ go }) => {
  const { currentUser, requests } = useStore();
  const [filter, setFilter] = useState<RequestStatus | 'All'>('All');

  const mine = requests.filter((r) => r.employeeId === currentUser?.id);
  const list = filter === 'All' ? mine : mine.filter((r) => r.status === filter);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><ClipboardList className="w-6 h-6 text-blue-600" /> My Requests</h1>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {(['All', ...STATUSES] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium ${filter === s ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{s}</button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {list.length === 0 && <p className="text-slate-400 text-sm">No requests in this category.</p>}
        {list.map((r) => <RequestCard key={r.id} req={r} onClick={() => go('detail', r.id)} />)}
      </div>
    </div>
  );
};

export default MyRequests;
