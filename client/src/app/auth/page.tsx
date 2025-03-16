'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { FormAuthSchema, formAuthSchema } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { ApiError, apiService } from '@/lib/services/apiService';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormInput from '@/components/Form/input-form';

const Auth = () => {
  const router = useRouter();
  const [mode, setMode] = useState<'signup' | 'signin'>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [errorInPassword, setErrorInPassword] = useState(false);

  const form = useForm<FormAuthSchema>({
    resolver: zodResolver(formAuthSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: FormAuthSchema) => {
    try {
      setIsLoading(true);
      let data;
      if (mode === 'signup') data = await apiService.signup(values);
      if (mode === 'signin') data = await apiService.signin(values);
      console.log(data);
      router.push('/');
    } catch (e) {
      const error = e as ApiError;
      if (error.errors) {
        error.errors.forEach((err) => {
          if (err.field && (err.field === 'email' || err.field === 'password')) {
            form.setError(err.field, { message: err.message });

            if (err.field === 'password') {
              setErrorInPassword(true);
            }
          } else {
            form.setError('root', { message: err.message });
          }
        });
      } else {
        form.setError('root', { message: 'An unexpected error occurred.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto mt-10 p-6">
      <h1 className="text-stone-50 text-2xl font-bold mb-4 text-center">{mode === 'signin' ? 'Sign in' : 'Sign Up'}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <FormInput form={form} type="email" name="email" label="Email" placeholder="email@example.com" />
          <FormInput
            type="password"
            name="password"
            showDesc={errorInPassword}
            description="Password must be beetween 4 and 20 characters"
            label="Password"
            form={form}
          />
          <Button className="mx-auto" disabled={isLoading} type="submit">
            {isLoading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </Button>
          <FormMessage />
        </form>
      </Form>
      <div className="flex w-full justify-center">
        <Button
          className="mx-auto"
          onClick={() => setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'))}
          variant="link">
          {mode === 'signin' ? 'Create Account' : 'Signin!'}
        </Button>
      </div>
    </main>
  );
};

export default Auth;
