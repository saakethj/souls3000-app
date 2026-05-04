import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Animated,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Audio } from "expo-av";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  COLORS,
  SPREADS,
  PASSWORD,
  AUDIO_SRC,
  WRONG_RESPONSES,
} from "../lib/constants";
import { getSignedUrl } from "../lib/supabase";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const CARD_W = Math.min(SCREEN_W * 0.92, 400);

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

function RuledLines() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: 18 }).map((_, i) => (
        <View key={i} style={[styles.ruledLine, { top: 32 + i * 28 }]} />
      ))}
    </View>
  );
}

function StampImage({ src, caption, rotation = -3 }: { src: string; caption?: string; rotation?: number }) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

useEffect(() => {
  console.log("Fetching signed URL for:", src);
  getSignedUrl(src)
    .then((url) => {
      console.log("Got URL:", url);
      setSignedUrl(url);
    })
    .catch((err) => {
      console.log("Signed URL error:", err);
      setError(true);
    });
}, [src]);

  return (
    <View style={[styles.stampOuter, { transform: [{ rotate: `${rotation}deg` }] }]}>
      <View style={styles.stampTape} />
      <View style={styles.stampCard}>
        <View style={styles.stampImgBox}>
          {!error && signedUrl ? (
            <>
              {!loaded && <ActivityIndicator color={COLORS.primary} style={StyleSheet.absoluteFill} />}
              <Image source={{ uri: signedUrl }} style={styles.stampImg} onLoad={() => setLoaded(true)} onError={() => setError(true)} resizeMode="cover" />
            </>
          ) : !signedUrl && !error ? (
            <ActivityIndicator color={COLORS.primary} />
          ) : (
            <Text style={styles.stampFallback}>♡</Text>
          )}
        </View>
        {caption && <Text style={styles.stampCaption}>{caption}</Text>}
      </View>
    </View>
  );
}

function AudioSlot() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    // Fetch signed URL first, then load audio
    getSignedUrl(AUDIO_SRC).then((url) => setAudioUrl(url)).catch(console.error);
  }, []);

  useEffect(() => {
    if (!audioUrl) return;
    let sound: Audio.Sound;
    (async () => {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { sound: s } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: false },
          (status) => {
            if (status.isLoaded) {
              setLoaded(true);
              setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);
              setCurrentTime(status.positionMillis ? status.positionMillis / 1000 : 0);
              setProgress(status.durationMillis ? (status.positionMillis! / status.durationMillis) * 100 : 0);
              if (status.didJustFinish) {
                setPlaying(false);
                setProgress(0);
                setCurrentTime(0);
                s.setPositionAsync(0);
              }
            }
          }
        );
        sound = s;
        soundRef.current = s;
      } catch (e) { console.log("Audio error", e); }
    })();
    return () => { sound?.unloadAsync(); };
  }, [audioUrl]);

  // rest of the function stays exactly the same...

  async function togglePlay() {
    const s = soundRef.current;
    if (!s || !loaded) return;
    if (playing) { await s.pauseAsync(); } else { await s.playAsync(); }
    setPlaying(p => !p);
  }

  function fmtTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  return (
    <View style={styles.audioBox}>
      <Text style={styles.audioLabel}>🎙 A message for you</Text>
      <View style={styles.audioRow}>
        <TouchableOpacity onPress={togglePlay} style={[styles.audioBtn, playing && styles.audioBtnActive]}>
          <Text style={[styles.audioBtnText, playing && styles.audioBtnTextActive]}>{playing ? "⏸" : "▶"}</Text>
        </TouchableOpacity>
        <View style={styles.audioTrack}>
          <View style={styles.audioBar}>
            <View style={[styles.audioProgress, { width: `${progress}%` as any }]} />
          </View>
          <View style={styles.audioTimes}>
            <Text style={styles.audioTime}>{fmtTime(currentTime)}</Text>
            <Text style={styles.audioTime}>{duration > 0 ? fmtTime(duration) : "--:--"}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.audioHint}>{playing ? "now playing... 🎵" : "tap ▶ to hear my voice"}</Text>
    </View>
  );
}

function Cover({ onOpen }: { onOpen: () => void }) {
  const pulseAnim = useRef(new Animated.Value(0.88)).current;

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1, duration: 1250, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 0.88, duration: 1250, useNativeDriver: true }),
    ])).start();
  }, []);

  return (
    <View style={styles.cover}>
      <View style={styles.coverSpine}>
        {Array.from({ length: 8 }).map((_, i) => (
          <View key={i} style={[styles.coverSpineDot, { top: 20 + i * (SCREEN_H * 0.82 - 40) / 8 }]} />
        ))}
      </View>
      <View style={styles.coverContent}>
        <View style={styles.coverAccent} />
        <Text style={styles.coverTitle}>Project Orange</Text>
        <Text style={styles.coverSubtitle}>By Momo & Potti</Text>
        <View style={styles.coverAccentFaint} />
        <Text style={styles.coverTagline}>Lots of surprises waiting ahead...</Text>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity onPress={onOpen} style={styles.openBtn}>
            <Text style={styles.openBtnText}>open me ♡</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      <View style={styles.coverSignature}>
        <Text style={styles.coverSignatureText}>I LOVE U 3000 ♡</Text>
      </View>
    </View>
  );
}

function SpreadView({ spreadIndex, onNext, onPrev, onUnlock }: {
  spreadIndex: number; onNext: () => void; onPrev: () => void; onUnlock: () => void;
}) {
  const spread = SPREADS[spreadIndex];
  const [password, setPassword] = useState("");
  const [wrong, setWrong] = useState("");
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const isPassword = "isPassword" in spread.right && (spread.right as any).isPassword;
  const hasAudio = "hasAudio" in spread.right && (spread.right as any).hasAudio;

  function handlePassword() {
    if (password.trim() === PASSWORD) {
      onUnlock();
    } else {
      setWrong(WRONG_RESPONSES[Math.floor(Math.random() * WRONG_RESPONSES.length)]);
      setPassword("");
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 5, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -5, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
    }
  }

  return (
    <View style={styles.spread}>
      {/* TOP: image */}
      <View style={styles.spreadTop}>
        <View style={styles.spreadSpineLine} />
        <View style={{ position: "relative", zIndex: 1 }}>
          <StampImage src={spread.left.src} caption={spread.left.caption} rotation={spread.left.rotation} />
        </View>
        <Text style={styles.spreadPageNum}>{spread.id}</Text>
      </View>

      {/* BOTTOM: text */}
      <ScrollView style={styles.spreadBottom} contentContainerStyle={styles.spreadBottomContent} showsVerticalScrollIndicator={false}>
        <View style={{ position: "relative", zIndex: 2 }}>
          <Text style={styles.spreadCounter}>{spread.id} / {SPREADS.length}</Text>
          <Text style={styles.spreadHeading}>{spread.right.heading}</Text>
          <Text style={styles.spreadBody}>{spread.right.body}</Text>
          {hasAudio && <AudioSlot />}
          {isPassword && (
            <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
              <TextInput
                secureTextEntry value={password}
                onChangeText={t => { setPassword(t); setWrong(""); }}
                onSubmitEditing={handlePassword}
                placeholder="the magic word..."
                placeholderTextColor="#b09070"
                style={styles.passwordInput}
                returnKeyType="done"
              />
              <TouchableOpacity onPress={handlePassword} style={styles.passwordBtn}>
                <Text style={styles.passwordBtnText}>enter →</Text>
              </TouchableOpacity>
              <Text style={styles.passwordHint}>{(spread.right as any).hint}</Text>
              {wrong ? <Text style={styles.passwordWrong}>{wrong}</Text> : null}
            </Animated.View>
          )}
        </View>
        <View style={{ height: 64 }} />
      </ScrollView>

      {/* Nav */}
      <View style={styles.navRow}>
        <TouchableOpacity onPress={onPrev} style={styles.navBtn}>
          <Text style={styles.navBtnText}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressDots}>
          {SPREADS.map((_, i) => (
            <View key={i} style={[styles.dot, i === spreadIndex && styles.dotActive]} />
          ))}
        </View>
        {!isPassword ? (
          <TouchableOpacity onPress={onNext} style={[styles.navBtn, styles.navBtnNext]}>
            <Text style={[styles.navBtnText, { color: COLORS.primary }]}>→</Text>
          </TouchableOpacity>
        ) : <View style={styles.navBtn} />}
      </View>
    </View>
  );
}

export default function HomeScreen({ navigation }: Props) {
  const [opened, setOpened] = useState(false);
  const [spreadIndex, setSpreadIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  function transition(fn: () => void) {
    Animated.timing(fadeAnim, { toValue: 0, duration: 280, useNativeDriver: true }).start(() => {
      fn();
      Animated.timing(fadeAnim, { toValue: 1, duration: 280, useNativeDriver: true }).start();
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0803" />
      <View style={styles.mainBg}>
        <Animated.View style={[styles.cardWrapper, { opacity: fadeAnim, flex: 1 }]}>
          {!opened ? (
            <Cover onOpen={() => transition(() => setOpened(true))} />
          ) : (
            <SpreadView
              spreadIndex={spreadIndex}
              onNext={() => { if (spreadIndex < SPREADS.length - 1) transition(() => setSpreadIndex(i => i + 1)); }}
              onPrev={() => transition(() => { if (spreadIndex === 0) setOpened(false); else setSpreadIndex(i => i - 1); })}
              onUnlock={() => navigation.replace("Main")}
            />
          )}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0d0803" },
  mainBg: { flex: 1, backgroundColor: "#0d0803", alignItems: "center", justifyContent: "center", paddingVertical: 16 },
  cardWrapper: { width: CARD_W, flex: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.8, shadowRadius: 40, elevation: 20 },

  cover: { width: CARD_W, flex: 1, backgroundColor: COLORS.coverBg, borderRadius: 6, borderWidth: 1, borderColor: "#3a2010", overflow: "hidden", alignItems: "center", justifyContent: "center", padding: 32 },
  coverSpine: { position: "absolute", left: 0, top: 0, bottom: 0, width: 26, backgroundColor: "#0d0803", borderRightWidth: 1, borderRightColor: "#3a2010" },
  coverSpineDot: { position: "absolute", left: 8, width: 10, height: 10, borderRadius: 5, backgroundColor: "#0d0803", borderWidth: 1, borderColor: "#3a2010" },
  coverRule: { position: "absolute", left: 0, right: 0, height: 1, backgroundColor: "rgba(255,255,255,0.025)" },
  coverContent: { alignItems: "center", paddingLeft: 22, width: "100%" },
  coverAccent: { width: 32, height: 1, backgroundColor: COLORS.primary, opacity: 0.6, marginBottom: 24 },
  coverTitle: { fontSize: 28, fontWeight: "300", color: "#fff", letterSpacing: 1, marginBottom: 12, textAlign: "center" },
  coverSubtitle: { fontSize: 10, fontWeight: "700", letterSpacing: 5, textTransform: "uppercase", color: "#fff", marginBottom: 6, textAlign: "center" },
  coverAccentFaint: { width: 32, height: 1, backgroundColor: COLORS.primary, opacity: 0.4, marginVertical: 6, marginBottom: 20 },
  coverTagline: { fontFamily: "monospace", fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 22, marginBottom: 28, textAlign: "center" },
  openBtn: { backgroundColor: COLORS.gold, paddingVertical: 13, paddingHorizontal: 32, borderRadius: 40 },
  openBtnText: { fontSize: 11, fontWeight: "700", letterSpacing: 3, textTransform: "uppercase", color: "#5a3010" },
  coverSignature: { position: "absolute", bottom: 20, right: 20 },
  coverSignatureText: { fontSize: 13, color: "rgba(255,255,255,0.55)", fontStyle: "italic" },

  spread: { width: CARD_W, flex: 1, borderRadius: 6, overflow: "hidden" },
  spreadTop: { backgroundColor: COLORS.notebookTop, minHeight: 210, alignItems: "center", justifyContent: "center", position: "relative", paddingVertical: 24, paddingTop: 32 },
  spreadSpineLine: { position: "absolute", bottom: 0, left: 0, right: 0, height: 4, backgroundColor: "#d8c8a8" },
  spreadPageNum: { position: "absolute", bottom: 8, left: 12, fontSize: 9, color: "#ccc", fontStyle: "italic" },
  spreadBottom: { backgroundColor: COLORS.notebookBg, flex: 1 },
  spreadBottomContent: { padding: 20, paddingBottom: 8 },
  spreadCounter: { fontSize: 9, color: "#1a1a1a", letterSpacing: 4, textTransform: "uppercase", marginBottom: 10 },
  spreadHeading: { fontSize: 22, fontWeight: "300", color: COLORS.notebookText, marginBottom: 10, lineHeight: 30, fontStyle: "italic" },
  spreadBody: { fontFamily: "monospace", fontSize: 13, color: COLORS.notebookBody, lineHeight: 24, marginBottom: 8 },

  navRow: { position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, paddingVertical: 10, backgroundColor: COLORS.notebookBg, borderTopWidth: 1, borderTopColor: COLORS.notebookLine },
  navBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: "#d8c8a8", alignItems: "center", justifyContent: "center" },
  navBtnNext: { borderColor: `${COLORS.primary}77` },
  navBtnText: { fontSize: 16, color: "#8a6040" },
  progressDots: { flexDirection: "row", gap: 5, alignItems: "center" },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: "#d8c8a8" },
  dotActive: { width: 16, backgroundColor: COLORS.primary },

  ruledLine: { position: "absolute", left: 0, right: 0, height: 1, backgroundColor: "#e4d8c4", opacity: 0.5 },

  stampOuter: { alignItems: "center" },
  stampTape: { position: "absolute", top: -10, width: 52, height: 18, backgroundColor: "rgba(220,200,155,0.55)", borderRadius: 2, zIndex: 10 },
  stampCard: { backgroundColor: "#fff", padding: 10, paddingBottom: 24, shadowColor: "#000", shadowOffset: { width: 2, height: 4 }, shadowOpacity: 0.18, shadowRadius: 6, elevation: 4, width: 160 },
  stampImgBox: { width: 140, height: 130, backgroundColor: "#ece8e0", overflow: "hidden", alignItems: "center", justifyContent: "center" },
  stampImg: { width: "100%", height: "100%" },
  stampFallback: { fontSize: 32, color: COLORS.primary, opacity: 0.35 },
  stampCaption: { textAlign: "center", marginTop: 6, fontFamily: "monospace", fontSize: 10, color: "#1a1a1a", fontStyle: "italic" },

  audioBox: { marginTop: 12, borderWidth: 1, borderColor: "rgba(200,132,106,0.35)", borderRadius: 10, padding: 12, backgroundColor: "rgba(200,132,106,0.06)" },
  audioLabel: { fontSize: 9, color: COLORS.primary, fontWeight: "700", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 },
  audioRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  audioBtn: { width: 34, height: 34, borderRadius: 17, borderWidth: 1.5, borderColor: COLORS.primary, alignItems: "center", justifyContent: "center" },
  audioBtnActive: { backgroundColor: COLORS.primary },
  audioBtnText: { fontSize: 12, color: COLORS.primary },
  audioBtnTextActive: { color: "#fff" },
  audioTrack: { flex: 1, gap: 4 },
  audioBar: { height: 4, borderRadius: 4, backgroundColor: "rgba(200,132,106,0.25)", overflow: "hidden" },
  audioProgress: { position: "absolute", left: 0, top: 0, bottom: 0, backgroundColor: COLORS.primary, borderRadius: 4 },
  audioTimes: { flexDirection: "row", justifyContent: "space-between" },
  audioTime: { fontSize: 8, color: "#a07050" },
  audioHint: { marginTop: 8, fontSize: 10, color: "#b09070", fontStyle: "italic" },

  passwordInput: { borderBottomWidth: 1.5, borderBottomColor: "rgba(200,132,106,0.55)", color: COLORS.notebookText, fontSize: 16, paddingVertical: 8, paddingHorizontal: 4, marginBottom: 10, letterSpacing: 3 },
  passwordBtn: { borderWidth: 1, borderColor: "rgba(138,64,32,0.35)", paddingVertical: 10, borderRadius: 20, alignItems: "center", marginBottom: 10 },
  passwordBtnText: { fontSize: 10, fontWeight: "700", letterSpacing: 3, textTransform: "uppercase", color: "#8a4020" },
  passwordHint: { fontSize: 12, color: "#bbb", fontStyle: "italic", marginTop: 4 },
  passwordWrong: { fontSize: 11, color: COLORS.primary, fontStyle: "italic", marginTop: 6 },

  notebookTop: "#f5f0e4" as any,
  notebookBg: "#fdfaf2" as any,
  notebookLine: "#e4d8c4" as any,
  notebookText: "#5a3010" as any,
  notebookBody: "#6a4a28" as any,
  coverBg: "#2a1808" as any,
});