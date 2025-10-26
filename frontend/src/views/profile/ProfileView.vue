<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/useAuthStore'
import { useFlashStore } from '@/store/useFlashStore'
import { getUserProfile } from '@/services/userService'

const router = useRouter()
const auth = useAuthStore()
const flash = useFlashStore()

const loading = ref(true)
const errorMsg = ref('')
const profile = ref(null)

const isSeller = computed(
  () => (profile.value?.userType || '').toString().toUpperCase() === 'SELLER'
)
const stripDashes = v => (v ?? '').toString().replace(/-/g, '')
const mobilePlain = computed(() => stripDashes(profile.value?.phoneNumber))

async function loadProfile() {
  loading.value = true
  errorMsg.value = ''
  if (!auth.userId) {
    errorMsg.value = 'User ID not found. Please login again.'
    loading.value = false
    return
  }
  try {
    profile.value = await getUserProfile(auth.userId)
  } catch (e) {
    errorMsg.value = e?.message || 'Cannot load profile'
  } finally {
    loading.value = false
  }
}

function goEdit() {
  router.push({ name: 'ProfileEditView' })
}

function goChangePassword() {
  router.push({ name: 'ChangePasswordView' })
}

onMounted(loadProfile)
</script>

<template>
  <div class="min-h-[calc(100vh-80px)] bg-zinc-800 text-gray-900 flex flex-col items-center py-10">
    <!-- Header -->
    <div class="text-center mb-6">
      <h1 class="text-2xl font-semibold tracking-tight text-white">Profile</h1>
      <p class="text-gray-500 text-sm">Your account information</p>
    </div>

    <!-- Flash -->
    <div
      v-if="flash.message"
      :class="flash.style"
      class="mb-4 px-4 py-2 rounded border border-gray-300 bg-gray-50 text-sm"
    >
      {{ flash.message }}
    </div>

    <!-- Card -->
    <div
      class="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow p-8 text-center"
    >
      <!-- Avatar -->
      <div
        class="w-28 h-28 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center mx-auto"
      >
        <svg class="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-3.33 0-10 1.67-10 5v1h20v-1c0-3.33-6.67-5-10-5Z"
          />
        </svg>
      </div>

      <!-- Nickname -->
      <h2 class="mt-4 text-lg font-semibold">
        {{ profile?.nickName || '—' }}
      </h2>

      <!-- Info -->
      <div v-if="loading" class="animate-pulse mt-6 space-y-3">
        <div class="h-4 w-2/3 bg-gray-200 mx-auto rounded"></div>
        <div class="h-4 w-1/2 bg-gray-200 mx-auto rounded"></div>
        <div class="h-4 w-3/4 bg-gray-200 mx-auto rounded"></div>
      </div>

      <div v-else-if="errorMsg" class="text-red-500 mt-6">{{ errorMsg }}</div>

      <div v-else class="mt-6 space-y-3 text-left">
        <div class="flex justify-between border-b border-gray-200 pb-2">
          <span class="text-gray-500">Nickname</span>
          <span class="font-medium">{{ profile.nickName }}</span>
        </div>
        <div class="flex justify-between border-b border-gray-200 pb-2">
          <span class="text-gray-500">Email</span>
          <span class="font-medium break-all text-right">{{ profile.email }}</span>
        </div>
        <div class="flex justify-between border-b border-gray-200 pb-2">
          <span class="text-gray-500">Fullname</span>
          <span class="font-medium">{{ profile.fullName }}</span>
        </div>
        <div class="flex justify-between border-b border-gray-200 pb-2">
          <span class="text-gray-500">Type</span>
          <span class="font-medium uppercase">{{ profile.userType }}</span>
        </div>

        <template v-if="isSeller">
          <div class="flex justify-between border-b border-gray-200 pb-2">
            <span class="text-gray-500">Mobile</span>
            <span class="font-medium">{{ mobilePlain }}</span>
          </div>
          <div class="flex justify-between border-b border-gray-200 pb-2">
            <span class="text-gray-500">Bank</span>
            <span class="font-medium">{{ profile.bankName }} - {{ profile.bankAccount }}</span>
          </div>
        </template>
      </div>

      <!-- Buttons -->
      <div class="mt-8 flex justify-center gap-4">
        <button
          @click="goEdit"
          class="bg-black text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-900 active:bg-gray-800 transition"
        >
          Edit Profile
        </button>
        <router-link :to="{ name: 'ChangePassword' }">
        <button
          @click="goChangePassword"
          class="bg-white border border-gray-800 text-gray-900 px-5 py-2 rounded-lg font-medium hover:bg-gray-100 active:bg-gray-200 transition"
        >
          Change Password
        </button>
        </router-link>
      </div>
    </div>
  </div>
</template>
