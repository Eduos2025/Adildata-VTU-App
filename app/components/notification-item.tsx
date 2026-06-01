import { NotificationType } from "@/constants/types";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

const NotificationItem = ({ item }: { item: NotificationType }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{
        flexDirection: "row",
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 6,
        backgroundColor: colors.background,
        borderRadius: 16,
        elevation: 2,
        shadowColor: colors.text,
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      }}
      onPress={() => {
        router.push({
          pathname: "/Dashboard/notification-detail-screen",
          params: {
            id: item.id,
            title: item.title,
            message: item.message,
            createdAt: item.createdAt,
          },
        });
      }}
    >
      {/* Icon */}
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        <Ionicons
          name="notifications-outline"
          size={24}
          color={colors.accent}
        />
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: item.isRead ? colors.textMuted : colors.primary,
              flex: 1,
            }}
            numberOfLines={1}
          >
            {item.title}
          </Text>

          <Text
            style={{
              fontSize: 12,
              color: colors.textMuted,
              marginLeft: 8,
            }}
          >
            {item.createdAt || "Now"}
          </Text>
        </View>

        <Text
          numberOfLines={2}
          style={{
            fontSize: 14,
            color: colors.textMuted,
            lineHeight: 20,
          }}
        >
          {item.message}
        </Text>
      </View>

      {/* Unread Dot */}
      {!item.isRead && (
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: colors.accent,
            marginLeft: 10,
            marginTop: 6,
          }}
        />
      )}
    </TouchableOpacity>
  );
};

export default NotificationItem;
