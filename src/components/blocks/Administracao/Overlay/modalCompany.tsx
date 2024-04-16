import { Modal } from '@/components/ui/modal';
import { EtipoPermissao, ICompany, IPermissions, IRole } from '@/types';
import * as Yup from "yup";
import { Form } from '@/components/form/Form'; 
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '@/components/ui';
import { Dropdown } from '@/components/form';
import React from 'react';
import { useAdministrator } from '@/contexts/AdministrationProvider';
import { masks, regex } from '@/utils';

const schema = Yup.object({ 
  name: Yup.string().required('O nome é obrigatório'),
  cnpj: Yup.string().required('O CNPJ é obrigatório').matches(regex.CNPJ, 'CNPJ inválido'),
  responsible: Yup.string().required('O responsável é obrigatório'),
  phone: Yup.string().required('O telefone é obrigatório').matches(regex.TELEFONE, 'Telefone inválido'),
  email: Yup.string().required('O email é obrigatório').email('Email inválido'),
  active: Yup.boolean().required('O status é obrigatório'),
});

type FormFields = Yup.InferType<typeof schema>;

export function ModalCompany({
  isOpen,
  onClose,
  current,
  readonly
} : {
  isOpen: boolean;
  onClose: () => void;
  current?: ICompany;
  readonly?: boolean;
}
){
 
  const methods = useForm<FormFields>({
    resolver: yupResolver(schema), 
    defaultValues: {
      active: true
    }
  });

  const {companies} = useAdministrator();

  async function onSubmit(data: FormFields){ 

    const newData : ICompany = {
      ...data,
      cnpj: masks.CLEARMasks(data.cnpj),
      phone: masks.CLEARMasks(data.phone),
      logoPath: '',
    } as any
    if(current){
      await companies.update({
        ...newData,
        id: current.id
      });
      onClose();
      return;
    }

    
    await companies.create(newData);    
    
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
        cnpj: masks.CNPJMask(current.cnpj),
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
      width='550px'
      onSubmit={() => methods.handleSubmit(onSubmit)()}
    >
      {
        JSON.stringify(methods.formState.errors)
      }
       <Form onSubmit={(data) => onSubmit(data as FormFields)}
            className='flex flex-col gap-4 pb-4'
            {...methods}
      >
        <Input
          name='name'
          label='Nome'
          required
          placeholder='Nome'
          error={methods.formState.errors.name}
          disabled={readonly}
        />
        <div
            className='flex gap-4 md:gap-6 flex-col md:flex-row justify-between'
        >
        <Input
          name='responsible'
          label='Responsável'
          required
          placeholder='Responsável'
          error={methods.formState.errors.responsible}
          disabled={readonly}
        />
        <Input
          name='cnpj'
          label='CNPJ'
          required
          placeholder='CNPJ'
          mask={masks.CNPJMask}
          error={methods.formState.errors.cnpj}
          disabled={readonly}
        />
        </div>
        <div
            className='flex gap-4 md:gap-6 flex-col md:flex-row justify-between'>
          <div
              className='md:w-1/2'
          >
            <Input
              name='phone'
              label='Telefone'
              required
              placeholder='Telefone'
              mask={masks.TELEFONEMask}
              error={methods.formState.errors.phone}
              disabled={readonly}
            />
            
          </div>
        <Input
          name='email'
          label='E-mail'
          required
          placeholder='Email'
          error={methods.formState.errors.email}
          disabled={readonly}
        />
        </div>


      </Form>



    </Modal>
  )
}