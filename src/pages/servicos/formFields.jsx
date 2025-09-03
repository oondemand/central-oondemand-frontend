import { DefaultField } from "../../components/buildForm/filds/default";
import { z } from "zod";
import { SelectListaField } from "../../components/buildForm/filds/selectListaField";
import { CurrencyField } from "../../components/buildForm/filds/currencyField";
import { currencyValidation, dateValidation } from "../../utils/zodHelpers";
import { DateField } from "../../components/buildForm/filds/dateField";
import { SelectPrestadorField } from "../../components/buildForm/filds/selectPrestadorField";
import { SelectMoedaField } from "../../components/buildForm/filds/selectMoedaField";

export const createDynamicFormFields = () => {
  return [
    {
      label: "Detalhes do serviço",
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
          accessorKey: "tipoServicoTomado",
          label: "Tipo de servico tomado",
          render: SelectListaField,
          cod: "tipo-servico-tomado",
          validation: z.string().optional(),
          colSpan: 1,
        },
        {
          accessorKey: "moeda",
          label: "Moeda",
          render: SelectMoedaField,
          validation: z.string({ message: "Obrigatório" }),
          colSpan: 1,
        },
        {
          accessorKey: "valorMoeda",
          label: "Valor (na moeda)",
          render: CurrencyField,
          validation: currencyValidation,
          colSpan: 1,
        },
      ],
    },
    {
      label: "Informações adicionais",
      group: [
        {
          accessorKey: "descricao",
          label: "Descrição",
          render: DefaultField,
          validation: z.string().optional(),
          colSpan: 2,
        },
        {
          accessorKey: "dataContratacao",
          label: "Data contratação",
          render: DateField,
          validation: dateValidation,
          colSpan: 1,
        },
        {
          accessorKey: "dataConclusao",
          label: "Data Conclusão",
          render: DateField,
          validation: dateValidation,
          colSpan: 1,
        },
      ],
    },
  ];
};
