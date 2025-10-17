<script setup lang="ts">
import type { MoodEntry } from "@/types/mood";
import { MOOD_COLORS, MOOD_EMOJIS } from "@/types/mood";

interface MonthDay {
  date: string;
  dayName: string;
  mood: MoodEntry | null;
}

interface Props {
  monthDays: (MonthDay | null)[];
  selectedDate?: string;
}

interface Emits {
  (e: "selectDate", date: string): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const toISODateString = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isToday = (dateStr: string) => dateStr === toISODateString(new Date());

const selectDay = (date: string) => emit("selectDate", date);
</script>

<template>
  <div
    class="month-view bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-5 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200/30 dark:border-gray-700/30 transition-all duration-300"
  >
    <div class="grid grid-cols-7 gap-2 mb-4">
      <div
        v-for="day in ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']"
        :key="day"
        class="text-center text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide"
      >
        {{ day }}
      </div>
    </div>

    <div class="grid grid-cols-7 gap-2">
      <template v-for="(day, index) in monthDays" :key="index">
        <div v-if="!day" class="aspect-square"></div>

        <div
          v-else
          @click="selectDay(day.date)"
          class="cursor-pointer transition-all duration-300 ease-out rounded-2xl aspect-square flex flex-col items-center justify-center shadow-[0_4px_15px_rgb(0,0,0,0.08)] hover:shadow-[0_6px_20px_rgb(0,0,0,0.12)] bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm hover:scale-105 active:scale-95"
          :style="{
            border: selectedDate === day.date
              ? `3px solid ${day.mood ? MOOD_COLORS[day.mood.mood] : '#B2E0B4'}`
              : day.mood
              ? `3px solid ${MOOD_COLORS[day.mood.mood]}`
              : '3px solid transparent',
            boxShadow: selectedDate === day.date
              ? `0 0 15px ${day.mood ? MOOD_COLORS[day.mood.mood] : '#B2E0B4'}66`
              : undefined
          }"
        >
          <div
            class="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1"
          >
            {{ new Date(day.date).getDate() }}
          </div>
          <div class="text-lg sm:text-2xl md:text-3xl">
            {{ day.mood ? MOOD_EMOJIS[day.mood.mood] : "—" }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.month-view {
  animation: fadeIn 0.6s ease-out;
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
