'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { FormAuthSchema, formAuthSchema } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { ApiError, apiService } from '@/services/apiService';

const SignUp = () => {
  const form = useForm<FormAuthSchema>({
    resolver: zodResolver(formAuthSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: FormAuthSchema) => {
    try {
      const data = await apiService.signup(values);
      console.log(data);
    } catch (e) {
      const error = e as ApiError;
      if (error.errors) {
        error.errors.forEach((err) => {
          if (err.field && (err.field === 'email' || err.field === 'password')) {
            form.setError(err.field, { message: err.message });
          } else {
            form.setError('root', { message: err.message });
          }
        });
      } else {
        form.setError('root', { message: 'An unexpected error occurred.' });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription>Password must be beetween 4 and 20 characters</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Sign Up</Button>
        <FormMessage />
      </form>
    </Form>
  );
};

export default SignUp;
