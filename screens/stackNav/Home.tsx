import React from 'react';
import { View } from 'react-native';
import MyTabs from '../../routers/BottomTabNav';
export function Home() {
  return (
    <View style={{ flex: 1 }}>
      <MyTabs />
    </View>
  );
}
