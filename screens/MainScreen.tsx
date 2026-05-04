import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../lib/constants";
import LoveHero from "./LoveHero";
import LoveCountdown from "./LoveCountdown";
import LoveLetters from "./LoveLetters";

export default function MainScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <LoveHero />
        <LoveCountdown />
        <LoveLetters />
        {/* Next sections go here one by one */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  content: { paddingBottom: 60 },
});