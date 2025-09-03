import { CpfCnpjCell } from "../../components/dataGrid/cells/cpfCnpjCell";
import { SelectAutoCompleteCell } from "../../components/dataGrid/cells/selectAutoComplete";
import { DefaultEditableCell } from "../../components/dataGrid/cells/defaultEditable";
import { SelectListaCell } from "../../components/dataGrid/cells/selectLista";
import { DateCell } from "../../components/dataGrid/cells/dateCell";
import { DefaultCell } from "../../components/dataGrid/cells/default";
import { TableActionsCell } from "../../components/dataGrid/cells/tableActionsCell";
import { CurrencyCell } from "../../components/dataGrid/cells/currencyCell";
import { DisabledDefaultCell } from "../../components/dataGrid/cells/disabledDefaultCell";
import { CompetenciaCell } from "../../components/dataGrid/cells/competenciaCell";

import { DocumentosFiscaisDialog } from "./dialog";

import {
  REGIME_TRIBUTARIO_OPTIONS,
  STATUS_PESSOA_OPTIONS,
  TIPO_PESSOA_OPTIONS,
} from "../../constants";

import { LISTA_PAISES_OMIE } from "../../constants/omie";
import { DeletePessoaAction } from "../../components/dataGrid/actions/deletePessoaButton";
import { SelectPrestadorCell } from "../../components/dataGrid/cells/selectPrestador";
import { DeleteDocumentoFiscalAction } from "../../components/dataGrid/actions/deleteDocumentoFiscalButton";
import { DownloadFileAction } from "../../components/dataGrid/actions/downloadFileAction";
import { ArquivoDetailsDialog } from "./arquivoDialog";

export const makeDynamicColumns = () => {
  const STATUS_PAGAMENTO_MAP = [
    { label: "Em aberto", value: "aberto" },
    { label: "Processando", value: "processando" },
    { label: "Pago", value: "pago" },
  ];

  const STATUS_VALIDACAO_MAP = [
    { label: "Pendente", value: "pendente" },
    { label: "Recusado", value: "recusado" },
    { label: "Aprovado", value: "aprovado" },
  ];

  const statusOptions = [
    { value: "ativo", label: "Ativo" },
    { value: "inativo", label: "Inativo" },
  ];

  return [
    {
      accessorKey: "acoes",
      header: "Ações",
      enableSorting: false,
      enableColumnFilter: true,
      cell: (props) => (
        <TableActionsCell>
          <DeleteDocumentoFiscalAction id={props.row.original?._id} />
          <DocumentosFiscaisDialog
            label="Documento fiscal"
            defaultValues={{
              ...props.row.original,
              pessoa: {
                label: `${props.row.original?.pessoa?.nome}-${props.row.original?.pessoa?.documento}`,
                value: props.row.original?.pessoa?._id,
              },
            }}
          />
          {props.row.original?.arquivo &&
            props.row.original?.statusValidacao === "pendente" && (
              <ArquivoDetailsDialog documentoFiscal={props.row.original} />
            )}
          {/* {props.row.original?.arquivo && (
            <DownloadFileAction id={props.row.original?.arquivo?._id} />
          )} */}
        </TableActionsCell>
      ),
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
      cell: SelectPrestadorCell,
      enableColumnFilter: true,
      meta: {
        filterVariant: "selectPrestador",
        filterKey: "pessoa",
      },
    },
    {
      accessorKey: "tipoDocumentoFiscal",
      header: "Documento Fiscal",
      enableSorting: false,
      cell: (props) => (
        <SelectListaCell {...props} cod={"tipo-documento-fiscal"} />
      ),
      enableColumnFilter: true,
      meta: {
        filterKey: "tipoDocumentoFiscal",
        filterVariant: "selectLista",
        cod: "tipo-documento-fiscal",
      },
    },
    {
      accessorKey: "numero",
      header: "Numero",
      enableSorting: false,
      cell: DefaultEditableCell,
      enableColumnFilter: true,
      meta: {
        filterKey: "numero",
      },
    },
    {
      accessorKey: "competencia",
      header: "Competência",
      enableSorting: false,
      cell: CompetenciaCell,
      enableColumnFilter: true,
      meta: { filterKey: "competencia", filterVariant: "competencia" },
    },
    {
      accessorKey: "valor",
      header: "Valor",
      enableSorting: false,
      cell: (props) => <CurrencyCell {...props} prefix="R$" />,
      enableColumnFilter: true,
      meta: { filterKey: "valor" },
    },
    {
      accessorKey: "imposto",
      header: "Imposto",
      enableSorting: false,
      cell: (props) => <CurrencyCell {...props} prefix="R$" />,
      enableColumnFilter: true,
      meta: { filterKey: "imposto" },
    },
    {
      accessorKey: "classificacaoFiscal",
      header: "Classificação Fiscal",
      enableSorting: false,
      cell: DefaultEditableCell,
      enableColumnFilter: true,
      meta: { filterKey: "classificacaoFiscal" },
    },
    {
      accessorKey: "descricao",
      header: "Descrição",
      enableSorting: false,
      cell: DefaultEditableCell,
      enableColumnFilter: true,
      meta: { filterKey: "descricao" },
    },
    {
      accessorKey: "motivoRecusa",
      header: "Motivo recusa",
      enableSorting: false,
      cell: (props) => (
        <SelectListaCell {...props} cod={"motivo-recusa-documento-fiscal"} />
      ),
      enableColumnFilter: true,
      meta: {
        filterKey: "motivoRecusa",
        filterVariant: "selectLista",
        cod: "motivo-recusa-documento-fiscal",
      },
    },
    {
      accessorKey: "observacao",
      header: "Observação",
      enableSorting: false,
      cell: DefaultEditableCell,
      enableColumnFilter: true,
      meta: { filterKey: "observacao" },
    },
    {
      accessorKey: "statusValidacao",
      header: "Status validação",
      enableSorting: false,
      cell: (props) => (
        <SelectAutoCompleteCell {...props} options={STATUS_VALIDACAO_MAP} />
      ),
      enableColumnFilter: true,
      meta: {
        filterKey: "statusValidacao",
        filterVariant: "select",
        filterOptions: STATUS_VALIDACAO_MAP,
      },
    },
    {
      accessorKey: "statusPagamento",
      header: "Status pagamento",
      enableSorting: false,
      cell: DefaultCell,
      enableColumnFilter: true,
      meta: {
        filterKey: "statusPagamento",
        filterVariant: "select",
        filterOptions: STATUS_PAGAMENTO_MAP,
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: false,
      cell: DisabledDefaultCell,
      enableColumnFilter: true,
      meta: {
        filterKey: "status",
        filterVariant: "select",
        filterOptions: statusOptions,
      },
    },
  ];
};
