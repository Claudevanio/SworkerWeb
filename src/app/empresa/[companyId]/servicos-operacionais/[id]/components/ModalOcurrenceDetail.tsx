import { Modal } from '@/components/ui/modal';
import { ISector } from '@/types';
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
import { IOcurrence } from '@/types/models/Ocurrences/IOcurrence';
import dayjs from 'dayjs';
 
 

export function ModalOcurrenceDetail({
  isOpen,
  onClose,
  current,
  readonly
} : {
  isOpen: boolean;
  onClose: () => void;
  current?: IOcurrence;
  readonly?: boolean;
}
){
 
  const methods = useForm<IOcurrence>();
  
  React.useEffect(() => {
    if(!isOpen)
      return;
    if(current){
      methods.reset({
        ...current,
        registerDate: dayjs(current.registerDate).format('DD/MM/YYYY : HH:mm'),
        observation: (!current.observation || current?.observation === '') ? 'Sem observação' : current.observation, 
      });
      return;
    }
    methods.reset();
  }, [current, isOpen, methods])


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        current?.description ?? 'Ocorrência'
      }
      width='1000px' 
    >
       <Form onSubmit={(data) => console.log(data)}
            className='flex flex-col gap-4 pb-4'
            {...methods}
      >
        <div
          className='flex flex-col md:flex-row gap-4 w-full md:justify-between'
        > 
            <Input
              label='Número'
              name='number'
              disabled={readonly}
            /> 
            
            <Input
              label='Data'
              name='registerDate'
              disabled={readonly}
            />
    
            <Input
              label='Local'
              name='local'
              disabled={readonly}
            />
    
            <Input
              label='Tipo'
              name='occurrenceType.typeName'
              disabled={readonly}
            />
          </div>
          <Input
            label='Descrição'
            name='description'
            disabled={readonly}
            minRows={4}
            multiline
          />

          <Input
            label='Observação'
            name='observation'
            disabled={readonly}
            minRows={4}
            multiline
          />


      </Form>



    </Modal>
  )
}