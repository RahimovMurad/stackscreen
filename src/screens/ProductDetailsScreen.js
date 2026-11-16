import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { list } from "../products";
import ProductForm from "./ProductForm";

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  let product;
  try { product = list().find(item => item.id === id); }
  catch { return <Text>Məhsulu açmaq mümkün olmadı.</Text>; }
  return product ? <ProductForm key={id} product={product} /> : <Text>Məhsul tapılmadı.</Text>;
}
