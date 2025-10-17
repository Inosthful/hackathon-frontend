<script setup lang="ts">
import type { MoodEntry } from '@/types/mood'
import DayCard from './DayCard.vue'

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
  const toISODateString = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return dateStr === toISODateString(new Date())
}

const selectDay = (date: string) => {
  emit('selectDate', date)
}
</script>

<template>
  <div class="week-view">
    <div class="sm:hidden flex flex-col items-center space-y-2">
      <div class="grid grid-cols-4 gap-2 w-full">
        <DayCard
          v-for="day in weekDays.slice(0, 4)"
          :key="day.date"
          :day="day"
          :selectedDate="selectedDate"
          :isToday="isToday(day.date)"
          @click="selectDay(day.date)"
        />
      </div>
      <div class="grid grid-cols-3 gap-2 w-3/4">
        <DayCard
          v-for="day in weekDays.slice(4, 7)"
          :key="day.date"
          :day="day"
          :selectedDate="selectedDate"
          :isToday="isToday(day.date)"
          @click="selectDay(day.date)"
        />
      </div>
    </div>

    <div class="hidden sm:grid grid-cols-7 gap-1 sm:gap-2 md:gap-3 lg:gap-4">
      <DayCard
        v-for="day in weekDays"
        :key="day.date"
        :day="day"
        :selectedDate="selectedDate"
        :isToday="isToday(day.date)"
        @click="selectDay(day.date)"
      />
    </div>
  </div>
</template>