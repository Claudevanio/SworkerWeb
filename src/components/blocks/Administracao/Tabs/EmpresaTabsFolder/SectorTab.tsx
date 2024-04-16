import { BaseTable } from '@/components/table/BaseTable';
import { SearchInput } from '@/components/ui';
import Pagination from '@/components/ui/pagination';
import { useAdministrator } from '@/contexts/AdministrationProvider';
import { useDialog } from '@/hooks/use-dialog';
import { ICompanyUnity, ISector } from '@/types';
import { masks } from '@/utils';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import { useState } from 'react'; 

export function SectorTab() { 

  const {sectors, modal} = useAdministrator()
   
  const rows = sectors.data?.items ?? []

  const {openDialog} = useDialog() 

  const columns = [
    {
      label: 'Setor',
      key: 'name',
    },
    {
      label: 'Unidade',
      key: 'unity',
      Formatter: (unity: ICompanyUnity) => {
        return (
          unity.name
        )
      }
    }
  ] 


  return (
    <>  
      <SearchInput
        value={sectors.filters.term}
        onChange={(v) => sectors.setFilter(prev => ({
          ...prev,
          term: v,
          page: 1
        })
        )}
      /> 
      <BaseTable
        columns={columns}
        onClickRow={
          (data : any) => {
            sectors.selectCurrent(data, true)
            modal.open()
          }
        }
        actions={[{
          label: 'Editar',
          onClick: (data) => {
            sectors.selectCurrent(data)
            modal.open() 
          },
          icon: <EditOutlined/>
        },
        {
          label: 'Excluir',
          onClick: () => openDialog({
            title: 'Excluir setor',
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
          sectors?.filters?.page ?? 1
        }
        totalPages={
          Math.ceil(sectors?.data?.count / sectors?.filters?.pageSize)
        }
        onChange={
          (page) => sectors.setFilter(prev => ({
            ...prev,
            page
          }))
        }
      />
    </>
  );
}