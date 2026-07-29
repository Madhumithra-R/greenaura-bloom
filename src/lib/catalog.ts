import productBird from "@/assets/product-bird-of-paradise.jpg";
import productFicus from "@/assets/product-ficus.jpg";
import productOlive from "@/assets/product-olive.jpg";
import plant1 from "@/assets/plant-1.jpg";
import plant2 from "@/assets/plant-2.jpg";
import plant3 from "@/assets/plant-3.jpg";
import plant4 from "@/assets/plant-4.jpg";
import plant5 from "@/assets/plant-5.jpg";
import plant6 from "@/assets/plant-6.jpg";
import plantRhaphidophora from "@/assets/plant-rhaphidophora.jpg";
import plantZz from "@/assets/plant-zz.jpg";
import plantCastIron from "@/assets/plant-cast-iron.jpg";
import plantAglaonema from "@/assets/plant-aglaonema.jpg";
import plantPeaceLily from "@/assets/plant-peace-lily.jpg";
import plantFiddleLeaf from "@/assets/plant-fiddle-leaf.jpg";
import plantKentia from "@/assets/plant-kentia.jpg";
import plantDracaena from "@/assets/plant-dracaena.jpg";
import plantLemon from "@/assets/plant-lemon.jpg";
import plantRosemary from "@/assets/plant-rosemary.jpg";
import plantEcheveria from "@/assets/plant-echeveria.jpg";
import plantPearls from "@/assets/plant-string-of-pearls.jpg";
import plantPothos from "@/assets/plant-pothos.jpg";
import placeholder from "/placeholder.svg";

const imageMap: Record<string, string> = {
  "product-bird-of-paradise": productBird,
  "product-ficus": productFicus,
  "product-olive": productOlive,
  "plant-1": plant1,
  "plant-2": plant2,
  "plant-3": plant3,
  "plant-4": plant4,
  "plant-5": plant5,
  "plant-6": plant6,
  "plant-rhaphidophora": plantRhaphidophora,
  "plant-zz": plantZz,
  "plant-cast-iron": plantCastIron,
  "plant-aglaonema": plantAglaonema,
  "plant-peace-lily": plantPeaceLily,
  "plant-fiddle-leaf": plantFiddleLeaf,
  "plant-kentia": plantKentia,
  "plant-dracaena": plantDracaena,
  "plant-lemon": plantLemon,
  "plant-rosemary": plantRosemary,
  "plant-echeveria": plantEcheveria,
  "plant-string-of-pearls": plantPearls,
  "plant-pothos": plantPothos,
};

export const productImage = (key: string | null | undefined) => {
  if (!key) return placeholder;
  if (key.startsWith("http") || key.startsWith("/")) return key;
  return imageMap[key] ?? placeholder;
};

export const formatPrice = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price_cents: number;
  image_url: string | null;
  stock: number;
  featured: boolean;
};
