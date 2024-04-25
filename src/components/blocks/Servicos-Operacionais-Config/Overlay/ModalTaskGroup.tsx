import { Modal } from '@/components/ui/modal';
import { EtipoPermissao, IPermissions, IRole } from '@/types';
import * as Yup from "yup";
import { Form } from '@/components/form/Form'; 
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '@/components/ui';
import { Dropdown } from '@/components/form';
import React from 'react';
import { useAdministrator } from '@/contexts/AdministrationProvider';
import { masks, regex } from '@/utils';
import { ITaskGroup } from '@/types/models/ServiceOrder/ITaskGroup';
import { useServiceOperations } from '@/contexts/ServiceOperationsConfigProvider';
import dayjs from 'dayjs';

const schema = Yup.object({ 
  name: Yup.string().required('O nome é obrigatório'),
  code: Yup.string().required('O código é obrigatório'),
  version: Yup.string().required('A versão é obrigatória'),
  startDate: Yup.string().required('A data de início é obrigatória').matches(regex.DATE, 'Data inválida'),
  endDate: Yup.string().required('A data de fim é obrigatória').matches(regex.DATE, 'Data inválida'),
});

type FormFields = Yup.InferType<typeof schema>;

export function ModalTaskGroup({
  isOpen,
  onClose,
  current,
  readonly
} : {
  isOpen: boolean;
  onClose: () => void;
  current?: ITaskGroup;
  readonly?: boolean;
}
){
 
  const methods = useForm<FormFields>({
    resolver: yupResolver(schema), 
  });

  const {taskGroups} = useServiceOperations();

  async function onSubmit(data: FormFields){ 

    const newData : ITaskGroup = {
      ...data,
      startDate: dayjs(data.startDate, 'DD/MM/YYYY').toDate().toISOString(),
      endDate: dayjs(data.endDate, 'DD/MM/YYYY').toDate().toISOString(),
    } as any
    if(current){
      await taskGroups.update({
        ...newData,
        id: current.id
      });
      onClose();
      return;
    }

    
    await taskGroups.create(newData);    
    
    onClose(); 
  }

  React.useEffect(() => {
    
    if(!current){
      methods.reset()
      return
    }
    if(current){
      methods.reset({
        ...current, 
        startDate: masks.DATE(current.startDate),
        endDate: masks.DATE(current.endDate),
      });
      return;
    }
  }, [current, isOpen, methods])


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      methods={methods}
      title={
        current ? readonly ? current.name : 'Editar Empresa' : 'Nova Empresa'
      }
      width='830px'
      onSubmit={() => methods.handleSubmit(onSubmit)()}
    > 
       <Form onSubmit={(data) => onSubmit(data as FormFields)}
            className='flex flex-col gap-4 pb-4'
            {...methods}
      > 
        <div
            className='flex gap-4 md:gap-6 flex-col md:flex-row '
        >
          <div
            className='w-full md:w-1/3'
          >
            <Input
              name='code'
              label='Código'
              required
              placeholder='Código'
              error={methods.formState.errors.code}
              disabled={readonly}
            />
          </div>
          <div
            className='w-full md:w-1/2'>
            <Input
              name='version'
              label='Versão'
              required
              placeholder='Versão'
              error={methods.formState.errors.version}
              disabled={readonly}
            />
          </div>
        </div>
        <div
            className='flex gap-4 md:grid md:grid-cols-2 flex-col md:flex-row justify-between'>
              <Input
                name='name'
                label='Nome'
                required
                placeholder='Nome'
                error={methods.formState.errors.name}
                disabled={readonly}
              />
              <Input
                name='startDate'
                label='Data de Início'
                required
                placeholder='Data de Início'
                error={methods.formState.errors.startDate}
                mask={masks.DATE}
                disabled={readonly}
              />
              <Input
                name='endDate'
                label='Data de Fim'
                required
                placeholder='Data de Fim'
                error={methods.formState.errors.endDate}
                mask={masks.DATE}
                disabled={readonly}
              />
        </div>

      </Form>



    </Modal>
  )
}