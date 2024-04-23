import { Button, Dropdown, Form, Input } from "@/components";
import { useDialog } from "@/hooks/use-dialog";
import { generateService } from "@/services/Ocurrences";
import { IOcurrence } from "@/types/models/Ocurrences/IOcurrence";
import { masks } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button as ButtonMUI, Stack } from "@mui/material";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const schemaEdit = Yup.object({
  occurrenceDate: Yup.string(),
  locale: Yup.string(),
  description: Yup.string(),
  occurrenceCategory: Yup.number(),
  profissional: Yup.number(),
  serviceOrder: Yup.string(),
});

type FormFieldsEdit = Yup.InferType<typeof schemaEdit>;

export default function ModalEdit({
  currentOcurrence,
  handleClose,
  isMobile,
  refetch,
}: {
  currentOcurrence: IOcurrence;
  handleClose: () => void;
  isMobile: boolean;
  refetch: () => void;
}) {
  const methodsEdit = useForm<FormFieldsEdit>({
    resolver: yupResolver(schemaEdit),
    defaultValues: {
      occurrenceCategory: currentOcurrence.characterization?.id,
      profissional: currentOcurrence.professional?.id,
      serviceOrder: currentOcurrence.serviceOrder?.code,
      occurrenceDate: dayjs(currentOcurrence.registerDate).format("DD/MM/YYYY"),
      locale: currentOcurrence.local,
      description: currentOcurrence.description,
    },
  });

  const { confirmDialog } = useDialog();

  async function onSubmitEdit(data: FormFieldsEdit) {
    currentOcurrence.registerDate = data.occurrenceDate;
    currentOcurrence.local = data.locale;
    currentOcurrence.description = data.description;

    try {
      await generateService.updateOcurrenceAsync(currentOcurrence);
    } catch (e) {
      confirmDialog({
        title: "Houve um erro ao editar a ocorrência",
        message: e.message,
      });
    }

    refetch();
    handleClose();
  }

  return (
    <Form
      onSubmit={(data) => onSubmitEdit(data as FormFieldsEdit)}
      className="flex flex-col gap-4 pb-4"
      {...methodsEdit}
    >
      <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-between">
        <Input
          name="serviceOrder"
          label="Ordem de serviço"
          required
          disabled={true}
        />
        <Dropdown
          name="occurrenceCategory"
          label="Categorização de ocorrência"
          required
          disabled={true}
          options={[
            {
              label: currentOcurrence.characterization?.description,
              value: currentOcurrence.characterization?.id,
            },
          ]}
        />
      </div>

      <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-between">
        <Dropdown
          name="profissional"
          label="Profissional"
          required
          disabled={true}
          options={[
            {
              label: currentOcurrence.professional?.name,
              value: currentOcurrence.professional?.id,
            },
          ]}
        />
        <Input
          name="occurrenceDate"
          label="Data da ocorrência"
          required
          error={methodsEdit.formState.errors.occurrenceDate}
          placeholder="DD/MM/AAAA"
          disabled={false}
          mask={masks.DATE}
        />
      </div>
      <Stack width={isMobile ? "100%" : "50%"}>
        <Input
          name="locale"
          label="Local"
          required
          placeholder="Local"
          error={methodsEdit.formState.errors.locale}
          disabled={false}
        />
      </Stack>
      <Input
        name="description"
        label="Descrição"
        required
        placeholder="Texto descritivo"
        error={methodsEdit.formState.errors.description}
        disabled={false}
        minRows={5}
        multiline={true}
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
          Editar
        </Button>
      </Stack>
    </Form>
  );
}
