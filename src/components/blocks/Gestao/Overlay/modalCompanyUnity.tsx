import { Modal } from '@/components/ui/modal';
import { basePagination, EtipoPermissao, ICompany, ICompanyUnity, IPermissions, IRole, ISector } from '@/types';
import * as Yup from 'yup';
import { Form } from '@/components/form/Form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '@/components/ui';
import { Dropdown } from '@/components/form';
import React from 'react';
import { useAdministrator } from '@/contexts/AdministrationProvider';
import { masks, regex } from '@/utils';
import { CustomSwitch } from '@/components/ui/switch';
import { useGestao } from '@/contexts/GestaoProvider';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/hooks/useUser';
import { SectorService } from '@/services/Administrator/sectorService';

const schema = Yup.object({
  name: Yup.string().required('O nome é obrigatório'),
  sectorId: Yup.string().required('A empresa é obrigatória'),
  phone: Yup.string().required('O telefone é obrigatório').matches(regex.TELEFONE, 'Telefone inválido'),
  active: Yup.boolean().required('O status é obrigatório')
});

type FormFields = Yup.InferType<typeof schema>;

export function ModalCompanyUnity({
  isOpen,
  onClose,
  current,
  readonly
}: {
  isOpen: boolean;
  onClose: () => void;
  current?: ICompanyUnity;
  readonly?: boolean;
}) {
  const methods = useForm<FormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      active: true
    }
  });

  const { currentCompany } = useUser();

  const {
    isLoading: isLoadingSectors,
    data: sectors,
    refetch: refetchSector
  } = useQuery<basePagination<ISector> | undefined>({
    queryKey: ['searchSectors', currentCompany?.id],
    queryFn: () =>
      SectorService.listSectorByCompanyAsync({
        page: 1,
        pageSize: 99,
        term: undefined,
        companyId: currentCompany?.id!
      }),
    refetchOnWindowFocus: false,
    enabled: !!currentCompany
  });

  const { companyUnities } = useGestao();

  async function onSubmit(data: FormFields) {
    console.log(data);

    const newData: ICompanyUnity = {
      ...data,
      phone: masks.CLEARMasks(data.phone),
      Address: {
        NeighborHood: 'Bairro',
        Number: '99',
        State: 'SP',
        Street: 'Rua',
        ZipCode: '05364-100'
      }
    } as any;

    if (current) {
      newData.address.companyUnityId = current.id as any;
      await companyUnities.update({
        ...newData,
        id: current.id
      });
      onClose();
      return;
    }

    await companyUnities.create(newData);

    onClose();
  }

  React.useEffect(() => {
    if (!isOpen) return;
    if (current) {
      methods.reset({
        name: current.name,
        sectorId: current.sectorId,
        phone: current.phone as any,
        active: current.active
      });
      return;
    }
    methods.reset();
  }, [current, isOpen, methods]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      methods={methods}
      title={current ? (readonly ? current.name : 'Editar Unidade') : 'Nova Unidade'}
      width="550px"
      onSubmit={readonly ? undefined : () => methods.handleSubmit(onSubmit)()}
    >
      <Form onSubmit={data => onSubmit(data as FormFields)} className="flex flex-col gap-4 pb-4" {...methods}>
        <Dropdown
          name="sectorId"
          label="Setor"
          required
          options={sectors?.items.map(company => ({ label: company.description, value: company.id })) ?? []}
          error={methods.formState.errors.sectorId}
          disabled={readonly}
        />
        <Input name="name" label="Nome" required placeholder="Nome" error={methods.formState.errors.name} disabled={readonly} />
        <div className="flex gap-4 md:gap-6 flex-col md:flex-row items-start md:items-end w-full">
          <div className="w-full md:w-1/3">
            <Input
              name="phone"
              label="Telefone"
              required
              placeholder="Telefone"
              mask={masks.TELEFONEMask}
              error={methods.formState.errors.phone}
              disabled={readonly}
            />
          </div>
          <CustomSwitch name="active" label="Ativo" disabled={readonly} />
        </div>
      </Form>
    </Modal>
  );
}
