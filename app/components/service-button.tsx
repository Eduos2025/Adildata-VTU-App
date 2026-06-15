import { ServiceType } from "@/constants/types";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ServiceButton = React.memo(
  ({ service, colors }: { service: ServiceType; colors: any }) => {
    const navigate = () => {
      router.push(`/Dashboard/${service.id}` as any);
    };

    return (
      <TouchableOpacity
        activeOpacity={0.75}
        style={styles.serviceCard}
        onPress={navigate}
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
    );
  },
);

export default ServiceButton;

const styles = StyleSheet.create({
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
});
