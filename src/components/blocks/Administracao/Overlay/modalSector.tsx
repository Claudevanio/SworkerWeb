import { Modal } from '@/components/ui/modal';
import { EtipoPermissao, ICompany, ICompanyUnity, IPermissions, IRole, ISector } from '@/types';
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

const schema = Yup.object({ 
  name: Yup.string().required('O nome é obrigatório'),
  unityId: Yup.string().required('A unidade é obrigatória'),
});

type FormFields = Yup.InferType<typeof schema>;

export function ModalSector({
  isOpen,
  onClose,
  current,
  readonly
} : {
  isOpen: boolean;
  onClose: () => void;
  current?: ISector;
  readonly?: boolean;
}
){
 
  const methods = useForm<FormFields>({
    resolver: yupResolver(schema)
  });

  const {sectors, companyUnities} = useAdministrator();

  async function onSubmit(data: FormFields){ 
    console.log(data)
    
    const newData : ISector = {
      ...data,
    } as any
    await sectors.create(newData);    
    
    onClose(); 
  }

  React.useEffect(() => {
    if(!isOpen)
      return;
    if(current){
      methods.reset({
        name: current.name,
        unityId: current.unityId,
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
        current ? readonly ? current.name : 'Editar Unidade' : 'Nova Unidade'
      }
      width='550px'
      onSubmit={readonly ? undefined : () => methods.handleSubmit(onSubmit)()}
    >
       <Form onSubmit={(data) => onSubmit(data as FormFields)}
            className='flex flex-col gap-4 pb-4'
            {...methods}
      >
        <Input
          name='name'
          label='Nome do setor'
          required
          placeholder='Nome'
          error={methods.formState.errors.name}
          disabled={readonly}
        /> 
        
        <Dropdown
          name='unityId'
          label='Unidade'
          required 
          options={companyUnities.data.items.map(unit => ({label: unit.name, value: unit.id}))}
          error={methods.formState.errors.unityId}
          disabled={readonly}
        /> 

      </Form>



    </Modal>
  )
}