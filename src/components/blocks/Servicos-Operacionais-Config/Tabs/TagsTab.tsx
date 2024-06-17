import { BaseTable } from '@/components/table/BaseTable';
import Pagination from '@/components/ui/pagination';
import { useServiceOperations } from '@/contexts/ServiceOperationsConfigProvider';
import { useModal } from '@/hooks';
import { useDialog } from '@/hooks/use-dialog';
import { ITags } from '@/types/models/ServiceOrder/ITags';
import { DeleteOutlined, EditOutlined, RemoveOutlined } from '@mui/icons-material';
import dayjs from 'dayjs';
import { ModalFiltroTaskGroup } from '../Overlay/ModalFiltroTaskGroup';
import { CheckBox, ExportButton, FiltroButton } from '@/components/ui';
import { Form } from '@/components/form';
import { ModalTaskView } from '../Overlay/ModalTask/ModalTaskView';
import { useState } from 'react';
import { TagsService } from '@/services/OperationalService/TagsService';
import { ModalFiltroTags } from '../Overlay/ModalFiltroTags';

// function to turn seconds into minutes
function secondsToMinutes(seconds: number) {
  return Math.floor(seconds / 60);
}

export function TagsTab() {
  const { tags, modal } = useServiceOperations();

  const { confirmDialog } = useDialog();

  const rows = tags.data?.items ?? [];

  const [selected, setSelected] = useState<ITags[]>([]);

  function mapCSVData(data: ITags[]): string[][] {
    const obj = data.map(item => ({
      Nome: item.description,
      UID: item.uid,
      HWID: item.hwid,
      Modo: item.mode === 1 ? 'Passivo' : 'Ativo',
      Status: item.status === 0 ? 'Ativo' : 'Inativo',
      Tipo: tags.types.find(type => type.id === item.tagTypeId)?.description
    }));

    if (obj.length === 0) {
      return [];
    }

    const firstArray = Object.keys(obj[0]);

    const csvData = obj.map(item => firstArray.map(key => item[key]));

    return [firstArray, ...csvData];
  }

  const columns: {
    label: string;
    key: keyof ITags;
    Formatter?: (data: any) => any;
    rowFormatter?: (data: ITags) => any;
    mobileTitle?: boolean;
  }[] = [
    {
      label: 'Nome',
      key: 'description',
      mobileTitle: true,
      rowFormatter: row => {
        return (
          <div className="flex items-center gap-2 group ">
            <div
              className="w-0 group-hover:!w-12 overflow-hidden transition-all items-center gap-2 hidden md:flex"
              style={
                selected.find(v => v.uid === row.uid)
                  ? {
                      width: '3rem'
                    }
                  : {}
              }
            >
              <CheckBox
                variant="secondary"
                value={selected.find(v => v.uid === row.uid)}
                onChange={() => {
                  if (selected.find(v => v.uid === row.uid)) {
                    setSelected(prev => prev.filter(v => v.uid !== row.uid));
                  } else {
                    setSelected(prev => [...prev, row]);
                  }
                }}
              />
            </div>
            <span className="">{row.description}</span>
          </div>
        );
      }
    },
    {
      label: 'UID',
      key: 'uid'
    },
    {
      label: 'HWID',
      key: 'hwid'
    },
    {
      label: 'Modo',
      key: 'mode',
      Formatter: mode => {
        return mode === 1 ? 'Passivo' : 'Ativo';
      }
    },
    {
      label: 'Status',
      key: 'status',
      Formatter: status => {
        return status === 0 ? 'Ativo' : 'Inativo';
      }
    },
    {
      label: 'Tipo',
      key: 'tagTypeId',
      Formatter: tagTypeId => {
        return tags.types.find(type => type.id === tagTypeId)?.description;
      }
    }
  ];

  const [isFiltroModalOpen, openFiltroModal, closeFiltroModal] = useModal();

  const [isModalOpen, openModal, closeModal] = useModal();

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-end items-center gap-6">
        <ExportButton disabled={selected.length === 0} csvData={selected.length > 0 ? mapCSVData(selected) : []} />
        <FiltroButton onClick={openFiltroModal} />
      </div>
      <BaseTable
        columns={columns}
        isLoading={tags.isLoading}
        onClickRow={data => {
          tags.selectCurrent(data as ITags);
          openModal();
        }}
        actions={[
          {
            label: 'Editar',
            onClick: (data: ITags) => {
              tags.selectCurrent(data);
              modal.open();
            },
            icon: <EditOutlined />
          },
          {
            label: 'Excluir',
            onClick: (data: ITags) =>
              confirmDialog({
                title: 'Excluir Tarefa',
                subtitle: 'Deseja mesmo excluir?',
                message: 'Este item não poderá ser recuperado depois.',
                onConfirm: () => {
                  tags.remove(data);
                },
                onConfirmText: 'Excluir'
              }),
            icon: <DeleteOutlined />
          }
        ]}
        rows={rows}
      />
      <Pagination
        currentPage={tags.filters.page ?? 0}
        totalPages={Math.ceil(tags?.data?.count / tags.filters.pageSize)}
        onChange={page =>
          tags?.setFilter(prev => ({
            ...prev,
            page
          }))
        }
      />
      {isFiltroModalOpen && <ModalFiltroTags isOpen={isFiltroModalOpen} onClose={closeFiltroModal} />}
    </div>
  );
}
