import React from 'react';
import AppLayout from '@/components/AppLayout';
import { AppProvider } from '@/contexts/AppContext';
import { AppStoreProvider } from '@/store/AppStore';

const Index: React.FC = () => {
  return (
    <AppProvider>
      <AppStoreProvider>
        <AppLayout />
      </AppStoreProvider>
    </AppProvider>
  );
};

export default Index;
