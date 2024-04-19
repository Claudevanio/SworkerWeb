"use client";
import {
  CheckBox,
  ExportButton,
  FiltroButton,
  Modal,
  SearchInput,
} from "@/components";
import { BaseTable } from "@/components/table/BaseTable";
import Pagination from "@/components/ui/pagination";
import { generateService } from "@/services/Ocurrences";
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
import { useState } from "react";
import { IOcurrenceClassification } from "@/types/models/Ocurrences/IOcurrenceClassification";
import { IOcurrenceType } from "@/types/models/Ocurrences/IOcurrenceType";
import { IOcurrenceCharacterization } from "@/types/models/Ocurrences/IOcurrenceCharacterization";
import ModalFilter from "./components/modalFilter";
import { recognitionService } from "@/services/Ocurrences/recognitionService";

export function Encerradas({
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
  const [filterOcurrences, setFilterOcurrences] = useState<IFilterOcurrences>(
    {} as IFilterOcurrences
  );
  const [selected, setSelected] = useState<number[]>([]);
  const [filter, setFilter] = useState({
    page: 0,
    pageSize: 10,
    term: "",
  });

  const [classificationSelected, setClassificationSelected] =
    useState<IOcurrenceClassification>({} as IOcurrenceClassification);

  const [typeSelect, setTypeSelect] = useState<IOcurrenceType>(
    {} as IOcurrenceType
  );

  const [characterizationSelected, setCharacterizationSelected] =
    useState<IOcurrenceCharacterization>({} as IOcurrenceCharacterization);

  const { isLoading, data: ocurrences } = useQuery<
    basePagination<IOcurrence> | undefined
  >({
    queryKey: ["encerradas", { filterOcurrences, filter }],
    queryFn: () =>
      recognitionService.listOcurrenceAsync(
        filter.term,
        filter.page,
        filter.pageSize,
        filterOcurrences,
        true
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
                  setSelected((prev) => {
                    if (prev.includes(ocurrence.id)) {
                      return prev.filter((v) => v !== ocurrence.id);
                    }
                    return [...prev, ocurrence.id];
                  });
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
        {!isMobile && <ExportButton onClick={() => {}} isMobile={isMobile} />}
      </Stack>
      <div className="flex flex-col gap-4 w-full">
        <BaseTable
          columns={columns}
          rows={rows}
          isLoading={isLoading}
          actions={[
            {
              label: "Exportar",
              onClick: () => {},
              icon: <Check />,
            },
          ]}
        />
        <Pagination
          currentPage={filter.page ?? 0}
          totalPages={Math.floor(ocurrences?.count / filter.pageSize)}
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
          }}
          title="Filtrar por:"
        >
          <ModalFilter
            filterOcurrences={filterOcurrences}
            setFilterOcurrences={setFilterOcurrences}
            handleClose={() => setOpenModalFilter(false)}
            characterizations={characterizations}
            characterizationSelected={characterizationSelected}
            setCharacterizationSelected={setCharacterizationSelected}
            types={types}
            typesSelected={typeSelect}
            setTypesSelected={setTypeSelect}
            classifications={classifications}
            classificationSelected={classificationSelected}
            setClassificationSelected={setClassificationSelected}
          />
        </Modal>
      )}
    </Stack>
  );
}
