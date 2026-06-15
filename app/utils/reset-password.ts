import { endPoints } from "@/constants/urls";

export const resetPassword = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch(endPoints.resetPassword, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const json = await response.json();
    if (!json.success) return false;

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
