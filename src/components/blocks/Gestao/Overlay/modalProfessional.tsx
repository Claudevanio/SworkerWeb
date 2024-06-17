import { Modal } from '@/components/ui/modal';
import { EtipoPermissao, ICompany, IProfessional, IPermissions, IRole, IUser } from '@/types';
import * as Yup from 'yup';
import { Form } from '@/components/form/Form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CheckBox, Input } from '@/components/ui';
import { Dropdown } from '@/components/form';
import React, { useEffect } from 'react';
import { useAdministrator } from '@/contexts/AdministrationProvider';
import { masks, regex } from '@/utils';
import { CustomSwitch } from '@/components/ui/switch';
import { professionalService, RoleService, Userservice } from '@/services';
import { Accordion, AccordionDetails, AccordionSummary, CircularProgress } from '@mui/material';
import CustomizedAccordions from '../components/customizedAccordion';
import { useQuery } from '@tanstack/react-query';
import { SectorService } from '@/services/Administrator/sectorService';
import { useGestao } from '@/contexts/GestaoProvider';

const schema = Yup.object({
  name: Yup.string().required('O nome é obrigatório'),
  registerNumber: Yup.string().required('O registro é obrigatório'),
  email: Yup.string().required('O e-mail é obrigatório').email('E-mail inválido'),
  cpf: Yup.string().required('O CPF é obrigatório').matches(regex.CPF, 'CPF inválido'),
  phone: Yup.string().required('O telefone é obrigatório').matches(regex.TELEFONE, 'Telefone inválido'),
  roleId: Yup.string().required('O cargo é obrigatório'),
  active: Yup.boolean(),
  standardSupervisor: Yup.boolean(),
  unitsIds: Yup.array().of(Yup.string()).min(1, 'Selecione ao menos uma unidade')
});

const generatePassword = function () {
  var numbers = '0123456789';
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP';
  var pass = '';

  for (var x = 0; x < 3; x++) {
    var i = Math.floor(Math.random() * chars.length);
    pass += chars.charAt(i);
  }

  for (var y = 0; y < 5; y++) {
    var n = Math.floor(Math.random() * numbers.length);
    pass += numbers.charAt(n);
  }

  return pass;
};

type FormFields = Yup.InferType<typeof schema>;

export function ModalProfessional({
  isOpen,
  onClose,
  current,
  readonly
}: {
  isOpen: boolean;
  onClose: () => void;
  current?: IProfessional;
  readonly?: boolean;
}) {
  const methods = useForm<FormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      unitsIds: []
    }
  });

  // const {
  //   data: sectorsList
  // } = useQuery<any>({
  //   queryKey: ['sectors'],
  //   queryFn: () => SectorService.getAll(),
  //   refetchOnWindowFocus: false,
  // })

  const { data: userInfo } = useQuery<
    Array<{
      roleId: string;
    }>
  >({
    queryKey: ['userInfo', current?.userId],
    queryFn: () => RoleService.getRolesByUserIdAsync(current?.userId ?? ''),
    refetchOnWindowFocus: false,
    enabled: !!current?.userId
  });
  const { sectors, professionals, companyUnities } = useGestao();

  async function onSubmit(data: FormFields) {
    const userData: IUser = {
      email: data.email,
      password: generatePassword(),
      roleId: data.roleId,
      name: data.name,
      userName: data.email
    };

    const newUser = await Userservice.createUser(userData);

    const userId = (newUser as any)?.data?.id;

    const professionalData: IProfessional = {
      ...data,
      id: professionals.current?.id ?? '',
      userId: userId,
      cpf: +masks.CLEARMasks(data.cpf) as any,
      phone: +masks.CLEARMasks(data.phone) as any,
      unityId: data.unitsIds[0],
      email: data.email
    } as any;

    const response = await professionals.create(professionalData);

    const professionalId = response.data.id;

    const unitsToAdd = data.unitsIds?.filter(unitId => !professionalUnities.data?.map((unity: any) => unity.id).includes(unitId));

    const unitsToRemove = professionalUnities.data?.map((unity: any) => unity.id).filter(unitId => !data.unitsIds?.includes(unitId));

    unitsToAdd?.forEach(async unityId => {
      await professionalService.signUnit(professionalId, unityId);
    });

    unitsToRemove?.forEach(async unityId => {
      await professionalService.signUnit(professionalId, unityId);
    });

    onClose();
  }

  const professionalUnities = useQuery({
    queryKey: ['professionalUnities', current?.id],
    queryFn: () => professionalService.getUnits(current?.id),
    refetchOnWindowFocus: false,
    enabled: !!current?.id
  });

  React.useEffect(() => {
    if (!isOpen) return;
    if (current) {
      methods.reset({
        ...current,
        unitsIds: professionalUnities.data?.map((unity: any) => unity.id)
      });
      return;
    }
    methods.reset();
  }, [isOpen, professionalUnities.data, current]);

  const permissions = useQuery<IRole[]>({
    queryKey: ['searchPermissions'],
    queryFn: RoleService.getAll,
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (!userInfo) return;
    if (!userInfo[0]) return;

    methods.setValue('roleId', userInfo[0].roleId);
  }, [methods, userInfo]);

  const unitsIds = methods.watch('unitsIds');

  const options = permissions.data?.map((role: IRole) => ({ label: role.name, value: role.roleId })) ?? [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      methods={methods}
      title={current ? (readonly ? current.name : 'Editar Profissional') : 'Novo Profissional'}
      width="840px"
      onSubmit={readonly ? undefined : () => methods.handleSubmit(onSubmit)()}
    >
      <Form onSubmit={data => onSubmit(data as FormFields)} className="flex flex-col gap-4 pb-4 relative" {...methods}>
        <div
          className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-60 flex items-center justify-center z-10"
          style={{ display: professionalUnities.isLoading ? 'flex' : 'none' }}
        >
          <CircularProgress size={60} />
        </div>
        <div className="w-full flex justify-between gap-4 md:gap-6 flex-col md:flex-row items-start">
          <Input name="name" label="Nome" required placeholder="Nome" error={methods.formState.errors.name} disabled={readonly} />
          <div className="w-full md:w-3/5">
            <Input name="cpf" label="CPF" required placeholder="CPF" mask={masks.CPFMask} error={methods.formState.errors.cpf} disabled={readonly} />
          </div>
        </div>
        <div className="w-full flex justify-between gap-4 md:gap-6 flex-col md:flex-row items-start">
          <Input name="email" label="E-mail" required placeholder="E-mail" error={methods.formState.errors.email} disabled={readonly} />
          <Input
            name="phone"
            label="Telefone"
            required
            placeholder="Telefone"
            mask={masks.TELEFONEMask}
            error={methods.formState.errors.phone}
            disabled={readonly}
          />
          <Input
            name="registerNumber"
            label="Registro"
            required
            placeholder="Registro"
            error={methods.formState.errors.registerNumber}
            disabled={readonly}
          />
        </div>
        <div className="flex gap-4 md:gap-6 flex-col md:flex-row items-start md:items-end w-full">
          <div className="w-full md:w-1/3">
            <Dropdown
              name="roleId"
              label="Cargo"
              required
              options={options.map(option => ({
                label: option.label,
                value: option.value
              }))}
              disabled={readonly}
            />
          </div>
          <div className="flex gap-4 md:gap-6  md:flex-row items-start justify-between md:justify-start md:items-end md: w-full">
            <CustomSwitch name="active" label="Ativo" disabled={readonly} />
            <CustomSwitch name="standardSupervisor" label="Supervisor Padrão" disabled={readonly} />
          </div>
        </div>

        <div style={{}}>
          <CustomizedAccordions
            expanded={true}
            // special={
            //   index === 0 ? 'first' : index === array.length - 1 ? 'last' : undefined
            // }
            summary={'Unidades'}
          >
            <div className="flex flex-col gap-0 w-full">
              {companyUnities.data?.items?.length === 0 ? (
                <div className="flex justify-between items-center gap-4 border-base-2 md:border-primary-300 border-x-2 py-2 border-y-[.5px] w-full pl-10 pr-4">
                  Nenhuma unidade encontrada
                </div>
              ) : (
                companyUnities.data?.items?.map((sector, index, array) => (
                  <div
                    key={index}
                    className="flex justify-between items-center gap-4 border-base-2 md:border-primary-300 border-2 border-y-[.5px] w-full pl-10 pr-4"
                  >
                    {sector.name}
                    <CheckBox
                      label=""
                      value={unitsIds && unitsIds.includes(sector.id)}
                      onChange={() => {
                        if (!unitsIds) return;
                        if (unitsIds?.includes(sector.id)) {
                          methods.setValue(
                            'unitsIds',
                            unitsIds.filter(id => id !== sector.id)
                          );
                        } else {
                          methods.setValue('unitsIds', [...unitsIds, sector.id]);
                        }
                      }}
                    />
                  </div>
                ))
              )}
            </div>
          </CustomizedAccordions>
          {methods.formState.errors.unitsIds && <span className="text-danger text-xs">{methods.formState.errors.unitsIds.message}</span>}
        </div>
      </Form>
    </Modal>
  );
}
