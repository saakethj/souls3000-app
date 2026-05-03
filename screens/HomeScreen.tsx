import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../lib/constants";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Top accent */}
        <View style={styles.topLine} />

        {/* Hero placeholder — LoveHero goes here */}
        <View style={styles.section}>
          <Text style={styles.eyebrow}>SOULS3000</Text>
          <Text style={styles.heading}>— for you, always —</Text>
          <Text style={styles.body}>
            Every section of this is being built with you in mind.
          </Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Countdown placeholder — LoveCountdown goes here */}
        <View style={styles.section}>
          <Text style={styles.eyebrow}>TOGETHER SINCE</Text>
          <Text style={styles.countdownLabel}>Sep 11, 2021</Text>
          <Text style={styles.body}>Countdown component coming next.</Text>
        </View>

        {/* More sections will be added: Timeline, Gallery, Letters, Music, Journal */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    paddingBottom: 80,
  },
  topLine: {
    height: 2,
    backgroundColor: COLORS.primary,
    opacity: 0.6,
    marginBottom: 48,
  },
  section: {
    paddingHorizontal: 32,
    marginBottom: 40,
    alignItems: "center",
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 6,
    color: COLORS.primary,
    opacity: 0.7,
    marginBottom: 16,
    textTransform: "uppercase",
  },
  heading: {
    fontSize: 28,
    fontWeight: "300",
    color: COLORS.white,
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 16,
  },
  body: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 22,
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 32,
    marginBottom: 40,
    opacity: 0.5,
  },
  countdownLabel: {
    fontSize: 20,
    fontWeight: "300",
    color: COLORS.gold,
    letterSpacing: 3,
    marginBottom: 12,
  },
});