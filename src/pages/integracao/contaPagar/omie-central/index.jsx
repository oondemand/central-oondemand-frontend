import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "../../../../styles/swiper.css";

import { Flex, Spinner, Heading, Button } from "@chakra-ui/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Etapa } from "../../../../components/etapaCard";
import { IntegracaoService } from "../../../../service/integracao";
import { Filter, RefreshCcw, Table } from "lucide-react";
import { DebouncedInput } from "../../../../components/DebouncedInput";
import { useStateWithStorage } from "../../../../hooks/useStateStorage";
import { SelectTime } from "../../../../components/selectTime";
import {
  INTEGRACAO_DIRECAO_MAP,
  INTEGRACAO_OMIE_ETAPAS_PADRAO,
  INTEGRACAO_TIPO_MAP,
} from "../../../../constants";
import { Card } from "../../components/card";
import { TimeOutButton } from "../../../../components/timeOutButton";
import { Tooltip } from "../../../../components/ui/tooltip";
import { Link } from "react-router-dom";
import { TicketDetailsDialog } from "../../components/dialog";
import { TicketActions } from "../../components/dialog/actions";
import { queryClient } from "../../../../config/react-query";
import { TicketBody } from "./dialogBody";
import { useCallback } from "react";
import { useQueryParam } from "../../../../hooks/useQueryParam";
import { ORIGENS } from "../../../../constants/origens";

export const IntegracaoContaPagarOmieCentralEsteira = () => {
  const [searchTerm, setSearchTerm] = useQueryParam("searchTerm");

  const [time, setTime] = useStateWithStorage(
    "esteira_integracao_conta_pagar_omie_central_time",
    1
  );

  const filters = {
    direcao: INTEGRACAO_DIRECAO_MAP.OMIE_CENTRAL,
    tipo: INTEGRACAO_TIPO_MAP.CONTA_PAGAR,
    time: time,
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["integracao-conta-pagar-omie-central-listar", { filters }],
    queryFn: async () => await IntegracaoService.listar({ filters }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 1, // 1 minuto
    refetchInterval: 1000 * 10, // 10 sec
  });

  const filteredTickets =
    searchTerm?.toLowerCase()?.trim()?.length > 2
      ? data?.results?.filter((ticket) => {
          const term = searchTerm?.toLowerCase()?.trim();
          return (
            ticket?.titulo?.toLowerCase()?.includes(term) ||
            ticket?.payload?.conta_pagar?.documento
              ?.toLowerCase()
              ?.includes(term.replace(/[^a-zA-Z0-9]/g, "")) ||
            ticket?.parentId === term ||
            ticket?._id === term
          );
        })
      : data?.results;

  const card = useCallback(
    (props) => (
      <Card ticket={props.ticket}>
        <TicketDetailsDialog
          tipoDeIntegracao="conta_pagar"
          actions={(props) => (
            <TicketActions {...props} origem={ORIGENS.ESTEIRA} />
          )}
        >
          <TicketBody />
        </TicketDetailsDialog>
      </Card>
    ),
    []
  );

  return (
    <Flex flex="1" flexDir="column" py="8" px="6" bg="#F8F9FA">
      <Flex pb="4" justifyContent="space-between">
        <Flex alignItems="center" gap="2">
          <Heading color="gray.700" fontSize="2xl">
            Integração conta pagar omie {"->"} central
          </Heading>

          <Tooltip content="Sincronizar com omie">
            <TimeOutButton onClick={() => IntegracaoService.processar(filters)}>
              <RefreshCcw />
            </TimeOutButton>
          </Tooltip>

          <Tooltip content="Visualizar todos em tabela">
            <Link to="/integracao/conta-pagar/omie-central/todos">
              <Button
                color="purple.700"
                bg="purple.200"
                p="1.5"
                rounded="2xl"
                cursor="pointer"
                size="sm"
              >
                <Table />
              </Button>
            </Link>
          </Tooltip>

          {(isLoading || isFetching) && <Spinner size="md" />}
        </Flex>
        <Flex alignItems="center" color="gray.400" gap="3">
          <Tooltip content="Limpar filtros">
            <Button cursor="pointer" unstyled onClick={() => setSearchTerm("")}>
              <Filter size={24} />
            </Button>
          </Tooltip>

          <SelectTime
            value={[time]}
            onValueChange={(value) => {
              queryClient.invalidateQueries([
                "integracao-conta-pagar-omie-central-listar",
              ]);
              setTime(Number(value[0]));
            }}
          />

          <DebouncedInput
            size="xs"
            w="sm"
            bg="white"
            placeholder="Pesquisar..."
            rounded="sm"
            _placeholder={{ color: "gray.400" }}
            placeIcon="right"
            iconSize={16}
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </Flex>
      </Flex>
      <Flex flex="1" pb="2" itens="center" overflow="hidden">
        {!isLoading && filteredTickets && INTEGRACAO_OMIE_ETAPAS_PADRAO && (
          <Swiper
            style={{
              height: "100%",
              width: "100%",
            }}
            slidesPerView="auto"
            spaceBetween={16}
            freeMode={true}
            grabCursor={true}
            modules={[FreeMode, Navigation]}
            navigation={true}
          >
            {INTEGRACAO_OMIE_ETAPAS_PADRAO?.map((etapa) => (
              <SwiperSlide
                key={etapa._id}
                style={{ minWidth: "250px", maxWidth: "250px" }}
              >
                <Etapa etapa={etapa} tickets={filteredTickets} card={card} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Flex>
    </Flex>
  );
};
