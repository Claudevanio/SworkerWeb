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
        return <p>aloo</p>
      default:
        return <p>alo2</p>
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