import { BaseTable } from '@/components/table/BaseTable';
import { SearchInput } from '@/components/ui';
import Pagination from '@/components/ui/pagination';
import { useAdministrator } from '@/contexts/AdministrationProvider';
import { useGestao } from '@/contexts/GestaoProvider';
import { useDialog } from '@/hooks/use-dialog';
import usePagination from '@/hooks/use-pagination';
import { useUser } from '@/hooks/useUser';
import { ICompanyUnity, ISector } from '@/types';
import { masks } from '@/utils';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import { useEffect, useState } from 'react';

export function SectorTab() {
  const { sectors, modal } = useGestao();

  const { companiesList } = useUser();

  const columns = [
    {
      label: 'Setor',
      key: 'description',
      mobileTitle: true
    },
    {
      label: 'Empresa',
      key: 'companyId',
      Formatter: (companyId: any) => {
        return companiesList?.find(c => c.id === companyId)?.name ?? 'Não encontrado';
      }
    } 
  ];
  
  return (
    <>
      <SearchInput
        value={sectors.filters.term}
        onChange={v =>
          sectors.setFilter(prev => ({
            ...prev,
            term: v === '' ? undefined : v,
            page: 1
          }))
        }
      />
      <BaseTable
        columns={columns}
        onClickRow={(data: any) => {
          sectors.selectCurrent(data, true);
          modal.open();
        }}
        isLoading={sectors.isLoading}
        showAllActions
        actions={[
          {
            label: 'Editar',
            onClick: data => {
              sectors.selectCurrent(data);
              modal.open();
            },
            icon: <EditOutlined />
          }
          // {
          //   label: 'Excluir',
          //   onClick: () => openDialog({
          //     title: 'Excluir setor',
          //     subtitle: 'Deseja mesmo excluir?',
          //     message: 'Este item não poderá ser recuperado depois.',
          //     onConfirm: () => {},
          //     onConfirmText: 'Excluir'
          //   }),
          //   icon: <DeleteOutline/>
          // }
        ]}
        rows={sectors?.data?.items ?? []}
      />
      <Pagination
        currentPage={sectors?.filters?.page}
        totalPages={
          sectors?.data?.count ? Math.ceil(sectors?.data?.count / sectors?.filters?.pageSize) : 1
        }
        onChange={page => sectors.setFilter(prev => ({ ...prev, page }))}
      />
    </>
  );
}
