<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth';

const email = ref('');
const { loading, error, requestPasswordReset } = useAuth();
const message = ref('');

const handleForgotPassword = async () => {
  const result = await requestPasswordReset(email.value);
  if (result) {
    message.value = result.message;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4">
    <div class="max-w-md w-full">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-4 sm:space-y-6">
        <div class="text-center space-y-1 sm:space-y-2">
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Mot de passe oublié
          </h1>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Entrez votre email pour recevoir un lien de réinitialisation.
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

        <form @submit.prevent="handleForgotPassword" class="space-y-3 sm:space-y-4" v-if="!message">
          <div>
            <label for="email" class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="ton.email@exemple.com"
              class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {{ loading ? 'Envoi en cours...' : 'Envoyer le lien' }}
          </button>
        </form>

        <div class="text-center pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
          <p class="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
            Retour à la
            <router-link
              to="/login"
              class="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
            >
              connexion
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
