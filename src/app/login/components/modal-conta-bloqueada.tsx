'use client';
import { Form } from '@/components/form/Form';
import { Modal } from '@/components/ui/modal';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input } from '@/components';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export const ModalContaBloqueada = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} fullMobile>
      <div className="flex flex-col gap-6 items-center justify-center md:justify-start h-3/4 md:h-fit w-full">
        <Image alt="Conta Bloqueada" src="/blocked-account.png" width={200} height={160} />
        <h1 className="text-base font-medium  px-8 text-[#FF6C6C]">
          Conta Bloqueada por:
          <span className="text-[#020617]">Lorem ipsum dolor sit amet consectetur adipisicing elit.</span>
        </h1>
      </div>
      <Button variant="primary" className="w-full mt-8" onClick={onClose}>
        Ok
      </Button>
    </Modal>
  );
};
