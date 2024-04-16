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
import { masks } from '@/utils';

const schema = Yup.object({ 
  name: Yup.string().required('O nome é obrigatório'),
  permissions: Yup.array().of(
    Yup.object().shape({
      type: Yup.string(),
      value: Yup.number().required('O valor é obrigatório')
    })
  )
});

type FormFields = Yup.InferType<typeof schema>;

export function ModalPermissions({
  isOpen,
  onClose,
  current
} : {
  isOpen: boolean;
  onClose: () => void;
  current?: IRole;
}
){

  const permissionsTypes = [{
    label: 'Nada',
    value: EtipoPermissao.Nada
  },
  {
    label: 'Visualização',
    value: EtipoPermissao.Visualizacao
  },
  {
    label: 'Operação',
    value: EtipoPermissao.Operacao,
  },
  {
    label: 'Supervisão',
    value: EtipoPermissao.Supervisao,
  },
  {
    label: 'Administração',
    value: EtipoPermissao.Administracao,
  }
];


  const fields = [
    {
      label: 'Administração',
      name: 'permissions[0].value',
      options: permissionsTypes
    },
    {
      label: 'Serviços Operacionais',
      name: 'permissions[1].value',
      options: permissionsTypes
    },
    {
      label: 'Ocorrências',
      name: 'permissions[2].value',
      options: permissionsTypes
    } 
  ]

  const methods = useForm<FormFields>({
    resolver: yupResolver(schema)
  });

  const {permissions} = useAdministrator();

  function onSubmit(data: FormFields){ 

    const permissionsToApi = [{
      type: 'Administração',
      value: data.permissions[0].value,
      name: EtipoPermissao[data.permissions[0].value]
    },
    {
      type: 'Serviços Operacionais',
      value: data.permissions[1].value,
      name: EtipoPermissao[data.permissions[1].value]
    },
    {
      type: 'Ocorrências',
      value: data.permissions[2].value,
      name: EtipoPermissao[data.permissions[2].value]
    }]
    const newData : IRole = {
      id: current?.roleId,
      name: data.name,
      roleId: data.name,
      permissions: permissionsToApi
    }
    if(current){
      permissions.update(newData)
      return onClose();
    }
    
    permissions.create(newData)

    onClose();


     
  }

  React.useEffect(() => {
    if(current){
      methods.reset({
        name: current.name,
        permissions: [{
          type: 'administration',
          value: current.permissions[0].value
        },
        {
          type: 'services',
          value: current.permissions[1].value
        },
        {
          type: 'monitoring',
          value: current.permissions[2].value
        }
      ]
      })
      return
    }
    methods.reset();
  }, [current, isOpen, methods])


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      methods={methods}
      title={
        !current ? 'Novo papel/permissão' : 'Editar papel/permissão'
      }
      onSubmit={() => methods.handleSubmit(onSubmit)()}
    > 
       <Form onSubmit={(data) => onSubmit(data as FormFields)}
            className='flex flex-col gap-6'
            {...methods}
      >
        <Input
          name='name'
          label='Nome'
          required
          placeholder='Nome'
        /> 

        <div
            className='flex gap-4 flex-col'>
          <h1
            className='text-base-8 text-base font-semibold'
          >
            Permissões<span
              className='text-erro-3'
            >*</span>
          </h1>
          <div
            className='flex gap-2 flex-col'>
            {fields.map((field) => (
              <Dropdown
                key={field.name}
                name={field.name}
                label={field.label}
                options={field.options}
                required
              />
            ))}

          </div>
        </div>

      </Form>



    </Modal>
  )
}