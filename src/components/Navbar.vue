<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";
import ThemeToggle from "./ThemeToggle.vue";

const { user, logout } = useAuth();

const handleLogout = () => {
  logout();
};
</script>

<template>
  <div
    class="relative z-30 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl shadow-xl shadow-gray-200/50 dark:shadow-black/20 border-b border-gray-200/50 dark:border-gray-700/50"
  >
    <div
      class="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between"
    >
      <!-- Left side: Profile Avatar + Accueil button -->
      <div class="flex items-center gap-3 sm:gap-4">
        <!-- Profile Avatar (clickable) -->
        <router-link to="/profile" class="group">
          <div class="flex items-center gap-2 sm:gap-3 cursor-pointer">
            <div
              class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-[#A5D6A7] to-[#80CBC4] flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-200"
            >
              {{ user?.prenom?.charAt(0).toUpperCase() || "U" }}
            </div>
          </div>
        </router-link>

        <router-link to="/dashboard">
          <button
            class="px-4 py-2 text-xs sm:text-sm rounded-lg bg-gray-200/60 dark:bg-gray-700/60 backdrop-blur-sm text-gray-800 font-medium hover:bg-gray-300/60 dark:text-gray-200 dark:hover:bg-gray-600/60 transition-all duration-200"
          >
            Accueil
          </button>
        </router-link>
      </div>

      <!-- Right side: Actions -->
      <div class="flex items-center gap-3 sm:gap-4">
        <button
          @click="handleLogout"
          class="px-4 py-2 text-xs sm:text-sm rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 hover:shadow-lg transition-all duration-200"
        >
          Déconnexion
        </button>

        <ThemeToggle />
      </div>
    </div>
  </div>
</template>
