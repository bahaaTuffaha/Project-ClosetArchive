import React, { useState, useEffect, useRef } from "react";
import { View, Image } from "react-native";

const SpriteAnimator = ({ sheet, columns, size, fps = 16, play = true }) => {
  const imgRef = useRef(null);
  const [imgWidth, setImgWidth] = useState(0);
  const [spriteIndex, setSpriteIndex] = useState(0);

  useEffect(() => {
    if (imgRef.current && imgWidth == 0) {
      setImgWidth((_) => size * columns);
    }
  }, [imgRef, imgWidth]);

  useEffect(() => {
    if (play) {
      if (spriteIndex < columns - 1) {
        setTimeout(() => {
          setSpriteIndex((prev) => prev + 1);
        }, 1000 / fps);
      } else {
        setTimeout(() => {
          setSpriteIndex(0);
        }, 1000 / fps);
      }
    } else if (!play && spriteIndex > 0) {
      setSpriteIndex(0);
    }
  }, [spriteIndex]);

  return (
    <View
      style={{ height: size, width: imgWidth / columns, overflow: "hidden" }}
    >
      <Image
        source={sheet}
        ref={imgRef}
        style={{
          position: "relative",
          right: (spriteIndex * imgWidth) / columns,
          height: size,
          width: imgWidth,
        }}
      />
    </View>
  );
};

export default SpriteAnimator;