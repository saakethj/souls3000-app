export const COLORS = {
  bg: "#0d0d0d",
  primary: "#C8846A",
  gold: "#E8C99A",
  white: "#f5f0eb",
  muted: "#888",
  faint: "#1a1a1a",
  border: "#2a2a2a",
  notebookBg: "#fdfaf2",
  notebookTop: "#f5f0e4",
  notebookLine: "#e4d8c4",
  notebookText: "#5a3010",
  notebookBody: "#6a4a28",
  coverBg: "#2a1808",
};

export const SENTENCES = [
  "No matter how much I give, it never quite feels like enough..",
  "I put my soul into every detail of this page, with you in every thought.",
  "Hope you like what's inside ♡",
];

// Supabase storage paths — no BASE_URL needed anymore
export const SPREADS = [
  {
    id: 1,
    left: { src: "images/SL_Intro_1.jpg", caption: "This is just the beginning", rotation: -4 },
    right: { heading: "Hey Potti.", body: "A man's gotta try, right? I'm definitely not the creative genius in this relationship, but I built this with all the love I have. While you read this, I'm sitting right here blushing—mostly because I'm wondering what you'll think about everything that lies ahead in these pages\n\nIt is not over yet, turn to next page ':)" },
  },
  {
    id: 2,
    left: { src: "images/SL_Intro_2.JPG", caption: "Nothing beats this crazy-kind, happy, smiling face of yours.", rotation: 3 },
    right: { heading: "Surprise, Surprise", body: "I know, I know—you're curious to see what I've actually hidden inside. Just hold onto that excitement for a little longer; our world is still crafting its magic. You'll find out everything soon.\n\nBy the way, maintain that smile like you always do" },
  },
  {
    id: 3,
    left: { src: "images/SL_Intro_3.jpg", caption: "Feeling which I can't express", rotation: -2 },
    right: { heading: "Feeling Butterflies", body: "You once asked what those 'butterflies' actually feel like. For me, it's the rush of seeing you after being apart, the way your words hit straight to the heart, and the simple joy in everything you do. Yeah, I know I'm being incredibly cheesy—but I felt it even while doing this\n\nIt's not over yet....\n\nI sound too cringe" },
  },
  {
    id: 4,
    left: { src: "images/SL_Intro_4.jpg", caption: "Thanks for existing pretty girl. You always steal the show", rotation: 4 },
    right: { heading: "Why Project Orange?", body: "Written in these walls are stories that I can't explain.' That lyric is exactly why this exists. This is our place, our story, and our shared moments—a digital sanctuary for our so-called happy place.\n\nIt's almost time, yes you have to listen to my voice below", hasAudio: true },
  },
  {
    id: 5,
    left: { src: "images/SL_Intro_5.jpg", caption: "Almost there...", rotation: -3 },
    right: { heading: "One last thing.", body: "Before you step in — Enter cute password.", isPassword: true, hint: "💭 Hint : MyNickName + YourNickName@3000" },
  },
];

export const PASSWORD = "momopotti@3000";
export const AUDIO_SRC = "audio/ProjectOrange.mp3";

export const WRONG_RESPONSES = [
  "That's not it... nice try though 🙈",
  "Hmm. Wrong answer. Think harder 💭",
  "Nope! Not even close 😄",
  "Are you sure you know me? 🤨",
  "Wrong! But points for trying 💛",
];