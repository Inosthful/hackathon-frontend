<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import ThemeToggle from "./components/ThemeToggle.vue"; // Assurez-vous que le chemin est correct

const route = useRoute();

// Détermine si le ThemeToggle doit être affiché (Login ou Register)
const shouldShowThemeToggle = computed(() => {
  const currentRouteName = route.name;

  // Le ThemeToggle est rendu dans DashboardView pour 'Dashboard',
  // donc ici on le rend seulement pour 'Login' et 'Register' (les routes où il est absent).
  return currentRouteName === "Login" || currentRouteName === "Register";
});

// Détermine si la position absolue/fixe doit être appliquée.
// Si c'est Login ou Register, on veut une position absolue/fixe pour être en haut à droite.
const isFixedOrAbsolutePosition = computed(() => {
  return route.name === "Login" || route.name === "Register";
});
</script>

<template>
  <div class="app min-h-screen">
    <ThemeToggle
      v-if="shouldShowThemeToggle"
      :class="{ 'absolute-top-right': isFixedOrAbsolutePosition }"
    />

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

/* 🎯 CLASSE AJOUTÉE POUR LA POSITION HAUT-DROITE SUR LOGIN/REGISTER */
.absolute-top-right {
  position: absolute; /* ou 'fixed' si vous voulez qu'il reste visible au scroll */
  top: 1rem; /* 16px */
  right: 1rem; /* 16px */
  z-index: 50; /* S'assure qu'il est au-dessus du contenu */
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
