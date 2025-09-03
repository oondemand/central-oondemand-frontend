import { Switch } from "../../../components/ui/switch";
import { Flex } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";

export const SwitchCell = ({ getValue, row, column, table, ...rest }) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const { user } = useAuth();

  const onBlur = async () => {
    if (value !== initialValue) {
      try {
        await table.options.meta?.updateData({
          id: row.original._id,
          data: { [column.columnDef.accessorKey]: value },
        });
      } catch (error) {
        console.log(error);
        setValue(initialValue);
      }
    }
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Flex flex="1" alignItems="center" justifyContent="center">
      <Switch
        disabled={user?.tipo === "padrao"}
        onBlur={onBlur}
        checked={value}
        onCheckedChange={({ checked }) => setValue(checked)}
        colorPalette="cyan"
        size="sm"
        // {...rest}
      />
    </Flex>
  );
};
