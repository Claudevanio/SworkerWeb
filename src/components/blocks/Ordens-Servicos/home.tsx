'use client';
import { useState } from 'react';
import { SimpleTab } from '../tabs/simple-tab';
import { PageTitle } from '../title';
import { ApartmentOutlined, FolderSharedOutlined, History, JoinInnerOutlined, Moving, ViewKanban } from '@mui/icons-material';
import { AgrupamentoTab } from './Tabs/AgrupamentoTab';
import { useModal } from '@/hooks';
import { AdministratorProvider, useAdministrator } from '@/contexts/AdministrationProvider';

import { ServiceOrderProvider } from '@/contexts/serviceOrderProvider';
import { ModalFiltroServicosDashboard } from './Overlay/ModalFiltroServicosDashboard';
import { HistoricoTab } from './components/historicoTab';

export function OrdensSevicoComponent() {
  const [activeTab, setActiveTab] = useState<number | undefined>(0);
  const [subTab, setSubTab] = useState<number | undefined>(0);

  const [isFilterModalOpen, openFilterModal, closeFilterModal] = useModal();

  const tabs = [
    { label: 'Agrupamentos', icon: <JoinInnerOutlined className="text-primary-500" /> },
    { label: 'Histórico', icon: <History className="text-primary-500" /> }
  ];

  return (
    <>
      <div className="w-full p-4 lg:p-8">
        <PageTitle
          title="Ordens de serviço"
          subtitle="Veja aqui o status de todas as tarefas"
          // button={{
          //   label: handleLabel(activeTab || 0),
          //   onClick: modal.open,
          //   isAdd: true,
          // }}
        />
        <SimpleTab tabs={tabs as any} activeTab={activeTab} setActiveTab={setActiveTab} mobileView />
        {activeTab === 1 && (
          <div className="flex flex-col gap-4" style={activeTab !== undefined && activeTab === 1 ? {} : { display: 'none' }}>
            <HistoricoTab openFilterModal={openFilterModal} />
          </div>
        )}
        {activeTab === 0 && (
          <div className="flex flex-col gap-4" style={activeTab !== undefined && activeTab === 0 ? {} : { display: 'none' }}>
            <AgrupamentoTab openFilterModal={openFilterModal} />
          </div>
        )}
      </div>
      <ModalFiltroServicosDashboard isOpen={isFilterModalOpen} onClose={closeFilterModal} />
    </>
  );
}

export function OrdensSevicoWrapper() {
  return (
    <ServiceOrderProvider>
      <OrdensSevicoComponent />
    </ServiceOrderProvider>
  );
}
