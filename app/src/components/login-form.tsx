import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { ToastAndroid } from 'react-native';
import * as z from 'zod';

import { client } from '@/api';
import { Button, ControlledInput, ScrollView, Text } from '@/ui';

const schema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password must be at least 6 characters'),
});

export type FormType = z.infer<typeof schema>;

export type LoginFormProps = {
  onSubmit?: SubmitHandler<FormType>;
};

export const LoginForm = ({ onSubmit = () => {} }: LoginFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const handleLogin = (data: FormType) => {
    console.log(data);

    setIsSubmitting(true);

    client
      .post('/auth/login', { ...data, mode: 'json' })
      .then((res) => {
        onSubmit(res.data?.data);
      })
      .catch((error) => {
        console.log('error', JSON.stringify(error.response.data));
        ToastAndroid.show('Something went wrong!', ToastAndroid.LONG);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <ScrollView contentContainerClassName="flex-1 justify-center p-4">
      <Text testID="form-title" className="pb-6 text-center text-2xl">
        Sign In
      </Text>

      <ControlledInput
        testID="email-input"
        control={control}
        name="email"
        label="Email"
      />
      <ControlledInput
        testID="password-input"
        control={control}
        name="password"
        label="Password"
        placeholder="***"
        secureTextEntry={true}
      />
      <Button
        testID="login-button"
        label="Login"
        loading={isSubmitting}
        onPress={handleSubmit(handleLogin)}
      />
    </ScrollView>
  );
};
