import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "../lib/constants";
import { getSignedUrl } from "../lib/supabase";

const { width: SCREEN_W } = Dimensions.get("window");

const CONFIG = {
  title: "Story Of Our Lives (S.O.U.L.S)",
  subtext: "A private space to look back, celebrate how far we've come, and cherish our story—bundled with tech and love",
  introHeading: "Our Private Little Horizon",
  introBodyBefore: "If ",
  introBodyAfter: " taught us anything, it's that the purest connections happen between the most unlikely of characters. Like them, we've proven that different lifestyles and different tastes don't just coexist—they ",
  introBodyEnd: [
    { text: "THRIVE. ", accent: true },
    { text: "SOULS ", accent: true },
    { text: "is the digital manifestation of our own little world, built on a foundation of love and cuteness. It's a place to pause the clock, revisit our favorite milestones, and see just how far we've traveled side-by-side. Welcome to our tiny space, where we can simply be ourselves. " },
    { text: "JUST US.", accent: true },
  ],
};

const COUPLES = [
  { path: "intro/Nick_Judy_upscaled.jpeg", alt: "Nick and Judy", name: "Nick & Judy" },
  { path: "intro/Monica_Chandler.jpg", alt: "Monica and Chandler", name: "Monica & Chandler" },
  { path: "intro/Ember_Wade.jpg", alt: "Ember and Wade", name: "Ember & Wade" },
];

const INTERVAL = 5500;
const IMG_HEIGHT = 300;

export default function LoveHero() {
  const [current, setCurrent] = useState(0);
  const [urls, setUrls] = useState<(string | null)[]>([null, null, null]);
  const opacities = useRef(COUPLES.map((_, i) => new Animated.Value(i === 0 ? 1 : 0))).current;
  const nameOpacity = useRef(new Animated.Value(1)).current;
  const nameTranslate = useRef(new Animated.Value(0)).current;

  // Fetch all signed URLs on mount
  useEffect(() => {
    COUPLES.forEach((couple, i) => {
      getSignedUrl(couple.path)
        .then((url) => {
          setUrls((prev) => {
            const next = [...prev];
            next[i] = url;
            return next;
          });
        })
        .catch((err) => console.log("Hero image error:", couple.path, err));
    });
  }, []);

  // Carousel interval
  useEffect(() => {
    const t = setInterval(() => {
      Animated.parallel([
        Animated.timing(nameOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(nameTranslate, { toValue: 5, duration: 400, useNativeDriver: true }),
      ]).start(() => {
        setCurrent((c) => {
          const next = (c + 1) % COUPLES.length;
          Animated.parallel([
            Animated.timing(opacities[c], { toValue: 0, duration: 900, useNativeDriver: true }),
            Animated.timing(opacities[next], { toValue: 1, duration: 900, useNativeDriver: true }),
          ]).start();
          nameTranslate.setValue(5);
          Animated.parallel([
            Animated.timing(nameOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(nameTranslate, { toValue: 0, duration: 600, useNativeDriver: true }),
          ]).start();
          return next;
        });
      });
    }, INTERVAL);
    return () => clearInterval(t);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{CONFIG.title}</Text>
      <Text style={styles.subtext}>{CONFIG.subtext}</Text>

      {/* Image carousel */}
      <View style={styles.imageContainer}>
        {COUPLES.map((couple, i) =>
          urls[i] ? (
            <Animated.Image
              key={couple.path}
              source={{ uri: urls[i]! }}
              style={[styles.image, { opacity: opacities[i] }]}
              resizeMode="cover"
            />
          ) : (
            <Animated.View
              key={couple.path}
              style={[styles.image, styles.imagePlaceholder, { opacity: opacities[i] }]}
            >
              <ActivityIndicator color={COLORS.primary} />
            </Animated.View>
          )
        )}
        <View style={styles.dots}>
          {COUPLES.map((_, i) => (
            <View key={i} style={[styles.dot, i === current && styles.dotActive]} />
          ))}
        </View>
      </View>

      {/* Intro text */}
      <View style={styles.textSection}>
        <Text style={styles.introHeading}>{CONFIG.introHeading}</Text>
        <Text style={styles.body}>
          <Text>{CONFIG.introBodyBefore}</Text>
          <Animated.Text style={[
            styles.accentName,
            { opacity: nameOpacity, transform: [{ translateY: nameTranslate }] }
          ]}>
            {COUPLES[current].name}
          </Animated.Text>
          <Text>{CONFIG.introBodyAfter}</Text>
          {CONFIG.introBodyEnd.map((seg, i) =>
            seg.accent
              ? <Text key={i} style={styles.accent}>{seg.text}</Text>
              : <Text key={i}>{seg.text}</Text>
          )}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bg,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "500",
    color: COLORS.primary,
    textAlign: "center",
    lineHeight: 42,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  subtext: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2.5,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.55)",
    textAlign: "center",
    lineHeight: 16,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  imageContainer: {
    width: "100%",
    height: IMG_HEIGHT,
    backgroundColor: "#000",
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111",
  },
  dots: {
    position: "absolute",
    bottom: 14,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    zIndex: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  dotActive: {
    width: 20,
    backgroundColor: COLORS.primary,
  },
  textSection: {
    backgroundColor: "#0a0a0a",
    borderRadius: 16,
    padding: 24,
    marginTop: 16,
  },
  introHeading: {
    fontSize: 26,
    fontWeight: "400",
    color: COLORS.gold,
    textAlign: "center",
    lineHeight: 36,
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  body: {
    fontSize: 15,
    color: "rgba(255,255,255,0.82)",
    lineHeight: 28,
    letterSpacing: 0.3,
  },
  accentName: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  accent: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});