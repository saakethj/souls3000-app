import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { COLORS, SENTENCES } from "../lib/constants";

const { width, height } = Dimensions.get("window");

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function EntryScreen({ navigation }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  const animateIn = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateOut = (onDone: () => void) => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(onDone);
  };

  const resetAnim = () => {
    opacity.setValue(0);
    translateY.setValue(24);
  };

  useEffect(() => {
    resetAnim();
    animateIn();

    const hold = setTimeout(() => {
      animateOut(() => {
        const next = currentIndex + 1;
        if (next < SENTENCES.length) {
          setCurrentIndex(next);
        } else {
          // All phrases done — navigate to Home
          navigation.replace("Home");
        }
      });
    }, 2800);

    return () => clearTimeout(hold);
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      {/* Subtle top line accent */}
      <View style={styles.topLine} />

      {/* Phrase counter dots */}
      <View style={styles.dots}>
        {SENTENCES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === currentIndex && styles.dotActive,
              i < currentIndex && styles.dotPast,
            ]}
          />
        ))}
      </View>

      {/* Main sentence */}
      <Animated.View
        style={[
          styles.textContainer,
          { opacity, transform: [{ translateY }] },
        ]}
      >
        <Text style={styles.eyebrow}>SOULS3000</Text>
        <Text style={styles.sentence}>{SENTENCES[currentIndex]}</Text>
      </Animated.View>

      {/* Bottom signature */}
      <View style={styles.bottom}>
        <Text style={styles.signature}>— K ♡ J</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  topLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.primary,
    opacity: 0.6,
  },
  dots: {
    position: "absolute",
    top: 64,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    width: 20,
    backgroundColor: COLORS.primary,
  },
  dotPast: {
    backgroundColor: COLORS.muted,
    opacity: 0.4,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 8,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 6,
    color: COLORS.primary,
    opacity: 0.7,
    marginBottom: 28,
    textTransform: "uppercase",
  },
  sentence: {
    fontSize: 22,
    fontWeight: "300",
    color: COLORS.white,
    textAlign: "center",
    lineHeight: 36,
    letterSpacing: 0.3,
  },
  bottom: {
    position: "absolute",
    bottom: 52,
  },
  signature: {
    fontSize: 13,
    color: COLORS.muted,
    letterSpacing: 3,
    fontStyle: "italic",
  },
});