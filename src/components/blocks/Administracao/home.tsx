import { useState } from 'react';
import { SimpleTab } from '../tabs/simple-tab';
import { PageTitle } from '../title';
import { ApartmentOutlined, FolderSharedOutlined } from '@mui/icons-material';
import { PermissionsTab } from './Tabs/PermissionTab';
import { EmpresasTab } from './Tabs/EmpresaTab';
import { useModal } from '@/hooks';
import { AdministratorProvider, useAdministrator } from '@/contexts/AdministrationProvider';
import { ModalPermissions } from './Overlay/modalPermissions';
import { ModalTabs } from './Tabs/handleModalTabs';

export function HomeComponent(){
  const [activeTab, setActiveTab] = useState<number | undefined>(0)
  const [subTab, setSubTab] = useState<number | undefined>(0)
 
  const {
    modal,
    permissions,
    companies,
    companyUnities,
    equipments,
    professionals,
    sectors,
  } = useAdministrator()

  const tabs = [
    { label: 'Papéis e permissões',
      icon: <FolderSharedOutlined
        className='text-primary-500'
      />,
      subLabel: ((permissions?.data?.count ?? 0).toString() + ' cadastrados')
     },
    { label: 'Minhas empresas',
      icon: <ApartmentOutlined
      className='text-primary-500'/>,
      subLabel: ((companies?.data?.count ?? 0).toString() + ' cadastradas')
    },
  ] 

  const handleLabel = (index: number) => {
    if(activeTab === 0) {
      'Adicionar Permissão'
    } 
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
          title='Administração'
          subtitle='Veja aqui o andamento e configuração de todos os serviços da empresa'
          button={{
            label: handleLabel(activeTab || 0),
            onClick: modal.open,
            isAdd: true, 
          }}
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
          <PermissionsTab/>
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
      <ModalTabs
        subtab={subTab}
        tab={activeTab}
      />
    </>
  )

}

export function HomeComponentWrapper(){
  return (
    <AdministratorProvider>
      <HomeComponent/>
    </AdministratorProvider>
  )
}