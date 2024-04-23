"use client";
import { Button, Dropdown, Form, Input } from "@/components";
import { IFilterCharacterization } from "@/types/models/Ocurrences/IFilterCharacterization";
import { IOcurrenceType } from "@/types/models/Ocurrences/IOcurrenceType";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, Button as ButtonMUI } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const schemaFilter = Yup.object({
  category: Yup.string(),
  occurrenceType: Yup.number(),
});

type FormFieldsFilter = Yup.InferType<typeof schemaFilter>;

export default function ModalFilter({
  filter,
  setFilter,
  handleClose,
  types,
}: {
  filter: IFilterCharacterization;
  setFilter: Dispatch<SetStateAction<IFilterCharacterization>>;
  handleClose: () => void;
  types: IOcurrenceType[];
}) {
  const methodsFilter = useForm<FormFieldsFilter>({
    resolver: yupResolver(schemaFilter),
    defaultValues: {
      category: filter.category,
      occurrenceType: filter.typeId
    }
  });

  async function onSubmitFilter(data: FormFieldsFilter) {
    setFilter({
      ...filter,
      category: data.category,
      typeId: data.occurrenceType,
    });

    handleClose();
  }

  return (
    <Form
      onSubmit={(data) => onSubmitFilter(data as FormFieldsFilter)}
      className="flex flex-col gap-4 pb-4"
      {...methodsFilter}
    >
      <Dropdown
        name="occurrenceType"
        label="Tipo de ocorrência"
        options={types.map((item) => {
          return {
            label: item.description,
            value: item.id,
          };
        })}
      />
      <Input
        name="category"
        label="Categoria"
        placeholder="Categoria"
        disabled={false}
      />
      <Stack flexDirection="row" justifyContent="space-between">
        <ButtonMUI
          onClick={() => handleClose()}
          variant="text"
          sx={{ color: "black" }}
        >
          Cancelar
        </ButtonMUI>
        <Button sx={{ width: "30%" }} type="submit">
          Filtrar
        </Button>
      </Stack>
    </Form>
  );
}
