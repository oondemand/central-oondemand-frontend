import { Button, Flex, Text, Box, Accordion, Spinner } from "@chakra-ui/react";

import {
  FileUploadRoot,
  FileUploadTrigger,
} from "../../../components/ui/file-upload";

import { useMutation, useQuery, keepPreviousData } from "@tanstack/react-query";
import { ServicoService } from "../../../service/servico";
import { queryClient } from "../../../config/react-query";
import { toaster } from "../../../components/ui/toaster";
import { Download, Upload } from "lucide-react";
import { api } from "../../../config/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

export const ImportServicosPage = () => {
  const [open, setOpen] = useState([0]);

  const { mutateAsync: importServicosMutation, isPending } = useMutation({
    mutationFn: async ({ files }) =>
      await ServicoService.importarServicos({ files }),
    onSuccess() {
      queryClient.refetchQueries(["listar-servicos"]);
      queryClient.invalidateQueries(["list-servicos-importados"]);
      toaster.create({
        title: "Arquivo enviado com sucesso",
        description: "Aguardando processamento.",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao enviar arquivo!",
        type: "error",
      });
    },
  });

  const { data } = useQuery({
    queryKey: ["list-servicos-importados"],
    queryFn: async () => {
      const { data } = await api.get("/importacoes?tipo=servico&pageSize=5");
      return data;
    },
    placeholderData: keepPreviousData,
    refetchInterval: ({ state }) => {
      const hasPendingImports = state?.data?.results?.some((importacao) => {
        return !importacao?.detalhes;
      });
      const pollingTime = 30000; // 30s
      return hasPendingImports ? pollingTime : false;
    },
  });

  const handleDownloadFile = async ({ buffer, name, type }) => {
    try {
      const byteArray = new Uint8Array(buffer);
      const blob = new Blob([byteArray], { type });
      saveAs(blob, name);
    } catch (error) {
      console.log("error");
    }
  };

  return (
    <Flex
      flex="1"
      flexDir="column"
      py="8"
      px="6"
      gap="4"
      bg="#F8F9FA"
      overflowY="auto"
    >
      <Flex
        bg="white"
        p="6"
        alignItems="end"
        rounded="lg"
        justifyContent="space-between"
      >
        <Box>
          <Text fontSize="lg" fontWeight="semibold">
            Importar Servicos
          </Text>
          <Text fontSize="sm" color="gray.500">
            Selecione a planilha que deseja importar
          </Text>
        </Box>
        <Box>
          <FileUploadRoot
            accept=".xlsx, .xls, .xlsm, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onFileAccept={async (e) => {
              await importServicosMutation({ files: e.files });
            }}
            maxFiles={1}
          >
            <FileUploadTrigger>
              <Button
                disabled={isPending}
                colorPalette="cyan"
                fontWeight="bold"
              >
                <Upload color="white" /> Selecionar Planilha
              </Button>
            </FileUploadTrigger>
          </FileUploadRoot>
        </Box>
      </Flex>

      {data?.results &&
        data?.results?.length > 0 &&
        data?.results.map((importacao, index) => {
          return (
            <Flex w="full" bg="white" p="6" rounded="lg" gap="16">
              <Accordion.Root
                variant="plain"
                collapsible
                value={open}
                onValueChange={(e) => setOpen(e.value)}
              >
                <Accordion.Item value={index}>
                  <Accordion.ItemTrigger
                    justifyContent="space-between"
                    alignItems="start"
                  >
                    <Flex gap="4" alignItems="start">
                      <Box>
                        <Text fontWeight="semibold" fontSize="lg">
                          Resumo importação:
                        </Text>
                        <Text fontSize="sm" mt="1" color="gray.400">
                          {format(importacao?.createdAt, "MMMM dd yyyy", {
                            locale: ptBR,
                          })}
                        </Text>
                      </Box>
                      <Text color="gray.500">
                        {importacao?.arquivoOriginal?.nome}
                      </Text>
                    </Flex>
                    <Accordion.ItemIndicator />
                  </Accordion.ItemTrigger>
                  <Accordion.ItemContent>
                    <Accordion.ItemBody>
                      {importacao?.detalhes && (
                        <Box>
                          <Flex mt="1" gap="8">
                            <Box>
                              <Text fontSize="sm" color="gray.600">
                                Total de linhas lidas
                              </Text>
                              <Text fontSize="2xl" fontWeight="bold">
                                {data
                                  ? importacao.detalhes?.totalDeLinhasLidas
                                  : "..."}
                              </Text>
                            </Box>

                            <Box>
                              <Text fontSize="sm" color="gray.600">
                                Total de novos servicos
                              </Text>
                              <Text fontSize="2xl" fontWeight="bold">
                                {data
                                  ? importacao.detalhes?.novosServicos
                                  : "..."}
                              </Text>
                            </Box>

                            <Box>
                              <Text fontSize="sm" color="gray.600">
                                Linhas com erros
                              </Text>
                              <Text
                                fontSize="2xl"
                                color="red.500"
                                fontWeight="bold"
                              >
                                {data
                                  ? importacao.detalhes?.linhasLidasComErro
                                  : "..."}
                              </Text>
                            </Box>
                          </Flex>

                          <Flex mt="6" gap="8">
                            <Button
                              onClick={() => {
                                handleDownloadFile({
                                  buffer:
                                    importacao?.arquivoOriginal?.buffer?.data,
                                  name: importacao?.arquivoOriginal?.nome,
                                  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                });
                              }}
                              unstyled
                              fontSize="sm"
                              color="gray.500"
                              display="flex"
                              alignItems="center"
                              gap="2"
                              cursor="pointer"
                            >
                              <Download size={14} /> Arquivo
                            </Button>

                            <Button
                              onClick={() => {
                                handleDownloadFile({
                                  buffer: importacao?.arquivoErro?.data,
                                  name: "arquivo-erros",
                                  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                });
                              }}
                              unstyled
                              fontSize="sm"
                              color="gray.500"
                              display="flex"
                              alignItems="center"
                              gap="2"
                              cursor="pointer"
                            >
                              <Download size={14} /> Arquivo de erro
                            </Button>

                            <Button
                              onClick={() => {
                                handleDownloadFile({
                                  buffer: importacao?.arquivoLog?.data,
                                  name: "logs-errors",
                                  type: "text/plain",
                                });
                              }}
                              unstyled
                              fontSize="sm"
                              color="gray.500"
                              display="flex"
                              alignItems="center"
                              gap="2"
                              cursor="pointer"
                            >
                              <Download size={14} /> Logs
                            </Button>
                          </Flex>
                        </Box>
                      )}

                      {!importacao?.detalhes && (
                        <Flex gap="4" alignItems="center">
                          <Spinner size="sm" color="gray.400" />
                          <Text
                            fontSize="lg"
                            fontWeight="semibold"
                            color="gray.300"
                          >
                            Processando
                          </Text>
                        </Flex>
                      )}
                    </Accordion.ItemBody>
                  </Accordion.ItemContent>
                </Accordion.Item>
              </Accordion.Root>
            </Flex>
          );
        })}
    </Flex>
  );
};
