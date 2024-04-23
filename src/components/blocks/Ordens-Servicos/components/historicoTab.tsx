'use client'; 
import { useEffect, useState } from 'react';  
import { useServiceOrder } from '@/contexts'; 
import { BaseTable } from '@/components/table/BaseTable';
import Pagination from '@/components/ui/pagination';
import { useQuery } from '@tanstack/react-query';
import { serviceOrderService } from '@/services/OperationalService/serviceOrderService';
import { ServiceOrder } from '@/types/models/ServiceOrder/serviceOrder';
import { CheckBox, ExportButton, FiltroButton } from '@/components/ui';
import dayjs from 'dayjs';

export const HistoricoTab = (
  {
    openFilterModal,
  }: {
    openFilterModal: () => void;
  }
) => { 

  const {
    serviceOrders
  } = useServiceOrder();  
  
  useEffect(() => {
    serviceOrders.setFilter(
      prev =>({
      ...prev,
      start: undefined,
      pageSize: 5,
      page: 0
    }))
  }, [])

  const {isLoading, data: count} = useQuery({
    queryKey: ['serviceOrdersTable', serviceOrders.filter],
    queryFn: () => serviceOrderService.countServiceOrderAsync(serviceOrders.filter), 
    refetchOnWindowFocus: false,
  })

  const [selected, setSelected] = useState<ServiceOrder[]>([]);
 
      return (
        <div>  
          <div
            className='flex justify-end  items-center w-full gap-6 mb-6'
          >
            <FiltroButton onClick={openFilterModal}
              className=' !h-12'
            />
            <ExportButton onClick={
              () => {
                console.log(selected)
              }
            }
              className=' !h-12 hidden md:flex'
              disabled={selected.length === 0}
              /> 
          </div> 
          <BaseTable
            rows={serviceOrders.data ?? []}
            isLoading={serviceOrders.isLoading}
            columns={[{
              label: 'Código',
              key: 'code',
              rowFormatter: (row) => { 
                return <div
                className="flex items-center gap-1 group"
                style={{ height: "70px" }}
              >
                <div
                  className="w-0 group-hover:!w-12 overflow-hidden transition-all items-center gap-1"
                  style={
                    selected.find((v) => v.id === row.id)
                      ? {
                          width: "2rem",
                        }
                      : {}
                  }
                >
                  <CheckBox
                    variant="secondary"
                    value={!!selected.find((v) => v.id === row.id)}
                    onChange={() => {
                      setSelected((prev) => {
                        if (!!selected.find((v) => v.id === row.id)) {
                          return prev.filter((v) => v.id !== row.id);
                        }
                        return [...prev, row];
                      });
                    }}
                  />
                </div>
                <div>{row.code}</div>
              </div>
              },
              mobileTitle: true
            },
            {
              label:'Procedimento',
              key: 'description'
            },
            {
              label: 'Data de Solicitação',
              key: 'requestDate',
              Formatter: (requestDate) => {
                return requestDate && dayjs(requestDate).format('DD/MM/YYYY')
              }
            },
            {
              label: 'Responsável',
              key: 'supervisor',
              Formatter: (supervisor) => {
                return supervisor.name
              }
            },
            {
              label: 'Status',
              key: 'status',
              Formatter: (status) => {
                return status.description
              }
            },
            {
              label: 'Data de execução',
              key: 'executionDate',
              Formatter: (executionDate) => {
                return executionDate && dayjs(executionDate).format('DD/MM/YYYY')
              }
            }
          ]}
          />
          {!isLoading && <Pagination
            currentPage={serviceOrders.filter.page}
            onChange={(page) => serviceOrders.setFilter(prev => ({...prev, page}))}
            totalPages={
              Math.ceil((count || 0) / serviceOrders.filter.pageSize)
            }
          />}
        </div>
      ); 
 
}