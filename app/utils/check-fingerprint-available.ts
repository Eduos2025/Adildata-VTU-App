import * as LocalAuthentication from "expo-local-authentication";

export const checkFingerprintAvailabe = async (): Promise<boolean> => {
  try {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) return false;

    return true;
  } catch (error) {
    return false;
  }
};
