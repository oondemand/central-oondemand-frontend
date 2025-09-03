import { Text, Flex } from "@chakra-ui/react";
import { currency } from "../../../../utils/currency";
import { CheckActionCell } from "../../../../components/dataGrid/actions/checkbox-cell";
import { DefaultCell } from "../../../../components/dataGrid/cells/default";
import { CurrencyCell } from "../../../../components/dataGrid/cells/currencyCell";
import { formatDateToDDMMYYYY } from "../../../../utils/formatting";
import { HeaderCheckActionCell } from "../../../../components/dataGrid/actions/header-checkbox-cell";
import { TotalSumFooterCell } from "../../../../components/dataGrid/cells/totalSumFooterCell";

export const makeServicoDynamicColumns = () => {
  const statusProcessamentoOptions = [
    { label: "Aberto", value: "aberto" },
    { label: "Pendente", value: "pendente" },
    { label: "Processando", value: "processando" },
    { label: "Pago", value: "pago" },
    { label: "Pago externo", value: "pago-externo" },
  ];

  return [
    {
      accessorKey: "acoes",
      header: (props) => <HeaderCheckActionCell {...props} />,
      enableSorting: false,
      size: 50,
      cell: (props) => <CheckActionCell {...props} />,
    },
    {
      accessorKey: "_id",
      header: "ID",
      cell: DefaultCell,
      enableColumnFilter: true,
      meta: { filterKey: "_id" },
    },
    {
      accessorKey: "pessoa",
      header: "Prestador",
      enableSorting: false,
      cell: (props) => (
        <Flex minH="8">
          <Text alignSelf="center" fontSize="sm" truncate>
            {props.getValue()?.nome} - {props.getValue()?.documento}
          </Text>
        </Flex>
      ),
      enableColumnFilter: true,
      meta: {
        filterVariant: "selectPrestador",
        filterKey: "pessoa",
      },
    },
    {
      accessorKey: "tipoServicoTomado",
      header: "Tipo de serviço",
      enableSorting: false,
      cell: (props) => (
        <Flex minH="8">
          <Text alignSelf="center" fontSize="sm" truncate>
            {props.getValue()}
          </Text>
        </Flex>
      ),
      enableColumnFilter: true,
      meta: {
        filterKey: "tipoServicoTomado",
        filterVariant: "selectLista",
        cod: "tipo-servico-tomado",
      },
    },
    // {
    //   accessorKey: "competencia",
    //   header: "Competência",
    //   enableSorting: false,
    //   cell: (props) => (
    //     <Flex minH="8">
    //       <Text alignSelf="center" fontSize="sm" truncate>
    //         {props.getValue()?.mes?.toString()?.padStart(2, "0")}/
    //         {props.getValue()?.ano}
    //       </Text>
    //     </Flex>
    //   ),
    //   enableColumnFilter: true,
    //   meta: {
    //     filterKey: "competencia",
    //     filterVariant: "competencia",
    //   },
    // },
    // {
    //   accessorKey: "status",
    //   header: "Status",
    //   enableSorting: false,
    //   cell: DefaultCell,
    //   enableColumnFilter: true,
    //   meta: {
    //     filterKey: "status",
    //     filterVariant: "select",
    //     filterOptions: [
    //       { label: "Em aberto", value: "aberto" },
    //       { label: "Pendente", value: "pendente" },
    //       { label: "Processando", value: "processando" },
    //     ],
    //   },
    // },
    {
      accessorKey: "descricao",
      header: "Descrição",
      cell: DefaultCell,
      enableColumnFilter: true,
      meta: { filterKey: "descricao" },
    },
    {
      accessorKey: "dataContratacao",
      header: "Data contratação",
      cell: (props) => (
        <Flex minH="8">
          <Text alignSelf="center" fontSize="sm" truncate>
            {formatDateToDDMMYYYY(props.getValue())}
          </Text>
        </Flex>
      ),
      enableColumnFilter: true,
      meta: { filterKey: "dataContratacao" },
    },
    {
      accessorKey: "dataConclusao",
      header: "Data Conclusão",
      cell: (props) => (
        <Flex minH="8">
          <Text alignSelf="center" fontSize="sm" truncate>
            {formatDateToDDMMYYYY(props.getValue())}
          </Text>
        </Flex>
      ),
      enableColumnFilter: true,
      meta: { filterKey: "dataConclusao" },
    },
    {
      accessorKey: "moeda.sigla",
      header: "Moeda",
      cell: DefaultCell,
      enableColumnFilter: false,
      meta: { filterKey: "moeda.sigla" },
    },
    {
      accessorKey: "valorMoeda",
      header: "Valor (na moeda)",
      cell: CurrencyCell,
      enableColumnFilter: false,
      meta: { filterKey: "valorMoeda" },
    },
    {
      accessorKey: "valor",
      header: "Valor total",
      enableSorting: false,
      meta: { filterKey: "valor" },
      enableColumnFilter: false,
      footer: (props) => (
        <TotalSumFooterCell
          sum={props.table.options.data?.reduce((acc, cur) => {
            return acc + (cur?.valor ?? 0);
          }, 0)}
        />
      ),
      cell: (props) => (
        <Flex minH="8">
          <Text alignSelf="center" fontSize="sm" truncate>
            {currency.format(props.getValue() ?? 0)}
          </Text>
        </Flex>
      ),
    },

    {
      accessorKey: "statusProcessamento",
      header: "Processamento",
      cell: DefaultCell,
      enableColumnFilter: true,
      meta: {
        filterKey: "statusProcessamento",
        filterVariant: "select",
        filterOptions: statusProcessamentoOptions,
      },
    },
  ];
};
