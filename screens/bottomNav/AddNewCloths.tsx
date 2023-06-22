import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"
import { Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import hangerImage from '../../assets/images/hanger.png';
import recordImage from '../../assets/images/record.png';

export const AddNewCloths = ({ }) => {
    const { width, height } = Dimensions.get('window');
    const amountOfSpace = 200;
    const space = useSharedValue(200);
    const invisibility4Content = useSharedValue(0.01);
    const closeLeftAnimation = useAnimatedStyle(() => {
        return {
            marginLeft: withTiming(space.value, { duration: 500 }),
        };
    }, []);
    const closeRightAnimation = useAnimatedStyle(() => {
        return {
            marginRight: withTiming(space.value, { duration: 500 }),
        };
    }, []);
    const showTextAnimation = useAnimatedStyle(() => {
        return {
            opacity: withTiming(invisibility4Content.value, { duration: 500 }),
        };
    }, []);

    useFocusEffect(useCallback(() => {
        space.value = 0;
        invisibility4Content.value = 1;
        return () => { space.value = amountOfSpace, invisibility4Content.value = 0.01 }
    }, [invisibility4Content, space]))

    const angleA = Math.asin(height / Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))) * (180 / Math.PI);
    const angleB = 90 - angleA;

    return (
        <>
            <View style={{ transform: "rotate(-" + angleB + "deg)", position: "absolute", elevation: 1 }}>

                <Animated.View style={[{
                    height: height * 2,
                    width: width * 2,
                    backgroundColor: '#AEBB77',
                    left: "50%",
                    position: "absolute",
                    marginLeft: amountOfSpace,

                }, closeLeftAnimation]} />
                <Animated.View style={[{
                    height: height * 2,
                    width: width * 2,
                    backgroundColor: '#77AEBB',
                    position: "absolute",
                    right: "50%",
                    marginRight: amountOfSpace,
                }, closeRightAnimation]} />
            </View>
            <Animated.View style={[{ elevation: 2, flex: 1 }, showTextAnimation]}>
                <TouchableOpacity style={[styles.labelButton, { top: 0, right: 0, }]} onPress={() => console.log("green")}>
                    <Text style={styles.labelText}>Add a new piece of clothing</Text>
                    <Image resizeMode="contain" source={hangerImage} style={{ width: width * 0.4, alignSelf: "flex-end" }} /></TouchableOpacity>
                <TouchableOpacity onPress={() => console.log("blue")} style={[styles.labelButton, { left: 0, bottom: 0 }]}>
                    <Image resizeMode="contain" source={recordImage} style={{ width: width * 0.3, alignSelf: "flex-start" }} />
                    <Text style={styles.labelText}>Record a log for a piece of clothing </Text>
                </TouchableOpacity>
            </Animated.View>

        </>

    )
}
const styles = StyleSheet.create({
    labelButton: {
        position: "absolute", width: "60%",
    },
    labelText: {
        fontFamily: 'LibreBarcode128Text-Regular', fontSize: 64, color: "white", textAlign: "center", marginVertical: 15
    },
});