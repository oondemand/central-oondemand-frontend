import { Box, Flex, Heading, Textarea, Input } from "@chakra-ui/react";
import React, { useState } from "react";

import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTitle,
} from "../ui/dialog";
import { queryClient } from "../../config/react-query";

import { Oondemand } from "../svg/oondemand";
import { PessoaForm } from "./form/pessoa";

import { useMutation } from "@tanstack/react-query";
import { ServicoTomadoTicketService } from "../../service/servicoTomadoTicket";

import { toaster } from "../ui/toaster";

import { TicketStatus } from "./ticketStatus";
import { TicketActions } from "./ticketActions";
import { FilesForm } from "./form/files";
import { ServicoForm } from "./form/servico";
import { InformacoesAdicionaisForm } from "./form/informacoes-adicionais";
import { DocumentoFiscalForm } from "./form/documentoFiscal";
import { useIaChat } from "../../hooks/useIaChat";
import { useQuery } from "@tanstack/react-query";
import { DocumentosCadastraisService } from "../../service/documentos-cadastrais";
import { ORIGENS } from "../../constants/origens";
import { useLoadAssistant } from "../../hooks/api/assistant-config/useLoadAssistant";

export const TicketModal = ({ open, setOpen, defaultValue, onlyReading }) => {
  const [ticket, setTicket] = useState(defaultValue);
  const { onOpen } = useIaChat();

  const { mutateAsync: createTicketMutation } = useMutation({
    mutationFn: async ({ body }) =>
      await ServicoTomadoTicketService.adicionarTicket({
        body,
        origem: ORIGENS.ESTEIRA,
      }),
    onSuccess: (data) => {
      toaster.create({
        title: "Ticket criado com sucesso!",
        type: "success",
      });

      setTicket(data?.ticket);
    },
  });

  const { mutateAsync: updateTicketMutation } = useMutation({
    mutationFn: async ({ id, body }) =>
      await ServicoTomadoTicketService.alterarTicket({
        id,
        body,
        origem: ORIGENS.ESTEIRA,
      }),
    onSuccess: (data) => {
      toaster.create({
        title: "Ticket atualizado com sucesso!",
        type: "success",
      });

      setTicket(data?.ticket);
    },
  });

  const onInputTicketFieldBlur = async ({ target: { name, value } }) => {
    if (value !== "" && !ticket) {
      return await createTicketMutation({
        body: {
          [name]: value,
        },
      });
    }

    if (value !== "" && value !== ticket?.[name]) {
      return await updateTicketMutation({
        id: ticket._id,
        body: {
          [name]: value,
        },
      });
    }
  };

  const { data } = useQuery({
    queryKey: ["ticket", { ticketId: ticket?._id }],
    queryFn: async () =>
      await ServicoTomadoTicketService.carregarTicket(ticket?._id),
    staleTime: 1000 * 60 * 1, // 1 minute
    enabled: open,
  });

  // const { data: documentosCadastrais } = useQuery({
  //   queryKey: [
  //     "documentos-cadastrais",
  //     { prestadorId: ticket?.prestador?._id },
  //   ],
  //   queryFn: async () =>
  //     await DocumentosCadastraisService.listarDocumentosCadastraisPorPrestador({
  //       prestadorId: ticket?.prestador?._id,
  //       dataRegistro: "",
  //     }),
  //   staleTime: 1000 * 60 * 1, // 1 minute
  //   enabled: open,
  // });

  const { assistant } = useLoadAssistant(
    data?.ticket?.etapa
      ? `servicos-tomados.${data?.ticket?.etapa}`
      : "geral.servicos-tomados"
  );

  return (
    <DialogRoot
      size="cover"
      open={open}
      onOpenChange={({ open }) => {
        queryClient.invalidateQueries(["listar-tickets"]);
        setOpen(open);
      }}
    >
      <DialogContent
        overflow="hidden"
        w="1000px"
        h="95%"
        pt="6"
        px="2"
        rounded="lg"
      >
        <DialogTitle
          asChild
          borderBottom="1px solid"
          w="full"
          borderColor="gray.200"
        >
          <Flex gap="4" alignItems="center" mt="-4" py="2" px="4">
            <Box
              aria-label="Abrir IA"
              cursor="pointer"
              variant="unstyled"
              onClick={() => onOpen({ ...data }, assistant)}
            >
              <Oondemand />
            </Box>
            <Heading fontSize="sm">
              {defaultValue ? "Detalhes do ticket" : "Criar novo ticket"}
            </Heading>
          </Flex>
        </DialogTitle>
        <DialogBody
          pb="8"
          fontSize="md"
          fontWeight="600"
          color="gray.600"
          maxH="600px"
          overflowY="auto"
          className="dialog-custom-scrollbar"
        >
          <Flex mt="7" w="full" gap="4" justifyContent="space-between">
            <Input
              autoComplete="off"
              fontSize="md"
              borderBottom="none"
              focusRing="transparent"
              focusRingColor="transparent"
              outline="none"
              name="titulo"
              bg="white"
              onBlur={onInputTicketFieldBlur}
              variant="subtle"
              size="sm"
              placeholder="Titulo..."
              px="0"
              defaultValue={ticket?.titulo}
              disabled={onlyReading}
            />
            <TicketStatus
              disabled={onlyReading}
              ticketId={ticket?._id}
              ticketStatus={ticket?.status}
              updateTicketMutation={updateTicketMutation}
            />
          </Flex>
          <Textarea
            defaultValue={ticket?.observacao}
            name="observacao"
            disabled={onlyReading || !ticket}
            onBlur={onInputTicketFieldBlur}
            color="gray.600"
            fontWeight="medium"
            focusRingColor="gray.700"
            _placeholder={{ color: "gray.400", fontWeight: "medium" }}
            placeholder="Deixe observações pertinentes ao processo deste ticket"
            h="24"
            mt="3"
          />

          <PessoaForm
            onlyReading={onlyReading}
            ticket={ticket}
            updateTicketMutation={updateTicketMutation}
          />

          <ServicoForm
            onlyReading={onlyReading}
            ticket={ticket}
            updateTicketMutation={updateTicketMutation}
          />

          {/* <DocumentoFiscalForm
            onlyReading={onlyReading}
            ticket={ticket}
            updateTicketMutation={updateTicketMutation}
          /> */}

          <InformacoesAdicionaisForm
            ticket={ticket}
            updateTicketMutation={updateTicketMutation}
            onlyReading={onlyReading}
          />

          <FilesForm
            onlyReading={onlyReading}
            defaultValues={ticket?.arquivos}
            ticketId={ticket?._id}
          />
        </DialogBody>
        {defaultValue && (
          <DialogFooter justifyContent="start">
            <TicketActions
              updateTicketMutation={updateTicketMutation}
              ticketId={ticket._id}
              etapa={ticket?.etapa}
            />
          </DialogFooter>
        )}
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};
