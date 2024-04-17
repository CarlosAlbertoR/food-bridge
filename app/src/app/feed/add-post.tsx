import { zodResolver } from '@hookform/resolvers/zod';
import * as Location from 'expo-location';
import { router, Stack } from 'expo-router';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { showMessage } from 'react-native-flash-message';
import { z } from 'zod';

import { queryClient, useAddPost, usePosts } from '@/api';
import { Button, ControlledInput, showErrorMessage, View } from '@/ui';
import { ControlledDatePicker } from '@/ui/date-picker';

const schema = z.object({
  title: z.string().min(1),
  description: z.string().min(10),
  location: z.string(),
  goal_amount: z.string(),
  start_date: z.string(),
  end_date: z.string(),
});

type FormType = z.infer<typeof schema>;

// eslint-disable-next-line max-lines-per-function
export default function AddPost() {
  const { control, handleSubmit, setValue, setError } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      start_date: new Date().toISOString(),
      end_date: new Date().toISOString(),
    },
  });
  const { mutate: addCampaign, isLoading } = useAddPost();

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('location', {
          type: 'manual',
          message: 'Permission to access location was denied',
        });
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setValue(
        'location',
        `POINT (${location?.coords?.latitude}, ${location?.coords?.longitude})`
      );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (data: FormType) => {
    console.log(data);
    addCampaign(
      { ...data, goal_amount: Number(data.goal_amount) },
      {
        onSuccess: () => {
          showMessage({
            message: 'Post added successfully',
            type: 'success',
          });
          // here you can navigate to the post list and refresh the list data
          queryClient.invalidateQueries(usePosts.getKey());
          router.back();
        },
        onError: () => {
          showErrorMessage('Error adding post');
        },
      }
    );
  };
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Add Campaign',
          headerBackTitle: 'Feed',
        }}
      />
      <View className="flex-1 p-4 ">
        <ControlledInput
          name="title"
          label="Title"
          control={control}
          testID="title"
        />
        <ControlledInput
          name="description"
          label="Content"
          control={control}
          multiline
          numberOfLines={4}
          testID="description-input"
        />
        <ControlledInput
          name="goal_amount"
          label="Goal amount"
          control={control}
          testID="goal-amount-input"
          keyboardType="numeric"
        />
        <ControlledDatePicker
          name="start_date"
          label="Start date"
          control={control}
          testID="start-date"
        />
        <ControlledDatePicker
          name="end_date"
          label="End date"
          control={control}
          testID="end-date"
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
          label="Add Campaign"
          loading={isLoading}
          onPress={handleSubmit(onSubmit)}
          testID="add-post-button"
        />
      </View>
    </>
  );
}
