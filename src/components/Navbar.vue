<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";
import { useRouter } from "vue-router";
import ThemeToggle from "./ThemeToggle.vue";

const { user, logout } = useAuth();

const handleLogout = () => {
  logout();
};
</script>

<template>
  <div
    class="relative z-30 bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700"
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
        <router-link to="/dashboard">
          <button
            class="px-4 py-2 text-xs sm:text-sm rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
          >
            Accueil
          </button>
        </router-link>
        <router-link to="/profile">
          <button
            class="px-4 py-2 text-xs sm:text-sm rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-all duration-200"
          >
            Profil
          </button>
        </router-link>
        <button
          @click="handleLogout"
          class="px-4 py-2 text-xs sm:text-sm rounded-lg bg-pink-600 text-white font-medium hover:bg-pink-700 transition-all duration-200"
        >
          Déconnexion
        </button>

        <ThemeToggle />
      </div>
    </div>
  </div>
</template>
