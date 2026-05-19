import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Pressable,
  Animated,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import Svg, { Rect, Polygon } from 'react-native-svg';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FONT_SANS = Platform.select({ ios: 'System', android: 'Roboto', default: 'System' });
const FONT_SANS_MED = Platform.select({ ios: 'System', android: 'Roboto-Medium', default: 'System' });
const FONT_SERIF = Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' });
const FONT_MONO = Platform.select({ ios: 'Courier', android: 'monospace', default: 'monospace' });

const ENV_W = 340;
const ENV_H = 200;
const FLAP_H = 110;

type Letter = {
  id: string;
  label: string;
  labelColor: string;
  envColor: string;
  envShadow: string;
  flapColor: string;
  sealText: string;
  dearName: string;
  sign: string;
  signAlign: 'left' | 'right';
  body: string[];
};

const LETTERS: Letter[] = [
  {
    id: 'momo',
    label: 'FROM MOMO',
    labelColor: '#C8846A',
    envColor: '#c8956a',
    envShadow: '#a06840',
    flapColor: '#d8a070',
    sealText: 'SEALED WITH LOVE ♡',
    dearName: 'Dear Bangaram,',
    sign: '— Your Momo ♡',
    signAlign: 'right',
    body: [
      'If I were ever given the chance to be a flower, I would pray to God to give me the beauty of a rose 🌹, the warmth of a sunflower 🌻, the grace of an orchid 🌸, the gentle care of a tulip 🌷, the pure innocence of a Lotus 🪷, and the delicate charm of a ranunculus.',
      'Because only then might I become something soft enough to rest in the hands of a girl as kind, sensitive, beautiful, loving, and intelligent as you.',
      'And even if I were blessed with all these qualities woven together in one flower, I know it still would not truly equal the wonderful person you are.',
      'So until such a miracle exists, here is a small bouquet for you. 💐',
    ],
  },
  {
    id: 'bangaram',
    label: 'FROM BANGARAM',
    labelColor: '#b08060',
    envColor: '#b87848',
    envShadow: '#8a5020',
    flapColor: '#c88848',
    sealText: 'KEEP THIS IN YOUR HEART',
    dearName: 'Dear Boo,',
    sign: '— Bangaram ♡',
    signAlign: 'left',
    body: [
      "Your plane leaves in the morning. Soon you leave to your world where I won't be, and I wish I could go with you — but your journey isn't mine.",
      'The world would soon apart us. As I learnt to live without you, but the urge to spend every moment with you.',
      "And this distance keeps me by the door — shouldn't interfere with you wanting more. I'm here, just in another direction.",
      'When your plane lands on the runway, keep this song inside your heart. When the road goes only one way — keep this song in your heart.',
      "I'll be with you all along, inside your heart.",
    ],
  },
];

function Envelope({ letter }: { letter: Letter }) {
  const [open, setOpen] = useState(false);
  const flapAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(flapAnim, {
      toValue: open ? 1 : 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [open, flapAnim]);

  const rotateX = flapAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const sealOpacity = flapAnim.interpolate({
    inputRange: [0, 0.4],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const toggle = () => {
    LayoutAnimation.configureNext({
      duration: 550,
      create: { type: 'easeInEaseOut', property: 'opacity' },
      update: { type: 'easeInEaseOut' },
      delete: { type: 'easeInEaseOut', property: 'opacity' },
    });
    setOpen((o) => !o);
  };

  return (
    <View style={styles.envWrap}>
      <Text
        style={[
          styles.label,
          { color: letter.labelColor, opacity: open ? 0 : 1 },
        ]}
      >
        {letter.label}
      </Text>

      <Pressable onPress={toggle} style={styles.envBody}>
        <Svg
          viewBox={`0 0 ${ENV_W} ${ENV_H}`}
          style={StyleSheet.absoluteFill}
          preserveAspectRatio="none"
        >
          <Rect x={0} y={0} width={ENV_W} height={ENV_H} fill={letter.envColor} />
          <Polygon points={`0,0 170,100 0,${ENV_H}`} fill={letter.envShadow} opacity={0.55} />
          <Polygon points={`${ENV_W},0 170,100 ${ENV_W},${ENV_H}`} fill={letter.envShadow} opacity={0.55} />
          <Polygon points={`0,${ENV_H} ${ENV_W},${ENV_H} 170,90`} fill={letter.envShadow} opacity={0.5} />
        </Svg>

        <Animated.View
          style={[
            styles.flap,
            {
              transform: [
                { perspective: 1000 },
                { translateY: -FLAP_H / 2 },
                { rotateX },
                { translateY: FLAP_H / 2 },
              ],
            },
          ]}
        >
          <Svg
            viewBox={`0 0 ${ENV_W} ${FLAP_H}`}
            style={StyleSheet.absoluteFill}
            preserveAspectRatio="none"
          >
            <Polygon points={`0,0 ${ENV_W},0 170,108`} fill={letter.flapColor} />
          </Svg>
          <Animated.Text style={[styles.seal, { opacity: sealOpacity }]}>
            {letter.sealText}
          </Animated.Text>
        </Animated.View>
      </Pressable>

      {open && (
        <View style={styles.paper}>
          <Text style={styles.dear}>{letter.dearName}</Text>
          {letter.body.map((para, i) => (
            <Text key={i} style={styles.bodyText}>
              {para}
            </Text>
          ))}
          <Text
            style={[
              styles.sign,
              { textAlign: letter.signAlign },
            ]}
          >
            {letter.sign}
          </Text>
        </View>
      )}

      <Text
        style={[
          styles.tap,
          { color: letter.labelColor, opacity: open ? 0 : 0.6 },
        ]}
      >
        TAP TO OPEN
      </Text>
    </View>
  );
}

export default function LoveLetters() {
  return (
    <View style={styles.section}>
      <Text style={styles.eyebrow}>FEELINGS EXPRESSED IN LETTERS</Text>
      <Text style={styles.heading}>— Words he wrote to her, and she for him —</Text>

      <View style={styles.envColumn}>
        <Envelope letter={LETTERS[0]} />
        <Envelope letter={LETTERS[1]} />
      </View>

      <View style={styles.divider} />
      <Text style={styles.footerQuote}>
        "These letters tell how deeply in love people can be."
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 56,
    alignItems: 'center',
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 4,
    color: 'rgba(245, 233, 214, 0.7)',
    fontFamily: FONT_SANS_MED,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  heading: {
    fontSize: 26,
    color: '#C8846A',
    fontFamily: FONT_SANS,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.3,
    lineHeight: 34,
    maxWidth: 300,
    marginBottom: 48,
  },
  envColumn: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    gap: 48,
  },
  envWrap: {
    width: '100%',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    letterSpacing: 3,
    fontFamily: FONT_SANS_MED,
    fontWeight: '700',
    marginBottom: 18,
  },
  envBody: {
    width: '100%',
    aspectRatio: ENV_W / ENV_H,
    position: 'relative',
    borderRadius: 4,
    overflow: 'hidden',
  },
  flap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    aspectRatio: ENV_W / FLAP_H,
  },
  seal: {
    position: 'absolute',
    top: '24%',
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'rgba(255,248,235,0.9)',
    fontSize: 10,
    letterSpacing: 2,
    fontFamily: FONT_SANS_MED,
    fontWeight: '700',
  },
  paper: {
    width: '100%',
    backgroundColor: '#fffdfa',
    borderRadius: 4,
    marginTop: 14,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 24,
  },
  dear: {
    fontSize: 16,
    color: '#6b3f20',
    fontFamily: FONT_MONO,
    fontWeight: '600',
    marginBottom: 14,
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 22,
    color: '#3d2e1e',
    fontFamily: FONT_MONO,
    marginBottom: 12,
  },
  sign: {
    fontSize: 14,
    color: '#5a3a20',
    fontFamily: FONT_MONO,
    fontWeight: '600',
    marginTop: 8,
  },
  tap: {
    marginTop: 14,
    fontSize: 10,
    letterSpacing: 3,
    fontFamily: FONT_SANS_MED,
    fontWeight: '600',
  },
  divider: {
    width: 96,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginTop: 64,
    marginBottom: 28,
  },
  footerQuote: {
    fontSize: 14,
    fontFamily: FONT_SERIF,
    fontStyle: 'italic',
    color: '#777',
    letterSpacing: 1.5,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});
