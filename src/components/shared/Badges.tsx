import React from 'react';
import { RequestStatus, Priority, STATUS_COLORS, PRIORITY_COLORS } from '@/lib/types';

export const StatusBadge: React.FC<{ status: RequestStatus }> = ({ status }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${STATUS_COLORS[status]}`}>
    {status}
  </span>
);

export const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${PRIORITY_COLORS[priority]}`}>
    {priority}
  </span>
);
