import { SelectPrestadorField } from "../../components/buildForm/filds/selectPrestadorField";
import { z } from "zod";
import { SelectListaField } from "../../components/buildForm/filds/selectListaField";
import { DefaultField } from "../../components/buildForm/filds/default";

export const createDynamicFormFields = () => {
  return [
    {
      label: "Detalhes",
      group: [
        {
          accessorKey: "pessoa",
          label: "Prestador",
          render: SelectPrestadorField,
          validation: z.object(
            { label: z.string(), value: z.string() },
            { message: "Prestador é obrigatório" }
          ),
          colSpan: 2,
        },
        {
          accessorKey: "tipoDocumento",
          label: "Tipo de documento",
          cod: "tipo-documento-cadastral",
          render: SelectListaField,
          validation: z.string({
            message: "Campo obrigatório",
          }),
          colSpan: 1,
        },
        {
          accessorKey: "numero",
          label: "Numero",
          render: DefaultField,
          validation: z.string().nonempty("Número é obrigatório"),
          colSpan: 1,
        },
      ],
    },
    {
      label: "Informações adicionais",
      group: [
        {
          accessorKey: "motivoRecusa",
          label: "Motivo Recusa",
          cod: "motivo-recusa-documento-cadastral",
          render: SelectListaField,
          validation: z.string().optional(),
          colSpan: 2,
        },
        {
          accessorKey: "descricao",
          label: "Descrição",
          render: DefaultField,
          validation: z.string().optional(),
          colSpan: 4,
        },
        // {
        //   accessorKey: "observacaoPrestador",
        //   label: "Observação Prestador",
        //   render: DefaultField,
        //   validation: z.string().optional(),
        //   colSpan: 4,
        // },
        {
          accessorKey: "observacao",
          label: "Observação",
          render: DefaultField,
          validation: z.string().optional(),
          colSpan: 4,
        },
      ],
    },
  ];
};
