<script setup lang="ts">
import type { MoodEntry } from '@/types/mood'
import { MOOD_EMOJIS, MOOD_COLORS } from '@/types/mood'

interface WeekDay {
  date: string
  dayName: string
  mood: MoodEntry | null
}

interface Props {
  day: WeekDay
  selectedDate?: string
  isToday: boolean
}

defineProps<Props>()

</script>

<template>
  <div
    :class="[
      'day-card',
      'cursor-pointer transition-all duration-300',
      'p-3 sm:p-4 md:p-5 rounded-3xl text-center',
      'bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.18)]',
    ]"
    :style="{
      border: day.mood
        ? `3px solid ${MOOD_COLORS[day.mood.mood]}`
        : isToday
        ? '3px solid #A5D6A7'
        : '3px solid transparent',
      boxShadow: selectedDate === day.date
        ? `0 0 20px ${day.mood ? MOOD_COLORS[day.mood.mood] : '#A5D6A7'}80`
        : undefined
    }"
  >
    <div class="text-[0.65rem] sm:text-xs md:text-sm font-bold uppercase text-gray-500 dark:text-gray-400 mb-1 sm:mb-2">
      {{ day.dayName }}
    </div>
    <div class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2 sm:mb-3">
      {{ new Date(day.date).getDate() }}
    </div>
    <div class="text-4xl sm:text-5xl md:text-6xl">
      {{ day.mood ? MOOD_EMOJIS[day.mood.mood] : '—' }}
    </div>
    <div
      v-if="day.mood"
      class="text-[0.65rem] sm:text-xs md:text-sm mt-2 font-bold"
      :style="{ color: MOOD_COLORS[day.mood.mood] }"
    >
      {{ day.mood.mood }}
    </div>
  </div>
</template>

<style scoped>
.day-card {
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

@media (min-width: 640px) {
  .day-card {
    min-height: 100px;
  }
}

@media (min-width: 768px) {
  .day-card {
    min-height: 120px;
  }
}

.day-card:hover {
  transform: translateY(-2px);
}

@media (min-width: 768px) {
  .day-card:hover {
    transform: translateY(-4px);
  }
}

.day-card:active {
  transform: translateY(-1px);
}

@media (min-width: 768px) {
  .day-card:active {
    transform: translateY(-2px);
  }
}
</style>