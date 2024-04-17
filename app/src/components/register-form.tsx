import { zodResolver } from '@hookform/resolvers/zod';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { ToastAndroid } from 'react-native';
import * as z from 'zod';

import { client } from '@/api';
import {
  Button,
  ControlledInput,
  ControlledSelect,
  ScrollView,
  Text,
} from '@/ui';

const schema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  role: z.enum([
    '742f3241-2117-4acd-8358-a0da753aa2cf',
    '4e50f806-0ef0-4769-9e75-902f1eb27f02',
  ]),
  location: z.string(),
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

export type RegisterFormProps = {
  onSubmit?: SubmitHandler<FormType>;
};

// eslint-disable-next-line max-lines-per-function
export const RegisterForm = ({ onSubmit = () => {} }: RegisterFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { handleSubmit, control, setError, setValue } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('location', {
          type: 'manual',
          message: 'Permission to access location was denied',
        });
        return;
      }
      setValue(
        'location',
        JSON.stringify(await Location.getCurrentPositionAsync({}))
      );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRegister = (data: FormType) => {
    console.log('data', data);
    setIsSubmitting(true);
    client
      .post('/users', data)
      .then(() => {
        onSubmit(data);
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
        Register with us
      </Text>

      <ControlledInput
        testID="frst-name"
        control={control}
        name="first_name"
        label="First name"
      />

      <ControlledInput
        testID="last-name"
        control={control}
        name="last_name"
        label="Last name"
      />

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
      <ControlledSelect
        name="role"
        label="I want to be a"
        control={control}
        options={[
          { label: 'Donor', value: '742f3241-2117-4acd-8358-a0da753aa2cf' },
          { label: 'Recipient', value: '4e50f806-0ef0-4769-9e75-902f1eb27f02' },
        ]}
      />

      {/* TODO: add map view https://github.com/react-native-maps/react-native-maps */}
      <ControlledInput
        testID="location"
        control={control}
        name="location"
        label="Location"
        readOnly
      />

      <Button
        testID="register-button"
        label="Get started"
        size="md"
        loading={isSubmitting}
        onPress={handleSubmit(handleRegister)}
      />
    </ScrollView>
  );
};
