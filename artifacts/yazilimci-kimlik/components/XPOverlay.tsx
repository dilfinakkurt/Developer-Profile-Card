import React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { useGame } from "@/context/GameContext";
import Colors from "@/constants/colors";

const C = Colors.light;

export function XPOverlay() {
  const { xpToastlar } = useGame();
  const insets = useSafeAreaInsets();

  if (xpToastlar.length === 0) return null;

  return (
    <View
      style={[
        styles.container,
        { top: insets.top + 16 },
      ]}
      pointerEvents="none"
    >
      {xpToastlar.map((toast) => (
        <Animated.View
          key={toast.id}
          style={[
            styles.toast,
            {
              opacity: toast.opacity,
              transform: [{ translateY: toast.translateY }],
            },
          ]}
        >
          <View style={styles.ikonKutu}>
            <Feather name="zap" size={14} color={C.tint} />
          </View>
          <Text style={styles.mesaj}>{toast.mesaj}</Text>
          <Text style={styles.xpMetin}>+{toast.miktar} XP</Text>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 16,
    zIndex: 9999,
    gap: 8,
    alignItems: "flex-end",
    pointerEvents: "none",
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1A2D3E",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: `${C.tint}40`,
  },
  ikonKutu: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: `${C.tint}20`,
    alignItems: "center",
    justifyContent: "center",
  },
  mesaj: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: Colors.light.text,
  },
  xpMetin: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: C.tint,
  },
});
