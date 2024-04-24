import { Modal } from '@/components/ui/modal';
import { EtipoPermissao, ICompany, ICompanyUnity, IEquipment, IEquipmentType, IPermissions, IRole } from '@/types';
import * as Yup from "yup";
import { Form } from '@/components/form/Form'; 
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '@/components/ui';
import { Dropdown } from '@/components/form';
import React from 'react';
import { useAdministrator } from '@/contexts/AdministrationProvider';
import { masks, regex } from '@/utils';
import { CustomSwitch } from '@/components/ui/switch';
import { Stepper } from '@/components/ui/stepper';
import { useQuery } from '@tanstack/react-query';
import { equipmentClassificationService, equipmentTypeService } from '@/services/Administrator/equipmentService';
import { Add } from '@mui/icons-material';


export function ModalEquipments({
  isOpen,
  onClose,
  current,
  readonly
} : {
  isOpen: boolean;
  onClose: () => void;
  current?: IEquipment;
  readonly?: boolean;
}
){
 

  const [searchType, setSearchType] = React.useState('');

  const { isLoading: isLoadingEquipments, data: types,
   } = useQuery<IEquipmentType[] | undefined>({
    queryKey: ['searchEquipments', searchType],
    queryFn: () => equipmentTypeService.listEquipmentTypeAsync(searchType) as any,
    refetchOnWindowFocus: false,
  });

  // repeat it to classification
  const [searchClassification, setSearchClassification] = React.useState('');

  const { isLoading: isLoadingClassification, data: classifications,
   } = useQuery<IEquipmentType[] | undefined>({
    queryKey: ['searchClassification', searchClassification],
    queryFn: () => equipmentClassificationService.listEquipmentClassificationAsync(searchClassification) as any,
    refetchOnWindowFocus: false,
  });


  const {equipments} = useAdministrator();

  async function onSubmit(data: any){ 
    if(currentStep < 3){
      setCurrentStep(currentStep + 1);
      return;
    }

    if(isAddingType){
      const newType = await equipmentTypeService.addEquipmentTypeAsync({
        description: data.addType,
        code: ''
      }) as any
      data.typeId = newType?.data?.id; 
    }
     
    if(isAddingClassification){
      const newClassification = await equipmentClassificationService.addEquipmentClassificationAsync({
        description: data.addClassification,
        code: '',
        name: data.addClassification,
        typeId: data.typeId
      }) as any
      data.classificationId = newClassification?.data?.id;
    }
    
    const newData : IEquipment = {
      ...data,
      status: true,
      classificationId: +(data as any).classificationId,
    } as any
    await equipments.create(newData);    
    
    onClose(); 
  }
  const [currentStep, setCurrentStep] = React.useState(readonly ? 3 : 1);

  const [isAddingType, setIsAddingType] = React.useState(false);
  const [isAddingClassification, setIsAddingClassification] = React.useState(false);

  
  const schema = Yup.object(
    currentStep === 1 ?
    isAddingType ?
    {
      addType: Yup.string().required('O tipo é obrigatório'),
    } : {
      typeId: Yup.string().required('O tipo é obrigatório'),
      addType: Yup.string(),
    } : currentStep === 2 ? 
    isAddingClassification ? {
      addClassification: Yup.string().required('A classificação é obrigatória'),
    } : {
      classificationId: Yup.string().required('A categoria é obrigatória'),
    } : { 
    model: Yup.string().required('O modelo é obrigatório'),
    typeId: Yup.string(),
    classificationId: Yup.string(),
    uid: Yup.string().required('O UID é obrigatório'),
    hwid: Yup.string().required('O HWID é obrigatório'),
    manufacturer: Yup.string().required('O fabricante é obrigatório'),
    brand: Yup.string().required('A marca é obrigatória'),
    manufactureDate: Yup.string().required('A data de fabricação é obrigatória').matches(regex.DATE, 'Data inválida'), 
    manualFile: Yup.string(), 
    addType: Yup.string(),
    addClassification: Yup.string(),
  });
  type FormFields = Yup.InferType<typeof schema>; 
  const methods = useForm<FormFields>({
    resolver: yupResolver(schema)
  });

  React.useEffect(() => {
    if(!isOpen)
      return;
    if(current){
      const resetObj = current as any
      methods.reset({
        ...current,
        typeId: resetObj?.classification?.type?.id,
        classificationId: resetObj?.classification.id,
        manufactureDate: resetObj.manufactureDate.split('T')[0],

      });
      return;
    }
    methods.reset();
  }, [current, isOpen, methods])


  const steps = [
    {
      name: 'Tipo',
      value: 1
    },
    {
      name: 'Classificação',
      value: 2
    },
    {
      name: 'Equipamento',
      value: 3
    }
  ]


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      methods={methods}
      title={
        current ? readonly ? current.model : 'Editar Equipamentos' : 'Novo Equipamento'
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
          className='flex flex-col gap-4'
        >
          <Dropdown
            label='Tipo'
            name='typeId' 
            options={types?.map(t => ({label: t.description, value: t.id})) ?? []}
            required
            disabled={readonly || isAddingType}
          />
          <p
            onClick={() => setIsAddingType(true)}
            className='text-primary-500 cursor-pointer hover:underline flex items-center gap-2'
          >
            <Add/>
            Adicionar novo tipo
          </p>

          {isAddingType && (
            <div
              className='flex flex-col gap-4 bg-base-2 p-4'
            >
              <Input
                disabled={readonly}
                label='Novo tipo'
                name='addType'
                required
              /> 
            </div>
          )}
          
          </div>
        }
        {
          currentStep === 2 && <div
          className='flex flex-col gap-4'
        >
          <Dropdown
            label='Classificação'
            name='classificationId' 
            options={classifications?.map(t => ({label: t.description, value: t.id})) ?? []}
            required
            disabled={readonly || isAddingClassification}
          />
          <p
            onClick={() => setIsAddingClassification(true)}
            className='text-primary-500 cursor-pointer hover:underline flex items-center gap-2'
          >
            <Add/>
            Adicionar nova classificação
          </p>

          {isAddingClassification && (
            <div
              className='flex flex-col gap-4 bg-base-2 p-4'
            >
              <Input
                disabled={readonly}
                label='Nova classificação'
                name='addClassification'
                required
              /> 
            </div>
          )}
          
          </div>
        } 
        {
          currentStep === 3 && <div
          className='flex flex-col gap-4'>
            <div
              className='flex flex-col md:flex-row gap-4 md:gap-6 items-center'
            >
              <div
                className='w-full md:w-4/5 flex flex-col md:flex-row gap-4 md:gap-6 items-center'>  
              <Input
                disabled={readonly}
                label='Código UID'
                name='uid'
                required
              />
              <Input
                disabled={readonly}
                label='Código HWID'
                name='hwid'
                required
              />

              </div>
              <Input
                disabled={readonly}
                label='Fabricante'
                name='manufacturer'
                required
              />
              <div
                className='w-full md:w-4/5'
              >
                <Input  
                disabled={readonly}
                  label='Marca'
                  name='brand'
                  required
                /> 
              </div>
            </div>
            <div
              className='flex flex-col md:flex-row gap-4 md:gap-6'>
              <Input
                disabled={readonly}
                label='Modelo'
                name='model'
                required
              />
              <Input
                disabled={readonly}
                label='Data de fabricação'
                name='manufactureDate'
                required
                mask={masks.DATE}
              />
            </div>
            <Input
            
                disabled={readonly}
              label='Contexto/Funções'
              name='manualFile'
              multiline
              minRows={3}
              />
            {
              readonly && <div>
                  <Input 
                    disabled={readonly}
                    label='Tipo' 
                    defaultValue={current?.classification?.type?.description} 
                    />
                  <Input 
                    disabled={readonly}
                    label='Classificação'
                    defaultValue={current?.classification?.description} 
                    />
                </div>
            }
          </div>
        }

      </Form>



    </Modal>
  )
}