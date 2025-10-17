<template>
  <div ref="counterElement" class="streak-counter">
    <span class="flame-emoji" :class="flameClass">🔥</span>
    <span class="streak-value" :class="flameClass">{{ streak }}</span>
    <span class="streak-label">jours de suite !</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

const props = defineProps<{
  streak: number;
}>();

const counterElement = ref<HTMLElement | null>(null);

const flameClass = computed(() => {
  if (props.streak >= 1000) return 'flame-purple';
  if (props.streak >= 100) return 'flame-blue';
  if (props.streak >= 50) return 'flame-red';
  if (props.streak >= 25) return 'flame-orange';
  if (props.streak >= 10) return 'flame-yellow';
  return 'flame-default';
});

watch(() => props.streak, (newValue, oldValue) => {
  if (!counterElement.value) return;

  const element = counterElement.value;
  
  element.classList.remove('sparkle', 'fade-out');

  setTimeout(() => {
    if (newValue > oldValue && newValue > 0) {
      element.classList.add('sparkle');
    } else if (newValue === 1 && oldValue > 1) {
      element.classList.add('fade-out');
    }
    
    setTimeout(() => {
      element.classList.remove('sparkle', 'fade-out');
    }, 1000);
  }, 10);
});
</script>

<style scoped>
.streak-counter {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
}

.flame-emoji {
  font-size: 1.75rem; /* text-2xl */
  transition: color 0.5s ease-in-out;
  line-height: 1;
}

.streak-value {
  font-size: 1.25rem; /* text-xl */
  transition: color 0.5s ease-in-out;
}

.streak-label {
  font-size: 1.125rem; /* text-lg */
  color: #4b5563; /* gray-600 */
}

/* --- Flame Colors --- */
.flame-default { color: #f97316; } /* Default emoji color is orange-ish */
.flame-yellow { color: #f59e0b; } /* amber-500 */
.flame-orange { color: #ea580c; } /* orange-600 */
.flame-red { color: #ef4444; } /* red-500 */
.flame-blue { color: #3b82f6; } /* blue-500 */
.flame-purple { color: #8b5cf6; } /* violet-500 */


/* --- Animations --- */
@keyframes sparkle-animation {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.4); }
}

.sparkle .flame-emoji,
.sparkle .streak-value {
  animation: sparkle-animation 0.8s ease-in-out;
}

@keyframes fade-out-animation {
  0% { opacity: 1; transform: scale(1.2); }
  50% { opacity: 0.3; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}

.fade-out {
  animation: fade-out-animation 1s ease-in-out;
}
</style>
