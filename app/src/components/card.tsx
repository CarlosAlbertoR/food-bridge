import { Env } from '@env';
import { Link } from 'expo-router';
import React, { useEffect, useRef } from 'react';

import type { Post } from '@/api';
import dayjs from '@/core/dayjs';
import type { ProgressBarRef } from '@/ui';
import { Image, Pressable, ProgressBar, Text, View } from '@/ui';

type Props = Post;

// const images = [
//   'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=800&q=80',
//   'https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?auto=format&fit=crop&w=800&q=80',
//   'https://images.unsplash.com/photo-1515386474292-47555758ef2e?auto=format&fit=crop&w=800&q=80',
//   'https://plus.unsplash.com/premium_photo-1666815503002-5f07a44ac8fb?auto=format&fit=crop&w=800&q=80',
//   'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=800&q=80',
// ];

const toPercentage = (target: number, current: number) => {
  if (target === 0) {
    return 0; // Prevent division by zero
  }

  return (current / target) * 100;
};

export const Card = ({
  title,
  description,
  id,
  image,
  goal_amount,
  current_amount,
  end_date,
}: Props) => {
  const ref = useRef<ProgressBarRef | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current?.setProgress(toPercentage(goal_amount, current_amount));
    }
  }, [current_amount, goal_amount]);

  return (
    <Link href={`/feed/${id}`} asChild>
      <Pressable>
        <View className="m-2 overflow-hidden rounded-xl  border border-neutral-300 bg-white  dark:bg-neutral-900">
          <Image
            className="h-56 w-full overflow-hidden rounded-t-xl"
            contentFit="cover"
            source={{
              uri: image
                ? `${Env.API_URL}/assets/${image}`
                : 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=720',
            }}
          />

          <View className="p-4">
            <Text className="py-2 text-2xl ">{title}</Text>
            <Text numberOfLines={4} className="leading-snug text-gray-600">
              {description}
            </Text>
          </View>
          <View className="p-4 pt-2">
            <ProgressBar ref={ref} />
            <View className="mt-2 flex flex-row justify-between">
              <Text className="leading-snug text-gray-500">
                {toPercentage(goal_amount, current_amount)}% funded
              </Text>
              <Text className="leading-snug text-gray-500">
                close in {dayjs(end_date).fromNow(true)}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};
