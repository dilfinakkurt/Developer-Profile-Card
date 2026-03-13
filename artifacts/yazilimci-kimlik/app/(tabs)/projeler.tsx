import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import Colors from "@/constants/colors";
import { useGame } from "@/context/GameContext";

const C = Colors.light;
const isWeb = Platform.OS === "web";

type Durum = "Tamamlandı" | "Devam Ediyor" | "Planlama";

type Proje = {
  id: string;
  ad: string;
  aciklama: string;
  teknolojiler: string[];
  durum: Durum;
  yildiz: number;
  tarih: string;
};

const PROJELER: Proje[] = [
  {
    id: "1",
    ad: "E-Ticaret Platformu",
    aciklama: "Mikro servis mimarisiyle geliştirilmiş tam yığın alışveriş uygulaması.",
    teknolojiler: ["Node.js", "React", "PostgreSQL"],
    durum: "Tamamlandı",
    yildiz: 128,
    tarih: "Oca 2025",
  },
  {
    id: "2",
    ad: "AI Kod Asistanı",
    aciklama: "LLM entegrasyonlu gerçek zamanlı kod tamamlama ve inceleme aracı.",
    teknolojiler: ["Python", "FastAPI", "OpenAI"],
    durum: "Devam Ediyor",
    yildiz: 87,
    tarih: "Mar 2025",
  },
  {
    id: "3",
    ad: "Anlık Mesajlaşma SDK",
    aciklama: "WebSocket tabanlı düşük gecikmeli mesajlaşma kütüphanesi.",
    teknolojiler: ["TypeScript", "WebSocket", "Redis"],
    durum: "Tamamlandı",
    yildiz: 342,
    tarih: "Kas 2024",
  },
  {
    id: "4",
    ad: "DevOps Otomasyon",
    aciklama: "CI/CD pipeline otomasyonu ve altyapı yönetim aracı.",
    teknolojiler: ["Go", "Docker", "K8s"],
    durum: "Devam Ediyor",
    yildiz: 56,
    tarih: "Şub 2025",
  },
  {
    id: "5",
    ad: "Açık Kaynak UI Kütüphanesi",
    aciklama: "Erişilebilirlik odaklı React Native bileşen kütüphanesi.",
    teknolojiler: ["React Native", "TypeScript"],
    durum: "Planlama",
    yildiz: 12,
    tarih: "Nis 2025",
  },
];

const DURUM_RENK: Record<Durum, string> = {
  "Tamamlandı": C.accentGreen,
  "Devam Ediyor": C.tint,
  "Planlama": C.accentAmber,
};

const DURUM_IKON: Record<Durum, string> = {
  "Tamamlandı": "check-circle",
  "Devam Ediyor": "loader",
  "Planlama": "clock",
};

function ProjeKarti({ proje, index }: { proje: Proje; index: number }) {
  const scale = useSharedValue(1);
  const durumRenk = DURUM_RENK[proje.durum];
  const { xpKazan } = useGame();

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
    scale.value = withSpring(0.97, { damping: 8 }, () => {
      scale.value = withSpring(1, { damping: 10 });
    });
    xpKazan(15, `${proje.ad} incelendi`);
  };

  return (
    <Animated.View
      entering={isWeb ? undefined : FadeInDown.delay(index * 80).springify()}
      style={animStyle}
    >
      <Pressable onPress={handlePress} style={styles.kart}>
        <View style={[styles.kartSol, { backgroundColor: `${durumRenk}18` }]}>
          <Feather name="folder" size={20} color={durumRenk} />
        </View>

        <View style={styles.kartIcerik}>
          <View style={styles.kartUst}>
            <Text style={styles.kartAd} numberOfLines={1}>{proje.ad}</Text>
            <View style={styles.yildizRow}>
              <Feather name="star" size={12} color={C.accentAmber} />
              <Text style={styles.yildizSayi}>{proje.yildiz}</Text>
            </View>
          </View>

          <Text style={styles.kartAciklama} numberOfLines={2}>{proje.aciklama}</Text>

          <View style={styles.kartAlt}>
            <View style={styles.teknolojiler}>
              {proje.teknolojiler.slice(0, 2).map((t) => (
                <View key={t} style={styles.techPil}>
                  <Text style={styles.techPilMetin}>{t}</Text>
                </View>
              ))}
              {proje.teknolojiler.length > 2 && (
                <Text style={styles.dahafazla}>+{proje.teknolojiler.length - 2}</Text>
              )}
            </View>

            <View style={[styles.durumBadge, { backgroundColor: `${durumRenk}18` }]}>
              <Feather name={DURUM_IKON[proje.durum] as any} size={10} color={durumRenk} />
              <Text style={[styles.durumMetin, { color: durumRenk }]}>{proje.durum}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function ProjelerSayfasi() {
  const insets = useSafeAreaInsets();
  const topPadding = isWeb ? 67 : insets.top;
  const bottomPadding = isWeb ? 34 : insets.bottom;
  const { tabZiyaret } = useGame();

  useEffect(() => {
    tabZiyaret("projeler");
  }, []);

  const tamamlandi = PROJELER.filter((p) => p.durum === "Tamamlandı").length;
  const devamEdiyor = PROJELER.filter((p) => p.durum === "Devam Ediyor").length;

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <FlatList
        data={PROJELER}
        keyExtractor={(item) => item.id}
        scrollEnabled={!!PROJELER.length}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listIcerik,
          { paddingTop: topPadding + 24, paddingBottom: bottomPadding + 32 },
        ]}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.baslikRow}>
              <Feather name="git-branch" size={20} color={C.tint} />
              <Text style={styles.baslik}>PROJELER</Text>
            </View>

            <View style={styles.istatistikler}>
              <IstatistikKutu deger={PROJELER.length} etiket="Toplam" renk={C.tint} />
              <IstatistikKutu deger={tamamlandi} etiket="Bitti" renk={C.accentGreen} />
              <IstatistikKutu deger={devamEdiyor} etiket="Aktif" renk={C.accentAmber} />
            </View>
          </View>
        }
        renderItem={({ item, index }) => (
          <ProjeKarti proje={item} index={index} />
        )}
        ItemSeparatorComponent={() => <View style={styles.ayirac} />}
      />
    </View>
  );
}

function IstatistikKutu({ deger, etiket, renk }: { deger: number; etiket: string; renk: string }) {
  return (
    <View style={[styles.istatKutu, { borderColor: `${renk}30`, backgroundColor: `${renk}10` }]}>
      <Text style={[styles.istatDeger, { color: renk }]}>{deger}</Text>
      <Text style={styles.istatEtiket}>{etiket}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listIcerik: {
    paddingHorizontal: 20,
    gap: 0,
  },
  header: {
    gap: 20,
    marginBottom: 24,
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
  istatistikler: {
    flexDirection: "row",
    gap: 10,
  },
  istatKutu: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  istatDeger: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  istatEtiket: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: C.textMuted,
    marginTop: 2,
  },
  kart: {
    flexDirection: "row",
    backgroundColor: C.backgroundCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
  },
  kartSol: {
    width: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  kartIcerik: {
    flex: 1,
    padding: 14,
    gap: 8,
  },
  kartUst: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  kartAd: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: C.text,
    flex: 1,
    marginRight: 8,
  },
  yildizRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  yildizSayi: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: C.accentAmber,
  },
  kartAciklama: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: C.textSecondary,
    lineHeight: 18,
  },
  kartAlt: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  teknolojiler: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  techPil: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: C.background,
    borderWidth: 1,
    borderColor: C.border,
  },
  techPilMetin: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: C.textMuted,
  },
  dahafazla: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: C.textMuted,
  },
  durumBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  durumMetin: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  ayirac: {
    height: 10,
  },
});
