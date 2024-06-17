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
import { IOcurrenceType } from '@/types/models/Ocurrences/IOcurrenceType';
import { IOcurrenceCharacterization } from '@/types/models/Ocurrences/IOcurrenceCharacterization';
import { IFilterCharacterization } from '@/types/models/Ocurrences/IFilterCharacterization';
import ModalFilter from './components/modalFilter';
import ModalAddAndUpdate from './components/modalAddAndUpdate';
import { useDialog } from '@/hooks/use-dialog';
import { ocurrenceCharacterizationService } from '@/services/Ocurrences/ocurrenceCharacterizationsService';
import { ExportButton } from '@/components/ui/exportButton';

export function Categorizacao({
  isMobile,
  types,
  openModalAdd,
  handleCloseModalAdd
}: {
  isMobile: boolean;
  types: IOcurrenceType[];
  openModalAdd: boolean;
  handleCloseModalAdd: () => void;
}) {
  const [openModalFilter, setOpenModalFilter] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [filterCharacterizations, setFilterClassifications] = useState<IFilterCharacterization>({} as IFilterCharacterization);
  const [selected, setSelected] = useState<number[]>([]);
  const [filter, setFilter] = useState({
    page: 0,
    pageSize: 10,
    term: ''
  });

  const [exportCharacterizations, setExportCharacterizations] = useState<string[][]>([]);

  const [characterizationSelected, setCharacterizationSelected] = useState<IOcurrenceCharacterization>({} as IOcurrenceCharacterization);

  const {
    isLoading,
    data: characterizations,
    refetch
  } = useQuery<basePagination<IOcurrenceCharacterization> | undefined>({
    queryKey: ['conf-caracterizacao', { filterCharacterizations, filter }],
    queryFn: () =>
      ocurrenceCharacterizationService.getCharacterizationsWithPagination(filter.term, filter.page, filter.pageSize, filterCharacterizations) as any,
    refetchOnWindowFocus: false
  });

  const columns = [
    {
      label: 'Categoria',
      key: 'description',
      mobileTitle: true,
      rowFormatter: (characterization: IOcurrenceCharacterization) => {
        return (
          <div className="flex items-center gap-2 group" style={{ height: '70px' }}>
            <div
              className="w-0 group-hover:!w-12 overflow-hidden transition-all items-center gap-1"
              style={
                selected.includes(characterization.id)
                  ? {
                      width: '2rem'
                    }
                  : {}
              }
            >
              <CheckBox
                variant="secondary"
                value={selected.includes(characterization.id)}
                onChange={() => {
                  if (selected.includes(characterization.id)) {
                    setSelected(prev => prev.filter(item => item !== characterization.id));
                  } else {
                    setSelected(prev => [...prev, characterization.id]);
                  }
                }}
              />
            </div>
            <div>{characterization.description}</div>
          </div>
        );
      }
    },
    {
      label: 'Tipo de ocorrência',
      key: 'type',
      Formatter: (type: ListOccurrenceTypeModel) => {
        return <div>{type.typeName}</div>;
      }
    }
  ];

  const rows = characterizations?.items ?? [];

  const handleChangeExportCharacterizations = () => {
    const arrayCharacterizations = characterizations?.items?.filter(item => {
      return selected.includes(item.id);
    });

    const csvData = [
      ['Categoria', 'Tipo de ocorrência'],
      ...(arrayCharacterizations?.map(characterization => {
        return [characterization.description ?? '', characterization.type?.typeName ?? ''];
      }) ?? [])
    ];

    setExportCharacterizations(csvData);
  };

  useEffect(() => {
    handleChangeExportCharacterizations();
  }, [selected]);

  const { openDialog, confirmDialog } = useDialog();

  return (
    <Stack>
      <Stack flexDirection={isMobile ? 'column' : 'row'} justifyContent="space-between">
        <Stack width={isMobile ? '100%' : '80%'} flexDirection={isMobile ? 'column' : 'row'} alignItems="center" gap={2} mb={isMobile ? 2 : 0}>
          <Stack width={isMobile ? '100%' : '80%'}>
            <SearchInput
              value={filterCharacterizations.query}
              onChange={e => {
                setFilterClassifications({
                  ...filterCharacterizations,
                  query: e
                });
              }}
            />
          </Stack>
          <Stack width={isMobile ? '35%' : '18%'} alignSelf={isMobile ? 'end' : 'auto'}>
            <FiltroButton onClick={() => setOpenModalFilter(true)} isMobile={isMobile} />
          </Stack>
        </Stack>
        {!isMobile && <ExportButton disabled={selected.length < 1} fileName="categorias.csv" csvData={exportCharacterizations} hidden={isMobile} />}
      </Stack>
      <div className="flex flex-col gap-4 w-full">
        <BaseTable
          isLoading={isLoading}
          columns={columns}
          actions={[
            {
              label: 'Excluir',
              onClick: (data: IOcurrenceCharacterization) =>
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
                        title: 'Houve um erro ao excluir a categoria',
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
              onClick: (data: IOcurrenceCharacterization) => {
                setCharacterizationSelected(data);
                setOpenModalUpdate(true);
              },
              icon: <EditOutlined />
            }
          ]}
          rows={rows}
        />
        <Pagination
          currentPage={filter.page ?? 0}
          totalPages={Math.ceil(characterizations?.count / filter.pageSize)}
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
            filter={filterCharacterizations}
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
          title={openModalAdd ? 'Nova categorização' : 'Editar categorização'}
        >
          <ModalAddAndUpdate
            refetch={refetch}
            handleClose={() => {
              setCharacterizationSelected({} as IOcurrenceCharacterization);
              handleCloseModalAdd();
              setOpenModalUpdate(false);
            }}
            types={types}
            characterizationSelected={characterizationSelected}
            isAdd={openModalAdd}
          />
        </Modal>
      )}
    </Stack>
  );
}
