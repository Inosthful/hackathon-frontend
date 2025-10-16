<script setup lang="ts">
import type { MoodType } from '@/types/mood'
import { MOOD_EMOJIS, MOOD_LABELS, MOOD_COLORS } from '@/types/mood'

interface Props {
  selectedMood?: MoodType
  disabled?: boolean
}

interface Emits {
  (e: 'select', mood: MoodType): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const moods: MoodType[] = ['happy', 'good', 'neutral', 'sad', 'angry']

const selectMood = (mood: MoodType) => {
  if (!props.disabled) {
    emit('select', mood)
  }
}
</script>

<template>
  <div class="mood-selector">
    <h3 class="text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-gray-200">
      Comment te sens-tu aujourd'hui ?
    </h3>
    <div class="flex gap-2 sm:gap-3 lg:gap-4 justify-center flex-wrap">
      <button
        v-for="mood in moods"
        :key="mood"
        @click="selectMood(mood)"
        :disabled="disabled"
        :class="[
          'mood-button',
          'transition-all duration-300 transform hover:scale-110',
          'flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl',
          'border-2 sm:border-4 border-transparent',
          'bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl',
          selectedMood === mood && 'border-current scale-105',
          disabled && 'opacity-50 cursor-not-allowed'
        ]"
        :style="{
          borderColor: selectedMood === mood ? MOOD_COLORS[mood] : 'transparent'
        }"
      >
        <span class="text-3xl sm:text-4xl lg:text-5xl">{{ MOOD_EMOJIS[mood] }}</span>
        <span
          class="text-xs sm:text-sm font-medium"
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
  ring: 2px;
  ring-offset: 2px;
}
</style>
