import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { FlatList, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientButton from "../components/buttons";
import Header from "../components/header";
import NotificationItem from "../components/notification-item";
import useNotificationStore from "../states/notifications";

const Notifications = () => {
  const { isDark, colors } = useTheme();

  const notifications = useNotificationStore((state) => state.notifications);

  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <Header title="Notifications" />
      <View
        style={{
          width: 100,
          height: 80,
          alignSelf: "flex-end",
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 10,
          marginBottom: 5,
        }}
      >
        <GradientButton title="Read All" onPress={() => markAllAsRead} />
      </View>
      <FlatList
        data={notifications}
        renderItem={({ item }) => {
          return <NotificationItem item={item} />;
        }}
      />
    </SafeAreaView>
  );
};

export default Notifications;

const styles = StyleSheet.create({});
