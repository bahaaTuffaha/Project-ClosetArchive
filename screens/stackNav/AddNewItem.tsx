import React from 'react';
import { View, useColorScheme } from 'react-native';
export function AddNewItem() {
    const isDarkMode = useColorScheme() === 'dark';
    return (
        <View style={{ flex: 1, backgroundColor: isDarkMode ? "gray" : "white" }}>

        </View>
    );
}
