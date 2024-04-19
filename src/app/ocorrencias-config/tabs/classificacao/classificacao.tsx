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
import { ocurrrenceClassificationService } from "@/services/Ocurrences";
import { basePagination } from "@/types";
import {
  IOcurrence,
  ListOccurrenceTypeModel,
} from "@/types/models/Ocurrences/IOcurrence";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { SetStateAction, useState } from "react";
import { IOcurrenceClassification } from "@/types/models/Ocurrences/IOcurrenceClassification";
import { IOcurrenceType } from "@/types/models/Ocurrences/IOcurrenceType";
import { IOcurrenceCharacterization } from "@/types/models/Ocurrences/IOcurrenceCharacterization";
import { IFilterClassification } from "@/types/models/Ocurrences/IFilterClassification";
import ModalFilter from "./components/modalFilter";
import ModalAddAndUpdate from "./components/modalAddAndUpdate";
import { useDialog } from "@/hooks/use-dialog";

export function Classificacao({
  isMobile,
  characterizations,
  types,
  openModalAdd,
  handleCloseModalAdd,
}: {
  isMobile: boolean;
  characterizations: IOcurrenceCharacterization[];
  types: IOcurrenceType[];
  openModalAdd: boolean;
  handleCloseModalAdd: () => void;
}) {
  const [openModalFilter, setOpenModalFilter] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [filterClassifications, setFilterClassifications] =
    useState<IFilterClassification>({} as IFilterClassification);
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

  const { isLoading, data: classifications } = useQuery<
    basePagination<IOcurrenceClassification> | undefined
  >({
    queryKey: ["conf-classificacao", { filterClassifications, filter }],
    queryFn: () =>
      ocurrrenceClassificationService.getClassificationsWithPagination(
        filter.term,
        filter.page,
        filter.pageSize,
        filterClassifications
      ) as any,
    refetchOnWindowFocus: false,
  });

  const columns = [
    {
      label: "Descrição",
      key: "description",
      mobileTitle: true,
      rowFormatter: (classification: IOcurrenceClassification) => {
        return (
          <div
            className="flex items-center gap-2 group"
            style={{ height: "70px" }}
          >
            <div
              className="w-0 group-hover:!w-12 overflow-hidden transition-all items-center gap-1"
              style={
                selected.includes(classification.id)
                  ? {
                      width: "2rem",
                    }
                  : {}
              }
            >
              <CheckBox
                variant="secondary"
                value={selected.includes(classification.id)}
                onChange={() => {
                  setSelected((prev) => {
                    if (prev.includes(classification.id)) {
                      return prev.filter((v) => v !== classification.id);
                    }
                    return [...prev, classification.id];
                  });
                }}
              />
            </div>
            <div>{classification.description}</div>
          </div>
        );
      },
    },
    {
      label: "Severidade",
      key: "severity",
    },
    {
      label: "Tipo de ocorrência",
      key: "type",
      Formatter: (type: ListOccurrenceTypeModel) => {
        return <div>{type.typeName}</div>;
      },
    },
  ];

  const rows = classifications?.items ?? [];

  const { openDialog } = useDialog();

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
              value={filterClassifications.query}
              onChange={(e) => {
                setFilterClassifications({
                  ...filterClassifications,
                  query: e,
                });
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
          isLoading={isLoading}
          columns={columns}
          actions={[
            {
              label: "Excluir",
              onClick: (data: IOcurrenceClassification) =>
                openDialog({
                  title: "Excluir classificação",
                  subtitle: "Deseja mesmo excluir?",
                  message: "Este item não poderá ser recuperado depois.",
                  onConfirm: () => {
                    ocurrrenceClassificationService.deleteClassification(
                      data.id
                    );
                  },
                  onConfirmText: "Excluir",
                }),
              icon: <DeleteOutline />,
            },
            {
              label: "Editar",
              onClick: (data: IOcurrenceClassification) => {
                setClassificationSelected(data);
                setOpenModalUpdate(true);
              },
              icon: <EditOutlined />,
            },
          ]}
          rows={rows}
        />
        <Pagination
          currentPage={filter.page ?? 0}
          totalPages={Math.floor(classifications?.count / filter.pageSize)}
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
            filter={filterClassifications}
            setFilter={setFilterClassifications}
            handleClose={() => setOpenModalFilter(false)}
            characterizations={characterizations}
            characterizationSelected={characterizationSelected}
            setCharacterizationSelected={setCharacterizationSelected}
            types={types}
            typesSelected={typeSelect}
            setTypesSelected={setTypeSelect}
            classifications={classifications?.items ?? []}
            classificationSelected={classificationSelected}
            setClassificationSelected={setClassificationSelected}
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
          title="Filtrar por:"
        >
          <ModalAddAndUpdate
            handleClose={() => {
              handleCloseModalAdd();
              setOpenModalUpdate(false);
            }}
            types={types}
            classificationSelected={classificationSelected}
            setClassificationSelected={setClassificationSelected}
            isAdd={openModalAdd}
          />
        </Modal>
      )}
    </Stack>
  );
}
