import { Dropdown, Form } from '@/components/form';
import { Input, Modal } from '@/components/ui';
import { useServiceOrder } from '@/contexts';
import { useAdministrator } from '@/contexts/AdministrationProvider';
import { masks } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from "yup"; 

export function ModalFiltroServicosDashboard({
  isOpen,
  onClose, 
} : {
  isOpen: boolean;
  onClose: () => void; 
}
){
  const {
    serviceOrders
  } = useServiceOrder();
  
  const schema = Yup.object({ 
    period: Yup.string(),
    date: Yup.string()
  });
  type FormFields = Yup.InferType<typeof schema>;

  const methods = useForm<FormFields>({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data : FormFields) => {
    serviceOrders.setFilter(
      prev => ({
          ...prev,
        }));
    onClose();
  }


  return (
    
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        'Filtrar Equipamentos'
      }
      width='550px'
      onSubmit={
        () => methods.handleSubmit(onSubmit)()
      }
      SubmitText='Filtrar'
    > 

      <Form
        className='flex flex-col gap-4 md:gap-8'
        onSubmit={methods.handleSubmit(onSubmit)}
        {...methods}
      >
        <Dropdown
          label='Período'
          name='period'
          options={[
            {label: 'Hoje', value: 'today'},
            {label: 'Ontem', value: 'yesterday'},
            {label: 'Últimos 7 dias', value: 'last7days'},
            {label: 'Últimos 30 dias', value: 'last30days'},
          ]}
        />
        <Input
          label='Data'
          name='date'
          mask={masks.DATE}
        />
      </Form>

    </Modal>
  )
}