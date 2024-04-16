import { BaseTable } from '@/components/table/BaseTable';
import { SearchInput } from '@/components/ui';
import Pagination from '@/components/ui/pagination';
import { useAdministrator } from '@/contexts/AdministrationProvider';
import { useDialog } from '@/hooks/use-dialog';
import { EtipoPermissao, IPermissions, IRole } from '@/types';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import { useState } from 'react';

export function PermissionsTab() {
  const [value, setValue] = useState('' as string);

  const {permissions, modal} = useAdministrator()
  
 
  const columns = [
    {
      label: 'Nome',
      key: 'name',
    },
    {
      label: 'Permisões',
      key: 'permissions',
      Formatter: (permissionsArr: IPermissions[]) => {
        return (
          <div
            className='flex gap-2 flex-wrap'
          >
            {permissionsArr.map((permission, index) => (
              <div
                key={index}
                className='bg-primary-100 text-primary-500 rounded-lg p-2'
              > 
                {permission.type} : {
                  permissions.permissions?.find(p => p.value === permission.value)?.name ?? (permission.value === EtipoPermissao.Nada ? 'Nada' : 'Não encontrado')
                }
              </div>
            ))}
          </div>
        )
      },
      style:{
        gridColumn: 'span 2'
      }
    }
  ]

  const rows = permissions.data?.items ?? []

  const {openDialog} = useDialog()


  return (
    <div
      className='flex flex-col gap-4 w-full'
    >  
      <SearchInput
        value={permissions.filters.term}
        onChange={(v) => permissions.setFilter(prev => ({
          ...prev,
          term: v === '' ? undefined : v,
          page: 0,
          pageSize: 99
        })
        )}
      /> 
      <BaseTable
        columns={columns}
        isLoading={permissions.isLoading}
        actions={[{
          label: 'Editar',
          onClick: (data) => {
            permissions.selectCurrent(data)
            modal.open() 
          },
          icon: <EditOutlined/>
        },
        {
          label: 'Excluir',
          onClick: (data) => openDialog({
            title: 'Excluir permissão',
            subtitle: 'Deseja mesmo excluir?',
            message: 'Este item não poderá ser recuperado depois.',
            onConfirm: () => {
              permissions.remove(data)
            },
            onConfirmText: 'Excluir'
          }),
          icon: <DeleteOutline/>
        }
      ]}
        rows={rows}
      />
      <Pagination
        currentPage={
          permissions?.filters?.page ?? 1
        }
        totalPages={
          Math.ceil(permissions?.data?.count / permissions?.filters?.pageSize)
        }
        onChange={
          (page) => permissions.setFilter(prev => ({
            ...prev,
            page
          }))
        }
      />
    </div>
  );
}