"use client";
import { CheckBox, FiltroButton, Modal, SearchInput } from "@/components";
import { BaseTable } from "@/components/table/BaseTable";
import Pagination from "@/components/ui/pagination";
import { ocurrenceService } from "@/services/Ocurrences";
import { basePagination } from "@/types";
import { IFilterOcurrences } from "@/types/models/Ocurrences/IFilterOcurrences";
import {
  IOcurrence,
  ListOccurrenceCharacterizationModel,
  ListOccurrenceProfessionalModal,
  ListOccurrenceTypeModel,
} from "@/types/models/Ocurrences/IOcurrence";
import { Assignment, Check } from "@mui/icons-material";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { IOcurrenceClassification } from "@/types/models/Ocurrences/IOcurrenceClassification";
import { IOcurrenceType } from "@/types/models/Ocurrences/IOcurrenceType";
import { IOcurrenceCharacterization } from "@/types/models/Ocurrences/IOcurrenceCharacterization";
import ModalFilter from "./components/modalFilter";
import ModalEnding from "./components/modalEnding";
import { IOcurrenceRecognize } from "@/types/models/Ocurrences/IOcurrenceRecognize";
import { ExportButton } from "@/components/ui/exportButton";

export function Reconhecidas({
  isMobile,
  classifications,
  characterizations,
  types,
}: {
  isMobile: boolean;
  classifications: IOcurrenceClassification[];
  characterizations: IOcurrenceCharacterization[];
  types: IOcurrenceType[];
}) {
  const [openModalFilter, setOpenModalFilter] = useState(false);
  const [openModalEnding, setOpenModalEnding] = useState(false);
  const [filterOcurrences, setFilterOcurrences] = useState<IFilterOcurrences>(
    {} as IFilterOcurrences
  );
  const [selected, setSelected] = useState<number[]>([]);
  const [filter, setFilter] = useState({
    page: 0,
    pageSize: 10,
    term: "",
  });

  const [exportOcurrences, setExportOcurrences] = useState<string[][]>([]);

  const [currentOcurrence, setCurrentOcurrence] = useState<IOcurrenceRecognize>(
    {} as IOcurrenceRecognize
  );

  const {
    isLoading,
    data: ocurrences,
    refetch,
  } = useQuery<basePagination<IOcurrenceRecognize> | undefined>({
    queryKey: ["reconhecidas", { filterOcurrences, filter }],
    queryFn: () =>
      ocurrenceService.listOcurrenceRecognitionAsync(
        filter.term,
        filter.page,
        filter.pageSize,
        filterOcurrences,
        false
      ) as any,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const columns = [
    {
      label: "Data e Hora",
      key: "registerDate",
      rowFormatter: (ocurrence: IOcurrence) => {
        return (
          <div
            className="flex items-center gap-1 group"
            style={{ height: "70px" }}
          >
            <div
              className="w-0 group-hover:!w-12 overflow-hidden transition-all items-center gap-1"
              style={
                selected.includes(ocurrence.id)
                  ? {
                      width: "2rem",
                    }
                  : {}
              }
            >
              <CheckBox
                variant="secondary"
                value={selected.includes(ocurrence.id)}
                onChange={() => {
                  if (selected.includes(ocurrence.id)) {
                    setSelected((prev) =>
                      prev.filter((item) => item !== ocurrence.id)
                    );
                  }
                  if (!selected.includes(ocurrence.id)) {
                    setSelected((prev) => [...prev, ocurrence.id]);
                  }
                }}
              />
            </div>
            <div>{dayjs(ocurrence.registerDate).format("DD/MM/YYYY")}</div>
          </div>
        );
      },
    },
    {
      label: "Código OS",
      key: "occurrence",
      mobileTitle: true,
      Formatter: (ocurrence: IOcurrence) => {
        return <div>{ocurrence?.registerNumber}</div>;
      },
    },
    {
      label: "Profissional",
      key: "professional",
      Formatter: (professional: ListOccurrenceProfessionalModal) => {
        return <div>{professional?.name}</div>;
      },
    },
    {
      label: "Caracterização",
      key: "characterization",
      Formatter: (characterization: ListOccurrenceCharacterizationModel) => {
        return <div>{characterization?.description}</div>;
      },
    },
    {
      label: "Tipo",
      key: "occurrence",
      Formatter: (ocurrence: IOcurrence) => {
        return <div>{ocurrence?.occurrenceType?.typeName}</div>;
      },
    },
    {
      label: "Origem",
      key: "occurrence",
      Formatter: (ocurrence: IOcurrence) => {
        return <div>{ocurrence?.origin}</div>;
      },
    },
    {
      label: "Status",
      key: "acknowledged",
      Formatter: (acknowledged: boolean) => {
        return <div>{acknowledged ? "Concluído" : "Pendente"}</div>;
      },
    },
  ];

  const rows = ocurrences?.items ?? [];

  const handleChangeExportOcurrence = () => {
    const arrayOcurrence = ocurrences?.items?.filter((item) => {
      return selected.includes(item.id);
    });

    const csvData = [
      [
        "Data e Hora",
        "Código OS",
        "Profissional",
        "Caracterização",
        "Tipo",
        "Origem",
        "Status",
      ],
      ...(arrayOcurrence?.map((ocurrence) => {
        return [
          dayjs(ocurrence.registerDate).format("DD/MM/YYYY") ?? "",
          ocurrence.occurrence?.registerNumber ?? "",
          ocurrence.professional?.name ?? "",
          ocurrence.characterization?.description ?? "",
          ocurrence.occurrence?.occurrenceType?.typeName ?? "",
          ocurrence.occurrence?.origin ?? "",
          ocurrence.occurrence?.acknowledged ? "Concluído" : "Pendente",
        ];
      }) ?? []),
    ];

    setExportOcurrences(csvData);
  };

  useEffect(() => {
    handleChangeExportOcurrence();
  }, [selected]);

  return (
    <Stack>
      <Stack
        flexDirection={isMobile ? "column" : "row"}
        justifyContent="space-between"
      >
        <Stack
          width={isMobile ? "100%" : "80%"}
          flexDirection={isMobile ? "column" : "row"}
          alignItems="center"
          gap={2}
          mb={isMobile ? 2 : 0}
        >
          <Stack width={isMobile ? "100%" : "80%"}>
            <SearchInput
              value={filterOcurrences.queryCod}
              onChange={(e) => {
                setFilterOcurrences({ ...filterOcurrences, queryCod: e });
              }}
            />
          </Stack>
          <Stack
            width={isMobile ? "35%" : "18%"}
            alignSelf={isMobile ? "end" : "auto"}
          >
            <FiltroButton
              onClick={() => setOpenModalFilter(true)}
              isMobile={isMobile}
            />
          </Stack>
        </Stack>
        {!isMobile && (
          <ExportButton
            disabled={selected.length < 1}
            fileName="ocorrencias-reconhecidas.csv"
            csvData={exportOcurrences} 
            hidden={isMobile}
          />
        )}
      </Stack>
      <div className="flex flex-col gap-4 w-full">
        <BaseTable
          isLoading={isLoading}
          columns={columns}
          actions={[
            {
              label: "Exportar",
              onClick: () => {},
              hiddenDesktop: true,
              icon: <Check />,
            },
            {
              label: "Encerrar",
              onClick: (data: IOcurrenceRecognize) => {
                setCurrentOcurrence(data);
                setOpenModalEnding(true);
              },
              icon: <Assignment />,
            },
          ]}
          rows={rows}
        />
        <Pagination
          currentPage={filter.page ?? 0}
          totalPages={Math.ceil(ocurrences?.count / filter.pageSize)}
          onChange={(page) =>
            setFilter((prev) => ({
              ...prev,
              page,
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
          title="Filtrar por:"
        >
          <ModalEnding
            refetch={refetch}
            currentOcurrence={currentOcurrence}
            handleClose={() => setOpenModalEnding(false)}
          />
        </Modal>
      )}
    </Stack>
  );
}
