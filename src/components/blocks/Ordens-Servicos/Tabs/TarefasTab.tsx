'use client';
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
import { BaseTable } from '@/components/table/BaseTable';
import { useState } from 'react';
import Pagination from '@/components/ui/pagination'; 
import usePagination from '@/hooks/use-pagination';

export function TarefasTab({
  value,
  dataForTasks
} : {
  value: any[];
  dataForTasks: any[];
}){

  const {
    serviceOrders
  } = useServiceOrder()
  
  const tarefas = serviceOrders.data?.map((serviceOrder: ServiceOrder) => {
    return [...serviceOrder.serviceOrderTasks]
  }).flat()
 
  const {
    currentTableData,
    currentPage,
    setCurrentPage
  } = usePagination<ServiceOrder>(serviceOrders.data, 5)

  return(
    <div>
      <h2
        className='text-base-7 text-lg md:text-2xl font-bold mb-4'
      >
        Evolução de tarefas
      </h2>
      <BaseTable
        rows={currentTableData}
        isLoading={serviceOrders.isLoading}
        columns={[
          {
            label: 'Procedimento',
            key: 'description'

          }
        ]}
      />
      <Pagination
        currentPage={currentPage}
        onChange={
          (page) => setCurrentPage(page)
        }
        totalPages={Math.ceil(
          serviceOrders.data.length / 5
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
            <LineChart
              data={value}
              xField='date'
              yField='value'
              height={300}
              color={COLORS.primary['700']}
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
                    data={dataForTasks}
                    yField='label'
                    xField='value'
                    typeOrder={['Não Executado', 'Executado']}
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