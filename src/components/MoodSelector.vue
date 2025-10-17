<script setup lang="ts">
import type { MoodType } from "@/types/mood";
import { MOOD_COLORS, MOOD_EMOJIS, MOOD_LABELS } from "@/types/mood";

interface Props {
  selectedMood?: MoodType;
  disabled?: boolean;
}

interface Emits {
  (e: "select", mood: MoodType): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const moods: MoodType[] = ["happy", "good", "neutral", "sad", "angry"];

const selectMood = (mood: MoodType) => {
  if (!props.disabled) {
    emit("select", mood);
  }
};
</script>

<template>
  <div class="mood-selector">
    <h3
      class="text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-gray-200"
    >
      Comment te sens-tu aujourd'hui ?
    </h3>
    <div class="flex gap-2 sm:gap-3 lg:gap-4 justify-center flex-wrap">
      <button
        v-for="mood in moods"
        :key="mood"
        @click="selectMood(mood)"
        :disabled="disabled"
        class="mood-button transition-all duration-300 transform hover:scale-110 flex flex-col items-center gap-1 sm:gap-2 p-3 sm:p-4 lg:p-5 rounded-2xl sm:rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl shadow-[0_6px_25px_rgb(0,0,0,0.1)] hover:shadow-[0_10px_35px_rgb(0,0,0,0.15)]"
        :class="{
          'opacity-50 cursor-not-allowed': disabled,
          'scale-105': selectedMood === mood,
        }"
        :style="{
          border:
            selectedMood === mood
              ? `3px solid ${MOOD_COLORS[mood]}`
              : '3px solid transparent',
          boxShadow:
            selectedMood === mood
              ? `0 0 25px ${MOOD_COLORS[mood]}80, 0 4px 20px rgba(0,0,0,0.1)`
              : '0 4px 20px rgba(0,0,0,0.08)',
        }"
      >
        <span class="text-4xl sm:text-5xl lg:text-6xl" style="filter: drop-shadow(0 2px 3px rgba(0,0,0,0.1)); -webkit-text-stroke: 0.5px rgba(0,0,0,0.1);">{{
          MOOD_EMOJIS[mood]
        }}</span>
        <span
          class="text-xs sm:text-sm font-semibold"
          :style="{ color: MOOD_COLORS[mood] }"
        >
          {{ MOOD_LABELS[mood] }}
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.mood-button:active {
  transform: scale(0.95);
}

.mood-button:focus {
  outline: none;
}
</style>
