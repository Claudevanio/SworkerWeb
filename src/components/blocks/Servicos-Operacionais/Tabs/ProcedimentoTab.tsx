import Image from 'next/image';
import { OcurrenceList } from '../../shared/ocurrenceList';
import { Icon, ProcedureCard } from './ProcedureCard';
import { TrendingUp } from '@mui/icons-material';
import { useServiceOrder } from '@/contexts';
import { ServiceOrder } from '@/types/models/ServiceOrder/serviceOrder';
import { LineChart } from '@/components/charts/line';
import dayjs from 'dayjs';
import { COLORS } from '@/utils';
import { BarChart } from '@/components/charts/bar';
import { serviceOrderService } from '@/services/OperationalService/serviceOrderService';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/hooks/useUser';

export function ProcedimentoTab({ value, dataForTasks }: { value: any[]; dataForTasks: any[] }) {
  const { serviceOrders } = useServiceOrder();

  const pendentes = serviceOrders.data?.items?.filter((serviceOrder: ServiceOrder) => serviceOrder.status.description === 'Pendente').length;
  const executando = serviceOrders.data?.items?.filter((serviceOrder: ServiceOrder) => serviceOrder.status.description === 'Executando').length;
  const revisar = serviceOrders.data?.items?.filter((serviceOrder: ServiceOrder) => serviceOrder.status.description === 'Revisar').length;
  const cancelado = serviceOrders.data?.items?.filter((serviceOrder: ServiceOrder) => serviceOrder.status.description === 'Cancelado').length;
  const concluido = serviceOrders.data?.items?.filter((serviceOrder: ServiceOrder) => serviceOrder.status.description === 'Concluído').length;
  const total = serviceOrders.data?.items?.length;

  const totalGraph = [
    {
      name: 'Pendente',
      value: pendentes,
      color: '#FFFA88'
    },
    {
      name: 'Executando',
      value: executando,
      color: '#9EF6F6'
    },
    {
      name: 'Revisar',
      value: revisar,
      color: '#CF80FF'
    },
    {
      name: 'Cancelado',
      value: cancelado,
      color: '#FF8888'
    },
    {
      name: 'Concluído',
      value: concluido,
      color: '#93D089'
    }
  ];

  const totalEvoluton = [
    {
      name: 'Pendente',
      value: pendentes,
      icon: '/procedure-pending.svg'
    },
    {
      name: 'Executando',
      value: executando,
      icon: '/procedure-executing.svg'
    },
    {
      name: 'Revisar',
      value: revisar,
      icon: '/procedure-review.svg'
    },
    {
      name: 'Cancelado',
      value: cancelado,
      icon: '/procedure-canceled.svg'
    },
    {
      name: 'Total',
      value: total,
      icon: '/procedure-total.svg'
    }
  ];

  const { currentCompany } = useUser();

  const { data: ocorrencias, isLoading } = useQuery<{
    geradas: {
      count: number;
      change: number;
      unfilteredCount: number;
    };
    reconhecidas: {
      count: number;
      change: number;
      unfilteredCount: number;
    };
    closed: {
      count: number;
      change: number;
      unfilteredCount: number;
    };
  }>({
    queryKey: ['serviceOrders', serviceOrders.filter],
    queryFn: () =>
      serviceOrderService.dashboardData.ocurrenceData(currentCompany?.id, {
        start: serviceOrders.filter.start,
        end: serviceOrders.filter.end
      }),
    refetchInterval: 120000,
    refetchOnWindowFocus: false,
    enabled: !!currentCompany
  });

  return (
    <div>
      <h2 className="text-base-7 text-lg md:text-2xl font-bold mb-4">Ocorrências</h2>
      <OcurrenceList
        encerradas={{
          count: ocorrencias?.closed?.count ?? 0,
          label:
            ocorrencias?.closed?.change > 0
              ? `${ocorrencias?.closed?.change.toLocaleString('pt-br', {
                  maximumFractionDigits: 2
                })}% a mais que o período anterior`
              : `${ocorrencias?.closed?.change.toLocaleString('pt-br', {
                  maximumFractionDigits: 2
                })}% a menos que o período anterior`,
          variant: ocorrencias?.closed?.change > 0 ? 'success' : 'danger'
        }}
        geradas={{
          count: ocorrencias?.geradas?.count ?? 0,
          label:
            ocorrencias?.geradas?.change > 0
              ? `${ocorrencias?.geradas?.unfilteredCount} ${ocorrencias?.geradas?.change.toLocaleString('pt-br', {
                  maximumFractionDigits: 2
                })}% a mais que o período anterior`
              : `${ocorrencias?.geradas?.change.toLocaleString('pt-br', {
                  maximumFractionDigits: 2
                })}% a menos que o período anterior`,
          variant: ocorrencias?.geradas?.change > 0 ? 'success' : 'danger'
        }}
        reconhecidas={{
          count: ocorrencias?.reconhecidas?.count ?? 0,
          label:
            ocorrencias?.reconhecidas?.change > 0
              ? `${ocorrencias?.reconhecidas?.change.toLocaleString('pt-br', {
                  maximumFractionDigits: 2
                })}% a mais que o período anterior`
              : `${ocorrencias?.reconhecidas?.change.toLocaleString('pt-br', {
                  maximumFractionDigits: 2
                })}% a menos que o período anterior`,
          variant: ocorrencias?.reconhecidas?.change > 0 ? 'success' : 'danger'
        }}
      />
      <div>
        <h2 className="text-base-7 text-lg md:text-2xl font-bold mt-8 mb-4">Evolução de procedimentos</h2>
        <div className="w-full flex flex-col md:flex-row gap-4">
          <div className="w-full flex flex-col md:grid md:grid-cols-2 gap-4">
            {totalEvoluton.map((item, index) => (
              <div className={index === 4 ? 'col-span-2' : ''} key={index}>
                <ProcedureCard>
                  <Icon icon={<Image src={item.icon} width={32} height={32} alt={item.name} />} />
                  <div>
                    <p className="text-base-7 text-base font-semibold">{item.name}</p>
                    <p className="text-base-5 text-base font-semibold">{item.value}</p>
                  </div>
                </ProcedureCard>
              </div>
            ))}
          </div>
          <div className="w-full border-primary-50 border-2 rounded-lg p-6">
            <h2 className="text-base-4 text-base">Total</h2>
            <h3 className="text-base-8 text-[3rem] flex items-center gap-2 font-bold mt-[-10px]">
              {total}
              <TrendingUp className="text-[2.5rem]" />
            </h3>

            <div className="flex flex-row gap-0 rounded-lg overflow-hidden mb-4">
              {totalGraph.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 "
                  style={{
                    width: `${(item.value * 100) / total + 1}%`
                  }}
                >
                  <div
                    className="w-full h-4 "
                    style={{
                      backgroundColor: item.color
                    }}
                  >
                    <div
                      className="h-full"
                      style={{
                        width: `${(item.value * 100) / total}%`,
                        backgroundColor: item.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <ul className="list-disc flex flex-col gap-4 pl-6">
              {totalGraph.map((item, index) => (
                <li key={index} className="align-middle">
                  <div className="items-center gap-2 w-full justify-between flex">
                    <p className="text-base-8  font-semibold flex items-center gap-4">
                      {item.name}
                      <span
                        className="w-4 h-4 rounded-lg"
                        style={{
                          backgroundColor: item.color
                        }}
                      />
                    </p>
                    <p className="text-base-7 text-base font-bold">{item.value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <h2 className="text-base-7 text-lg md:text-2xl font-bold mt-8 mb-4">Linha do tempo</h2>
          <LineChart data={value} xField="date" yField="value" height={300} color={COLORS.primary['700']} />
        </div>

        <div className="w-full ">
          <h2 className="text-base-7 text-lg md:text-2xl font-bold mt-8 mb-4 ">Evolução das atividades</h2>
          <div className="w-full overflow-scroll">
            <div className="min-w-[1500px] w-full mr-4">
              <BarChart
                data={dataForTasks}
                yField="label"
                xField="value"
                typeOrder={['Não Executado', 'Executado']}
                height={300}
                color={[COLORS.base['3'], COLORS.primary['700']]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
