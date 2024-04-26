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
import { TrendingUp } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { Tooltip } from '@mui/material';
import Image from 'next/image'; 

export const HistoricoTab = (
  {
    openFilterModal,
  }: {
    openFilterModal: () => void;
  }
) => { 

  const router = useRouter();

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

  function mapCSVData(data: ServiceOrder[] | ServiceOrder) : string[][] {
    const obj = Array.isArray(data) ? data.map((item) => ({
      Código: item.code,
      Procedimento: item.description,
      'Data de Solicitação':  dayjs(item.requestDate).format('DD/MM/YYYY : HH:mm'),
      Responsável: item.supervisor.name,
      Status: item.status.description,
      'Data de execução': dayjs(item.executionDate).format('DD/MM/YYYY : HH:mm'),
    })) : [{
      Código: data.code,
      Procedimento: data.description,
      'Data de Solicitação':  dayjs(data.requestDate).format('DD/MM/YYYY : HH:mm'),
      Responsável: data.supervisor.name,
      Status: data.status.description,
      'Data de execução': dayjs(data.executionDate).format('DD/MM/YYYY : HH:mm'),
    }]

    if (obj.length === 0) {
      return [];
    }

    const firstArray = Object.keys(obj[0]);

    const csvData = obj.map((item) => firstArray.map((key) => item[key]));

    return [firstArray, ...csvData];

  }
 
      return (
        <div>  
          <div
            className='flex justify-end  items-center w-full gap-6 mb-6'
          >
            <FiltroButton onClick={openFilterModal}
              className=' !h-12'
            />
            <ExportButton 
                csvData={
                  selected.length > 0
                    ? mapCSVData(selected)
                    : mapCSVData(serviceOrders.data ?? [])
                }
                className=' !h-12 hidden md:flex'
                disabled={selected.length === 0}
                fileName='historico_ordens_servico.csv'
              /> 
          </div>  
          <BaseTable
            rows={serviceOrders.data ?? []}
            isLoading={serviceOrders.isLoading}
            actions={[{
              label: 'Evolucao',
              icon: <TrendingUp
                className='text-primary-700'
              />,
              onClick: (data: ServiceOrder) => {
                router.replace(`/servicos-operacionais/${data.id}`)
              }
            },
            {
              label: 'Exportar',
              onClick: ()=>{},
              csv: {
                data: (row) => mapCSVData(row ?? []),
                fileName: 'historico_ordens_servico.csv'
              },
              hiddenDesktop: true
            }
          ]}
            warning={
              (row: ServiceOrder) => !!row.isActive && <Tooltip
                title='Ordem de serviço com Ocorrencia'
                placement='top'
              >
                <Image
                  src='/Warning.svg' 
                  width={40}
                  height={40}
                  alt='warning'
                />
              </Tooltip>
            }
            showAllActions
            columns={[{
              label: 'Código',
              key: 'code',
              rowFormatter: (row) => { 
                return (<>
                  <div
                  className=" hidden md:flex items-center gap-1 group"
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
                <div
                  className="md:hidden"
                >
                  <div
                    className='flex items-center gap-3'
                  >
                    {
                      row.id && <Image
                        className='md:hidden'
                        src='/Warning.svg'
                        width={20}
                        height={20}
                        alt='warning'
                      />
                    }
                    {row.code}</div>
                </div>
                </>
              )
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