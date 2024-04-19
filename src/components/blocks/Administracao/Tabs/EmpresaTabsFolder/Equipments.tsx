'use client'
import { BaseTable } from '@/components/table/BaseTable';
import { CheckBox, ExportButton, FiltroButton, SearchInput } from '@/components/ui';
import Pagination from '@/components/ui/pagination';
import { useAdministrator } from '@/contexts/AdministrationProvider';
import { useModal } from '@/hooks';
import { useDialog } from '@/hooks/use-dialog';
import { equipmentService } from '@/services/Administrator/equipmentService';
import { ICompany, IEquipmentClassification } from '@/types';
import { masks } from '@/utils';
import { DeleteOutline, EditOutlined, Restore } from '@mui/icons-material';
import { useState } from 'react'; 
import { ModalFiltroEquipament } from '../../Overlay/ModalFiltroEquipament';
import { ModalEquipmentsHistory } from '../../Overlay/ModalEquipamentoHistory';

export function EquipmentsTab() { 

  const {equipments, modal} = useAdministrator()
   
  const rows = equipments.data?.items ?? []

  const {openDialog} = useDialog() 

  const [selected, setSelected] = useState<string[]>([])

  const columns = [
    {
      label: 'UID',
      key: 'uid',
      Formatter: (uid: string) => {
        return (
          <div
            className='flex items-center gap-2 group '
          >
            <div
              className='w-0 group-hover:!w-12 overflow-hidden transition-all items-center gap-2 hidden md:flex'
              style={
                selected.includes(uid) ? {
                  width: '3rem'
                } : {}
              }
            >
              <CheckBox 
                variant='secondary'
                value={
                  selected.includes(uid)
                }
                onChange={
                  () => {
                    setSelected(prev => {
                      if(prev.includes(uid)){
                        return prev.filter(v => v !== uid)
                      }
                      return [...prev, uid]
                    }) 
                  }
                }
              />
            </div>
              <span
                className=''>
                {uid}
              </span>
          </div>
        )
      }
    },
    {
      label: 'HWID',
      key: 'hwid',
    }, 
    {
      label: 'Marca',
      key: 'brand',
    },
    {
      label: 'Fabricante',
      key: 'manufacturer',
    },
    {
      label: 'Classificação',
      key: 'classification',
      Formatter: (classification: IEquipmentClassification) => {
        return (
          classification.description
        )
      },
      mobileTitle: true
    }, 
  ] 

  async function handleExportQrCode() {
   await equipmentService.getQrcodes(selected)
  //  console.log(response)
  }

  const [isFilterModalOpen, openFilterModal, closeFilterModal] = useModal()

  const [isHistoryModalOpen, openHistoryModal, closeHistoryModal] = useModal()

  return (
    <>  
    <div
      className='flex flex-col md:flex-row justify-between items-center w-full gap-4'
    >
      <div
        className='w-full '
      >
        <SearchInput
          value={equipments.filters.term}
          onChange={(v) => equipments.setFilter(prev => ({
            ...prev,
            term: v === '' ? undefined : v,
            page: 0,
            pageSize: v !== '' ? 40 : prev.pageSize
          })
          )}
        />
      </div>
      <div
        className='flex justify-end md:justify-between items-center w-full'
      >
        <FiltroButton onClick={openFilterModal}
          className=' !h-12'
        />
        <ExportButton onClick={handleExportQrCode}
          className=' !h-12 hidden md:flex'
          disabled={selected.length === 0}
          /> 
      </div> 

    </div>
      <BaseTable
        columns={columns}
        onExpand={(row) => {
          equipments.selectCurrent(row as any, true)
          modal.open()
        }}
        isLoading ={equipments.isLoading}
        // onClickRow={
        // }
        actions={[{
          label: 'Editar',
          onClick: (data) => {
            equipments.selectCurrent(data)
            modal.open() 
          },
          icon: <EditOutlined/>
        },
        {
          label: 'Excluir',
          onClick: (data) => openDialog({
            title: 'Excluir equipamento',
            subtitle: 'Deseja mesmo excluir?',
            message: 'Este item não poderá ser recuperado depois.',
            onConfirm: () => {
              equipments.remove(data)
            },
            onConfirmText: 'Excluir'
          }),
          icon: <DeleteOutline/>
        },
        {
          label: 'Histórico',
          onClick: (data) => {
            equipments.selectCurrent(data)
            openHistoryModal()
          },
          icon: <Restore/>
        }
      ]}
        rows={rows}
      />
      <Pagination
        currentPage={equipments?.filters?.page ?? 1}
        totalPages={
          Math.ceil(equipments?.data?.count / equipments?.filters?.pageSize)
        }
        onChange={
          (page) => equipments.setFilter(prev => ({
            ...prev,
            page
          }))
        }
      /> 
      <ModalFiltroEquipament
        onClose={closeFilterModal}
        isOpen={isFilterModalOpen}
      /> 
      <ModalEquipmentsHistory
        onClose={closeHistoryModal}
        isOpen={isHistoryModalOpen}
      />
    </>
  );
}