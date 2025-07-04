import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import "../../styles/swiper.css";

import { Flex, Spinner, Heading } from "@chakra-ui/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Etapa } from "../../components/etapaCard";
import { ServicoTomadoTicketService } from "../../service/servicoTomadoTicket";
import { Filter } from "lucide-react";
import { DebouncedInput } from "../../components/DebouncedInput";
import { useStateWithStorage } from "../../hooks/useStateStorage";
import { useListEtapas } from "../../hooks/api/etapas/useListEtapas";

export const ServicosTomados = () => {
  const [searchTerm, setSearchTerm] = useStateWithStorage("searchTerm");
  const { etapas, isLoading: isEtapasLoading } = useListEtapas();

  const {
    data,
    error: ticketsError,
    isLoading: isTicketLoading,
    isFetching: isTicketFetching,
  } = useQuery({
    queryKey: ["listar-tickets"],
    queryFn: async () => ServicoTomadoTicketService.listarTickets(),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 1, // 1 minuto
    onSuccess: (data) => setTickets(data),
  });

  const filteredTickets =
    searchTerm?.toLowerCase()?.trim()?.length > 2
      ? data?.tickets?.filter((ticket) => {
          const term = searchTerm?.toLowerCase()?.trim();
          return (
            ticket?.titulo?.toLowerCase()?.includes(term) ||
            ticket?.pessoa?.documento
              ?.toLowerCase()
              ?.includes(term.replace(/[^a-zA-Z0-9]/g, ""))
          );
        })
      : data?.tickets;

  return (
    <Flex flex="1" flexDir="column" py="8" px="6" bg="#F8F9FA">
      <Flex pb="4" justifyContent="space-between">
        <Flex alignItems="center" gap="2">
          <Heading color="gray.700" fontSize="2xl">
            Central de Serviços Tomados{" "}
          </Heading>
          {(isEtapasLoading || isTicketLoading || isTicketFetching) && (
            <Spinner size="md" />
          )}
        </Flex>
        <Flex alignItems="center" color="gray.400" gap="3">
          <Filter size={24} />
          <DebouncedInput
            size="xs"
            w="sm"
            bg="white"
            placeholder="Pesquise por nome, cpf, ou cnpj..."
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
        {(!isEtapasLoading || !isTicketLoading) &&
          filteredTickets &&
          etapas && (
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
              {etapas?.map((etapa) => (
                <SwiperSlide
                  key={etapa._id}
                  style={{ minWidth: "250px", maxWidth: "250px" }}
                >
                  <Etapa etapa={etapa} tickets={filteredTickets} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
      </Flex>
    </Flex>
  );
};
