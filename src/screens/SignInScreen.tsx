import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useAuth } from '../context/AuthContext';

WebBrowser.maybeCompleteAuthSession();

function GoogleGIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <Path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <Path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <Path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </Svg>
  );
}

const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';
const GOOGLE_ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? '';
const API_URL = 'https://souls3000.space';

// SF Pro on iOS, Roboto on Android
const FONT_REGULAR = Platform.select({ ios: 'System', android: 'Roboto', default: 'System' });
const FONT_MEDIUM = Platform.select({ ios: 'System', android: 'Roboto-Medium', default: 'System' });

export default function SignInScreen() {
  const { signIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    scopes: ['openid', 'email', 'profile'],
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const idToken =
        (response.params as Record<string, string>)?.id_token ??
        (response as any).authentication?.idToken;
      if (idToken) {
        handleMobileAuth(idToken);
      } else {
        setError('Failed to get ID token from Google');
        setIsLoading(false);
      }
    } else if (response?.type === 'error') {
      setError('Google sign-in failed. Try again.');
      setIsLoading(false);
    } else if (response?.type === 'dismiss') {
      setIsLoading(false);
    }
  }, [response]);

  const handleMobileAuth = async (idToken: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/mobile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      if (res.status === 403) {
        setError('Access denied');
        return;
      }
      if (!res.ok) {
        setError('Sign-in failed. Try again.');
        return;
      }
      const { token } = await res.json();
      await signIn(token);
    } catch {
      setError('Network error. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePress = () => {
    setError(null);
    setIsLoading(true);
    promptAsync();
  };

  return (
    <LinearGradient colors={['#1a0d05', '#0a0503', '#050505']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <Text style={styles.label}>PRIVATE ACCESS ONLY</Text>
          <Text style={styles.title}>Project Orange</Text>
          <Text style={styles.subtitle}>by Momo & Potti</Text>
          <View style={styles.divider} />
          <TouchableOpacity
            style={[styles.googleButton, (!request || isLoading) && styles.disabled]}
            onPress={handlePress}
            activeOpacity={0.75}
            disabled={!request || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#f5e9d6" />
            ) : (
              <>
                <GoogleGIcon size={18} />
                <Text style={styles.googleText}>SIGN IN WITH GOOGLE</Text>
              </>
            )}
          </TouchableOpacity>
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
        <Text style={styles.loveText}>I LOVE U 3000 ♡</Text>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  label: {
    fontSize: 10,
    letterSpacing: 4,
    color: 'rgba(245, 233, 214, 0.45)',
    fontFamily: FONT_REGULAR,
    marginBottom: 12,
  },
  title: {
    fontSize: 36,
    color: '#f5e9d6',
    fontFamily: FONT_REGULAR,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(245, 233, 214, 0.5)',
    fontFamily: FONT_REGULAR,
    fontStyle: 'italic',
    letterSpacing: 0.5,
    marginBottom: 24,
  },
  divider: {
    width: 72,
    height: 1,
    backgroundColor: 'rgba(232, 201, 154, 0.4)',
    marginBottom: 32,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(245, 233, 214, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(245, 233, 214, 0.15)',
    borderRadius: 999,
    paddingVertical: 13,
    paddingHorizontal: 28,
    minWidth: 220,
    justifyContent: 'center',
  },
  disabled: { opacity: 0.5 },
  googleText: {
    fontSize: 12,
    letterSpacing: 2,
    color: '#f5e9d6',
    fontFamily: FONT_MEDIUM,
    fontWeight: '500',
  },
  error: {
    marginTop: 16,
    fontSize: 12,
    color: '#C8846A',
    textAlign: 'center',
    fontFamily: FONT_REGULAR,
  },
  loveText: {
    textAlign: 'center',
    fontSize: 10,
    letterSpacing: 2,
    color: 'rgba(245, 233, 214, 0.25)',
    fontFamily: FONT_REGULAR,
    paddingBottom: 20,
  },
});
