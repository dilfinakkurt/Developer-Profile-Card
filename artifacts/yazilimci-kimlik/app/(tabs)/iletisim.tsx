import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGame } from "@/context/GameContext";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import Colors from "@/constants/colors";

const C = Colors.light;
const isWeb = Platform.OS === "web";

type BaglantiItem = {
  id: string;
  etiket: string;
  deger: string;
  ikon: string;
  ikonLib: "Feather" | "MaterialCommunity";
  renk: string;
  url: string;
};

const BAGLANTILAR: BaglantiItem[] = [
  {
    id: "github",
    etiket: "GitHub",
    deger: "github.com/ahmetyilmaz",
    ikon: "github",
    ikonLib: "Feather",
    renk: "#E2E8F0",
    url: "https://github.com",
  },
  {
    id: "linkedin",
    etiket: "LinkedIn",
    deger: "linkedin.com/in/ahmetyilmaz",
    ikon: "linkedin",
    ikonLib: "Feather",
    renk: "#0A66C2",
    url: "https://linkedin.com",
  },
  {
    id: "twitter",
    etiket: "Twitter / X",
    deger: "@ahmet_dev",
    ikon: "twitter",
    ikonLib: "Feather",
    renk: "#1D9BF0",
    url: "https://twitter.com",
  },
  {
    id: "email",
    etiket: "E-posta",
    deger: "ahmet@devmail.io",
    ikon: "mail",
    ikonLib: "Feather",
    renk: C.tint,
    url: "mailto:ahmet@devmail.io",
  },
  {
    id: "portfolio",
    etiket: "Portfolyo",
    deger: "ahmetyilmaz.dev",
    ikon: "globe",
    ikonLib: "Feather",
    renk: C.accentGreen,
    url: "https://ahmetyilmaz.dev",
  },
  {
    id: "discord",
    etiket: "Discord",
    deger: "ahmet#4892",
    ikon: "discord",
    ikonLib: "MaterialCommunity",
    renk: "#5865F2",
    url: "https://discord.com",
  },
];

function BaglantiKarti({ item, index }: { item: BaglantiItem; index: number }) {
  const scale = useSharedValue(1);
  const [kopyalandi, setKopyalandi] = useState(false);
  const { contactTikla } = useGame();

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    scale.value = withSpring(0.96, { damping: 8 }, () => {
      scale.value = withSpring(1, { damping: 12 });
    });

    contactTikla();
    setKopyalandi(true);
    setTimeout(() => setKopyalandi(false), 1500);
  };

  return (
    <Animated.View
      entering={isWeb ? undefined : FadeInDown.delay(index * 70).springify()}
      style={animStyle}
    >
      <Pressable onPress={handlePress} style={styles.kart}>
        <View style={[styles.kartIkon, { backgroundColor: `${item.renk}18` }]}>
          {item.ikonLib === "MaterialCommunity" ? (
            <MaterialCommunityIcons name={item.ikon as any} size={22} color={item.renk} />
          ) : (
            <Feather name={item.ikon as any} size={22} color={item.renk} />
          )}
        </View>

        <View style={styles.kartMetin}>
          <Text style={styles.kartEtiket}>{item.etiket}</Text>
          <Text style={[styles.kartDeger, { color: item.renk }]} numberOfLines={1}>
            {item.deger}
          </Text>
        </View>

        <View style={styles.kartSag}>
          {kopyalandi ? (
            <Feather name="check" size={16} color={C.accentGreen} />
          ) : (
            <Feather name="external-link" size={16} color={C.textMuted} />
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function IletisimSayfasi() {
  const insets = useSafeAreaInsets();
  const topPadding = isWeb ? 67 : insets.top;
  const bottomPadding = isWeb ? 34 : insets.bottom;
  const { tabZiyaret } = useGame();

  useEffect(() => {
    tabZiyaret("iletisim");
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollIcerik,
          { paddingTop: topPadding + 24, paddingBottom: bottomPadding + 32 },
        ]}
      >
        <View style={styles.baslikRow}>
          <Feather name="at-sign" size={20} color={C.tint} />
          <Text style={styles.baslik}>İLETİŞİM</Text>
        </View>

        <View style={styles.profilOzet}>
          <View style={styles.profilIkonKutu}>
            <Feather name="user" size={36} color={C.tint} />
          </View>
          <View style={styles.profilBilgi}>
            <Text style={styles.profilAd}>Ahmet Yılmaz</Text>
            <Text style={styles.profilUnvan}>Senior Full-Stack Geliştirici</Text>
            <View style={styles.konumRow}>
              <Feather name="map-pin" size={12} color={C.textMuted} />
              <Text style={styles.konum}>İstanbul, Türkiye</Text>
            </View>
          </View>
        </View>

        <View style={styles.durumBanner}>
          <View style={styles.durumSol}>
            <View style={styles.durumNokta} />
            <View>
              <Text style={styles.durumBaslik}>Freelance için müsait</Text>
              <Text style={styles.durumAciklama}>Uzak çalışmaya açık</Text>
            </View>
          </View>
          <Feather name="arrow-right" size={16} color={C.tint} />
        </View>

        <Text style={styles.bolumBaslik}>KANAL & PROFILLER</Text>

        <View style={styles.baglantilar}>
          {BAGLANTILAR.map((item, index) => (
            <BaglantiKarti key={item.id} item={item} index={index} />
          ))}
        </View>

        <View style={styles.altNot}>
          <Feather name="clock" size={13} color={C.textMuted} />
          <Text style={styles.altNotMetin}>
            Genellikle 24 saat içinde yanıt verir
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollIcerik: {
    paddingHorizontal: 20,
    gap: 20,
  },
  baslikRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  baslik: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: C.tint,
    letterSpacing: 2,
  },
  profilOzet: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: C.backgroundCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
  },
  profilIkonKutu: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: C.tint,
    backgroundColor: C.background,
    alignItems: "center",
    justifyContent: "center",
  },
  profilBilgi: {
    flex: 1,
    gap: 4,
  },
  profilAd: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: C.text,
  },
  profilUnvan: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: C.textSecondary,
  },
  konumRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  konum: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: C.textMuted,
  },
  durumBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: `${C.tint}12`,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: `${C.tint}30`,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  durumSol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  durumNokta: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.accentGreen,
  },
  durumBaslik: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: C.text,
  },
  durumAciklama: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: C.textMuted,
    marginTop: 1,
  },
  bolumBaslik: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    color: C.textMuted,
    letterSpacing: 2,
  },
  baglantilar: {
    gap: 10,
  },
  kart: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: C.backgroundCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
  },
  kartIkon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  kartMetin: {
    flex: 1,
    gap: 2,
  },
  kartEtiket: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: C.textMuted,
  },
  kartDeger: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  kartSag: {
    width: 28,
    alignItems: "center",
  },
  altNot: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  altNotMetin: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: C.textMuted,
  },
});
