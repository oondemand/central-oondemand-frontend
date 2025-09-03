import { Box, Text, Button, Flex, useDialogContext } from "@chakra-ui/react";

import { Check } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toaster } from "../../../../components/ui/toaster";
import { formatDateToDDMMYYYY } from "../../../../utils/formatting";
import { queryClient } from "../../../../config/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { VisibilityControlDialog } from "../../../../components/vibilityControlDialog";
import { createDynamicFormFields } from "../../../pessoa/formFields";
import { useMemo, useState } from "react";
import { useVisibleInputForm } from "../../../../hooks/useVisibleInputForms";
import { PessoaService } from "../../../../service/pessoa";
import { BuildForm } from "../../../../components/buildForm";
import { DocumentosFiscaisService } from "../../../../service/documentos-fiscais";
import { useUpdatePessoa } from "../../../../hooks/api/pessoa/useUpdatePessoa";
import { ORIGENS } from "../../../../constants/origens";
import { flatFormFields } from "../../../../utils/form";
import { Select } from "chakra-react-select";
import { ServicoService } from "../../../../service/servico";
import { currency } from "../../../../utils/currency";
import { createChakraStyles } from "../../../../components/buildForm/filds/chakraStyles";
import { useConfirmation } from "../../../../hooks/useConfirmation";

const servicoSchema = z.object({
  servicos: z.array(z.object({ value: z.string() }).transform((e) => e.value)),
});

export const AprovarForm = ({ documentoFiscal }) => {
  const { requestConfirmation } = useConfirmation();
  const { setOpen } = useDialogContext();

  const { inputsVisibility, setInputsVisibility } = useVisibleInputForm({
    key: "PESSOAS_DOCUMENTO_FISCAL_MODAL_FORM",
  });

  const updatePessoa = useUpdatePessoa({
    origem: ORIGENS.FORM,
  });

  const { mutateAsync: onAprovarDocumento, isPending } = useMutation({
    mutationFn: async ({ servicos, ticket }) => {
      await DocumentosFiscaisService.aprovarDocumentoFiscal({
        origem: ORIGENS.APROVACAO_DOCUMENTO_FISCAL,
        id: documentoFiscal?._id,
        servicos,
        ticket,
      });
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["listar-documentos-fiscais"],
      });
      toaster.create({
        title: "Documento cadastral aprovado com sucesso!",
        type: "success",
      });
      setOpen(false);
    },
    onError: () => {
      toaster.create({
        title: "Ouve um erro ao aprovar o documento cadastral!",
        type: "error",
      });
    },
  });

  const { handleSubmit, control } = useForm({
    resolver: zodResolver(servicoSchema),
    defaultValues: {
      servicos: [],
    },
  });

  const fields = useMemo(() => createDynamicFormFields(), []);

  const onSubmitPessoa = async (values) => {
    const {
      endereco: { pais, ...rest },
    } = values;

    const body = {
      ...values,
      email: values?.email === "" ? null : values?.email,
      endereco: { ...rest, ...(pais.cod ? { pais } : {}) },
    };

    return await updatePessoa.mutateAsync({
      id: documentoFiscal?.pessoa?._id,
      body,
    });
  };

  const servicosQuery = useQuery({
    queryKey: [
      "listar-servicos-pessoa",
      { pessoaId: documentoFiscal?.pessoa?._id },
    ],
    queryFn: async () =>
      await ServicoService.listarServicosPorPessoa({
        pessoaId: documentoFiscal?.pessoa?._id,
      }),
  });

  const options = servicosQuery.data?.servicos?.map((e) => ({
    label: `${e?.tipoServicoTomado ?? ""} ${
      e?.descricao ?? ""
    } ${currency.format(e?.valor ?? 0)}`,

    value: e?._id,
  }));

  const aoAprovarDocumento = async (values) => {
    const { action } = await requestConfirmation({
      title: "Deseja criar ticket ?",
      description:
        "Um ticket será criado usando os serviços e o prestador vinculado!",
    });

    if (action === "confirmed") {
      return await onAprovarDocumento({
        servicos: values?.servicos,
        ticket: true,
      });
    }

    return await onAprovarDocumento({
      servicos: values?.servicos,
    });
  };

  return (
    <form onSubmit={handleSubmit(aoAprovarDocumento)}>
      <Box>
        <Box mt="2">
          <Flex gap="4" alignItems="center" justifyContent="space-between">
            <Text color="gray.600" fontSize="sm">
              Prestador
            </Text>
            <VisibilityControlDialog
              fields={flatFormFields({ fields })}
              setVisibilityState={setInputsVisibility}
              visibilityState={inputsVisibility}
              title="Ocultar inputs"
            />
          </Flex>
        </Box>
        <Box mt="6">
          <BuildForm
            fields={fields}
            data={{
              ...documentoFiscal.pessoa,
              pessoaFisica: {
                ...documentoFiscal?.pessoa?.pessoaFisica,
                dataNascimento: formatDateToDDMMYYYY(
                  documentoFiscal?.pessoa?.pessoaFisica?.dataNascimento
                ),
              },
            }}
            shouldUseFormValues={true}
            visibleState={inputsVisibility}
            onSubmit={onSubmitPessoa}
            gridColumns={2}
            gap={4}
          />
        </Box>
        <Box px="1" mt="8">
          <Text color="gray.600" fontSize="sm" fontWeight="medium">
            Adicionar Serviço
          </Text>
          <Controller
            control={control}
            name="servicos"
            render={({ field }) => (
              <Select
                isMulti
                options={options}
                onChange={field.onChange}
                value={field.value}
              />
            )}
          />
        </Box>
        <Box p="4" />
        <Button
          type="submit"
          disabled={isPending}
          variant="surface"
          shadow="xs"
          colorPalette="green"
          size="xs"
        >
          <Check /> Aprovar
        </Button>
      </Box>
    </form>
  );
};
