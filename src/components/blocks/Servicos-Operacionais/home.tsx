import { useState } from 'react';
import { SimpleTab } from '../tabs/simple-tab';
import { PageTitle } from '../title';
import { ApartmentOutlined, FolderSharedOutlined, Moving, ViewKanban } from '@mui/icons-material'; 
import { EmpresasTab } from './Tabs/EmpresaTab';
import { useModal } from '@/hooks';
import { AdministratorProvider, useAdministrator } from '@/contexts/AdministrationProvider'; 
import { Kanban } from './components/kanban';
import { ServiceOrderProvider } from '@/contexts/serviceOrderProvider';
import { ModalFiltroServicosDashboard } from './Overlay/ModalFiltroEquipament';

export function ServicosOperacionaisComponent(){
  const [activeTab, setActiveTab] = useState<number | undefined>(0)
  const [subTab, setSubTab] = useState<number | undefined>(0)

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

  const handleLabel = (index: number) => {
    if(activeTab === 0) return 'Adicionar Permissão'
    if(!subTab){
      return index===0 ? 'Adicionar Permissão' : 'Adicionar Empresa' 
    } 
    return (subTab === 0 ? 'Adicionar Empresa' :
    subTab === 1 ? 'Adicionar Unidade' : 
    subTab === 2 ? 'Adicionar Setor' :
    subTab === 3 ? 'Adicionar Profissional' :
    'Adicionar Equipamento' 
    )
  }



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
          <Kanban/>
        </div>
        <div
          className='flex flex-col gap-4'
          style={
            activeTab !== undefined && activeTab === 1 ? {  } : {display: 'none'}
          }
        >
          <EmpresasTab
            activeTab={
              subTab
            }
            setActiveTab={
              setSubTab
            }
          />
        </div>
      </div> 
      <ModalFiltroServicosDashboard
        isOpen={true}
        onClose={() => {}}
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