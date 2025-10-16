<script setup lang="ts">
import type { MoodEntry } from '@/types/mood'
import { MOOD_EMOJIS, MOOD_COLORS } from '@/types/mood'

interface WeekDay {
  date: string
  dayName: string
  mood: MoodEntry | null
}

interface Props {
  weekDays: WeekDay[]
  selectedDate?: string
}

interface Emits {
  (e: 'selectDate', date: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const isToday = (dateStr: string) => {
  const today = new Date().toISOString().split('T')[0]
  return dateStr === today
}

const selectDay = (date: string) => {
  emit('selectDate', date)
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.getDate()
}
</script>

<template>
  <div class="week-view">
    <h3 class="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 text-center text-gray-800 dark:text-gray-200">
      Ma semaine
    </h3>
    <div class="grid grid-cols-7 gap-1 sm:gap-2 md:gap-3 lg:gap-4">
      <div
        v-for="day in weekDays"
        :key="day.date"
        @click="selectDay(day.date)"
        :class="[
          'day-card',
          'cursor-pointer transition-all duration-300',
          'p-1 sm:p-2 md:p-3 lg:p-4 rounded-lg sm:rounded-xl text-center',
          'bg-white dark:bg-gray-800 shadow-md hover:shadow-lg',
          'border-2',
          isToday(day.date) && 'border-blue-500 ring-1 sm:ring-2 ring-blue-300',
          selectedDate === day.date && 'ring-2 sm:ring-4 ring-purple-300',
          !isToday(day.date) && !day.mood && 'border-gray-200 dark:border-gray-700',
        ]"
        :style="{
          borderColor: day.mood && !isToday(day.date) ? MOOD_COLORS[day.mood.mood] : undefined
        }"
      >
        <div class="text-[0.6rem] sm:text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">
          {{ day.dayName }}
        </div>
        <div class="text-sm sm:text-base md:text-lg font-bold text-gray-800 dark:text-gray-200 mb-1 sm:mb-2">
          {{ formatDate(day.date) }}
        </div>
        <div class="text-2xl sm:text-3xl md:text-4xl">
          {{ day.mood ? MOOD_EMOJIS[day.mood.mood] : '—' }}
        </div>
        <div
          v-if="day.mood"
          class="text-[0.6rem] sm:text-xs mt-1 sm:mt-2 font-medium"
          :style="{ color: MOOD_COLORS[day.mood.mood] }"
        >
          {{ day.mood.mood }}
        </div>
      </div>
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
