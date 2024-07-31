'use client';
import { ArrowLeftOutlined, ArrowRightOutlined, East, KeyboardArrowLeft, KeyboardOutlined, West } from '@mui/icons-material';
import Link from 'next/link';
import { DetailCard } from './components/card';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { serviceOrderService } from '@/services/OperationalService/serviceOrderService';
import { ServiceOrder } from '@/types/models/ServiceOrder/serviceOrder';
import dayjs from 'dayjs';
import { IOcurrence } from '@/types/models/Ocurrences/IOcurrence';
import { IProfessional } from '@/types';
import { COLORS } from '@/utils';
import { BarChart } from '@/components/charts/bar';
import { useEffect, useState } from 'react';
import { useCallback } from 'react';
import { BaseTable } from '@/components/table/BaseTable';
import { LineChart } from '@/components/charts/line';
import { RoundedTab } from '@/components/blocks/tabs';
import usePagination from '@/hooks/use-pagination';
import { Box, IconButton } from '@mui/material';
import { useModal } from '@/hooks';
import { ModalOcurrenceDetail } from './components/ModalOcurrenceDetail';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
interface Step {
  taskStepId: number;
  number: string;
  description: string;
  executionDate: string;
  result: string;
  evidenceFile: string | null;
  lastExecutionDate: string | null;
  lastResult: string;
  lastEvidenceFile: string | null;
  executed: boolean;
}

interface Task {
  serviceOrderId: number;
  taskId: number;
  executed: boolean;
  code: string;
  description: string;
  number: number;
  estimatedTime: number;
  professional: IProfessional;
  deleted: boolean;
  checkinDate: string;
  steps: Step[];
  totalSteps: number;
}

function generateLabelsAndValues(tasksSteps: Task[]): { label: string; value: number }[] | null {
  if (!tasksSteps || tasksSteps.length === 0) return null;

  // Sort the tasksSteps by checkinDate
  const sortedSteps = tasksSteps.sort((a, b) => dayjs(a.checkinDate).diff(dayjs(b.checkinDate)));

  // Extract first and last date
  const firstDay = dayjs(sortedSteps[0].checkinDate);
  const lastDay = dayjs(sortedSteps[sortedSteps.length - 1].checkinDate);

  // Calculate difference in seconds
  const diffSeconds = lastDay.diff(firstDay, 'second');

  // Define interval based on difference
  let interval: dayjs.OpUnitType;
  if (diffSeconds > 2 * 24 * 3600) {
    interval = 'day'; // More than two days
  } else if (diffSeconds > 24 * 3600) {
    interval = 'hour'; // More than a day
  } else if (diffSeconds > 3600) {
    interval = 'minute'; // More than an hour
  } else {
    interval = 'second'; // More than a minute
  }

  // Generate labels and values
  const labelsAndValues: { label: string; value: number }[] = [];
  let currentDate = firstDay;
  while (currentDate.isBefore(lastDay)) {
    const label = currentDate.format(interval === 'day' ? 'DD/MM/YYYY' : interval === 'hour' ? 'DD/MM/YYYY HH:mm' : 'HH:mm:ss');
    const value = tasksSteps.filter(step => dayjs(step.checkinDate).isSame(currentDate, interval)).length;
    labelsAndValues.push({ label, value });
    currentDate = currentDate.add(1, interval);
  }

  return labelsAndValues;
}

const formatDuration = (seconds: number) => {
  const duration = dayjs().startOf('day').add(seconds, 'second');
  const hours = duration.hour();
  const minutes = duration.minute();
  const secondsLeft = duration.second();
  const getInMinutes = minutes > 0 ? +(hours * 60 + +minutes) + 'min ' : +(hours * 60 + minutes) + 'min ' + secondsLeft + 's';
  return getInMinutes;
};

export default function ServicoDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useQuery<ServiceOrder>({
    queryKey: ['tasksByServiceOrder', { id }],
    queryFn: () => serviceOrderService.getServiceOrderById(id),
    enabled: !!id,
    refetchOnWindowFocus: false
  });

  const { data: serviceDetail, isLoading: isDetailLoading } = useQuery<any>({
    queryKey: ['ServiceOrderdetail', { id }],
    queryFn: () => serviceOrderService.getServiceOrderDetailById(id),
    enabled: !!id,
    refetchOnWindowFocus: false
  });

  const { data: ocurrences, isLoading: ocurrencesIsLoading } = useQuery<IOcurrence[]>({
    queryKey: ['ocurrencesByServiceOrder', { id }],
    queryFn: () => serviceOrderService.getOcurrencesByServiceOrderId(id),
    enabled: !!id,
    refetchOnWindowFocus: false
  });

  const { data: tasksSteps, isLoading: tasksStepsIsLoading } = useQuery<Task[]>({
    queryKey: ['tasksStepsByServiceOrder', { id }],
    queryFn: () => serviceOrderService.getServiceOrderTaskStepsAsync(id),
    enabled: !!id,
    refetchOnWindowFocus: false
  });

  const [dataProfessional, setDataProfessional] = useState<any[]>([]);

  const fetchProfessionalData = useCallback(
    async (professionalId: number) => {
      try {
        const response = await serviceOrderService.getServiceOrderProfessionalFilesAsync(id, professionalId.toString());
        setDataProfessional(prev => [...prev, response]);
      } catch (error) {
        console.error(error);
      }
    },
    [id]
  );

  useEffect(() => {
    if (!serviceDetail) return;

    console.log(serviceDetail);

    const professionals = serviceDetail?.professionals.map(professional => professional?.professionalId);

    professionals.forEach(professional => {
      fetchProfessionalData(professional);
    });
  }, [serviceDetail, fetchProfessionalData]);

  // const tasksData = tasks?.data?.filter(v => v.serviceOrdersOnDemand.length > 0 || v.serviceOrdersProgrammed.length > 0) ?? []

  const tasksFinishedData = (tasksSteps ?? []).map(item => {
    return {
      label: item.code,
      value: item.steps.filter(step => step.executed).length,
      type: 'Executado'
    };
  });

  const tasksNotFinishedData = (tasksSteps ?? []).map(item => {
    return {
      label: item.code,
      value: item.steps.filter(step => !step.executed).length,
      type: 'Sob Demanda'
    };
  });

  const dataForTasks = [...tasksNotFinishedData, ...tasksFinishedData];

  const labelsAndValues = generateLabelsAndValues(tasksSteps ?? []);

  const dataTable = new Array(4).fill(0).map((_, index) => {
    return {
      checkInDate: dayjs().subtract(index, 'day').toDate(),
      checkOutDate: dayjs().subtract(index, 'day').add(4, 'minute').toDate()
    };
  });

  const [activeTab, setActiveTab] = useState(0);

  const {
    currentPage: currentOcurrencesPage,
    currentTableData: ocurrencesTableData,
    setCurrentPage: setCurrentOcurrencesPage,
    totalPage: totalOcurrencesPage
  } = usePagination(ocurrences ? [...ocurrences] : [], 3);

  const [isModalOpen, openModal, closeModal] = useModal();

  const [selectedOcurrence, setSelectedOcurrence] = useState<IOcurrence | undefined>();

  const onClickRow = (row: IOcurrence) => {
    setSelectedOcurrence(row);
    openModal();
  };

  // const [dataPerProfessional, setDataPerProfessional] = useState<any[]>([])

  // const fetchProfessionalDataPerProfessional = useCallback(async (professionalId: number) => {
  //   try {
  //     const response = await serviceOrderService.getServiceOrderByProfessionalIdAsync(professionalId.toString())
  //     setDataPerProfessional((prev) => [...prev, response])
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }, [id])

  // useEffect(() => {
  //   if (!serviceDetail)
  //     return

  //   const professionals = serviceDetail?.professionals.map((professional) => professional?.professionalId)

  //   professionals.forEach((professional) => {
  //     fetchProfessionalDataPerProfessional(professional)
  //   })

  // }, [serviceDetail, fetchProfessionalDataPerProfessional])

  const {
    currentCompany
  } = useUser();

  const router = useRouter();

  return (
    <div className="w-full p-4 lg:p-8 flex flex-col gap-8">
      <div
        onClick={() => {
          router.back();
        }}
      >
        <KeyboardArrowLeft className="text-base-8 cursor-pointer" fontSize="large" />
      </div>
      <DetailCard.Card>
        <DetailCard.Title wrap>
          <h1 className="text-base-8 text-lg font-bold">Identificação do Serviço</h1>
          <Link href={`/empresa/${currentCompany?.id}/ocorrencias?tab=1`} className=" text-primary-500 underline">
            Ir para tratamento de ocorrencia
          </Link>
        </DetailCard.Title>
        <div
          className="p-4 md:py-6 md:px-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 place-content-between"
          style={{
            rowGap: '1.5rem'
          }}
        >
          <DetailCard.Field label="Código" value={serviceDetail?.code ?? ''} />

          <DetailCard.Field label="Procedimento/Serviço" value={serviceDetail?.description ?? ''} />

          <DetailCard.Field
            label="Data de início"
            value={serviceDetail?.checkInDate ? dayjs(serviceDetail.checkInDate).format('DD/MM/YYYY : HH:mm') : ''}
          />

          <DetailCard.Field label="Check-in" value={serviceDetail?.checkInEndereco ?? ''} />

          <DetailCard.Field label="Check-out" className="" value={data?.checkOutEndereco ?? ''} />
          <DetailCard.Field label="" value={''} className="md:hidden" />

          <DetailCard.Field label="Equipe" value={serviceDetail?.professionals.map(professional => professional.name)} />

          <DetailCard.Field label="Responsável" value={serviceDetail?.supervisor ?? ''} />

          <DetailCard.Field label="Data de encerramento" value={data?.checkOutDate ? dayjs(data.checkOutDate).format('DD/MM/YYYY : HH:mm') : ''} />

          <DetailCard.Field label="Recursos" value={serviceDetail?.equipments.map(equipment => equipment.model)} />
        </div>
      </DetailCard.Card>
      <div>
        {ocurrencesIsLoading ? (
          <div>Carregando...</div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
            {ocurrencesTableData.map((ocurrence: IOcurrence) => {
              return (
                <DetailCard.Card key={Math.random()}>
                  <DetailCard.Title>
                    <h1 className="text-base-8 text-lg font-bold">Ocorrência</h1>
                    <p
                      className="text-base-6 underline cursor-pointer font-semibold"
                      onClick={() => {
                        onClickRow(ocurrence);
                      }}
                    >
                      Ver detalhes
                    </p>
                  </DetailCard.Title>
                  <div className="px-4 py-4 md:py-6 md:px-12 grid grid-cols-2">
                    <DetailCard.Field label="Número" value={ocurrence.number?.toString() ?? ''} />
                    <DetailCard.Field
                      label="Observações"
                      value={!ocurrence.observation || ocurrence.observation === '' ? 'Sem observações' : ocurrence.observation}
                    />
                    <DetailCard.Field label="Procedimento/Serviço" value={ocurrence.serviceOrder?.description ?? ''} />
                    <DetailCard.Field label="Data" value={ocurrence.registerDate ? dayjs(ocurrence.registerDate).format('DD/MM/YYYY : HH:mm') : ''} />
                    <DetailCard.Field label="Local" value={ocurrence.local ?? ''} />
                    <DetailCard.Field label="Tipo" value={ocurrence.occurrenceType.typeName ?? ''} />
                  </div>
                </DetailCard.Card>
              );
            })}
          </div>
        )}
        {totalOcurrencesPage > 1 && (
          <div className="flex flex-row justify-center items-center gap-4 mt-4">
            <IconButton
              onClick={() => {
                setCurrentOcurrencesPage(currentOcurrencesPage - 1);
              }}
              disabled={currentOcurrencesPage === 0}
              className="border-2 border-solid border-primary-600 text-primary-600 disabled:border-base-4"
              size="small"
            >
              <West className="text-lg" />
            </IconButton>
            {Array.from({ length: totalOcurrencesPage }, (_, index) => {
              return (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full cursor-pointer ${currentOcurrencesPage === index ? 'bg-primary-500' : 'bg-base-3'}`}
                  onClick={() => setCurrentOcurrencesPage(index)}
                />
              );
            })}
            <IconButton
              onClick={() => {
                setCurrentOcurrencesPage(currentOcurrencesPage + 1);
              }}
              disabled={currentOcurrencesPage === totalOcurrencesPage - 1}
              className="border-2 border-solid border-primary-600 text-primary-600 disabled:border-base-4"
              size="small"
            >
              <East className="text-lg" />
            </IconButton>
          </div>
        )}
      </div>
      <DetailCard.Card>
        <DetailCard.Title>
          <h1 className="text-base-8 text-lg font-bold">Evolução de atividades</h1>
        </DetailCard.Title>
        <Box
          className="overflow-x-auto flex flex-row px-10"
          sx={{
            '@media (min-width: 768px)': {
              '&::-webkit-scrollbar': {
                width: '.5rem',
                height: '.75rem'
              }
            }
          }}
        >
          <div className="min-w-[1200px] w-full mr-4 mx-2">
            <BarChart
              data={dataForTasks}
              yField="label"
              xField="value"
              typeOrder={['Sob Demanda', 'Executado']}
              height={300}
              color={[COLORS.base['3'], COLORS.primary['700']]}
            />
          </div>
        </Box>
      </DetailCard.Card>

      <DetailCard.Card>
        <DetailCard.Title>
          <h1 className="text-base-8 text-lg font-bold">Dados de analise</h1>
        </DetailCard.Title>
        <div className="px-6 py-8 flex flex-col gap-8">
          {serviceDetail?.professionals?.map(professional => {
            return (
              <div key={professional.id}>
                <p className="text-base-7 font-bold text-base capitalize">{professional.name?.toLowerCase()}</p>
                <BaseTable
                  columns={[
                    {
                      label: 'Data',
                      key: 'checkInDate',
                      Formatter: data => dayjs(data).format('DD/MM/YYYY - HH:mm')
                    },
                    {
                      label: 'Duração',
                      key: 'checkOutDate',
                      rowFormatter: row => {
                        const checkInDate = dayjs(row.checkInDate);
                        const checkOutDate = dayjs(row.checkOutDate);
                        return formatDuration(checkOutDate.diff(checkInDate, 'second'));
                      }
                    }
                  ]}
                  rows={dataTable}
                  hideMobileView
                />
                <div className="flex flex-row gap-4 overflow-auto">
                  <div className="w-full min-w-[1200px] mx-2 mr-4">
                    <LineChart data={labelsAndValues ?? []} xField="label" yField="value" height={300} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DetailCard.Card>

      <DetailCard.Card>
        <DetailCard.Title>
          <h1 className="text-base-8 text-lg font-bold">Detalhes da atividade</h1>
        </DetailCard.Title>
        <div className="flex flex-col py-8 gap-8">
          <div className="px-6">
            <RoundedTab
              tabs={[
                {
                  label: 'Gráfico',
                  tabIndex: 0
                },
                {
                  label: 'Resultados',
                  tabIndex: 1
                }
              ]}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
          {activeTab === 0 ? (
            <div className="px-6">
              <BarChart
                data={dataForTasks}
                yField="label"
                xField="value"
                typeOrder={['Sob Demanda', 'Executado']}
                height={300}
                color={[COLORS.base['3'], COLORS.primary['700']]}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-4 w-full">
              {tasksSteps.map((task, index) => {
                return (
                  <div key={index} className="flex flex-col gap-4">
                    <div className="w-full p-4 bg-primary-200">
                      {task?.professional?.name} - {task?.description}
                    </div>
                    {task.steps.map((step, stepIndex) => {
                      return (
                        <div key={stepIndex} className="flex flex-row gap-4 p-4">
                          <div className="!w-8 !h-8 shrink-0 bg-primary-500 rounded-full flex justify-center items-center text-white">
                            {step.number}
                          </div>
                          <div className="flex flex-col gap-2">
                            <p className="text-base-5 font-semibold">{step.description}</p>
                            <p className="text-base-6 font-bold">{step.result}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DetailCard.Card>
      <ModalOcurrenceDetail isOpen={isModalOpen} onClose={closeModal} current={selectedOcurrence} readonly />
    </div>
  );
}
