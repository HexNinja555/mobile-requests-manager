import React, { useState, useMemo } from 'react';
import { useStore } from '@/store/AppStore';
import { exportToExcel } from '@/lib/exportXlsx';
import { Search, Download, FileArchive, Mail, Truck, X } from 'lucide-react';

const PhotoGallery: React.FC<{ go: (k: string, id?: string) => void }> = ({ go }) => {
  const { photos, users, userById } = useStore();
  const [q, setQ] = useState('');
  const [emp, setEmp] = useState('All');
  const [lightbox, setLightbox] = useState<string | null>(null);

  const list = useMemo(() => photos.filter((p) => {
    const m = !q || p.trailerNumber.toLowerCase().includes(q.toLowerCase());
    return m && (emp === 'All' || p.employeeId === emp);
  }), [photos, q, emp]);

  const download = (url: string, name: string) => {
    const a = document.createElement('a');
    a.href = url; a.download = name; a.target = '_blank';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const exportList = () => exportToExcel('photos', list.map((p) => ({
    File: p.fileName, Trailer: p.trailerNumber, Employee: userById(p.employeeId)?.name,
    Description: p.workDescription, Notes: p.notes, Uploaded: new Date(p.uploadedAt).toLocaleString(),
  })));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-slate-800">Photo Collection</h1>
        <div className="flex gap-2">
          <button onClick={() => alert('A ZIP archive of all matching photos would be generated and downloaded (placeholder).')} className="flex items-center gap-2 bg-slate-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl"><FileArchive className="w-4 h-4" /> Download ZIP</button>
          <button onClick={exportList} className="flex items-center gap-2 bg-emerald-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl"><Download className="w-4 h-4" /> Export</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search trailer #..." className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <select value={emp} onChange={(e) => setEmp(e.target.value)} className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm">
          <option value="All">All Employees</option>
          {users.filter((u) => u.role === 'employee').map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
        <span className="text-sm text-slate-400">{list.length} photo(s)</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {list.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <button onClick={() => setLightbox(p.photoUrl)} className="block w-full">
              <img src={p.photoUrl} alt={p.fileName} className="w-full h-32 object-cover" />
            </button>
            <div className="p-3">
              <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 mb-1"><Truck className="w-3.5 h-3.5" /> {p.trailerNumber}</div>
              <p className="text-sm font-medium text-slate-700 truncate">{p.workDescription || 'Work photo'}</p>
              <p className="text-xs text-slate-400 truncate">{userById(p.employeeId)?.name}</p>
              <p className="text-xs text-slate-400">{new Date(p.uploadedAt).toLocaleDateString()}</p>
              <div className="flex gap-1.5 mt-2">
                <button onClick={() => download(p.photoUrl, p.fileName)} className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 text-xs font-semibold py-2 rounded-lg"><Download className="w-3.5 h-3.5" /> Save</button>
                <button onClick={() => go('trailer', p.trailerNumber)} className="flex-1 bg-slate-100 text-slate-600 text-xs font-semibold py-2 rounded-lg">Trailer</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {lightbox && (
        <div onClick={() => setLightbox(null)} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <button className="absolute top-4 right-4 text-white"><X className="w-7 h-7" /></button>
          <img src={lightbox} alt="" className="max-h-[85vh] max-w-full rounded-xl" />
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
