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

type LineChartData = {
  date: string;
  value: number;
  type: string;
}

type ProfessionalData = {
  idProfessional: string | number;
  name: string;
  totalQuantity: number;
  totalTime: number;
  totalOnDemand: number;
  totalProgrammed: number;
};

const formatDuration = (seconds: number) => {
  const duration = dayjs().startOf('day').add(seconds, 'second');
  const hours = duration.hour();
  const minutes = duration.minute();
  const secondsLeft = duration.second();
  const getInMinutes = minutes > 0 ? hours * 60 + minutes + 'min ' : hours * 60 + minutes + 'min ' + secondsLeft + 's';
  return getInMinutes;
}

 
function handleProfissionalData(tasksData: ServiceOrderTask[]): Array<ProfessionalData> {
  const aggregatedDataMap = new Map<string | number, ProfessionalData>();

  // Função para adicionar ou atualizar dados de um profissional no mapa agregado
  function addOrUpdateProfessionalData(id: string | number, name: string, time: number, isOnDemand: boolean, totalEstimatedTime: number = 0) {
    if (!aggregatedDataMap.has(id)) {
      aggregatedDataMap.set(id, {
        idProfessional: id,
        name,
        totalQuantity: 0,
        totalTime: 0,
        totalOnDemand: 0,
        totalProgrammed: 0, 
      });
    }

    const professionalData = aggregatedDataMap.get(id)!;

    professionalData.totalQuantity++;
    professionalData.totalTime += time;

    if (isOnDemand) {
      professionalData.totalOnDemand++;
    } else {
      professionalData.totalProgrammed++;
    }
  }

  // Iterar sobre os dados e agregar os totais
  tasksData.forEach((task) => {
    task.serviceOrdersOnDemand.forEach((singleTask) => {
      addOrUpdateProfessionalData(singleTask.professionalId, singleTask.professionalName, Math.abs(dayjs(singleTask.taskCheckInDate).diff(dayjs(singleTask.taskCheckOutDate), 'second')), true );
    });

    task.serviceOrdersProgrammed.forEach((singleTask) => {
      addOrUpdateProfessionalData(singleTask.professionalId, singleTask.professionalName, Math.abs(dayjs(singleTask.taskCheckInDate).diff(dayjs(singleTask.taskCheckOutDate), 'second')), false );
    });


  });

  // Converter o mapa para array e retornar
  return Array.from(aggregatedDataMap.values());
}

export function EquipesTab(
  {
    tasks,
    tasksIsLoading
  } : {
    tasks: ApiResponse;
    tasksIsLoading: boolean;
  }
){

  const {
    serviceOrders
  } = useServiceOrder()
   
  const tasksData = tasks?.data?.filter(v => v.serviceOrdersOnDemand.length > 0 || v.serviceOrdersProgrammed.length > 0) ?? []

  const professionalData : Array<{
    idProfessional: string | number,
    name: string,
    totalQuantity: number,
    totalTime: number,
    totalOnDemand: number,
    totalProgrammed: number
  }> = handleProfissionalData(tasksData)
 
  const {
    currentTableData,
    currentPage,
    setCurrentPage
  } = usePagination<ProfessionalData>((professionalData), 5)

  const firstDay = serviceOrders?.data?.sort((a: ServiceOrder, b: ServiceOrder) => new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime())[0]?.requestDate

  const dateDiff = Math.abs(dayjs(firstDay).diff(dayjs(), 'day'))

  const days = Array.from({ length: dateDiff }, (_, i) => dayjs().subtract(i, 'day').format('DD/MM')).sort((a, b) => dayjs(a, 'DD/MM').diff(dayjs(b, 'DD/MM')))


  const demandData = tasksData.flatMap(task =>
    task.serviceOrdersOnDemand.map(singleTask => ({
      ...singleTask,
      estimatedTime: task.serviceOrdersProgrammed.length + task.serviceOrdersOnDemand.length > 0 ? 
      (task.programmed + task.onDemand) / (task.serviceOrdersProgrammed.length + task.serviceOrdersOnDemand.length) : 0
    }))
  );
  const programmedData = tasksData.flatMap(task =>
    task.serviceOrdersProgrammed.map(singleTask => ({
      ...singleTask,
      estimatedTime: task.serviceOrdersProgrammed.length + task.serviceOrdersOnDemand.length > 0 ? 
      (task.programmed + task.onDemand) / (task.serviceOrdersProgrammed.length + task.serviceOrdersOnDemand.length) : 0
    }))
  )

  const dataArray = days.map((day) => {
    return {date: day, value: demandData.concat(programmedData).filter((task: singleTask) => dayjs(task.taskCheckInDate).format('DD/MM') === day).length 
    }
  })

  const realizingTime = days.map((day) => {
    return {
      date: day,
      value: demandData.concat(programmedData).filter((task: singleTask) => dayjs(task.taskCheckInDate).format('DD/MM') === day).reduce((acc, curr) => acc + Math.abs(dayjs(curr.taskCheckInDate).diff(dayjs(curr.taskCheckOutDate), 'second')), 0),
      type: 'Tempo Realizado'
    }
  })
  
  const avgRealizingTime = days.map((day) => {
    return {
      date: day,
      value:( demandData.find((task: singleTask) => dayjs(task.taskCheckInDate).format('DD/MM') === day)?.estimatedTime ?? 0 ) + ( programmedData.find((task: singleTask) => dayjs(task.taskCheckInDate).format('DD/MM') === day)?.estimatedTime ?? 0),
      type: 'Tempo Médio'
    }
  })



  const dataOnDemandTask = professionalData.map((task) => {
    return {
      label: task.name,
      value: task.totalOnDemand,
      type: 'Sob Demanda'
    }
  } )

  const dataProgrammedTask = professionalData.map((task) => {
    return {
      label: task.name,
      value: task.totalProgrammed,
      type: 'Programado'
    }
  } )

  const dataForBarChart = [ ...dataProgrammedTask, ...dataOnDemandTask,]
  

 
 
  return(
    <div>
      <h2
        className='text-base-7 text-lg md:text-2xl font-bold mb-4'
      >
        Evolução de equipes
      </h2>  
      <BaseTable
        rows={currentTableData ?? []}
        isLoading={tasksIsLoading}
        columns={
          [
            {
              label: 'Equipe',
              key: 'name',
              mobileTitle: true
            }, 
            {
              label: 'Quantidade total',
              key: 'totalQuantity'
            },
            {
              label: 'Tempo total',
              key: 'totalTime',
              Formatter: (value: number) => formatDuration(value)
            }
          ]
        }
      />
      <Pagination
        currentPage={currentPage}
        onChange={
          (page) => setCurrentPage(page)
        }
        totalPages={Math.ceil(
          professionalData.length / 4
        )}
      />
      <div> 
        <h2
          className='text-base-7 text-lg md:text-2xl font-bold mt-8 mb-4'
        >
          Evolução de procedimentos
        </h2> 
          <div>
            <h2
              className='text-base-7 text-lg md:text-2xl font-bold mt-8 mb-4'
            >
              Linha do tempo
            </h2> 
            <h4
              className='text-base-6 mb-2'
            >
              Quantidade de serviços
            </h4>
            <LineChart
              data={dataArray}
              xField='date'
              yField='value'
              height={300}
              color={COLORS.primary['700']}
            />
            <h4
              className='text-base-6 mt-4 b-2'
            >
              Tempo de realização
            </h4>
            <LineChart
              data={
                [
                  ...realizingTime, ...avgRealizingTime
                ]
              }
              xField='date'
              field='type'
              yField='value'
              height={300}
              color={[
                COLORS.primary['700'],
                COLORS.primary['400']
              ]}
            />
          </div>
          
          <div
            className='w-full '
          >
            <h2
              className='text-base-7 text-lg md:text-2xl font-bold mt-8 mb-4 '
            >
              Evolução das atividades
            </h2>  
            <div
              className='w-full overflow-scroll'>
                <div
                  className='min-w-[1500px] w-full mr-4'
                >
                  <BarChart
                    data={dataForBarChart ?? []}
                    yField='label'
                    xField='value'
                    typeOrder={['Sob Demanda', 'Executado']}
                    height={300}
                    color={[ COLORS.base['3'], COLORS.primary['700']]}
                  />
                </div>
              </div>
          </div>
      </div>
    </div>
  )
}