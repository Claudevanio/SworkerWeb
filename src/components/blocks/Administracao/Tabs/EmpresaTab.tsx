 
import { useAdministrator } from '@/contexts/AdministrationProvider'; 
import { RoundedTab } from '../../tabs';
import { CompanyTab } from './EmpresaTabsFolder/Company';
import { CompanyUnityTab } from './EmpresaTabsFolder/CompanyUnity';
import { SectorTab } from './EmpresaTabsFolder/SectorTab';
import { ProfessionalTab } from './EmpresaTabsFolder/Professionals';
import { EquipmentsTab } from './EmpresaTabsFolder/Equipments';
import { useEffect } from 'react';

export function EmpresasTab({
  activeTab,
  setActiveTab
} : {
  activeTab: number,
  setActiveTab: (value: number) => void
}) {  
  const tabs = [{
    label: 'Empresas',
    tabIndex: 0,
  },
  {
    label: 'Unidades',
    tabIndex: 1,
  },
  {
    label: 'Setores',
    tabIndex: 2,
  },
  {
    label: 'Profissionais',
    tabIndex: 3,
  },
  {
    label: 'Equipamentos',
    tabIndex: 4,
  }] 

  const {
    companies,
    companyUnities,
    equipments,
    professionals,
    sectors,
  } = useAdministrator() 

  useEffect(
    () => {
      if(activeTab === 0){
        companies.reset()
        return
      }
      if(activeTab === 1){
        companyUnities.reset()
        return
      }
      if(activeTab === 2){
        sectors.reset()
        return
      }
      if(activeTab === 3){
        professionals.reset()
        return
      }
      if(activeTab === 4){
        equipments.reset()
        return
      }
    },
    [activeTab]
  )

  const currentTab = () => {
    switch (activeTab) {
      case 0: 
        return <CompanyTab/>
      case 1: 
        return <CompanyUnityTab/>
      case 2: 
        return <SectorTab/>
      case 3: 
        return <ProfessionalTab/>
      case 4: 
        return <EquipmentsTab/>
    }
  }

  return (
    <div
      className='flex flex-col gap-4 w-full'
    > 
    <RoundedTab
      tabs={tabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
    {
      currentTab()
    }
    </div>
  );
}