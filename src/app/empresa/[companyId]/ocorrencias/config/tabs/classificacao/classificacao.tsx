'use client';
import { CheckBox, FiltroButton, Modal, SearchInput } from '@/components';
import { BaseTable } from '@/components/table/BaseTable';
import Pagination from '@/components/ui/pagination';
import { ocurrrenceClassificationService } from '@/services/Ocurrences';
import { basePagination } from '@/types';
import { IOcurrence, ListOccurrenceTypeModel } from '@/types/models/Ocurrences/IOcurrence';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import { Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { SetStateAction, useEffect, useState } from 'react';
import { IOcurrenceClassification } from '@/types/models/Ocurrences/IOcurrenceClassification';
import { IOcurrenceType } from '@/types/models/Ocurrences/IOcurrenceType';
import { IOcurrenceCharacterization } from '@/types/models/Ocurrences/IOcurrenceCharacterization';
import { IFilterClassification } from '@/types/models/Ocurrences/IFilterClassification';
import ModalFilter from './components/modalFilter';
import ModalAddAndUpdate from './components/modalAddAndUpdate';
import { useDialog } from '@/hooks/use-dialog';
import { ExportButton } from '@/components/ui/exportButton';

export function Classificacao({
  isMobile,
  characterizations,
  types,
  openModalAdd,
  handleCloseModalAdd
}: {
  isMobile: boolean;
  characterizations: IOcurrenceCharacterization[];
  types: IOcurrenceType[];
  openModalAdd: boolean;
  handleCloseModalAdd: () => void;
}) {
  const [openModalFilter, setOpenModalFilter] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [filterClassifications, setFilterClassifications] = useState<IFilterClassification>({} as IFilterClassification);
  const [selected, setSelected] = useState<number[]>([]);
  const [filter, setFilter] = useState({
    page: 0,
    pageSize: 10,
    term: ''
  });

  const [exportClassifications, setExportClassifications] = useState<string[][]>([]);

  const [classificationSelected, setClassificationSelected] = useState<IOcurrenceClassification>({} as IOcurrenceClassification);

  const {
    isLoading,
    data: classifications,
    refetch
  } = useQuery<basePagination<IOcurrenceClassification> | undefined>({
    queryKey: ['conf-classificacao', { filterClassifications, filter }],
    queryFn: () =>
      ocurrrenceClassificationService.getClassificationsWithPagination(filter.term, filter.page, filter.pageSize, filterClassifications) as any,
    refetchOnWindowFocus: false
  });

  const columns = [
    {
      label: 'Descrição',
      key: 'description',
      mobileTitle: true,
      rowFormatter: (classification: IOcurrenceClassification) => {
        return (
          <div className="flex items-center gap-2 group" style={{ height: '70px' }}>
            <div
              className="w-0 group-hover:!w-12 overflow-hidden transition-all items-center gap-1"
              style={
                selected.includes(classification.id)
                  ? {
                      width: '2rem'
                    }
                  : {}
              }
            >
              <CheckBox
                variant="secondary"
                value={selected.includes(classification.id)}
                onChange={() => {
                  if (selected.includes(classification.id)) {
                    setSelected(prev => prev.filter(item => item !== classification.id));
                  } else {
                    setSelected(prev => [...prev, classification.id]);
                  }
                }}
              />
            </div>
            <div>{classification.description}</div>
          </div>
        );
      }
    },
    {
      label: 'Severidade',
      key: 'severity'
    },
    {
      label: 'Tipo de ocorrência',
      key: 'type',
      Formatter: (type: ListOccurrenceTypeModel) => {
        return <div>{type.typeName}</div>;
      }
    }
  ];

  const rows = classifications?.items ?? [];

  const handleChangeExportClassifications = () => {
    const arrayClassification = classifications?.items?.filter(item => {
      return selected.includes(item.id);
    });

    const csvData = [
      ['Descrição', 'Severidade', 'Tipo de ocorrência'],
      ...(arrayClassification?.map(classification => {
        return [classification.description ?? '', classification.severity.toString() ?? '', classification.type?.typeName ?? ''];
      }) ?? [])
    ];

    setExportClassifications(csvData);
  };

  useEffect(() => {
    handleChangeExportClassifications();
  }, [selected]);

  const { openDialog, confirmDialog } = useDialog();

  return (
    <Stack>
      <Stack flexDirection={isMobile ? 'column' : 'row'} justifyContent="space-between">
        <Stack width={isMobile ? '100%' : '80%'} flexDirection={isMobile ? 'column' : 'row'} alignItems="center" gap={2} mb={isMobile ? 2 : 0}>
          <Stack width={isMobile ? '100%' : '80%'}>
            <SearchInput
              value={filterClassifications.query}
              onChange={e => {
                setFilterClassifications({
                  ...filterClassifications,
                  query: e
                });
              }}
            />
          </Stack>
          <Stack width={isMobile ? '35%' : '18%'} alignSelf={isMobile ? 'end' : 'auto'}>
            <FiltroButton onClick={() => setOpenModalFilter(true)} isMobile={isMobile} />
          </Stack>
        </Stack>
        {!isMobile && <ExportButton disabled={selected.length < 1} fileName="classificações.csv" csvData={exportClassifications} hidden={isMobile} />}
      </Stack>
      <div className="flex flex-col gap-4 w-full">
        <BaseTable
          isLoading={isLoading}
          columns={columns}
          actions={[
            {
              label: 'Excluir',
              onClick: (data: IOcurrenceClassification) =>
                openDialog({
                  title: 'Excluir classificação',
                  subtitle: 'Deseja mesmo excluir?',
                  message: 'Este item não poderá ser recuperado depois.',
                  onConfirm: async () => {
                    try {
                      await ocurrrenceClassificationService.deleteClassification(data.id);
                      refetch();
                    } catch (e) {
                      confirmDialog({
                        title: 'Houve um erro ao excluir a classificação',
                        message: e.message
                      });
                    }
                  },
                  onConfirmText: 'Excluir'
                }),
              icon: <DeleteOutline />
            },
            {
              label: 'Editar',
              onClick: (data: IOcurrenceClassification) => {
                setClassificationSelected(data);
                setOpenModalUpdate(true);
              },
              icon: <EditOutlined />
            }
          ]}
          rows={rows}
        />
        <Pagination
          currentPage={filter.page ?? 0}
          totalPages={Math.ceil(classifications?.count / filter.pageSize)}
          onChange={page =>
            setFilter(prev => ({
              ...prev,
              page
            }))
          }
        />
      </div>
      {openModalFilter && (
        <Modal
          width="60%"
          isOpen={openModalFilter}
          onClose={() => {
            setOpenModalFilter(false);
          }}
          title="Filtrar por:"
        >
          <ModalFilter
            filter={filterClassifications}
            setFilter={setFilterClassifications}
            handleClose={() => setOpenModalFilter(false)}
            types={types}
          />
        </Modal>
      )}
      {(openModalAdd || openModalUpdate) && (
        <Modal
          width="60%"
          isOpen={openModalAdd || openModalUpdate}
          onClose={() => {
            setOpenModalUpdate(false);
            handleCloseModalAdd();
          }}
          title={openModalAdd ? 'Nova classificação' : 'Editar classificação'}
        >
          <ModalAddAndUpdate
            refetch={refetch}
            handleClose={() => {
              setClassificationSelected({} as IOcurrenceClassification);
              handleCloseModalAdd();
              setOpenModalUpdate(false);
            }}
            types={types}
            classificationSelected={classificationSelected}
            isAdd={openModalAdd}
          />
        </Modal>
      )}
    </Stack>
  );
}
