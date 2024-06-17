'use client';
import { Form } from '@/components/form/Form';
import { Modal } from '@/components/ui/modal';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input } from '@/components';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';

const schema = Yup.object({
  email: Yup.string().email('Email Inválido').required('O e-mail é obrigatório'),
  code: Yup.string(),
  password: Yup.string(),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'As senhas devem ser iguais')
});

type FormFields = Yup.InferType<typeof schema>;

export const ModalEsqueciSenha = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const methods = useForm<FormFields>({
    resolver: yupResolver(schema)
  });

  const [step, setStep] = useState(1);

  useEffect(() => {
    setStep(1);
    methods.reset();
  }, [isOpen]);

  const onSubmit = (data: FormFields) => {
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2) {
      setStep(3);
      return;
    }
    if (step === 3) {
      console.log(data.code);
      if (!data.code || data.code?.length < 4) {
        methods.setError('code', {
          type: 'manual',
          message: 'Código inválido'
        });
        return;
      }
      setStep(4);
      return;
    }

    if (step === 4) {
      if (!data.password || data.password?.length < 6) {
        methods.setError('password', {
          type: 'manual',
          message: 'Senha deve ter no mínimo 6 caracteres'
        });
        return;
      }
      setStep(5);
      return;
    }

    console.log(data);
    onClose();
  };

  return (
    <Modal title="Recuperar senha" isOpen={isOpen} onClose={onClose}>
      <Form onSubmit={data => onSubmit(data as FormFields)} className="flex flex-col gap-6 w-full" {...methods}>
        <p>
          {step === 1 && 'Para recuperar sua senha, digite o e-mail cadastrado.'}
          {step === 2 &&
            'Enviamos um código de recuperação para o seu e-mail cadastrado. Por favor, verifique a sua caixa de entrada e a pasta de spam, se necessário.'}
          {step === 3 && 'Digite abaixo o código enviado para o seu e-mail.'}
          {step === 4 && 'Insira sua nova senha'}
          {step === 5 && 'Senha alterada com sucesso!'}
        </p>
        <div className="flex flex-col gap-8">
          {step === 1 && <Input label="E-mail" placeholder="mail.example@gmail.com" name="email" required error={methods.formState.errors.email} />}
          {step === 3 && <Input label="Código" placeholder="ex: 1a39fk" name="code" required error={methods.formState.errors.code} />}
          {step === 4 && (
            <>
              <Input label="Nova senha" type="password" name="password" required error={methods.formState.errors.password} />
              <Input label="Confirme sua senha" type="password" name="confirmPassword" required error={methods.formState.errors.confirmPassword} />
            </>
          )}
          <Button type="submit">{step === 1 ? 'Enviar' : step === 5 ? 'Fechar' : 'Próximo'}</Button>
        </div>
      </Form>
    </Modal>
  );
};
