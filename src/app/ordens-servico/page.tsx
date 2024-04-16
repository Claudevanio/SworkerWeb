'use client';
import { PageTitle } from '@/components';

export default function OrdensServicoPage(){
  return (
    <div>
      <PageTitle
        title='Ordens de Serviço'
        subtitle='Veja aqui o andamento de todas as ordens de serviço da empresa'
        button={{
          label: 'Nova Ordem de Serviço',
          onClick: () => {},
          isAdd: true, 
        }}
      />
    </div>
  )
}