import { BaseTable } from '@/components/table/BaseTable';
import { FiltroButton, SearchInput } from '@/components/ui';
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
// import { UnidadesTab } from './UnidadesTab';
// import { EmpresasTab } from './EmpresasTab';
import { useUser } from '@/hooks/useUser';
import { useQuery } from '@tanstack/react-query';
import { IServiceOrderDay } from '@/types/models/ServiceOrder/serviceOrder';
import { serviceOrderService } from '@/services/OperationalService/serviceOrderService';
import { SectorTab } from './SectorTab';
import { UnidadesTab } from './UnidadesTab';
// import { mockServiceOrders } from './mock';

export function AgrupamentoTab({ openFilterModal }: { openFilterModal: () => void }) {
  const [activeTab, setActiveTab] = useState<number | undefined>(0);
  const tabs = [
    {
      label: 'Equipes',
      tabIndex: 0
    },
    {
      label: 'Setores',
      tabIndex: 1
    },
    {
      label: 'Unidades',
      tabIndex: 2
    }
  ];

  const { serviceOrders } = useServiceOrder();

  const { user, currentCompany } = useUser();

  const { data, isLoading } = useQuery<IServiceOrderDay[]>({
    queryKey: ['getServiceOrderByDay', currentCompany?.id],
    queryFn: () => serviceOrderService.listServicesDay(currentCompany?.id),
    enabled: !!currentCompany?.id,
    refetchOnWindowFocus: false
  });

  // useEffect(() => {
  //   if(activeTab !==3){
  //     professionals.setFilter({
  //       ...professionals.filter,
  //       companyId: user?.companyId
  //     })
  //   }
  // }, [activeTab])

  useEffect(() => {
    serviceOrders.setFilter(prev => ({
      ...prev,
      start: undefined,
      pageSize: 10,
      page: 1, 
      end: undefined
    }));
  }, [])

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex gap-4 w-full md:hidden">
        <div className="w-full" />
        <FiltroButton onClick={openFilterModal} className=" !h-12 w-full" />
      </div>
      <RoundedTab tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 0 ? (
        <div>
          <EquipesTab openFilterModal={openFilterModal as any} serviceOrders={data} />
        </div>
      ) : activeTab === 1 ? (
        <div>
          <SectorTab openFilterModal={openFilterModal} serviceOrders={data} />
        </div>
      ) : activeTab === 2 ? (
        <div>
          <UnidadesTab
            openFilterModal={openFilterModal}
            serviceOrders={
              data
              // mockServiceOrders
            }
          />
        </div>
      ) : activeTab === 3 ? (
        <div>
          {/* <EmpresasTab
            openFilterModal={
              openFilterModal
            }
          /> */}
        </div>
      ) : null}
    </div>
  );
}
