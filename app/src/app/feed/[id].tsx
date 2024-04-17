import { Env } from '@env';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as React from 'react';

import { usePost } from '@/api';
import {
  ActivityIndicator,
  FocusAwareStatusBar,
  Image,
  ScrollView,
  Text,
  View,
} from '@/ui';

export default function Post() {
  const local = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, isError } = usePost({
    //@ts-ignore
    variables: { id: local.id },
  });

  if (isLoading) {
    return (
      <View className="flex-1 justify-center  p-3">
        <Stack.Screen options={{ title: 'Post', headerBackTitle: 'Feed' }} />
        <FocusAwareStatusBar />
        <ActivityIndicator />
      </View>
    );
  }
  if (isError) {
    return (
      <View className="flex-1 justify-center p-3">
        <Stack.Screen options={{ title: 'Post', headerBackTitle: 'Feed' }} />
        <FocusAwareStatusBar />
        <Text className="text-center">Error loading post</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerClassName="p-3">
      <Stack.Screen options={{ title: 'Campaign', headerBackTitle: 'Feed' }} />
      <FocusAwareStatusBar />
      <View>
        <Image
          className="h-56 w-full overflow-hidden rounded-xl"
          contentFit="cover"
          source={{
            uri: `${Env.API_URL}/assets/${data?.image}`,
          }}
        />
        <Text className="my-3 text-2xl font-semibold">{data.title}</Text>
        <Text>{data.description}</Text>
      </View>
    </ScrollView>
  );
}
