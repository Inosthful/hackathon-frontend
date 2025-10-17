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
      'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-2xl',
      'border-3',
      isToday && 'border-[#A5D6A7] ring-4 ring-[#A5D6A7]/30',
      selectedDate === day.date && 'ring-4 ring-[#80CBC4]/50',
      !isToday && !day.mood && 'border-gray-200 dark:border-gray-700',
    ]"
    :style="{
      borderColor: day.mood && !isToday ? MOOD_COLORS[day.mood.mood] : undefined,
      borderWidth: '3px'
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