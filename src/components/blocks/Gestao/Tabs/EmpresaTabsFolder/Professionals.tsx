import { BaseTable } from '@/components/table/BaseTable';
import { SearchInput } from '@/components/ui';
import Pagination from '@/components/ui/pagination';
import { useAdministrator } from '@/contexts/AdministrationProvider';
import { useGestao } from '@/contexts/GestaoProvider';
import { useDialog } from '@/hooks/use-dialog';
import { ICompanyUnity, IProfessional } from '@/types';
import { masks } from '@/utils';
import { DeleteOutline, EditOutlined } from '@mui/icons-material'; 

export function ProfessionalTab() { 

  const {professionals, modal} = useGestao()
   
  const rows = professionals.data?.items ?? []

  const {openDialog} = useDialog() 

  const columns = [
    {
      label: 'Nome',
      key: 'name',
      mobileTitle: true,
      style: {
        gridColumn: 'span 2'
      }
    },
    {
      label: 'CPF',
      key: 'cpf',
      Formatter: (cpf: string) => {
        return (
          masks.CPFMask(cpf)
        )
      },
      style:{
        gridColumn: 'span 2'
      }
    },
    {
      label: 'Telefone',
      key: 'phone',
      Formatter: (phone) => {
        return (
          masks.TELEFONEMask(phone)
        )
      },
      hideOnDesktop: true
    },
    {
      label: 'E-mail',
      key: 'email',
    },
    {
      label: 'Unidade',
      key: 'unityProfessionals',
      Formatter: (company: ICompanyUnity) => {
        return (
          company[0].companyUnityName
        )
      }, 
    },
    // {
    //   label: 'Unidade',
    //   key: 'unity',
    //   Formatter: (unity: ICompanyUnity) => {
    //     return (
    //       unity.name
    //     )
    //   }
    // }
  ] 


  return (
    <>  
      <SearchInput
        value={professionals.filters.term}
        onChange={(v) => professionals.setFilter(prev => ({
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
            professionals.selectCurrent(data, true)
            modal.open()
          }
        }
        isLoading={professionals.isLoading}
        actions={[{
          label: 'Editar',
          onClick: (data) => {
            professionals.selectCurrent(data)
            modal.open() 
          },
          icon: <EditOutlined/>
        },
        {
          label: 'Excluir',
          onClick: () => openDialog({
            title: 'Excluir Profissional',
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
          professionals?.filters?.page ?? 1
        }
        totalPages={
          Math.ceil(professionals?.data?.count / professionals?.filters?.pageSize)
        }
        onChange={
          (page) => professionals.setFilter(prev => ({
            ...prev,
            page
          }))
        }
      />
    </>
  );
}