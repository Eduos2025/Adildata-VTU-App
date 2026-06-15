export const mapNetworkFromAPI = (apiNetwork: any): string | null => {
  if (typeof apiNetwork === "string") {
    const networkMap: { [key: string]: string } = {
      "mtn nigeria": "mtn",
      "airtel nigeria": "airtel",
      "glo nigeria": "glo",
      "9mobile nigeria": "etisalat",
      "etisalat nigeria": "etisalat",
      "t2 mobile nigeria": "etisalat",
      "9mobile": "etisalat",
      etisalat: "etisalat",
    };
    const key = apiNetwork.toLowerCase().trim();
    return networkMap[key] || null;
  }

  // If it's an object with id property
  if (apiNetwork && typeof apiNetwork === "object" && apiNetwork.id) {
    const idMap: { [key: string]: string } = {
      mtn: "mtn",
      airtel: "airtel",
      glo: "glo",
      "9mobile": "etisalat",
      etisalat: "etisalat",
      "t2 mobile": "etisalat",
    };
    const id = String(apiNetwork.id).toLowerCase().trim();
    return idMap[id] || null;
  }

  return null;
};
