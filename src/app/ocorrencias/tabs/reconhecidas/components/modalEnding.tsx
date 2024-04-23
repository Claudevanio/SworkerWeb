"use client";
import { Button, Dropdown, Form, Input } from "@/components";
import { useDialog } from "@/hooks/use-dialog";
import { recognitionService } from "@/services/Ocurrences/recognitionService";
import { IOcurrenceRecognize } from "@/types/models/Ocurrences/IOcurrenceRecognize";
import { masks } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button as ButtonMUI, Stack, Switch, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const schemaRecognize = Yup.object({
  occurrenceCategorization: Yup.number(),
  codeOs: Yup.string(),
  dateAndTime: Yup.string(),
  professional: Yup.string(),
  characterization: Yup.string(),
  type: Yup.string(),
  occurrenceDate: Yup.string(),
  origin: Yup.string(),
  status: Yup.string(),
});

export default function ModalEnding({
  currentOcurrence,
  handleClose,
  refetch,
}: {
  currentOcurrence: IOcurrenceRecognize;
  handleClose: () => void;
  refetch: () => void;
}) {
  const [checked, setChecked] = useState(false);

  const { confirmDialog } = useDialog();

  async function onSubmit() {
    const newOcurrenceRecognize: IOcurrenceRecognize = {
      ...currentOcurrence,
      closed: checked,
    };
    try {
      await recognitionService.closeOcurrenceAsync(newOcurrenceRecognize);
    } catch (e) {
      confirmDialog({
        title: "Houve um erro ao reconhecer a ocorrência",
        message: e.message,
      });
    }

    refetch();
    handleClose();
  }
  type FormFields = Yup.InferType<typeof schemaRecognize>;

  const methodsRecognize = useForm<FormFields>({
    resolver: yupResolver(schemaRecognize),
    defaultValues: {
      occurrenceCategorization: currentOcurrence.characterizationId,
      codeOs: currentOcurrence.occurrence?.registerNumber,
      dateAndTime: dayjs(currentOcurrence.registerDate).format("DD/MM/YYYY"),
      professional: currentOcurrence.professional?.name,
      characterization: currentOcurrence.characterization?.description,
      type: currentOcurrence.occurrence?.occurrenceType?.typeName,
      occurrenceDate: dayjs(currentOcurrence.registerDate).format("DD/MM/YYYY"),
      origin: currentOcurrence.occurrence?.origin,
      status: currentOcurrence.occurrence?.auditStatus
        ? "Concluido"
        : "Pendente",
    },
  });

  return (
    <Form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 pb-4"
      {...methodsRecognize}
    >
      <Stack flexDirection="row" alignItems="center">
        <Switch
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <Typography>Encerrar ocorrência</Typography>
      </Stack>
      <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-between">
        <Input name="codeOs" label="Código OS" required disabled={true} />
        <Input
          name="dateAndTime"
          label="Data e Hora"
          required
          disabled={true}
        />
        <Input
          name="professional"
          label="Profissional"
          required
          disabled={true}
        />
      </div>

      <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-between">
        <Input
          name="characterization"
          label="Caracterização"
          required
          disabled={true}
        />
        <Input name="type" label="Tipo" required disabled={true} />
      </div>
      <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-between">
        <Dropdown
          name="occurrenceCategorization"
          label="Categorização da ocorrência"
          required
          disabled={true}
          options={[
            {
              label: currentOcurrence.characterization?.description,
              value: currentOcurrence.characterization?.id,
            },
          ]}
        />
        <Input
          name="occurrenceDate"
          label="Data da ocorrência"
          required
          placeholder="DD/MM/AAAA"
          disabled={true}
          mask={masks.DATE}
        />
      </div>
      <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-between">
        <Input name="origin" label="Origem" required disabled={true} />
        <Input name="status" label="Status" required disabled={true} />
      </div>
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <ButtonMUI
          onClick={() => handleClose()}
          variant="text"
          sx={{ color: "black" }}
        >
          Cancelar
        </ButtonMUI>
        <Button type="submit">Salvar</Button>
      </Stack>
    </Form>
  );
}
