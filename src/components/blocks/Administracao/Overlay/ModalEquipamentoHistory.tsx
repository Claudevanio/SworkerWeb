import { Modal } from '@/components/ui/modal';
import { EtipoPermissao, ICompany, ICompanyUnity, IEquipment, IEquipmentType, IPermissions, IRole } from '@/types';
import * as Yup from "yup";
import { Form } from '@/components/form/Form'; 
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '@/components/ui';
import { Dropdown } from '@/components/form';
import React from 'react';
import { useAdministrator } from '@/contexts/AdministrationProvider';
import { masks, regex } from '@/utils';
import { CustomSwitch } from '@/components/ui/switch';
import { Stepper } from '@/components/ui/stepper';
import { useQuery } from '@tanstack/react-query';
import { equipmentClassificationService, equipmentService, equipmentTypeService } from '@/services/Administrator/equipmentService';
import { Add } from '@mui/icons-material';
import { BaseTable } from '@/components/table/BaseTable';
import dayjs from 'dayjs';


export function ModalEquipmentsHistory({
  isOpen,
  onClose, 
} : {
  isOpen: boolean;
  onClose: () => void; 
}
){
  const {equipments} = useAdministrator();
 
 

  const { isLoading: isLoadingAssignments, data: assignmentsData,
   } = useQuery<any[] | undefined>({
    queryKey: ['equipmentsAssignments', equipments?.current?.uid],
    queryFn: () => equipmentService.getAssignmentsAsync(equipments?.current?.uid) as any,
    refetchOnWindowFocus: false,
  });

  const { isLoading: isLoadingInspections, data: inspectionsData,
   } = useQuery<any[] | undefined>({
    queryKey: ['equipmentsInspections', equipments?.current?.uid],
    queryFn: () => equipmentService.getEquipmentInspectionAsync(equipments?.current?.uid) as any,
    refetchOnWindowFocus: false,
  });
 
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose} 
      title={
        'Histórico'
      }
      width='800px'  
    >  
    <div
      className='flex flex-col pt-4'
    > 
      <h1
          className='text-[1.25rem] font-medium text-base-7' 
      >Histórico de atribuições</h1>
        <BaseTable
          columns={[{
            key:'professionalName',
            label: 'Nome',
          },
          {
            key: 'assignmentdate',
            label: 'Data de Atribuição',
            Formatter: (value) => dayjs(value).format('DD/MM/YYYY')
          },
          {
            key: 'returndate',
            label: 'Data de liberação',
            Formatter: (value) => dayjs(value).format('DD/MM/YYYY')
          },]}
          rows={assignmentsData ?? []}
          isLoading={isLoadingAssignments}
        />
    </div>
    <div
      className='flex flex-col pt-4'
    >
      <h1
          className='text-[1.25rem] font-medium text-base-7' 
      >Histórico de inspeções</h1>
        <BaseTable
          columns={[  
            {
              key: 'inspectionDate',
              label: 'Data de inspeção',
              Formatter: (value) => dayjs(value).format('DD/MM/YYYY')
            },
            {
              key: 'assignmentdate',
              label: 'Data de Atribuição',
              Formatter: (value) => dayjs(value).format('DD/MM/YYYY')
            }, 
            {
              key: 'responsibleName',
              label: 'Responsável',
            }, 
          ]}
          rows={inspectionsData ?? []}
          isLoading={isLoadingInspections}
        />
    </div>
    </Modal>
  )
}