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
    }, 3000); // Redirect to login after 3 seconds
  } catch (e: any) {
    verificationStatus.value = 'error';
    message.value = e.response?.data?.message || 'Failed to verify email. Please try again or contact support.';
  }
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md text-center">
      <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Email Verification</h2>
      <div v-if="verificationStatus === 'loading'" class="flex items-center justify-center">
        <svg class="animate-spin h-5 w-5 mr-3 text-blue-500" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600 dark:text-gray-400">Verifying your email...</p>
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
        <button @click="router.push('/register')" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Go to Registration
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any specific styles for this component here */
</style>
