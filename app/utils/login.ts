import { endPoints } from "@/constants/urls";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { verifyToken } from "./verify-token";

export const handleFingerprintLogin = async (): Promise<boolean> => {
  // Check if device supports biometrics
  const compatible = await LocalAuthentication.hasHardwareAsync();
  if (!compatible) {
    alert("Device does not support fingerprint");
    return false;
  }

  // Authenticate user
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Login with Fingerprint",
  });

  if (!result.success) return false;

  await AsyncStorage.setItem("finger", "1");

  try {
    // ✅ Get stored token
    const token = await AsyncStorage.getItem("userToken");

    if (!token) {
      alert("No saved login session");
      return false;
    }

    const isVerified = await verifyToken(token);

    if (!isVerified) {
      alert("Session expired. Please login again.");
      return false;
    }

    return true;
  } catch (err) {
    console.log(err);
    alert("Error verifying session");
    return false;
  }
};

export const handleLogin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<boolean> => {
  try {
    const response = await fetch(endPoints.login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const json = await response.json();

    if (json.status !== "success") return false;

    // ✅ STORE TOKEN
    await AsyncStorage.setItem("user", JSON.stringify(json.data));
    await AsyncStorage.setItem("userToken", json.data.token);

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
