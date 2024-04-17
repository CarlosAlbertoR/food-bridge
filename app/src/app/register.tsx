import { useRouter } from 'expo-router';
import React from 'react';

import type { RegisterFormProps } from '@/components/register-form';
import { RegisterForm } from '@/components/register-form';
import { useSoftKeyboardEffect } from '@/core/keyboard';
import { FocusAwareStatusBar } from '@/ui';

export default function Register() {
  const router = useRouter();
  useSoftKeyboardEffect();

  const onSubmit: RegisterFormProps['onSubmit'] = () => {
    router.push('/login');
  };

  return (
    <>
      <FocusAwareStatusBar />
      <RegisterForm onSubmit={onSubmit} />
    </>
  );
}
