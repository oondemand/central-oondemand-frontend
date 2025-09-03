import { Form } from "../../components/form";
import { RequisicaoDetails } from "../../components/requisicaoDetails";
import { createDynamicFormFields } from "../../../pessoa/formFields";

export const TicketBody = ({ ticket }) => {
  return (
    <>
      <Form
        titulo="Prestador"
        data={ticket.payload}
        fields={createDynamicFormFields()}
        stateKey="pessoa_central_omie"
      />
      <RequisicaoDetails ticket={ticket} />
    </>
  );
};
