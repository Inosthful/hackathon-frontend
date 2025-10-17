<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const verificationStatus = ref<'loading' | 'success' | 'error'>('loading');
const message = ref('');

onMounted(async () => {
  const token = route.query.token;

  if (!token) {
    verificationStatus.value = 'error';
    message.value = 'Verification token is missing.';
    return;
  }

  try {
    const response = await axios.get(`/api/auth/verify-email?token=${token}`);
    verificationStatus.value = 'success';
    message.value = response.data.message || 'Email verified successfully! You can now log in.';
    setTimeout(() => {
      router.push('/login');
    }, 3000);
  } catch (e: any) {
    verificationStatus.value = 'error';
    message.value = e.response?.data?.message || 'Failed to verify email. Please try again or contact support.';
  }
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[#FAF7F2] dark:bg-gray-900 p-4 relative">
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
      <svg width="100%" height="100%" viewBox="0 0 1440 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
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
        <rect x="-20%" y="-20%" width="60%" height="60%" fill="url(#grad1)" transform="rotate(-45)" />
        <rect x="60%" y="40%" width="60%" height="60%" fill="url(#grad2)" transform="rotate(30)" />
      </svg>
    </div>

    <div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-8 rounded-3xl shadow-2xl shadow-gray-200/50 dark:shadow-black/20 w-full max-w-md text-center relative z-10">
      <h2 class="text-2xl sm:text-3xl font-extrabold mb-4 text-gray-800 dark:text-white">
        <span class="bg-gradient-to-r from-[#A5D6A7] to-[#80CBC4] bg-clip-text text-transparent">Vérification</span> Email
      </h2>
      <div v-if="verificationStatus === 'loading'" class="flex items-center justify-center">
        <svg class="animate-spin h-5 w-5 mr-3 text-[#80CBC4]" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600 dark:text-gray-400">Vérification de votre email...</p>
      </div>
      <div v-else-if="verificationStatus === 'success'">
        <svg class="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="text-green-600 dark:text-green-400 font-semibold">{{ message }}</p>
      </div>
      <div v-else-if="verificationStatus === 'error'">
        <svg class="w-16 h-16 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="text-red-600 dark:text-red-400 font-semibold">{{ message }}</p>
        <button @click="router.push('/register')" class="mt-4 px-4 py-2 bg-gradient-to-r from-[#A5D6A7] to-[#80CBC4] text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
          Aller à l'inscription
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
