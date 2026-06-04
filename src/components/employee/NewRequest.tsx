import React, { useState } from 'react';
import { useStore } from '@/store/AppStore';
import { PRIORITIES, Priority } from '@/lib/types';
import { CheckCircle2, FilePlus, ImagePlus } from 'lucide-react';

const NewRequest: React.FC<{ go: (k: string, id?: string) => void }> = ({ go }) => {
  const { addRequest } = useStore();
  const [trailer, setTrailer] = useState('');
  const [item, setItem] = useState('');
  const [qty, setQty] = useState(1);
  const [priority, setPriority] = useState<Priority>('Normal');
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setPhoto(URL.createObjectURL(f));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    addRequest({ trailerNumber: trailer.startsWith('#') ? trailer : `#${trailer}`, itemDescription: item, quantity: qty, priority, notes });
    setDone(true);
  };

  if (done) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-5">
          <CheckCircle2 className="w-11 h-11 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Request Submitted</h1>
        <p className="text-slate-500 mt-2">Status: <span className="font-semibold text-slate-700">Submitted</span>. Your manager has been notified.</p>
        <div className="flex gap-3 justify-center mt-6">
          <button onClick={() => go('my-requests')} className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold">View My Requests</button>
          <button onClick={() => { setDone(false); setTrailer(''); setItem(''); setQty(1); setNotes(''); setPhoto(null); }} className="bg-slate-100 text-slate-700 px-5 py-3 rounded-xl font-semibold">New Request</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2 mb-5"><FilePlus className="w-6 h-6 text-blue-600" /> New Material Request</h1>
      <form onSubmit={submit} className="space-y-4 bg-white rounded-2xl border border-slate-200 p-5">
        <Field label="Trailer Number">
          <input required value={trailer} onChange={(e) => setTrailer(e.target.value)} placeholder="#1234" className="input" />
        </Field>
        <Field label="Item Description">
          <input required value={item} onChange={(e) => setItem(e.target.value)} placeholder="e.g. 2x4 Lumber (8ft)" className="input" />
        </Field>
        <Field label="Quantity">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="w-12 h-12 rounded-xl bg-slate-100 text-xl font-bold text-slate-600">−</button>
            <input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, +e.target.value))} className="input text-center flex-1" />
            <button type="button" onClick={() => setQty(qty + 1)} className="w-12 h-12 rounded-xl bg-slate-100 text-xl font-bold text-slate-600">+</button>
          </div>
        </Field>
        <Field label="Priority">
          <div className="grid grid-cols-4 gap-2">
            {PRIORITIES.map((p) => (
              <button type="button" key={p} onClick={() => setPriority(p)}
                className={`py-2.5 rounded-xl text-sm font-semibold transition ${priority === p ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{p}</button>
            ))}
          </div>
        </Field>
        <Field label="Notes (optional)">
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Anything the office should know..." className="input resize-none" />
        </Field>
        <Field label="Attach photo (optional)">
          <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl py-4 text-slate-500 cursor-pointer hover:border-blue-300">
            <ImagePlus className="w-5 h-5" /> {photo ? 'Change photo' : 'Add photo'}
            <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} className="hidden" />
          </label>
          {photo && <img src={photo} alt="preview" className="mt-2 rounded-xl h-32 object-cover w-full" />}
        </Field>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl text-lg">Submit Request</button>
      </form>
      <style>{`.input{width:100%;padding:0.75rem 0.875rem;border-radius:0.75rem;border:1px solid #e2e8f0;outline:none}.input:focus{box-shadow:0 0 0 2px #3b82f6}`}</style>
    </div>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="text-sm font-medium text-slate-700 block mb-1.5">{label}</label>
    {children}
  </div>
);

export default NewRequest;
