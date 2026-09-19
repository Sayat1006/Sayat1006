import { FormField } from "@/components/dashboard/form-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectFieldProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

function SelectField({
  label,
  options,
  value,
  onChange,
  placeholder,
  error,
  required,
  className,
}: SelectFieldProps) {
  return (
    <FormField label={label} error={error} required={required} className={className}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger aria-invalid={Boolean(error)}>
          <SelectValue placeholder={placeholder ?? "Таңдаңыз"} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}

export { SelectField };
