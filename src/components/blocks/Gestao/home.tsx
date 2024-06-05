import { useEffect, useState } from 'react'; 
import { PageTitle } from '../title'; 
import { EmpresasTab } from './Tabs/EmpresaTab'; 
import { ModalTabs } from './Tabs/handleModalTabs';
import { GestaoProvider, useGestao } from '@/contexts/GestaoProvider';

export function GestaoComponent(){
  const [activeTab, setActiveTab] = useState<number | undefined>(0)
  const [subTab, setSubTab] = useState<number | undefined>(0)
 
  const {
    modal,  
  } = useGestao() 
 
  const handleLabel = (index: number) => { 
    return (subTab === 1 ? 'Adicionar Unidade' : 
    subTab === 0 ? 'Adicionar Setor' :
    subTab === 2 ? 'Adicionar Profissional' :
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
          <EmpresasTab
            activeTab={
              subTab
            }
            setActiveTab={
              setSubTab
            }
          /> 
      </div>
      <ModalTabs
        subtab={subTab}
        tab={activeTab}
      />
    </>
  )

}

export function GestaoComponentWrapper(){
  return (
    <GestaoProvider>
      <GestaoComponent/>
    </GestaoProvider>
  )
}