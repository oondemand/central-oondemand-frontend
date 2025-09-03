import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  Table,
  Text,
} from "@chakra-ui/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { FileCheck2, PiggyBank, RotateCcw, Wallet } from "lucide-react";
import { DashboardService } from "../../service/dashboard";

import { currency } from "../../utils/currency";
import { IntegracaoCard } from "./integracaoCard";
import { MoedaService } from "../../service/moeda";
import { differenceInMinutes, differenceInHours } from "date-fns";

const getMoedaStatusByUpdatedTime = ({ moeda }) => {
  const now = new Date();
  const minDiff = differenceInMinutes(now, moeda.atualizadoEm);
  const hoursDiff = differenceInHours(now, moeda.atualizadoEm);

  if (moeda.sigla === "BRL") return "green.400";

  if (minDiff < 10) return "green.400";
  if (hoursDiff < 24) return "orange.400";

  return "red.500";
};

export const Dashboard = () => {
  const { data } = useQuery({
    queryFn: DashboardService.estatisticas,
    queryKey: ["dashboard-estatisticas"],
    staleTime: 1000 * 60, //1m
    placeholderData: keepPreviousData,
  });

  const moedasQuery = useQuery({
    queryKey: ["listar-moedas-ativas"],
    queryFn: MoedaService.listarAtivas,
    staleTime: 1000 * 60, // 1m
  });

  const integracao = data?.estatisticas?.integracao;

  const valorTotalTodosServicos = data?.estatisticas?.valoresPorStatus?.reduce(
    (acc, cur) => {
      return acc + cur.total;
    },
    0
  );

  const quantidadeTotalDeServicos =
    data?.estatisticas?.valoresPorStatus?.reduce((acc, cur) => {
      return acc + cur.count;
    }, 0);

  const servicoStatusColorMap = {
    processando: "purple.500",
    aberto: "blue.500",
    pendente: "orange.500",
    pago: "green.500",
    "pago-externo": "green.200",
    arquivado: "gray.500",
  };

  const ticketStatusColorMap = {
    "aguardando-inicio": "yellow.500",
    trabalhando: "green.500",
    revisao: "red.500",
    concluido: "blue.500",
    arquivado: "gray.500",
  };

  const ticketEtapaMap = {
    "geracao-rpa": "Geração RPA",
    "aprovacao-cadastro": "Aprovacao cadastro",
    "integracao-omie": "Financeiro",
    "aprovacao-fiscal": "Aprovacao fiscal",
    requisicao: "Requisicao",
  };

  return (
    <Flex flex="1" flexDir="column" py="8" px="6" bg="#F8F9FA">
      <Text color="gray.400" fontSize="xs">
        Visão geral
      </Text>
      <Text color="gray.700" fontSize="lg">
        {format(new Date(), "MMMM yyyy", { locale: ptBR })}
      </Text>
      <Flex gap="8">
        <Box mt="6" w="80" bg="brand.500" p="6" rounded="2xl">
          <Flex>
            <Flex alignItems="center" gap="4">
              <Box bg="white" rounded="lg" p="1">
                <PiggyBank size={36} color="#0474AF" />
              </Box>
              <Text color="gray.100" fontWeight="medium">
                Valor total <br /> dos serviços
              </Text>
            </Flex>
          </Flex>
          <Text color="white" mt="4" fontSize="3xl" fontWeight="bold">
            {currency.format(valorTotalTodosServicos ?? 0)}
          </Text>
        </Box>

        <Box mt="6" w="72" bg="white" p="6" rounded="2xl">
          <Box display="inline-block" bg="brand.500" rounded="2xl" p="2.5">
            <Wallet size={24} color="white" />
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.400" fontWeight="medium">
              Total de serviços
            </Text>
            <Text color="gray.700" mt="1" fontWeight="bold">
              {quantidadeTotalDeServicos}
            </Text>
          </Box>
        </Box>

        <Box mt="6" w="72" bg="white" p="6" rounded="2xl">
          <Box display="inline-block" bg="brand.500" rounded="2xl" p="2.5">
            <FileCheck2 size={24} color="white" />
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.400" fontWeight="medium">
              Pago
            </Text>
            <Text color="gray.700" mt="1" fontWeight="bold">
              {currency.format(
                (data?.estatisticas?.valoresPorStatus?.find(
                  (e) => e.status === "pago"
                )?.total ?? 0) +
                  (data?.estatisticas?.valoresPorStatus?.find(
                    (e) => e.status === "pago-externo"
                  )?.total ?? 0)
              )}
            </Text>
          </Box>
        </Box>

        <Box mt="6" w="72" bg="white" p="6" rounded="2xl">
          <Box display="inline-block" bg="brand.500" rounded="2xl" p="2.5">
            <RotateCcw size={24} color="white" />
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.400" fontWeight="medium">
              Em processamento
            </Text>
            <Text color="gray.700" mt="1" fontWeight="bold">
              {currency.format(
                data?.estatisticas?.valoresPorStatus?.find(
                  (e) => e.status === "processando"
                )?.total ?? 0
              )}
            </Text>
          </Box>
        </Box>
      </Flex>

      <Flex gap="10" mt="8">
        {data?.estatisticas?.ticketPorStatus?.length > 0 && (
          <Box>
            <Box maxW="600px" bg="white" p="4" rounded="2xl">
              <Text fontWeight="semibold">Tickets por status</Text>
              <Table.Root mt="4">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader
                      fontSize="xs"
                      color="gray.500"
                      fontWeight="light"
                      py="1"
                    >
                      STATUS
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      fontSize="xs"
                      color="gray.500"
                      fontWeight="light"
                      py="1"
                    >
                      QUANTIDADE
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {data?.estatisticas?.ticketPorStatus?.map((item) => (
                    <Table.Row>
                      <Table.Cell
                        display="flex"
                        gap="2"
                        alignItems="center"
                        border="none"
                      >
                        <Box
                          h="3"
                          w="3"
                          rounded="full"
                          bg={ticketStatusColorMap[item.status]}
                        />
                        {item.status}
                      </Table.Cell>
                      <Table.Cell border="none">{item.count}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </Box>
        )}

        {data?.estatisticas?.ticketPorEtapa?.length > 0 && (
          <Box>
            <Box maxW="600px" bg="white" p="4" rounded="2xl">
              <Text fontWeight="semibold">Tickets por etapa</Text>
              <Table.Root mt="4">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader
                      fontSize="xs"
                      color="gray.500"
                      fontWeight="light"
                      py="1"
                    >
                      ETAPA
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      fontSize="xs"
                      color="gray.500"
                      fontWeight="light"
                      py="1"
                    >
                      QUANTIDADE
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {data?.estatisticas?.ticketPorEtapa?.map((item) => {
                    if (!ticketEtapaMap[item.etapa]) return;
                    return (
                      <Table.Row>
                        <Table.Cell
                          display="flex"
                          gap="2"
                          alignItems="center"
                          border="none"
                        >
                          {ticketEtapaMap[item.etapa]?.toLowerCase()}
                        </Table.Cell>
                        <Table.Cell border="none">{item.count}</Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table.Root>
            </Box>
          </Box>
        )}

        {data?.estatisticas?.valoresPorStatus?.length > 0 && (
          <Box>
            <Box maxW="600px" bg="white" p="4" rounded="2xl">
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontWeight="semibold">Serviços por status</Text>
              </Flex>
              <Table.Root mt="4">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader
                      fontSize="xs"
                      color="gray.500"
                      fontWeight="light"
                      py="1"
                    >
                      STATUS
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      fontSize="xs"
                      color="gray.500"
                      fontWeight="light"
                      py="1"
                    >
                      QUANTIDADE
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      fontSize="xs"
                      color="gray.500"
                      fontWeight="light"
                      py="1"
                    >
                      VALOR TOTAL
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {data?.estatisticas?.valoresPorStatus?.map((item) => (
                    <Table.Row>
                      <Table.Cell
                        display="flex"
                        gap="2"
                        alignItems="center"
                        border="none"
                      >
                        <Box
                          h="3"
                          w="3"
                          rounded="full"
                          bg={servicoStatusColorMap[item.status]}
                        />
                        {item.status}
                      </Table.Cell>
                      <Table.Cell border="none">{item.count}</Table.Cell>
                      <Table.Cell truncate border="none">
                        <Text truncate>
                          {currency.format(item?.total ?? 0)}
                        </Text>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </Box>
        )}

        {moedasQuery?.data?.moedas && (
          <Box>
            {/* <Text color="gray.400" fontSize="sm" mb="2">
              Sincronização de moedas
            </Text> */}
            <Box maxW="600px" bg="white" p="4" rounded="2xl">
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontWeight="semibold">Moedas</Text>
              </Flex>
              <Table.Root mt="4">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader
                      fontSize="xs"
                      color="gray.500"
                      fontWeight="light"
                      py="1"
                    >
                      SIGLA
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      fontSize="xs"
                      color="gray.500"
                      fontWeight="light"
                      py="1"
                    >
                      COTAÇÃO
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {moedasQuery?.data?.moedas?.map((item) => (
                    <Table.Row>
                      <Table.Cell
                        display="flex"
                        gap="2"
                        alignItems="center"
                        border="none"
                      >
                        <Box
                          h="3"
                          w="3"
                          rounded="full"
                          bg={getMoedaStatusByUpdatedTime({ moeda: item })}
                        />
                        {item.sigla}
                      </Table.Cell>
                      <Table.Cell border="none">
                        {currency.format(item?.cotacao)}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </Box>
        )}
      </Flex>

      <Box mt="8">
        <Text color="gray.400" fontSize="sm">
          Integrações com Omie
        </Text>

        <Flex gap="10" mt="4" alignItems="flex-start">
          {integracao?.pessoa?.central_omie && (
            <IntegracaoCard
              title="Prestador central -> omie"
              link="/integracao/pessoa/central-omie"
              integracao={integracao.pessoa.central_omie}
            />
          )}

          {integracao?.pessoa?.omie_central && (
            <IntegracaoCard
              title="Prestador central <- omie"
              link="/integracao/pessoa/omie-central"
              integracao={integracao.pessoa.omie_central}
            />
          )}

          {integracao?.conta_pagar?.central_omie && (
            <IntegracaoCard
              title="Conta pagar central -> omie"
              link="/integracao/conta-pagar/central-omie"
              integracao={integracao?.conta_pagar?.central_omie}
            />
          )}

          {integracao?.conta_pagar?.omie_central && (
            <IntegracaoCard
              title="Conta pagar central <- omie"
              link="/integracao/conta-pagar/omie-central"
              integracao={integracao?.conta_pagar?.omie_central}
            />
          )}

          {integracao?.anexos?.central_omie && (
            <IntegracaoCard
              title="Anexos central -> omie"
              link="/integracao/anexos/central-omie"
              integracao={integracao?.anexos?.central_omie}
            />
          )}
        </Flex>
      </Box>
    </Flex>
  );
};
