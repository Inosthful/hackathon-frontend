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
    class="month-view bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-5 sm:p-8 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/40 transition-all duration-300"
  >
    <!-- En-têtes des jours -->
    <div class="grid grid-cols-7 gap-2 mb-4">
      <div
        v-for="day in ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']"
        :key="day"
        class="text-center text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide"
      >
        {{ day }}
      </div>
    </div>

    <!-- Grille du calendrier -->
    <div class="grid grid-cols-7 gap-2">
      <template v-for="(day, index) in monthDays" :key="index">
        <!-- Jour vide -->
        <div v-if="!day" class="aspect-square"></div>

        <!-- Jour -->
        <div
          v-else
          @click="selectDay(day.date)"
          :class="[
            'cursor-pointer transition-all duration-300 ease-out',
            'rounded-2xl aspect-square flex flex-col items-center justify-center',
            'border shadow-md hover:shadow-lg',
            'bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm',
            'hover:scale-105 active:scale-95',
            isToday(day.date) && 'ring-2 ring-[#8FD9D6]/50 border-[#8FD9D6]',
            selectedDate === day.date &&
              'ring-2 ring-[#B2E0B4]/60 border-[#B2E0B4]',
            !isToday(day.date) &&
              !selectedDate &&
              'border-gray-200 dark:border-gray-600',
          ]"
          :style="{
            borderColor:
              day.mood && !isToday(day.date)
                ? MOOD_COLORS[day.mood.mood]
                : undefined,
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
