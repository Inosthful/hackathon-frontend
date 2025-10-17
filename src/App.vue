<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import Navbar from "./components/Navbar.vue";
import ThemeToggle from "./components/ThemeToggle.vue";

const route = useRoute();
const shouldShowNavbar = computed(() => !!route.meta.requiresAuth);
const shouldShowThemeToggleForGuest = computed(() => !route.meta.requiresAuth);

</script>

<template>
  <div class="app min-h-screen bg-gray-50 dark:bg-gray-900">
    <Navbar v-if="shouldShowNavbar" />
    <ThemeToggle
      v-if="shouldShowThemeToggleForGuest"
      class="absolute top-4 right-4 z-50"
    />

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

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