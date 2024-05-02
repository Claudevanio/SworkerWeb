'use client';
import { set, useForm } from 'react-hook-form';
import { PageTitle } from '../title';
import * as Yup from 'yup';
import { useUser } from '@/hooks/useUser';
import { professionalService, Userservice } from '@/services';
import { useCallback, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { masks, regex } from '@/utils';
import { Form } from '@/components/form';
import { Button, Input } from '@/components/ui';
import { IProfessional } from '@/types';
import { useDialog } from '@/hooks/use-dialog';

export function ProfilePageComponent(){
  const {user,
    updateUser
  } = useUser();

  const schema = Yup.object({ 
    userName: Yup.string().required('Nome de usuário é obrigatório'),
    name: Yup.string().required('Nome é obrigatório'),
    phone: Yup.string().required('Telefone é obrigatório'), 
    password: Yup.lazy((value) => {
      const { newPassword, confirmPassword } = value
      if(newPassword || confirmPassword){
        return Yup.string().required('Senha é obrigatória')
      }
      return Yup.string()
    }),
    newPassword: Yup.string(),
    confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'As senhas devem ser iguais'),
    registerNumber: Yup.string(),
    profile: Yup.string(),
    unity: Yup.string() 
  })

  const [initialValues, setInitialValues] = useState({
    userName: user?.userName,
    name: user?.name,
    phone: '',
  })

  const methods = useForm({
    defaultValues: {
      ...initialValues,
      password: '',
      newPassword: '',
      confirmPassword: ''
    },
    resolver: yupResolver(schema)
  })

  const [professionalData, setProfessionalData] = useState<IProfessional | undefined>()

  const fetchProfessional = useCallback(async () => {
    try {
       const response : any = await professionalService.getProfessionalByIdAsync(user.professionalId)
       setProfessionalData(response)
       const initialValue = ({
         userName: user.email,
         name: user.name,
         phone: response.phone,
         registerNumber: response?.registerNumber ?? '',
         unity: response?.unityProfessionals.length > 0 && response.unityProfessionals[0].companyUnityName,
         profile: (user as any)?.role ?? ''
       })
       setInitialValues(initialValue)
       methods.reset({
         ...initialValue,
         phone: response.phone
       })
    } catch (error) {
       console.log(error)
    }
   }, [user, methods]);

  useEffect(() => {
    fetchProfessional()
  }, [fetchProfessional])


  const hasChanged = (data: any) => {
    return Object.keys(data).some(key => initialValues[key] !== data[key])
  }

  const isFormChanged = methods.formState.isDirty && hasChanged(methods.getValues())

  const {
    openDialog
  } = useDialog()

  const onSubmit = async (data: any) => {
    data.phone = masks.CLEARMasks(data.phone)
    if(data.name !== user.name){
      await Userservice.updateUserName({
        ...user,
        name: data.name
      })
      updateUser({
        ...user,
        name: data.name,
        phone: data.phone
      } as any)
    }
    if(data.phone !== initialValues.phone || data.name !== professionalData.name){
      await professionalService.updateProfessionalAsync(user.companyId, {
        ...professionalData,
        name: data.name,
        phone: data.phone
      })
    }
    if(data.newPassword && data.confirmPassword){
      try{
        await Userservice.updateLoggedUserPassword(
          user.userId,
          {
            userName: user.email,
            password: data.password,
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword
          }
        )
      } catch(e){
        openDialog({
          title: 'Erro ao atualizar senha',
          onConfirm: () => {},
          onConfirmText: 'Ok',
          message: e.message
        })
      }
    }
  }

    return (
      <div
        className='w-full p-4 lg:p-8 pb-12'
      >
        <PageTitle
          title='Meus Dados'
          subtitle='Edite alguns de seus dados cadastrais'
        />
        <div>  
          <Form
            {...methods}
            onSubmit={methods.handleSubmit((data) => {
              onSubmit(data)
            })}
            className='flex flex-col gap-4 md:gap-8 w-full md:pt-10'
          >
            <div
              className='flex flex-col md:flex-row gap-4 md:gap-8  justify-between'
            >
              <Input
                label='Nome'
                name='name'
                required
                error={methods.formState.errors.name}
              />

              <div
                className='w-full flex flex-col md:flex-row gap-4 md:gap-8  justify-between'
              > 
                <Input
                  label='E-mail'
                  name='userName'
                  required
                  disabled
                />
                <Input
                  label='RegisterNumber'
                  name='registerNumber'
                  required
                  disabled
                />
              </div>
            </div>
            <div
              className='flex flex-col md:flex-row gap-4 md:gap-8  justify-between'>
              <Input
                label='Telefone'
                mask={masks.TELEFONEMask}
                name='phone'
                required
                error={methods.formState.errors.phone}
              />

              <Input 
                label='Perfil'
                name='profile'
                required
                disabled
              />

              <Input
                label='Unidade'
                name='unity'
                required
                disabled
              />
            </div>
            <div
              className='flex flex-col md:flex-row gap-4 md:gap-8  justify-between'
            >
              <Input
                label='Senha Atual'
                name='password'
                type='password'
                required
                error={methods.formState.errors.password}
              />
              <Input
                label='Nova Senha'
                name='newPassword'
                type='password'
                required
                error={methods.formState.errors.newPassword}
              />
              <Input
                label='Confirmar Senha'
                name='confirmPassword'
                type='password'
                required
                error={methods.formState.errors.confirmPassword}
              />
            </div>  
            <div
              className='flex justify-end'
            > 
              <Button
                type='submit'
                isLoading={methods.formState.isSubmitting}
                disabled={!isFormChanged} 
                className='w-full md:w-auto'
              >
                Salvar
              </Button>

            </div>
          </Form>
        </div>
      </div>
    )
}
