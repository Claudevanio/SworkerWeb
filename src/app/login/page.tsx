'use client'
import { Button, Input } from '@/components/'; 
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import { Form } from '@/components/form/Form';
import { IconButton, MenuItem, Select } from '@mui/material';
import { Field } from '@/components/form/Fields';
import Image from 'next/image';
import Link from 'next/link';
import { Modal } from '@/components/ui/modal';
import { ModalContaBloqueada } from './components/modal-conta-bloqueada';
import { useState } from 'react'; 
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Person } from '@mui/icons-material';
import { Authservice } from '@/services';
import { useModal } from '@/hooks';
import { useDialog } from '@/hooks/use-dialog';

const schema = Yup.object({ 
    userName: Yup.string().required('Email é obrigatório').email('O e-mail deve ser válido'),
    password: Yup.string().required('A senha é obrigatória').min(6, 'A senha deve ter no mínimo 6 caracteres').matches(
      /^(?=.*[A-Za-z#@$!])(?=.*\d)[A-Za-z\d#@$!]{8,}$/,
      'A senha deve corresponder ao padrão especificado'
    )
});

type FormFields = Yup.InferType<typeof schema>;

interface LoginDataResponse {
  success: boolean;
  message: string;
  data: string | {
    userId: string;
    code: string;
    redirectUrl: string;
  }

}
 
export default function Login(){ 
  const methods = useForm<FormFields>({
    resolver: yupResolver(schema), 
  });
 

  const [isModalOpen, openModal, closeModal] = useModal();
 
  const router = useRouter();

  const {
    confirmDialog
  } = useDialog()

  const onSubmit = async (data: FormFields) => { 
    try{
      const response = await Authservice.login({
        userName: data.userName,
        password: data.password,
      }) as LoginDataResponse;
      if(typeof response.data === 'string'){  
        Cookies.set('token', response.data);
        router.push('/');
        return;
      }
      if(response.success){
        const { userId, code } = response.data;
        confirmDialog({
          title: response.message,
          message: 'Clique em "ok" para ser redirecionado',
          variant: 'success',
          onConfirmText: 'Ok',
          onConfirm: () => {
            router.push(`/esqueci-senha?userId=${userId}&code=${code}`);
          },
      } as any)
    }
  }
    catch(e){ 
      confirmDialog({
        title: 'Não foi possível entrar',
        message: e.message,
      })
    }

  }

  return (
      <div className="w-full flex flex-col h-full items-center justify-center bg-primary-50 gap-12 md:gap-20 min-h-[560px]"> 
        <h1 className='text-[2rem] text-primary-700 font-bold w-3/4 text-center'>Sworker</h1> 
      <div 
        className='w-3/4 h-fit justify-center md:pt-0 md:w-[33.25rem]  flex flex-col md:justify-center gap-1 items-center p-4 bg-white rounded-xl'
      >  
      <h1
        className='text-[18px] text-[#020617] font-bold w-full pt-4'
      >
        Login
      </h1>
          <Form onSubmit={(data) => onSubmit(data as FormFields)}
            className='flex flex-col gap-8 w-full mt-8'
            {...methods}
          >
            <div
                className='flex flex-col gap-4'
            >
                <Input
                    label="E-mail" 
                    placeholder="jhonasrodrigues"
                    name='userName'
                    required 
                    error={methods.formState.errors.userName}
                    /> 

                <Input
                    label='Senha'
                    type='password'
                    name='password' 
                    placeholder='senhadeacesso'
                    required
                    error={methods.formState.errors.password}
                    />
                <p>
                    <Link href='/esqueci-senha'
                    className='text-primary-500 hover:underline font-semibold cursor-pointer'
                    >Esqueci minha senha</Link>  
                </p>
            </div>

                <Button 
                  isLoading={methods.formState.isSubmitting}
                  type='submit'
                  className=''
                >
                  Entrar
                </Button>
          </Form>  
        </div> 
        <ModalContaBloqueada
            isOpen={isModalOpen}
            onClose={closeModal}
        />
      </div>
  );
}