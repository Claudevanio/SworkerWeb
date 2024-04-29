import { Modal } from '@/components/ui/modal'; 
import * as Yup from "yup";
import { Form } from '@/components/form/Form'; 
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CheckBox, Input } from '@/components/ui';
import { Dropdown } from '@/components/form';
import React, { useEffect } from 'react'; 
import { IOcurrence } from '@/types/models/Ocurrences/IOcurrence'; 
import { ITaskSteps, ITaskType } from '@/types/models/ServiceOrder/ITask';
import { masks, regex } from '@/utils';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { configTaskService } from '@/services/OperationalService/configTasks';
import CustomizedGroupAccordion from '@/components/blocks/Ordens-Servicos/Tabs/customizedGroupAccordeon';
import { AutoComplete } from '@/components/ui/autocomplete';

const schema = Yup.object({
  number: Yup.string().required('Número é obrigatório').matches(regex.NUMBER, 'Número inválido'),
  taskTypeId: Yup.string().required('Tipo é obrigatório'),
  subTaskId: Yup.string().required('Subtipo é obrigatório'),
  taskTypeComplement: Yup.string(),
  development: Yup.string(),
  risks: Yup.string(),
  control: Yup.string(),
  notes: Yup.string(), 
  alternatives: Yup.array().of(Yup.object({
    hasImage: Yup.boolean(),
    hasCancel: Yup.boolean(),
    alternative: Yup.object({
      description: Yup.string(),
      id: Yup.number()
    })
  })) 
});

type FormFields = Yup.InferType<typeof schema>;

const FieldAccordion = ({label, name}:
  {
    label: string,
    name: keyof FormFields
  }
) => (
  <Accordion
    defaultExpanded={false}
    className='shadow-none gap-0'
  >
    <AccordionSummary
      expandIcon={<KeyboardArrowDown />}
      className='font-semibold font-base text-base-6 py-0 px-0 !min-h-0 !m-0'
      sx={{
        '.MuiAccordionSummary-content': {
          margin: 0
        },
        '.Mui-expanded':{
          minHeight: 0
        }
      }}
    >
      {label}
    </AccordionSummary>
    <AccordionDetails
      className='px-0'
    >
      <Input
        label={''}
        name={name}
        multiline
        minRows={3}
      />
    </AccordionDetails>
  </Accordion>
) 

export function ModalNewStep({
  isOpen,
  onClose,
  current,
  readonly,
  onSubmit
} : {
  isOpen: boolean;
  onClose: () => void;
  current?: ITaskSteps;
  readonly?: boolean;
  onSubmit: (data: ITaskSteps) => void;
}
){
 
  const methods = useForm<FormFields>({
    resolver: yupResolver(schema),
    defaultValues: { 
    }
  });
 

  React.useEffect(() => {
    debugger
    if(!isOpen)
      return;
    if(current){
      methods.reset({
        control: current.control,
        development: current.development,
        notes: current.notes,
        number: current.number,
        risks: current.risks,
        taskTypeId: current.taskTypeId as any,
        taskTypeComplement: current.taskTypeComplement,
        subTaskId: current.subTaskId as any,
      });
      return;
    }
    methods.reset();
  }, [current, isOpen, methods])
 
  
  async function onSubmitForm(data: any){  
    if(current?.id)
      data.id = current.id;
    onSubmit(data); 
  }

  const textAreaFields = [
    {
      label: 'Desenvolvimento',
      name: 'development'
    },
    {
      label: 'Riscos',
      name: 'risks'
    },
    {
      label: 'Controle',
      name: 'control'
    },
    {
      label: 'Notas',
      name: 'notes'
    },
    {
      label: 'Descrição do passo',
      name: 'taskTypeComplement'
    }
  ]

  const taskTypes = useQuery({
    queryKey: ['taskTypes'],
    queryFn: configTaskService.getTypes,
    refetchOnWindowFocus: false,
  }); 

  const typeId = methods.watch('taskTypeId');

  const isQuestion = taskTypes.data?.find((t: any) => t.id === typeId)?.description === 'Questão' ?? false;
  const alternatives = methods.watch('alternatives');

  useEffect(() => {
    if(!isQuestion)
      return;
    methods.setValue('alternatives', [{alternative: {description: '', id: 0}, hasImage: false, hasCancel: false}])
  }, [isQuestion])

  const [term, setTerm] = React.useState('');

  const {
    data: serchedTasks
  } = useQuery({
    queryKey: ['tasks', term],
    queryFn: () => configTaskService.listTaskAsync({
      pageSize: 6,
      currentPage: 0,
      name: term
    }),
    refetchOnWindowFocus: false,
    enabled: term.length > 2
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        current ? readonly ? current?.id + '' : 'Editar Passo' : 'Novo Passo'
      }
      width='900px'
      onSubmit={readonly ? undefined : () => methods.handleSubmit(onSubmitForm)()}
    >
       <Form onSubmit={(data) => onSubmitForm(data as FormFields)}
            className='flex flex-col gap-4 pb-4'
            {...methods}
      >
        <div
          className='flex flex-col md:flex-row gap-4 justify-between w-full'
        >
            <Input
              label='Número'
              mask={masks.NUMBER}
              name='number'
              required
            />
            <Dropdown
              label='Tipo'
              name='taskTypeId'
              options={
                (taskTypes.data ?? []).map((t:ITaskType) => ({label: t.description, value: t.id})) 
               }
              required
            />
            <Dropdown
              label='Subtipo'
              name='subTaskId'
              options={
                (taskTypes.data ?? []).map((t:ITaskType) => ({label: t.description, value: t.id})) 
               } 
            />
        </div>
        <div
          className='flex flex-col gap-4'
        >
          {
            textAreaFields.map((field) => (
              <div
                key={field.name}
                className='w-full'
              >
                <FieldAccordion 
                  label={field.label}
                  name={field.name as keyof FormFields}
                />
              </div>
            ))
          }
        </div>

        {
          isQuestion && (
            <div
              className='flex flex-col gap-4'
            >
              {
                alternatives?.map((alternative: any, index: number) => (
                  <CustomizedGroupAccordion
                    summary='Alternativa'
                    key={index} 
                    filledSummary
                    >
                      <div
                        className='flex gap-4'
                      >
                         <Controller
                          control={methods.control}
                          name={`alternatives.${index}.hasImage`}
                          render={({field}) => (
                            <CheckBox
                              label='Exige foto'
                              variant='secondary'
                              value={field.value}
                              onChange={() => field.onChange(!field.value)}
                            />
                          )}
                         />

                          <Controller
                            control={methods.control}
                            name={`alternatives.${index}.hasCancel`}
                            render={({field}) => (
                              <CheckBox
                                label='Finaliza APR'
                                variant='secondary'
                                value={field.value}
                                onChange={() => field.onChange(!field.value)}
                              />
                            )}
                          />

                          <Controller
                            control={methods.control}
                            name={`alternatives.${index}.alternative.description`}
                            render={({field}) => (
                              <CheckBox
                                label='Finaliza APR após execução da tarefa adaptativa'
                                variant='secondary'
                                value={field.value}
                                onChange={() => field.onChange(!field.value)}
                              />
                            )}
                          />

                      </div>
                    <div
                      className='flex flex-col gap-4'
                    >
                      {
                        alternative.alternative.description && alternative.alternative.description !== '' && (
                          <AutoComplete 
                            inputOnChange={(value) => setTerm(value)}
                            inputValue={term}
                            onSelect={
                              (value) => {
                                methods.setValue(`alternatives[${index}].alternative` as keyof FormFields, value.id);
                              }
                            }
                            style={{width: '100%'}}
                            options={
                              serchedTasks?.items.map((t: any) => ({name: t.name, value: t.id})) ?? []
                            } 
                          />
                        )
                      }
                    </div>
                  </CustomizedGroupAccordion>
                ))
              }
            </div>
          )
        }

      </Form>



    </Modal>
  )
}