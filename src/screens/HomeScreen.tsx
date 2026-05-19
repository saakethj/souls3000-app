import React from 'react';
import { ScrollView, StyleSheet, StatusBar, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Hero from '../components/Hero';
import Countdown from '../components/Countdown';
import LoveLetters from '../components/LoveLetters';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const { signOut } = useAuth();
  return (
    <View style={styles.bg}>
      <StatusBar barStyle="light-content" backgroundColor="#000" translucent />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Hero />
          <Countdown />
          <LoveLetters />
          <View style={styles.footer}>
            <TouchableOpacity onPress={signOut} style={styles.btn} activeOpacity={0.7}>
              <Text style={styles.btnText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#000' },
  safe: { flex: 1 },
  scroll: { paddingBottom: 48 },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(245,233,214,0.2)',
    borderRadius: 999,
  },
  btnText: {
    color: '#f5e9d6',
    fontSize: 12,
    letterSpacing: 1.5,
  },
});
