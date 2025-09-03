import { Switch } from "../../ui/switch";
import { Flex, Text } from "@chakra-ui/react";
import { useConfirmation } from "../../../hooks/useConfirmation";
import { Controller } from "react-hook-form";

export const SwitchField = (props) => {
  const { requestConfirmation } = useConfirmation();

  const onBlur = async (ev) => {
    if (props?.confirmAction) {
      props.confirmationRefFn.current = async () => {
        const { action } = await requestConfirmation({
          title: props.confirmAction?.title,
          description: props?.confirmAction?.description,
        });

        action === "canceled" &&
          props?.setValue(props?.accessorKey, props.initialValue);

        return action;
      };
    }

    props.field.onBlur(ev);
  };

  return (
    <Flex flex="1" alignItems="center" gap="2">
      <Text fontSize="sm" fontWeight="medium" color="gray.700">
        {props.label}
      </Text>
      <Controller
        control={props.control}
        name={props.accessorKey}
        render={({ field }) => {
          return (
            <Switch
              onBlur={onBlur}
              checked={field.value}
              onCheckedChange={({ checked }) => field.onChange(checked)}
              colorPalette="cyan"
              size="sm"
            />
          );
        }}
      />
    </Flex>
  );
};
