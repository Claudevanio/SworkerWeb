import { useEffect, useState } from "react";
import { SimpleTab } from "../tabs/simple-tab";
import { PageTitle } from "../title";
import {
  AddTaskOutlined,
  ChecklistRtlOutlined,
  CreateOutlined,
  SplitscreenOutlined,
} from "@mui/icons-material";

import { ServiceOperationsConfigProvider, useServiceOperations } from "@/contexts/ServiceOperationsConfigProvider";
import ContextoTab from "./Tabs/ContextoTab";
import { ModalTabs } from "./Tabs/handleModalTabs";
import { TaskGroupTab } from './Tabs/TaskGroupTab';
import { TaskTab } from './Tabs/TaskTab';
import { TagsTab } from './Tabs/TagsTab';

export function ServicoOperacionalConfigComponent() {
  const [activeTab, setActiveTab] = useState<number | undefined>(0);

  const tabs = [
    {
      label: "Contexto",
      icon: <CreateOutlined className="text-primary-500" />,
    },
    {
      label: "Grupo de tarefas",
      icon: <SplitscreenOutlined className="text-primary-500" />,
    },
    {
      label: "Tarefas",
      icon: <AddTaskOutlined className="text-primary-500" />,
    },
    {
      label: "Procedimentos",
      icon: <ChecklistRtlOutlined className="text-primary-500" />,
    },
  ];

  const handleLabel = (index: number) => {
    switch (index) {
      case 0:
        return "Adicionar contexto";
      case 1:
        return "Adicionar grupo";
      case 2:
        return "Adicionar tarefa";
      case 3:
        return "Adicionar procedimento";
      default:
        return "Adicionar";
    }
  };

  const {
    modal,
    ...data
  } = useServiceOperations()

  useEffect(() => { 
    if (activeTab !== undefined) {
      switch (activeTab) {
        case 0:
          data.contexts.refetch();
          break;
        case 1:
          data.taskGroups.refetch();
          break;
        case 2:
          data.tasks.refetch();
          break;
        case 3:
          data.tags.refetch();
          break;
        default:
          break;
      }
    }
  }, [activeTab]);

  return (
    <>
      <div className="w-full p-4 lg:p-8">
        <PageTitle
          title="Configurações"
          subtitle="Veja aqui o andamento e configuração de todos os serviços da empresa"
          button={
            activeTab === 0 ? undefined : {
            label: handleLabel(activeTab || 0),
            onClick: modal.open,
            isAdd: true,
          }}
        />
        <SimpleTab
          tabs={tabs as any}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileView
        />
        <div
          className="flex flex-col gap-4"
          style={
            activeTab !== undefined && activeTab === 0
              ? {}
              : { display: "none" }
          }
        >
          <ContextoTab />
        </div>
        <div
          className="flex flex-col gap-4"
          style={
            activeTab !== undefined && activeTab === 1
              ? {}
              : { display: "none" }
          }
        >
          <TaskGroupTab />
        </div>
        <div
          className="flex flex-col gap-4"
          style={
            activeTab !== undefined && activeTab === 2
              ? {}
              : { display: "none" }
          }
        >
          <TaskTab />
        </div>
        <div
          className="flex flex-col gap-4"
          style={
            activeTab !== undefined && activeTab === 3
              ? {}
              : { display: "none" }
          }
        >
          <TagsTab
          />
        </div>
      </div>
      <ModalTabs tab={activeTab} />
    </>
  );
}

export function ServicoOperacionalConfigWrapper() {
  return (
    <ServiceOperationsConfigProvider>
      <ServicoOperacionalConfigComponent />
    </ServiceOperationsConfigProvider>
  );
}
