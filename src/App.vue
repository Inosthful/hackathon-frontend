<script setup lang="ts">
import { useRoute } from 'vue-router'
import ThemeToggle from './components/ThemeToggle.vue'

const route = useRoute()

// Afficher le ThemeToggle uniquement sur le dashboard
const showThemeToggle = () => {
  return route.name === 'Dashboard'
}
</script>

<template>
  <div class="app min-h-screen">
    <!-- Toggle thème (uniquement sur le dashboard) -->
    <ThemeToggle v-if="showThemeToggle()" />

    <!-- Router View -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style>
/* Styles globaux pour l'application */
html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
}

/* Transition pour les changements de page */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scrollbar personnalisée */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4a5568;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #718096;
}
</style>
