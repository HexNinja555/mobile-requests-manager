import React from 'react';
import { useStore } from '@/store/AppStore';
import { User as UserIcon, Mail, Phone, Shield, LogOut } from 'lucide-react';

const Profile: React.FC = () => {
  const { currentUser, logout, requests, photos } = useStore();
  if (!currentUser) return null;
  const myReqs = requests.filter((r) => r.employeeId === currentUser.id).length;
  const myPhotos = photos.filter((p) => p.employeeId === currentUser.id).length;

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <h1 className="text-2xl font-bold text-slate-800">Profile</h1>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 text-blue-600 mb-3">
          <UserIcon className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">{currentUser.name}</h2>
        <p className="text-slate-400 capitalize">{currentUser.role}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{myReqs}</p>
          <p className="text-sm text-slate-500">Requests</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
          <p className="text-3xl font-bold text-emerald-600">{myPhotos}</p>
          <p className="text-sm text-slate-500">Photos</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
        <Row icon={Mail} label="Email" value={currentUser.email} />
        <Row icon={Phone} label="Phone" value={currentUser.phone} />
        <Row icon={Shield} label="Role" value={currentUser.role} />
      </div>
      <button onClick={logout} className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-semibold py-3.5 rounded-xl">
        <LogOut className="w-5 h-5" /> Sign Out
      </button>
    </div>
  );
};

const Row: React.FC<{ icon: React.ElementType; label: string; value: string }> = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 p-4">
    <Icon className="w-5 h-5 text-slate-400" />
    <div className="min-w-0">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-medium text-slate-700 capitalize truncate">{value}</p>
    </div>
  </div>
);

export default Profile;
