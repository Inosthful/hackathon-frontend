<script setup lang="ts">
import { getRandomQuote } from "@/constants/quotes";
import type { MoodType } from "@/types/mood";
import { ref, watch } from "vue";
import MoodSelector from "./MoodSelector.vue";

interface Props {
  show: boolean;
  loading?: boolean;
}

interface Emits {
  (e: "close"): void;
  (e: "save", data: { mood: MoodType }): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const selectedMood = ref<MoodType | undefined>();
const currentQuote = ref<string>("");

// Réinitialiser l'état quand la popup s'ouvre
watch(() => props.show, (newValue) => {
  if (newValue) {
    // La popup vient de s'ouvrir, on reset tout
    selectedMood.value = undefined;
    currentQuote.value = "";
    console.log('MoodPopup - Réinitialisation à l\'ouverture');
  }
});

const handleMoodSelect = (mood: MoodType) => {
  console.log('MoodPopup - Sélection:', mood);
  selectedMood.value = mood;
  currentQuote.value = getRandomQuote(mood);
};

const handleSave = () => {
  if (!selectedMood.value) return;
  console.log('MoodPopup - Sauvegarde:', selectedMood.value);
  emit("save", {
    mood: selectedMood.value,
  });
  selectedMood.value = undefined;
  currentQuote.value = "";
};

const handleClose = () => {
  console.log('MoodPopup - Fermeture');
  emit("close");
  selectedMood.value = undefined;
  currentQuote.value = "";
};
</script>

<template>
  <Transition name="modal">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
      @click.self="handleClose"
    >
      <div
        class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 dark:shadow-black/20 border border-white/30 dark:border-gray-700/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all"
      >
        <!-- Header -->
        <div
          class="p-6 sm:p-8 border-b border-gray-200/50 dark:border-gray-700/50"
        >
          <div class="flex items-center justify-between">
            <div>
              <h2
                class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#B2E0B4] to-[#8FD9D6] bg-clip-text text-transparent"
              >
                Bonjour 🌞
              </h2>
              <p
                class="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base"
              >
                Commence ta journée en enregistrant ton humeur
              </p>
            </div>
            <button
              @click="handleClose"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              aria-label="Fermer"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 sm:p-8 space-y-6">
          <!-- Sélecteur d’humeur -->
          <MoodSelector
            :selectedMood="selectedMood"
            :disabled="loading"
            @select="handleMoodSelect"
          />

          <!-- Citation motivante -->
          <Transition name="quote-fade">
            <div
              v-if="currentQuote"
              class="quote-container p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#A5D6A7]/30 to-[#80CBC4]/30 border-l-4 border-[#80CBC4] dark:from-[#80CBC4]/10 dark:to-[#A5D6A7]/10"
            >
              <div class="flex items-start gap-3">
                <span class="text-2xl sm:text-3xl">💭</span>
                <p
                  class="text-sm sm:text-base text-gray-700 dark:text-gray-300 italic leading-relaxed"
                >
                  {{ currentQuote }}
                </p>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Footer -->
        <div
          class="p-6 sm:p-8 border-t border-gray-200/50 dark:border-gray-700/50 flex flex-col sm:flex-row gap-3 justify-end"
        >
          <button
            @click="handleClose"
            class="px-6 py-3 rounded-lg border-2 border-gray-300/60 dark:border-gray-600/60 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100/60 dark:hover:bg-gray-700/60 transition-all duration-200"
          >
            Plus tard
          </button>
          <button
            @click="handleSave"
            :disabled="!selectedMood || loading"
            class="px-6 py-3 rounded-lg bg-gradient-to-r from-[#A5D6A7] to-[#80CBC4] text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {{ loading ? "Enregistrement..." : "Enregistrer" }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Transitions du modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}
.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9) translateY(-20px);
}

/* Citation */
.quote-fade-enter-active,
.quote-fade-leave-active {
  transition: all 0.5s ease-out;
}
.quote-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
.quote-fade-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}
.quote-container {
  animation: gentle-pulse 2s ease-in-out;
}
@keyframes gentle-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}
</style>
