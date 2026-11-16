import { useState, useRef } from "react";
import { Button, Image, ScrollView, Text, TextInput } from "react-native";
import { File } from "expo-file-system";
import { router } from "expo-router";
import { imageUri, save } from "../products";

const input = { borderWidth: 1, borderColor: "#abb6bf", borderRadius: 8, padding: 12, backgroundColor: "white" };

export default function ProductForm({ product }) {
  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const uri = image?.uri ?? imageUri(product?.imageUrl);

  async function pick() {
    try {
      const result = await File.pickFileAsync({ mimeTypes: ["image/*"] });
      if (!result.canceled) setImage(result.result);
    } catch { setError("Şəkli açmaq mümkün olmadı."); }
  }

  async function submit() {
    const amount = price.trim().replace(",", ".");
    if (!name.trim() || !description.trim() || !/^\d+(\.\d{1,2})?$/.test(amount) || !Number.isFinite(Number(amount))) {
      setError("Ad, təsvir və düzgün qiymət daxil edin (məsələn, 12,50).");
      return;
    }
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    try {
      const id = product?.id ?? Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
      await save({ id, name: name.trim(), price: Number(amount), description: description.trim(), imageUrl: product?.imageUrl ?? "" }, image);
      if (router.canGoBack()) router.back(); else router.replace("/");
    } catch { setError("Məhsul yadda saxlanmadı. Yenidən cəhd edin."); }
    finally { lock.current = false; setBusy(false); }
  }

  return <ScrollView keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets contentContainerStyle={{ padding: 20, gap: 10 }}>
    {uri && <Image source={{ uri }} style={{ height: 180 }} resizeMode="contain" />}
    {!product && <Button title="Şəkil seç" onPress={pick} disabled={busy} />}
    <Text>Məhsulun adı</Text><TextInput accessibilityLabel="Məhsulun adı" style={input} value={name} onChangeText={setName} />
    <Text>Qiymət (₼)</Text><TextInput accessibilityLabel="Qiymət" style={input} keyboardType="decimal-pad" value={price} onChangeText={setPrice} />
    <Text>Təsvir</Text><TextInput accessibilityLabel="Təsvir" multiline style={[input, { minHeight: 90 }]} value={description} onChangeText={setDescription} />
    {!!error && <Text style={{ color: "#a32929" }}>{error}</Text>}
    <Button title={product ? "Yadda saxla" : "Əlavə et"} onPress={submit} disabled={busy} />
  </ScrollView>;
}
