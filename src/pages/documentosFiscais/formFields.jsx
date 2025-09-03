import { SelectPrestadorField } from "../../components/buildForm/filds/selectPrestadorField";
import { z } from "zod";
import { SelectListaField } from "../../components/buildForm/filds/selectListaField";
import { DefaultField } from "../../components/buildForm/filds/default";
import { CurrencyField } from "../../components/buildForm/filds/currencyField";
import { CompetenciaField } from "../../components/buildForm/filds/competenciaField";

import {
  currencyValidation,
  requiredCurrencyValidation,
} from "../../utils/zodHelpers";

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
          accessorKey: "tipoDocumentoFiscal",
          label: "Tipo de documento",
          cod: "tipo-documento-fiscal",
          render: SelectListaField,
          validation: z.string({
            message: "Campo obrigatório",
          }),
          colSpan: 1,
        },
        {
          accessorKey: "competencia",
          label: "Competência",
          render: CompetenciaField,
          validation: z.string().optional(),
          colSpan: 1,
        },
        {
          accessorKey: "numero",
          label: "Numero",
          render: DefaultField,
          validation: z.string().nonempty("Número é obrigatório"),
          colSpan: 1,
        },
        {
          accessorKey: "valor",
          label: "Valor",
          render: (props) => <CurrencyField {...props} prefix="R$" />,
          validation: requiredCurrencyValidation,
          colSpan: 1,
        },
        {
          accessorKey: "imposto",
          label: "Imposto",
          render: (props) => <CurrencyField {...props} prefix="R$" />,
          validation: currencyValidation,
          colSpan: 1,
        },

        {
          accessorKey: "classificacaoFiscal",
          label: "Classificação Fiscal",
          render: DefaultField,
          validation: z.string().optional(),
          colSpan: 1,
        },
      ],
    },
    {
      label: "Informações adicionais",
      group: [
        // {
        //   accessorKey: "motivoRecusa",
        //   label: "Motivo Recusa",
        //   cod: "motivo-recusa-documento-fiscal",
        //   render: SelectListaField,
        //   validation: z.string().optional(),
        //   colSpan: 1,
        // },
        {
          accessorKey: "descricao",
          label: "Descrição",
          render: DefaultField,
          validation: z.string().optional(),
          colSpan: 4,
        },
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
