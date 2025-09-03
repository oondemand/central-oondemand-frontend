import { Box, Flex, IconButton } from "@chakra-ui/react";
import { CloseButton } from "../../../components/ui/close-button";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ServicoTomadoTicketService } from "../../../service/servicoTomadoTicket";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import {
  DialogRoot,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { FilePenLine } from "lucide-react";
import { Tooltip } from "../../../components/ui/tooltip";
import { AprovarForm } from "./form/aprovar";
import { ReprovarForm } from "./form/reprovar";
import { useIaChat } from "../../../hooks/useIaChat";
import { Oondemand } from "../../../components/svg/oondemand";
import { useLoadAssistant } from "../../../hooks/api/assistant-config/useLoadAssistant";

export const ArquivoDetailsDialog = ({ documentoFiscal }) => {
  const [open, setOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const { data: response } = useQuery({
    queryKey: ["file/documento-fiscal", documentoFiscal?.arquivo?._id],
    queryFn: async () =>
      await ServicoTomadoTicketService.getFile({
        id: documentoFiscal?.arquivo?._id,
      }),
    enabled: open,
    staleTime: 1000 * 60 * 1, // 1 minute
  });

  useEffect(() => {
    if (response?.data?.arquivo?.buffer?.data) {
      const pdfBlob = new Blob(
        [new Uint8Array(response.data.arquivo.buffer.data)],
        {
          type: "application/pdf",
        }
      );
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [response]);

  const { onOpen } = useIaChat();
  const { assistant } = useLoadAssistant(["documento-fiscal.analise"]);

  const zoomPluginInstance = zoomPlugin();
  const { ZoomInButton, ZoomOutButton, ZoomPopover, zoomTo } =
    zoomPluginInstance;

  const handleDocumentLoad = () => {
    zoomTo("PageWidth");
  };

  return (
    <Box>
      <Box onClick={() => setOpen(true)}>
        <Tooltip
          content="Analisar documento fiscal"
          openDelay={1000}
          closeDelay={50}
        >
          <IconButton variant="surface" colorPalette="gray" size="2xs">
            <FilePenLine />
          </IconButton>
        </Tooltip>
      </Box>
      {open && (
        <DialogRoot
          size="cover"
          open={open}
          onOpenChange={(e) => {
            setOpen(e.open);
          }}
        >
          <DialogContent
            overflow="hidden"
            pt="6"
            px="2"
            rounded="lg"
            position="relative"
          >
            <DialogHeader
              mt="-4"
              py="3"
              px="4"
              borderBottom="1px solid"
              borderColor="gray.200"
              mb="6"
            >
              <Flex gap="4" alignItems="center">
                <Box
                  cursor="pointer"
                  variant="unstyled"
                  onClick={() => {
                    onOpen(
                      { ...documentoFiscal, arquivo: response?.data },
                      assistant
                    );
                  }}
                >
                  <Oondemand />
                </Box>
                <DialogTitle>Analisar Documento fiscal</DialogTitle>
              </Flex>
            </DialogHeader>
            <DialogBody>
              <Flex w="full" mt="-2" position="relative">
                <Box
                  w="58%"
                  ml="-4"
                  position="relative"
                  shadow="none"
                  boxShadow="none"
                  overflowY="auto"
                  className="dialog-custom-scrollbar"
                  h="730px"
                >
                  <Flex
                    top="4"
                    right="8"
                    gap="2"
                    justifyItems="center"
                    zIndex="10000"
                    position="absolute"
                    bg="gray.50"
                    p="1"
                    px="2"
                    pb="0"
                    rounded="4xl"
                  >
                    <ZoomOutButton />
                    <ZoomPopover />
                    <ZoomInButton />
                  </Flex>
                  {pdfUrl && (
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                      <Viewer
                        fileUrl={pdfUrl}
                        plugins={[zoomPluginInstance]}
                        onDocumentLoad={handleDocumentLoad}
                      />
                    </Worker>
                  )}
                </Box>

                <Flex
                  flex="1"
                  flexDir="column"
                  gap="6"
                  border="1px solid"
                  borderColor="gray.100"
                  rounded="2xl"
                  p="4"
                  pb="6"
                  ml="8"
                  overflowY="auto"
                  h="730px"
                  className="dialog-custom-scrollbar"
                >
                  <AprovarForm
                    prestadorId={documentoFiscal?.prestador?._id}
                    documentoFiscal={documentoFiscal}
                  />
                  <ReprovarForm documentoFiscalId={documentoFiscal?._id} />
                </Flex>
              </Flex>
            </DialogBody>
            <DialogCloseTrigger asChild>
              <CloseButton size="sm" />
            </DialogCloseTrigger>
          </DialogContent>
        </DialogRoot>
      )}
    </Box>
  );
};
