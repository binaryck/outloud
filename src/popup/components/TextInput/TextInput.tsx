import { Field, Input } from "@chakra-ui/react";

type TextBoxProps = {
  placeholder?: string;
  required?: boolean;
};

export const TextInput = ({
  placeholder = "Add the receiver's address here",
  required = false,
}: TextBoxProps) => {
  return (
    <>
      <Field.Root>
        <Input placeholder={placeholder} required={required} />
        <Field.ErrorText>This field is required</Field.ErrorText>
      </Field.Root>
    </>
  );
};
