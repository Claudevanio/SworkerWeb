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
import { useQuery } from '@tanstack/react-query';
import { serviceOrderService } from '@/services/OperationalService/serviceOrderService';
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
    date: Yup.string(),
    osCode: Yup.string(),
    procedure: Yup.string(),
    executionDateStart: Yup.string(),
    executionDateEnd: Yup.string(),
    start: Yup.string(),
    end: Yup.string(),
    team: Yup.string(),
    status: Yup.number(),
  });
  type FormFields = Yup.InferType<typeof schema>;

  const methods = useForm<FormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      period: '7days',
    }
  });

  const onSubmit = (data : any) => {
    data.start = data.start && dayjs(data.start, 'DD/MM/YYYY').toDate().toISOString();
    data.end = data.end && dayjs(data.end, 'DD/MM/YYYY').toDate().toISOString();
    data.executionDateStart = data.executionDateStart && dayjs(data.executionDateStart, 'DD/MM/YYYY').toDate().toISOString();
    data.executionDateEnd = data.executionDateEnd && dayjs(data.executionDateEnd, 'DD/MM/YYYY').toDate().toISOString();
    data.term = data.osCode;


    const filter = {
      ...serviceOrders.filter,
      ...data,
    } 

    serviceOrders.setFilter(filter);
    onClose();
  } 

  const {data: status} = useQuery({
    queryKey: ['serviceOrderStatuses'],
    queryFn: () => serviceOrderService.getServiceOrderStatusesAsync(),
    refetchOnWindowFocus: false,
  })

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
        <div
          className='flex gap-4 md:gap-8 flex-col md:flex-row items-center'>
            <Input
              label='Código OS'
              name='osCode'
            />
            <div
              className='hidden md:block w-full'
            />
        </div>
        <div
          className='flex gap-4 md:gap-8 flex-col md:flex-row items-center'>
            <Input
              label='Procedimento'
              name='procedure'
            />
            <div
              className='hidden md:block w-full'
            />
        </div>
        <div
          className='flex gap-4 md:gap-8 flex-col md:flex-row items-center'>
            <Input
              label='Data de execução'
              name='executionDateStart'
              mask={masks.DATE}
            />
            <Input
              label='Até'
              name='executionDateEnd'
              mask={masks.DATE}
            />
        </div>
        <div
          className='flex gap-4 md:gap-8 flex-col md:flex-row items-center'>
            <Input
              label='Data de solicitação'
              name='start'
              mask={masks.DATE}
            />
            <Input
              label='Até'
              name='end'
              mask={masks.DATE}
            />
        </div>
        <div
          className='flex gap-4 md:gap-8 flex-col md:flex-row items-center'>
            <Input
              label='Equipe'
              name='team'
            />
            
            <Dropdown
              label='Status'
              name='status'
              options={
                (status ?? []).map(s => ({label: s.description, value: s.id}))
              }
            />
        </div>
              
        
      </Form>

    </Modal>
  )
}