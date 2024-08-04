'use client';
import { CheckBox, FiltroButton, Modal, SearchInput } from '@/components';
import { BaseTable } from '@/components/table/BaseTable';
import Pagination from '@/components/ui/pagination';
import { ocurrenceService } from '@/services/Ocurrences';
import { basePagination } from '@/types';
import { IFilterOcurrences } from '@/types/models/Ocurrences/IFilterOcurrences';
import {
  IOcurrence,
  ListOccurrenceCharacterizationModel,
  ListOccurrenceProfessionalModal,
  ListOccurrenceTypeModel
} from '@/types/models/Ocurrences/IOcurrence';
import { Assignment, Check } from '@mui/icons-material';
import { Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { IOcurrenceClassification } from '@/types/models/Ocurrences/IOcurrenceClassification';
import { IOcurrenceType } from '@/types/models/Ocurrences/IOcurrenceType';
import { IOcurrenceCharacterization } from '@/types/models/Ocurrences/IOcurrenceCharacterization';
import ModalFilter from './components/modalFilter';
import ModalEnding from './components/modalEnding';
import { IOcurrenceRecognize } from '@/types/models/Ocurrences/IOcurrenceRecognize';
import { ExportButton } from '@/components/ui/exportButton';
import { useUser } from '@/hooks/useUser';

export function Reconhecidas({
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
  const [openModalFilter, setOpenModalFilter] = useState(false);
  const [openModalEnding, setOpenModalEnding] = useState(false);
  const [filterOcurrences, setFilterOcurrences] = useState<IFilterOcurrences>({
    closed: 0
  } as IFilterOcurrences);
  const [selected, setSelected] = useState<IOcurrence[]>([]);
  const [filter, setFilter] = useState({
    page: 0,
    pageSize: 10,
    term: ''
  });

  const [exportOcurrences, setExportOcurrences] = useState<string[][]>([]);

  const [currentOcurrence, setCurrentOcurrence] = useState<IOcurrenceRecognize>({} as IOcurrenceRecognize);

  const { currentCompany } = useUser();

  const {
    isLoading,
    data: ocurrences,
    refetch
  } = useQuery<basePagination<IOcurrenceRecognize> | undefined>({
    queryKey: ['reconhecidas', { filterOcurrences, filter }],
    queryFn: () =>
      ocurrenceService.listOcurrenceRecognitionAsync(currentCompany?.id, filter.term, filter.page, filter.pageSize, filterOcurrences, false) as any,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: !!currentCompany?.id
  });

  const columns = [
    {
      label: 'Id',
      key: 'id',
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
            {ocurrence.id}
          </div>
        );
      }
    }, 
    {
      label: 'Data e Hora',
      key: 'registerDate',
      Formatter: (registerDate: string) => {
        return <div>{dayjs(registerDate).format('DD/MM/YYYY')}</div>;
      }
    },
    {
      label: 'Código OS',
      key: 'occurrence',
      mobileTitle: true,
      Formatter: (ocurrence: IOcurrence) => {
        return <div>{ocurrence?.registerNumber}</div>;
      }
    },
    {
      label: 'Profissional',
      key: 'supervisorName'
    },
    {
      label: 'Caracterização',
      key: 'characterizationDescription'
    },
    {
      label: 'Tipo',
      key: 'occurrence',
      Formatter: (ocurrence: any) => {
        return <div>{ocurrence?.occurrenceTypeName}</div>;
      }
    },
    {
      label: 'Origem',
      key: 'occurrence',
      Formatter: (ocurrence: IOcurrence) => {
        return <div>{ocurrence?.origin}</div>;
      }
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
      <Stack flexDirection={isMobile ? 'column' : 'row'} justifyContent="space-between">
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
        {!isMobile && (
          <ExportButton disabled={selected.length < 1} fileName="ocorrencias-reconhecidas.csv" csvData={exportOcurrences} hidden={isMobile} />
        )}
      </Stack>
      <div className="flex flex-col gap-4 w-full">
        <BaseTable
          isLoading={isLoading}
          columns={columns}
          actions={[
            {
              label: 'Exportar',
              onClick: () => {},
              hiddenDesktop: true,
              icon: <Check />
            },
            {
              label: 'Encerrar',
              onClick: (data: IOcurrenceRecognize) => {
                setCurrentOcurrence(data);
                setOpenModalEnding(true);
              },
              icon: <Assignment />
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
      {openModalFilter && (
        <Modal
          width="60%"
          isOpen={openModalFilter}
          onClose={() => {
            setOpenModalFilter(false);
            setCurrentOcurrence({} as IOcurrenceRecognize);
          }}
          title="Filtrar por:"
        >
          <ModalFilter
            filterOcurrences={filterOcurrences}
            setFilterOcurrences={setFilterOcurrences}
            handleClose={() => setOpenModalFilter(false)}
            characterizations={characterizations}
            types={types}
            classifications={classifications}
          />
        </Modal>
      )}
      {openModalEnding && (
        <Modal
          width="60%"
          isOpen={openModalEnding}
          onClose={() => {
            setOpenModalEnding(false);
            setCurrentOcurrence({} as IOcurrenceRecognize);
          }}
          title="Encerrar Ocorrência"
        >
          <ModalEnding refetch={refetch} currentOcurrence={currentOcurrence} handleClose={() => setOpenModalEnding(false)} />
        </Modal>
      )}
    </Stack>
  );
}
