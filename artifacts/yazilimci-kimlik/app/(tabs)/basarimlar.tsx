import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { BASARIMLAR, SEVIYELER, useGame, type Achievement } from "@/context/GameContext";
import Colors from "@/constants/colors";

const C = Colors.light;
const isWeb = Platform.OS === "web";

function SeviyeYolu() {
  const { seviye, xp, xpIlerlemesi, sonrakiSeviyeXP } = useGame();

  return (
    <View style={styles.seviyeYolu}>
      <View style={styles.seviyeYoluBaslik}>
        <Text style={styles.seviyeYoluAdi}>SEVİYE YOLU</Text>
        <Text style={[styles.xpMetin, { color: seviye.renk }]}>
          {xp} / {sonrakiSeviyeXP} XP
        </Text>
      </View>

      <View style={styles.seviyeler}>
        {SEVIYELER.map((s, i) => {
          const aktif = s.no === seviye.no;
          const gecildi = s.no < seviye.no;
          return (
            <React.Fragment key={s.no}>
              <View style={styles.seviyeItem}>
                <View
                  style={[
                    styles.seviyeDaire,
                    {
                      backgroundColor: gecildi || aktif ? s.renk : C.background,
                      borderColor: aktif ? s.renk : gecildi ? s.renk : C.border,
                      borderWidth: aktif ? 3 : 1.5,
                    },
                  ]}
                >
                  {gecildi ? (
                    <Feather name="check" size={14} color="#000" />
                  ) : (
                    <Text style={[styles.seviyeNo, { color: aktif ? "#000" : C.textMuted }]}>
                      {s.no}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.seviyeUnvan,
                    { color: aktif ? s.renk : gecildi ? C.textSecondary : C.textMuted },
                  ]}
                  numberOfLines={2}
                >
                  {s.unvan}
                </Text>
              </View>
              {i < SEVIYELER.length - 1 && (
                <View
                  style={[
                    styles.seviyeCizgi,
                    { backgroundColor: gecildi ? C.tint : C.border },
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>

      <View style={styles.ilerlemeKap}>
        <View style={[styles.ilerlemeBar, { width: `${xpIlerlemesi}%` as any, backgroundColor: seviye.renk }]} />
      </View>
    </View>
  );
}

function PulsingDot({ renk }: { renk: string }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 700 }),
        withTiming(1, { duration: 700 })
      ),
      -1,
      false
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        style,
        { width: 8, height: 8, borderRadius: 4, backgroundColor: renk },
      ]}
    />
  );
}

function BasarimKarti({ basarim, index }: { basarim: Achievement; index: number }) {
  const { acikBasarimlar } = useGame();
  const acik = acikBasarimlar.includes(basarim.id);
  const renk = acik ? basarim.renk : C.textMuted;

  return (
    <Animated.View
      entering={isWeb ? undefined : FadeInDown.delay(index * 60).springify()}
      style={[
        styles.basarimKart,
        {
          borderColor: acik ? `${basarim.renk}40` : C.border,
          backgroundColor: acik ? `${basarim.renk}08` : C.backgroundCard,
        },
      ]}
    >
      <View
        style={[
          styles.basarimIkon,
          {
            backgroundColor: acik ? `${basarim.renk}20` : `${C.textMuted}10`,
            borderColor: acik ? `${basarim.renk}30` : "transparent",
            borderWidth: 1,
          },
        ]}
      >
        {acik ? (
          basarim.ikonLib === "MaterialCommunity" ? (
            <MaterialCommunityIcons name={basarim.ikon as any} size={26} color={renk} />
          ) : (
            <Feather name={basarim.ikon as any} size={26} color={renk} />
          )
        ) : (
          <Feather name="lock" size={22} color={C.border} />
        )}
      </View>

      <View style={styles.basarimMetin}>
        <View style={styles.basarimUst}>
          <Text style={[styles.basarimAd, { color: acik ? C.text : C.textMuted }]}>
            {acik || !basarim.gizli ? basarim.baslik : "???"}
          </Text>
          {acik && <PulsingDot renk={basarim.renk} />}
        </View>
        <Text style={styles.basarimAciklama} numberOfLines={2}>
          {acik || !basarim.gizli ? basarim.aciklama : "Bu başarımı keşfetmek için devam et."}
        </Text>
      </View>

      <View style={[styles.xpBadge, { backgroundColor: acik ? `${basarim.renk}20` : `${C.border}30` }]}>
        <Text style={[styles.xpBadgeMetin, { color: acik ? basarim.renk : C.textMuted }]}>
          +{basarim.xp}
        </Text>
      </View>
    </Animated.View>
  );
}

export default function BasarimlarSayfasi() {
  const insets = useSafeAreaInsets();
  const topPadding = isWeb ? 67 : insets.top;
  const bottomPadding = isWeb ? 34 : insets.bottom;
  const { acikBasarimlar, tabZiyaret } = useGame();

  useEffect(() => {
    tabZiyaret("basarimlar");
  }, []);

  const tamamlanan = acikBasarimlar.length;
  const yuzde = Math.round((tamamlanan / BASARIMLAR.length) * 100);

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <FlatList
        data={BASARIMLAR}
        keyExtractor={(item) => item.id}
        scrollEnabled={!!BASARIMLAR.length}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listIcerik,
          { paddingTop: topPadding + 24, paddingBottom: bottomPadding + 32 },
        ]}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.baslikRow}>
              <Feather name="award" size={20} color={C.tint} />
              <Text style={styles.baslik}>BAŞARIMLAR</Text>
            </View>

            <View style={styles.ozetKart}>
              <View style={styles.ozetRow}>
                <View>
                  <Text style={styles.ozetSayi}>
                    {tamamlanan}/{BASARIMLAR.length}
                  </Text>
                  <Text style={styles.ozetEtiket}>Başarım Açıldı</Text>
                </View>
                <View style={styles.yuzdeKutu}>
                  <Text style={[styles.yuzde, { color: C.tint }]}>{yuzde}%</Text>
                  <Text style={styles.yuzdeEtiket}>Tamamlandı</Text>
                </View>
              </View>
              <View style={styles.ilerlemeKap}>
                <Animated.View
                  style={[
                    styles.ilerlemeBar,
                    { width: `${yuzde}%` as any, backgroundColor: C.tint },
                  ]}
                />
              </View>
            </View>

            <SeviyeYolu />

            <Text style={styles.bolumBaslik}>TÜM BAŞARIMLAR</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <BasarimKarti basarim={item} index={index} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listIcerik: { paddingHorizontal: 20, gap: 0 },
  header: { gap: 20, marginBottom: 20 },
  baslikRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  baslik: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: C.tint,
    letterSpacing: 2,
  },
  ozetKart: {
    backgroundColor: C.backgroundCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
    gap: 12,
  },
  ozetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ozetSayi: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: C.text,
  },
  ozetEtiket: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: C.textMuted,
    marginTop: 2,
  },
  yuzdeKutu: { alignItems: "flex-end" },
  yuzde: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
  },
  yuzdeEtiket: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: C.textMuted,
  },
  ilerlemeKap: {
    height: 6,
    borderRadius: 3,
    backgroundColor: C.background,
    overflow: "hidden",
  },
  ilerlemeBar: {
    height: "100%",
    borderRadius: 3,
  },
  seviyeYolu: {
    backgroundColor: C.backgroundCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
    gap: 16,
  },
  seviyeYoluBaslik: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seviyeYoluAdi: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    color: C.textMuted,
    letterSpacing: 1.5,
  },
  xpMetin: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
  },
  seviyeler: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  seviyeItem: {
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  seviyeDaire: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  seviyeNo: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
  },
  seviyeUnvan: {
    fontSize: 9,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  seviyeCizgi: {
    height: 2,
    flex: 1,
    marginTop: 15,
    marginHorizontal: -2,
  },
  bolumBaslik: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    color: C.textMuted,
    letterSpacing: 2,
  },
  basarimKart: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  basarimIkon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  basarimMetin: {
    flex: 1,
    gap: 4,
  },
  basarimUst: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  basarimAd: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  basarimAciklama: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: C.textMuted,
    lineHeight: 16,
  },
  xpBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  xpBadgeMetin: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
  },
});
