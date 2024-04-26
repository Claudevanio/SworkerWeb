import { useModal } from "@/hooks";
import useTriggerEffect from "@/hooks/triggeredUseState";
import { useDialog } from '@/hooks/use-dialog';
import { equipmentTypeService } from "@/services/Administrator/equipmentService";
import { ocurrenceCharacterizationService } from "@/services/Ocurrences";
import { configContextService } from "@/services/OperationalService/configContextService";
import { configTaskGroupService } from '@/services/OperationalService/configTaskGroupService';
import { IEquipmentType, basePagination } from "@/types";
import { IOcurrenceCharacterization } from "@/types/models/Ocurrences/IOcurrenceCharacterization";
import { IContext } from "@/types/models/ServiceOrder/IContext";
import { ITaskGroup } from '@/types/models/ServiceOrder/ITaskGroup';
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";

interface baseCRUD<T, Y = basicSearchQuery> {
  data: basePagination<T> | undefined;
  isLoading: boolean;
  update?: (data: T) => void;
  filters?: Y;
  setFilter?: React.Dispatch<React.SetStateAction<Y>>;
  current?: T;
  selectCurrent?: (data: T, readonly?: boolean) => void;
  readonly?: boolean
  create?: (data: T) => void;
  remove?: (data: T) => void;
}

interface Characterization {
  data: IOcurrenceCharacterization[];
}

interface EquipmentTypes {
  data: IEquipmentType[];
}

interface ServiceOperationConfigType {
  modal: {
    isOpen: boolean;
    open: () => void;
    close: () => void;
  };
  contexts: baseCRUD<IContext>;
  characterizations: Characterization
  taskGroups: baseCRUD<ITaskGroup>;
  equipmentTypes: EquipmentTypes
}

const crudInitialState = {
  data: undefined,
  isLoading: false,
  update: () => {},
};

interface basicSearchQuery {
  term: string | undefined;
  page: number;
  pageSize: number;
}

export const ServiceOperationConfigContext =
  createContext<ServiceOperationConfigType>({
    contexts: crudInitialState,
    modal: {} as any,
    characterizations: crudInitialState,
    taskGroups: crudInitialState,
    equipmentTypes: crudInitialState
  });

export const ServiceOperationsConfigProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // #region Commons
  const [isModalOpen, openModal, closeModal] = useModal();
  const [readonly, setReadOnly] = useState(false);

  const {
    confirmDialog
  } = useDialog()

  // #endregion

  // #region Context

  const [contextQueryObject, setContextQueryObject] =
    useTriggerEffect<basicSearchQuery>({
      page: 0,
      pageSize: 10,
      term: undefined,
    });

  const [currentContext, setCurrentContext] = useState<IContext | undefined>(
    undefined
  );

  const selectContext = (context: IContext, readonly: boolean) => {
    setCurrentContext(context);
    setReadOnly(readonly);
  };

  const {
    isLoading: isLoadingContexts,
    data: contexts,
    refetch: refetchContexts,
  } = useQuery<basePagination<IContext> | undefined>({
    queryKey: ["searchContexts", contextQueryObject],
    queryFn: () =>
      configContextService.listContextsAsync(
        contextQueryObject.term,
        contextQueryObject.page,
        contextQueryObject.pageSize
      ) as any,
    refetchOnWindowFocus: false,
  });

  const updateContext = async (context: IContext) => {
    await configContextService.updateContext(context);
    setContextQueryObject({ ...contextQueryObject, page: 0 });
    refetchContexts();
  };

  // #endregion
 
 //#region TaskGroup
 const [taskGroupQueryObject, setTaskGroupQueryObject] =
 useTriggerEffect<basicSearchQuery>({
   page: 0,
   pageSize: 5,
   term: undefined,
 });

const [currentTaskGroup, setCurrentTaskGroup] = useState<ITaskGroup | undefined>(
 undefined
);

const selectTaskGroup = (taskGroup: ITaskGroup, readonly?: boolean) => {
 setCurrentTaskGroup(taskGroup);
 setReadOnly(readonly)
};

const {
 isLoading: isLoadingTaskGroup,
 data: taskGroups,
 refetch: refetchTaskGroups,
} = useQuery<basePagination<ITaskGroup> | undefined>({
 queryKey: ["searchTaskGroups", taskGroupQueryObject],
 queryFn: () =>
   configTaskGroupService.listTaskGroupAsync({
      ...taskGroupQueryObject,
  } ) as any,
 refetchOnWindowFocus: false,
});

const updateTaskGroup = async (taskGroup: ITaskGroup) => {
 await configTaskGroupService.updateTaskGroup(taskGroup);
 setTaskGroupQueryObject({ ...taskGroupQueryObject, page: 0 });
 refetchTaskGroups();
};

const createTaskGroup = async (taskGroup: ITaskGroup) => {
  await configTaskGroupService.createTaskGroup(taskGroup);
  setTaskGroupQueryObject({ ...taskGroupQueryObject, page: 0 });
  refetchTaskGroups();
}

const removeTaskGroup = async (taskGroup: ITaskGroup) => {
  if(!taskGroup) return;
  try{
    await configTaskGroupService.removeTaskGroup(taskGroup);
    setTaskGroupQueryObject({ ...taskGroupQueryObject, page: 0 });
    refetchTaskGroups();
  } catch(e) {
    confirmDialog({
      title: 'Erro ao excluir',
      subtitle: 'Não foi possível excluir o grupo de tarefas',
      message: e.message
    })
  }
}

 // #endregion

 function handleCloseModal() {
  setCurrentContext(undefined);
  setCurrentTaskGroup(undefined);
  setReadOnly(false)
  closeModal();
}

  // #endregion

  // #region Characterizations

  const { data: characterizations } = useQuery<
    IOcurrenceCharacterization[] | undefined
  >({
    queryKey: ["searchCharacterization"],
    queryFn: () =>
      ocurrenceCharacterizationService.getCharacterizations() as any,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  // #endregion

  // #region EquipmentsTypes

  const { data: equipmentTypes } = useQuery<
    IEquipmentType[] | undefined
  >({
    queryKey: ["searchEquipmentsTypes"],
    queryFn: () => equipmentTypeService.listEquipmentTypeAsync() as any,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  // #endregion

  return (
    <ServiceOperationConfigContext.Provider
      value={{
        modal: {
          isOpen: isModalOpen,
          open: () => openModal(),
          close: () => handleCloseModal(),
        },
        contexts: {
          data: contexts,
          isLoading: isLoadingContexts,
          update: updateContext,
          current: currentContext,
          selectCurrent: selectContext,
          setFilter: setContextQueryObject,
          filters: contextQueryObject,
          readonly: readonly,
        },
        characterizations: {
          data: characterizations,
        },
        taskGroups: {
          data: taskGroups,
          isLoading: isLoadingTaskGroup,
          update: updateTaskGroup,
          current: currentTaskGroup,
          selectCurrent: selectTaskGroup,
          setFilter: setTaskGroupQueryObject,
          filters: taskGroupQueryObject,
          readonly: readonly,
          create: createTaskGroup,
          remove: removeTaskGroup
        },
        equipmentTypes: {
          data: equipmentTypes
        }
      }}
    >
      {children}
    </ServiceOperationConfigContext.Provider>
  );
};

export const useServiceOperations = () =>
  useContext(ServiceOperationConfigContext);