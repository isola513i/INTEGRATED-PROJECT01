<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { changePassword } from '@/services/userService'
import { useAuthStore } from '@/store/useAuthStore'

const router = useRouter()
const auth = useAuthStore()

// form data
const oldPassword = ref('')
const newPassword = ref('')
const confirmNewPassword = ref('')

// states
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

// disable button if invalid
const disabled = computed(() =>
  loading.value ||
  oldPassword.value.trim().length === 0 ||
  newPassword.value.trim().length < 6 ||
  confirmNewPassword.value.trim().length < 6 ||
  newPassword.value !== confirmNewPassword.value
)

// submit handler
async function onSubmit() {
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''
  try {
    if(!auth.userId){
      throw new Error('User not authenticated. Please login again.')
    }
    await changePassword(auth.userId,oldPassword.value, newPassword.value,confirmNewPassword.value)
    successMsg.value = 'เปลี่ยนรหัสผ่านสำเร็จ!'
    setTimeout(() => router.push('/profile'), 2000)
  } catch (err) {
    errorMsg.value = err?.message || 'ไม่สามารถเปลี่ยนรหัสผ่านได้ กรุณาลองใหม่อีกครั้ง'
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
      <!-- โลโก้ -->
      <div class="mb-6 flex flex-col items-center">
        <img src="/image/ITBM_SHOP.png" alt="Logo" class="h-8 mb-4" />
      </div>

      <!-- หัวข้อ -->
      <h1 class="text-[20px] font-semibold text-gray-800 leading-tight">
        เปลี่ยนรหัสผ่าน
      </h1>
      <p class="text-[14px] text-gray-500 mt-1">
        กรุณากรอกรหัสผ่านปัจจุบันและตั้งรหัสผ่านใหม่
      </p>

      <!-- ฟอร์ม -->
      <form class="mt-6 text-left" @submit.prevent="onSubmit">
        <!-- old password -->
        <label
          for="oldPassword"
          class="block text-[14px] text-gray-800 font-medium mb-2"
        >
          รหัสผ่านปัจจุบัน
        </label>
        <input
          id="oldPassword"
          v-model.trim="oldPassword"
          type="password"
          placeholder="••••••••"
          autocomplete="current-password"
          class="w-full rounded-sm border border-gray-400 bg-gray-50 px-3 py-2 text-[14px] text-gray-800 placeholder-gray-400 shadow-inner outline-none focus:border-black focus:ring-1 focus:ring-black"
          required
        />

        <!-- new password -->
        <label
          for="newPassword"
          class="block text-[14px] text-gray-800 font-medium mb-2 mt-4"
        >
          รหัสผ่านใหม่
        </label>
        <input
          id="newPassword"
          v-model.trim="newPassword"
          type="password"
          placeholder="••••••••"
          autocomplete="new-password"
          class="w-full rounded-sm border border-gray-400 bg-gray-50 px-3 py-2 text-[14px] text-gray-800 placeholder-gray-400 shadow-inner outline-none focus:border-black focus:ring-1 focus:ring-black"
          required
        />

        <!-- confirm new password -->
        <label
          for="confirmNewPassword"
          class="block text-[14px] text-gray-800 font-medium mb-2 mt-4"
        >
          ยืนยันรหัสผ่านใหม่
        </label>
        <input
          id="confirmNewPassword"
          v-model.trim="confirmNewPassword"
          type="password"
          placeholder="••••••••"
          autocomplete="new-password"
          class="w-full rounded-sm border border-gray-400 bg-gray-50 px-3 py-2 text-[14px] text-gray-800 placeholder-gray-400 shadow-inner outline-none focus:border-black focus:ring-1 focus:ring-black"
          required
        />

        <p
          v-if="newPassword && confirmNewPassword && newPassword !== confirmNewPassword"
          class="mt-2 text-[13px] text-red-500 text-center"
        >
          รหัสผ่านไม่ตรงกัน
        </p>

        <!-- error / success -->
        <p v-if="errorMsg" class="mt-3 text-[13px] text-red-500 text-center">
          {{ errorMsg }}
        </p>
        <p v-if="successMsg" class="mt-3 text-[13px] text-green-600 text-center">
          {{ successMsg }}
        </p>

        <!-- submit -->
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
          บันทึกรหัสผ่านใหม่
        </button>
      </form>

      <!-- back -->
      <div class="mt-6 text-[13px] text-gray-600 text-center">
        <button
          type="button"
          @click="router.push({ name: 'Profile' })"
          class="text-black font-medium hover:underline"
        >
          กลับไปหน้าข้อมูลส่วนตัว
        </button>
      </div>
    </div>
  </div>
</template>