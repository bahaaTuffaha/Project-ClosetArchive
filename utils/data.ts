import { accessories_en } from "./localization";

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
    case "Short Sleeve Shirt":
      return categoryLayoutImages[0];
    case "Jeans":
    case "Trousers":
    case "Joggers":
    case "Leather Pants":
      return categoryLayoutImages[1];

    case "Jacket":
    case "blazer":
      return categoryLayoutImages[3];

    case "Casual Shoes":
    case "Boots":
    case "Sneakers":
      return categoryLayoutImages[2];

    case "Tie":
      return categoryLayoutImages[4];
    default:
      if (accessories_en.find((x) => x.label == type)) {
        return categoryLayoutImages[5];
      } else {
        return layout;
      }
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

const seasonList_en = [
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
const seasonList_ar = [
  {
    value: "Spring",
    label: "ربيع",
  },
  {
    value: "Summer",
    label: "صيف",
  },
  {
    value: "Fall",
    label: "خريف",
  },
  {
    value: "Winter",
    label: "شتاء",
  },
];
const seasonList_es = [
  {
    value: "Spring",
    label: "Primavera",
  },
  {
    value: "Summer",
    label: "Verano",
  },
  {
    value: "Fall",
    label: "Otoño",
  },
  {
    value: "Winter",
    label: "Invierno",
  },
];
const seasonList_it = [
  {
    value: "Spring",
    label: "Primavera",
  },
  {
    value: "Summer",
    label: "Estate",
  },
  {
    value: "Fall",
    label: "Autunno",
  },
  {
    value: "Winter",
    label: "Inverno",
  },
];

export const seasonList = [
  seasonList_en,
  seasonList_ar,
  seasonList_es,
  seasonList_it,
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
  {
    value: 3,
    label: "It",
  },
];
