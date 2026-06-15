import {
    AirtimeIcon,
    CacIcon,
    DataIcon,
    ElectricityIcon,
    ExamsIcon,
    TvIcon,
} from "./images";
import { ServiceType } from "./types";

export const services:Array<ServiceType> = [
  { id: "airtime", label: "Airtime", icon: AirtimeIcon },
  { id: "data", label: "Data", icon: DataIcon },
  { id: "electricity", label: "Electricity Bills", icon: ElectricityIcon },
  { id: "exams", label: "Exams Tokens", icon: ExamsIcon },
  { id: "tv", label: "TV Subscription", icon: TvIcon },
  { id: "cac", label: "CAC Registration", icon: CacIcon },
];
