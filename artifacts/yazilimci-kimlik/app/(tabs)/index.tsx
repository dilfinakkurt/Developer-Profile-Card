import { Feather } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { DeveloperCard, type Seviye } from "@/components/DeveloperCard";
import Colors from "@/constants/colors";
import { useGame, SEVIYELER } from "@/context/GameContext";

const C = Colors.light;
const isWeb = Platform.OS === "web";

const GELISTIRICI = {
  ad: "Ahmet Yılmaz",
  uzmanlik: "Full-Stack Geliştirici",
  seviye: "Senior" as Seviye,
};

function XPBar() {
  const { xp, seviye, xpIlerlemesi, sonrakiSeviyeXP } = useGame();
  const barWidth = useSharedValue(0);

  useEffect(() => {
    barWidth.value = withTiming(xpIlerlemesi, { duration: 800 });
  }, [xpIlerlemesi]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${barWidth.value}%` as any,
  }));

  return (
    <View style={[styles.xpKart, { borderColor: `${seviye.renk}30` }]}>
      <View style={styles.xpUst}>
        <View style={styles.xpSolTaraf}>
          <View style={[styles.seviyeDaire, { backgroundColor: `${seviye.renk}20`, borderColor: `${seviye.renk}40` }]}>
            <Text style={[styles.seviyeNo, { color: seviye.renk }]}>{seviye.no}</Text>
          </View>
          <View>
            <Text style={[styles.seviyeUnvan, { color: seviye.renk }]}>{seviye.unvan}</Text>
            <Text style={styles.xpAlt}>{xp} XP toplam</Text>
          </View>
        </View>
        <Text style={styles.xpHedef}>
          {sonrakiSeviyeXP === xp ? "MAX" : `${sonrakiSeviyeXP} XP`}
        </Text>
      </View>

      <View style={styles.barArkaplan}>
        <Animated.View style={[styles.barDolu, barStyle, { backgroundColor: seviye.renk }]} />
      </View>

      <Text style={styles.xpIpucu}>
        Sayfaları keşfet ve başarım kazan!
      </Text>
    </View>
  );
}

export default function AnaSayfa() {
  const [musaitMi, setMusaitMi] = useState<boolean>(true);
  const insets = useSafeAreaInsets();
  const { isealTikla, tabZiyaret } = useGame();

  const topPadding = isWeb ? 67 : insets.top;
  const bottomPadding = isWeb ? 34 : insets.bottom;

  useEffect(() => {
    tabZiyaret("index");
  }, []);

  const handleIseal = () => {
    setMusaitMi(false);
    isealTikla();
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPadding + 24, paddingBottom: bottomPadding + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={isWeb ? undefined : FadeInDown.delay(100).springify()}
          style={styles.baslikKutu}
        >
          <View style={styles.baslikRow}>
            <Feather name="credit-card" size={20} color={C.tint} />
            <Text style={styles.baslik}>DEV KIMLIK</Text>
          </View>
          <View
            style={[
              styles.durumKapsayici,
              { backgroundColor: musaitMi ? `${C.accentGreen}18` : `${C.accentAmber}18` },
            ]}
          >
            <View style={[styles.durumNokta, { backgroundColor: musaitMi ? C.accentGreen : C.accentAmber }]} />
            <Text style={[styles.durumMetin, { color: musaitMi ? C.accentGreen : C.accentAmber }]}>
              {musaitMi ? "Müsait" : "Meşgul"}
            </Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={isWeb ? undefined : FadeInDown.delay(150).springify()}
        >
          <XPBar />
        </Animated.View>

        <Animated.View
          entering={isWeb ? undefined : FadeInDown.delay(220).springify()}
          style={styles.kartKutu}
        >
          <DeveloperCard
            ad={GELISTIRICI.ad}
            uzmanlik={GELISTIRICI.uzmanlik}
            seviye={GELISTIRICI.seviye}
            musaitMi={musaitMi}
            onIseal={handleIseal}
          />
        </Animated.View>

        <Animated.View
          entering={isWeb ? undefined : FadeInUp.delay(350).springify()}
          style={styles.bilgiKutu}
        >
          <Feather name="info" size={14} color={C.textMuted} />
          <Text style={styles.bilgiMetin}>
            {musaitMi
              ? "Profil aktif — İşe al butonuna bas!"
              : "Geliştirici projelerde çalışıyor."}
          </Text>
        </Animated.View>

        <Animated.View
          entering={isWeb ? undefined : FadeInUp.delay(450).springify()}
          style={styles.teknolojiBolumu}
        >
          <Text style={styles.teknolojiBolumBaslik}>YETENEKLER</Text>
          <View style={styles.teknolojiler}>
            {["TypeScript", "React Native", "Node.js", "PostgreSQL", "Docker", "AWS"].map(
              (tech) => (
                <TeknolojiKarti key={tech} etiket={tech} />
              )
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function TeknolojiKarti({ etiket }: { etiket: string }) {
  return (
    <View style={styles.teknoloji}>
      <Text style={styles.teknolojiMetin}>{etiket}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, gap: 20 },
  baslikKutu: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  baslikRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  baslik: { fontSize: 13, fontFamily: "Inter_700Bold", color: C.tint, letterSpacing: 2 },
  durumKapsayici: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  durumNokta: { width: 8, height: 8, borderRadius: 4 },
  durumMetin: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  xpKart: {
    backgroundColor: C.backgroundCard,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  xpUst: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  xpSolTaraf: { flexDirection: "row", alignItems: "center", gap: 10 },
  seviyeDaire: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  seviyeNo: { fontSize: 16, fontFamily: "Inter_700Bold" },
  seviyeUnvan: { fontSize: 14, fontFamily: "Inter_700Bold" },
  xpAlt: { fontSize: 11, fontFamily: "Inter_400Regular", color: C.textMuted, marginTop: 1 },
  xpHedef: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: C.textMuted },
  barArkaplan: { height: 7, borderRadius: 4, backgroundColor: C.background, overflow: "hidden" },
  barDolu: { height: "100%", borderRadius: 4 },
  xpIpucu: { fontSize: 11, fontFamily: "Inter_400Regular", color: C.textMuted },
  kartKutu: {},
  bilgiKutu: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: C.backgroundCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  bilgiMetin: { fontSize: 13, fontFamily: "Inter_400Regular", color: C.textMuted, textAlign: "center" },
  teknolojiBolumu: { gap: 14 },
  teknolojiBolumBaslik: { fontSize: 11, fontFamily: "Inter_700Bold", color: C.textMuted, letterSpacing: 2 },
  teknolojiler: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  teknoloji: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: C.backgroundCard,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
  },
  teknolojiMetin: { fontSize: 13, fontFamily: "Inter_500Medium", color: C.textSecondary },
});
