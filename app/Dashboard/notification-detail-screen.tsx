import { useTheme } from "@/context/ThemeContext";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { SafeAreaView, ScrollView, StatusBar, Text, View } from "react-native";
import Header from "../components/header";
import useNotificationStore from "../states/notifications";

const NotificationDetailsScreen = () => {
  const { id, title, message, createdAt } = useLocalSearchParams();

  const { isDark, colors } = useTheme();

  const markAsRead = useNotificationStore((state) => state.markAsRead);

  useEffect(() => {
    markAsRead(id.toString());
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <ScrollView
        contentContainerStyle={{
          padding: 20,
        }}
      >
        {/* Header Card */}
        <View
          style={{
            borderRadius: 20,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <Header title="Notification" />

          <Text
            style={{
              fontSize: 22,
              fontWeight: "700",
              color: colors.text,
              textAlign: "center",
            }}
          >
            {title}
          </Text>

          <Text
            style={{
              textAlign: "center",
              color: colors.textMuted,
              marginTop: 8,
            }}
          >
            {createdAt || "Just now"}
          </Text>
        </View>

        {/* Message */}
        <View
          style={{
            backgroundColor: colors.background,
            borderRadius: 20,
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              lineHeight: 28,
              color: colors.textMuted,
            }}
          >
            {message}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationDetailsScreen;
