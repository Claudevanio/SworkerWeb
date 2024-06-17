import { BaseTable } from '@/components/table/BaseTable';
import { SearchInput } from '@/components/ui';
import Pagination from '@/components/ui/pagination';
import { useAdministrator } from '@/contexts/AdministrationProvider';
import { useGestao } from '@/contexts/GestaoProvider';
import { useDialog } from '@/hooks/use-dialog';
import { ICompany } from '@/types';
import { masks } from '@/utils';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import { useState } from 'react';

export function CompanyUnityTab() {
  const { companyUnities, modal } = useGestao();

  const rows = companyUnities.data?.items ?? [];

  const { openDialog } = useDialog();

  const columns = [
    // {
    //   label: 'Empresa',
    //   key: 'companyId',
    //   mobileTitle: true,
    //   Formatter: (companyId: any) => {
    //     return (
    //       companies.data?.items.find(c => c.id === companyId)?.name ?? 'Não encontrado'
    //     )
    //   }
    // },
    {
      label: 'Nome',
      key: 'name',
      mobileTitle: true
    },
    {
      label: 'Telefone',
      key: 'phone',
      Formatter: (phone: string) => {
        return masks.TELEFONEMask(phone);
      }
    },
    {
      label: 'Ativo',
      key: 'active',
      Formatter: (active: boolean) => {
        return active ? 'Sim' : 'Não';
      }
    }
  ];

  return (
    <>
      <SearchInput
        value={companyUnities.filters.term}
        onChange={v =>
          companyUnities.setFilter(prev => ({
            ...prev,
            term: v === '' ? undefined : v,
            page: 0
          }))
        }
      />
      <BaseTable
        columns={columns}
        onClickRow={(data: any) => {
          companyUnities.selectCurrent(data, true);
          modal.open();
        }}
        isLoading={companyUnities.isLoading}
        actions={[
          {
            label: 'Editar',
            onClick: data => {
              companyUnities.selectCurrent(data);
              modal.open();
            },
            icon: <EditOutlined />
          },
          {
            label: 'Excluir',
            onClick: () =>
              openDialog({
                title: 'Excluir unidade',
                subtitle: 'Deseja mesmo excluir?',
                message: 'Este item não poderá ser recuperado depois.',
                onConfirm: () => {},
                onConfirmText: 'Excluir'
              }),
            icon: <DeleteOutline />
          }
        ]}
        rows={rows}
      />
      <Pagination
        currentPage={companyUnities?.filters?.page ?? 1}
        totalPages={Math.ceil(companyUnities?.data?.count / companyUnities?.filters?.pageSize)}
        onChange={page =>
          companyUnities.setFilter(prev => ({
            ...prev,
            page
          }))
        }
      />
    </>
  );
}
