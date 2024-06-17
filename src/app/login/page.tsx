'use client';
import { Button, Input } from '@/components/';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Form } from '@/components/form/Form';
import { CircularProgress, IconButton, MenuItem, Select, useMediaQuery } from '@mui/material';
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
import { Logo } from '@/components/Logo';
import { inputLogoLoginFieldsOverlay, LoginBgLogoPath, logoPath } from '@/utils';

const schema = Yup.object({
  userName: Yup.string().required('Email é obrigatório').email('O e-mail deve ser válido'),
  password: Yup.string()
    .required('A senha é obrigatória')
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .matches(/^(?=.*[A-Za-z#@$!])(?=.*\d)[A-Za-z\d#@$!]{8,}$/, 'A senha deve corresponder ao padrão especificado')
});

type FormFields = Yup.InferType<typeof schema>;

interface LoginDataResponse {
  success: boolean;
  message: string;
  data:
    | string
    | {
        userId: string;
        code: string;
        redirectUrl: string;
      };
}

export default function Login() {
  const methods = useForm<FormFields>({
    resolver: yupResolver(schema)
  });

  const [isModalOpen, openModal, closeModal] = useModal();

  const router = useRouter();

  const { confirmDialog } = useDialog();

  const onSubmit = async (data: FormFields) => {
    try {
      const response = (await Authservice.login({
        userName: data.userName,
        password: data.password
      })) as LoginDataResponse;
      if (typeof response.data === 'string') {
        Cookies.set('token', response.data);
        router.push('/');
        return;
      }
      if (response.success) {
        const { userId, code } = response.data;
        confirmDialog({
          title: response.message,
          message: 'Clique em "ok" para ser redirecionado',
          variant: 'success',
          onConfirmText: 'Ok',
          onConfirm: () => {
            router.push(`/esqueci-senha?userId=${userId}&code=${code}`);
          }
        } as any);
      }
    } catch (e) {
      confirmDialog({
        title: 'Não foi possível entrar',
        message: e.message
      });
    }
  };

  const isMobile = useMediaQuery('(max-width:768px)');

  return (
    <div className="w-full h-full relative bg-primary-50">
      {LoginBgLogoPath && LoginBgLogoPath !== '' && (
        <div
          style={{
            backgroundImage: `url(${LoginBgLogoPath})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '100%',
            height: '100%',
            position: 'absolute',
            zIndex: 0
          }}
        />
      )}
      <div className="w-full flex flex-col h-full items-center py-10 pb-24 md:p-0 md:justify-center gap-12 md:gap-20 min-h-[560px] relative">
        <Logo width={isMobile ? '50%' : '300px'} height={isMobile ? 'unset' : '184px'} className="relative z-[1]" />
        {/* <h1 className='text-[2rem] text-primary-700 font-bold w-3/4 text-center'>Sworker</h1>  */}
        <div className="w-3/4 h-fit justify-center md:pt-0 md:w-[33.25rem]  flex flex-col md:justify-center gap-1 items-center p-4 bg-white rounded-xl my-4 relative">
          {inputLogoLoginFieldsOverlay && inputLogoLoginFieldsOverlay !== '' && (
            <div
              style={{
                backgroundImage: `url(${inputLogoLoginFieldsOverlay})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundBlendMode: 'luminosity',
                width: isMobile ? '85%' : '100%',
                height: isMobile ? '90%' : '100%',
                opacity: 0.1,
                position: 'absolute'
              }}
            />
          )}
          <h1 className="text-[18px] text-[#020617] font-bold w-full pt-4">Login</h1>
          <Form onSubmit={data => onSubmit(data as FormFields)} className="flex flex-col gap-8 w-full mt-8" {...methods}>
            <div className="flex flex-col gap-4">
              <Input label="E-mail" placeholder="jhonasrodrigues" name="userName" required error={methods.formState.errors.userName} />

              <Input label="Senha" type="password" name="password" placeholder="senhadeacesso" required error={methods.formState.errors.password} />
              <p>
                <Link href="/esqueci-senha" className="text-primary-500 hover:underline font-semibold cursor-pointer relative z-[1]">
                  Esqueci minha senha
                </Link>
              </p>
            </div>

            <Button isLoading={methods.formState.isSubmitting} type="submit" className="">
              Entrar
            </Button>
          </Form>
        </div>
        {methods.formState.isSubmitting && (
          <div className="fixed top-0 left-0 w-full h-full bg-primary-50 bg-opacity-50 flex items-center justify-center z-[1000]">
            <CircularProgress size={50} color="primary" />
          </div>
        )}
        {isModalOpen && (
          <>
            <ModalContaBloqueada isOpen={isModalOpen} onClose={closeModal} />
          </>
        )}
      </div>
    </div>
  );
}
