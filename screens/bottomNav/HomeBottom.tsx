import { Text, View } from "react-native";
import React, { useEffect, useRef } from "react";
import Lottie from "lottie-react-native";
import { ThemeView } from "../../components/ThemeView";
export function HomeBottom() {
  //this is the main page
  const animationRef = useRef<Lottie>(null);
  useEffect(() => {
    animationRef.current?.play();

    // Or set a specific startFrame and endFrame with:
    // animationRef.current?.play(30, 120);
  }, []);

  return (
    <ThemeView classNameStyle="px-5">
      <View className="flex flex-col">
        <Text className="font-light text-lg italic pt-5">
          Welcome back, {"bahaa"}
        </Text>
        <>
          <Lottie
            ref={animationRef}
            style={{ width: "100%", alignSelf: "center" }}
            source={require("../../assets/jsonAnimations/cloths1.json")}
          />
          <Text className="self-center">Your closet history is empty</Text>
        </>
      </View>
    </ThemeView>
  );
}
