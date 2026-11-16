import { UsersProvider } from "@/context/UsersContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <UsersProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Məhsullar" }} />
        <Stack.Screen name="add" options={{ title: "Yeni məhsul" }} />
        <Stack.Screen name="product" options={{ title: "Məhsul detalları" }} />
        <Stack.Screen name="profile" options={{ title: "Profile" }} />
        <Stack.Screen name="edit" options={{ title: "Edit User" }} />
      </Stack>
    </UsersProvider>
  );
}
