import { Flex, Button, useDialogContext, Text } from "@chakra-ui/react";
import { ListRestart, Trash } from "lucide-react";

import { toaster } from "../../../../components/ui/toaster";
import { useMutation } from "@tanstack/react-query";
import { useConfirmation } from "../../../../hooks/useConfirmation";
import { IntegracaoService } from "../../../../service/integracao";
import { queryClient } from "../../../../config/react-query";
import { Link } from "react-router-dom";
import { InvertedChart } from "../../../../components/svg/invertedChart";

export const TicketActions = ({ id, etapa, parentId, origem }) => {
  const { setOpen } = useDialogContext();
  const { requestConfirmation } = useConfirmation();

  const { mutateAsync: arquiveTicketMutation, isPending: isArquivePending } =
    useMutation({
      mutationFn: async () => await IntegracaoService.arquivar({ id, origem }),
      onSuccess: () => {
        queryClient.invalidateQueries();
        toaster.create({
          title: "Ticket arquivado com sucesso!",
          type: "success",
        });
      },
      onError: (error) => {
        toaster.error({
          title: "Ouve um erro ao arquivar o ticket!",
          description: error?.response?.data?.message,
        });
      },
    });

  const {
    mutateAsync: reprocessarTicketMutation,
    isPending: isReprocessingPending,
  } = useMutation({
    mutationFn: async () => await IntegracaoService.reprocessar({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries();
      toaster.create({
        title: "Ticket movido para etapa de reprocessamento!",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.error({
        title: "Ouve um erro ao reprocessar o ticket!",
        description: error?.response?.data?.message,
      });
    },
  });

  const handleArquiveTicket = async () => {
    const { action } = await requestConfirmation({
      title: "Tem que deseja arquivar ticket?",
      description: "Todo o seu progresso será perdido!",
    });

    if (action === "confirmed") {
      await arquiveTicketMutation();
      setOpen(false);
    }
  };

  return (
    <Flex alignItems="center" w="full" justifyContent="space-between">
      <Flex gap="2">
        {["falha"].includes(etapa) && (
          <Button
            disabled={isReprocessingPending || etapa === "sucesso"}
            onClick={async (e) => {
              await reprocessarTicketMutation();
              setOpen(false);
            }}
            variant="surface"
            shadow="xs"
            size="xs"
            colorPalette="green"
          >
            <ListRestart /> Reprocessar
          </Button>
        )}
        {["anexos"].includes(etapa) && (
          <Link
            to={`/integracao/anexos/central-omie?searchTerm=${parentId}`}
            viewTransition
          >
            <Button size="xs" shadow="xs" variant="surface" display="flex">
              <Text p="1" rounded="full" color="brand.500" cursor="pointer">
                <InvertedChart />
              </Text>
              <Text>Integração</Text>
            </Button>
          </Link>
        )}
        {!["processando"].includes(etapa) && (
          <Button
            disabled={isArquivePending}
            onClick={async (e) => {
              await handleArquiveTicket();
              setOpen(false);
            }}
            variant="surface"
            shadow="xs"
            size="xs"
          >
            <Trash /> Arquivar
          </Button>
        )}
      </Flex>
      <Button
        onClick={(e) => {
          setOpen(false);
        }}
        variant="surface"
        shadow="xs"
        size="xs"
      >
        Fechar
      </Button>
    </Flex>
  );
};
