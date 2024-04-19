"use client";
import { Button, Dropdown, Form, Input } from "@/components";
import { ocurrrenceClassificationService } from "@/services/Ocurrences";
import { IOcurrenceClassification } from "@/types/models/Ocurrences/IOcurrenceClassification";
import { IOcurrenceType } from "@/types/models/Ocurrences/IOcurrenceType";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, Button as ButtonMUI } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const schema = Yup.object({
  description: Yup.string(),
});

type FormFields = Yup.InferType<typeof schema>;

export default function ModalAddAndUpdate({
  handleClose,
  types,
  classificationSelected,
  setClassificationSelected,
  isAdd,
}: {
  handleClose: () => void;
  types: IOcurrenceType[];
  classificationSelected: IOcurrenceClassification;
  setClassificationSelected: Dispatch<SetStateAction<IOcurrenceClassification>>;
  isAdd: boolean;
}) {
  const methods = useForm<FormFields>({
    resolver: yupResolver(schema),
  });

  async function onSubmit() {
    console.log(classificationSelected, "Classifications")
    if (isAdd) {
      await ocurrrenceClassificationService.insertClassification(
        classificationSelected
      );
    } else {
      await ocurrrenceClassificationService.updateClassification(
        classificationSelected
      );
    }

    handleClose();
  }

  return (
    <Form
      onSubmit={() => onSubmit()}
      className="flex flex-col gap-4 pb-4"
      {...methods}
    >
      <Dropdown
        name="occurrence-type"
        label="Tipo de ocorrência"
        defaultValueSelect={classificationSelected.type?.id}
        onChangeSelect={(e) =>
          setClassificationSelected({
            ...classificationSelected,
            type: { ...classificationSelected.type, id: e.target.value },
          })
        }
        options={types.map((item) => {
          return {
            label: item.description,
            value: item.id,
          };
        })}
      />
      <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-between">
        <Input
          name="description"
          label="Descrição"
          placeholder="Descrição"
          disabled={false}
          value={classificationSelected.description}
          onChange={(e) =>
            setClassificationSelected({
              ...classificationSelected,
              description: e.target.value,
            })
          }
        />
        <Dropdown
          name="severity"
          label="Severidade"
          defaultValueSelect={classificationSelected.severity}
          onChangeSelect={(e) =>
            setClassificationSelected({
              ...classificationSelected,
              severity: e.target.value,
            })
          }
          options={[
            { label: "Informativo", value: 1 },
            { label: "Mobilização", value: 2 },
            { label: "Atenção", value: 3 },
            { label: "Alerta", value: 4 },
            { label: "Crítico", value: 5 },
          ]}
        />
      </div>
      <Stack flexDirection="row" justifyContent="space-between">
        <ButtonMUI
          onClick={() => handleClose()}
          variant="text"
          sx={{ color: "black" }}
        >
          Cancelar
        </ButtonMUI>
        <Button sx={{ width: "30%" }} type="submit">
          Salvar
        </Button>
      </Stack>
    </Form>
  );
}
