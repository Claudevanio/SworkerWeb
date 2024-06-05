// 'use client'; 
// import { useEffect, useState, useCallback } from 'react';  
// import { useServiceOrder } from '@/contexts'; 
// import { BaseTable } from '@/components/table/BaseTable';
// import Pagination from '@/components/ui/pagination';
// import { useQuery } from '@tanstack/react-query';
// import { serviceOrderService } from '@/services/OperationalService/serviceOrderService';
// import { ServiceOrder } from '@/types/models/ServiceOrder/serviceOrder';
// import { CheckBox, ExportButton, FiltroButton } from '@/components/ui';
// import dayjs from 'dayjs';
// import { TrendingUp } from '@mui/icons-material';
// import { useRouter } from 'next/navigation';
// import { Skeleton, Tooltip } from '@mui/material';
// import Image from 'next/image'; 
// import CustomizedGroupAccordion from './customizedGroupAccordeon';
// import { basePagination, IProfessional } from '@/types';
// import { professionalService } from '@/services';
// import { useUser } from '@/hooks/useUser';
// import usePagination from '@/hooks/use-pagination';

// function formatDate(dateString : string) {
//   let date = dayjs(dateString);
   
//   if (!date.isValid()) { 
//       date = dayjs(dateString, 'DD/MM/YYYY'); 
//       if (!date.isValid()) { 
//           return null;  
//       }
//   }
   
//   return date.toISOString();
// }

// export const EquipesTab = (
//   {
//     openFilterModal,
//   }: {
//     openFilterModal: () => void;
//   }
// ) => { 

//   const router = useRouter();

//   const {
//     serviceOrders,
//     status,
//     professionals
//   } = useServiceOrder();  
   
 

//   const [selected, setSelected] = useState<ServiceOrder[]>([]);

//   function mapCSVData(data: ServiceOrder[] | ServiceOrder) : string[][] {
//     const obj = Array.isArray(data) ? data.map((item) => ({
//       Código: item.code,
//       Procedimento: item.description,
//       'Data de Solicitação':  dayjs(item.requestDate).format('DD/MM/YYYY : HH:mm'),
//       Responsável: item.supervisor.name,
//       Status: item.status.description,
//       'Data de execução': dayjs(item.executionDate).format('DD/MM/YYYY : HH:mm'),
//     })) : [{
//       Código: data.code,
//       Procedimento: data.description,
//       'Data de Solicitação':  dayjs(data.requestDate).format('DD/MM/YYYY : HH:mm'),
//       Responsável: data.supervisor.name,
//       Status: data.status.description,
//       'Data de execução': dayjs(data.executionDate).format('DD/MM/YYYY : HH:mm'),
//     }]

//     if (obj.length === 0) {
//       return [];
//     }

//     const firstArray = Object.keys(obj[0]);

//     const csvData = obj.map((item) => firstArray.map((key) => item[key]));

//     return [firstArray, ...csvData]; 
//   }

//   const paginatedProfessionals  = usePagination(professionals.data ?? [], 5);

//   const [selectedGroup, setSelectedGroup] = useState<IProfessional | null>(null); 

//   useEffect(() => {
//     if (professionals.data && !selectedGroup) {
//       setSelectedGroup(professionals.data[0]);
//     }
//   }, [
//     professionals.data
//   ])
//   const {
//     data,
//     isLoading
//   } = useQuery({
//     queryKey: ['AgrupamentoByProfessional', selectedGroup?.id],
//     queryFn: () => serviceOrderService.getServiceOrderByProfessionalIdAsync(selectedGroup?.id ?? ''),
//     enabled: !!selectedGroup,
//     refetchOnWindowFocus: false,
//   })

//   interface FilterCriteria {
//     date?: string;
//     osCode?: string;
//     procedure?: string;
//     executionDateStart?: string;
//     executionDateEnd?: string;
//     start?: string;
//     end?: string;
//     team?: string;
//     status?: number;
//   }
  
//   // Função para filtrar os dados com base nos critérios
//   const filterServiceOrders = useCallback((serviceOrders: ServiceOrder[], criteria: FilterCriteria): ServiceOrder[] => {
//     debugger;
//     if(!serviceOrders) return [];
//     if(Object.keys(criteria).length === 0) return serviceOrders; 
//     if(Object.values(criteria).every(value => (!value || value === ''))) return serviceOrders;
//     return serviceOrders.filter(order => { 
//       if (criteria.date && !dayjs(order.requestDate).isAfter(dayjs(formatDate(criteria.date)).toISOString())) {
//         return false;
//       }
//       if (criteria.osCode && !order.code.includes(criteria.osCode)) {
//         return false;
//       }
//       if (criteria.procedure && !order.description.includes(criteria.procedure)) {
//         return false;
//       }
//       if (criteria.executionDateStart && !dayjs(order.executionDate).isAfter(dayjs(formatDate(criteria.executionDateStart)).toISOString())){
//         return false;
//       }
//       if (criteria.executionDateEnd && !dayjs(order.executionDate).isBefore(dayjs(formatDate(criteria.executionDateEnd)).toISOString())) {
//         return false;
//       }
//       if (criteria.start && !dayjs(order.checkInDate).isAfter(dayjs(formatDate(criteria.start)).toISOString())) {
//         return false;
//       }
//       if (criteria.end && !dayjs(order.checkInDate).isBefore(dayjs(formatDate(criteria.end)).toISOString())) {
//         return false;
//       }
//       if (criteria.team && !order.supervisor?.name.includes(criteria.team)) {
//         return false;
//       }
//       if (criteria.status !== undefined && order.status?.id !== criteria.status) {
//         return false;
//       } 
//       return true;
//     });
//   }, []);
  

//   const [filteredData, setFilteredData] = useState<ServiceOrder[] | null>(null);

//   useEffect(() => {
//     if (data) {
//       setFilteredData(filterServiceOrders(data, serviceOrders.filter));
//     }
//   }, [data, filterServiceOrders, serviceOrders.filter]);
  
//   const paginatedServiceOrders = usePagination(filteredData ?? [], 3);



//       return (
//         <div
//           className='flex flex-col gap-6 w-full'
//         >  
//           <div
//             className='justify-end  items-center w-full gap-6 hidden md:flex'
//           >
//             <FiltroButton onClick={openFilterModal}
//               className=' !h-12'
//             />
//             <ExportButton 
//                 csvData={
//                   selected.length > 0
//                     ? mapCSVData(selected)
//                     : mapCSVData(serviceOrders.data ?? [])
//                 }
//                 className=' !h-12 hidden md:flex'
//                 disabled={selected.length === 0}
//                 fileName='historico_ordens_servico.csv'
//               /> 
//           </div>  
//           <div
//             className='bg-primary-50 border-2 border-base-2 rounded-lg px-4 w-full grid grid-cols-2 md:flex justify-between items-center '
//           >
//             {
//               status.isLoading && <div
//                 className='flex items-center gap-2 p-2 min-h-8'
//               >
//                 <Skeleton
//                   variant='text'
//                   width={100}
//                   height={32}
//                 />
//               </div>
//             }
//             {
//               status.data?.map((item) => {
//                 return (
//                   <div
//                     key={item.id}
//                     className='flex gap-2 items-center p-2'
//                   > 
//                     <div
//                       className='text-primary-500 font-medium'
//                     >{item.description}: {item.count ?? 0}</div>
//                   </div>
//                 )
//               })
//             }

//           </div>
//           <CustomizedGroupAccordion
//             summary='Equipes'
//           >
//             <div
//               className='p-4 flex flex-col gap-8'
//             >

//               <div
//                 className='grid md:grid-cols-3 lg:grid-cols-5 gap-4'
//               >
//                 {
//                   professionals.isLoading && new Array(5).fill(0).map((_, index) => { 
//                     return (
//                       <div
//                         key={index}
//                         className={`flex gap-2 items-center p-6 cursor-pointer rounded-lg transition-all ${
//                           index === 0
//                             ? 'bg-primary-700'
//                             : 'bg-primary-50'
//                         }`}
//                       > 
//                       <div
//                         className='bg-base-3 w-12 h-12 rounded-full flex-shrink-0'
//                       />  <Skeleton
//                           variant='text'
//                           width={100}
//                           height={32}
//                         /> 
//                       </div>
//                     )
//                   })
//                 }
//                 {
//                   paginatedProfessionals.currentTableData?.map((item) => {
//                     return (
//                       <div
//                         key={item.id}
//                         className={`flex gap-2 items-center p-6 cursor-pointer rounded-lg transition-all ${
//                           selectedGroup?.id === item.id
//                             ? 'bg-primary-700'
//                             : 'bg-primary-50'
//                         }`}
//                         onClick={() => setSelectedGroup(item)}
//                       > 
//                       <div
//                         className='bg-base-3 w-12 h-12 rounded-full flex-shrink-0'
//                       />
//                         <div
//                           className={`font-medium ${
//                             selectedGroup?.id === item.id
//                               ? 'text-base-1'
//                               : 'text-base-7'
//                           }`}
//                         >{item.name}</div>
//                       </div>
//                     )
//                   })
//                 } 
//               </div>
//               <Pagination
//                 currentPage={paginatedProfessionals.currentPage}
//                 onChange={(page) => paginatedProfessionals.setCurrentPage(page)}
//                 totalPages={paginatedProfessionals.totalPage}
//               />
//             </div>
//           </CustomizedGroupAccordion>
//           <p
//             className='text-base-4 font-medium md:mb-[-2rem]'
//           >
//             {
//               selectedGroup?.name
//             }
//           </p>
//           <BaseTable
//             rows={paginatedServiceOrders.currentTableData ?? []}
//             isLoading={isLoading}
//             actions={[{
//               label: 'Evolucao',
//               icon: <TrendingUp
//                 className='text-primary-700'
//               />,
//               onClick: (data: ServiceOrder) => {
//                 router.replace(`/servicos-operacionais/${data.id}`)
//               }
//             },
//             {
//               label: 'Exportar',
//               onClick: ()=>{},
//               csv: {
//                 data: (row) => mapCSVData(row ?? []),
//                 fileName: 'historico_ordens_servico.csv'
//               },
//               hiddenDesktop: true
//             }
//           ]}
//             warning={
//               (row: ServiceOrder) => !!row.isActive && <Tooltip
//                 title='Ordem de serviço com Ocorrencia'
//                 placement='top'
//               >
//                 <Image
//                   src='/Warning.svg' 
//                   width={40}
//                   height={40}
//                   alt='warning'
//                 />
//               </Tooltip>
//             }
//             showAllActions
//             columns={[{
//               label: 'Código',
//               key: 'code',
//               rowFormatter: (row) => { 
//                 return (<>
//                   <div
//                   className=" hidden md:flex items-center gap-1 group"
//                   style={{ height: "70px" }}
//                 >
//                   <div
//                     className="w-0 group-hover:!w-12 overflow-hidden transition-all items-center gap-1"
//                     style={
//                       selected.find((v) => v.id === row.id)
//                         ? {
//                             width: "2rem",
//                           }
//                         : {}
//                     }
//                   >
//                     <CheckBox
//                       variant="secondary"
//                       value={!!selected.find((v) => v.id === row.id)}
//                       onChange={() => {
//                         setSelected((prev) => {
//                           if (!!selected.find((v) => v.id === row.id)) {
//                             return prev.filter((v) => v.id !== row.id);
//                           }
//                           return [...prev, row];
//                         });
//                       }}
//                     />
//                   </div>
//                   <div>{row.code}</div>
//                 </div>
//                 <div
//                   className="md:hidden"
//                 >
//                   <div
//                     className='flex items-center gap-3'
//                   >
//                     {
//                       row.id && <Image
//                         className='md:hidden'
//                         src='/Warning.svg'
//                         width={20}
//                         height={20}
//                         alt='warning'
//                       />
//                     }
//                     {row.code}</div>
//                 </div>
//                 </>
//               )
//               },
//               mobileTitle: true
//             },
//             {
//               label:'Procedimento',
//               key: 'description'
//             },
//             {
//               label: 'Data de Solicitação',
//               key: 'requestDate',
//               Formatter: (requestDate) => {
//                 return requestDate && dayjs(requestDate).format('DD/MM/YYYY')
//               }
//             },
//             {
//               label: 'Responsável',
//               key: 'supervisor',
//               Formatter: (supervisor) => {
//                 return supervisor.name
//               }
//             },
//             {
//               label: 'Status',
//               key: 'status',
//               Formatter: (status) => {
//                 return status.description
//               }
//             },
//             {
//               label: 'Data de execução',
//               key: 'executionDate',
//               Formatter: (executionDate) => {
//                 return executionDate && dayjs(executionDate).format('DD/MM/YYYY')
//               }
//             }
//           ]}
//           />
//           {data && data?.length > 0 && <Pagination
//             currentPage={paginatedServiceOrders.currentPage}
//             onChange={(page) => paginatedServiceOrders.setCurrentPage(page)}
//             totalPages={paginatedServiceOrders.totalPage}
//           />}
//         </div>
//       ); 
 
// }
