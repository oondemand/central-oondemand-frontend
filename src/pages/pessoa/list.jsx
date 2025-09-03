import React, { useMemo } from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { PessoaService } from "../../service/pessoa";
import { DataGrid } from "../../components/dataGrid";
import { makeDynamicColumns } from "./columns";
import { queryClient } from "../../config/react-query";
import { PessoasDialog } from "./dialog";
import { useNavigate } from "react-router-dom";
import { useDataGrid } from "../../hooks/useDataGrid";
import { useUpdatePessoa } from "../../hooks/api/pessoa/useUpdatePessoa";
import { ORIGENS } from "../../constants/origens";

export const PessoasList = () => {
  const navigate = useNavigate();
  const columns = useMemo(() => makeDynamicColumns(), []);
  const { filters, table } = useDataGrid({ columns, key: "PESSOAS" });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["listar-pessoas", { filters }],
    queryFn: async () => await PessoaService.listarPessoas({ filters }),
    placeholderData: keepPreviousData,
  });

  const updatePessoa = useUpdatePessoa({
    origem: ORIGENS.DATAGRID,
    onSuccess: () => {
      queryClient.refetchQueries(["listar-pessoas", { filters }]);
    },
  });

  const getAllPessoasWithFilters = async (pageSize) => {
    const response = await PessoaService.exportarPessoas({
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
            Prestadores
          </Text>
          <Box mt="4" bg="white" py="6" px="4" rounded="lg" shadow="xs">
            <DataGrid
              form={PessoasDialog}
              exportDataFn={getAllPessoasWithFilters}
              importDataFn={() => navigate("/pessoas/importacao")}
              table={table}
              data={data?.results || []}
              rowCount={data?.pagination?.totalItems}
              isDataLoading={isLoading || isFetching}
              onUpdateData={async (values) => {
                await updatePessoa.mutateAsync({
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
