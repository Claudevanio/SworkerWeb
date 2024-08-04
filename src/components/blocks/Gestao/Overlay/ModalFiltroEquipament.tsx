import { Form } from '@/components/form';
import { Input, Modal } from '@/components/ui';
import { useAdministrator } from '@/contexts/AdministrationProvider';
import { useGestao } from '@/contexts/GestaoProvider';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

export function ModalFiltroEquipament({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { equipments, modal } = useGestao();

  const schema = Yup.object({
    uid: Yup.string(),
    hwid: Yup.string(),
    manufacturer: Yup.string(),
    brand: Yup.string(),
    classification: Yup.string()
  });
  type FormFields = Yup.InferType<typeof schema>;

  const methods = useForm<FormFields>({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data: FormFields) => {
    equipments.setFilter(prev => ({
      ...prev,
      uid: data.uid,
      hwid: data.hwid,
      manufacturer: data.manufacturer,
      brand: data.brand,
      classification: data.classification
    }));
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={'Filtrar Equipamentos'}
      width="550px"
      onSubmit={() => methods.handleSubmit(onSubmit)()}
      SubmitText="Filtrar"
    >
      <Form className="flex flex-col gap-4 md:gap-8" onSubmit={methods.handleSubmit(onSubmit)} {...methods}>
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          <Input name="uid" label="Código UID" />
          <Input name="hwid" label="Código HWID" />
        </div>

        <Input name="manufacturer" label="Fabricante" />

        <Input name="brand" label="Marca" />

        <Input name="classification" label="Classificação" />
      </Form>
    </Modal>
  );
}
