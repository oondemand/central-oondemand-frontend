import {
  Box,
  Text,
  Button,
  Flex,
  Textarea,
  createListCollection,
  useDialogContext,
} from "@chakra-ui/react";

import { CircleX } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toaster } from "../../../../components/ui/toaster";
import { DocumentosFiscaisService } from "../../../../service/documentos-fiscais";
import { queryClient } from "../../../../config/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ListaOmieService } from "../../../../service/lista-omie";

import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../../../../components/ui/select";
import { ORIGENS } from "../../../../constants/origens";

const reprovacaoSchema = z.object({
  motivoRecusa: z.string({ message: "Selecione um motivo." }),
  observacao: z.string().optional(),
  observacaoPrestador: z.string().optional(),
});

export const ReprovarForm = ({ documentoFiscalId }) => {
  const { setOpen } = useDialogContext();
  const { data } = useQuery({
    queryKey: ["list-motivo-recusa-documento-fiscal"],
    queryFn: async () =>
      ListaOmieService.getListByCode({ cod: "motivo-recusa-documento-fiscal" }),
  });

  const motivoRecusaList = createListCollection({
    items:
      data?.lista?.data?.map((item) => ({
        value: item?.valor,
        label: item?.valor,
      })) ?? [],
  });

  const { mutateAsync: reprovarDocumento } = useMutation({
    mutationFn: async ({ motivoRecusa, observacao, observacaoPrestador }) =>
      await DocumentosFiscaisService.reprovarDocumentoFiscal({
        body: {
          motivoRecusa,
          observacao,
          // observacaoPrestador,
          statusValidacao: "recusado",
        },
        id: documentoFiscalId,
        origem: ORIGENS.APROVACAO_DOCUMENTO_FISCAL,
      }),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["listar-documentos-fiscais"],
      });
      toaster.create({
        title: "Documento fiscal reprovado com sucesso!",
        type: "success",
      });
      setOpen(false);
    },
    onError: () => {
      toaster.create({
        title: "Ouve um erro ao reprovar o documento fiscal!",
        type: "error",
      });
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reprovacaoSchema),
    defaultValues: {
      observacao: "",
      motivoRecusa: null,
      observacaoPrestador: "",
    },
  });

  const handleReprovarDocumento = async (data) => {
    await reprovarDocumento(data);
  };

  return (
    <Box>
      <Flex gap="2">
        <Box w="full">
          <form onSubmit={handleSubmit(handleReprovarDocumento)}>
            <Box>
              <Box>
                <Controller
                  control={control}
                  name="motivoRecusa"
                  render={({ field }) => (
                    <SelectRoot
                      size="xs"
                      value={[field.value]}
                      onValueChange={({ value }) => field.onChange(value[0])}
                      collection={motivoRecusaList}
                    >
                      <SelectLabel mb="-1" fontWeight="normal" color="gray.500">
                        Motivo da recusa
                      </SelectLabel>
                      <SelectTrigger>
                        <SelectValueText placeholder="Selecionar motivo..." />
                      </SelectTrigger>
                      <SelectContent zIndex={9999}>
                        {motivoRecusaList.items.map((item) => (
                          <SelectItem item={item} key={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectRoot>
                  )}
                />
                {errors.motivoRecusa && (
                  <Text fontSize="xs" color="red.500">
                    {errors.motivoRecusa.message}
                  </Text>
                )}
              </Box>
              <Box p="2" />
              <Box>
                <Text fontSize="sm" color="gray.600">
                  Observação
                </Text>
                <Textarea
                  {...register("observacao")}
                  placeholder="Digite a observação"
                  size="sm"
                  resize="none"
                  rows={3}
                />
              </Box>
              <Box p="2" />
              {/* <Box>
                <Text fontSize="sm" color="gray.600">
                  Observação para o prestador
                </Text>
                <Textarea
                  {...register("observacaoPrestador")}
                  placeholder="Digite a observação para o prestador"
                  size="sm"
                  resize="none"
                  rows={3}
                />
              </Box> */}
              <Box p="2" />
              <Button
                type="submit"
                variant="surface"
                shadow="xs"
                colorPalette="red"
                size="xs"
              >
                <CircleX /> Reprovar
              </Button>
            </Box>
          </form>
        </Box>
      </Flex>
    </Box>
  );
};
