import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const { signOut } = useAuth();
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.inner}>
        <Text style={styles.title}>Home Dashboard</Text>
        <Text style={styles.sub}>Coming soon...</Text>
        <TouchableOpacity onPress={signOut} style={styles.btn}>
          <Text style={styles.btnText}>Sign Out</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { color: '#f5e9d6', fontSize: 24, marginBottom: 8 },
  sub: { color: 'rgba(245,233,214,0.5)', fontSize: 14, marginBottom: 32 },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(245,233,214,0.2)',
    borderRadius: 8,
  },
  btnText: { color: '#f5e9d6', fontSize: 13 },
});
