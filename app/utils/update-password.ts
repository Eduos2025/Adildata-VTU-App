import { endPoints } from "@/constants/urls";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const updatePassword = async (
  email: string,
  password: string,
  newPassword: string,
): Promise<boolean> => {
  try {
    // 1️⃣ First Verify Current Password (this will give us a fresh token)

    const loginRes = await fetch(endPoints.login, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const loginData = await loginRes.json();

    if (loginData.status !== "success") return false;

    // ✅ Update fresh session tokens locally
    await AsyncStorage.setItem("user", JSON.stringify(loginData.data));
    await AsyncStorage.setItem("userToken", loginData.data.token);
    // await AsyncStorage.setItem("finger", loginData.finger);

    // 2️⃣ Now Update to New Password using the FRESH token
    const response = await fetch(endPoints.setPassword, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: loginData.data.token,
        type: "loginPassword",
        value: newPassword,
      }),
    });

    const data = await response.json();
    console.log(data);

    if (!data.success) return false;

    return true;
  } catch (error) {
    return false;
  }
};
