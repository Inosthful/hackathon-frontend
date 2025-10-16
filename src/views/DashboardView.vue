<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";
import { useMoodData } from "@/composables/useMoodData";
import type { MoodType } from "@/types/mood";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import MoodChart from "../components/MoodChart.vue";
import MoodSelector from "../components/MoodSelector.vue";
import ThemeToggle from "../components/ThemeToggle.vue"; // 👈 AJOUTÉ
import WeekView from "../components/WeekView.vue";

import WeekSelector from "../components/WeekSelector.vue";
import MoodChart from "../components/MoodChart.vue";
import type { MoodType } from "@/types/mood";

const router = useRouter();
const { user, logout } = useAuth();

const { loading, error, fetchMoodEntries, saveMood, getWeekMoods, stats } =
  useMoodData();

const toISODateString = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const selectedDate = ref<string>(toISODateString(new Date()));
const selectedMood = ref<MoodType | undefined>();
const showNote = ref(false);
const moodNote = ref("");
const showSuccess = ref(false);

const weekDays = computed(() => getWeekMoods());

const currentDayMood = computed(() => {
  return weekDays.value.find((day) => day.date === selectedDate.value)?.mood;
});

// Charger les données au montage
onMounted(async () => {
  await fetchMoodEntries();
  // Pré-sélectionner l'humeur si elle existe déjà pour aujourd'hui
  if (currentDayMood.value) {
    selectedMood.value = currentDayMood.value.mood;
    moodNote.value = currentDayMood.value.note || "";
  }
});

const handleMoodSelect = (mood: MoodType) => {
  selectedMood.value = mood;
  showNote.value = true;
};

const handleDateSelect = (date: string) => {
  selectedDate.value = date;
  const dayMood = weekDays.value.find((day) => day.date === date)?.mood;
  if (dayMood) {
    selectedMood.value = dayMood.mood;
    moodNote.value = dayMood.note || "";
    showNote.value = true;
  } else {
    selectedMood.value = undefined;
    moodNote.value = "";
    showNote.value = false;
  }
};

const saveMoodEntry = async () => {
  if (!selectedMood.value) return;

  try {
    await saveMood({
      date: selectedDate.value,
      mood: selectedMood.value,
      note: moodNote.value || undefined,
    });

    // Afficher un message de succès
    showSuccess.value = true;
    setTimeout(() => {
      showSuccess.value = false;
    }, 3000);

    // Recharger les données
    await fetchMoodEntries();
  } catch (e) {
    console.error("Erreur lors de l'enregistrement:", e);
  }
};

const cancelEdit = () => {
  showNote.value = false;
  selectedMood.value = currentDayMood.value?.mood;
  moodNote.value = currentDayMood.value?.note || "";
};

const handleLogout = () => {
  logout();
  router.push("/login");
};
</script>

<template>
  <div
    class="dashboard min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300"
  >
    <div
      class="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700"
    >
      <div
        class="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-center"
      >
        <div class="flex items-center gap-2 sm:gap-3">
          <div
            class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm sm:text-base"
          >
            {{ user?.username?.charAt(0).toUpperCase() || "U" }}
          </div>
          <div>
            <p
              class="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200"
            >
              {{ user?.username }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ user?.email }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <button
            @click="handleLogout"
            class="px-4 py-2 text-xs sm:text-sm rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
          >
            Déconnexion
          </button>

          <ThemeToggle />
        </div>
      </div>
    </div>

    <div
      class="max-w-7xl mx-auto px-4 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8"
    >
      <header class="text-center space-y-1 sm:space-y-2 fade-in">
        <h1
          class="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
        >
          MoodFlow+
        </h1>
        <p class="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
          Ton journal d'humeur intelligent
        </p>
      </header>

      <Transition name="slide-fade">
        <div
          v-if="showSuccess"
          class="bg-green-500 text-white p-3 sm:p-4 rounded-lg shadow-lg text-center font-medium text-sm sm:text-base"
        >
          ✅ Humeur enregistrée avec succès !
        </div>
      </Transition>

      <div
        v-if="error"
        class="bg-red-500 text-white p-3 sm:p-4 rounded-lg shadow-lg text-center text-sm sm:text-base"
      >
        ⚠️ {{ error }}
      </div>


      <!-- Sélecteur de semaine -->
      <section class="fade-in relative z-10" style="animation-delay: 0.1s">
        <WeekSelector />
      </section>

      <!-- Vue de la semaine -->
      <section class="fade-in" style="animation-delay: 0.2s">
        <WeekView
          :weekDays="weekDays"
          :selectedDate="selectedDate"
          @selectDate="handleDateSelect"
        />
      </section>


      <!-- Sélecteur d'humeur -->
      <section class="fade-in" style="animation-delay: 0.3s">
        <div class="bg-white dark:bg-gray-800 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-xl">
          <MoodSelector
            :selectedMood="selectedMood"
            :disabled="loading"
            @select="handleMoodSelect"
          />

          <Transition name="expand">
            <div v-if="showNote" class="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
              <div>
                <label
                  for="mood-note"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Ajoute une note (optionnel)
                </label>
                <textarea
                  id="mood-note"
                  v-model="moodNote"
                  rows="3"
                  class="w-full p-2 sm:p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Qu'est-ce qui a influencé ton humeur aujourd'hui ?"
                ></textarea>
              </div>

              <div class="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-end">
                <button
                  @click="cancelEdit"
                  class="px-4 sm:px-6 py-2 text-sm sm:text-base rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  Annuler
                </button>
                <button
                  @click="saveMoodEntry"
                  :disabled="!selectedMood || loading"
                  class="px-4 sm:px-6 py-2 text-sm sm:text-base rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {{ loading ? "Enregistrement..." : "Enregistrer" }}
                </button>
              </div>
            </div>
          </Transition>
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
        class="text-center p-6 sm:p-8 lg:p-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg fade-in"
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
          MoodFlow+ - Créé avec ❤️ pour le Hackathon Ynov 2025
        </p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* Animations */
.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

/* Transitions pour les messages */
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

/* Transition pour l'expansion de la zone de note */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease-out;
  max-height: 300px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
