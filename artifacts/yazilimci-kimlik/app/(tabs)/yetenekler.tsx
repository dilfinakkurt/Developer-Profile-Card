import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";

import Colors from "@/constants/colors";

const C = Colors.light;
const isWeb = Platform.OS === "web";

type YetenekKategori = {
  baslik: string;
  ikon: string;
  ikonLib: "Feather" | "MaterialCommunity";
  renk: string;
  yetenekler: { ad: string; seviye: number }[];
};

const KATEGORILER: YetenekKategori[] = [
  {
    baslik: "Frontend",
    ikon: "monitor",
    ikonLib: "Feather",
    renk: "#60A5FA",
    yetenekler: [
      { ad: "React / React Native", seviye: 95 },
      { ad: "TypeScript", seviye: 90 },
      { ad: "CSS / Tailwind", seviye: 85 },
      { ad: "Next.js", seviye: 80 },
    ],
  },
  {
    baslik: "Backend",
    ikon: "server",
    ikonLib: "Feather",
    renk: C.tint,
    yetenekler: [
      { ad: "Node.js / Express", seviye: 92 },
      { ad: "PostgreSQL", seviye: 88 },
      { ad: "Redis", seviye: 75 },
      { ad: "GraphQL", seviye: 70 },
    ],
  },
  {
    baslik: "DevOps",
    ikon: "layers",
    ikonLib: "Feather",
    renk: C.accentGreen,
    yetenekler: [
      { ad: "Docker / K8s", seviye: 80 },
      { ad: "AWS / GCP", seviye: 75 },
      { ad: "CI / CD", seviye: 85 },
      { ad: "Terraform", seviye: 60 },
    ],
  },
  {
    baslik: "Yazılım",
    ikon: "code-braces",
    ikonLib: "MaterialCommunity",
    renk: C.accentAmber,
    yetenekler: [
      { ad: "Sistem Tasarımı", seviye: 88 },
      { ad: "Clean Architecture", seviye: 90 },
      { ad: "TDD / BDD", seviye: 78 },
      { ad: "Mikroservisler", seviye: 82 },
    ],
  },
];

function SeviyeBar({ seviye, renk, delay }: { seviye: number; renk: string; delay: number }) {
  return (
    <View style={styles.barArkaplan}>
      <Animated.View
        entering={isWeb ? undefined : FadeInDown.delay(delay)}
        style={[
          styles.barDolu,
          { width: `${seviye}%` as any, backgroundColor: renk },
        ]}
      />
    </View>
  );
}

function KategoriKarti({ kategori, index }: { kategori: YetenekKategori; index: number }) {
  return (
    <Animated.View
      entering={isWeb ? undefined : FadeInDown.delay(index * 100).springify()}
      style={styles.kategoriKart}
    >
      <View style={styles.kategoriBaslikRow}>
        <View style={[styles.kategoriIkonKutu, { backgroundColor: `${kategori.renk}18` }]}>
          {kategori.ikonLib === "MaterialCommunity" ? (
            <MaterialCommunityIcons name={kategori.ikon as any} size={18} color={kategori.renk} />
          ) : (
            <Feather name={kategori.ikon as any} size={18} color={kategori.renk} />
          )}
        </View>
        <Text style={[styles.kategoriBaslik, { color: kategori.renk }]}>{kategori.baslik}</Text>
      </View>

      <View style={styles.yeteneklerListe}>
        {kategori.yetenekler.map((yetenek, i) => (
          <View key={yetenek.ad} style={styles.yetenekSatir}>
            <View style={styles.yetenekUst}>
              <Text style={styles.yetenekAd}>{yetenek.ad}</Text>
              <Text style={[styles.yetenekYuzde, { color: kategori.renk }]}>
                {yetenek.seviye}%
              </Text>
            </View>
            <SeviyeBar
              seviye={yetenek.seviye}
              renk={kategori.renk}
              delay={index * 100 + i * 60}
            />
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

export default function YeteneklerSayfasi() {
  const insets = useSafeAreaInsets();
  const topPadding = isWeb ? 67 : insets.top;
  const bottomPadding = isWeb ? 34 : insets.bottom;

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
          <Feather name="trending-up" size={20} color={C.tint} />
          <Text style={styles.baslik}>YETENEKLER</Text>
        </View>

        <View style={styles.ozet}>
          <OzetItem deger="7+" etiket="Yıl Deneyim" renk={C.tint} />
          <View style={styles.ozetAyrac} />
          <OzetItem deger="15+" etiket="Teknoloji" renk={C.accentGreen} />
          <View style={styles.ozetAyrac} />
          <OzetItem deger="50+" etiket="Kurs & Sertifika" renk={C.accentAmber} />
        </View>

        {KATEGORILER.map((kategori, index) => (
          <KategoriKarti key={kategori.baslik} kategori={kategori} index={index} />
        ))}
      </ScrollView>
    </View>
  );
}

function OzetItem({ deger, etiket, renk }: { deger: string; etiket: string; renk: string }) {
  return (
    <View style={styles.ozetItem}>
      <Text style={[styles.ozetDeger, { color: renk }]}>{deger}</Text>
      <Text style={styles.ozetEtiket}>{etiket}</Text>
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
  ozet: {
    flexDirection: "row",
    backgroundColor: C.backgroundCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
    alignItems: "center",
    justifyContent: "space-around",
  },
  ozetItem: {
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  ozetDeger: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
  },
  ozetEtiket: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: C.textMuted,
    textAlign: "center",
  },
  ozetAyrac: {
    width: 1,
    height: 36,
    backgroundColor: C.divider,
  },
  kategoriKart: {
    backgroundColor: C.backgroundCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
    gap: 16,
  },
  kategoriBaslikRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  kategoriIkonKutu: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  kategoriBaslik: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
  yeteneklerListe: {
    gap: 14,
  },
  yetenekSatir: {
    gap: 6,
  },
  yetenekUst: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  yetenekAd: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: C.text,
  },
  yetenekYuzde: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
  },
  barArkaplan: {
    height: 6,
    borderRadius: 3,
    backgroundColor: C.background,
    overflow: "hidden",
  },
  barDolu: {
    height: "100%",
    borderRadius: 3,
  },
});
