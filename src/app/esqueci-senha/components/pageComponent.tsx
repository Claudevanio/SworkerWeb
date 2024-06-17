'use client';
import { Button, Input } from '@/components/';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Form } from '@/components/form/Form';
import { IconButton, MenuItem, Select, useMediaQuery } from '@mui/material';
import { Field } from '@/components/form/Fields';
import Image from 'next/image';
import Link from 'next/link';
import { Modal } from '@/components/ui/modal';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { Person } from '@mui/icons-material';
import { Authservice } from '@/services';
import { useDialog } from '@/hooks/use-dialog';
import { Logo } from '@/components/Logo';
import { inputLogoLoginFieldsOverlay, LoginBgLogoPath } from '@/utils';

const schema = Yup.object({
  userName: Yup.string().required('Email é obrigatório').email('O e-mail deve ser válido')
});

const schemaRecuperarSenha = Yup.object({
  password: Yup.string().required('Senha é obrigatória').min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'As senhas devem ser iguais')
});

type FormFields = Yup.InferType<typeof schema>;

type FormFieldsRecuperarSenha = Yup.InferType<typeof schemaRecuperarSenha>;

export function EsqueciSenhaPageComponent() {
  const methods = useForm<FormFields>({
    resolver: yupResolver(schema)
  });

  const methodsRecuperarSenha = useForm<FormFieldsRecuperarSenha>({
    resolver: yupResolver(schemaRecuperarSenha)
  });

  const router = useRouter();

  const [isOkRequest, setIsOkRequest] = useState(false);

  const onSubmit = async (data: FormFields) => {
    const response = await Authservice.forgotPassword(data.userName);
    console.log(response);
    setIsOkRequest(true);
    // setTimeout(() => {
    //   router.push('/esqueci-senha?token=123')
    // }, 2000)
  };
  const queryParams = useSearchParams();

  const token = queryParams.get('code');

  const userId = queryParams.get('userId');

  const { confirmDialog } = useDialog();

  const onResetPassword = async (data: FormFieldsRecuperarSenha) => {
    const response = await Authservice.resetPassword({
      password: data.password,
      code: token,
      confirmPassword: data.confirmPassword,
      id: userId
    });
    console.log(response);
    confirmDialog({
      title: 'Senha alterada com sucesso',
      message: 'Clique em "ok" para ser redirecionado',
      onConfirm: () => router.push('/login'),
      onConfirmText: 'Ok',
      variant: 'success'
    });
    router.push('/login');
    // console.log(response)
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
          <h1 className="text-[18px] text-[#020617] font-bold w-full pt-4">{token ? 'Definir nova senha' : 'Esqueci minha senha'}</h1>
          {token ? (
            <Form
              onSubmit={data => onResetPassword(data as FormFieldsRecuperarSenha)}
              className="flex flex-col gap-8 w-full mt-8"
              {...methodsRecuperarSenha}
            >
              <div className="flex flex-col gap-4">
                <Input
                  label="Nova Senha"
                  placeholder="senha"
                  name="password"
                  required
                  type="password"
                  error={methodsRecuperarSenha.formState.errors.password}
                />
                <Input
                  label="Confirmar senha"
                  placeholder="senha"
                  name="confirmPassword"
                  required
                  type="password"
                  error={methodsRecuperarSenha.formState.errors.confirmPassword}
                />
              </div>
              <div className="w-full flex gap-2 flex-col">
                <Button type="submit" className="">
                  Enviar
                </Button>
                <Link href="/login" className="text-[#FF6C6C] cursor-pointer text-center">
                  Cancelar
                </Link>
              </div>
            </Form>
          ) : (
            <Form onSubmit={data => onSubmit(data as FormFields)} className="flex flex-col gap-8 w-full mt-8" {...methods}>
              <div className="flex flex-col gap-4">
                <Input label="E-mail" placeholder="jhonasrodrigues" name="userName" required error={methods.formState.errors.userName} />
                {isOkRequest && <p className="text-primary-500 ">Foi enviado para seu e-mail o link para geração de uma nova senha de acesso.</p>}
              </div>
              <div className="w-full flex gap-2 flex-col">
                <Button type="submit" className="">
                  Enviar
                </Button>
                <Link href="/login" className="text-[#FF6C6C] relative z-[1] cursor-pointer text-center">
                  Cancelar
                </Link>
              </div>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}
