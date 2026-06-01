import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Clipboard,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TransactionDetailModal from "../components/TransactionDetailModal";

const services = [
  { id: "airtime", label: "Airtime", icon: AirtimeIcon },
  { id: "data", label: "Data", icon: DataIcon },
  { id: "electricity", label: "Electricity Bills", icon: ElectricityIcon },
  { id: "exams", label: "Exams Tokens", icon: ExamsIcon },
  { id: "tv", label: "TV Subscription", icon: TvIcon },
  { id: "cac", label: "CAC Registration", icon: CacIcon },
];

// 🔹 Define the transaction type
type Transaction = {
  id: string;
  title: string;
  subtitle: string;
  amount: string;
  negative: boolean;
  fullReceipt?: any;
};

import * as Haptics from "expo-haptics";

import {
  AirtimeIcon,
  AppLogo,
  avater,
  CacIcon,
  CardBg,
  DataIcon,
  ElectricityIcon,
  ExamsIcon,
  TvIcon,
} from "@/constants/images";
import { User } from "@/constants/types";
import { endPoints } from "@/constants/urls";
import { APPNAME } from "@/constants/variables";
import * as Notifications from "expo-notifications";
import { useTheme } from "../../context/ThemeContext";
import IdentityVerificationModal from "../components/kyc-modal";
import useNotificationStore from "../states/notifications";
import useUserStore from "../states/user";

const Dashboard = () => {
  const { isDark, colors } = useTheme();
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true, // ✅ required in newer versions
      shouldShowList: true, // ✅ required in newer versions
    }),
  });

  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  const sendNotification = async (title: string, body: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        sound: true,
      },
      trigger: null, // 🔥 instant
    });
  };

  const not = async () => {
    await sendNotification(
      `Welcome back to ${APPNAME}`,
      `Get 1 GB as low as ₦250`,
    );
  };

  useEffect(() => {
    not();
  }, []);

  const [refreshing, setRefreshing] = useState(false);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  // const [email, setEmail] = useState("");
  // const [user, setUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTrx, setSelectedTrx] = useState<Transaction | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const triggerVibration = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  useEffect(() => {
    triggerVibration();
  }, []);

  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);

  const unreadCount = useNotificationStore((state) => state.unreadCount);

  const fetchNotifications = useNotificationStore(
    (state) => state.fetchNotifications,
  );

  // const fetchUnreadCount = useNotificationStore(
  //   (state) => state.fetchUnreadCount,
  // );

  useEffect(() => {
    const loadNotifications = async () => {
      await Promise.all([fetchNotifications()]);
    };

    loadNotifications();

    const interval = setInterval(loadNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchTransactions = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    if (!userToken) return;

    try {
      const response = await fetch(endPoints.getTransactions, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: userToken }),
      });

      const data = await response.json(); // <-- `data` is defined here

      if (!data || !data.success) {
        Alert.alert("Error", data?.message || "Failed to fetch transactions");
        return;
      }

      // Map and format transactions for display, limit to 3
      const formatted: Transaction[] = data.transactions
        .slice(0, 4) // take only first 3 items
        .map((trx: any, index: number) => ({
          id: trx.id.toString(),
          title: trx.title,
          subtitle: trx.subtitle,
          amount: trx.amount,
          negative: trx.negative,
          status: trx.status, // include status from API
          phone: trx.phone, // capture phone
          date: trx.date, // capture date
          fullReceipt: trx.fullReceipt, // optional full receipt
        }));

      setTransactions(formatted);
    } catch (error) {
      console.error("Fetch transactions error:", error);
      Alert.alert("Error", "Network or server error");
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchNotifications();
  }, []);

  useEffect(() => {
    // getBalance();
    getAccountDetails();
  }, [isModalVisible]);

  //Get Account Details Function
  const getAccountDetails = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");

      if (!userToken) return;

      const response = await fetch(endPoints.getAccountDetails, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: userToken }),
      });

      const data = await response.json();

      if (data.success) {
        setAccountNumber(data.account_number);
        setBankName(data.bank_name);
        setAccountName(data.account_name);
      } else {
        console.log("Account Error:", data.message);
      }
    } catch (error) {
      console.error("Account fetch error:", error);
    }
  };

  // 🔄 Pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // getBalance(true);
    fetchTransactions();
  }, []);

  // 👤 Load user from storage
  useEffect(() => {
    const loadUser = async () => {
      let myUser: User = {
        id: "",
        email: "",
        name: "",
        haspin: false,
        accName: "",
        accNo: "",
        adminRole: "",
        bankName: "",
        phone: "",
        referralCode: "",
        referralLink: "",
        walletBalance: 0,
        state: "",
      };
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const { id, email, name, phone, haspin } = JSON.parse(userData);

          myUser = {
            id: id,
            email: email,
            name: name,
            haspin: haspin,
            accName: "",
            accNo: "",
            adminRole: "",
            bankName: "",
            phone: phone,
            referralCode: "",
            referralLink: "",
            walletBalance: 0,
            state: "",
          };

          setUser(myUser);
        }

        const userToken = await AsyncStorage.getItem("userToken");
        if (!userToken) return;

        const response = await fetch(endPoints.profile, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: userToken }),
        });

        const data = await response.json();

        const updatedUser: User = {
          ...myUser,
          accName: data.data.acc_name,
          accNo: data.data.acc_no,
          bankName: data.data.bank_name,
          walletBalance: data.data.wallet_balance,
          referralLink: data.data.referral_link,
          referralCode: data.data.referral_code,
        };

        setUser(updatedUser);
        console.log(user);
      } catch (e) {
        console.log("User parse error:", e);
      }
    };

    loadUser();
  }, []);

  // 🔐 Redirect if no PIN
  useEffect(() => {
    if (user?.haspin === false) {
      router.replace("/Dashboard/set-pin");
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
      // getBalance(true);
    }, []),
  );

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { marginTop: -25, backgroundColor: colors.background },
      ]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.headerWrap}>
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",

                margin: 8,
                position: "relative",
              }}
              onPress={() => router.push("/Dashboard/notifications")}
            >
              <Ionicons
                name="notifications"
                style={{
                  color: colors.text,
                  fontSize: 32,
                }}
              />
              <View
                style={{
                  backgroundColor: colors.error,
                  borderRadius: "50%",
                  justifyContent: "center",
                  alignItems: "center",
                  width: 16,
                  height: 16,
                  position: "absolute",
                  right: 0,
                }}
              >
                <Text
                  style={{
                    color: colors.onPrimary,
                    fontSize: 10,
                    fontWeight: "bold",
                  }}
                >
                  {unreadCount}
                </Text>
              </View>
            </TouchableOpacity>

            <View
              style={[styles.headerCard, { backgroundColor: colors.primary }]}
            >
              <View style={styles.avatar}>
                <Image source={avater} style={styles.avatarImage} />
              </View>
              <View style={styles.headerTextWrap}>
                <Text style={[styles.userName, { color: "#ffffff" }]}>
                  {user?.name}
                </Text>
                <Text style={[styles.userType, { color: "#e6eeff" }]}>
                  Customer Account
                </Text>
              </View>
              <View style={styles.balanceWrap}>
                <Text style={[styles.balanceLabel, { color: "#e6eeff" }]}>
                  Balance
                </Text>
                <Text style={[styles.balanceValue, { color: "#ffffff" }]}>
                  ₦{balance}
                </Text>
              </View>
            </View>
          </View>
          {/* </LinearGradient> */}

          <ImageBackground
            source={CardBg}
            style={styles.bankCard}
            imageStyle={styles.bankCardImage}
          >
            <View
              style={[
                styles.bankCardOverlay,
                {
                  backgroundColor: isDark
                    ? "rgba(15, 23, 42, 0.82)"
                    : "rgba(255, 255, 255, 0.85)",
                },
              ]}
            >
              <View style={styles.bankRowTop}>
                <View>
                  <Text style={[styles.bankTitle, { color: colors.text }]}>
                    Bank Details
                  </Text>
                  {!accountName && !accountNumber ? (
                    <>
                      <Text
                        style={[styles.bankSub, { color: colors.textMuted }]}
                      >
                        Click on fund wallet to generate
                      </Text>
                      <Text
                        style={[styles.bankSub, { color: colors.textMuted }]}
                      >
                        your personal account number
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text
                        style={[styles.bankSub, { color: colors.textMuted }]}
                      >
                        To fund your wallet automatically
                      </Text>
                      <Text
                        style={[styles.bankSub, { color: colors.textMuted }]}
                      >
                        Kindly make a bank transfer to this account
                      </Text>
                    </>
                  )}
                </View>
                <TouchableOpacity
                  style={[
                    styles.fundButton,
                    {
                      backgroundColor: colors.accent,
                      elevation: 1,
                    },
                  ]}
                  onPress={() => setModalOpen(true)}
                >
                  <Text
                    style={[
                      styles.fundButtonText,
                      { color: isDark ? "#000000" : "#ffffff" },
                    ]}
                  >
                    Fund Wallet
                  </Text>
                </TouchableOpacity>
              </View>
              {accountName && accountNumber && (
                <>
                  <View style={styles.bankInfoGroup}>
                    <Text
                      style={[styles.bankLabel, { color: colors.textMuted }]}
                    >
                      Account Number
                    </Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={[styles.bankValue, { color: colors.text }]}>
                        {accountNumber || (
                          <ActivityIndicator
                            size="small"
                            color={colors.accent}
                          />
                        )}
                      </Text>
                      <TouchableOpacity
                        style={[
                          styles.fundButton,
                          {
                            backgroundColor: colors.accent,
                            marginLeft: 8,
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                          },
                        ]}
                        onPress={() => {
                          // Copy to clipboard
                          Clipboard.setString(accountNumber || "");
                        }}
                      >
                        <Text
                          style={[
                            styles.fundButtonText,
                            {
                              fontSize: 12,
                              color: isDark ? "#000000" : "#ffffff",
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

                  <View style={styles.bankInfoGroup}>
                    <Text
                      style={[styles.bankLabel, { color: colors.textMuted }]}
                    >
                      Bank name
                    </Text>
                    <Text style={[styles.bankValue, { color: colors.text }]}>
                      {bankName || (
                        <ActivityIndicator size="small" color={colors.accent} />
                      )}
                    </Text>
                  </View>

                  <View style={styles.bankFooter}>
                    <Text style={[styles.bankOwner, { color: colors.text }]}>
                      {accountName || (
                        <ActivityIndicator size="small" color={colors.accent} />
                      )}
                    </Text>
                    <View
                      style={[
                        styles.bankBadge,
                        {
                          backgroundColor: isDark ? colors.surface : "#ffffff",
                        },
                      ]}
                    >
                      <Image source={AppLogo} style={styles.bankBadgeIcon} />
                    </View>
                  </View>
                </>
              )}
            </View>
          </ImageBackground>
          {/* 
          <ReferralSection
            referralCode={referralCode}
            referralLink={referralLink}
          /> */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Our Services
          </Text>
          <View style={styles.servicesGrid}>
            {services.map((service) => (
              <TouchableOpacity
                activeOpacity={0.75}
                key={service.id}
                style={[styles.serviceCard]}
                onPress={() => {
                  if (service.id === "airtime") {
                    router.push("/Dashboard/airtime");
                  }
                  if (service.id === "data") {
                    router.push("/Dashboard/data");
                  }
                  if (service.id === "electricity") {
                    router.push("/Dashboard/electricity");
                  }
                  if (service.id === "tv") {
                    router.push("/Dashboard/tv");
                  }
                  if (service.id === "exams") {
                    router.push("/Dashboard/exams");
                  }
                  if (service.id === "cac") {
                    router.push("/Dashboard/cac");
                  }
                }}
              >
                <View
                  style={[
                    styles.serviceIconWrap,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Image source={service.icon} style={styles.serviceIcon} />
                </View>
                <Text style={[styles.serviceLabel, { color: colors.text }]}>
                  {service.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recent Transactions
          </Text>
          <View
            style={[
              styles.transactionsCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {transactions.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.transactionRow,
                  index !== 0 && [
                    styles.transactionRowBorder,
                    { borderTopColor: colors.border },
                  ],
                ]}
                onPress={() => {
                  setSelectedTrx(item);
                  setIsModalVisible(true);
                }}
              >
                <View>
                  <Text
                    style={[styles.transactionTitle, { color: colors.text }]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.transactionSubtitle,
                      { color: colors.textMuted },
                    ]}
                  >
                    {item.subtitle}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.transactionAmount,
                    item.subtitle?.toLowerCase().includes("successfully")
                      ? styles.amountPositive
                      : styles.amountNegative,
                  ]}
                >
                  {item.amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <IdentityVerificationModal
            onClose={() => setModalOpen(false)}
            visible={modalOpen}
            user={user}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <TransactionDetailModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        transaction={selectedTrx}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingBottom: -50,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  headerWrap: {
    paddingHorizontal: 20,
    paddingTop: 72,
    paddingBottom: 120,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  headerCard: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    height: 45,
    width: 45,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.75)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarImage: {
    width: 35,
    height: 35,
    // tintColor: "#2d6fb7",
  },
  headerTextWrap: {
    flex: 1,
  },
  userName: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  userType: {
    color: "#e6eeff",
    fontSize: 12,
    marginTop: 2,
  },
  balanceWrap: {
    alignItems: "flex-end",
  },
  balanceLabel: {
    color: "#e6eeff",
    fontSize: 12,
  },
  balanceValue: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 4,
  },
  bankCard: {
    marginHorizontal: 20,
    marginTop: -108,
    borderRadius: 26,
    overflow: "hidden",
    elevation: 2,
  },
  bankCardImage: {
    borderRadius: 26,
  },
  bankCardOverlay: {
    backgroundColor: "rgba(255, 255, 255, 0.78)",
    padding: 18,
  },
  bankRowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  bankTitle: {
    color: "#1a2b6d",
    fontSize: 16,
    fontWeight: "700",
  },
  bankSub: {
    color: "#6b778c",
    fontSize: 11,
    marginTop: 2,
  },
  fundButton: {
    backgroundColor: "#2d6fb7",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    alignSelf: "flex-start",
  },
  fundButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  bankInfoGroup: {
    marginTop: 12,
  },
  bankLabel: {
    color: "#6b778c",
    fontSize: 11,
  },
  bankValue: {
    color: "#1a1f36",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 2,
  },
  bankFooter: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bankOwner: {
    color: "#1a1f36",
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
    paddingRight: 8,
  },
  bankBadge: {
    height: 40,
    width: 80,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#2d6fb7",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  bankBadgeIcon: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    overflow: "hidden",
    borderRadius: 10,
    elevation: 3,
    // tintColor: "#2d6fb7",
  },
  bankBadgeText: {
    color: "#2d6fb7",
    fontSize: 11,
    fontWeight: "700",
  },
  sectionTitle: {
    color: "#1a2b6d",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 22,
    marginBottom: 12,
    marginHorizontal: 20,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  serviceCard: {
    width: "31%",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",

    marginBottom: 12,
  },
  serviceIconWrap: {
    borderWidth: 1,
    borderColor: "#e6ecff",
    shadowColor: "#99a7d7",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
    height: 80,
    width: 80,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceIcon: {
    width: 45,
    height: 45,
    // tintColor: "#2d6fb7",
  },
  serviceLabel: {
    color: "#1a1f36",
    fontSize: 11,
    textAlign: "center",
    fontWeight: "600",
  },
  transactionsCard: {
    marginHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e4e9ff",
    overflow: "hidden",
  },
  transactionRow: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionRowBorder: {
    borderTopWidth: 1,
    borderTopColor: "#eef2ff",
  },
  transactionTitle: {
    color: "#1a1f36",
    fontSize: 13,
    fontWeight: "600",
  },
  transactionSubtitle: {
    color: "#8a94a6",
    fontSize: 11,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 13,
    fontWeight: "700",
  },
  amountNegative: {
    color: "#d14343",
  },
  amountPositive: {
    color: "#20a85b",
  },
});

export default Dashboard;
