<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";
import { useMoodData } from "@/composables/useMoodData";
import type { MoodEntry, MoodType } from "@/types/mood";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import MoodChart from "../components/MoodChart.vue";
import MoodPopup from "../components/MoodPopup.vue";
import MoodSelector from "../components/MoodSelector.vue";
import StreakCounter from "../components/StreakCounter.vue";

import MonthView from "../components/MonthView.vue";
import WeekView from "../components/WeekView.vue";

import WeekSelector from "../components/WeekSelector.vue";

const router = useRouter();
const route = useRoute();

const {
  loading,
  error,
  fetchMoodEntries,
  saveMood,
  deleteMood,
  getWeekMoods,
  stats,
  moodEntries,
  getMonthMoods,
  hasTodayMood,
  cleanupDuplicates,
} = useMoodData();

const { fetchUser, user } = useAuth();

const emailChangedSuccessMessage = ref("");

const toISODateString = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const selectedDate = ref<string>(toISODateString(new Date()));
const selectedMood = ref<MoodEntry | undefined>();
const showSuccess = ref(false);
const showMoodPopup = ref(false);
const viewMode = ref<"week" | "month">("week");

const selectedMoodType = computed(() => selectedMood.value?.mood);

const weekDays = computed(() => getWeekMoods());
const monthDays = computed(() => getMonthMoods());

const currentDayMood = computed(() => {
  const targetDate = selectedDate.value.substring(0, 10);
  return moodEntries.value.find((entry) => {
    const entryDate = (entry.date || "").substring(0, 10);
    return entryDate === targetDate;
  });
});

const isSameMood = computed(() => {
  if (!currentDayMood.value || !selectedMood.value) return false;
  return currentDayMood.value.mood === selectedMood.value.mood;
});

onMounted(async () => {
  await fetchMoodEntries();

  const duplicatesCount = await cleanupDuplicates();
  if (duplicatesCount > 0) {
    await fetchMoodEntries();
  }

  if (currentDayMood.value) {
    selectedMood.value = currentDayMood.value;
  }

  if (!hasTodayMood()) {
    showMoodPopup.value = true;
  }
});

const handleMoodSelect = (mood: MoodType) => {
  selectedMood.value = {
    date: selectedDate.value,
    mood: mood,
  };
};

const handleDateSelect = (date: string) => {
  selectedDate.value = toISODateString(new Date(date));
  const dayMood = weekDays.value.find(
    (day) => day.date === selectedDate.value
  )?.mood;
  selectedMood.value = dayMood;
};

const saveMoodEntry = async () => {
  if (!selectedMood.value) return;

  const isUpdate = !!currentDayMood.value;

  try {
    const savedMood = await saveMood({
      date: selectedDate.value,
      mood: selectedMood.value.mood,
      beginAt: new Date().toISOString(),
    });

    await fetchMoodEntries();
    selectedMood.value = savedMood;
  } catch (e) {
    console.error("Erreur lors de l'enregistrement:", e);
  }
};

const handlePopupClose = () => {
  showMoodPopup.value = false;
};

const handlePopupSave = async (data: { mood: MoodType }) => {
  try {
    const savedMood = await saveMood({
      date: toISODateString(new Date()),
      mood: data.mood,
      beginAt: new Date().toISOString(),
    });

    showMoodPopup.value = false;
    await fetchMoodEntries();

    selectedDate.value = toISODateString(new Date());
    selectedMood.value = savedMood;
  } catch (e) {
    console.error("Erreur lors de l'enregistrement depuis la popup:", e);
  }
};

const handleDeleteMood = async () => {
  if (!currentDayMood.value || !currentDayMood.value.id) return;

  if (confirm("Êtes-vous sûr de vouloir supprimer cette humeur ?")) {
    try {
      await deleteMood(currentDayMood.value.id);
      selectedMood.value = undefined;
      await fetchMoodEntries();
    } catch (e) {
      console.error("Erreur lors de la suppression:", e);
    }
  }
};
</script>

<template>
  <div
    class="dashboard min-h-screen bg-[#FAF7F2] dark:bg-gray-900 transition-colors duration-300 relative"
  >
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 500"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="grad1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(165, 214, 167, 0.3)" />
            <stop offset="100%" stop-color="rgba(165, 214, 167, 0)" />
          </radialGradient>
          <radialGradient id="grad2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(128, 203, 196, 0.3)" />
            <stop offset="100%" stop-color="rgba(128, 203, 196, 0)" />
          </radialGradient>
        </defs>
        <rect
          x="-20%"
          y="-20%"
          width="60%"
          height="60%"
          fill="url(#grad1)"
          transform="rotate(-45)"
        />
        <rect
          x="60%"
          y="40%"
          width="60%"
          height="60%"
          fill="url(#grad2)"
          transform="rotate(30)"
        />
      </svg>
    </div>
    <MoodPopup
      :show="showMoodPopup"
      :loading="loading"
      @close="handlePopupClose"
      @save="handlePopupSave"
    />

    <div
      class="relative z-10 max-w-7xl mx-auto px-4 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8"
    >
      <header class="text-center space-y-1 sm:space-y-2 fade-in">
        <h1
          class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-white tracking-tighter"
        >
          <span
            class="bg-gradient-to-r from-[#A5D6A7] to-[#80CBC4] bg-clip-text text-transparent"
            >Moodflow+</span
          >
        </h1>
        <p class="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
          Suivez vos émotions et comprenez-vous mieux
        </p>
        <StreakCounter v-if="user" :streak="user.joursConsecutifs" />
      </header>

      <section class="fade-in relative z-10" style="animation-delay: 0.1s">
        <WeekSelector :view-mode="viewMode" />
      </section>

      <section
        class="fade-in flex justify-center"
        style="animation-delay: 0.15s"
      >
        <div
          class="inline-flex rounded-lg border-2 border-gray-300/50 dark:border-gray-600/50 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-1 shadow-xl"
        >
          <button
            @click="viewMode = 'week'"
            :class="[
              'px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200',
              viewMode === 'week'
                ? 'bg-gradient-to-r from-[#A5D6A7] to-[#80CBC4] text-white shadow-lg'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-700/60',
            ]"
          >
            📅 Semaine
          </button>
          <button
            @click="viewMode = 'month'"
            :class="[
              'px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200',
              viewMode === 'month'
                ? 'bg-gradient-to-r from-[#A5D6A7] to-[#80CBC4] text-white shadow-lg'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-700/60',
            ]"
          >
            🗓️ Mois
          </button>
        </div>
      </section>

      <section
        v-if="viewMode === 'week'"
        class="fade-in"
        style="animation-delay: 0.2s"
      >
        <WeekView
          :weekDays="weekDays"
          :selectedDate="selectedDate"
          @selectDate="handleDateSelect"
        />
      </section>

      <section
        v-if="viewMode === 'month'"
        class="fade-in"
        style="animation-delay: 0.2s"
      >
        <MonthView
          :monthDays="monthDays"
          :selectedDate="selectedDate"
          @selectDate="handleDateSelect"
        />
      </section>

      <section class="fade-in" style="animation-delay: 0.3s">
        <div
          class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-4 sm:p-6 lg:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
        >
          <MoodSelector
            :selectedMood="selectedMoodType"
            :disabled="loading"
            @select="handleMoodSelect"
          />

          <div class="mt-6 flex justify-end gap-3">
            <button
              v-if="currentDayMood"
              @click="handleDeleteMood"
              :disabled="loading"
              class="px-6 py-3 rounded-lg bg-red-500 text-white font-medium shadow-lg hover:shadow-xl hover:bg-red-600 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {{ loading ? "Suppression..." : "Supprimer" }}
            </button>
            <button
              @click="saveMoodEntry"
              :disabled="!selectedMood || loading || isSameMood"
              class="px-6 py-3 rounded-lg bg-gradient-to-r from-[#A5D6A7] to-[#80CBC4] text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {{ loading ? "Enregistrement..." : "Enregistrer" }}
            </button>
          </div>
        </div>
      </section>

      <section
        v-if="stats.totalEntries > 0"
        class="fade-in"
        style="animation-delay: 0.3s"
      >
        <h2
          class="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-gray-200 text-center"
        >
          Tes statistiques
        </h2>
        <MoodChart :stats="stats" />
      </section>

      <section
        v-else
        class="text-center p-6 sm:p-8 lg:p-12 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] fade-in"
        style="animation-delay: 0.3s"
      >
        <div class="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">📝</div>
        <p
          class="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400"
        >
          Commence à enregistrer tes humeurs pour voir tes statistiques !
        </p>
      </section>

      <footer
        class="text-center py-4 sm:py-6 lg:py-8 text-gray-600 dark:text-gray-400"
      >
        <p class="text-xs sm:text-sm">
          Conçu avec soin pour votre épanouissement
        </p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
