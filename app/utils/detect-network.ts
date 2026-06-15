import { networks } from "@/constants/networks";
import { endPoints } from "@/constants/urls";
import { mapNetworkFromAPI } from "./map-network-from-api";

export const detectNetworkUtil = async (phone: string) => {
  try {
    const res = await fetch(endPoints.detectNetwork, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone }),
    });

    const data = await res.json();
  
    if (!data.network || !data.raw) return null;

    const networkId = mapNetworkFromAPI(data.network || data.raw);

    if (!networkId) return null;

    const detected = networks.find((net) => net.id === networkId);

    if (!detected) return null;

    return detected;
  } catch (e) {
    console.log(e);
    return null;
  }
};
