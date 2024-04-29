import { useEffect, useState } from "react";
import { Dimensions } from "react-native";

export default function useWidthScreen() {
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width,
  );
  useEffect(() => {
    const dimensionListener = Dimensions.addEventListener(
      "change",
      (dimensions) => {
        setScreenWidth(dimensions.window.width);
      },
    );
    return () => dimensionListener.remove();
  }, []);
  return screenWidth;
}
