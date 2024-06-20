import { BaseTable } from '@/components/table/BaseTable';
import Pagination from '@/components/ui/pagination';
import { useServiceOperations } from '@/contexts/ServiceOperationsConfigProvider';
import { useModal } from '@/hooks';
import { useDialog } from '@/hooks/use-dialog';
import { ITaskGroup } from '@/types/models/ServiceOrder/ITaskGroup';
import { DeleteOutlined, EditOutlined, RemoveOutlined } from '@mui/icons-material';
import dayjs from 'dayjs';
import { ModalFiltroTaskGroup } from '../Overlay/ModalFiltroTaskGroup';
import { FiltroButton } from '@/components/ui';

export function TaskGroupTab() {
  const { taskGroups, modal } = useServiceOperations();

  const { confirmDialog } = useDialog();

  const rows = taskGroups.data?.items ?? [];

  const columns = [
    {
      label: 'Código',
      key: 'code',
      mobileTitle: true
    },
    {
      label: 'Nome',
      key: 'name'
    },
    {
      label: 'Versão',
      key: 'version'
    },
    {
      label: 'Data de início',
      key: 'startDate',
      Formatter: startDate => {
        return dayjs(startDate).format('DD/MM/YYYY');
      }
    },
    {
      label: 'Data de fim',
      key: 'endDate',
      Formatter: endDate => {
        return dayjs(endDate).format('DD/MM/YYYY');
      }
    }
  ];

  const [isFiltroModalOpen, openFiltroModal, closeFiltroModal] = useModal();

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-end items-center">
        <FiltroButton onClick={openFiltroModal} />
      </div>
      <BaseTable
        columns={columns}
        isLoading={taskGroups.isLoading}
        onClickRow={data => {
          taskGroups.selectCurrent(data as ITaskGroup, true);
          modal.open();
        }}
        actions={[
          {
            label: 'Editar',
            onClick: (data: ITaskGroup) => {
              taskGroups.selectCurrent(data);
              modal.open();
            },
            icon: <EditOutlined />
          },
          {
            label: 'Excluir',
            onClick: (data: ITaskGroup) =>
              confirmDialog({
                title: 'Excluir Grupo de Tarefas',
                subtitle: 'Deseja mesmo excluir?',
                message: 'Este item não poderá ser recuperado depois.',
                onConfirm: () => {
                  taskGroups.remove(data);
                },
                onConfirmText: 'Excluir'
              }),
            icon: <DeleteOutlined />
          }
        ]}
        rows={[...rows]}
      />
      <Pagination
        currentPage={taskGroups.filters.page ?? 0}
        totalPages={Math.ceil(taskGroups?.data?.count / taskGroups.filters.pageSize)}
        onChange={page =>
          taskGroups?.setFilter(prev => ({
            ...prev,
            page: page > 0 ? page   : 0
          }))
        }
      />
      {isFiltroModalOpen && <ModalFiltroTaskGroup isOpen={isFiltroModalOpen} onClose={closeFiltroModal} />}
    </div>
  );
}
