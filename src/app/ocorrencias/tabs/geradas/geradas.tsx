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
import {
  generateService,
  ocurrrenceClassificationService,
} from "@/services/Ocurrences";
import { ocurrenceCharacterizationService } from "@/services/Ocurrences/ocurrenceCharacterizationsService";
import { ocurrenceTypeService } from "@/services/Ocurrences/ocurrenceTypeService";
import { basePagination } from "@/types";
import { IFilterOcurrences } from "@/types/models/Ocurrences/IFilterOcurrences";
import {
  IOcurrence,
  ListOccurrenceCharacterizationModel,
  ListOccurrenceProfessionalModal,
  ListOccurrenceTypeModel,
} from "@/types/models/Ocurrences/IOcurrence";
import { IOcurrenceCharacterization } from "@/types/models/Ocurrences/IOcurrenceCharacterization";
import { IOcurrenceClassification } from "@/types/models/Ocurrences/IOcurrenceClassification";
import { IOcurrenceType } from "@/types/models/Ocurrences/IOcurrenceType";
import { Check, EditOutlined } from "@mui/icons-material";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState } from "react";
import ModalRecognize from "./components/modalRecognize";
import ModalEdit from "./components/modalEdit";
import ModalFilter from "./components/modalFilter";

export function Geradas({
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
  const [openModalRecognition, setOpenModalRecognition] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalFilter, setOpenModalFilter] = useState(false);
  const [currentOcurrence, setCurrentOcurrence] = useState<IOcurrence>(
    {} as IOcurrence
  );

  const [classificationSelected, setClassificationSelected] =
    useState<IOcurrenceClassification>({} as IOcurrenceClassification);

  const [typeSelect, setTypeSelect] = useState<IOcurrenceType>(
    {} as IOcurrenceType
  );

  const [characterizationSelected, setCharacterizationSelected] =
    useState<IOcurrenceCharacterization>({} as IOcurrenceCharacterization);

  const [selected, setSelected] = useState<number[]>([]);
  const [filterOcurrences, setFilterOcurrences] = useState<IFilterOcurrences>(
    {} as IFilterOcurrences
  );

  const [filter, setFilter] = useState({
    page: 0,
    pageSize: 10,
    term: "",
  });

  const {
    isLoading,
    data: ocurrences,
    refetch
  } = useQuery<basePagination<IOcurrence> | undefined>({
    queryKey: ["geradas", { filterOcurrences, filter }],
    queryFn: () =>
      generateService.listOcurrenceAsync(
        filter.term,
        filter.page,
        filter.pageSize,
        filterOcurrences
      ) as any,
    refetchOnWindowFocus: false,
    refetchOnMount: true
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
      key: "registerNumber",
      mobileTitle: true,
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
      key: "occurrenceType",
      Formatter: (ocurrenceType: ListOccurrenceTypeModel) => {
        return <div>{ocurrenceType?.typeName}</div>;
      },
    },
    {
      label: "Origem",
      key: "origin",
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
          isLoading={isLoading}
          isRecognize={true}
          actions={[
            {
              label: "Reconhecer",
              onClick: (data: IOcurrence) => {
                setCurrentOcurrence(data);
                setOpenModalRecognition(true);
              },
              icon: <Check />,
            },
            {
              label: "Exportar",
              onClick: (data: IOcurrence) => {
                setCurrentOcurrence(data);
                setOpenModalRecognition(true);
              },
              icon: <Check />,
              hiddenDesktop: true,
            },
            {
              label: "Editar",
              onClick: (data: IOcurrence) => {
                setCurrentOcurrence(data);
                setOpenModalEdit(true);
              },
              icon: <EditOutlined />,
            },
          ]}
          rows={rows}
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
          currentOcurrence={currentOcurrence}
          setCurrentOcurrence={setCurrentOcurrence}
          classificationSelected={classificationSelected}
          classifications={classifications}
          handleClose={() => setOpenModalRecognition(false)}
          setClassificationSelected={setClassificationSelected}
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
        <ModalEdit
          refetch={refetch}
          currentOcurrence={currentOcurrence}
          handleClose={() => setOpenModalEdit(false)}
          isMobile={isMobile}
        />
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
          setCharacterizationSelected={setCharacterizationSelected}
          setTypesSelected={setTypeSelect}
          characterizationSelected={characterizationSelected}
          typesSelected={typeSelect}
        />
      </Modal>
    </Stack>
  );
}
