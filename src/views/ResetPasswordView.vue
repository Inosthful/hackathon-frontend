<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const route = useRoute();
const router = useRouter();

const password = ref('');
const confirmPassword = ref('');
const token = ref('');

const { loading, error, resetPassword } = useAuth();
const message = ref('');

onMounted(() => {
  token.value = route.params.token as string;
});

const handleResetPassword = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = 'Les mots de passe ne correspondent pas.';
    return;
  }

  const result = await resetPassword(token.value, password.value, confirmPassword.value);
  if (result) {
    message.value = result.message;
    setTimeout(() => {
      router.push('/login');
    }, 3000);
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4">
    <div class="max-w-md w-full">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-4 sm:space-y-6">
        <div class="text-center space-y-1 sm:space-y-2">
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Réinitialiser le mot de passe
          </h1>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Choisissez un nouveau mot de passe.
          </p>
        </div>

        <Transition name="slide-fade">
          <div v-if="message" class="bg-green-100 dark:bg-green-900/20 border-l-4 border-green-500 p-3 sm:p-4 rounded">
            <p class="text-green-700 dark:text-green-400 text-xs sm:text-sm">
              {{ message }}
            </p>
          </div>
        </Transition>

        <Transition name="slide-fade">
          <div v-if="error" class="bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 p-3 sm:p-4 rounded">
            <p class="text-red-700 dark:text-red-400 text-xs sm:text-sm">
              {{ error }}
            </p>
          </div>
        </Transition>

        <form @submit.prevent="handleResetPassword" class="space-y-3 sm:space-y-4" v-if="!message">
          <div>
            <label for="password" class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
              Nouveau mot de passe
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label for="confirmPassword" class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {{ loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe' }}
          </button>
        </form>
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
