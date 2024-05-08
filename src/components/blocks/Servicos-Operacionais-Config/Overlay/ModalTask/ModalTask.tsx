import { Modal } from '@/components/ui/modal';
import { EtipoPermissao, ICompany, ICompanyUnity, IEquipment, IEquipmentClassification, IEquipmentType, IPermissions, IRole } from '@/types';
import * as Yup from "yup";
import { Form } from '@/components/form/Form'; 
import { set, useForm } from 'react-hook-form';
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
import { ocurrenceService } from '@/services/Ocurrences';


export function ModalTask({
  isOpen,
  onClose,
  current,
  readonly
} : {
  isOpen: boolean;
  onClose: () => void;
  current?: ITask;
  readonly?: boolean;
}
){
 
  const {confirmDialog} = useDialog();

  const { isLoading: isLoadingGroupTypes, data: groupTypes,
   } = useQuery<ITaskGroup[] | undefined>({
    queryKey: ['searchGroupTypes'],
    queryFn: () => configTaskGroupService.getAllTaskGroups(),
    refetchOnWindowFocus: false,
  });
   
  const [currentId, setCurrentId] = React.useState<number | undefined>(current?.id);
  
  const [resourcesList, setResourcesList] = React.useState<Array<{
    id: number;
    taskId: number;
    classification: string;
    description: string;
    isAdding?: boolean;
  }>>([]); 

  const [initialResources, setInitialResources] = React.useState<Array<{
    id: number;
    taskId: number;
    classification: string;
    description: string;
    isAdding?: boolean;
  }>>([]);

  const [currentStep, setCurrentStep] = React.useState(readonly ? 3 : 1);

  const [currentOcurrence, setCurrentOcurrence] = React.useState<IOcurrence | undefined>(undefined);

  const [currentTaskSteps, setCurrentTaskSteps] = React.useState<ITaskSteps>();

  const {
    openDialog
  } = useDialog();
  

  async function onSubmit(data: any){ 
    if(currentStep === 1){  
      setCurrentStep(2);
      return;
    }
    if(currentStep == 2){
      // await submitSteps();
      setCurrentStep(currentStep + 1);
      return;
    }
    let currentId = current?.id ?? undefined;

    try{ 
      const newData : ITask = {
          code: data.code,
          name: data.name,
          professionalsCount: +(data.professionalsCount),
          estimatedTime: +(data.estimatedTime),
        taskGroupId: +(data.taskGroupId),
        reviewTask: data.reviewTask,
        taskRandom: data.taskRandom,
        digitalSignature: data.digitalSignature,
        occurrenceIdIncomplete: data.isOccurrenceIdIncomplete ? currentOcurrence?.id : undefined,
      }
      if(currentId){
        newData.id = currentId;
        await configTaskService.updateTask(newData);  
      } else {
        const newApiData = await configTaskService.createTask(newData);
        if(!newApiData?.data?.id)
          return;
        currentId = newApiData?.data?.id;
        setCurrentId(newApiData?.data?.id);  
      }
      
    } catch(e){
      openDialog({
        title: 'Erro ao criar tarefa',
        onConfirm: () => {},
        onConfirmText: 'Ok',
        message: e.message
      })
    }
    debugger
    await submitSteps(currentId);

    // const resourcesToSend is the difference between the initial resources and the current resources
    const resourcesToSend = resourcesList.filter((resource) => {
      return !initialResources.find((r) => r.id === resource.id);
    }).map((resource) => {
      return {
        resourceId: resource.id,
        taskId: currentId,
      }
    });
    
    const resourcesToDelete = initialResources.filter((resource) => {
      return !resourcesList.find((r) => r.id === resource.id);
    }).map((resource) => {
      return {
        resourceId: resource.id,
        taskId: currentId,
      }
    });



    try{
      await Promise.all(resourcesToDelete.map(async (resource) => {
        await configTaskService.removeTaskResource(resource.taskId, resource.resourceId);
      }))

      await Promise.all(resourcesToSend.map(async (resource) => {
        await configTaskService.createTasksResources(resource.taskId, resource.resourceId);
      }))
    } catch(e){
      openDialog({
        title: 'Erro ao criar recursos',
        onConfirm: () => {},
        onConfirmText: 'Ok',
        message: e.message
      })
    } finally{

    }
    
    onClose(); 
  

  }
  const schema = Yup.object(
    currentStep === 1 ?
    {
      code: Yup.string().required('O código é obrigatório'),
      name: Yup.string().required('O nome é obrigatório'),
      professionalsCount: Yup.string().required('O número de profissionais é obrigatório').matches(regex.NUMBER, 'O número de profissionais é inválido'),
      estimatedTime: Yup.string().required('O tempo estimado é obrigatório').matches(regex.NUMBER, 'O tempo estimado é inválido'),
      taskGroupId: Yup.number().required('O grupo de tarefas é obrigatório'),
      reviewTask: Yup.boolean(),
      taskRandom: Yup.boolean(),
      digitalSignature: Yup.boolean(),
      isOccurrenceIdIncomplete: Yup.string().nullable(),
      ocurrencyIdIncomplete: Yup.string().nullable(),
    } : currentStep === 2 ? 
    {

    } : {
      
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
  ]

  const [isModalOcorrenciaOpen, openModalOcorrencia, closeModalOcorrencia] = useModal();

  const [isNewStepModalOpen, openNewStepModal, closeNewStepModal] = useModal();

  const generateOcurrence = methods.watch('isOccurrenceIdIncomplete');

  const [mockSteps, setMockSteps] = React.useState<ITaskSteps[]>( []); 

  const tasksSteps = useQuery<ITaskSteps[] | undefined>({
    queryKey: ['searchTasksSteps', current?.id],
    queryFn: () => configTaskService.getTaskSteps(current),
    refetchOnWindowFocus: false,
    enabled: current?.id !== undefined,
  });


  async function fetchOcurrence(id?: any){
    if(!id)
      return;
    const response = await ocurrenceService.getById(id);
    setCurrentOcurrence(response[0]);
  }
  
  React.useEffect(() => {
    if(!isOpen)
      return;
    if(current){
      setCurrentId(current.id);
      const resetObj = current as any
      if(current.occurrenceIdIncomplete){
        fetchOcurrence(current.occurrenceIdIncomplete);
      }
      methods.reset({
        ...current,
        taskGroupId: current.taskGroup.id,
        isOccurrenceIdIncomplete: !!current.occurrenceIdIncomplete,
        ocurrencyIdIncomplete: current.occurrenceIdIncomplete, 
      });
      return;
    }
    methods.reset();
    setCurrentId(undefined);
  }, [current, isOpen, methods])

  useEffect(() => {
    if(!tasksSteps.data)
      return;
    tasksSteps.data.forEach((step) => {
      (step as any).draggable = Math.floor(Math.random() * 1000);
    })
    setMockSteps(tasksSteps.data);
  }, [tasksSteps.data])



  const resources = useQuery<Array<{
    id: number;
    taskId: number;
    classification: string;
    description: string;
  }>>({
    queryKey: ['getResources', current?.id],
    queryFn: () => configTaskService.getTaskResources(current),
    refetchOnWindowFocus: false,
    enabled: current?.id !== undefined,
  });

  
  const tasksResourcesClassifications = useQuery<IEquipmentClassification[] | undefined>({
    queryKey: ['searchTasksResources'],
    queryFn: () => equipmentClassificationService.listEquipmentClassificationAsync(
      undefined,
      0,
      99
    ),
    refetchOnWindowFocus: false,
  });

  const taskTypes = useQuery({
    queryKey: ['taskTypes'],
    queryFn: configTaskService.getTypes,
    refetchOnWindowFocus: false,
  }); 


  useEffect(() => {
    if(!resources.data)
      return;
    setResourcesList(resources.data);
    setInitialResources(resources.data);
  }, [resources.data])

  async function submitSteps(currentId: string | number){
    await Promise.all(mockSteps.map(async (step) => {
      const dataToSend = {
        ...step,
        taskId: currentId,
      } as any
      if(step.id){
        await configTaskService.updateTaskStep(currentId, dataToSend);
        return;
      }
      await configTaskService.createTaskStep(currentId, dataToSend);
      })
    )
  }

  async function onSubmitStep(data: ITaskSteps){ 
    debugger

    if(data.id || data.draggable){
      try{
        const newData = {
          ...currentTaskSteps,
          ...data
        }  
        // await configTaskService.updateTaskStep(currentId, newData); 
        const index = mockSteps.findIndex((s) => s.id === currentTaskSteps.id || s.draggable === currentTaskSteps.draggable);
        const updatedMockSteps = [...mockSteps];
        updatedMockSteps[index] = newData;
        setMockSteps(updatedMockSteps);
        return;
      } catch(e){
        openDialog({
          title: 'Erro ao atualizar passo',
          onConfirm: () => {},
          onConfirmText: 'Ok',
          message: e.message
        })
      } finally{
        return;
      }
    }
    try{
      // const dataToSend = {
      //   ...data,
      //   taskId: currentId,
      // }
      // const response = await configTaskService.createTaskStep(currentId, dataToSend);
      // data.id = response.data.id;
      const random = Math.floor(Math.random() * 1000);
      (data as any).draggable = random;
      setMockSteps([...mockSteps, data]);
    } catch(e){
      openDialog({
        title: 'Erro ao criar passo',
        onConfirm: () => {},
        onConfirmText: 'Ok',
        message: e.message
      })
    }
  }


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      methods={methods}
      title={
        current ? readonly ? current.name : 'Editar Tarefa' : 'Nova Tarefa'
      }
      width='1000px'
      onSubmit={readonly ? undefined : () => methods.handleSubmit(onSubmit)()}
      SubmitText={
        currentStep === 3 ? 'Salvar' : 'Próximo'
      }
    >
      {
        !readonly && 
        <Stepper
          steps={steps}
          currentStep={currentStep}
        /> 
      }
       <Form onSubmit={(data) => onSubmit(data as FormFields)}
            className='flex flex-col gap-4 pb-4'
            {...methods}
      > 

        {
          currentStep === 1 && <div
          className='flex flex-col gap-6'
        > 
          <div
            className='grid md:grid-cols-3 gap-6 '
          >
            <Input
              disabled={readonly}
              label='Código'
              name='code'
              required
              error={(methods.formState.errors as any)?.code}
            />

            <Input
              disabled={readonly}
              label='Nome'
              name='name'
              required
              error={(methods.formState.errors as any)?.name}
            />
 
            <Dropdown
              label='Tipo'
              name='taskGroupId' 
              options={groupTypes?.map(t => ({label: t.name, value: t.id})) ?? []}
              required
              disabled={readonly}
            /> 

            <Input
              disabled={readonly}
              label='Quantidade de profissionais'
              name='professionalsCount'
              required
              mask={masks.NUMBER}
              error={(methods.formState.errors as any)?.professionalsCount}
            />

            <Input
              disabled={readonly}
              label='Tempo estimado'
              name='estimatedTime'
              required
              mask={masks.NUMBER}
              error={(methods.formState.errors as any)?.estimatedTime}
            />

          </div>

          <div
            className='flex flex-col md:flex-row gap-4 md:items-center justify-between w-full'>
            <CustomSwitch
              row
              label='Permitir revisão'
              className='!font-normal '
              name='reviewTask'
              disabled={readonly}
            />
            <CustomSwitch
              row
              className='!font-normal '
              label='Embaralhar passos'
              name='taskRandom'
              disabled={readonly}
            />
            <CustomSwitch
              row
              label='Gerar ocorrência ao cancelar'
              className='!font-normal '
              name='isOccurrenceIdIncomplete'
              disabled={readonly}
            />
            <CustomSwitch
              row
              label='Solicitar assinatura digital'
              className='!font-normal '
              name='digitalSignature'
              disabled={readonly}
            />
          </div>

          {currentOcurrence && generateOcurrence && <CustomizedGroupAccordion
          filledSummary
          summary='Ocorrência'	
          > 
          <div
            className='p-6 flex flex-col gap-4'
          >
            <Input
              disabled={true}
              label={'ID ' + currentOcurrence?.id}
              defaultValue={
                currentOcurrence?.description
              } 
            />
            <p
              className='text-primary-700 underline cursor-pointer'
              onClick={openModalOcorrencia}
            >
              Editar
            </p>
          </div>
          </CustomizedGroupAccordion>
          }
          </div>
        }
        {
          currentStep === 2 && <div
          className='flex flex-col gap-4'
        >   
          <div
            className='flex justify-end w-full gap-4'
          >
            <Button
              onClick={openNewStepModal}
            >
              <Add/>
              Novo Passo
            </Button>
          </div>
            <OrdenableTable
              rows={mockSteps}
              // setData={setMockSteps}
              onChangeOrder={
                (newData) => {
                  setMockSteps(newData);
                }
              }
              actions={[{
                icon: <EditOutlined/>,
                label: 'Editar',
                onClick: (row) => {
                  setCurrentTaskSteps(row);
                  openNewStepModal();
                }
                },
                {
                  icon: <DeleteOutline/>,
                  label: 'Excluir',
                  onClick: (row) => {
                    confirmDialog({
                      title: 'Excluir passo',
                      message: 'Deseja realmente excluir este passo?',
                      onConfirm: () => {
                        setMockSteps(mockSteps.filter((step) => step.number !== row.number));
                      },
                      onConfirmText: 'Excluir'
                    })
                  }
                }
              ]}
              columns={[
                {
                  key: 'number',
                  label: 'Número',
                },
                {
                  key: 'taskTypeId',
                  label: 'Tipo',
                  Formatter: (taskTypeId) => {
                    return  taskTypes.data?.find((t: any) => t.id == taskTypeId)?.description
                  }
                },
                {
                  key: 'taskTypeComplement',
                  label: 'Descrição', 
                },
                // {
                //   key: 'type',
                //   label: 'Tipo' 
                // },
                {
                  key: 'development',
                  label: 'Desenvolvimento',
                },
              ]}
            /> 
          </div>
        } 
        {
          currentStep === 3 && <div
          className='flex flex-col gap-4'>  
            {
              resourcesList && resourcesList.map((resource, index) => (
                <ResourcesStep
                  tasksResources={tasksResourcesClassifications}
                  key={index}
                  currentEquipment={resource as any}
                  setCurrentEquipment={(equip) => {
                    const newResources = resourcesList;
                    newResources[index] = equip as any;
                    setResourcesList([...newResources]);
                  }}
                />
              ))
            } 
            <p
              className='text-base-7 underline cursor-pointer flex items-center gap-1'
              onClick={() => {
                setResourcesList([...resourcesList, {
                  id: 0,
                  taskId: current?.id ?? 0,
                  classification: '',
                  description: '',
                  isAdding:true
                }])
              }}
            >
              <Add/>
              Adicionar recurso
            </p>
          </div>
        }

      </Form>
      <ModalOcorrencia
        isOpen={
          isModalOcorrenciaOpen || (generateOcurrence && generateOcurrence !== '' && !currentOcurrence)
        }
        onClose={
          () => {
            closeModalOcorrencia()
            if(!currentOcurrence)
              methods.resetField('isOccurrenceIdIncomplete')
          }
        }
        onSubmit={
          (data: IOcurrence) => {
            setCurrentOcurrence(data);
            methods.setValue('isOccurrenceIdIncomplete', data.id as any);
            // methods.setValue('ocurrencyIdIncomplete', data.ocurrencyIdIncomplete);
            // methods.setValue('isOccurrenceIdIncomplete', data.isOccurrenceIdIncomplete);
            closeModalOcorrencia();
          }
        }
      />
      {
        isNewStepModalOpen && <ModalNewStep
          isOpen={isNewStepModalOpen}
          onClose={
            () => {
              setCurrentTaskSteps(undefined);
              closeNewStepModal();
            }
          }
          current={currentTaskSteps}
          onSubmit={
            (step) => {
              onSubmitStep(step);
              closeNewStepModal();
            }
          }
        />
      }


    </Modal>
  )
}