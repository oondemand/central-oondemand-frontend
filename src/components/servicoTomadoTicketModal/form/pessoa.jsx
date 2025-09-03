import { Box, Text, Flex, Grid, GridItem } from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import { BuildForm } from "../../buildForm/index";
import { useVisibleInputForm } from "../../../hooks/useVisibleInputForms";
import { useMemo } from "react";
import { createDynamicFormFields } from "../../../pages/pessoa/formFields";
import { api } from "../../../config/api";
import { AsyncSelectAutocomplete } from "../../asyncSelectAutoComplete";

import { VisibilityControlDialog } from "../../vibilityControlDialog";
import { formatDateToDDMMYYYY } from "../../../utils/formatting";

import { useCreatePessoa } from "../../../hooks/api/pessoa/useCreatePessoa";
import { useUpdatePessoa } from "../../../hooks/api/pessoa/useUpdatePessoa";
import { ORIGENS } from "../../../constants/origens";

export const fetchOptions = async (inputValue) => {
  return await api.get(`/pessoas?searchTerm=${inputValue}`);
};

const obterPessoas = async (inputValue) => {
  const {
    data: { results },
  } = await fetchOptions(inputValue);

  return results.map((item) => {
    return {
      ...item,
      value: item._id,
      label: `${item.nome} ${`${
        item.documento ? `DOC. ${item.documento}` : ""
      }`}`,
    };
  });
};

export const PessoaForm = ({ ticket, updateTicketMutation, onlyReading }) => {
  const defaultSelectedPessoa = ticket?.pessoa ? ticket.pessoa.nome : "";

  const { inputsVisibility, setInputsVisibility } = useVisibleInputForm({
    key: "PESSOAS_TICKET_MODAL_FORM",
  });

  const [pessoa, setPessoa] = useState(ticket?.pessoa);
  const [selectedPessoa, setSelectPessoa] = useState(defaultSelectedPessoa);

  const createPessoa = useCreatePessoa({
    onSuccess: (data) => {
      setPessoa((prev) => data);
    },
    origem: ORIGENS.FORM,
  });

  const updatePessoa = useUpdatePessoa({
    onSuccess: (data) => {
      setPessoa((prev) => data);
    },
    origem: ORIGENS.FORM,
  });

  const onSubmitPessoa = async (values) => {
    // const {
    //   endereco: { pais, ...rest },
    // } = values;

    // const body = {
    //   ...values,
    //   email: values?.email === "" ? null : values?.email,
    //   endereco: { ...rest, ...(pais.cod ? { pais } : {}) },
    // };

    if (!ticket?.pessoa) {
      const { pessoa } = await createPessoa.mutateAsync({ body: values });

      await updateTicketMutation({
        id: ticket._id,
        body: {
          pessoa: pessoa?._id,
        },
      });
    }

    return await updatePessoa.mutateAsync({
      id: ticket?.pessoa._id,
      body: values,
    });
  };

  const handlePessoaChange = async (e) => {
    setSelectPessoa(e);

    if (e && e.value !== ticket?.pessoa?._id) {
      return await updateTicketMutation({
        id: ticket?._id,
        body: {
          pessoa: e.value,
        },
      });
    }
  };

  const fields = useMemo(() => createDynamicFormFields(), []);

  useEffect(() => {
    setPessoa(ticket?.pessoa);
  }, [ticket]);

  return (
    <>
      <Grid templateColumns="repeat(4, 1fr)" gap="4">
        <GridItem colSpan={1} mt="6">
          <Box w="100px">
            <Text color="gray.600" fontSize="sm">
              Dados Prestador
            </Text>
          </Box>
        </GridItem>
        <GridItem colSpan={3} mt="6">
          {!onlyReading && (
            <Box
              mt="4"
              w="full"
              h="1"
              borderBottom="2px solid"
              borderColor="gray.100"
            />
          )}

          {!onlyReading && (
            <Box w="full" mt="6">
              <Text color="gray.600" fontSize="sm">
                Selecionar Prestador
              </Text>
              <Flex gap="4">
                <AsyncSelectAutocomplete
                  disabled={!ticket}
                  queryFn={obterPessoas}
                  value={selectedPessoa}
                  setValue={handlePessoaChange}
                  placeholder="Digite para buscar..."
                />
              </Flex>
            </Box>
          )}

          {!onlyReading && (
            <Text fontSize="sm" color="gray.500" mt="6">
              {pessoa ? "Detalhes da pessoa" : "Adicionar"}
            </Text>
          )}

          <Flex alignItems="center" gap="4" mb="6">
            <Box
              w="full"
              h="1"
              borderBottom="2px solid"
              borderColor="gray.100"
            />
            <VisibilityControlDialog
              fields={fields}
              setVisibilityState={setInputsVisibility}
              visibilityState={inputsVisibility}
              title="Ocultar inputs"
            />
          </Flex>
          <BuildForm
            disabled={!ticket || onlyReading}
            fields={fields}
            data={{
              ...pessoa,
              pessoaFisica: {
                ...pessoa?.pessoaFisica,
                dataNascimento: formatDateToDDMMYYYY(
                  pessoa?.pessoaFisica?.dataNascimento
                ),
              },
            }}
            shouldUseFormValues={true}
            visibleState={inputsVisibility}
            onSubmit={onSubmitPessoa}
            gridColumns={2}
            gap={4}
          />
        </GridItem>
      </Grid>
    </>
  );
};
