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

export function EvolucaoTab({
  children 
} : { 
  children: React.ReactNode
}) {  
  const [activeTab, setActiveTab] = useState<number | undefined>(0)
  const tabs = [{
    label: 'Procedimentos',
    tabIndex: 0,
  },
  {
    label: 'Tarefas',
    tabIndex: 1,
  },
  {
    label: 'Equipes',
    tabIndex: 2,
  },  
]
 
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
      children
    }
    </div>
  );
}