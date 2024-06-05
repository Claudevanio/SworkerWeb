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

//   // const paginatedProfessionals  = usePagination(professionals.data ?? [], 5);

//   const [selectedGroup, setSelectedGroup] = useState<IProfessional | null>(null); 
 
//   const {
//     data,
//     isLoading
//   } = useQuery({
//     queryKey: ['AgrupamentoValues', selectedGroup?.id],
//     queryFn: () => serviceOrderService.listDay(),
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

//   // useEffect(() => {
//   //   if (data) {
//   //     setFilteredData(filterServiceOrders(data, serviceOrders.filter));
//   //   }
//   // }, [data, filterServiceOrders, serviceOrders.filter]);
  
//   // const paginatedServiceOrders = usePagination(filteredData ?? [], 3);



//       return (
//         <div>
//           {
//             JSON.stringify(data)
//           }
//         </div>
//       ); 
 
// }
