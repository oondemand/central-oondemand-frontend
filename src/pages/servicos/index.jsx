import React, { useMemo } from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { ServicoService } from "../../service/servico";
import { DataGrid } from "../../components/dataGrid";
import { makeDynamicColumns } from "./columns";
import { queryClient } from "../../config/react-query";
import { ServicosDialog } from "./dialog";
import { useNavigate } from "react-router-dom";
import { useDataGrid } from "../../hooks/useDataGrid";
import { useUpdateServico } from "../../hooks/api/servico/useUpdateServico";
import { ORIGENS } from "../../constants/origens";

export const ServicosList = () => {
  const navigate = useNavigate();
  const columns = useMemo(() => makeDynamicColumns(), []);
  const { filters, table } = useDataGrid({ columns, key: "SERVICOS" });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["listar-servicos", { filters }],
    queryFn: async () => await ServicoService.listarServicos({ filters }),
    placeholderData: keepPreviousData,
  });

  const updateServico = useUpdateServico({
    origem: ORIGENS.DATAGRID,
    onSuccess: () => {
      queryClient.refetchQueries(["listar-servicos", { filters }]);
    },
  });

  const getAllServicosWithFilters = async (pageSize) => {
    const response = await ServicoService.exportarServicos({
      filters: {
        ...filters,
        pageSize: pageSize ? pageSize : data?.pagination?.totalItems,
        pageIndex: 0,
      },
    });

    return response.data.buffer;
  };

  return (
    <>
      <Flex
        flex="1"
        pt="8"
        px="6"
        pb="2"
        itens="center"
        overflow="auto"
        scrollbarWidth="thin"
        bg="#F8F9FA"
      >
        <Box>
          <Text fontSize="lg" color="gray.700" fontWeight="semibold">
            Servicos
          </Text>
          <Box mt="4" bg="white" py="6" px="4" rounded="lg" shadow="xs">
            <DataGrid
              form={ServicosDialog}
              exportDataFn={getAllServicosWithFilters}
              importDataFn={() => navigate("/servicos/importacao")}
              table={table}
              data={data?.results || []}
              rowCount={data?.pagination?.totalItems}
              isDataLoading={isLoading || isFetching}
              onUpdateData={async (values) => {
                await updateServico.mutateAsync({
                  id: values.id,
                  body: values.data,
                });
              }}
            />
          </Box>
        </Box>
      </Flex>
    </>
  );
};
