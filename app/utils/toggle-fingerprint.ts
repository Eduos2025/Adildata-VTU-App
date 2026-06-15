import { endPoints } from "@/constants/urls";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import useUserStore from "../states/user";
import { authenticateFingerprint } from "./authenticate-fingerprint";

export const toggleFingerprint = async (value: boolean): Promise<boolean> => {
  try {
    const result = await authenticateFingerprint(
      value ? "Enable Fingerprint" : "Disable Fingerprint",
    );

    if (!result) {
      return false;
    }

    const userToken = await AsyncStorage.getItem("userToken");

    if (!userToken) return false;

    await AsyncStorage.setItem("finger", value ? "1" : "0");
    useUserStore.getState().setFingerPrintStatus();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Security Updated",
        body: value
          ? "Fingerprint authentication enabled"
          : "Fingerprint authentication disabled",
        sound: true,
      },
      trigger: null,
    });

    fetch(endPoints.fingerPrintSetting, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: userToken }),
    });

    return true;
  } catch (error) {
    console.error("Error updating fingerprint setting:", error);
    return false;
  }
};
