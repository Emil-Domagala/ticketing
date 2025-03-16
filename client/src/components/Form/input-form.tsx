import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

type Props = {
  form: any;
  showDesc?: boolean;
  description?: string;
  label: string;
  placeholder?: string;
  type: string;
  name: string;
};

const FormInput = ({ form, showDesc = false, name, description, label, placeholder, type }: Props) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="relative pb-4.5">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} {...field} placeholder={placeholder} />
          </FormControl>
          {description && showDesc && <FormDescription>{description}</FormDescription>}
          <FormMessage className="text-red-500 text-xs absolute bottom-0 " />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
