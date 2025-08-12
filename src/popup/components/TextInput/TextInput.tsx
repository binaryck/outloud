import { Field, Input } from "@chakra-ui/react";

type TextBoxProps = {
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
};

export const TextInput = ({
  placeholder = "Add the receiver's address here",
  required = false,
  value,
  onChange,
  name,
}: TextBoxProps) => {
  return (
    <Field.Root>
      <Input
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        border="1px solid rgba(247, 147, 26, 0.2)"
        borderRadius="12px"
        bg="rgba(255, 255, 255, 0.03)"
        color="#ffffff"
        _placeholder={{ color: "#a0a0a0" }}
        _focus={{
          borderColor: "#f7931a",
          boxShadow: "0 0 0 2px rgba(247, 147, 26, 0.2)",
        }}
        _hover={{
          borderColor: "rgba(247, 147, 26, 0.3)",
        }}
        required={required}
      />
      <Field.ErrorText>This field is required</Field.ErrorText>
    </Field.Root>
  );
};
