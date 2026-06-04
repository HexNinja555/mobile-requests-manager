import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { User, MaterialRequest, WorkPhoto, RequestStatus, Priority, StatusEvent } from '@/lib/types';

interface NewRequestInput { trailerNumber: string; itemDescription: string; quantity: number; priority: Priority; notes: string; }
interface NewPhotoInput { trailerNumber: string; requestId?: string; workDescription: string; notes: string; photoUrl: string; fileName: string; }

interface Store {
  currentUser: User | null;
  loading: boolean;
  users: User[];
  requests: MaterialRequest[];
  photos: WorkPhoto[];
  login: (email: string, password?: string) => Promise<boolean>;
  loginAs: (id: string) => void;
  logout: () => void;
  userById: (id: string) => User | undefined;
  addRequest: (input: NewRequestInput) => Promise<MaterialRequest | null>;
  updateStatus: (id: string, status: RequestStatus, note?: string) => Promise<void>;
  updateManagerNotes: (id: string, notes: string) => Promise<void>;
  addPhoto: (input: NewPhotoInput) => Promise<void>;
  addUser: (u: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
  updateUser: (id: string, patch: Partial<User>) => Promise<void>;
}

const Ctx = createContext<Store | null>(null);

const mapUser = (p: any): User => ({ id: p.id, name: p.name, email: p.email, role: p.role, phone: p.phone || '', active: p.active, createdAt: p.created_at });
const mapReq = (r: any): MaterialRequest => ({
  id: r.id, employeeId: r.employee_id, trailerNumber: r.trailer_number, itemDescription: r.item_description,
  quantity: r.quantity, priority: r.priority, notes: r.notes, status: r.status, managerNotes: r.manager_notes,
  createdAt: r.created_at, updatedAt: r.updated_at,
  history: (r.request_status_history || []).map((h: any): StatusEvent => ({ status: h.new_status, by: h.changed_by, note: h.note, at: h.created_at })),
});
const mapPhoto = (p: any): WorkPhoto => ({ id: p.id, employeeId: p.employee_id, trailerNumber: p.trailer_number, requestId: p.request_id || undefined, photoUrl: p.photo_url, fileName: p.file_name, workDescription: p.work_description, notes: p.notes, uploadedAt: p.uploaded_at });

export const AppStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<MaterialRequest[]>([]);
  const [photos, setPhotos] = useState<WorkPhoto[]>([]);

  const refresh = useCallback(async () => {
    const [{ data: pr }, { data: rq }, { data: ph }] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at'),
      supabase.from('material_requests').select('*, request_status_history(*)').order('created_at', { ascending: false }),
      supabase.from('work_photos').select('*').order('uploaded_at', { ascending: false }),
    ]);
    setUsers((pr || []).map(mapUser));
    setRequests((rq || []).map(mapReq).map((r) => ({ ...r, history: r.history.sort((a, b) => +new Date(a.at) - +new Date(b.at)) })));
    setPhotos((ph || []).map(mapPhoto));
  }, []);

  const loadProfile = useCallback(async (uid: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', uid).single();
    if (data) { setCurrentUser(mapUser(data)); await refresh(); }
  }, [refresh]);

  useEffect(() => {
    (async () => {
      try { await supabase.functions.invoke('seed-demo'); } catch (_) { /* noop */ }
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) await loadProfile(data.session.user.id);
      setLoading(false);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) loadProfile(session.user.id);
      else { setCurrentUser(null); setUsers([]); setRequests([]); setPhotos([]); }
    });
    return () => sub.subscription.unsubscribe();
  }, [loadProfile]);

  const login = useCallback(async (email: string, password = 'password123') => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return !error;
  }, []);

  const loginAs = useCallback((idOrEmail: string) => {
    const map: Record<string, string> = { u1: 'jayden@fieldco.com', m1: 'manager@fieldco.com', a1: 'admin@fieldco.com' };
    const email = map[idOrEmail] || idOrEmail;
    supabase.auth.signInWithPassword({ email, password: 'password123' });
  }, []);

  const logout = useCallback(() => { supabase.auth.signOut(); }, []);
  const userById = useCallback((id: string) => users.find((u) => u.id === id), [users]);

  const addRequest = useCallback(async (input: NewRequestInput) => {
    if (!currentUser) return null;
    const { data } = await supabase.from('material_requests').insert({
      employee_id: currentUser.id, trailer_number: input.trailerNumber, item_description: input.itemDescription,
      quantity: input.quantity, priority: input.priority, notes: input.notes,
    }).select('*, request_status_history(*)').single();
    if (data) {
      await supabase.from('request_status_history').insert({ request_id: data.id, new_status: 'Submitted', changed_by: currentUser.id });
      await refresh();
      return mapReq(data);
    }
    return null;
  }, [currentUser, refresh]);

  const updateStatus = useCallback(async (id: string, status: RequestStatus, note?: string) => {
    if (!currentUser) return;
    const prev = requests.find((r) => r.id === id);
    await supabase.from('material_requests').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    await supabase.from('request_status_history').insert({ request_id: id, old_status: prev?.status, new_status: status, changed_by: currentUser.id, note: note || '' });
    await refresh();
  }, [currentUser, requests, refresh]);

  const updateManagerNotes = useCallback(async (id: string, notes: string) => {
    await supabase.from('material_requests').update({ manager_notes: notes, updated_at: new Date().toISOString() }).eq('id', id);
    await refresh();
  }, [refresh]);

  const addPhoto = useCallback(async (input: NewPhotoInput) => {
    if (!currentUser) return;
    await supabase.from('work_photos').insert({
      employee_id: currentUser.id, trailer_number: input.trailerNumber, request_id: input.requestId || null,
      photo_url: input.photoUrl, file_name: input.fileName, work_description: input.workDescription, notes: input.notes,
    });
    await refresh();
  }, [currentUser, refresh]);

  const addUser = useCallback(async (u: Omit<User, 'id' | 'createdAt'>) => {
    await supabase.from('profiles').insert({ id: crypto.randomUUID(), name: u.name, email: u.email, role: u.role, phone: u.phone, active: u.active });
    await refresh();
  }, [refresh]);

  const updateUser = useCallback(async (id: string, patch: Partial<User>) => {
    const db: any = {};
    if (patch.role) db.role = patch.role;
    if (patch.active !== undefined) db.active = patch.active;
    if (patch.name) db.name = patch.name;
    await supabase.from('profiles').update(db).eq('id', id);
    await refresh();
  }, [refresh]);

  return (
    <Ctx.Provider value={{ currentUser, loading, users, requests, photos, login, loginAs, logout, userById, addRequest, updateStatus, updateManagerNotes, addPhoto, addUser, updateUser }}>
      {children}
    </Ctx.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore must be used within AppStoreProvider');
  return ctx;
};
