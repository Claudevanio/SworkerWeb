import { BaseTable } from '@/components/table/BaseTable';
import Pagination from '@/components/ui/pagination';
import { useServiceOperations } from '@/contexts/ServiceOperationsConfigProvider';
import { useModal } from '@/hooks';
import { useDialog } from '@/hooks/use-dialog';
import { ITask } from '@/types/models/ServiceOrder/ITask'; 
import { DeleteOutlined, EditOutlined, RemoveOutlined } from '@mui/icons-material';
import dayjs from 'dayjs';
import { ModalFiltroTaskGroup } from '../Overlay/ModalFiltroTaskGroup';
import { FiltroButton } from '@/components/ui';
import { Form } from '@/components/form';
import { ModalTaskView } from '../Overlay/ModalTask/ModalTaskView';

// function to turn seconds into minutes
function secondsToMinutes(seconds: number){
  return Math.floor(seconds / 60)
}

export function TaskTab(){
  const { tasks, modal } = useServiceOperations();

  const {
    confirmDialog
  } = useDialog()

  const rows = tasks.data?.items ?? [];

  const columns = [
    {
      label: 'Código',
      key: 'code',
      mobileTitle: true,
    },
    {
      label: "Nome",
      key: "name",
    }, 
    {
      label: "Grupo",
      key: "taskGroup",
      Formatter: (taskGroup) => {
        return taskGroup?.name
      }
    },
    {
      label: "Profissionais",
      key: "professionalsCount"
    },
    {
      label: "Tempo estimado",
      key: "estimatedTime",
      Formatter: (estimatedTime) => {
        return `${secondsToMinutes(estimatedTime)} minutos`
      }
    }
  ];

  const [isFiltroModalOpen, openFiltroModal, closeFiltroModal] = useModal();

  const [isModalOpen, openModal, closeModal] = useModal();

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* <div className="flex justify-end items-center">
        <FiltroButton
          onClick={openFiltroModal}
        />
      </div> */}
      <BaseTable
        columns={columns}
        isLoading={tasks.isLoading}
        onClickRow={
          (data) => {
            tasks.selectCurrent(data as ITask); 
            openModal()
          }
        }
        actions={[
          {
            label: "Editar",
            onClick: (data: ITask) => {
              tasks.selectCurrent(data);
              modal.open();
            },
            icon: <EditOutlined />,
          },
          {
            label: "Excluir",
            onClick: (data: ITask) => confirmDialog({
                title: 'Excluir Tarefa',
                subtitle: 'Deseja mesmo excluir?',
                message: 'Este item não poderá ser recuperado depois.',
                onConfirm: () => {
                  tasks.remove(data)
                },
                onConfirmText: 'Excluir'
              }),
            icon: <DeleteOutlined />,
          },
        ]}
        rows={rows}
      />  
      <Pagination
        currentPage={tasks.filters.page ?? 0}
        totalPages={Math.ceil(
          tasks?.data?.count / tasks.filters.pageSize
        )}
        onChange={(page) =>
          tasks?.setFilter((prev) => ({
            ...prev,
            page,
          }))
        }
      />
      {
        isFiltroModalOpen && (
          <ModalFiltroTaskGroup
            isOpen={isFiltroModalOpen}
            onClose={closeFiltroModal}
          />
        )
      }
      <ModalTaskView 
        isOpen={isModalOpen}
        onClose={() => {
          modal.close()
          closeModal()
        }}
        current={tasks.current}
      />
    </div>
  );
}