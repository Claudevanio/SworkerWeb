'use client';
import { CheckBox, FiltroButton, Modal, SearchInput } from '@/components';
import { BaseTable } from '@/components/table/BaseTable';
import Pagination from '@/components/ui/pagination';
import { ocurrenceService, ocurrrenceClassificationService } from '@/services/Ocurrences';
import { ocurrenceCharacterizationService } from '@/services/Ocurrences/ocurrenceCharacterizationsService';
import { ocurrenceTypeService } from '@/services/Ocurrences/ocurrenceTypeService';
import { basePagination } from '@/types';
import { IFilterOcurrences } from '@/types/models/Ocurrences/IFilterOcurrences';
import {
  IOcurrence,
  ListOccurrenceCharacterizationModel,
  ListOccurrenceProfessionalModal,
  ListOccurrenceTypeModel
} from '@/types/models/Ocurrences/IOcurrence';
import { IOcurrenceCharacterization } from '@/types/models/Ocurrences/IOcurrenceCharacterization';
import { IOcurrenceClassification } from '@/types/models/Ocurrences/IOcurrenceClassification';
import { IOcurrenceType } from '@/types/models/Ocurrences/IOcurrenceType';
import { Check, EditOutlined } from '@mui/icons-material';
import { Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import ModalRecognize from './components/modalRecognize';
import ModalEdit from './components/modalEdit';
import ModalFilter from './components/modalFilter';
import { ExportButton } from '@/components/ui/exportButton';
import { useUser } from '@/hooks/useUser';

export function Geradas({
  isMobile,
  classifications,
  characterizations,
  types
}: {
  isMobile: boolean;
  classifications: IOcurrenceClassification[];
  characterizations: IOcurrenceCharacterization[];
  types: IOcurrenceType[];
}) {
  const [openModalRecognition, setOpenModalRecognition] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalFilter, setOpenModalFilter] = useState(false);
  const [currentOcurrence, setCurrentOcurrence] = useState<IOcurrence>({} as IOcurrence);

  const [selected, setSelected] = useState<IOcurrence[]>([]);
  const [filterOcurrences, setFilterOcurrences] = useState<IFilterOcurrences>({} as IFilterOcurrences);

  const [exportOcurrences, setExportOcurrences] = useState<string[][]>([]);

  const [filter, setFilter] = useState({
    page: 0,
    pageSize: 10,
    term: ''
  });

  const { currentCompany } = useUser();

  const {
    isLoading,
    data: ocurrences,
    refetch
  } = useQuery<basePagination<IOcurrence> | undefined>({
    queryKey: ['geradas', { filterOcurrences, filter }],
    queryFn: () => ocurrenceService.listOcurrenceAsync(currentCompany?.id, filter.term, filter.page, filter.pageSize, filterOcurrences) as any,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: !!currentCompany?.id
  });

  const columns = [
    {
      label: 'Data e Hora',
      key: 'registerDate',
      rowFormatter: (ocurrence: IOcurrence) => {
        return (
          <div className="flex items-center gap-1 group" style={{ height: '70px' }}>
            <div
              className="w-0 group-hover:!w-12 overflow-hidden transition-all items-center gap-1"
              style={
                selected.find(v => v.id === ocurrence.id)
                  ? {
                      width: '2rem'
                    }
                  : {}
              }
            >
              <CheckBox
                variant="secondary"
                value={selected.find(v => v.id === ocurrence.id)}
                onChange={() => {
                  if (selected.find(v => v.id === ocurrence.id)) {
                    setSelected(prev => prev.filter(v => v.id !== ocurrence.id));
                  } else {
                    setSelected(prev => [...prev, ocurrence]);
                  }
                }}
              />
            </div>
            <div>{dayjs(ocurrence.registerDate).format('DD/MM/YYYY')}</div>
          </div>
        );
      }
    },
    {
      label: 'Código OS',
      key: 'registerNumber',
      mobileTitle: true
    },
    {
      label: 'Profissional',
      key: 'professionalName'
    },
    {
      label: 'Caracterização',
      key: 'characterizationDescription'
    },
    {
      label: 'Tipo',
      key: 'occurrenceTypeName'
    },
    {
      label: 'Origem',
      key: 'origin'
    },
    {
      label: 'Status',
      key: 'acknowledged',
      Formatter: (acknowledged: boolean) => {
        return <div>{acknowledged ? 'Concluído' : 'Pendente'}</div>;
      }
    }
  ];

  const rows = ocurrences?.items ?? [];

  const handleChangeExportOcurrence = () => {
    const arrayOcurrence = selected.reduce((acc, current) => {
      const x = acc.find(item => item.id === current.id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    const csvData = [
      ['Data e Hora', 'Código OS', 'Profissional', 'Caracterização', 'Tipo', 'Origem', 'Status'],
      ...(arrayOcurrence?.map(ocurrence => {
        return [
          dayjs(ocurrence.registerDate).format('DD/MM/YYYY') ?? '',
          ocurrence?.registerNumber ?? '',
          ocurrence.professionalName ?? '',
          ocurrence.characterizationDescription ?? '',
          ocurrence?.occurrenceTypeName ?? '',
          ocurrence?.origin ?? '',
          ocurrence.acknowledged ? 'Concluído' : 'Pendente'
        ];
      }) ?? [])
    ] as string[][];

    setExportOcurrences(csvData);
  };

  useEffect(() => {
    handleChangeExportOcurrence();
  }, [selected]);

  return (
    <Stack>
      <Stack flexDirection={isMobile ? 'column' : 'row'} justifyContent="space-between" alignItems="center">
        <Stack width={isMobile ? '100%' : '80%'} flexDirection={isMobile ? 'column' : 'row'} alignItems="center" gap={2} mb={isMobile ? 2 : 0}>
          <Stack width={isMobile ? '100%' : '80%'}>
            <SearchInput
              value={filterOcurrences.queryCod}
              onChange={e => {
                setFilterOcurrences({ ...filterOcurrences, queryCod: e });
              }}
            />
          </Stack>
          <Stack width={isMobile ? '35%' : '18%'} alignSelf={isMobile ? 'end' : 'auto'}>
            <FiltroButton onClick={() => setOpenModalFilter(true)} isMobile={isMobile} />
          </Stack>
        </Stack>
        {!isMobile && <ExportButton disabled={selected.length < 1} fileName="ocorrencias-geradas.csv" hidden={isMobile} csvData={exportOcurrences} />}
      </Stack>
      <div className="flex flex-col gap-4 w-full">
        <BaseTable
          columns={columns}
          isLoading={isLoading}
          isRecognize={true}
          actions={[
            {
              label: 'Reconhecer',
              onClick: (data: IOcurrence) => {
                setCurrentOcurrence(data);
                setOpenModalRecognition(true);
              },
              icon: <Check />
            },
            {
              label: 'Exportar',
              onClick: (data: IOcurrence) => {
                setCurrentOcurrence(data);
                setOpenModalRecognition(true);
              },
              icon: <Check />,
              hiddenDesktop: true
            },
            {
              label: 'Editar',
              onClick: (data: IOcurrence) => {
                setCurrentOcurrence(data);
                setOpenModalEdit(true);
              },
              icon: <EditOutlined />
            }
          ]}
          rows={rows}
        />
        <Pagination
          currentPage={filter.page ?? 0}
          totalPages={Math.ceil(ocurrences?.count / filter.pageSize)}
          onChange={page =>
            setFilter(prev => ({
              ...prev,
              page
            }))
          }
        />
      </div>
      <Modal
        width="60%"
        isOpen={openModalRecognition}
        onClose={() => {
          setOpenModalRecognition(false);
          setCurrentOcurrence({} as IOcurrence);
        }}
        title="Reconhecimento de ocorrência"
      >
        <ModalRecognize
          refetch={refetch}
          currentOcurrence={currentOcurrence}
          setCurrentOcurrence={setCurrentOcurrence}
          classifications={classifications}
          handleClose={() => setOpenModalRecognition(false)}
        />
      </Modal>

      <Modal
        width="60%"
        isOpen={openModalEdit}
        onClose={() => {
          setOpenModalEdit(false);
          setCurrentOcurrence({} as IOcurrence);
        }}
        title="Editar ocorrência"
      >
        <ModalEdit refetch={refetch} currentOcurrence={currentOcurrence} handleClose={() => setOpenModalEdit(false)} isMobile={isMobile} />
      </Modal>

      <Modal
        width="60%"
        isOpen={openModalFilter}
        onClose={() => {
          setOpenModalFilter(false);
          setCurrentOcurrence({} as IOcurrence);
        }}
        title="Filtrar por:"
      >
        <ModalFilter
          filterOcurrences={filterOcurrences}
          setFilterOcurrences={setFilterOcurrences}
          handleClose={() => setOpenModalFilter(false)}
          characterizations={characterizations}
          types={types}
        />
      </Modal>
    </Stack>
  );
}
