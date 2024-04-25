import { Modal } from "@/components/ui/modal";
import * as Yup from "yup";
import { Form } from "@/components/form/Form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@/components/ui";
import { Dropdown } from "@/components/form";
import React, { useEffect } from "react";
import { IContext } from "@/types/models/ServiceOrder/IContext";
import { useServiceOperations } from "@/contexts/ServiceOperationsConfigProvider";
import { useQuery } from "@tanstack/react-query";
import { IOcurrenceCharacterization } from "@/types/models/Ocurrences/IOcurrenceCharacterization";
import { ocurrenceCharacterizationService } from "@/services/Ocurrences";

const schema = Yup.object({
  code: Yup.number(),
  name: Yup.string(),
  application: Yup.number(),
  type: Yup.number(),
  characterization: Yup.number(),
  interval: Yup.number(),
  paramters: Yup.string(),
});

type FormFields = Yup.InferType<typeof schema>;

export function ModalContext({
  isOpen,
  onClose,
  current,
  readonly,
}: {
  isOpen: boolean;
  onClose: () => void;
  current?: IContext;
  readonly?: boolean;
}) {
  const methods = useForm<FormFields>({
    resolver: yupResolver(schema),
    values: {
      code: current?.code,
      name: current?.name,
      application: current?.application,
      type: current?.type,
      characterization: current?.characterizationId,
      interval: current?.intervalTime,
      paramters: current?.parameters,
    },
  });

  const { contexts, characterizations } = useServiceOperations();

  async function onSubmit(data: FormFields) {
    const newData: IContext = {
      id: current.id,
      code: data.code,
      name: data.name,
      application: data.application,
      parameters: data.paramters,
      type: data.type,
      characterizationId: data.characterization,
      intervalTime: data.interval,
    } as IContext;

    await contexts.update(newData);

    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      methods={methods}
      title="Editar contexto"
      width="550px"
      onSubmit={readonly ? undefined : () => methods.handleSubmit(onSubmit)()}
    >
      <Form
        onSubmit={(data) => onSubmit(data as FormFields)}
        className="flex flex-col gap-4 pb-4"
        {...methods}
      >
        <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-between">
          <Input
            name="code"
            label="Código"
            required
            placeholder="Código"
            error={methods.formState.errors.code}
            disabled={readonly}
          />
          <Input
            name="name"
            label="Nome"
            required
            placeholder="Nome"
            error={methods.formState.errors.name}
            disabled={readonly}
          />
        </div>
        <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-between">
          <Dropdown
            name="application"
            label="Aplicação"
            required
            disabled={readonly}
            options={[
              {
                label: "1",
                value: 1,
              },
              {
                label: "2",
                value: 2,
              },
            ]}
          />
          <Dropdown
            name="type"
            label="Tipo"
            required
            disabled={readonly}
            options={[
              {
                label: "1",
                value: 1,
              },
            ]}
          />
        </div>
        <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-between">
          <Dropdown
            name="characterization"
            label="Caracterização"
            required
            disabled={readonly}
            options={
              characterizations?.data?.map((characterization) => ({
                label: characterization.description,
                value: characterization.id,
              })) ?? []
            }
          />
          <Input
            name="interval"
            label="Intervalo"
            required
            placeholder="Intervalo"
            error={methods.formState.errors.interval}
            disabled={readonly}
          />
        </div>
        <Input
          name="paramters"
          label="Parâmetros"
          required
          placeholder="Sem observação"
          error={methods.formState.errors.paramters}
          disabled={readonly}
          multiline={true}
          minRows={5}
        />
      </Form>
    </Modal>
  );
}
