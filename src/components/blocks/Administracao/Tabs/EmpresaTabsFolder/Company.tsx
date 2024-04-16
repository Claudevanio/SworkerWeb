import { BaseTable } from '@/components/table/BaseTable';
import { SearchInput } from '@/components/ui';
import Pagination from '@/components/ui/pagination';
import { useAdministrator } from '@/contexts/AdministrationProvider';
import { useDialog } from '@/hooks/use-dialog';
import { ICompany } from '@/types';
import { masks } from '@/utils';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import { useState } from 'react'; 

export function CompanyTab() { 

  const {companies, modal} = useAdministrator()
   
  const rows = companies.data?.items ?? []

  const {openDialog} = useDialog() 

  const columns = [
    {
      label: 'Nome',
      key: 'name',
    },
    {
      label: 'Responsável',
      key: 'responsible',
    },
    {
      label: 'CNPJ',
      key: 'cnpj',
      Formatter: (cnpj: number) => {
        return (
          masks.CNPJMask(cnpj)
        )
      },
      style:{
        gridColumn: 'span 2'
      }
    }, 
    {
      label: 'Telefone',
      key: 'phone',
      Formatter: (phone: string) => {
        return (
          masks.TELEFONEMask(phone)
        )
      }
    },
    {
      label: 'Email',
      key: 'email',
      hideOnDesktop: true
    }
  ] 


  return (
    <>  
      <SearchInput
        value={companies.filters.term}
        onChange={(v) => companies.setFilter(prev => ({
          ...prev,
          term: v === '' ? undefined : v,
          page: 0
        })
        )}
      /> 
      <BaseTable
        columns={columns}
        isLoading={companies.isLoading}
        onClickRow={
          (data : any) => {
            companies.selectCurrent(data, true)
            modal.open()
          }
        }
        actions={[{
          label: 'Editar',
          onClick: (data) => {
            companies.selectCurrent(data)
            modal.open() 
          },
          icon: <EditOutlined/>
        },
        {
          label: 'Excluir',
          onClick: () => openDialog({
            title: 'Excluir empresa',
            subtitle: 'Deseja mesmo excluir?',
            message: 'Este item não poderá ser recuperado depois.',
            onConfirm: () => {},
            onConfirmText: 'Excluir'
          }),
          icon: <DeleteOutline/>
        }
      ]}
        rows={rows}
      />
      <Pagination
        currentPage={
          companies?.filters?.page ?? 1
        }
        totalPages={
          Math.ceil(companies?.data?.count / companies?.filters?.pageSize)
        }
        onChange={
          (page) => companies.setFilter(prev => ({
            ...prev,
            page
          }))
        }
      />
    </>
  );
}