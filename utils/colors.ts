export const colors = {
  mainCyan: "#77AEBB",
  mainGreen: "#AEBB77",
  mainPink: "#BB77AE",
  darkblue: "#2b2e3d",
  black: "#000000",
  white: "white",
  gray: "gray",
  yellow: "#F7C600",
};

export function categorizeColor(hexColor: string) {
  // Remove leading # if present
  hexColor = hexColor.replace(/^#/, "");

  // Ensure string length is 6 and convert to lowercase
  if (hexColor.length !== 6) {
    throw new Error("Invalid hex color format");
  }
  hexColor = hexColor.toLowerCase();

  // Convert hex to RGB values
  const rgb = {
    r: parseInt(hexColor.substring(0, 2), 16),
    g: parseInt(hexColor.substring(2, 4), 16),
    b: parseInt(hexColor.substring(4, 6), 16),
  };

  // Define color ranges (using RGB space for simplicity)
  const colorRanges = {
    yellow: [
      [255, 230, 0],
      [255, 255, 0],
    ],
    yellowOrange: [
      [255, 215, 35],
      [255, 255, 102],
    ],
    yellowGreen: [
      [173, 255, 47],
      [255, 255, 179],
    ],
    orange: [
      [255, 165, 0],
      [255, 200, 0],
    ],
    green: [
      [0, 128, 0],
      [0, 255, 127],
    ],
    redOrange: [
      [255, 127, 39],
      [255, 160, 84],
    ],
    blueGreen: [
      [0, 139, 139],
      [0, 255, 255],
    ],
    red: [
      [255, 0, 0],
      [255, 96, 76],
    ],
    blue: [
      [0, 0, 255],
      [0, 127, 255],
    ],
    redViolet: [
      [224, 32, 112],
      [255, 127, 189],
    ],
    blueViolet: [
      [95, 0, 255],
      [153, 0, 255],
    ],
    violet: [
      [128, 0, 128],
      [255, 0, 255],
    ],
  };

  // Check if color is white or black first
  if (rgb.r === rgb.g && rgb.g === rgb.b) {
    if (rgb.r === 255) {
      return "white";
    } else if (rgb.r === 0) {
      return "black";
    }
  }

  // Check if color falls within specific ranges
  for (const [color, range] of Object.entries(colorRanges)) {
    if (
      rgb.r >= range[0][0] &&
      rgb.r <= range[1][0] &&
      rgb.g >= range[0][1] &&
      rgb.g <= range[1][1] &&
      rgb.b >= range[0][2] &&
      rgb.b <= range[1][2]
    ) {
      return color;
    }
  }

  // Default to closest gray if no specific match
  const isCloserToDarkGray = (rgb.r + rgb.g + rgb.b) / 3 < 128;
  return isCloserToDarkGray ? "dark gray" : "light gray";
}
