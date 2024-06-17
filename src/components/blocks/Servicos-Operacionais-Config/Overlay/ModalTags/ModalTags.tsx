import { Modal } from '@/components/ui/modal';
import { EtipoPermissao, ICompany, ICompanyUnity, IEquipment, IEquipmentClassification, IEquipmentType, IPermissions, IRole } from '@/types';
import * as Yup from 'yup';
import { Form } from '@/components/form/Form';
import { set, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input } from '@/components/ui';
import { Dropdown } from '@/components/form';
import React, { useEffect } from 'react';
import { Stepper } from '@/components/ui/stepper';
import { useQuery } from '@tanstack/react-query';
import { equipmentClassificationService, equipmentService, equipmentTypeService } from '@/services/Administrator/equipmentService';
import { Add, DeleteOutline, EditOutlined } from '@mui/icons-material';
import { ITask, ITaskSteps } from '@/types/models/ServiceOrder/ITask';
import { configTaskGroupService } from '@/services/OperationalService/configTaskGroupService';
import { ITaskGroup } from '@/types/models/ServiceOrder/ITaskGroup';
import { useModal } from '@/hooks';
import { IOcurrence } from '@/types/models/Ocurrences/IOcurrence';
import CustomizedGroupAccordion from '@/components/blocks/Ordens-Servicos/Tabs/customizedGroupAccordeon';
import { OrdenableTable } from '../ModalTask/OrdenableTable';
import { configTaskService } from '@/services/OperationalService/configTasks';
import { useDialog } from '@/hooks/use-dialog';
import { AutoComplete } from '@/components/ui/autocomplete';
import { ocurrenceService } from '@/services/Ocurrences';
import { useServiceOperations } from '@/contexts/ServiceOperationsConfigProvider';
import { ITags, ITagsTasks } from '@/types/models/ServiceOrder/ITags';
import { TagsService } from '@/services/OperationalService/TagsService';

export function ModalTags({ isOpen, onClose, current, readonly }: { isOpen: boolean; onClose: () => void; current?: ITags; readonly?: boolean }) {
  const { confirmDialog } = useDialog();

  const { tags } = useServiceOperations();

  const [initialTasks, setInitialTasks] = React.useState<ITagsTasks[]>([]);

  const [tagTasks, setTagTasks] = React.useState<ITagsTasks[]>([]);

  const { isLoading: isLoadingGroupTypes, data: groupTypes } = useQuery<ITaskGroup[] | undefined>({
    queryKey: ['searchGroupTypes'],
    queryFn: () => configTaskGroupService.getAllTaskGroups(),
    refetchOnWindowFocus: false
  });

  const [currentId, setCurrentId] = React.useState<number | undefined>(current?.id);

  const [currentStep, setCurrentStep] = React.useState(readonly ? 3 : 1);

  const [currentOcurrence, setCurrentOcurrence] = React.useState<IOcurrence | undefined>(undefined);

  const hasChangedOrder = () => {
    const localInitialTasks = [...initialTasks].sort((a, b) => a.number - b.number);
    const localTagTasks = [...tagTasks].sort((a, b) => a.number - b.number);
    const hasChanged = localInitialTasks.some((task, index) => task.taskId !== localTagTasks[index].taskId);
    return hasChanged;
  };

  const handleSave = async () => {
    const hasChanged = hasChangedOrder();
    if (hasChanged) {
      await Promise.all(
        tagTasks.map(async (task, index) => {
          await TagsService.deleteTagsStep({
            taskId: task.taskId,
            tagId: currentId as number
          });
        })
      );
    }
    await Promise.all(
      tagTasks.map(async (task, index) => {
        await TagsService.createTagsStep({
          sequence: task?.number ?? task.sequence,
          taskId: task.taskId,
          tagId: currentId as number
        });
      })
    );
  };

  async function onSubmit(data: any) {
    if (currentStep === 1) {
      if (currentId) {
        await TagsService.updateTags({
          ...data,
          id: currentId
        });
        setCurrentStep(2);
        return;
      }
      data.customerId = 1;
      const response = await TagsService.createTags(data);
      setCurrentId(response.data.id);
      setCurrentStep(2);
      return;
    }
    if (currentStep === 2) {
      await handleSave();
      tags.refetch();
      onClose();
    }
  }
  const schema = Yup.object(
    currentStep === 1
      ? {
          description: Yup.string().required('Nome é obrigatório'),
          uid: Yup.string().required('UID é obrigatório'),
          hwid: Yup.string().required('HWID é obrigatório'),
          mode: Yup.string().required('Modo é obrigatório'),
          status: Yup.string().required('Status é obrigatório'),
          tagTypeId: Yup.string().required('Tipo é obrigatório'),
          localization: Yup.string().required('Local é obrigatório')
        }
      : currentStep === 2
        ? {}
        : {}
  );
  type FormFields = Yup.InferType<typeof schema>;
  const methods = useForm<FormFields>({
    resolver: yupResolver(schema)
  });

  const steps = [
    {
      name: 'Procedimento',
      value: 1
    },
    {
      name: 'Tarefas',
      value: 2
    }
  ];

  const validation = Yup.object({
    taskId: Yup.number().required('Selecione uma tarefa')
  });

  const methodsTaskAdd = useForm<{ taskId?: number }>({
    resolver: yupResolver(validation)
  });

  const [isAddingTask, setIsAddingTask] = React.useState(false);

  const [inputValue, setInputValue] = React.useState('');

  const tasks = useQuery<ITask[] | undefined>({
    queryKey: ['searchTasks'],
    queryFn: () => TagsService.getAvailableTasks(currentId),
    refetchOnWindowFocus: false,
    enabled: inputValue.length > 1 && currentId !== undefined
  });

  const onSubmitTask = (data: any) => {
    // TagsService.createTagsStep({
    //   sequence: tagTasks.length + 1,
    //   taskId: data.taskId,
    //   tagId: currentId
    // })
    setTagTasks([
      ...tagTasks,
      {
        id: Math.random(),
        sequence: tagTasks.length + 1,
        number: tagTasks.length + 1,
        taskId: data.taskId,
        tagId: currentId,
        task: tasks.data?.find(task => task.id === data.taskId) as any,
        tagName: methods.getValues('description')
      }
    ]);
    setIsAddingTask(false);
  };

  const fetchTagsTasks = async () => {
    if (!methods.getValues('uid') || methods.getValues('uid') === '') return;

    const response = await TagsService.getTagsSteps(methods.getValues('uid'));
    const filteredResponse = response
      .filter((step: ITagsTasks) => step.tagId === currentId)
      .map((step: ITagsTasks) => {
        return {
          ...step,
          id: Math.random(),
          taskId: step.task.id,
          number: step.sequence
        };
      })
      .sort((a, b) => a.sequence - b.sequence);
    setInitialTasks(filteredResponse);
    setTagTasks(filteredResponse);
  };

  React.useEffect(() => {
    if (!isOpen) return;
    if (current) {
      setCurrentId(current.id);
      methods.reset({
        description: current.description,
        uid: current.uid,
        hwid: current.hwid,
        mode: current.mode,
        status: current.status,
        tagTypeId: current.tagTypeId,
        localization: current.localization
      });
      fetchTagsTasks();
      return;
    }
    methods.reset();
    setCurrentId(undefined);
  }, [current, isOpen, methods]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      methods={methods}
      title={current ? (readonly ? current.description : 'Editar Procedimento') : 'Novo Procedimento'}
      width="1000px"
      onSubmit={readonly ? undefined : () => methods.handleSubmit(onSubmit)()}
      SubmitText={currentStep === 2 ? 'Salvar' : 'Próximo'}
    >
      {!readonly && <Stepper steps={steps} currentStep={currentStep} />}
      <Form onSubmit={data => onSubmit(data as FormFields)} className="flex flex-col gap-4 pb-4" {...methods}>
        {currentStep === 1 && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <Input name="description" label="Nome" />
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-between w-full">
                <Input name="uid" label="UID" />
                <Input name="hwid" label="HWID" />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-between">
              <Input name="localization" label="Local" />
              <Dropdown
                name="tagTypeId"
                label="Tipo"
                options={tags.types.map(type => ({
                  label: type.description,
                  value: type.id
                }))}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6  items-center justify-between">
              <Dropdown
                name="mode"
                label="Modo"
                options={[
                  {
                    label: 'Passivo',
                    value: '1'
                  },
                  {
                    label: 'Ativo',
                    value: '1'
                  }
                ]}
              />
              <Dropdown
                name="status"
                label="Status"
                options={[
                  {
                    label: 'Ativo',
                    value: '0'
                  },
                  {
                    label: 'Inativo',
                    value: '1'
                  }
                ]}
              />
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-end w-full gap-4"></div>
            <OrdenableTable
              rows={tagTasks}
              // setData={setTagTasks}
              onChangeOrder={newData => {
                setTagTasks(newData);
              }}
              actions={[
                {
                  icon: <DeleteOutline />,
                  label: 'Excluir',
                  onClick: row => {
                    confirmDialog({
                      title: 'Excluir passo',
                      message: 'Deseja realmente excluir este passo?',
                      onConfirm: () => {
                        setTagTasks(tagTasks.filter(step => step.sequence !== row.sequence));
                      }
                    });
                  }
                }
              ]}
              columns={[
                {
                  key: 'number',
                  label: 'Número'
                },
                {
                  key: 'task',
                  label: 'Nome',
                  Formatter: task => task?.name ?? ''
                },
                {
                  key: 'task',
                  label: 'Descrição',
                  Formatter: task => task?.taskGroup?.name ?? ''
                }
              ]}
            />
            {isAddingTask ? (
              <div>
                <div className="flex flex-row gap-4 items-end w-full">
                  <div className="flex flex-col gap-4 w-full">
                    <AutoComplete
                      label="Tarefa"
                      options={tasks.data || []}
                      onSelect={value => {
                        methodsTaskAdd.setValue('taskId', value.id);
                      }}
                      inputValue={inputValue}
                      inputOnChange={value => {
                        setInputValue(value);
                      }}
                    />
                  </div>
                  <Button
                    onClick={() => {
                      if (methodsTaskAdd.getValues('taskId')) {
                        methodsTaskAdd.handleSubmit(onSubmitTask)();
                        setIsAddingTask(false);
                      }
                    }}
                    className="p-4 text-sm h-10 max-h-9"
                  >
                    <Add />
                  </Button>
                </div>
              </div>
            ) : (
              <p
                className="flex items-center gap-4 cursor-pointer text-base-7 underline"
                onClick={() => {
                  setIsAddingTask(true);
                }}
              >
                <Add />
                Adicionar nova Tarefa
              </p>
            )}
          </div>
        )}
      </Form>
    </Modal>
  );
}
