<script setup lang="ts">
import { useMoodData } from "@/composables/useMoodData";
import { computed, ref } from "vue";

const { currentDate, previousWeek, nextWeek, setWeek } = useMoodData();
const showCalendar = ref(false);

const weekRange = computed(() => {
  const start = new Date(currentDate.value);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  start.setDate(diff);
  const end = new Date(start);
  end.setDate(end.getDate() + 6); // Sunday

  const startMonth = start.toLocaleDateString("fr-FR", { month: "short" });
  const endMonth = end.toLocaleDateString("fr-FR", { month: "short" });

  if (startMonth === endMonth) {
    return `${start.getDate()} - ${end.getDate()} ${startMonth} ${start.getFullYear()}`;
  } else {
    return `${start.getDate()} ${startMonth} - ${end.getDate()} ${endMonth} ${end.getFullYear()}`;
  }
});

const calendarDays = computed(() => {
  const month = new Date(currentDate.value);
  month.setDate(1);
  const monthIndex = month.getMonth();
  const year = month.getFullYear();

  const firstDayOfMonth = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const days = [];
  // Add empty days for the first week
  for (let i = 0; i < (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1); i++) {
    days.push(null);
  }
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, monthIndex, i));
  }
  return days;
});

const selectDate = (date: Date | null) => {
  if (date) {
    setWeek(date);
    showCalendar.value = false;
  }
};

const isDateInCurrentWeek = (date: Date) => {
  const start = new Date(currentDate.value);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  start.setDate(diff);
  const end = new Date(start);
  end.setDate(end.getDate() + 6); // Sunday
  return (
    date.getFullYear() === start.getFullYear() &&
    date.getMonth() === start.getMonth() &&
    date.getDate() >= start.getDate() &&
    date.getDate() <= end.getDate()
  );
};
</script>

<template>
  <div
    class="week-selector bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-2 sm:p-4 rounded-3xl shadow-[0_6px_25px_rgb(0,0,0,0.1)] flex items-center justify-between"
  >
    <button
      @click="previousWeek"
      class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>

    <div class="relative">
      <button
        @click="showCalendar = !showCalendar"
        class="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 hover:bg-gradient-to-r hover:from-[#A5D6A7] hover:to-[#80CBC4] hover:bg-clip-text hover:text-transparent transition-colors text-center"
      >
        {{ weekRange }}
      </button>

      <transition name="fade">
        <div
          v-if="showCalendar"
          class="absolute z-50 mt-2 w-80 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.15)] border-2 border-gray-200/30 dark:border-gray-700/30 left-1/2 -translate-x-1/2"
        >
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-lg font-bold text-gray-900 dark:text-white">
              {{
                currentDate.toLocaleDateString("fr-FR", {
                  month: "long",
                  year: "numeric",
                })
              }}
            </h4>
            <div>
              <button
                @click="
                  currentDate.setMonth(currentDate.getMonth() - 1);
                  currentDate = new Date(currentDate);
                "
                class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                @click="
                  currentDate.setMonth(currentDate.getMonth() + 1);
                  currentDate = new Date(currentDate);
                "
                class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div
            class="grid grid-cols-7 text-center text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2"
          >
            <div
              v-for="day in ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di']"
              :key="day"
            >
              {{ day }}
            </div>
          </div>
          <div class="grid grid-cols-7 text-center gap-1">
            <template v-for="(day, index) in calendarDays">
              <div v-if="day" :key="index">
                <button
                  @click="selectDate(day)"
                  class="w-10 h-10 rounded-full text-sm transition-all duration-200"
                  :class="{
                    'bg-gradient-to-r from-[#A5D6A7] to-[#80CBC4] text-white font-bold hover:shadow-lg':
                      isDateInCurrentWeek(day),
                    'text-gray-800 dark:text-gray-200 hover:bg-gray-200/60 dark:hover:bg-gray-700/60':
                      !isDateInCurrentWeek(day),
                  }"
                >
                  {{ day.getDate() }}
                </button>
              </div>
              <div v-else :key="'empty-' + index"></div>
            </template>
          </div>
        </div>
      </transition>
    </div>

    <button
      @click="nextWeek"
      class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
