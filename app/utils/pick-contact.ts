import * as Contacts from "expo-contacts";

export const pickContact = async (): Promise<string | null> => {
  const { status } = await Contacts.requestPermissionsAsync();

  if (status !== "granted") {
    alert("Permission to access contacts was denied");
    return null;
  }

  const contact = await Contacts.presentContactPickerAsync();

  if (!contact || !contact.phoneNumbers || contact.phoneNumbers.length < 1) {
    return null;
  }

  let number = contact.phoneNumbers[0].number || "";

  // Remove spaces, +234, -, brackets, etc.
  number = number.replace(/\D/g, "");

  // Convert +234xxxxxxxxxx to 0xxxxxxxxxx
  if (number.startsWith("234")) {
    number = "0" + number.slice(3);
  }

  return number;
};
