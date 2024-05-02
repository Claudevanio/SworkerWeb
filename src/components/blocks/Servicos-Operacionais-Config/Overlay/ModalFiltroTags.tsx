import { Dropdown, Form } from '@/components/form';
import { Input, Modal } from '@/components/ui'; 
import { useServiceOperations } from '@/contexts/ServiceOperationsConfigProvider';
import { masks } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { version } from 'os';
import { useForm } from 'react-hook-form';
import * as Yup from "yup"; 

export function ModalFiltroTags({
  isOpen,
  onClose, 
} : {
  isOpen: boolean;
  onClose: () => void; 
}
){
  const {tags} = useServiceOperations()
  
  const schema = Yup.object({ 
    description: Yup.string(),
    uid: Yup.string(),
    hwid: Yup.string(),
    mode: Yup.string(),
    status: Yup.string(),
    tagTypeId: Yup.string(), 
  });
  type FormFields = Yup.InferType<typeof schema>;

  const methods = useForm<FormFields>({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data : FormFields) => {
    const filters = {
      description: data.description,
      uid: data.uid,
      hwid: data.hwid,
      mode: data.mode,
      status: data.status,
      tagTypeId: data.tagTypeId, 
    }
    tags.setFilter(
      prev => 
        ({
          ...prev,
          ...filters,
          page: 0, 
        }));
    onClose();
  }


  return (
    
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        'Filtrar Grupos'
      }
      width='530px'
      onSubmit={
        () => methods.handleSubmit(onSubmit)()
      }
      SubmitText='Filtrar'
    > 

      <Form
        className='flex flex-col gap-4 md:gap-6'
        onSubmit={methods.handleSubmit(onSubmit)}
        {...methods}
      > 
        <div
          className='flex flex-col md:flex-row gap-4 items-center justify-between'
        >
          <Input
            name='description'
            label='Nome'
          />
          <div 
            className='flex flex-col md:flex-row gap-4 md:gap-6 justify-between w-full'>
            <Input
              name='uid'
              label='UID'
            />
            <Input
              name='hwid'
              label='HWID'
            />
          </div>
        </div>
        <div
          className='flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-between'>
            <Input
              name='local'
              label='Local'
            />
            <Dropdown
              name='tagTypeId'
              label='Tipo'
              options={tags.types.map(type => ({
                label: type.description,
                value: type.id
              }))}
            />
        </div>
        <div
          className='flex flex-col md:flex-row gap-4 md:gap-6  items-center justify-between'>
            <Dropdown
              name='mode'
              label='Modo'
              options={[
                {
                  label: 'Passivo',
                  value: '1'
                },
                {
                  label: 'Ativo',
                  value: '2'
                }
              ]}
            />
            <Dropdown
              name='status'
              label='Status'
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


      </Form>

    </Modal>
  )
}