import { referralData } from "@/constants/types";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

import * as Clipboard from "expo-clipboard";
import {
    Alert,
    FlatList,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import useUserStore from "../states/user";

export default function ReferralStatsScreen({
  referralData,
}: {
  referralData: referralData;
}) {
  const user = useUserStore((state) => state.user);

  const { colors } = useTheme();
  const copyCode = async () => {
    await Clipboard.setStringAsync(user!.referralCode!);
    Alert.alert("Copied", "Referral code copied");
  };

  const shareReferral = async () => {
    try {
      await Share.share({
        title: "Billpoint Referral",
        message: `🎉 Join Billpoint today!

  Use my referral code: ${user!.referralCode}

  Sign up and complete your first transaction to get started.

  Download the app here:
  ${user?.referralLink}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <View
          style={[
            styles.statCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={styles.statValue}>{referralData.total_referred}</Text>
          <Text style={styles.statLabel}>Total Referrals</Text>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={styles.statValue}>₦{referralData.total_earnings}</Text>
          <Text style={styles.statLabel}>Total Earnings</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Referral Code
      </Text>

      <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
        <Text
          numberOfLines={1}
          style={[styles.infoText, { color: colors.textMuted }]}
        >
          {referralData.referral_code}
        </Text>

        <Ionicons
          name="copy-outline"
          size={22}
          color="#3366FF"
          onPress={copyCode}
        />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Referral Link
      </Text>

      <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
        <Text
          numberOfLines={1}
          style={[styles.infoText, { color: colors.textMuted }]}
        >
          {referralData.referral_link}
        </Text>
      </View>

      <TouchableOpacity style={styles.shareButton} onPress={shareReferral}>
        <Ionicons name="share-social-outline" size={20} color="#fff" />

        <Text style={styles.shareText}>Share Referral Link</Text>
      </TouchableOpacity>

      <Text style={[styles.usersTitle, { color: colors.text }]}>
        Referred Users
      </Text>

      {referralData.referred_users.length === 0 ? (
        <View style={[styles.emptyContainer]}>
          <Ionicons name="people-outline" size={50} color="#999" />

          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No referrals yet
          </Text>

          <Text style={[styles.emptyDescription, { color: colors.textMuted }]}>
            Invite friends and start earning commissions on their transactions.
          </Text>
        </View>
      ) : (
        <FlatList
          scrollEnabled={false}
          data={referralData.referred_users}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <Ionicons
                name="person-circle-outline"
                size={45}
                color="#3366FF"
              />

              <View>
                <Text style={styles.userName}>Hi</Text>

                <Text style={styles.userEmail}>email</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  statsRow: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 25,
  },

  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },

  statValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#3366FF",
  },

  statLabel: {
    marginTop: 8,
    color: "#666",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 15,
  },

  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  infoText: {
    flex: 1,
    color: "#333",
  },

  shareButton: {
    marginTop: 25,
    backgroundColor: "#3366FF",
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  shareText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  usersTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 35,
    marginBottom: 15,
  },

  emptyContainer: {
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 15,
  },

  emptyDescription: {
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
  },

  userItem: {
    borderRadius: 14,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  userName: {
    fontWeight: "600",
    fontSize: 16,
  },

  userEmail: {
    color: "#777",
    marginTop: 2,
  },
});
