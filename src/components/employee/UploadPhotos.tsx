import React, { useState } from 'react';
import { useStore } from '@/store/AppStore';
import { Camera, X, CheckCircle2, UploadCloud } from 'lucide-react';

interface Pending { url: string; name: string; }

const UploadPhotos: React.FC = () => {
  const { currentUser, addPhoto } = useStore();
  const [trailer, setTrailer] = useState('');
  const [desc, setDesc] = useState('');
  const [notes, setNotes] = useState('');
  const [pending, setPending] = useState<Pending[]>([]);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(0);

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPending((p) => [...p, ...files.map((f) => ({ url: URL.createObjectURL(f), name: f.name }))]);
  };

  const remove = (i: number) => setPending((p) => p.filter((_, idx) => idx !== i));

  const upload = () => {
    if (!trailer || pending.length === 0) return;
    setUploading(true);
    setProgress(0);
    const tn = trailer.startsWith('#') ? trailer : `#${trailer}`;
    let p = 0;
    const timer = setInterval(() => {
      p += 12;
      setProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(timer);
        pending.forEach((ph) => addPhoto({ trailerNumber: tn, workDescription: desc, notes, photoUrl: ph.url, fileName: ph.name }));
        setDone(pending.length);
        setPending([]);
        setTrailer(''); setDesc(''); setNotes('');
        setUploading(false);
      }
    }, 150);
  };

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Camera className="w-6 h-6 text-blue-600" /> Upload Work Photos</h1>

      {done > 0 && (
        <div className="bg-emerald-50 text-emerald-700 rounded-xl p-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> {done} photo(s) uploaded successfully!
          <button onClick={() => setDone(0)} className="ml-auto text-emerald-600"><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1.5">Employee</label>
          <input value={currentUser?.name || ''} disabled className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1.5">Trailer Number *</label>
          <input value={trailer} onChange={(e) => setTrailer(e.target.value)} placeholder="#1234" className="w-full px-3.5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1.5">Work description (optional)</label>
          <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="e.g. Framing complete" className="w-full px-3.5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1.5">Notes (optional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full px-3.5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
        </div>

        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-blue-200 rounded-2xl py-8 text-blue-600 cursor-pointer hover:bg-blue-50">
          <UploadCloud className="w-8 h-8" />
          <span className="font-semibold">Take or choose photos</span>
          <span className="text-xs text-slate-400">Camera & gallery · multiple allowed</span>
          <input type="file" accept="image/*" capture="environment" multiple onChange={onPick} className="hidden" />
        </label>

        {pending.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {pending.map((p, i) => (
              <div key={i} className="relative">
                <img src={p.url} alt="" className="w-full h-24 object-cover rounded-xl" />
                <button onClick={() => remove(i)} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1"><X className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        )}

        {uploading && (
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div className="bg-blue-600 h-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}

        <button onClick={upload} disabled={!trailer || pending.length === 0 || uploading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold py-3.5 rounded-xl text-lg">
          {uploading ? `Uploading ${progress}%` : `Upload ${pending.length || ''} Photo(s)`}
        </button>
        <p className="text-xs text-slate-400 text-center">Photos are compressed & linked to trailer, employee, and timestamp.</p>
      </div>
    </div>
  );
};

export default UploadPhotos;
