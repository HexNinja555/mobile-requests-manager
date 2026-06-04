import React from 'react';
import { useStore } from '@/store/AppStore';
import {
  Home, FilePlus, ClipboardList, Camera, User as UserIcon,
  LayoutDashboard, Images, BarChart3, Users, Settings, LogOut, HardHat,
} from 'lucide-react';

export interface NavItem {
  key: string;
  label: string;
  icon: React.ElementType;
}

const employeeNav: NavItem[] = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'new-request', label: 'New', icon: FilePlus },
  { key: 'my-requests', label: 'Requests', icon: ClipboardList },
  { key: 'upload', label: 'Photos', icon: Camera },
  { key: 'profile', label: 'Profile', icon: UserIcon },
];

const managerNav: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'requests', label: 'Requests', icon: ClipboardList },
  { key: 'photos', label: 'Photos', icon: Images },
  { key: 'reports', label: 'Reports', icon: BarChart3 },
  { key: 'employees', label: 'Employees', icon: Users },
  { key: 'settings', label: 'Settings', icon: Settings },
];

interface ShellProps {
  active: string;
  setActive: (k: string) => void;
  children: React.ReactNode;
}

const Shell: React.FC<ShellProps> = ({ active, setActive, children }) => {
  const { currentUser, logout } = useStore();
  const isManager = currentUser?.role === 'manager' || currentUser?.role === 'admin';
  const nav = isManager ? managerNav : employeeNav;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-60 bg-white border-r border-slate-200 sticky top-0 h-screen">
        <div className="px-5 py-5 flex items-center gap-2 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <HardHat className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-slate-800 text-lg">FieldFlow</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const on = active === item.key;
            return (
              <button key={item.key} onClick={() => setActive(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${on ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                <Icon className="w-5 h-5" /> {item.label}
              </button>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-slate-100">
          <div className="px-3 mb-2">
            <p className="text-sm font-semibold text-slate-800 truncate">{currentUser?.name}</p>
            <p className="text-xs text-slate-400 capitalize">{currentUser?.role}</p>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600">
            <LogOut className="w-5 h-5" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-20 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <HardHat className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-800">FieldFlow</span>
          </div>
          <button onClick={logout} className="text-slate-400 hover:text-red-600 p-1"><LogOut className="w-5 h-5" /></button>
        </header>

        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-6xl w-full mx-auto">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-200 flex">
          {nav.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const on = active === item.key;
            return (
              <button key={item.key} onClick={() => setActive(item.key)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${on ? 'text-blue-600' : 'text-slate-400'}`}>
                <Icon className="w-5 h-5" /> {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Shell;
