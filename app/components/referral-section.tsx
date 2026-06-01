import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Clipboard,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const ReferralSection = ({
  referralCode,
  referralLink,
}: {
  referralCode: string |null;
  referralLink: string;
}) => {
  const { isDark, colors } = useTheme();

  return (
    <View style={{ margin: 20 }}>
      <Text
        style={{
          color: colors.text,
          fontSize: 15,
          fontWeight: "700",
        }}
      >
        Our Referal Program
      </Text>
      <Text>Refer and earn using the referral code below.</Text>
      <View>
        <Text></Text>
        <TouchableOpacity
          style={[
            {
              backgroundColor: colors.accent,
              marginLeft: 8,
              paddingHorizontal: 8,
              paddingVertical: 4,
            },
          ]}
          onPress={() => {
            // Copy to clipboard
            Clipboard.setString(referralCode || "");
          }}
        >
          <Text
            style={[
              {
                fontSize: 12,
                color: colors.text,
              },
            ]}
          >
            copy{" "}
            <Ionicons
              name="copy-outline"
              size={12}
              color={isDark ? "#000000" : "#ffffff"}
            />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReferralSection;

const styles = StyleSheet.create({});
