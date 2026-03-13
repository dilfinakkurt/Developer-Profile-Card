import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useRef } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";

import Colors from "@/constants/colors";

export type Seviye = "Junior" | "Mid" | "Senior" | "Lead" | "Principal";

export type DeveloperCardProps = {
  ad: string;
  uzmanlik: string;
  seviye: Seviye;
};

const C = Colors.light;

const SEVIYE_RENK: Record<Seviye, string> = {
  Junior: "#60A5FA",
  Mid: "#A78BFA",
  Senior: C.tint,
  Lead: C.accentGreen,
  Principal: C.accentAmber,
};

const SEVIYE_EMOJI_ICON: Record<Seviye, { lib: "Feather" | "MaterialCommunity"; name: string }> = {
  Junior: { lib: "Feather", name: "sunrise" },
  Mid: { lib: "Feather", name: "zap" },
  Senior: { lib: "Feather", name: "award" },
  Lead: { lib: "MaterialCommunity", name: "crown-outline" },
  Principal: { lib: "MaterialCommunity", name: "star-four-points" },
};

function SeviyeIcon({ seviye, size = 16, color }: { seviye: Seviye; size?: number; color: string }) {
  const icon = SEVIYE_EMOJI_ICON[seviye];
  if (icon.lib === "MaterialCommunity") {
    return <MaterialCommunityIcons name={icon.name as any} size={size} color={color} />;
  }
  return <Feather name={icon.name as any} size={size} color={color} />;
}

function CardStrip({ color }: { color: string }) {
  return <View style={[styles.strip, { backgroundColor: color }]} />;
}

type CardProps = DeveloperCardProps & {
  musaitMi: boolean;
  onIseal: () => void;
};

export function DeveloperCard({ ad, uzmanlik, seviye, musaitMi, onIseal }: CardProps) {
  const seviyeRenk = SEVIYE_RENK[seviye];

  const buttonScale = useSharedValue(1);
  const cardScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);
  const buttonProgress = useSharedValue(musaitMi ? 0 : 1);

  React.useEffect(() => {
    buttonProgress.value = withTiming(musaitMi ? 0 : 1, { duration: 400 });
    if (!musaitMi) {
      glowOpacity.value = withSequence(
        withTiming(1, { duration: 300 }),
        withTiming(0.3, { duration: 600 })
      );
    }
  }, [musaitMi]);

  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    backgroundColor: interpolateColor(
      buttonProgress.value,
      [0, 1],
      [C.tint, "#243C53"]
    ),
  }));

  const cardAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handlePress = () => {
    if (!musaitMi) return;

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    buttonScale.value = withSequence(
      withSpring(0.92, { damping: 8 }),
      withSpring(1.05, { damping: 6 }),
      withSpring(1, { damping: 10 })
    );

    cardScale.value = withSequence(
      withSpring(0.98, { damping: 8 }),
      withSpring(1, { damping: 10 })
    );

    onIseal();
  };

  return (
    <Animated.View style={[styles.cardWrapper, cardAnimStyle]}>
      <Animated.View style={[styles.glow, { shadowColor: seviyeRenk }, glowStyle]} />

      <View style={styles.card}>
        <CardStrip color={seviyeRenk} />

        <View style={styles.cardContent}>
          <View style={styles.header}>
            <View style={[styles.avatarCircle, { borderColor: seviyeRenk }]}>
              <Feather name="user" size={32} color={seviyeRenk} />
            </View>

            <View style={[styles.statusDot, { backgroundColor: musaitMi ? C.accentGreen : C.accentAmber }]} />
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.adText}>{ad}</Text>

            <View style={styles.uzmanlikRow}>
              <Feather name="code" size={14} color={C.textSecondary} />
              <Text style={styles.uzmanlikText}>{uzmanlik}</Text>
            </View>

            <View style={[styles.seviyeBadge, { borderColor: seviyeRenk, backgroundColor: `${seviyeRenk}18` }]}>
              <SeviyeIcon seviye={seviye} size={14} color={seviyeRenk} />
              <Text style={[styles.seviyeText, { color: seviyeRenk }]}>{seviye}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statsRow}>
            <StatItem icon="git-branch" label="Commit" value="1.2k" />
            <View style={styles.statDivider} />
            <StatItem icon="package" label="Proje" value="34" />
            <View style={styles.statDivider} />
            <StatItem icon="coffee" label="Kahve" value="∞" />
          </View>

          <Pressable onPress={handlePress} disabled={!musaitMi}>
            <Animated.View style={[styles.button, buttonAnimStyle]}>
              {musaitMi ? (
                <>
                  <Feather name="briefcase" size={16} color={C.background} />
                  <Text style={[styles.buttonText, { color: C.background }]}>
                    Işe Al
                  </Text>
                </>
              ) : (
                <>
                  <Feather name="loader" size={16} color={C.tint} />
                  <Text style={[styles.buttonText, { color: C.tint }]}>
                    Projelerde Çalışıyor
                  </Text>
                </>
              )}
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

function StatItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <Feather name={icon as any} size={14} color={C.tint} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    width: "100%",
    maxWidth: 360,
    alignSelf: "center",
  },
  glow: {
    position: "absolute",
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 30,
    elevation: 20,
  },
  card: {
    backgroundColor: Colors.light.backgroundCard,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  strip: {
    height: 4,
    width: "100%",
  },
  cardContent: {
    padding: 24,
    gap: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    backgroundColor: Colors.light.background,
    alignItems: "center",
    justifyContent: "center",
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  infoSection: {
    gap: 10,
  },
  adText: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    color: Colors.light.text,
    letterSpacing: -0.5,
  },
  uzmanlikRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  uzmanlikText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: Colors.light.textSecondary,
  },
  seviyeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  seviyeText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.divider,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: Colors.light.text,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.light.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.light.divider,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
});
