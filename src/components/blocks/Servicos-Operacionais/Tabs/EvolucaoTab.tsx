import { BaseTable } from '@/components/table/BaseTable';
import { FiltroButton, SearchInput } from '@/components/ui';
import Pagination from '@/components/ui/pagination';
import { useAdministrator } from '@/contexts/AdministrationProvider';
import { useDialog } from '@/hooks/use-dialog';
import { ICompany } from '@/types';
import { masks } from '@/utils';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import { useState } from 'react';
import { RoundedTab } from '../../tabs';
import { ProcedimentoTab } from './ProcedimentoTab';
import { useServiceOrder } from '@/contexts';
import { ApiResponse, ServiceOrder } from '@/types/models/ServiceOrder/serviceOrder';
import dayjs from 'dayjs';
import { TarefasTab } from './TarefasTab';
import { useQuery } from '@tanstack/react-query';
import { serviceOrderService } from '@/services/OperationalService/serviceOrderService';
import { EquipesTab } from './EquipesTab';

export function EvolucaoTab({ openFilterModal }: { openFilterModal: () => void }) {
  const [activeTab, setActiveTab] = useState<number | undefined>(0);
  const tabs = [
    {
      label: 'Procedimentos',
      tabIndex: 0
    },
    {
      label: 'Tarefas',
      tabIndex: 1
    },
    {
      label: 'Equipes',
      tabIndex: 2
    }
  ];

  const { serviceOrders } = useServiceOrder();

  const { data: tasks, isLoading: tasksIsLoading } = useQuery<ApiResponse>({
    queryKey: ['tasks', { start: serviceOrders.filter.start, end: serviceOrders.filter.end }],
    queryFn: () =>
      serviceOrderService.dashboardData.listTaskSpentTime({
        start: serviceOrders.filter.start,
        end: serviceOrders.filter.end
      })
  });

  const firstDay = serviceOrders?.data?.items?.sort(
    (a: ServiceOrder, b: ServiceOrder) => new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime()
  )[0]?.requestDate;

  const dateDiff = Math.abs(dayjs(firstDay).diff(dayjs(), 'day'));

  const days = Array.from({ length: dateDiff }, (_, i) => dayjs().subtract(i, 'day').format('DD/MM')).sort((a, b) =>
    dayjs(a, 'DD/MM').diff(dayjs(b, 'DD/MM'))
  );

  const value = days.map(day => {
    return {
      date: day,
      value: serviceOrders.data?.items?.filter((serviceOrder: ServiceOrder) => dayjs(serviceOrder.requestDate).format('DD/MM') === day).length
    };
  });

  const dataCompletedTasks =
    serviceOrders.data?.items?.map((serviceOrder: ServiceOrder) => {
      return {
        label: serviceOrder.code,
        value: serviceOrder?.serviceOrderTaskSteps?.filter(task => task.executed === true).length,
        type: 'Executado'
      };
    }) ?? [];

  const unCompletedTasks =
    serviceOrders.data?.items?.map((serviceOrder: ServiceOrder) => {
      return {
        label: serviceOrder.code,
        value: serviceOrder?.serviceOrderTaskSteps?.filter(task => task.executed === false).length,
        type: 'Não Executado'
      };
    }) ?? [];

  const dataForTasks = [...unCompletedTasks, ...dataCompletedTasks];

  return (
    <div className="flex flex-col gap-4 md:gap-8 w-full">
      <div className="flex sm:items-center justify-between  w-full flex-col gap-4 sm:flex-row ">
        <RoundedTab tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="w-full sm:w-fit flex justify-end ">
          <div className="w-fit">
            <FiltroButton onClick={openFilterModal} />
          </div>
        </div>
      </div>
      {activeTab === 0 ? (
        <div>
          <ProcedimentoTab dataForTasks={dataForTasks} value={value} />
        </div>
      ) : activeTab === 1 ? (
        <div>
          <TarefasTab tasks={tasks} tasksIsLoading={tasksIsLoading} />
        </div>
      ) : activeTab === 2 ? (
        <div>
          <EquipesTab tasks={tasks} tasksIsLoading={tasksIsLoading} />
        </div>
      ) : null}
    </div>
  );
}
