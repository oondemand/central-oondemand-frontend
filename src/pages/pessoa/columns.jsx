import { CpfCnpjCell } from "../../components/dataGrid/cells/cpfCnpjCell";
import { SelectAutoCompleteCell } from "../../components/dataGrid/cells/selectAutoComplete";
import { DefaultEditableCell } from "../../components/dataGrid/cells/defaultEditable";
import { SelectListaCell } from "../../components/dataGrid/cells/selectLista";
import { DateCell } from "../../components/dataGrid/cells/dateCell";
import { DefaultCell } from "../../components/dataGrid/cells/default";
import { TableActionsCell } from "../../components/dataGrid/cells/tableActionsCell";
import { PessoasDialog } from "./dialog";

import {
  REGIME_TRIBUTARIO_OPTIONS,
  STATUS_PESSOA_OPTIONS,
  TIPO_PESSOA_OPTIONS,
} from "../../constants";

import { LISTA_PAISES_OMIE } from "../../constants/omie";
import { DeletePessoaAction } from "../../components/dataGrid/actions/deletePessoaButton";
import { SyncOmieStatusCell } from "./components/syncOmieStatusCell";
import { LinkIntegracaoAction } from "../../components/dataGrid/actions/linkIntegracaoAction";
import { SwitchCell } from "../../components/dataGrid/cells/switchCelll";

export const makeDynamicColumns = () => {
  return [
    {
      accessorKey: "acoes",
      header: "Ações",
      enableSorting: false,
      enableColumnFilter: true,
      meta: {
        filterKey: "status_sincronizacao_omie",
        filterVariant: "select",
        filterOptions: [
          { label: "Pendente", value: "pendente" },
          { label: "Sucesso", value: "sucesso" },
          { label: "Error", value: "erro" },
        ],
      },
      cell: (props) => (
        <TableActionsCell>
          <DeletePessoaAction id={props.row.original?._id} />
          <PessoasDialog label="Pessoa" defaultValues={props.row.original} />
          {/* <LinkIntegracaoAction
            integracaoUrl={`/pessoa/central-omie?searchTerm=${props.row.original?._id}`}
          /> */}
          <SyncOmieStatusCell {...props} />
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
      accessorKey: "grupo",
      header: "Grupo",
      cell: (props) => <SelectListaCell {...props} cod="grupo" />,
      enableColumnFilter: true,
      meta: { filterKey: "grupo" },
    },
    {
      accessorKey: "nome",
      header: "Nome Completo",
      cell: DefaultEditableCell,
      enableColumnFilter: true,
      enableSorting: false,
      meta: { filterKey: "nome" },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: DefaultEditableCell,
      enableColumnFilter: true,
      meta: { filterKey: "email" },
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      cell: (props) => (
        <SelectAutoCompleteCell {...props} options={TIPO_PESSOA_OPTIONS} />
      ),
      enableColumnFilter: true,
      confirmAction: {
        title: "Tem certeza que deseja alterar *tipo*?",
        description: "Algumas informações podem ser perdidas no processo.",
      },
      meta: {
        filterKey: "tipo",
        filterVariant: "select",
        filterOptions: TIPO_PESSOA_OPTIONS,
      },
    },
    {
      accessorKey: "endereco.pais.codigo",
      header: "País",
      cell: (props) => (
        <SelectAutoCompleteCell
          {...props}
          options={LISTA_PAISES_OMIE.map((e) => ({
            value: e.cCodigo,
            label: e.cDescricao,
          }))}
        />
      ),
      meta: {
        filterKey: "endereco.pais.codigo",
        filterVariant: "select",
        filterOptions: LISTA_PAISES_OMIE.map((e) => ({
          value: e.cCodigo,
          label: e.cDescricao,
        })),
      },
    },
    {
      accessorKey: "documento",
      header: "Documento",
      cell: (props) => <CpfCnpjCell {...props} />,
      enableColumnFilter: true,
      meta: { filterKey: "documento" },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (props) => (
        <SelectAutoCompleteCell {...props} options={STATUS_PESSOA_OPTIONS} />
      ),
      enableColumnFilter: true,
      meta: {
        filterKey: "status",
        filterVariant: "select",
        filterOptions: STATUS_PESSOA_OPTIONS,
      },
    },
    {
      accessorKey: "pessoaFisica.rg",
      header: "RG",
      cell: (props) => (
        <DefaultEditableCell
          {...props}
          disabled={props.row.original?.tipo === "pj"}
        />
      ),
      enableColumnFilter: true,
      meta: { filterKey: "pessoaFisica.rg" },
    },
    {
      accessorKey: "pessoaFisica.dataNascimento",
      header: "Data de nascimento",
      cell: (props) => (
        <DateCell {...props} disabled={props.row.original?.tipo === "pj"} />
      ),
      enableColumnFilter: true,
      meta: { filterKey: "pessoaFisica.dataNascimento" },
    },
    {
      accessorKey: "pessoaFisica.apelido",
      header: "Apelido",
      cell: (props) => (
        <DefaultEditableCell
          {...props}
          disabled={props.row.original?.tipo === "pj"}
        />
      ),
      enableColumnFilter: true,
      meta: { filterKey: "pessoaFisica.apelido" },
    },
    {
      accessorKey: "pessoaJuridica.nomeFantasia",
      header: "Nome da fantasia",
      cell: (props) => (
        <DefaultEditableCell
          {...props}
          disabled={props.row.original?.tipo === "pf"}
        />
      ),
      enableColumnFilter: true,
      meta: { filterKey: "pessoaJuridica.nomeFantasia" },
    },
    {
      accessorKey: "pessoaJuridica.regimeTributario",
      header: "Regime tributário",
      enableColumnFilter: true,
      meta: {
        filterKey: "pessoaJuridica.regimeTributario",
        filterVariant: "select",
        filterOptions: REGIME_TRIBUTARIO_OPTIONS,
      },
      cell: (props) => (
        <SelectAutoCompleteCell
          {...props}
          disabled={props.row.original?.tipo === "pf"}
          options={REGIME_TRIBUTARIO_OPTIONS}
        />
      ),
    },
    {
      accessorKey: "cadastro_aprovado",
      header: "Cadastro aprovado",
      cell: SwitchCell,
    },
  ];
};
