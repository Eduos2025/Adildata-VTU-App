import { referralData } from "@/constants/types";
import { endPoints } from "@/constants/urls";
import { useTheme } from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Header from "../components/header";
import ReferralStatsScreen from "../components/referral-stats";

export default function ReferralScreen() {
  const { colors } = useTheme();
  //   const user = useUserStore((state) => state.user);

  const [referralData, setReferralData] = useState<referralData | null>(null);

  const getReferralStats = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    if (!userToken) return;
    console.log("loading");
    try {
      const response = await fetch(endPoints.getReferralStats, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-Token": userToken,
        },
        // body: JSON.stringify({ token: userToken }),
      });

      const data = await response.json();

      console.log(data);
      const refData = {
        referral_code: data.data.referral_code,
        referral_link: data.data.referral_link,
        referred_users: data.data.referred_users,
        total_earnings: data.data.total_earnings,
        total_referred: data.data.total_referred,
        share_message: data.data.share_message,
      };
      setReferralData(refData);
      console.log(refData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getReferralStats();
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header title="Referral" />

        {/* Card */}

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, shadowColor: colors.text },
          ]}
        >
          {/* Illustration */}
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
              }}
              resizeMode="contain"
              style={styles.image}
            />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>
            Refer friends and Earn instantly
          </Text>

          {/* Subtitle */}
          <Text style={[styles.description, { color: colors.textMuted }]}>
            Invite friends to Adil Data and earn on each referral.
          </Text>
        </View>
        {referralData ? (
          <ReferralStatsScreen referralData={referralData} />
        ) : (
          <ActivityIndicator />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
    marginBottom: 25,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
  },

  card: {
    borderRadius: 24,
    marginBottom: 24,
    padding: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },

  imageContainer: {
    height: 120,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  image: {
    width: 100,
    height: 100,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    marginTop: 25,
    lineHeight: 30,
  },

  description: {
    fontSize: 17,
    color: "#444",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 26,
  },

  codeContainer: {
    marginTop: 30,
    height: 64,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  codeText: {
    fontWeight: "700",
    letterSpacing: 1,
  },

  shareButton: {
    marginTop: 20,
    height: 62,
    borderRadius: 16,
    backgroundColor: "#3561E7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#3561E7",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 5,
  },

  shareText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  historyText: {
    textAlign: "center",
    marginTop: 22,
    fontSize: 20,
    fontWeight: "600",
    color: "#3561E7",
  },
});
