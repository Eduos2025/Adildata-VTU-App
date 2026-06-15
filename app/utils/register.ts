import { endPoints } from "@/constants/urls";

export const handleRegister = async ({
  fullName,
  email,
  phone,
  password,
  state,
  referal,
}: {
  fullName: string;
  email: string;
  phone: string;
  state: string;
  password: string;
  referal: string;
}): Promise<boolean> => {
  const data = {
    fullName,
    email,
    phone,
    state,
    password,
    referal,
  };

  try {
    const response = await fetch(endPoints.register, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const json = await response.json();

    console.log(json);

    if (json.status !== "success") return false;

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
