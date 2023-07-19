import { Text } from "react-native";
import { ThemeView } from "../../components/ThemeView";
import React, { useEffect, useRef } from "react";
import Lottie from "lottie-react-native";
export const OutfitLog = () => {
  const animationRef = useRef<Lottie>(null);
  useEffect(() => {
    animationRef.current?.play();

    // Or set a specific startFrame and endFrame with:
    // animationRef.current?.play(30, 120);
  }, []);
  return (
    <ThemeView>
      <>
        <Lottie
          ref={animationRef}
          style={{ width: "100%", alignSelf: "center" }}
          source={require("../../assets/jsonAnimations/cloths1.json")}
        />
        <Text className="self-center">Your closet history is empty</Text>
      </>
    </ThemeView>
  );
};
