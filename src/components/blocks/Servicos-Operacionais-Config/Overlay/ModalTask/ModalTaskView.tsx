import { Modal } from '@/components/ui/modal';
import { EtipoPermissao, ICompany, ICompanyUnity, IEquipment, IEquipmentClassification, IEquipmentType, IPermissions, IRole } from '@/types';
import * as Yup from 'yup';
import { Form } from '@/components/form/Form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input } from '@/components/ui';
import { Dropdown } from '@/components/form';
import React, { useEffect } from 'react';
import { useAdministrator } from '@/contexts/AdministrationProvider';
import { masks, regex } from '@/utils';
import { CustomSwitch } from '@/components/ui/switch';
import { Stepper } from '@/components/ui/stepper';
import { useQuery } from '@tanstack/react-query';
import { equipmentClassificationService, equipmentService, equipmentTypeService } from '@/services/Administrator/equipmentService';
import { Add, DeleteOutline, EditOutlined } from '@mui/icons-material';
import { ITask, ITaskSteps } from '@/types/models/ServiceOrder/ITask';
import { configTaskGroupService } from '@/services/OperationalService/configTaskGroupService';
import { ITaskGroup } from '@/types/models/ServiceOrder/ITaskGroup';
import { useModal } from '@/hooks';
import { ModalOcorrencia } from './ModalOcorrencia';
import { IOcurrence } from '@/types/models/Ocurrences/IOcurrence';
import CustomizedGroupAccordion from '@/components/blocks/Ordens-Servicos/Tabs/customizedGroupAccordeon';
import { OrdenableTable } from './OrdenableTable';
import { ModalNewStep } from './newModalStep';
import { configTaskService } from '@/services/OperationalService/configTasks';
import { useDialog } from '@/hooks/use-dialog';
import { AutoComplete } from '@/components/ui/autocomplete';
import { ResourcesStep } from './ResourcesStep';
import { BaseTable } from '@/components/table/BaseTable';
import { ocurrenceService } from '@/services/Ocurrences';

export function ModalTaskView({
  isOpen,
  onClose,
  current,
  readonly = true
}: {
  isOpen: boolean;
  onClose: () => void;
  current?: ITask;
  readonly?: boolean;
}) {
  const { isLoading: isLoadingGroupTypes, data: groupTypes } = useQuery<ITaskGroup[] | undefined>({
    queryKey: ['searchGroupTypes'],
    queryFn: () => configTaskGroupService.getAllTaskGroups(),
    refetchOnWindowFocus: false
  });

  const [currentOcurrence, setCurrentOcurrence] = React.useState<IOcurrence | undefined>(undefined);

  const [currentTaskSteps, setCurrentTaskSteps] = React.useState<ITaskSteps>();

  const schema = Yup.object({
    code: Yup.string().required('O código é obrigatório'),
    name: Yup.string().required('O nome é obrigatório'),
    professionalsCount: Yup.string()
      .required('O número de profissionais é obrigatório')
      .matches(regex.NUMBER, 'O número de profissionais é inválido'),
    estimatedTime: Yup.string().required('O tempo estimado é obrigatório').matches(regex.NUMBER, 'O tempo estimado é inválido'),
    taskGroupId: Yup.number().required('O grupo de tarefas é obrigatório'),
    reviewTask: Yup.boolean(),
    taskRandom: Yup.boolean(),
    digitalSignature: Yup.boolean(),
    isOccurrenceIdIncomplete: Yup.string(),
    ocurrencyIdIncomplete: Yup.string(),
    resourceId: Yup.string().required('O recurso é obrigatório')
  });
  type FormFields = Yup.InferType<typeof schema>;
  const methods = useForm<FormFields>({
    resolver: yupResolver(schema)
  });

  const steps = [
    {
      name: 'Tarefa',
      value: 1
    },
    {
      name: 'Passos',
      value: 2
    },
    {
      name: 'Recursos',
      value: 3
    }
  ];

  const [isModalOcorrenciaOpen, openModalOcorrencia, closeModalOcorrencia] = useModal();

  const [isNewStepModalOpen, openNewStepModal, closeNewStepModal] = useModal();

  const generateOcurrence = methods.watch('isOccurrenceIdIncomplete');

  const [mockSteps, setMockSteps] = React.useState<ITaskSteps[]>([]);

  const tasksSteps = useQuery<ITaskSteps[] | undefined>({
    queryKey: ['searchTasksSteps', current?.id],
    queryFn: () => configTaskService.getTaskSteps(current),
    refetchOnWindowFocus: false,
    enabled: current?.id !== undefined
  });

  const fetchOcurrence = useQuery<IOcurrence | undefined>({
    queryKey: ['searchOcurrence', current?.occurrenceIdIncomplete],
    queryFn: () => ocurrenceService.getById(current?.occurrenceIdIncomplete),
    refetchOnWindowFocus: false,
    enabled: current?.occurrenceIdIncomplete !== undefined
  });

  React.useEffect(() => {
    if (!isOpen) return;
    if (current) {
      const resetObj = current as any;
      methods.reset({
        ...current,
        taskGroupId: current.taskGroupId,
        isOccurrenceIdIncomplete: !!current.occurrenceIdIncomplete,
        ocurrencyIdIncomplete: current.occurrenceIdIncomplete
      } as any);
      return;
    }
    methods.reset();
  }, [current, isOpen, methods]);

  useEffect(() => {
    if (!tasksSteps.data) return;
    setMockSteps(tasksSteps.data);
  }, [tasksSteps.data]);

  const resources = useQuery<
    Array<{
      id: number;
      taskId: number;
      classification: string;
      description: string;
    }>
  >({
    queryKey: ['getResources', current?.id],
    queryFn: () => configTaskService.getTaskResources(current),
    refetchOnWindowFocus: false,
    enabled: current?.id !== undefined
  });

  const tasksResourcesClassifications = useQuery<IEquipmentClassification[] | undefined>({
    queryKey: ['searchTasksResources'],
    queryFn: () => equipmentClassificationService.listEquipmentClassificationAsync(undefined, 0, 99),
    refetchOnWindowFocus: false
  });

  const [resourcesList, setResourcesList] = React.useState<
    Array<{
      id: number;
      taskId: number;
      classification: string;
      description: string;
      isAdding?: boolean;
    }>
  >([]);

  useEffect(() => {
    if (!resources.data) return;
    setResourcesList(resources.data);
  }, [resources.data]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} methods={methods} title={current?.name ?? 'Visualizar Tarefa'} width="1000px">
      <Form onSubmit={data => console.log(data)} className="flex flex-col gap-4 pb-4" {...methods}>
        <div className="flex flex-col gap-6">
          <div className="grid md:grid-cols-3 gap-6 ">
            <Input disabled={readonly} label="Código" name="code" required error={(methods.formState.errors as any)?.code} />

            <Input disabled={readonly} label="Nome" name="name" required error={(methods.formState.errors as any)?.name} />

            <Dropdown
              label="Tipo"
              name="taskGroupId"
              options={groupTypes?.map(t => ({ label: t.name, value: t.id })) ?? []}
              required
              disabled={readonly}
            />

            <Input
              disabled={readonly}
              label="Quantidade de profissionais"
              name="professionalsCount"
              required
              mask={masks.NUMBER}
              error={(methods.formState.errors as any)?.professionalsCount}
            />

            <Input
              disabled={readonly}
              label="Tempo estimado"
              name="estimatedTime"
              required
              mask={masks.NUMBER}
              error={(methods.formState.errors as any)?.estimatedTime}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between w-full">
            <CustomSwitch row label="Permitir revisão" className="!font-normal " name="reviewTask" disabled={readonly} />
            <CustomSwitch row className="!font-normal " label="Embaralhar passos" name="taskRandom" disabled={readonly} />
            <CustomSwitch row label="Gerar ocorrência ao cancelar" className="!font-normal " name="isOccurrenceIdIncomplete" disabled={readonly} />
            <CustomSwitch row label="Solicitar assinatura digital" className="!font-normal " name="digitalSignature" disabled={readonly} />
          </div>

          {(fetchOcurrence.data as any)?.length > 0 && (
            <CustomizedGroupAccordion filledSummary summary="Ocorrência">
              <div className="p-6 flex flex-col gap-4">
                <Input disabled={true} label={'ID ' + fetchOcurrence.data?.[0]?.id} defaultValue={fetchOcurrence.data?.[0]?.description} />
              </div>
            </CustomizedGroupAccordion>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex justify-end w-full gap-4"></div>
          <BaseTable
            rows={mockSteps}
            // setData={setMockSteps}
            columns={[
              {
                key: 'number',
                label: 'Número'
              },
              {
                key: 'description',
                label: 'Descrição'
              },
              // {
              //   key: 'type',
              //   label: 'Tipo'
              // },
              {
                key: 'development',
                label: 'Desenvolvimento'
              }
            ]}
          />
        </div>
        <div className="flex flex-col gap-4">
          {resourcesList &&
            resourcesList.map((resource, index) => (
              <div key={index} className="flex gap-4 items-center justify-between bg-base-2 border-base-3 border-[1px] px-4 py-2 rounded-lg">
                <p>{resource.description}</p>
                <p>{resource.classification}</p>
              </div>
            ))}
        </div>
      </Form>
    </Modal>
  );
}
