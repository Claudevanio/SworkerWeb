import { BaseTable } from '@/components/table/BaseTable';
import { SearchInput } from '@/components/ui';
import Pagination from '@/components/ui/pagination';
import { useAdministrator } from '@/contexts/AdministrationProvider';
import { useDialog } from '@/hooks/use-dialog';
import { ICompany } from '@/types';
import { masks } from '@/utils';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import { useState } from 'react';
import { RoundedTab } from '../../tabs';
import { CompanyTab } from './EmpresaTabsFolder/Company';
import { CompanyUnityTab } from './EmpresaTabsFolder/CompanyUnity';
import { SectorTab } from './EmpresaTabsFolder/SectorTab';
import { ProfessionalTab } from './EmpresaTabsFolder/Professionals';
import { EquipmentsTab } from './EmpresaTabsFolder/Equipments';

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