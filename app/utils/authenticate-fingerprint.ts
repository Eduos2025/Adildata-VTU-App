import * as LocalAuthentication from "expo-local-authentication";

export const authenticateFingerprint = async (
  promptMessage: string,
): Promise<boolean> => {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
    });

    if (!result.success) return false;

    return true;
  } catch (error) {
    return false;
  }
};
