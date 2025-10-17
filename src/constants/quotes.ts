
import type { MoodType } from '@/types/mood'

export const MOOD_QUOTES: Record<MoodType, string[]> = {
  happy: [
    "Continue à rayonner ! Ton bonheur illumine ta journée. ✨",
    "Quelle belle énergie ! Profite de chaque instant de joie. 🌟",
    "Ta bonne humeur est contagieuse ! Garde ce sourire. 😊",
    "C'est magnifique de te voir si heureux ! Savoure ce moment. 🎉",
    "Tu es une source d'inspiration quand tu es si joyeux ! 💫"
  ],
  good: [
    "Continue sur cette belle lancée ! Tu es sur la bonne voie. 👍",
    "Une journée positive en perspective ! Garde cette énergie. 🌈",
    "Tu te sens bien, et ça se voit ! Continue comme ça. 💪",
    "Profite de cette sérénité, tu le mérites. ☀️",
    "Ton équilibre intérieur te mène vers de belles choses. 🌸"
  ],
  neutral: [
    "Chaque journée est une nouvelle opportunité. Reste ouvert. 🌿",
    "L'équilibre est aussi une force. Prends ton temps. ⚖️",
    "Parfois, la neutralité permet de mieux voir les choses. 🧘",
    "C'est OK de ne pas être au top. Sois bienveillant avec toi. 💙",
    "Demain est un nouveau jour plein de possibilités. 🌅"
  ],
  sad: [
    "Les jours difficiles ne durent pas éternellement. Tu es fort. 💜",
    "Prends soin de toi, tu mérites toute la douceur du monde. 🤗",
    "Chaque nuage finit par passer. Le soleil reviendra. 🌤️",
    "Ta tristesse est valide. Accorde-toi de la compassion. 💖",
    "Demain est une page blanche. Garde espoir. 🌺"
  ],
  angry: [
    "Ta colère est légitime. Prends le temps de respirer. 🌊",
    "Chaque tempête finit par s'apaiser. Tu vas y arriver. 🍃",
    "Transforme cette énergie en force positive. Tu en es capable. 💪",
    "Il est OK de ressentir de la colère. Accueille cette émotion. 🔥",
    "Prends un moment pour toi. Tu mérites la paix intérieure. 🕊️"
  ]
}

export const getRandomQuote = (mood: MoodType): string => {
  const quotes = MOOD_QUOTES[mood]
  const randomIndex = Math.floor(Math.random() * quotes.length)
  return quotes[randomIndex]
}
