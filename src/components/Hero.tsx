import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { apiGet } from '../lib/api';

const FONT_REGULAR = Platform.select({ ios: 'System', android: 'Roboto', default: 'System' });
const FONT_MEDIUM = Platform.select({ ios: 'System', android: 'Roboto-Medium', default: 'System' });

const HERO_FILE = 'Ember_Wade.jpg';
const HERO_NAME = 'Ember & Wade';

const TITLE = 'Story Of Our Lives (S.O.U.L.S)';
const SUBTEXT =
  'A PRIVATE SPACE TO SEE OUR JOURNEY, MOMENTS, FAVOURITES, AND MORE..THIS IS OUR OWN LITTLE WORLD, WE CAN CRAFT IT HOWEVER WE WANT';
const INTRO_HEADING = 'Our Private Little Horizon';

type HomeImagesResponse = { intro: Record<string, string> };

export default function Hero() {
  const [uri, setUri] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [imgError, setImgError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiGet<HomeImagesResponse>('/api/home-images')
      .then((data) => {
        if (cancelled) return;
        const url = data.intro[HERO_FILE] ?? null;
        if (url) {
          Image.prefetch(url).catch(() => {});
          setUri(url);
        } else {
          setApiError('No signed URL returned for ' + HERO_FILE);
        }
      })
      .catch((e) => {
        if (cancelled) return;
        setApiError(String(e));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{TITLE}</Text>
      <Text style={styles.subtext}>{SUBTEXT}</Text>

      <View style={styles.card}>
        <View style={styles.imageWrap}>
          {uri ? (
            <Image
              source={{ uri }}
              style={styles.image}
              resizeMode="cover"
              onLoad={() => setLoaded(true)}
              onError={(e) => {
                const msg = e?.nativeEvent?.error ?? 'unknown';
                setImgError(String(msg));
              }}
            />
          ) : null}

          {!loaded && !imgError && !apiError && (
            <View style={styles.placeholder}>
              <ActivityIndicator size="small" color="rgba(245,233,214,0.4)" />
            </View>
          )}

          {(apiError || imgError) && (
            <View style={styles.placeholder}>
              <Text style={styles.errText}>
                {apiError ? `API: ${apiError}` : `IMG: ${imgError}`}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.introHeading}>{INTRO_HEADING}</Text>
          <Text style={styles.body}>
            <Text>If </Text>
            <Text style={styles.accent}>{HERO_NAME}</Text>
            <Text>
              {' '}taught us anything, it's that the purest connections happen between the most unlikely of characters. Like them, we've proven that different lifestyles and different tastes don't just coexist—they{' '}
            </Text>
            <Text style={styles.accent}>THRIVE. </Text>
            <Text style={styles.accent}>SOULS </Text>
            <Text>
              is the digital manifestation of our own little world, built on a foundation of love and cuteness. It's a place to pause the clock, revisit our favorite milestones, and see just how far we've traveled side-by-side. Welcome to our tiny space, where we can simply be ourselves.{' '}
            </Text>
            <Text style={styles.accent}>JUST US.</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 30,
    fontFamily: FONT_REGULAR,
    fontWeight: '700',
    color: '#E8C99A',
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 38,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  subtext: {
    fontSize: 10,
    fontFamily: FONT_MEDIUM,
    fontWeight: '600',
    color: 'rgba(245, 233, 214, 0.7)',
    textAlign: 'center',
    letterSpacing: 2,
    lineHeight: 16,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#000',
    borderRadius: 32,
    overflow: 'hidden',
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: '#0a0503',
    position: 'relative',
  },
  placeholder: {
    position: 'absolute',
    inset: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  errText: {
    color: '#C8846A',
    fontSize: 11,
    textAlign: 'center',
    fontFamily: FONT_REGULAR,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textBlock: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 36,
  },
  introHeading: {
    fontSize: 26,
    fontFamily: FONT_REGULAR,
    fontWeight: '500',
    color: '#E8C99A',
    textAlign: 'center',
    letterSpacing: -0.3,
    lineHeight: 32,
    marginBottom: 20,
  },
  body: {
    fontSize: 15,
    fontFamily: FONT_REGULAR,
    color: '#f5e9d6',
    lineHeight: 26,
    letterSpacing: 0.2,
    textAlign: 'left',
  },
  accent: {
    color: '#C8846A',
    fontWeight: '700',
  },
});
