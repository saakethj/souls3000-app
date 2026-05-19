import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform, Animated } from 'react-native';

const FONT_SERIF = Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' });
const FONT_SANS = Platform.select({ ios: 'System', android: 'Roboto', default: 'System' });

const START_DATE = new Date('2021-09-11T00:00:00');

const PHRASES = [
  'Two friends who never planned to fall in love, only to find themselves mad in LOVE',
  "We were just two kids who didn't know what love was — until it was already us.",
  '4 years and 8 months of long distance, cute memories, countless conversations but the journey is still going.',
];

function diff(now: Date) {
  let y = now.getFullYear() - START_DATE.getFullYear();
  let m = now.getMonth() - START_DATE.getMonth();
  let d = now.getDate() - START_DATE.getDate();
  if (d < 0) {
    m -= 1;
    d += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (m < 0) {
    y -= 1;
    m += 12;
  }
  return { y, m, d };
}

export default function Countdown() {
  const [time, setTime] = useState(() => diff(new Date()));
  const [cur, setCur] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const t = setInterval(() => setTime(diff(new Date())), 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 600, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 6, duration: 600, useNativeDriver: true }),
      ]).start(() => {
        setCur((i) => (i + 1) % PHRASES.length);
        Animated.parallel([
          Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 0, duration: 600, useNativeDriver: true }),
        ]).start();
      });
    }, 6000);
    return () => clearInterval(t);
  }, [opacity, translateY]);

  return (
    <View style={styles.wrap}>
      <View style={styles.hearts}>
        <Text style={styles.heart}>♡</Text>
        <Text style={styles.heart}>♡</Text>
        <Text style={styles.heart}>♡</Text>
      </View>

      <View style={styles.row}>
        <Unit value={time.y} label="YEARS" />
        <Text style={styles.sep}>·</Text>
        <Unit value={time.m} label="MONTHS" />
        <Text style={styles.sep}>·</Text>
        <Unit value={time.d} label="DAYS" />
      </View>

      <View style={styles.phraseWrap}>
        <Animated.Text
          style={[styles.phrase, { opacity, transform: [{ translateY }] }]}
        >
          {PHRASES[cur]}
        </Animated.Text>
      </View>

      <Text style={styles.since}>SINCE SEPTEMBER 11, 2021  ·  STILL COUNTING ...</Text>
    </View>
  );
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.unit}>
      <Text style={styles.number}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 56,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  hearts: {
    flexDirection: 'row',
    gap: 18,
    marginBottom: 28,
  },
  heart: {
    color: '#C8846A',
    fontSize: 14,
    opacity: 0.7,
    fontFamily: FONT_SERIF,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 36,
  },
  unit: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  number: {
    fontSize: 44,
    fontWeight: '300',
    color: '#E8C99A',
    fontFamily: FONT_SERIF,
    letterSpacing: -0.8,
    lineHeight: 48,
  },
  label: {
    fontSize: 8,
    letterSpacing: 1.2,
    color: '#C8846A',
    fontFamily: FONT_SANS,
    fontWeight: '600',
    paddingBottom: 4,
  },
  sep: {
    color: '#2a2a2a',
    fontSize: 22,
    fontWeight: '300',
    fontFamily: FONT_SERIF,
  },
  phraseWrap: {
    minHeight: 72,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  phrase: {
    fontFamily: FONT_SERIF,
    fontStyle: 'italic',
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    lineHeight: 21,
    letterSpacing: 0.3,
  },
  since: {
    fontSize: 11,
    letterSpacing: 1.8,
    color: '#C8846A',
    fontFamily: FONT_SANS,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 8,
  },
});
