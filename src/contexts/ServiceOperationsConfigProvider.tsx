import { useModal } from '@/hooks';
import useTriggerEffect from '@/hooks/triggeredUseState';
import { useDialog } from '@/hooks/use-dialog';
import { equipmentTypeService } from '@/services/Administrator/equipmentService';
import { ocurrenceCharacterizationService } from '@/services/Ocurrences';
import { configContextService } from '@/services/OperationalService/configContextService';
import { configTaskGroupService } from '@/services/OperationalService/configTaskGroupService';
import { configTaskService } from '@/services/OperationalService/configTasks';
import { TagsService } from '@/services/OperationalService/TagsService';
import { IEquipmentType, basePagination } from '@/types';
import { IOcurrenceCharacterization } from '@/types/models/Ocurrences/IOcurrenceCharacterization';
import { IContext } from '@/types/models/ServiceOrder/IContext';
import { ITags, ITagsTypes } from '@/types/models/ServiceOrder/ITags';
import { ITask } from '@/types/models/ServiceOrder/ITask';
import { ITaskGroup } from '@/types/models/ServiceOrder/ITaskGroup';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useState } from 'react';

interface baseCRUD<T, Y = basicSearchQuery> {
  data: basePagination<T> | undefined;
  isLoading: boolean;
  update?: (data: T) => void;
  filters?: Y;
  setFilter?: React.Dispatch<React.SetStateAction<Y>>;
  current?: T;
  selectCurrent?: (data: T, readonly?: boolean) => void;
  readonly?: boolean;
  create?: (data: T) => void;
  remove?: (data: T) => void;
  refetch?: () => void;
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
  characterizations: Characterization;
  taskGroups: baseCRUD<ITaskGroup>;
  equipmentTypes: EquipmentTypes;
  tasks: baseCRUD<ITask>;
  tags: baseCRUD<ITags> & {
    types: ITagsTypes[] | undefined;
  };
}

const crudInitialState = {
  data: undefined,
  isLoading: false,
  update: () => {}
};

interface basicSearchQuery {
  term: string | undefined;
  page: number;
  pageSize: number;
}

export const ServiceOperationConfigContext = createContext<ServiceOperationConfigType>({
  contexts: crudInitialState,
  modal: {} as any,
  characterizations: crudInitialState,
  taskGroups: crudInitialState,
  equipmentTypes: crudInitialState,
  tasks: crudInitialState,
  tags: {
    ...crudInitialState,
    types: undefined
  }
});

export const ServiceOperationsConfigProvider = ({ children }: { children: React.ReactNode }) => {
  // #region Commons
  const [isModalOpen, openModal, closeModal] = useModal();
  const [readonly, setReadOnly] = useState(false);

  const { confirmDialog } = useDialog();

  // #endregion

  // #region Context

  const [contextQueryObject, setContextQueryObject] = useTriggerEffect<basicSearchQuery>({
    page: 0,
    pageSize: 10,
    term: undefined
  });

  const [currentContext, setCurrentContext] = useState<IContext | undefined>(undefined);

  const selectContext = (context: IContext, readonly: boolean) => {
    setCurrentContext(context);
    setReadOnly(readonly);
  };

  const {
    isLoading: isLoadingContexts,
    data: contexts,
    refetch: refetchContexts
  } = useQuery<basePagination<IContext> | undefined>({
    queryKey: ['searchContexts', contextQueryObject],
    queryFn: () => configContextService.listContextsAsync(contextQueryObject.term, contextQueryObject.page, contextQueryObject.pageSize) as any,
    refetchOnWindowFocus: false
  });

  const updateContext = async (context: IContext) => {
    await configContextService.updateContext(context);
    setContextQueryObject({ ...contextQueryObject, page: 0 });
    refetchContexts();
  };

  // #endregion

  //#region TaskGroup
  const [taskGroupQueryObject, setTaskGroupQueryObject] = useTriggerEffect<basicSearchQuery>({
    page: 0,
    pageSize: 5,
    term: undefined
  });

  const [currentTaskGroup, setCurrentTaskGroup] = useState<ITaskGroup | undefined>(undefined);

  const selectTaskGroup = (taskGroup: ITaskGroup, readonly?: boolean) => {
    setCurrentTaskGroup(taskGroup);
    setReadOnly(readonly);
  };

  const {
    isLoading: isLoadingTaskGroup,
    data: taskGroups,
    refetch: refetchTaskGroups
  } = useQuery<basePagination<ITaskGroup> | undefined>({
    queryKey: ['searchTaskGroups', taskGroupQueryObject],
    queryFn: () =>
      configTaskGroupService.listTaskGroupAsync({
        ...taskGroupQueryObject
      }) as any,
    refetchOnWindowFocus: false
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
  };

  const removeTaskGroup = async (taskGroup: ITaskGroup) => {
    if (!taskGroup) return;
    try {
      await configTaskGroupService.removeTaskGroup(taskGroup);
      setTaskGroupQueryObject({ ...taskGroupQueryObject, page: 0 });
      refetchTaskGroups();
    } catch (e) {
      confirmDialog({
        title: 'Erro ao excluir',
        subtitle: 'Não foi possível excluir o grupo de tarefas',
        message: e.message
      });
    }
  };

  // #endregion

  // #region Characterizations

  const { data: characterizations } = useQuery<IOcurrenceCharacterization[] | undefined>({
    queryKey: ['searchCharacterization'],
    queryFn: () => ocurrenceCharacterizationService.getCharacterizations() as any,
    refetchOnWindowFocus: false,
    refetchOnMount: true
  });

  // #endregion

  // #region EquipmentsTypes

  const { data: equipmentTypes } = useQuery<IEquipmentType[] | undefined>({
    queryKey: ['searchEquipmentsTypes'],
    queryFn: () => equipmentTypeService.listEquipmentTypeAsync() as any,
    refetchOnWindowFocus: false,
    refetchOnMount: true
  });

  // #endregion

  // #region Tasks
  const [taskQueryObject, setTaskQueryObject] = useTriggerEffect<basicSearchQuery>({
    page: 0,
    pageSize: 6,
    term: undefined
  });

  const [currentTask, setCurrentTask] = useState<ITask | undefined>(undefined);

  const selectTask = (task: ITask, readonly: boolean) => {
    setCurrentTask(task);
    setReadOnly(readonly);
  };

  const removeTask = async (task: ITask) => {
    if (!task) return;
    try {
      await configTaskService.removeTask(task);
      setTaskQueryObject({ ...taskQueryObject, page: 0 });
      refetchTasks();
    } catch (e) {
      confirmDialog({
        title: 'Erro ao excluir',
        subtitle: 'Não foi possível excluir a tarefa',
        message: e.message
      });
    }
  };

  const updateTask = async (task: ITask) => {
    await configTaskService.updateTask(task);
    setTaskQueryObject({ ...taskQueryObject, page: 0 });
    refetchTasks();
  };

  const {
    isLoading: isLoadingTasks,
    data: tasks,
    refetch: refetchTasks
  } = useQuery<basePagination<ITask> | undefined>({
    queryKey: ['searchTasks', taskQueryObject],
    queryFn: () =>
      configTaskService.listTaskAsync({
        currentPage: taskQueryObject.page,
        pageSize: taskQueryObject.pageSize,
        term: taskQueryObject.term
      }) as any,
    refetchOnWindowFocus: false
  });

  // #endregion

  // #region Tags

  const [tagQueryObject, setTagQueryObject] = useState<basicSearchQuery>({
    page: 0,
    pageSize: 10,
    term: undefined
  });

  const [currentTag, setCurrentTag] = useState<ITags | undefined>(undefined);

  const selectTag = (tag: ITags, readonly = false) => {
    setCurrentTag(tag);
    setReadOnly(readonly);
  };

  const {
    isLoading: isLoadingTags,
    data: tags,
    refetch: refetchTags
  } = useQuery<basePagination<ITags> | undefined>({
    queryKey: ['searchTags', tagQueryObject],
    queryFn: () =>
      TagsService.listTagsAsync({
        currentPage: tagQueryObject.page,
        pageSize: tagQueryObject.pageSize,
        term: tagQueryObject.term,
        ...tagQueryObject
      }) as any,
    refetchOnWindowFocus: false
  });

  const updateTag = async (tag: ITags) => {
    await TagsService.updateTags(tag);
    setTagQueryObject({ ...tagQueryObject, page: 0 });
    refetchTags();
  };

  const createTag = async (tag: ITags) => {
    await TagsService.createTags(tag);
    setTagQueryObject({ ...tagQueryObject, page: 0 });
    refetchTags();
  };

  const removeTag = async (tag: ITags) => {
    if (!tag) return;
    try {
      await TagsService.removeTags(tag);
      setTagQueryObject({ ...tagQueryObject, page: 0 });
      refetchTags();
    } catch (e) {
      confirmDialog({
        title: 'Erro ao excluir',
        subtitle: 'Não foi possível excluir a tag',
        message: e.message
      });
    }
  };

  const types = useQuery<ITagsTypes[] | undefined>({
    queryKey: ['searchTagsTypes'],
    queryFn: () => TagsService.getTypes() as any,
    refetchOnWindowFocus: false
  });

  // #endregion

  function handleCloseModal() {
    setCurrentContext(undefined);
    setCurrentTaskGroup(undefined);
    setCurrentTask(undefined);
    setCurrentTag(undefined);
    setReadOnly(false);
    closeModal();
  }

  return (
    <ServiceOperationConfigContext.Provider
      value={{
        modal: {
          isOpen: isModalOpen,
          open: () => openModal(),
          close: () => handleCloseModal()
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
          refetch: refetchContexts
        },
        characterizations: {
          data: characterizations
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
          remove: removeTaskGroup,
          refetch: refetchTaskGroups
        },
        equipmentTypes: {
          data: equipmentTypes
        },
        tasks: {
          data: tasks,
          isLoading: isLoadingTasks,
          update: updateTask,
          remove: removeTask,
          current: currentTask,
          selectCurrent: selectTask,
          setFilter: setTaskQueryObject,
          filters: taskQueryObject,
          readonly: readonly,
          refetch: refetchTasks
        },
        tags: {
          data: tags,
          isLoading: isLoadingTags,
          update: updateTag,
          create: createTag,
          remove: removeTag,
          current: currentTag,
          selectCurrent: selectTag,
          setFilter: setTagQueryObject,
          filters: tagQueryObject,
          types: types.data,
          readonly: readonly,
          refetch: refetchTags
        }
      }}
    >
      {children}
    </ServiceOperationConfigContext.Provider>
  );
};

export const useServiceOperations = () => useContext(ServiceOperationConfigContext);
