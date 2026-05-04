import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { COLORS } from "../lib/constants";

const phrases = [
  "Two friends who never planned to fall in love, only to find themselves lost in a world called US",
  "We were just two kids who didn't know what love was — until it was already us.",
  "4 years and 8 months of growth, laughter, and pure passion — we've come so far, yet so far to go.",
];

function calcTime() {
  const start = new Date("2021-09-11T00:00:00");
  const now = new Date();
  let y = now.getFullYear() - start.getFullYear();
  let m = now.getMonth() - start.getMonth();
  let d = now.getDate() - start.getDate();
  if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
  if (m < 0) { y--; m += 12; }
  return { y, m, d };
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.unitRow}>
      <Text style={styles.unitNumber}>{value}</Text>
      <Text style={styles.unitLabel}>{label}</Text>
    </View>
  );
}

function Sep() {
  return <Text style={styles.sep}>·</Text>;
}

export default function LoveCountdown() {
  const [time, setTime] = useState(calcTime());
  const [cur, setCur] = useState(0);
  const phraseOpacity = useRef(new Animated.Value(1)).current;
  const phraseTranslate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const t = setInterval(() => setTime(calcTime()), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      Animated.parallel([
        Animated.timing(phraseOpacity, { toValue: 0, duration: 600, useNativeDriver: true }),
        Animated.timing(phraseTranslate, { toValue: 6, duration: 600, useNativeDriver: true }),
      ]).start(() => {
        setCur(i => (i + 1) % phrases.length);
        phraseTranslate.setValue(6);
        Animated.parallel([
          Animated.timing(phraseOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(phraseTranslate, { toValue: 0, duration: 600, useNativeDriver: true }),
        ]).start();
      });
    }, 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <View style={styles.container}>
      {/* Hearts */}
      <Text style={styles.hearts}>♡  ♡  ♡</Text>

      {/* Numbers */}
      <View style={styles.numbersRow}>
        <Unit value={time.y} label="years" />
        <Sep />
        <Unit value={time.m} label="months" />
        <Sep />
        <Unit value={time.d} label="days" />
      </View>

      {/* Rotating phrase */}
      <Animated.Text style={[
        styles.phrase,
        { opacity: phraseOpacity, transform: [{ translateY: phraseTranslate }] }
      ]}>
        {phrases[cur]}
      </Animated.Text>

      {/* Since line */}
      <Text style={styles.since}>
        Since September 11, 2021  ·  still counting ...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bg,
    paddingHorizontal: 24,
    paddingVertical: 48,
    alignItems: "center",
  },
  hearts: {
    color: COLORS.primary,
    fontSize: 14,
    letterSpacing: 12,
    opacity: 0.7,
    marginBottom: 32,
  },
  numbersRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginBottom: 36,
  },
  unitRow: {
    alignItems: "baseline",
    flexDirection: "row",
    gap: 6,
  },
  unitNumber: {
    fontSize: 56,
    fontWeight: "300",
    color: COLORS.gold,
    letterSpacing: -1,
    lineHeight: 64,
  },
  unitLabel: {
    fontSize: 9,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: COLORS.muted,
    fontWeight: "400",
    paddingBottom: 4,
  },
  sep: {
    color: "#2a2a2a",
    fontSize: 32,
    fontWeight: "300",
    lineHeight: 40,
  },
  phrase: {
    fontSize: 13,
    color: COLORS.muted,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 22,
    letterSpacing: 0.3,
    maxWidth: 320,
    marginBottom: 24,
    minHeight: 66,
  },
  since: {
    fontSize: 10,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});