import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

import Colors from "@/constants/colors";

const C = Colors.light;

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "person.badge.key", selected: "person.badge.key.fill" }} />
        <Label>Kimlik</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="projeler">
        <Icon sf={{ default: "folder", selected: "folder.fill" }} />
        <Label>Projeler</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="yetenekler">
        <Icon sf={{ default: "chart.bar", selected: "chart.bar.fill" }} />
        <Label>Yetenekler</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="iletisim">
        <Icon sf={{ default: "at", selected: "at.circle.fill" }} />
        <Label>İletişim</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="basarimlar">
        <Icon sf={{ default: "trophy", selected: "trophy.fill" }} />
        <Label>Ödüller</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: C.tint,
        tabBarInactiveTintColor: C.tabIconDefault,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : C.backgroundCard,
          borderTopWidth: 1,
          borderTopColor: C.border,
          elevation: 0,
          ...(isWeb ? { height: 84 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
          ) : isWeb ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: C.backgroundCard }]} />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Kimlik",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="person.badge.key" tintColor={color} size={22} />
            ) : (
              <Feather name="credit-card" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="projeler"
        options={{
          title: "Projeler",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="folder" tintColor={color} size={22} />
            ) : (
              <Feather name="git-branch" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="yetenekler"
        options={{
          title: "Yetenekler",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="chart.bar" tintColor={color} size={22} />
            ) : (
              <Feather name="trending-up" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="iletisim"
        options={{
          title: "İletişim",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="at" tintColor={color} size={22} />
            ) : (
              <Feather name="at-sign" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="basarimlar"
        options={{
          title: "Ödüller",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="trophy" tintColor={color} size={22} />
            ) : (
              <Feather name="award" size={22} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
