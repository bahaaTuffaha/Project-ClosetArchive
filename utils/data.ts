export const categoryLayoutImages = [
  require("../assets/images/layoutTshirt.png"),
  require("../assets/images/layoutTrousers.png"),
  require("../assets/images/layoutshoes.png"),
  require("../assets/images/layoutJacket.png"),
  require("../assets/images/layoutTie.png"),
  require("../assets/images/layoutAccessories.png"),
];
const layout = require("../assets/images/layout1.png");
export function layoutFinder(type: string) {
  switch (type) {
    case "T-Shirt":
    case "Blouse":
    case "Polo Shirt":
    case "Shirt":
      return categoryLayoutImages[0];
      break;

    case "Jeans":
    case "Trousers":
    case "Joggers":
    case "Leather Pants":
      return categoryLayoutImages[1];
      break;

    case "Jacket":
    case "blazer":
      return categoryLayoutImages[3];
      break;

    case "Casual Shoes":
    case "Boots":
    case "Sneakers":
      return categoryLayoutImages[2];
      break;

    default:
      return layout;
      break;
  }
}

export const RandomNamesP1 = [
  "Wildfire",
  "Sun Spirit",
  "Cozy Sweater",
  "Neon Nights",
  "Stardust Surfer",
  "Cl. Comfort",
  "Classic Shirt",
  "Elegant Blouse",
  "Modern Jeans",
  "Urban Chic",
  "Casual Cool",
  "Easy Breezy",
  "StreetSmart",
  "Simp. Sophistic.",
  "Modern Minimalism",
  "Relaxed Vibes",
  "Vers. Essentials",
  "Casual Vibes",
  "Effortless St.",
  "Trendy Basics",
  "Casual Chic",
  "Modern Edge",
  "Easygoing Fash.",
  "Stylish Shorts",
  "Relaxed Hoodie",
];

export const seasonList = [
  {
    value: "Spring",
    label: "Spring",
  },
  {
    value: "Summer",
    label: "Summer",
  },
  {
    value: "Fall",
    label: "Fall",
  },
  {
    value: "Winter",
    label: "Winter",
  },
];
export const fitList = [
  {
    value: "Regular Fit",
    label: "Regular Fit",
  },
  {
    value: "Slim Fit",
    label: "Slim Fit",
  },
  {
    value: "Oversized Fit",
    label: "Oversized Fit",
  },
  {
    value: "Relaxed Fit",
    label: "Relaxed Fit",
  },
  {
    value: "Loose Fit",
    label: "Loose Fit",
  },
];

export const sizeList = [
  { label: "US", value: "US" },
  { label: "UK", value: "UK" },
  { label: "EU", value: "EU" },
  { label: "Asia", value: "Asia" },
  { label: "Int'l", value: "Int'l" },
];

export const languagesList = [
  {
    value: 0,
    label: "En",
  },
  {
    value: 1,
    label: "Ar",
  },
  {
    value: 2,
    label: "Es",
  },
];
