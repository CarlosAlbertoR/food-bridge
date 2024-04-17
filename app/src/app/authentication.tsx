import { useRouter } from 'expo-router';
import React from 'react';

import { Button, View } from '@/ui';

export default function Authentication() {
  const router = useRouter();

  const handleRegister = () => {
    router.push('/register');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <View>
      <Button onPress={handleRegister} label="Register" />
      <Button onPress={handleLogin} label="Login" />
    </View>
  );
}
