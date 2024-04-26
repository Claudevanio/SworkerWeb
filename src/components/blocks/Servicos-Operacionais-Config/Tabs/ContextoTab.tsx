import { BaseTable } from "@/components/table/BaseTable";
import Pagination from "@/components/ui/pagination";
import { useServiceOperations } from "@/contexts/ServiceOperationsConfigProvider";
import { IContext } from "@/types/models/ServiceOrder/IContext";
import { EditOutlined } from "@mui/icons-material";

export default function ContextoTab() {
  const { contexts, modal, equipmentTypes } = useServiceOperations();

  const rows = contexts.data?.items ?? [];

  const columns = [
    {
      label: "Nome",
      key: "name",
      mobileTitle: true,
    },
    {
      label: "Aplicação",
      key: "application",
    },
    {
      label: "Tipo",
      key: "type",
      Formatter: (typeId: any) => {
        const filteredType = equipmentTypes.data.find(
          (type) => type.id === typeId
        );

        return <div>{filteredType?.description}</div>;
      },
    },
    {
      label: "Caracterização",
      key: "characterization",
      Formatter: (characterization: any) => {
        return <div>{characterization?.description}</div>;
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      <BaseTable
        columns={columns}
        isLoading={contexts.isLoading}
        actions={[
          {
            label: "Detalhes",
            onClick: (data: IContext) => {
              contexts.selectCurrent(data, true);
              modal.open();
            },
            icon: <EditOutlined />,
          },
          {
            label: "Editar",
            onClick: (data: IContext) => {
              contexts.selectCurrent(data);
              modal.open();
            },
            icon: <EditOutlined />,
          },
        ]}
        rows={rows}
      />
      <Pagination
        currentPage={contexts.filters.page ?? 0}
        totalPages={Math.ceil(
          contexts?.data?.count / contexts.filters.pageSize
        )}
        onChange={(page) =>
          contexts?.setFilter((prev) => ({
            ...prev,
            page,
          }))
        }
      />
    </div>
  );
}
