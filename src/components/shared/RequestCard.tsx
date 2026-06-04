import React from 'react';
import { MaterialRequest } from '@/lib/types';
import { StatusBadge, PriorityBadge } from './Badges';
import { useStore } from '@/store/AppStore';
import { Truck, Calendar, ChevronRight } from 'lucide-react';

const RequestCard: React.FC<{ req: MaterialRequest; onClick?: () => void; showEmployee?: boolean }> = ({ req, onClick, showEmployee }) => {
  const { userById } = useStore();
  return (
    <button onClick={onClick} className="text-left w-full bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md hover:border-blue-200 transition">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-slate-800 truncate">{req.itemDescription}</p>
          <p className="text-sm text-slate-500 mt-0.5">Qty {req.quantity}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-300 shrink-0" />
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <StatusBadge status={req.status} />
        <PriorityBadge priority={req.priority} />
        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-50 rounded-full px-2.5 py-0.5">
          <Truck className="w-3.5 h-3.5" /> {req.trailerNumber}
        </span>
      </div>
      <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(req.createdAt).toLocaleDateString()}</span>
        {showEmployee && <span className="font-medium text-slate-500">{userById(req.employeeId)?.name}</span>}
      </div>
    </button>
  );
};

export default RequestCard;
