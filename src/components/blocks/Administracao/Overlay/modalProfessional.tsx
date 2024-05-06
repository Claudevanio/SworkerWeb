import { Modal } from '@/components/ui/modal';
import { EtipoPermissao, ICompany, IProfessional, IPermissions, IRole, IUser } from '@/types';
import * as Yup from "yup";
import { Form } from '@/components/form/Form'; 
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CheckBox, Input } from '@/components/ui';
import { Dropdown } from '@/components/form';
import React, { useEffect } from 'react';
import { useAdministrator } from '@/contexts/AdministrationProvider';
import { masks, regex } from '@/utils';
import { CustomSwitch } from '@/components/ui/switch'; 
import { RoleService, Userservice } from '@/services';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import CustomizedAccordions from '../components/customizedAccordion';
import { useQuery } from '@tanstack/react-query';
import { SectorService } from '@/services/Administrator/sectorService';

const schema = Yup.object({ 
  name: Yup.string().required('O nome é obrigatório'),
  registerNumber: Yup.string().required('O registro é obrigatório'),
  email: Yup.string().required('O e-mail é obrigatório').email('E-mail inválido'),
  cpf: Yup.string().required('O CPF é obrigatório').matches(regex.CPF, 'CPF inválido'),
  phone: Yup.string().required('O telefone é obrigatório').matches(regex.TELEFONE, 'Telefone inválido'),
  roleId: Yup.string().required('O cargo é obrigatório'),
  active: Yup.boolean(),
  standardSupervisor: Yup.boolean(),
  sectorsIds: Yup.array().of(Yup.string()) 
});

type FormFields = Yup.InferType<typeof schema>;

export function ModalProfessional({
  isOpen,
  onClose,
  current,
  readonly
} : {
  isOpen: boolean;
  onClose: () => void;
  current?: IProfessional;
  readonly?: boolean;
}
){
 
  const methods = useForm<FormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      sectorsIds: []
    }
  });

  const {
    data: sectorsList
  } = useQuery<any>({
    queryKey: ['sectors'],
    queryFn: () => SectorService.getAll(),
    refetchOnWindowFocus: false,
  })

  const {
    data: userInfo
  } = useQuery<Array<{
    roleId: string,
  }>>({
    queryKey: ['userInfo', current?.userId],
    queryFn: () => RoleService.getRolesByUserIdAsync(current?.userId ?? ''),
    refetchOnWindowFocus: false,
    enabled: !!current?.userId
  })
  const {sectors, professionals, companyUnities, permissions} = useAdministrator();

  async function onSubmit(data: FormFields){ 
    const userData : IUser = {
      email: data.email,
      password: '123456',
      roleId: data.roleId, 
      name: data.name, 
      userName: data.email,
      userId: '1',  
    }
    
    const newUser = Userservice.createUser(userData)


    // const professionalData : IProfessional = {
    //   active: data.active,
    //   id: professionals.current?.id ?? '',
    //   name: data.name,
    //   cpf: data.cpf,
    //   companyUnityId: '1',
    //   email: data.email,
    // }
    
    const newData : IProfessional = {
      ...data,
    } as any
    await professionals.create(newData);    
    
    onClose(); 
  }

  React.useEffect(() => {
    if(!isOpen)
      return;
    if(current){
      methods.reset(current);
      return;
    }
    methods.reset();
    permissions.setFilter(
      prev => ({
      ...prev,
      pageSize: 100,
    }))
    sectors.setFilter(
      prev => ({
        ...prev,
        pageSize: 100,
      })
    )

  }, [isOpen])
  

  useEffect(() => {
    if(!userInfo)
      return; 
    if(!userInfo[0])
      return;
    debugger
    methods.setValue('roleId', userInfo[0].roleId)
  }, [methods, userInfo])


  const sectorsIds = methods.watch('sectorsIds');

  const options = permissions.data?.items?.map((role: IRole) => ({label: role.name, value: role.roleId})) ?? []
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      methods={methods}
      title={
        current ? readonly ? current.name : 'Editar Profissional' : 'Novo Profissional'
      }
      width='840px'
      onSubmit={readonly ? undefined : () => methods.handleSubmit(onSubmit)()}
    >
       <Form onSubmit={(data) => onSubmit(data as FormFields)}
            className='flex flex-col gap-4 pb-4'
            {...methods}
      > 
        <div
          className='w-full flex justify-between gap-4 md:gap-6 flex-col md:flex-row items-start'
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
            className='w-full md:w-3/5'
          >
            <Input
              name='cpf'
              label='CPF'
              required
              placeholder='CPF'
              mask={masks.CPFMask}
              error={methods.formState.errors.cpf}
              disabled={readonly}
            />
          </div> 
        </div>
        <div
          className='w-full flex justify-between gap-4 md:gap-6 flex-col md:flex-row items-start'
        >
          <Input
            name='email'
            label='E-mail'
            required
            placeholder='E-mail'
            error={methods.formState.errors.email}
            disabled={readonly}
          /> 
          <Input
            name='phone'
            label='Telefone'
            required
            placeholder='Telefone'
            mask={masks.TELEFONEMask}
            error={methods.formState.errors.phone}
            disabled={readonly}
          />
          <Input
            name='registerNumber'
            label='Registro'
            required
            placeholder='Registro'
            error={methods.formState.errors.registerNumber}
            disabled={readonly}
          />
        </div>
        <div
            className='flex gap-4 md:gap-6 flex-col md:flex-row items-start md:items-end w-full'>
          <div
              className='w-full md:w-1/3'
          > 
             
            <Dropdown
              name='roleId'
              label='Cargo'
              required 
              options={
                options.map(option => ({
                  label: option.label,
                  value: option.value
                }))
              } 
              disabled={readonly}
            />
          </div>
          <div
            className='flex gap-4 md:gap-6  md:flex-row items-start justify-between md:justify-start md:items-end md: w-full'
          >
          <CustomSwitch
            name='active'
            label='Ativo' 
            disabled={readonly}
          />
          <CustomSwitch 
            name='standardSupervisor'
            label='Supervisor Padrão'
            disabled={readonly}
          />

          </div>
        </div> 

        <div
              style={{ 
              }}>
              {
                companyUnities.data?.items.map((unity, index, array) => (
                  <CustomizedAccordions
                    key={index}
                    special={
                      index === 0 ? 'first' : index === array.length - 1 ? 'last' : undefined
                    }
                    summary={unity.name}
                  >
                    <div
                      className='flex flex-col gap-0 w-full'
                    >
                      {
                        !sectorsList ? (
                          <div
                            className='flex justify-between items-center gap-4 border-base-2 md:border-primary-300 border-x-2 py-2 border-y-[.5px] w-full pl-10 pr-4'
                          >
                            Carregando...
                          </div>
                        ) : sectorsList?.filter(sector => sector.companyUnityId === unity.id).length === 0 ? (
                          <div
                          className='flex justify-between items-center gap-4 border-base-2 md:border-primary-300 border-x-2 py-2 border-y-[.5px] w-full pl-10 pr-4'
                        >
                            Nenhum setor encontrado
                          </div>
                        ) :  sectorsList?.filter(sector => sector.companyUnityId === unity.id).map((sector, index, array) => (
                          <div
                            key={index}
                            className='flex justify-between items-center gap-4 border-base-2 md:border-primary-300 border-2 border-y-[.5px] w-full pl-10 pr-4'
                          >
                            {sector.description}
                            <CheckBox
                              label=''
                              value={
                                sectorsIds && sectorsIds.includes(sector.id)
                              }
                              onChange={
                                () => {
                                  if(!sectorsIds)
                                    return;
                                  if(sectorsIds?.includes(sector.id)){
                                    methods.setValue('sectorsIds', sectorsIds.filter(id => id !== sector.id))
                                  } else {
                                    methods.setValue('sectorsIds', [...sectorsIds, sector.id])
                                  }
                                }
                              }
                            />
                          </div>
                        ))
                      }
                    </div>

                  </CustomizedAccordions>
                ))
              } 
        </div>


      </Form>



    </Modal>
  )
}