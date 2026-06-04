// FieldFlow — mobile-first field-service app (root layout & router)
import React, { useState } from 'react';
import { useStore } from '@/store/AppStore';
import Login from '@/components/Login';
import Shell from '@/components/Shell';
import EmployeeHome from '@/components/employee/EmployeeHome';
import NewRequest from '@/components/employee/NewRequest';
import MyRequests from '@/components/employee/MyRequests';
import UploadPhotos from '@/components/employee/UploadPhotos';
import Profile from '@/components/employee/Profile';
import RequestDetail from '@/components/shared/RequestDetail';
import Dashboard from '@/components/manager/Dashboard';
import ManageRequests from '@/components/manager/ManageRequests';
import PhotoGallery from '@/components/manager/PhotoGallery';
import Reports from '@/components/manager/Reports';
import Employees from '@/components/manager/Employees';
import SettingsPage from '@/components/manager/SettingsPage';
import TrailerHistory from '@/components/manager/TrailerHistory';

const AppLayout: React.FC = () => {
  const { currentUser, loading } = useStore();
  const isManager = currentUser?.role === 'manager' || currentUser?.role === 'admin';
  const [active, setActive] = useState(isManager ? 'dashboard' : 'home');
  const [detailId, setDetailId] = useState<string | null>(null);
  const [trailer, setTrailer] = useState<string | null>(null);

  React.useEffect(() => {
    setActive(isManager ? 'dashboard' : 'home');
    setDetailId(null);
    setTrailer(null);
  }, [currentUser?.id, isManager]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">Loading FieldFlow…</div>;
  if (!currentUser) return <Login />;

  const go = (k: string, id?: string) => {
    if (k === 'detail' && id) { setDetailId(id); setActive('detail'); return; }
    if (k === 'trailer' && id) { setTrailer(id); setActive('trailer'); return; }
    setDetailId(null); setTrailer(null); setActive(k);
  };

  const render = () => {
    if (active === 'detail' && detailId) return <RequestDetail id={detailId} back={() => go(isManager ? 'requests' : 'my-requests')} />;
    if (active === 'trailer' && trailer) return <TrailerHistory trailerNumber={trailer} back={() => go('photos')} go={go} />;

    if (isManager) {
      switch (active) {
        case 'dashboard': return <Dashboard go={go} />;
        case 'requests': return <ManageRequests go={go} />;
        case 'photos': return <PhotoGallery go={go} />;
        case 'reports': return <Reports />;
        case 'employees': return <Employees />;
        case 'settings': return <SettingsPage />;
        default: return <Dashboard go={go} />;
      }
    }
    switch (active) {
      case 'home': return <EmployeeHome go={go} />;
      case 'new-request': return <NewRequest go={go} />;
      case 'my-requests': return <MyRequests go={go} />;
      case 'upload': return <UploadPhotos />;
      case 'profile': return <Profile />;
      default: return <EmployeeHome go={go} />;
    }
  };

  const navActive = active === 'detail' ? (isManager ? 'requests' : 'my-requests') : active === 'trailer' ? 'photos' : active;

  return (
    <div className="font-sans antialiased text-slate-800 min-h-screen bg-slate-50">
      <Shell active={navActive} setActive={(k) => go(k)}>
        {render()}
      </Shell>
    </div>
  );
};

export default AppLayout;
