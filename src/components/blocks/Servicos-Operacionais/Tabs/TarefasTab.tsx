'use client';
import { useServiceOrder } from '@/contexts';
import { ApiResponse, ServiceOrder, ServiceOrderTask, singleTask } from '@/types/models/ServiceOrder/serviceOrder';
import { LineChart } from '@/components/charts/line';
import dayjs from 'dayjs';
import { COLORS } from '@/utils';
import { BarChart } from '@/components/charts/bar';
import { BaseTable } from '@/components/table/BaseTable';
import Pagination from '@/components/ui/pagination';
import usePagination from '@/hooks/use-pagination';

export function TarefasTab({ tasks, tasksIsLoading }: { tasks: ApiResponse; tasksIsLoading: boolean }) {
  const { serviceOrders } = useServiceOrder();

  const tasksData = tasks?.data?.filter(v => v.serviceOrdersOnDemand.length > 0 || v.serviceOrdersProgrammed.length > 0) ?? [];

  const { currentTableData, currentPage, setCurrentPage } = usePagination<ServiceOrderTask>(tasksData, 4);

  const firstDay = serviceOrders?.data?.items?.sort(
    (a: ServiceOrder, b: ServiceOrder) => new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime()
  )[0]?.requestDate;

  const dateDiff = Math.abs(dayjs(firstDay).diff(dayjs(), 'day'));

  const days = Array.from({ length: dateDiff }, (_, i) => dayjs().subtract(i, 'day').format('DD/MM')).sort((a, b) =>
    dayjs(a, 'DD/MM').diff(dayjs(b, 'DD/MM'))
  );

  const demandData = tasksData.flatMap(task =>
    task.serviceOrdersOnDemand.map(singleTask => ({
      ...singleTask,
      estimatedTime:
        task.serviceOrdersProgrammed.length + task.serviceOrdersOnDemand.length > 0
          ? (task.programmed + task.onDemand) / (task.serviceOrdersProgrammed.length + task.serviceOrdersOnDemand.length)
          : 0
    }))
  );
  const programmedData = tasksData.flatMap(task =>
    task.serviceOrdersProgrammed.map(singleTask => ({
      ...singleTask,
      estimatedTime:
        task.serviceOrdersProgrammed.length + task.serviceOrdersOnDemand.length > 0
          ? (task.programmed + task.onDemand) / (task.serviceOrdersProgrammed.length + task.serviceOrdersOnDemand.length)
          : 0
    }))
  );

  const dataArray = days.map(day => {
    return {
      date: day,
      value: demandData.concat(programmedData).filter((task: singleTask) => dayjs(task.taskCheckInDate).format('DD/MM') === day).length
    };
  });

  const dataOnDemandTask = tasksData.map(task => {
    return {
      label: task.name,
      value: task.onDemand,
      type: 'Sob Demanda'
    };
  });

  const dataProgrammedTask = tasksData.map(task => {
    return {
      label: task.name,
      value: task.programmed,
      type: 'Programado'
    };
  });

  const dataForBarChart = [...dataProgrammedTask, ...dataOnDemandTask];

  const formatDuration = (seconds: number) => {
    const duration = dayjs().startOf('day').add(seconds, 'second');
    const hours = duration.hour();
    const minutes = duration.minute();
    const secondsLeft = duration.second();
    const getInMinutes = hours * 60 + minutes + 'min ' + secondsLeft + 's';
    return getInMinutes;
  };

  return (
    <div>
      <h2 className="text-base-7 text-lg md:text-2xl font-bold mb-4">Evolução de tarefas</h2>
      <BaseTable
        rows={currentTableData ?? []}
        isLoading={tasksIsLoading}
        columns={[
          {
            label: 'Procedimento',
            key: 'name',
            mobileTitle: true
          },
          {
            label: 'Tempo previsto',
            key: 'estimatedTime'
          },
          {
            label: 'Tempo Médio',
            key: 'programmed',
            rowFormatter: (serviceOrder: ServiceOrderTask) =>
              serviceOrder.serviceOrdersProgrammed.length + serviceOrder.serviceOrdersOnDemand.length > 0
                ? formatDuration(
                    (serviceOrder.programmed + serviceOrder.onDemand) /
                      (serviceOrder.serviceOrdersProgrammed.length + serviceOrder.serviceOrdersOnDemand.length)
                  )
                : 0
          },
          {
            label: 'Quantidade',
            key: 'onDemand'
          },
          {
            label: 'Desvio padrão',
            key: 'onDemand',
            rowFormatter: (serviceOrder: ServiceOrderTask) => {
              const media = (serviceOrder.programmed + serviceOrder.onDemand) / 2;

              const somaQuadradosDiferencas = Math.pow(serviceOrder.programmed - media, 2) + Math.pow(serviceOrder.onDemand - media, 2);
              const variancia = somaQuadradosDiferencas / 2;
              const desvioPadrao = Math.sqrt(variancia);

              return formatDuration(desvioPadrao);
            }
          }
        ]}
      />
      <Pagination currentPage={currentPage} onChange={page => setCurrentPage(page)} totalPages={Math.ceil(tasksData.length / 4)} />
      <div>
        <h2 className="text-base-7 text-lg md:text-2xl font-bold mt-8 mb-4">Evolução de procedimentos</h2>
        <div>
          <h2 className="text-base-7 text-lg md:text-2xl font-bold mt-8 mb-4">Linha do tempo</h2>
          {
            !dataArray || dataArray.length === 0 ? (
              <div className="flex justify-center items-center h-56">
                <p className="text-base-7 text-lg md:text-2xl font-bold">Não há dados da linha do tempo para exibir</p>
              </div>
            ) : 
          <LineChart data={dataArray ?? []} xField="date" yField="value" height={300} color={COLORS.primary['700']} />
          }
        </div>

        <div className="w-full ">
          <h2 className="text-base-7 text-lg md:text-2xl font-bold mt-8 mb-4 ">Evolução das atividades</h2>
          
          {
            !dataForBarChart || dataForBarChart.length === 0 ? (
              <div className="flex justify-center items-center h-56">
                <p className="text-base-7 text-lg md:text-2xl font-bold">Não há dados da Evolução das atividades para exibir</p>
              </div>
            ) : 
          <div className="w-full overflow-scroll">
            <div className="min-w-[1200px] w-full mr-4">
              <BarChart
                data={dataForBarChart ?? []}
                yField="label"
                xField="value"
                typeOrder={['Sob Demanda', 'Executado']}
                height={300}
                color={[COLORS.base['3'], COLORS.primary['700']]}
              />
            </div>
          </div>
          }

        </div>
      </div>
    </div>
  );
}
