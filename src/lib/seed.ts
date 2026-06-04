import { User, MaterialRequest, WorkPhoto, Priority, RequestStatus } from './types';

const now = Date.now();
const day = 86400000;
const iso = (d: number) => new Date(d).toISOString();

export const SEED_USERS: User[] = [
  { id: 'u1', name: 'Jayden Lopez', email: 'jayden@fieldco.com', role: 'employee', phone: '555-0101', active: true, createdAt: iso(now - 120 * day) },
  { id: 'u2', name: 'Maria Gomez', email: 'maria@fieldco.com', role: 'employee', phone: '555-0102', active: true, createdAt: iso(now - 110 * day) },
  { id: 'u3', name: 'Tyrone Banks', email: 'tyrone@fieldco.com', role: 'employee', phone: '555-0103', active: true, createdAt: iso(now - 100 * day) },
  { id: 'u4', name: 'Emily Chen', email: 'emily@fieldco.com', role: 'employee', phone: '555-0104', active: true, createdAt: iso(now - 95 * day) },
  { id: 'u5', name: 'Carlos Reyes', email: 'carlos@fieldco.com', role: 'employee', phone: '555-0105', active: true, createdAt: iso(now - 90 * day) },
  { id: 'u6', name: 'Sara Khan', email: 'sara@fieldco.com', role: 'employee', phone: '555-0106', active: false, createdAt: iso(now - 85 * day) },
  { id: 'u7', name: 'Derek Wells', email: 'derek@fieldco.com', role: 'employee', phone: '555-0107', active: true, createdAt: iso(now - 80 * day) },
  { id: 'u8', name: 'Aisha Patel', email: 'aisha@fieldco.com', role: 'employee', phone: '555-0108', active: true, createdAt: iso(now - 70 * day) },
  { id: 'm1', name: 'Robert Hayes', email: 'manager@fieldco.com', role: 'manager', phone: '555-0200', active: true, createdAt: iso(now - 200 * day) },
  { id: 'a1', name: 'Office Admin', email: 'admin@fieldco.com', role: 'admin', phone: '555-0300', active: true, createdAt: iso(now - 220 * day) },
];

const trailers = ['#1234', '#1180', '#2045', '#3310', '#1099', '#4521', '#2298', '#1234', '#5567', '#1180'];
const items = [
  '2x4 Lumber (8ft)', 'Roofing Shingles', 'Electrical Wire 12AWG', 'PVC Pipe 1in', 'Insulation Rolls R-19',
  'Drywall Sheets 4x8', 'Concrete Mix 60lb', 'Box of Drill Bits', 'LED Work Lights', 'Safety Harness',
  'Caulk Tubes', 'Galvanized Screws', 'Plywood 3/4in', 'Copper Fittings', 'HVAC Duct Tape',
  'Window Flashing', 'Subfloor Adhesive', 'Rebar #4', 'Vapor Barrier', 'Door Hinges',
];
const priorities: Priority[] = ['Low', 'Normal', 'High', 'Urgent'];
const statuses: RequestStatus[] = ['Submitted', 'Approved', 'Denied', 'Ordered', 'Delivered', 'Completed'];

export const SEED_REQUESTS: MaterialRequest[] = Array.from({ length: 20 }).map((_, i) => {
  const empId = `u${(i % 8) + 1}`;
  const status = statuses[i % statuses.length];
  const created = now - (i * 2 + 1) * day;
  const updated = created + day;
  const trailer = trailers[i % trailers.length];
  return {
    id: `r${i + 1}`,
    employeeId: empId,
    trailerNumber: trailer,
    itemDescription: items[i],
    quantity: ((i * 3) % 25) + 1,
    priority: priorities[i % priorities.length],
    notes: i % 3 === 0 ? 'Needed before end of week for trailer build-out.' : '',
    status,
    managerNotes: status === 'Denied' ? 'Out of budget this month — resubmit next cycle.' : status === 'Approved' ? 'Approved, sourcing now.' : '',
    createdAt: iso(created),
    updatedAt: iso(updated),
    history: [
      { status: 'Submitted', by: empId, at: iso(created) },
      ...(status !== 'Submitted' ? [{ status, by: 'm1', note: '', at: iso(updated) }] : []),
    ],
  };
});

const ph = (seed: string) => `https://picsum.photos/seed/${seed}/600/400`;

export const SEED_PHOTOS: WorkPhoto[] = Array.from({ length: 15 }).map((_, i) => {
  const empId = `u${(i % 8) + 1}`;
  const trailer = trailers[i % trailers.length];
  return {
    id: `p${i + 1}`,
    employeeId: empId,
    trailerNumber: trailer,
    requestId: i % 4 === 0 ? `r${i + 1}` : undefined,
    photoUrl: ph(`work${i}`),
    fileName: `completed_work_${i + 1}.jpg`,
    workDescription: ['Framing complete', 'Wiring run finished', 'Drywall installed', 'Final inspection ready', 'Roofing done'][i % 5],
    notes: i % 2 === 0 ? 'Passed visual QC.' : '',
    uploadedAt: iso(now - i * day),
  };
});
