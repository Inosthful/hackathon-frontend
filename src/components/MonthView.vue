<script setup lang="ts">
import type { MoodEntry } from '@/types/mood'
import { MOOD_EMOJIS, MOOD_COLORS } from '@/types/mood'

interface MonthDay {
  date: string
  dayName: string
  mood: MoodEntry | null
}

interface Props {
  monthDays: (MonthDay | null)[]
  selectedDate?: string
}

interface Emits {
  (e: 'selectDate', date: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const toISODateString = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const isToday = (dateStr: string) => {
  return dateStr === toISODateString(new Date())
}

const selectDay = (date: string) => {
  emit('selectDate', date)
}
</script>

<template>
  <div class="month-view bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-xl">
    <!-- En-têtes des jours de la semaine -->
    <div class="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4">
      <div
        v-for="day in ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']"
        :key="day"
        class="text-center text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase py-2"
      >
        {{ day }}
      </div>
    </div>

    <!-- Grille du calendrier -->
    <div class="grid grid-cols-7 gap-1 sm:gap-2">
      <template v-for="(day, index) in monthDays" :key="index">
        <!-- Jour vide (alignement) -->
        <div v-if="!day" class="aspect-square"></div>

        <!-- Jour avec données -->
        <div
          v-else
          @click="selectDay(day.date)"
          :class="[
            'month-day-card',
            'cursor-pointer transition-all duration-300',
            'p-2 sm:p-3 rounded-lg text-center',
            'bg-white dark:bg-gray-700 shadow-md hover:shadow-lg',
            'border-2',
            'aspect-square flex flex-col items-center justify-center',
            isToday(day.date) && 'border-blue-500 ring-1 sm:ring-2 ring-blue-300',
            selectedDate === day.date && 'ring-2 sm:ring-4 ring-purple-300',
            !isToday(day.date) && !day.mood && 'border-gray-200 dark:border-gray-600',
          ]"
          :style="{
            borderColor: day.mood && !isToday(day.date) ? MOOD_COLORS[day.mood.mood] : undefined
          }"
        >
          <div class="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">
            {{ new Date(day.date).getDate() }}
          </div>
          <div class="text-lg sm:text-2xl md:text-3xl">
            {{ day.mood ? MOOD_EMOJIS[day.mood.mood] : '—' }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.month-day-card:hover {
  transform: scale(1.05);
}

.month-day-card:active {
  transform: scale(0.98);
}

/* Animation d'apparition */
.month-view {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
