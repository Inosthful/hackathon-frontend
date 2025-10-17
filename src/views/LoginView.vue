<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";
import type { LoginCredentials } from "@/types/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const { login, loading, error } = useAuth();

const credentials = ref<LoginCredentials>({
  email: "",
  password: "",
});

const handleLogin = async () => {
  const success = await login(credentials.value);

  if (success) {
    router.push("/dashboard");
  }
};
</script>

<template>
  <div
    class="login-view min-h-screen flex items-center justify-center bg-[#FAF7F2] dark:bg-gray-900 p-4 relative"
  >
    <!-- Background SVG décoratif -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 500"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="grad1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(165, 214, 167, 0.3)" />
            <stop offset="100%" stop-color="rgba(165, 214, 167, 0)" />
          </radialGradient>
          <radialGradient id="grad2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(128, 203, 196, 0.3)" />
            <stop offset="100%" stop-color="rgba(128, 203, 196, 0)" />
          </radialGradient>
        </defs>
        <rect
          x="-20%"
          y="-20%"
          width="60%"
          height="60%"
          fill="url(#grad1)"
          transform="rotate(-45)"
        />
        <rect
          x="60%"
          y="40%"
          width="60%"
          height="60%"
          fill="url(#grad2)"
          transform="rotate(30)"
        />
      </svg>
    </div>

    <div class="login-card max-w-md w-full relative z-10">
      <!-- Card -->
      <div
        class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 dark:shadow-black/20 p-6 sm:p-8 space-y-4 sm:space-y-6"
      >
        <!-- Header -->
        <div class="text-center space-y-1 sm:space-y-2">
          <h1
            class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 dark:text-white tracking-tighter"
          >
            Cultivez votre
            <span
              class="bg-gradient-to-r from-[#A5D6A7] to-[#80CBC4] bg-clip-text text-transparent"
              >Bien-être</span
            >
          </h1>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Connecte-toi pour accéder à ton journal
          </p>
        </div>

        <!-- Message d'erreur -->
        <Transition name="slide-fade">
          <div
            v-if="error"
            class="bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 p-3 sm:p-4 rounded"
          >
            <p class="text-red-700 dark:text-red-400 text-xs sm:text-sm">
              {{ error }}
            </p>
          </div>
        </Transition>

        <!-- Formulaire -->
        <form @submit.prevent="handleLogin" class="space-y-3 sm:space-y-4">
          <!-- Email -->
          <div>
            <label
              for="email"
              class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2"
            >
              Email
            </label>
            <input
              id="email"
              v-model="credentials.email"
              type="email"
              required
              placeholder="ton.email@exemple.com"
              class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#80CBC4] focus:border-transparent transition-all duration-200"
            />
          </div>

          <!-- Password -->
          <div>
            <label
              for="password"
              class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2"
            >
              Mot de passe
            </label>
            <input
              id="password"
              v-model="credentials.password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#80CBC4] focus:border-transparent transition-all duration-200"
            />
          </div>

          <!-- Bouton connexion -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg bg-gradient-to-r from-[#A5D6A7] to-[#80CBC4] text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {{ loading ? "Connexion..." : "Se connecter" }}
          </button>
        </form>

        <!-- Lien inscription -->
        <div
          class="text-center pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2"
        >
          <p class="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
            Pas encore de compte ?
            <router-link
              to="/register"
              class="bg-gradient-to-r from-[#A5D6A7] to-[#80CBC4] bg-clip-text text-transparent font-semibold hover:underline"
            >
              S'inscrire
            </router-link>
          </p>
          <p class="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
            <router-link
              to="/forgot-password"
              class="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
            >
              Mot de passe oublié ?
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
