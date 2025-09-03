import { Box } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { queryClient } from "../../config/react-query";
import { createDynamicFormFields } from "./formFields";
import { useUpdatePessoa } from "../../hooks/api/pessoa/useUpdatePessoa";
import { useCreatePessoa } from "../../hooks/api/pessoa/useCreatePessoa";
import { useLoadAssistant } from "../../hooks/api/assistant-config/useLoadAssistant";
import { useIaChat } from "../../hooks/useIaChat";
import { FormDialog } from "../../components/formDialog";
import {
  DefaultTrigger,
  IconTrigger,
} from "../../components/formDialog/form-trigger";
import { ORIGENS } from "../../constants/origens";
import { formatDateToDDMMYYYY } from "../../utils/formatting";

export const PessoasDialog = ({
  defaultValues = null,
  label = "Adicionar Prestador",
}) => {
  const [data, setData] = useState(defaultValues);
  const [open, setOpen] = useState(false);
  const { onOpen } = useIaChat();
  const { assistant } = useLoadAssistant(["pessoa"]);
  const fields = useMemo(() => createDynamicFormFields(), []);

  const updatePessoa = useUpdatePessoa({
    origem: ORIGENS.FORM,
    onSuccess: (data) => {
      if (open) setData((prev) => (data?.pessoa ? data.pessoa : prev));
    },
  });

  const createPessoa = useCreatePessoa({
    origem: ORIGENS.FORM,
    onSuccess: (data) => {
      if (open) setData((prev) => (data?.pessoa ? data.pessoa : prev));
    },
  });

  const onSubmit = async (values) => {
    if (!data) return await createPessoa.mutateAsync({ body: values });
    return await updatePessoa.mutateAsync({ body: values, id: data._id });
  };

  useEffect(() => {
    setData(defaultValues);
  }, [defaultValues]);

  return (
    <Box>
      <Box onClick={() => setOpen(true)} asChild>
        {defaultValues ? <IconTrigger /> : <DefaultTrigger />}
      </Box>
      <FormDialog
        data={{
          ...data,
          pessoaFisica: {
            ...data?.pessoaFisica,
            dataNascimento: formatDateToDDMMYYYY(
              data?.pessoaFisica?.dataNascimento
            ),
          },
        }}
        fields={fields}
        label={label}
        onOpenAssistantDialog={() => onOpen(data, assistant)}
        onSubmit={onSubmit}
        onOpenChange={() => {
          queryClient.invalidateQueries(["listar-pessoas"]);
          setOpen(false);
          setData(defaultValues);
        }}
        open={open}
        stateKey="pessoas"
      />
    </Box>
  );
};
