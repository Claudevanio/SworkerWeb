import { useState } from 'react';
import { SimpleTab } from '../tabs/simple-tab';
import { PageTitle } from '../title';
import { ApartmentOutlined, FolderSharedOutlined, Moving, ViewKanban } from '@mui/icons-material'; 
import { EvolucaoTab } from './Tabs/EvolucaoTab';
import { useModal } from '@/hooks';
import { AdministratorProvider, useAdministrator } from '@/contexts/AdministrationProvider'; 
import { Kanban } from './components/kanban';
import { ServiceOrderProvider } from '@/contexts/serviceOrderProvider';
import { ModalFiltroServicosDashboard } from './Overlay/ModalFiltroServicosDashboard';

export function ServicosOperacionaisComponent(){
  const [activeTab, setActiveTab] = useState<number | undefined>(0)
  const [subTab, setSubTab] = useState<number | undefined>(0)

  const [isFilterModalOpen, openFilterModal, closeFilterModal] = useModal()

  const tabs = [
    { label: 'Kanban',
      icon: <ViewKanban
        className='text-primary-500'
      />, 
     },
    { label: 'Evolução',
      icon: <Moving
      className='text-primary-500'/>, 
    },
  ] 
 

 
  return ( 
    <>
      <div
        className='w-full p-4 lg:p-8'
      >
        <PageTitle
          title='Dashboard'
          subtitle='Veja aqui o status de todas as tarefas'
          // button={{
          //   label: handleLabel(activeTab || 0),
          //   onClick: modal.open,
          //   isAdd: true, 
          // }}
        />
        <SimpleTab
          tabs={tabs as any}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileView
        />
        <div
          className='flex flex-col gap-4'
          style={
            activeTab !== undefined && activeTab === 0 ? {  } : {display: 'none'}
          }
        >
          <Kanban
            openFilterModal={openFilterModal}
          />
        </div>
        <div
          className='flex flex-col gap-4'
          style={
            activeTab !== undefined && activeTab === 1 ? {  } : {display: 'none'}
          }
        >
          <EvolucaoTab>
            alo
          </EvolucaoTab>
        </div>
      </div> 
      <ModalFiltroServicosDashboard
        isOpen={isFilterModalOpen}
        onClose={closeFilterModal}
      />
    </>
  )

}

export function OperacionaisComponentWrapper(){
  return (
    <ServiceOrderProvider>
      <ServicosOperacionaisComponent/>
    </ServiceOrderProvider>
  )
}