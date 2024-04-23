import { Dropdown, Form } from '@/components/form';
import { Input, Modal } from '@/components/ui';
import { useServiceOrder } from '@/contexts';
import { useAdministrator } from '@/contexts/AdministrationProvider';
import { masks } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import * as Yup from "yup"; 
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

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
    resolver: yupResolver(schema),
    defaultValues: {
      period: '7days',
    }
  });

  const onSubmit = (data : FormFields) => {
    debugger
    const { period } = data;
    const start = data.date ? dayjs(data.date, 'DD/MM/YYYY').startOf('day').toDate().toISOString() :  period === 'today' ?  dayjs().startOf('day').toDate().toISOString() : 
    period === 'yesterday' ? dayjs().subtract(1, 'day').startOf('day').toDate().toISOString() :
    period === 'last7days' ? dayjs().subtract(7, 'day').startOf('day').toDate().toISOString() :
    period === 'last30days' ? dayjs().subtract(30, 'day').startOf('day').toDate().toISOString() :
    dayjs().subtract(7, 'day').startOf('day').toDate().toISOString();

    const end = data.date ? dayjs(data.date, 'DD/MM/YYYY').endOf('day').toDate().toISOString() : undefined;

    const filter = {
      term: undefined,
      page: 0,
      pageSize: 999,
      start,
      end,
    } 

    serviceOrders.setFilter(filter);
    onClose();
  }

  const period = methods.watch('period');

  const date = methods.watch('date');

  console.log(date)

  console.log(period)


  return (
    
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        'Filtrar por:'
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