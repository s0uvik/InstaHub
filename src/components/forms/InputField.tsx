import { Control, FieldValues, Path } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";

interface InputFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder: string;
  type: string;
  control: Control<T>;
}

const InputField = <T extends FieldValues>({
  name,
  label,
  placeholder,
  type,
  control,
}: InputFieldProps<T>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <>
            {(type === "text" || type === "email" || type === "password") && (
              <Input type={type} placeholder={placeholder} className="shad-input" {...field} />
            )}
            {type === "textarea" && <Textarea className="shad-textarea" {...field} />}
          </>
        </FormControl>
        <FormMessage className="text-red" />
      </FormItem>
    )}
  />
);

export default InputField;
