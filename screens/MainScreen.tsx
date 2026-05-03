import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../lib/constants";

// Placeholder — souls3000.space home page content goes here next session
export default function MainScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.eyebrow}>SOULS3000</Text>
        <Text style={styles.heading}>— you're in ♡ —</Text>
        <Text style={styles.body}>Main content coming next session.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
  eyebrow: { fontSize: 10, fontWeight: "700", letterSpacing: 6, color: COLORS.primary, opacity: 0.7, marginBottom: 20, textTransform: "uppercase" },
  heading: { fontSize: 28, fontWeight: "300", color: COLORS.white, letterSpacing: 2, textAlign: "center", marginBottom: 16 },
  body: { fontSize: 14, color: COLORS.muted, textAlign: "center", lineHeight: 22 },
});