import { endPoints } from "@/constants/urls";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useUserStore from "../states/user";

export const purchaseAirtime = async (
  amount: number,
  number: string,
  network: string,
  pin: string,
): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem("userToken");

    if (!token) return false;

    const response = await fetch(endPoints.buyAirtime, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        amount,
        number,
        network,
        pin,
      }),
    });

    const data = await response.json();

    console.log(data);

    if (!data.success) return false;

    useUserStore.getState().refreshDashboard();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
