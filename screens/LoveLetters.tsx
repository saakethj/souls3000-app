import React, { useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    ScrollView,
} from "react-native";
import { COLORS } from "../lib/constants";

const LETTERS = [
    {
        id: "boo",
        label: "from momo",
        labelColor: "#C8846A",
        envColor: "#c8956a",
        envShadow: "#a06840",
        sealText: "sealed with love ♡",
        dearName: "Dear Bangaram,",
        sign: "— Your Momo ♡",
        signAlign: "right" as const,
        body: [
            "If I were ever given the chance to be a flower, I would pray to God to give me the beauty of a rose 🌹, the warmth of a sunflower 🌻, the grace of an orchid 🌸, the gentle care of a tulip 🌷, the pure innocence of a Lotus 🪷, and the delicate charm of a ranunculus.",
            "Because only then might I become something soft enough to rest in the hands of a girl as kind, sensitive, beautiful, loving, and intelligent as you.",
            "And even if I were blessed with all these qualities woven together in one flower, I know it still would not truly equal the wonderful person you are.",
            "So until such a miracle exists, here is a small bouquet for you. 💐",
        ],
    },
    {
        id: "bangaram",
        label: "from bangaram",
        labelColor: "#b08060",
        envColor: "#b87848",
        envShadow: "#a06840",
        sealText: "keep this in your heart",
        dearName: "Dear Boo,",
        sign: "— Bangaram ♡",
        signAlign: "left" as const,
        body: [
            "Your plane leaves in the morning. Soon you leave to your world where I won't be, and I wish I could go with you — but your journey isn't mine.",
            "The world would soon apart us. As I learnt to live without you, but the urge to spend every moment with you.",
            "And this distance keeps me by the door — shouldn't interfere with you wanting more. I'm here, just in another direction.",
            "When your plane lands on the runway, keep this song inside your heart. When the road goes only one way — keep this song in your heart.",
            "I'll be with you all along, inside your heart.",
        ],
    },
];

function Envelope({ letter }: { letter: typeof LETTERS[0] }) {
    const [open, setOpen] = useState(false);
    const heightAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    function toggle() {
        if (!open) {
            setOpen(true);
            Animated.parallel([
                Animated.timing(heightAnim, { toValue: 1, duration: 500, useNativeDriver: false }),
                Animated.timing(opacityAnim, { toValue: 1, duration: 500, useNativeDriver: false }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(heightAnim, { toValue: 0, duration: 400, useNativeDriver: false }),
                Animated.timing(opacityAnim, { toValue: 0, duration: 300, useNativeDriver: false }),
            ]).start(() => setOpen(false));
        }
    }

    const maxHeight = heightAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 600],
    });

    return (
        <View style={styles.envelopeWrapper}>
            <Text style={[styles.label, { color: letter.labelColor }]}>{letter.label}</Text>

            <TouchableOpacity onPress={toggle} activeOpacity={0.85}>
                <View style={[styles.envelope, { backgroundColor: letter.envColor }]}>

                    {/* Top flap — V shape pointing down */}
                    <View style={styles.flapTop}>
                        <View style={[styles.flapLeft, { borderTopColor: letter.envShadow }]} />
                        <View style={[styles.flapRight, { borderTopColor: letter.envShadow }]} />
                    </View>

                    {/* Center content */}
                    <View style={styles.envCenter}>
                        <Text style={styles.sealText}>{letter.sealText}</Text>
                        <Text style={styles.tapHint}>{open ? "tap to close ↑" : "tap to open ↓"}</Text>
                    </View>

                    {/* Bottom flap — triangle pointing up */}
                    <View style={styles.flapBottom}>
                        <View style={[styles.flapBottomLeft, { borderBottomColor: letter.envShadow }]} />
                        <View style={[styles.flapBottomRight, { borderBottomColor: letter.envShadow }]} />
                    </View>

                </View>
            </TouchableOpacity>

            <Animated.View style={[styles.letterPaper, { maxHeight, opacity: opacityAnim }]}>
                <Text style={styles.dearName}>{letter.dearName}</Text>
                {letter.body.map((para, i) => (
                    <Text key={i} style={styles.bodyText}>{para}</Text>
                ))}
                <Text style={[styles.sign, { textAlign: letter.signAlign }]}>{letter.sign}</Text>
            </Animated.View>
        </View>
    );
}

export default function LoveLetters() {
    return (
        <View style={styles.container}>
            {/* Header */}
            <Text style={styles.eyebrow}>Feelings expressed in Letters</Text>
            <Text style={styles.heading}>— Words he wrote to her, and she for him —</Text>

            {/* Two envelopes stacked */}
            {LETTERS.map((letter) => (
                <Envelope key={letter.id} letter={letter} />
            ))}

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.footerLine} />
                <Text style={styles.footerQuote}>
                    "These letters tell how deeply in love people can be."
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#000",
        paddingHorizontal: 24,
        paddingVertical: 48,
    },
    eyebrow: {
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 4,
        textTransform: "uppercase",
        color: "#666",
        textAlign: "center",
        marginBottom: 12,
    },
    heading: {
        fontSize: 20,
        fontWeight: "300",
        color: COLORS.primary,
        textAlign: "center",
        marginBottom: 40,
        fontStyle: "italic",
    },
    envelopeWrapper: {
        marginBottom: 32,
    },
    label: {
        fontSize: 9,
        fontWeight: "700",
        letterSpacing: 4,
        textTransform: "uppercase",
        marginBottom: 10,
        textAlign: "center",
    },
    envelope: {
        height: 160,
        borderRadius: 4,
        overflow: "hidden",
        justifyContent: "center",
        position: "relative",
    },
    flapTop: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        height: 80,
    },
    flapLeft: {
        flex: 1,
        borderTopWidth: 80,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderTopColor: "transparent",
        borderStyle: "solid",
        // left half of V — slopes down-right
        borderRightColor: "transparent",
    },
    flapRight: {
        flex: 1,
        borderTopWidth: 80,
        borderTopColor: "transparent",
        borderStyle: "solid",
        borderLeftColor: "transparent",
    },
    flapBottom: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        height: 70,
    },
    flapBottomLeft: {
        flex: 1,
        borderBottomWidth: 70,
        borderBottomColor: "transparent",
        borderRightColor: "transparent",
        borderStyle: "solid",
    },
    flapBottomRight: {
        flex: 1,
        borderBottomWidth: 70,
        borderBottomColor: "transparent",
        borderLeftColor: "transparent",
        borderStyle: "solid",
    },
    envCenter: {
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2,
        paddingVertical: 16,
    },
    flapRow: {
        alignItems: "center",
        marginBottom: 8,
    },
    flapTriangle: {
        width: 0,
        height: 0,
        borderLeftWidth: 30,
        borderRightWidth: 30,
        borderBottomWidth: 20,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        opacity: 0.5,
    },
    sealText: {
        fontSize: 10,
        letterSpacing: 2,
        color: "rgba(255,248,235,0.85)",
        textTransform: "uppercase",
        marginBottom: 8,
    },
    tapHint: {
        fontSize: 10,
        color: "rgba(255,255,255,0.5)",
        letterSpacing: 1,
    },
    letterPaper: {
        backgroundColor: "#fffdfa",
        borderRadius: 4,
        padding: 20,
        marginTop: 8,
        overflow: "hidden",
    },
    dearName: {
        fontSize: 16,
        color: "#6b3f20",
        fontWeight: "600",
        fontFamily: "monospace",
        marginBottom: 14,
    },
    bodyText: {
        fontSize: 13,
        color: "#3d2e1e",
        lineHeight: 24,
        fontFamily: "monospace",
        marginBottom: 10,
    },
    sign: {
        marginTop: 12,
        fontSize: 14,
        color: "#5a3a20",
        fontWeight: "600",
        fontFamily: "monospace",
    },
    footer: {
        marginTop: 24,
        alignItems: "center",
    },
    footerLine: {
        width: 80,
        height: 1,
        backgroundColor: "rgba(255,255,255,0.08)",
        marginBottom: 20,
    },
    footerQuote: {
        fontSize: 13,
        fontStyle: "italic",
        color: "#777",
        textAlign: "center",
        letterSpacing: 1,
        lineHeight: 22,
    },
});