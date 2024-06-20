import { Dropdown, Form } from '@/components/form';
import { Input, Modal } from '@/components/ui';
import { useServiceOrder } from '@/contexts';
import { masks } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useQuery } from '@tanstack/react-query';
import { serviceOrderService } from '@/services/OperationalService/serviceOrderService';
import { useUser } from '@/hooks/useUser';
import { professionalService } from '@/services';
dayjs.extend(customParseFormat);

export function ModalFiltroServicosDashboard({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { serviceOrders, status } = useServiceOrder();

  const { currentCompany } = useUser();

  const schema = Yup.object({
    period: Yup.string(),
    date: Yup.string(),
    code: Yup.string(),
    responsavel: Yup.string(),
    executionDateStart: Yup.string(),
    executionDateEnd: Yup.string(),
    start: Yup.string(),
    end: Yup.string(),
    equip: Yup.string(),
    statusld: Yup.number()
  });
  type FormFields = Yup.InferType<typeof schema>;

  const methods = useForm<FormFields>({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data: any) => {
    debugger;
    data.start = data.start && dayjs(data.start, 'DD/MM/YYYY').toDate().toISOString();
    data.end = data.end && dayjs(data.end, 'DD/MM/YYYY').toDate().toISOString();
    data.executionDateStart = data.executionDateStart && dayjs(data.executionDateStart, 'DD/MM/YYYY').toDate().toISOString();
    data.executionDateEnd = data.executionDateEnd && dayjs(data.executionDateEnd, 'DD/MM/YYYY').toDate().toISOString();
    data.term = data.code;

    const filter = {
      ...serviceOrders.filter,
      ...data
    };

    serviceOrders.setFilter(filter);
    onClose();
  };

  const { data: equipsList } = useQuery({
    queryKey: ['serviceOrderEquipes', currentCompany?.id],
    queryFn: () => professionalService.getEquipesListAsync(currentCompany?.id),
    enabled: !!currentCompany?.id
  });

  const statusOptions = status?.data?.map(s => ({ label: s.description, value: s.id })) ?? [];
  statusOptions.unshift({ label: 'Todos', value: undefined });

  const equipsOptions = equipsList?.map(e => ({ label: e.description, value: e.id })) ?? [];
  equipsOptions.unshift({ label: 'Todas', value: undefined });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={'Filtrar por:'}
      width="550px"
      onSubmit={() => methods.handleSubmit(onSubmit)()}
      SubmitText="Filtrar"
    >
      <Form className="flex flex-col gap-4 md:gap-8" onSubmit={methods.handleSubmit(onSubmit)} {...methods}>
        <div className="flex gap-4 md:gap-8 flex-col md:flex-row items-center">
          <Input label="Código" name="code" />
          <Input label="Responsavel" name="responsavel" />
        </div>
        <div className="flex gap-4 md:gap-8 flex-col md:flex-row items-center">
          <Input label="Data de execução" name="executionDateStart" mask={masks.DATE} />
          <Input label="Até" name="executionDateEnd" mask={masks.DATE} />
        </div>
        <div className="flex gap-4 md:gap-8 flex-col md:flex-row items-center">
          <Input label="Data de solicitação" name="start" mask={masks.DATE} />
          <Input label="Até" name="end" mask={masks.DATE} />
        </div>
        <div className="flex gap-4 md:gap-8 flex-col md:flex-row items-center">
          <Dropdown label="Equipe" name="equip" options={equipsOptions} />

          <Dropdown label="Status" name="statusld" options={statusOptions} />
        </div>
      </Form>
    </Modal>
  );
}
