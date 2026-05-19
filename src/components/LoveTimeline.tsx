import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Animated,
  Dimensions,
  LayoutChangeEvent,
} from 'react-native';

const FONT_SANS = Platform.select({ ios: 'System', android: 'Roboto', default: 'System' });
const FONT_SANS_MED = Platform.select({ ios: 'System', android: 'Roboto-Medium', default: 'System' });
const FONT_SERIF = Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' });

const SCREEN_H = Dimensions.get('window').height;

const SPINE_X = 28;
const DOT_SIZE = 36;
const CARD_LEFT = 64;

type Item = {
  id: number;
  period: string;
  icon: string;
  tag: string;
  title: string;
  body: string;
  accent: string;
};

// To add a new milestone: append an object to this array.
// Order is oldest → newest. Each entry is one card on the timeline.
const TIMELINE: Item[] = [
  {
    id: 1,
    period: 'November 25, 2019',
    icon: '🌷',
    tag: 'the beginning',
    title: 'First IRL Meet',
    body: "It was the first time we ever met in person: a cute, short girl who was both crazy and kind, and a boy who was enjoying his 20's and yes with crazy gang none of us knew our story would take a turn in few years.",
    accent: '#C8846A',
  },
  {
    id: 2,
    period: 'March 11, 2021',
    icon: '💬',
    tag: 'the spark',
    title: 'One Pickup Line',
    body: "The peak of our flirt era. We were just two people trading cheesy pickup lines until you dropped that unforgettable one. It's been years, but that pickup line will be remembered forever.",
    accent: '#d8956a',
  },
  {
    id: 3,
    period: 'September 11, 2021',
    icon: '🌸',
    tag: 'the bloom',
    title: 'Friendship Turned Into Love',
    body: 'From online chats and late-night calls to real date and frequent meet ups it all led to this. The moment we finally met in person, we both knew the truth: that single embrace was the start of a whole new chapter for us.',
    accent: '#C8846A',
  },
  {
    id: 4,
    period: 'April 15, 2022',
    icon: '🌹',
    tag: 'ILY 3000',
    title: 'Petels & Proposals',
    body: 'Perfect dates, late-night rides, and hours of deep conversation all seemed to happen in the blink of an eye. We were completely lost in each other\'s company—and then, that one special moment happened (Clock Tower).',
    accent: '#b87848',
  },
  {
    id: 5,
    period: 'September 11, 2023',
    icon: '✨',
    tag: 'Two souls, Two Years',
    title: '2 years of Magic',
    body: 'Our two-year anniversary, and the first we truly spent side-by-side. A day filled with laughter and love, forever etched into the foundation of our story',
    accent: '#a06840',
  },
  {
    id: 6,
    period: 'January 24, 2024',
    icon: '✈️',
    tag: 'Travel',
    title: 'Mumbai Diaries',
    body: 'The same love and joy, now colored by the spirit of Mumbai. From seashore talks and local train rides to watching DDLJ at Maratha Mandir—every hour was a treasure because we spent it together. A beautiful chapter in our tiny travel diaries.',
    accent: '#C8846A',
  },
  {
    id: 7,
    period: '2025',
    icon: '♾️',
    tag: 'Months of memories',
    title: 'Period of Unlimited Moments',
    body: 'It was a year where a single date could never suffice, for it was overflowing with endless meetups and the quiet weight of a sad phase. Between a career shift and the months of waiting that tested their resolve, there was a complete change of scenery. It was a rollercoaster of extremes—moments where they cried as hard as they laughed.',
    accent: '#E8C99A',
  },
  {
    id: 8,
    period: '2026 →',
    icon: '⭐',
    tag: 'Still going',
    title: 'Memories in the Making',
    body: 'It has been a good journey so far, despite a few hiccups here and there. The meetups became casual, filled with calls and online dates; they became more mature, yet still kept the kid in them alive. They dwelled deeper into responsibility and career growth, but it remains to be seen what 2026 holds for them.',
    accent: '#E8C99A',
  },
];

function TimelineCard({
  item,
  isLeft,
  scrollY,
  sectionY,
}: {
  item: Item;
  isLeft: boolean;
  scrollY: Animated.Value;
  sectionY: number;
}) {
  const [cardY, setCardY] = useState<number | null>(null);

  const onLayout = (e: LayoutChangeEvent) => {
    setCardY(e.nativeEvent.layout.y);
  };

  const absoluteY = sectionY + (cardY ?? 0);
  const start = absoluteY - SCREEN_H * 0.95;
  const end = absoluteY - SCREEN_H * 0.55;
  const safeEnd = end <= start ? start + 1 : end;

  const opacity = scrollY.interpolate({
    inputRange: [start, safeEnd],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const translateX = scrollY.interpolate({
    inputRange: [start, safeEnd],
    outputRange: [isLeft ? -32 : 32, 0],
    extrapolate: 'clamp',
  });

  return (
    <View onLayout={onLayout} style={styles.row}>
      <View style={[styles.dot, { borderColor: item.accent }]}>
        <Text style={[styles.dotIcon, { color: item.accent }]}>{item.icon}</Text>
      </View>

      <Animated.View
        style={[
          styles.card,
          {
            opacity: cardY == null ? 0 : opacity,
            transform: [{ translateX: cardY == null ? (isLeft ? -32 : 32) : translateX }],
          },
        ]}
      >
        <View style={styles.metaRow}>
          <Text style={[styles.period, { color: item.accent }]}>
            {item.period.toUpperCase()}
          </Text>
          <View
            style={[
              styles.tagPill,
              {
                borderColor: item.accent + '66',
                backgroundColor: item.accent + '1F',
              },
            ]}
          >
            <Text style={[styles.tagText, { color: item.accent }]}>
              {item.tag.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.title}>{item.title}</Text>
        <View style={[styles.rule, { backgroundColor: item.accent }]} />
        <Text style={styles.body}>{item.body}</Text>
      </Animated.View>
    </View>
  );
}

export default function LoveTimeline({ scrollY }: { scrollY: Animated.Value }) {
  const [sectionY, setSectionY] = useState(0);
  const sectionRef = useRef<View>(null);

  const onSectionLayout = (e: LayoutChangeEvent) => {
    setSectionY(e.nativeEvent.layout.y);
  };

  return (
    <View ref={sectionRef} onLayout={onSectionLayout} style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>THE STORY SO FAR</Text>
        <Text style={styles.heading}>— Our Wonderful Journey —</Text>
      </View>

      <View style={styles.timelineWrap}>
        <View style={styles.spine} />

        {TIMELINE.map((item, i) => (
          <TimelineCard
            key={item.id}
            item={item}
            isLeft={i % 2 === 0}
            scrollY={scrollY}
            sectionY={sectionY}
          />
        ))}

        <View style={styles.endCap}>
          <View style={styles.endCapLine} />
          <Text style={styles.endCapText}>still writing —</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 72,
  },
  header: {
    alignItems: 'center',
    marginBottom: 56,
    paddingHorizontal: 8,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 4,
    color: 'rgba(245, 233, 214, 0.7)',
    fontFamily: FONT_SANS_MED,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 14,
    textTransform: 'uppercase',
  },
  heading: {
    fontSize: 28,
    color: '#C8846A',
    fontFamily: FONT_SANS,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.3,
    lineHeight: 36,
    maxWidth: 280,
  },
  timelineWrap: {
    position: 'relative',
    width: '100%',
  },
  spine: {
    position: 'absolute',
    top: 12,
    bottom: 12,
    left: SPINE_X,
    width: 1,
    backgroundColor: '#2a2a2a',
  },
  row: {
    position: 'relative',
    paddingLeft: CARD_LEFT,
    marginBottom: 48,
    minHeight: DOT_SIZE,
  },
  dot: {
    position: 'absolute',
    left: SPINE_X - DOT_SIZE / 2,
    top: 4,
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    borderWidth: 1,
    backgroundColor: '#050505',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotIcon: {
    fontSize: 14,
    lineHeight: 16,
  },
  card: {
    width: '100%',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 6,
  },
  period: {
    fontSize: 11,
    letterSpacing: 2.4,
    fontFamily: FONT_SANS_MED,
    fontWeight: '700',
  },
  tagPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 9,
    letterSpacing: 1.8,
    fontFamily: FONT_SANS_MED,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    color: '#f0e0cc',
    fontFamily: FONT_SANS,
    fontWeight: '600',
    lineHeight: 28,
    marginTop: 6,
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  rule: {
    width: 32,
    height: 1,
    opacity: 0.6,
    marginBottom: 12,
  },
  body: {
    fontSize: 14,
    lineHeight: 24,
    color: '#888',
    fontFamily: FONT_SANS,
    letterSpacing: 0.1,
  },
  endCap: {
    alignItems: 'center',
    marginTop: 8,
  },
  endCapLine: {
    width: 1,
    height: 28,
    backgroundColor: '#2a2a2a',
  },
  endCapText: {
    fontFamily: FONT_SERIF,
    fontStyle: 'italic',
    fontSize: 14,
    color: '#E8C99A',
    opacity: 0.55,
    letterSpacing: 1.2,
    marginTop: 10,
    textAlign: 'center',
  },
});
