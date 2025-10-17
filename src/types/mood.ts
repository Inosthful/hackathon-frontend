// Types pour MoodFlow+

export type MoodType = 'happy' | 'good' | 'neutral' | 'sad' | 'angry'

export interface MoodEntry {
  id?: number
  date: string
  mood: MoodType
  note?: string
  intensity?: number
  beginAt?: string
  endAt?: string
}

export interface MoodStats {
  averageMood: number
  mostFrequentMood: MoodType
  totalEntries: number
  weekTrend: 'up' | 'down' | 'stable'
  moodDistribution: Record<MoodType, number>
}

export interface WeatherData {
  temperature: number
  condition: string
  icon: string
}

export const MOOD_EMOJIS: Record<MoodType, string> = {
  happy: '😄',
  good: '🙂',
  neutral: '😐',
  sad: '😢',
  angry: '😠'
}

export const MOOD_COLORS: Record<MoodType, string> = {
  happy: '#FFD93D',
  good: '#6BCB77',
  neutral: '#4D96FF',
  sad: '#9B9B9B',
  angry: '#FF6B6B'
}

export const MOOD_LABELS: Record<MoodType, string> = {
  happy: 'Très content',
  good: 'Bien',
  neutral: 'Neutre',
  sad: 'Triste',
  angry: 'En colère'
}
