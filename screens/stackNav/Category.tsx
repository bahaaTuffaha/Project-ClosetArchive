import { Dimensions, Pressable, Text, View, ViewStyle, useColorScheme } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import ImageSequence from 'react-native-image-sequence-2';
import { AnimatedStyleProp, interpolate } from 'react-native-reanimated';
import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { trousers } from './images';
const centerIndex = Math.round(36);
export type TAnimationStyle = (value: number) => AnimatedStyleProp<ViewStyle>;

export function Category() {
    const isDarkMode = useColorScheme() === 'dark';
    const { width, height } = Dimensions.get('window');
    const navigation = useNavigation<any>();

    const categoriesState = useSelector((state: RootState) => state.CategoryList)
    const animationStyle: TAnimationStyle = useCallback(
        (value: number) => {
            "worklet";

            const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 30]);
            const rotateZ = `${interpolate(
                value,
                [-1, 0, 1],
                [-45, 0, 45],
            )}deg`;
            const translateX = interpolate(
                value,
                [-1, 0, 1],
                [-width, 0, width],
            );

            return {
                transform: [{ rotateZ }, { translateX }],
                zIndex,
            };
        },
        [],
    );
    return (
        <View style={{ flex: 1, backgroundColor: isDarkMode ? "gray" : "white" }}>

            <Carousel
                loop
                windowSize={3} //number of elements that rendered
                width={width}
                height={height}
                autoPlay={false} // do redux + array for 
                data={[...categoriesState.Categories, { name: "Add New Category", sprites: trousers, screen: "CategoryForm" },]} // spread to add custom cate.. that are stored in redux ,at the last you should add "Add new category", add on press
                scrollAnimationDuration={1000}
                customAnimation={animationStyle}
                onSnapToItem={(index: any) => console.log('current index:', index)}
                renderItem={({ item }) => (
                    <View
                        style={{
                            flex: 1,
                            // borderWidth: 1,
                            alignItems: 'center',
                        }}
                    >
                        <Pressable onPress={() => navigation.navigate(item.screen, { category: 1 })}>
                            <Text className='text-3xl mt-10 uppercase mx-auto font-bold'>{item.name}</Text>
                            <ImageSequence
                                framesPerSecond={24}
                                images={item.sprites}
                                downsampleHeight={32}
                                downsampleWidth={32}
                                startFrameIndex={centerIndex}
                                style={{ width: 500, height: 500 }}
                            /></Pressable>
                    </View>
                )}
            />
        </View>
    );
}
