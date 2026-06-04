export type Role = 'employee' | 'manager' | 'admin';

export type RequestStatus =
  | 'Submitted'
  | 'Approved'
  | 'Denied'
  | 'Ordered'
  | 'Delivered'
  | 'Completed';

export type Priority = 'Low' | 'Normal' | 'High' | 'Urgent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone: string;
  active: boolean;
  createdAt: string;
}

export interface StatusEvent {
  status: RequestStatus;
  by: string;
  note?: string;
  at: string;
}

export interface MaterialRequest {
  id: string;
  employeeId: string;
  trailerNumber: string;
  itemDescription: string;
  quantity: number;
  priority: Priority;
  notes: string;
  status: RequestStatus;
  managerNotes: string;
  createdAt: string;
  updatedAt: string;
  history: StatusEvent[];
}

export interface WorkPhoto {
  id: string;
  employeeId: string;
  trailerNumber: string;
  requestId?: string;
  photoUrl: string;
  fileName: string;
  workDescription: string;
  notes: string;
  uploadedAt: string;
}

export const STATUSES: RequestStatus[] = [
  'Submitted',
  'Approved',
  'Denied',
  'Ordered',
  'Delivered',
  'Completed',
];

export const PRIORITIES: Priority[] = ['Low', 'Normal', 'High', 'Urgent'];

export const STATUS_COLORS: Record<RequestStatus, string> = {
  Submitted: 'bg-slate-100 text-slate-700 ring-slate-200',
  Approved: 'bg-blue-100 text-blue-700 ring-blue-200',
  Denied: 'bg-red-100 text-red-700 ring-red-200',
  Ordered: 'bg-amber-100 text-amber-700 ring-amber-200',
  Delivered: 'bg-indigo-100 text-indigo-700 ring-indigo-200',
  Completed: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  Low: 'bg-slate-100 text-slate-600 ring-slate-200',
  Normal: 'bg-sky-100 text-sky-700 ring-sky-200',
  High: 'bg-orange-100 text-orange-700 ring-orange-200',
  Urgent: 'bg-red-100 text-red-700 ring-red-200',
};
