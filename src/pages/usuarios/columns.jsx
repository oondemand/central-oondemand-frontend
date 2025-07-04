import React from "react";
import { SelectAutoCompleteCell } from "../../components/dataGrid/cells/selectAutoComplete";
import { DefaultEditableCell } from "../../components/dataGrid/cells/defaultEditable";
import { UsuariosDialog } from "./dialog";
import { TableActionsCell } from "../../components/dataGrid/cells/tableActionsCell";
import { DeleteUsuarioAction } from "../../components/dataGrid/actions/deleteUsuarioButton";
import { RecuperarSenhaUsuarioAction } from "../../components/dataGrid/actions/recuperarSenhaUsuario";

export const makeUsuarioDynamicColumns = () => {
  return [
    {
      accessorKey: "acoes",
      header: "Ações",
      enableSorting: false,
      cell: (props) => (
        <TableActionsCell>
          <DeleteUsuarioAction id={props.row.original?._id} />
          <UsuariosDialog
            label="Usuario"
            defaultValues={{
              ...props.row.original,
            }}
          />
          <RecuperarSenhaUsuarioAction usuario={props.row.original} />
        </TableActionsCell>
      ),
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
      accessorKey: "tipo",
      header: "Tipo",
      cell: (props) => (
        <SelectAutoCompleteCell
          {...props}
          options={[
            { label: "Central", value: "central" },
            { label: "Administrador", value: "admin" },
          ]}
        />
      ),
      enableColumnFilter: true,
      enableSorting: false,
      meta: {
        filterKey: "tipo",
        filterVariant: "select",
        filterOptions: [
          { label: "Central", value: "central" },
          { label: "Administrador", value: "admin" },
        ],
      },
    },
    {
      accessorKey: "email",
      header: "E-mail",
      cell: DefaultEditableCell,
      enableColumnFilter: true,
      enableSorting: false,
      meta: { filterKey: "email" },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (props) => (
        <SelectAutoCompleteCell
          {...props}
          options={[
            { label: "Ativo", value: "ativo" },
            { label: "Inativo", value: "inativo" },
          ]}
        />
      ),
      enableColumnFilter: true,
      enableSorting: false,
      meta: {
        filterKey: "status",
        filterVariant: "select",
        filterOptions: [
          { label: "Ativo", value: "ativo" },
          { label: "Inativo", value: "inativo" },
        ],
      },
    },
  ];
};
