import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  LogoImg: {
    width: 300,
    overflow: "hidden",
    height: 150,
    borderRadius: 10,
    // backgroundColor: "midnightblue",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  LogoImgB: {
    width: "100%",
    height: "100%",
    marginHorizontal: "auto",
    borderRadius: 10,
    margin: 0,
    objectFit: "contain",
  },

  titleText: {
    fontSize: 17,
    textAlign: "center",
    marginTop: 10,
    color: "black",
    marginHorizontal: 30,
  },

  welcom: {
    textAlign: "center",
    fontSize: 24,
    marginBottom: 10,
    marginTop: 50,
    fontWeight: "600",
  },

  welB: {
    fontSize: 14,
    marginTop: -70,
    marginRight: -12,
  },

  pl: {
    fontSize: 15,
    marginBottom: -10,
    marginHorizontal: 15,
  },
});
