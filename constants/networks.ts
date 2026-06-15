import { NetworkType } from "./types";

export const networks: Array<NetworkType> = [
  { id: "mtn", label: "MTN", logo: require("@/assets/images/mtn.png") },
  {
    id: "airtel",
    label: "Airtel",
    logo: require("@/assets/images/airtel.png"),
  },
  { id: "glo", label: "Glo", logo: require("@/assets/images/glo.png") },
  {
    id: "etisalat",
    label: "9mobile",
    logo: require("@/assets/images/9mobile.png"),
  },
];
