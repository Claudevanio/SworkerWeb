"use client";
import { Button, Dropdown, Form, Input } from "@/components";
import { IFilterOcurrences } from "@/types/models/Ocurrences/IFilterOcurrences";
import { IOcurrenceCharacterization } from "@/types/models/Ocurrences/IOcurrenceCharacterization";
import { IOcurrenceClassification } from "@/types/models/Ocurrences/IOcurrenceClassification";
import { IOcurrenceType } from "@/types/models/Ocurrences/IOcurrenceType";
import { masks } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, Button as ButtonMUI } from "@mui/material";
import dayjs from "dayjs";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const schemaFilter = Yup.object({
  ocurrenceNumber: Yup.string(),
  professional: Yup.string(),
  supervisor: Yup.string(),
  registerDateStart: Yup.string(),
  registerDateEnd: Yup.string(),
  recognitionDateStart: Yup.string(),
  recognitionDateEnd: Yup.string(),
});

type FormFieldsFilter = Yup.InferType<typeof schemaFilter>;

export default function ModalFilter({
  filterOcurrences,
  setFilterOcurrences,
  handleClose,
  characterizations,
  characterizationSelected,
  setCharacterizationSelected,
  types,
  typesSelected,
  setTypesSelected,
  classifications,
  classificationSelected,
  setClassificationSelected,
}: {
  filterOcurrences: IFilterOcurrences;
  setFilterOcurrences: Dispatch<SetStateAction<IFilterOcurrences>>;
  handleClose: () => void;
  characterizations: IOcurrenceCharacterization[];
  characterizationSelected: IOcurrenceCharacterization;
  setCharacterizationSelected: Dispatch<
    SetStateAction<IOcurrenceCharacterization>
  >;
  types: IOcurrenceType[];
  typesSelected: IOcurrenceType;
  setTypesSelected: Dispatch<SetStateAction<IOcurrenceType>>;
  classifications: IOcurrenceClassification[];
  classificationSelected: IOcurrenceClassification;
  setClassificationSelected: Dispatch<SetStateAction<IOcurrenceClassification>>;
}) {
  const methodsFilter = useForm<FormFieldsFilter>({
    resolver: yupResolver(schemaFilter),
  });

  const dateFormatter = (data: string) => {
    var partes = data.split("/");
    var data_formatada = partes[2] + "-" + partes[1] + "-" + partes[0];
    return data_formatada;
  };

  async function onSubmitFilter(data: FormFieldsFilter) {
    setFilterOcurrences({
      ...filterOcurrences,
      numberOcurrence: data.ocurrenceNumber,
      professional: data.professional,
      characterization: characterizationSelected.id,
      type: typesSelected.id,
      registerDateStart: data.registerDateStart
        ? dayjs(dateFormatter(data.registerDateStart)).toISOString()
        : "",
      registerDateEnd: data.registerDateEnd
        ? dayjs(dateFormatter(data.registerDateEnd)).toISOString()
        : "",
      recognitionDateStart: data.recognitionDateStart
        ? dayjs(dateFormatter(data.recognitionDateStart)).toISOString()
        : "",
      recognitionDateEnd: data.recognitionDateEnd
        ? dayjs(dateFormatter(data.recognitionDateEnd)).toISOString()
        : "",
    });

    handleClose();
  }

  return (
    <Form
      onSubmit={(data) => onSubmitFilter(data as FormFieldsFilter)}
      className="flex flex-col gap-4 pb-4"
      {...methodsFilter}
    >
      <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-between">
        <Input
          name="ocurrenceNumber"
          label="Número da ocorrência"
          placeholder="Número da ocorrência"
          disabled={false}
        />
        <Input
          name="professional"
          label="Profissional"
          placeholder="Profissional"
          disabled={false}
        />
      </div>
      <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-between">
        <Input
          name="supervisor"
          label="Supervisor"
          placeholder="Supervisor"
          disabled={false}
        />
        <Dropdown
          name="occurrence-caracterization"
          label="Caracterização"
          defaultValueSelect={filterOcurrences.characterization}
          onChangeSelect={(e) =>
            setCharacterizationSelected({
              ...characterizationSelected,
              id: e.target.value,
            })
          }
          options={characterizations.map((item) => {
            return {
              label: item.description,
              value: item.id,
            };
          })}
        />
      </div>
      <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-between">
        <Dropdown
          name="occurrence-type"
          label="Tipo de ocorrência"
          defaultValueSelect={filterOcurrences.type}
          onChangeSelect={(e) =>
            setTypesSelected({
              ...typesSelected,
              id: e.target.value,
            })
          }
          options={types.map((item) => {
            return {
              label: item.description,
              value: item.id,
            };
          })}
        />
        <Dropdown
          name="classification"
          label="Classificação"
          defaultValueSelect={filterOcurrences.classification}
          onChangeSelect={(e) =>
            setClassificationSelected({
              ...classificationSelected,
              id: e.target.value,
            })
          }
          options={classifications.map((item) => {
            return {
              label: item.description,
              value: item.id,
            };
          })}
        />
      </div>
      <Stack width="50%">
        <Dropdown
          name="origin"
          label="Origem"
          defaultValueSelect={filterOcurrences.origin}
          onChangeSelect={(e) =>
            setFilterOcurrences({
              ...filterOcurrences,
              origin: e.target.value,
            })
          }
          options={[
            { label: "1", value: 1 },
            { label: "2", value: 2 },
          ]}
        />
      </Stack>
      <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-between">
        <Input
          name="registerDateStart"
          label="Data de cadastro (Início)"
          placeholder="DD/MM/AAAA"
          disabled={false}
          mask={masks.DATE}
        />
        <Input
          name="registerDateEnd"
          label="Data de cadastro (Fim)"
          placeholder="DD/MM/AAAA"
          disabled={false}
          mask={masks.DATE}
        />
      </div>
      <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-between">
        <Input
          name="recognitionDateStart"
          label="Data de reconhecimento (Início)"
          placeholder="DD/MM/AAAA"
          disabled={false}
          mask={masks.DATE}
        />
        <Input
          name="recognitionDateEnd"
          label="Data de reconhecimento (Fim)"
          placeholder="DD/MM/AAAA"
          disabled={false}
          mask={masks.DATE}
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
          Filtrar
        </Button>
      </Stack>
    </Form>
  );
}
