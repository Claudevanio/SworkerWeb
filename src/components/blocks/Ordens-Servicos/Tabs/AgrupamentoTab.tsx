import { BaseTable } from '@/components/table/BaseTable';
import { SearchInput } from '@/components/ui';
import Pagination from '@/components/ui/pagination';
import { useAdministrator } from '@/contexts/AdministrationProvider';
import { useDialog } from '@/hooks/use-dialog';
import { ICompany } from '@/types';
import { masks } from '@/utils';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { RoundedTab } from '../../tabs';  
import { useServiceOrder } from '@/contexts'; 
import { EquipesTab } from './EquipesTab';
import { UnidadesTab } from './UnidadesTab';
import { EmpresasTab } from './EmpresasTab';
import { useUser } from '@/hooks/useUser';
import { SectorTab } from './SectorTab';
export function AgrupamentoTab({ 
  openFilterModal,
} : {  
  openFilterModal: () => void;
}) {  
  const [activeTab, setActiveTab] = useState<number | undefined>(0)
  const tabs = [{
    label: 'Equipes',
    tabIndex: 0,
  },
  {
    label: 'Setores',
    tabIndex: 1,
  },
  {
    label: 'Unidades',
    tabIndex: 2,
  },  
  {
    label: 'Empresas',
    tabIndex: 3,
  }
]

  const {
    serviceOrders,
    professionals
  } = useServiceOrder()


  const {
    user
  } = useUser()

  useEffect(() => {
    if(activeTab !==3){
      professionals.setFilter({
        ...professionals.filter,
        companyId: user?.companyId
      })
    }
  }, [activeTab])
 
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
      activeTab === 0 ? (
        <div>
          <EquipesTab
            openFilterModal={
              openFilterModal
            }
          />
        </div>
      ) : activeTab === 1 ? (
        <div>
          <SectorTab
            openFilterModal={
              openFilterModal
            }
          />
        </div>
      ) : activeTab === 2 ? (
        <div>
          <UnidadesTab
            openFilterModal={
              openFilterModal
            }
          />
        </div>
      ) : activeTab === 3 ? (
        <div>
          <EmpresasTab
            openFilterModal={
              openFilterModal
            }
          />
        </div>
      ) : null
    }
    </div>
  );
}