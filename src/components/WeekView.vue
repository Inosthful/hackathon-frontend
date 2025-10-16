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
    <h3 class="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
      Ma semaine
    </h3>
    <div class="grid grid-cols-7 gap-2 md:gap-4">
      <div
        v-for="day in weekDays"
        :key="day.date"
        @click="selectDay(day.date)"
        :class="[
          'day-card',
          'cursor-pointer transition-all duration-300',
          'p-4 rounded-xl text-center',
          'bg-white dark:bg-gray-800 shadow-md hover:shadow-lg',
          'border-2',
          isToday(day.date) && 'border-blue-500 ring-2 ring-blue-300',
          selectedDate === day.date && 'ring-4 ring-purple-300',
          !isToday(day.date) && !day.mood && 'border-gray-200 dark:border-gray-700',
        ]"
        :style="{
          borderColor: day.mood && !isToday(day.date) ? MOOD_COLORS[day.mood.mood] : undefined
        }"
      >
        <div class="text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-2">
          {{ day.dayName }}
        </div>
        <div class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
          {{ formatDate(day.date) }}
        </div>
        <div class="text-4xl">
          {{ day.mood ? MOOD_EMOJIS[day.mood.mood] : '—' }}
        </div>
        <div
          v-if="day.mood"
          class="text-xs mt-2 font-medium"
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
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.day-card:hover {
  transform: translateY(-4px);
}

.day-card:active {
  transform: translateY(-2px);
}
</style>
