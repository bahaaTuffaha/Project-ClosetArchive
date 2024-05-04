export const colors = {
  mainCyan: "#77AEBB",
  mainGreen: "#AEBB77",
  mainPink: "#BB77AE",
  darkblue: "#2b2e3d",
  black: "#000000",
  white: "white",
  gray: "gray",
  yellow: "#F7C600",
  red: "#D30047",
};

export function categorizeColor(hexColor: string) {
  // Remove the '#' symbol if present
  hexColor = hexColor.replace("#", "");

  // Convert hex to RGB
  var r = parseInt(hexColor.substring(0, 2), 16);
  var g = parseInt(hexColor.substring(2, 4), 16);
  var b = parseInt(hexColor.substring(4, 6), 16);

  // Check if it's a grayscale color
  if (r === g && g === b) {
    if (r === 0) {
      return "black"; // If all values are 0, it's black
    } else if (r === 255) {
      return "white"; // If all values are 255, it's white
    } else {
      return "gray"; // For all other grayscale colors, classify as gray
    }
  }

  // Calculate the hue using the RGB values
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let hue;
  if (max === min) {
    hue = 0;
  } else {
    switch (max) {
      case r:
        hue = (60 * ((g - b) / (max - min)) + 360) % 360;
        break;
      case g:
        hue = 60 * ((b - r) / (max - min)) + 120;
        break;
      case b:
        hue = 60 * ((r - g) / (max - min)) + 240;
        break;
    }
  }

  // Classify the color based on its hue
  if (hue >= 30 && hue < 45) {
    return "yellow";
  } else if (hue >= 45 && hue < 60) {
    return "yellow_Orange";
  } else if (hue >= 60 && hue < 90) {
    return "orange";
  } else if (hue >= 90 && hue < 135) {
    return "red_Orange";
  } else if (hue >= 135 && hue < 165) {
    return "yellow_Green";
  } else if (hue >= 165 && hue < 195) {
    return "green";
  } else if (hue >= 195 && hue < 255) {
    return "blue_Green";
  } else if (hue >= 255 && hue < 285) {
    return "blue";
  } else if (hue >= 285 && hue < 315) {
    return "blue_Violet";
  } else if (hue >= 315 && hue < 345) {
    return "red_Violet";
  } else if ((hue >= 345 && hue <= 360) || (hue >= 0 && hue < 15)) {
    return "red";
  } else if (hue >= 15 && hue < 30) {
    return "violet";
  } else {
    return "unknown"; // Return unknown for colors that don't fall within any of the specified ranges
  }
}
