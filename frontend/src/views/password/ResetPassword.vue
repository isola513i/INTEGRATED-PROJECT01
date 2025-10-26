<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { resetPassword } from '@/services/userService'

const route = useRoute()
const router = useRouter()

// Path param: /reset-password/:token
const token = route.query.token
console.log('Reset token:', token)

const newPassword = ref('')
const confirmNewPassword = ref('')
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const disabled = computed(() =>
  loading.value ||
  newPassword.value.trim().length < 6 ||
  confirmNewPassword.value.trim().length < 6 ||
  newPassword.value !== confirmNewPassword.value
)

async function onSubmit() {
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''
  try {
    await resetPassword(token, newPassword.value, confirmNewPassword.value)
    successMsg.value = 'Password changed successfully! Redirecting to sign-in page...'
    setTimeout(() => router.push('/signin'), 2500)
  } catch (err) {
    errorMsg.value = err?.message || 'Unable to change password. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-300 px-4 py-10 text-gray-900"
  >
    <div
      class="w-full max-w-md bg-white rounded-md shadow-xl border border-gray-200 p-8 text-center"
    >
      <div class="mb-6 flex flex-col items-center">
        <img src="/image/ITBM_SHOP.png" alt="Logo" class="h-8 mb-4" />
      </div>

      <h1 class="text-[20px] font-semibold text-gray-800 leading-tight">
        Set a New Password
      </h1>
      <p class="text-[14px] text-gray-500 mt-1">
        Please enter your new password to reset your account.
      </p>

      <form class="mt-6 text-left" @submit.prevent="onSubmit">
        <label
          for="newPassword"
          class="block text-[14px] text-gray-800 font-medium mb-2"
        >
          New Password
        </label>
        <input
          id="newPassword"
          v-model.trim="newPassword"
          type="password"
          placeholder="••••••••"
          class="w-full rounded-sm border border-gray-400 bg-gray-50 px-3 py-2 text-[14px] text-gray-800 placeholder-gray-400 shadow-inner outline-none focus:border-black focus:ring-1 focus:ring-black"
          required
        />

        <label
          for="confirmNewPassword"
          class="block text-[14px] text-gray-800 font-medium mb-2 mt-4"
        >
          Confirm New Password
        </label>
        <input
          id="confirmNewPassword"
          v-model.trim="confirmNewPassword"
          type="password"
          placeholder="••••••••"
          class="w-full rounded-sm border border-gray-400 bg-gray-50 px-3 py-2 text-[14px] text-gray-800 placeholder-gray-400 shadow-inner outline-none focus:border-black focus:ring-1 focus:ring-black"
          required
        />

        <p
          v-if="newPassword && confirmNewPassword && newPassword !== confirmNewPassword"
          class="mt-2 text-[13px] text-red-500 text-center"
        >
          Passwords do not match
        </p>

        <p v-if="errorMsg" class="mt-3 text-[13px] text-red-500 text-center">
          {{ errorMsg }}
        </p>
        <p v-if="successMsg" class="mt-3 text-[13px] text-green-600 text-center">
          {{ successMsg }}
        </p>

        <button
          type="submit"
          :disabled="disabled"
          class="mt-5 w-full flex items-center justify-center rounded-sm bg-black text-white text-[15px] font-medium py-2.5 shadow disabled:opacity-60 disabled:cursor-not-allowed hover:bg-gray-800 active:bg-gray-950 transition"
        >
          <svg
            v-if="loading"
            class="-ml-1 mr-2 h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path
              d="M12 3a9 9 0 1 0 9 9"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Save New Password
        </button>
      </form>

      <div class="mt-6 text-[13px] text-gray-600 text-center">
        <button
          type="button"
          @click="router.push({ name: 'SignIn' })"
          class="text-black font-medium hover:underline"
        >
          Back to Sign In
        </button>
      </div>
    </div>
  </div>
</template>
