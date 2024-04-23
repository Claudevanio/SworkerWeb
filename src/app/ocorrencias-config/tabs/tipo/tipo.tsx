"use client";
import {
  CheckBox,
  FiltroButton,
  Modal,
  SearchInput,
} from "@/components";
import { BaseTable } from "@/components/table/BaseTable";
import Pagination from "@/components/ui/pagination";
import { ocurrrenceClassificationService } from "@/services/Ocurrences";
import { basePagination } from "@/types";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {  useEffect, useState } from "react";
import { IOcurrenceClassification } from "@/types/models/Ocurrences/IOcurrenceClassification";
import { IOcurrenceType } from "@/types/models/Ocurrences/IOcurrenceType";
import ModalAddAndUpdate from "./components/modalAddAndUpdate";
import { useDialog } from "@/hooks/use-dialog";
import { ocurrenceTypeService } from "@/services/Ocurrences/ocurrenceTypeService";
import { ExportButton } from "@/components/ui/exportButton";
import dayjs from "dayjs";

export function Tipo({
  isMobile,
  openModalAdd,
  handleCloseModalAdd,
}: {
  isMobile: boolean;
  openModalAdd: boolean;
  handleCloseModalAdd: () => void;
}) {
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [filter, setFilter] = useState({
    page: 0,
    pageSize: 10,
    term: "",
  });
  
  const [exportTypes, setExportTypes] = useState<string[][]>([]);

  const [typeSelected, setTypeSelected] = useState<IOcurrenceType>(
    {} as IOcurrenceType
  );

  const { isLoading, data: types, refetch } = useQuery<
    basePagination<IOcurrenceType> | undefined
  >({
    queryKey: ["conf-tipo", { filter }],
    queryFn: () =>
      ocurrenceTypeService.getTypesWithPagination(
        filter.term,
        filter.page,
        filter.pageSize,
      ) as any,
    refetchOnWindowFocus: false,
    refetchOnMount: true
  });

  const columns = [
    {
      label: "Tipo de ocorrência",
      key: "description",
      mobileTitle: true,
      rowFormatter: (type: IOcurrenceType) => {
        return (
          <div
            className="flex items-center gap-2 group"
            style={{ height: "70px" }}
          >
            <div
              className="w-0 group-hover:!w-12 overflow-hidden transition-all items-center gap-1"
              style={
                selected.includes(type.id)
                  ? {
                      width: "2rem",
                    }
                  : {}
              }
            >
              <CheckBox
                variant="secondary"
                value={selected.includes(type.id)}
                onChange={() => {
                  setSelected((prev) => {
                    if (prev.includes(type.id)) {
                      return prev.filter((v) => v !== type.id);
                    }
                    return [...prev, type.id];
                  });
                }}
              />
            </div>
            <div>{type.typeName}</div>
          </div>
        );
      },
    },
  ];

  const rows = types?.items ?? [];

   const handleChangeExportTypes = () => {
     const arrayTpes = types?.items?.filter((item) => {
       return selected.includes(item.id);
     });

     const csvData = [
       ["Tipo de ocorrência", "Descrição", "Data de registro"],
       ...(arrayTpes?.map((type) => {
         return [
           type.typeName ?? "",
           type.description ?? "",
           dayjs(type.registerDate).format("DD/MM/YYYY") ?? "",
         ];
       }) ?? []),
     ];

     setExportTypes(csvData);
   };

   useEffect(() => {
     handleChangeExportTypes();
   }, [selected]);


  const { openDialog, confirmDialog } = useDialog();

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
              value={filter.term}
              onChange={(e) => {
                setFilter({
                  ...filter,
                  term: e,
                });
              }}
            />
          </Stack>
        </Stack>
        {!isMobile && (
          <ExportButton
            disabled={selected.length < 1}
            fileName="tipos.csv"
            csvData={exportTypes}
            onClick={() => {}}
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
              label: "Excluir",
              onClick: (data: IOcurrenceClassification) =>
                openDialog({
                  title: "Excluir tipo",
                  subtitle: "Deseja mesmo excluir?",
                  message: "Este item não poderá ser recuperado depois.",
                  onConfirm: async () => {
                    try {
                      await ocurrenceTypeService.deleteType(data.id);
                      refetch();
                    } catch (e) {
                      confirmDialog({
                        title: "Houve um erro ao excluir a classificação",
                        message: e.message,
                      });
                    }
                  },
                  onConfirmText: "Excluir",
                }),
              icon: <DeleteOutline />,
            },
            {
              label: "Editar",
              onClick: (data: IOcurrenceType) => {
                setTypeSelected(data);
                setOpenModalUpdate(true);
              },
              icon: <EditOutlined />,
            },
          ]}
          rows={rows}
        />
        <Pagination
          currentPage={filter.page ?? 0}
          totalPages={Math.ceil(types?.count / filter.pageSize)}
          onChange={(page) =>
            setFilter((prev) => ({
              ...prev,
              page,
            }))
          }
        />
      </div>
      {(openModalAdd || openModalUpdate) && (
        <Modal
          width="60%"
          isOpen={openModalAdd || openModalUpdate}
          onClose={() => {
            setOpenModalUpdate(false);
            handleCloseModalAdd();
          }}
          title={openModalAdd == true ? "Novo tipo" : "Editar tipo"}
        >
          <ModalAddAndUpdate
            refetch={refetch}
            handleClose={() => {
              setTypeSelected({} as IOcurrenceType);
              handleCloseModalAdd();
              setOpenModalUpdate(false);
            }}
            isAdd={openModalAdd}
            typeSelected={typeSelected}
          />
        </Modal>
      )}
    </Stack>
  );
}
