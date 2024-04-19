"use client";
import { Button, Dropdown, Form, Input } from "@/components";
import { useDialog } from "@/hooks/use-dialog";
import { generateService } from "@/services/Ocurrences";
import { recognitionService } from "@/services/Ocurrences/recognitionService";
import { IOcurrence } from "@/types/models/Ocurrences/IOcurrence";
import { IOcurrenceClassification } from "@/types/models/Ocurrences/IOcurrenceClassification";
import { IOcurrenceRecognize } from "@/types/models/Ocurrences/IOcurrenceRecognize";
import { masks } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button as ButtonMUI, Stack, Switch, Typography } from "@mui/material";
import dayjs from "dayjs";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const schemaRecognize = Yup.object({
  classification: Yup.number(),
  observation: Yup.string(),
});

export default function ModalEnding({
  currentOcurrence,
  handleClose,
}: {
  currentOcurrence: IOcurrenceRecognize;
  handleClose: () => void;
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

    handleClose();
  }
  type FormFields = Yup.InferType<typeof schemaRecognize>;

  const methodsRecognize = useForm<FormFields>({
    resolver: yupResolver(schemaRecognize),
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
        <Input
          name="codeOs"
          label="Código OS"
          required
          defaultValue={currentOcurrence.occurrence?.registerNumber}
          disabled={true}
        />
        <Input
          name="dateAndTime"
          label="Data e Hora"
          required
          defaultValue={dayjs(currentOcurrence.registerDate).format(
            "DD/MM/YYYY"
          )}
          disabled={true}
        />
        <Input
          name="professional"
          label="Profissional"
          required
          defaultValue={currentOcurrence.professional?.name}
          disabled={true}
        />
      </div>

      <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-between">
        <Input
          name="characterization"
          label="Caracterização"
          required
          defaultValue={currentOcurrence.characterization?.description}
          disabled={true}
        />
        <Input
          name="type"
          label="Tipo"
          required
          defaultValue={currentOcurrence.occurrence?.occurrenceType?.typeName}
          disabled={true}
        />
      </div>
      <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-between">
        <Dropdown
          name="occurrence-categorization"
          label="Categorização da ocorrência"
          required
          defaultValueSelect={currentOcurrence.characterization?.id}
          disabled={true}
          options={[
            {
              label: currentOcurrence.characterization?.description,
              value: currentOcurrence.characterization?.id,
            },
          ]}
        />
        <Input
          name="occurrence-date"
          label="Data da ocorrência"
          required
          placeholder="DD/MM/AAAA"
          defaultValue={dayjs(currentOcurrence.registerDate).format(
            "DD/MM/YYYY"
          )}
          disabled={true}
          mask={masks.DATE}
        />
      </div>
      <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-between">
        <Input
          name="origin"
          label="Origem"
          required
          defaultValue={currentOcurrence.occurrence?.origin}
          disabled={true}
        />
        <Input
          name="status"
          label="Status"
          required
          defaultValue={
            currentOcurrence.occurrence?.auditStatus ? "Concluido" : "Pendente"
          }
          disabled={true}
        />
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
