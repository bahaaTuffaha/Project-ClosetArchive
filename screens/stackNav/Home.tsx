import React from 'react';
import { View, useColorScheme } from 'react-native';
import MyTabs from '../../routers/BottomTabNav';
export function Home() {
  const isDarkMode = useColorScheme() === 'dark';
  //title == "Add"?'#77AEBB'
  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? "gray" : "white" }}>
      <MyTabs />
    </View>
  );
}
