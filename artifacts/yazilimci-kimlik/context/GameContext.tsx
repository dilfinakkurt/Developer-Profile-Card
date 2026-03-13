import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Animated, Platform } from "react-native";
import * as Haptics from "expo-haptics";

// ─── Types ───────────────────────────────────────────────────────────────────

export type AchievementId =
  | "hosgeldin"
  | "iseal"
  | "projeler_ziyaret"
  | "yetenekler_ziyaret"
  | "iletisim_ziyaret"
  | "basarimlar_ziyaret"
  | "gezgin"
  | "networker"
  | "senior_dev"
  | "lead_dev";

export type Achievement = {
  id: AchievementId;
  baslik: string;
  aciklama: string;
  xp: number;
  ikon: string;
  ikonLib: "Feather" | "MaterialCommunity";
  renk: string;
  gizli?: boolean;
};

export type Seviye = {
  no: number;
  unvan: string;
  minXP: number;
  maxXP: number;
  renk: string;
};

export type XPToast = {
  id: string;
  miktar: number;
  mesaj: string;
  opacity: Animated.Value;
  translateY: Animated.Value;
};

// ─── Constants ───────────────────────────────────────────────────────────────

export const SEVIYELER: Seviye[] = [
  { no: 1, unvan: "Junior Dev", minXP: 0, maxXP: 300, renk: "#60A5FA" },
  { no: 2, unvan: "Mid Dev", minXP: 300, maxXP: 800, renk: "#A78BFA" },
  { no: 3, unvan: "Senior Dev", minXP: 800, maxXP: 1800, renk: "#00E5CC" },
  { no: 4, unvan: "Lead Dev", minXP: 1800, maxXP: 3500, renk: "#4ADE80" },
  { no: 5, unvan: "Principal", minXP: 3500, maxXP: 9999, renk: "#FBBF24" },
];

export const BASARIMLAR: Achievement[] = [
  {
    id: "hosgeldin",
    baslik: "Hoş Geldin!",
    aciklama: "Uygulamayı ilk kez açtın.",
    xp: 50,
    ikon: "star",
    ikonLib: "Feather",
    renk: "#FBBF24",
  },
  {
    id: "iseal",
    baslik: "Kariyer Kapısı",
    aciklama: '"İşe Al" butonuna tıkladın.',
    xp: 150,
    ikon: "briefcase",
    ikonLib: "Feather",
    renk: "#00E5CC",
  },
  {
    id: "projeler_ziyaret",
    baslik: "Proje Avcısı",
    aciklama: "Projeler sayfasını ziyaret ettin.",
    xp: 75,
    ikon: "git-branch",
    ikonLib: "Feather",
    renk: "#60A5FA",
  },
  {
    id: "yetenekler_ziyaret",
    baslik: "Beceri Analisti",
    aciklama: "Yetenekler sayfasını keşfettin.",
    xp: 75,
    ikon: "trending-up",
    ikonLib: "Feather",
    renk: "#A78BFA",
  },
  {
    id: "iletisim_ziyaret",
    baslik: "Sosyal Kelebek",
    aciklama: "İletişim sayfasını ziyaret ettin.",
    xp: 75,
    ikon: "at-sign",
    ikonLib: "Feather",
    renk: "#F472B6",
  },
  {
    id: "basarimlar_ziyaret",
    baslik: "Rozet Avcısı",
    aciklama: "Başarımlar sayfasını açtın.",
    xp: 50,
    ikon: "award",
    ikonLib: "Feather",
    renk: "#FBBF24",
  },
  {
    id: "gezgin",
    baslik: "Kaşif",
    aciklama: "Tüm sekmeleri ziyaret ettin.",
    xp: 200,
    ikon: "compass",
    ikonLib: "Feather",
    renk: "#4ADE80",
  },
  {
    id: "networker",
    baslik: "Networker Pro",
    aciklama: "İletişim bağlantılarına 3 kez tıkladın.",
    xp: 100,
    ikon: "link",
    ikonLib: "Feather",
    renk: "#0A66C2",
  },
  {
    id: "senior_dev",
    baslik: "Senior Rozeti",
    aciklama: "Senior Dev seviyesine ulaştın!",
    xp: 300,
    ikon: "award",
    ikonLib: "Feather",
    renk: "#00E5CC",
    gizli: true,
  },
  {
    id: "lead_dev",
    baslik: "Lead Rozeti",
    aciklama: "Lead Dev seviyesine ulaştın!",
    xp: 500,
    ikon: "crown-outline",
    ikonLib: "MaterialCommunity",
    renk: "#4ADE80",
    gizli: true,
  },
];

// ─── Context ─────────────────────────────────────────────────────────────────

type GameContextType = {
  xp: number;
  seviye: Seviye;
  acikBasarimlar: AchievementId[];
  xpToastlar: XPToast[];
  contactTiklama: number;
  xpIlerlemesi: number;
  sonrakiSeviyeXP: number;
  xpKazan: (miktar: number, mesaj?: string) => void;
  tabZiyaret: (tab: string) => void;
  contactTikla: () => void;
  isealTikla: () => void;
};

const GameContext = createContext<GameContextType | null>(null);

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const STORAGE_KEY = "@devkimlik_game_v1";

type StoredState = {
  xp: number;
  acikBasarimlar: AchievementId[];
  ziyaretEdilen: string[];
  contactTiklama: number;
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [xp, setXP] = useState<number>(0);
  const [acikBasarimlar, setAcikBasarimlar] = useState<AchievementId[]>([]);
  const [ziyaretEdilen, setZiyaretEdilen] = useState<string[]>([]);
  const [contactTiklama, setContactTiklama] = useState<number>(0);
  const [xpToastlar, setXPToastlar] = useState<XPToast[]>([]);
  const [yuklendi, setYuklendi] = useState(false);
  const toastIdRef = useRef(0);

  // Load from AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const data: StoredState = JSON.parse(raw);
          setXP(data.xp ?? 0);
          setAcikBasarimlar(data.acikBasarimlar ?? []);
          setZiyaretEdilen(data.ziyaretEdilen ?? []);
          setContactTiklama(data.contactTiklama ?? 0);
        } catch {}
      }
      setYuklendi(true);
    });
  }, []);

  // Save to AsyncStorage
  useEffect(() => {
    if (!yuklendi) return;
    const data: StoredState = { xp, acikBasarimlar, ziyaretEdilen, contactTiklama };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [xp, acikBasarimlar, ziyaretEdilen, contactTiklama, yuklendi]);

  // First open achievement
  useEffect(() => {
    if (yuklendi && !acikBasarimlar.includes("hosgeldin")) {
      setTimeout(() => basarimAc("hosgeldin", 50), 800);
    }
  }, [yuklendi]);

  const seviyeHesapla = useCallback((currentXP: number): Seviye => {
    for (let i = SEVIYELER.length - 1; i >= 0; i--) {
      if (currentXP >= SEVIYELER[i].minXP) return SEVIYELER[i];
    }
    return SEVIYELER[0];
  }, []);

  const seviye = seviyeHesapla(xp);
  const sonrakiSeviye = SEVIYELER[seviye.no] ?? SEVIYELER[SEVIYELER.length - 1];
  const xpIlerlemesi =
    seviye.no >= SEVIYELER.length
      ? 100
      : Math.min(
          100,
          ((xp - seviye.minXP) / (sonrakiSeviye.minXP - seviye.minXP)) * 100
        );
  const sonrakiSeviyeXP =
    seviye.no >= SEVIYELER.length ? xp : sonrakiSeviye.minXP;

  const showToast = useCallback((miktar: number, mesaj: string) => {
    const id = `toast_${toastIdRef.current++}`;
    const opacity = new Animated.Value(0);
    const translateY = new Animated.Value(20);

    const toast: XPToast = { id, miktar, mesaj, opacity, translateY };
    setXPToastlar((prev) => [...prev, toast]);

    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, damping: 12 }),
    ]).start(() => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: -15, duration: 400, useNativeDriver: true }),
        ]).start(() => {
          setXPToastlar((prev) => prev.filter((t) => t.id !== id));
        });
      }, 1600);
    });
  }, []);

  const xpKazan = useCallback(
    (miktar: number, mesaj = "XP Kazandın") => {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setXP((prev) => {
        const yeni = prev + miktar;
        // Level-up achievement check
        const yeniSeviye = seviyeHesapla(yeni);
        if (yeniSeviye.no >= 3 && seviyeHesapla(prev).no < 3) {
          setTimeout(() => basarimAc("senior_dev", 300), 500);
        }
        if (yeniSeviye.no >= 4 && seviyeHesapla(prev).no < 4) {
          setTimeout(() => basarimAc("lead_dev", 500), 500);
        }
        return yeni;
      });
      showToast(miktar, mesaj);
    },
    [showToast, seviyeHesapla]
  );

  const basarimAc = useCallback(
    (id: AchievementId, xpBonusu: number) => {
      setAcikBasarimlar((prev) => {
        if (prev.includes(id)) return prev;
        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        setXP((prevXP) => prevXP + xpBonusu);
        const basarim = BASARIMLAR.find((b) => b.id === id);
        if (basarim) showToast(xpBonusu, `🏆 ${basarim.baslik}`);
        return [...prev, id];
      });
    },
    [showToast]
  );

  const ALL_TABS = ["index", "projeler", "yetenekler", "iletisim", "basarimlar"];

  const tabZiyaret = useCallback(
    (tab: string) => {
      setZiyaretEdilen((prev) => {
        if (prev.includes(tab)) return prev;
        const yeni = [...prev, tab];

        const tabAchievements: Record<string, AchievementId> = {
          projeler: "projeler_ziyaret",
          yetenekler: "yetenekler_ziyaret",
          iletisim: "iletisim_ziyaret",
          basarimlar: "basarimlar_ziyaret",
        };
        const achId = tabAchievements[tab];
        const ach = BASARIMLAR.find((b) => b.id === achId);
        if (achId && ach) setTimeout(() => basarimAc(achId, ach.xp), 300);

        // Gezgin achievement
        const tumTablar = ALL_TABS.every((t) => yeni.includes(t));
        if (tumTablar) setTimeout(() => basarimAc("gezgin", 200), 600);

        return yeni;
      });
    },
    [basarimAc]
  );

  const contactTikla = useCallback(() => {
    setContactTiklama((prev) => {
      const yeni = prev + 1;
      xpKazan(10, "Bağlantı Tıklandı");
      if (yeni === 3) setTimeout(() => basarimAc("networker", 100), 400);
      return yeni;
    });
  }, [xpKazan, basarimAc]);

  const isealTikla = useCallback(() => {
    basarimAc("iseal", 150);
  }, [basarimAc]);

  return (
    <GameContext.Provider
      value={{
        xp,
        seviye,
        acikBasarimlar,
        xpToastlar,
        contactTiklama,
        xpIlerlemesi,
        sonrakiSeviyeXP,
        xpKazan,
        tabZiyaret,
        contactTikla,
        isealTikla,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextType {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}
