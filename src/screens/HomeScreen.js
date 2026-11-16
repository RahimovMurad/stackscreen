import { useCallback, useState } from "react";
import { Button, FlatList, Image, Pressable, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { imageUri, list } from "../products";

export default function HomeScreen() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  useFocusEffect(useCallback(() => {
    try { setItems(list()); setError(""); }
    catch { setError("Siyahını açmaq mümkün olmadı."); }
  }, []));
  return <View style={{ flex: 1, padding: 18, gap: 14 }}>
    <Button title="Məhsul əlavə et" onPress={() => router.push("/add")} />
    {!!error && <Text>{error}</Text>}
    <FlatList data={items} keyExtractor={item => item.id}
      ListEmptyComponent={<Text>Hələ məhsul yoxdur.</Text>}
      renderItem={({ item }) => <Pressable accessibilityRole="button"
        style={{ padding: 16, backgroundColor: "white", borderRadius: 10, gap: 5, marginBottom: 10 }}
        onPress={() => router.push({ pathname: "/product", params: { id: item.id } })}>
        {!!item.imageUrl && <Image source={{ uri: imageUri(item.imageUrl) }} style={{ height: 140 }} resizeMode="contain" />}
        <Text style={{ fontSize: 18, fontWeight: "600" }}>{item.name}</Text>
        <Text>{item.price.toFixed(2)} ₼</Text><Text numberOfLines={2}>{item.description}</Text>
      </Pressable>} />
  </View>;
}
