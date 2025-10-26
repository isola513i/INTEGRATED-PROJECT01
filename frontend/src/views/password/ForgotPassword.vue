<!-- ForgotPasswordView.vue (ธีมขาวดำ) -->
<script setup>
import { ref, computed } from 'vue'
import { useRouter} from 'vue-router'
import { requestPasswordReset } from '@/services/userService'

const router = useRouter()


const email = ref('')
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const disabled = computed(() => loading.value || email.value.trim().length === 0)

async function onSubmit() {
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''
  try {
     await requestPasswordReset(email.value)
    successMsg.value =
      'ถ้าอีเมลนี้อยู่ในระบบ เราจะส่งลิงก์รีเซ็ตรหัสผ่านไปให้'
  } catch (err) {
    errorMsg.value = err?.message || 'ไม่สามารถส่งคำขอได้ กรุณาลองใหม่อีกครั้ง'
  } finally {
    loading.value = false
  }
}

function goLogin() {
  router.push({ name: 'SignIn' })
}
</script>

<template>
  <!-- background: ขาวเทาอ่อน -->
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-300 px-4 py-10 text-gray-900">
    <!-- card -->
    <div
      class="w-full max-w-md bg-white rounded-md shadow-xl border border-gray-200 p-8 text-center"
    >
      <!-- โลโก้ -->
      <div class="mb-6 flex flex-col items-center">
        <img
          src="/image/ITBM_SHOP.png"
          alt="Logo"
          class="h-8 mb-4"
        />
      </div>

      <!-- หัวข้อ -->
      <h1 class="text-[20px] font-semibold text-gray-800 leading-tight">
        ลืมรหัสผ่าน
      </h1>
      <p class="text-[14px] text-gray-500 mt-1">
        รีเซ็ตรหัสผ่านด้วยอีเมลที่ใช้งาน
      </p>

      <!-- ฟอร์ม -->
      <form class="mt-6 text-left" @submit.prevent="onSubmit">
        <label
          for="email"
          class="block text-[14px] text-gray-800 font-medium mb-2"
        >
          อีเมล
        </label>

        <input
          id="email"
          v-model.trim="email"
          type="email"
          placeholder="name@example.com"
          class="w-full rounded-sm border border-gray-400 bg-gray-50 px-3 py-2 text-[14px] text-gray-800 placeholder-gray-400 shadow-inner outline-none focus:border-black focus:ring-1 focus:ring-black"
          required
          autocomplete="email"
        />

        <!-- error / success -->
        <p v-if="errorMsg" class="mt-3 text-[13px] text-red-500 text-center">
          {{ errorMsg }}
        </p>
        <p v-if="successMsg" class="mt-3 text-[13px] text-green-600 text-center">
          {{ successMsg }}
        </p>

        <!-- ปุ่ม -->
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
          รีเซ็ตรหัสผ่าน
        </button>
      </form>

      <!-- ลิงก์ -->
      <div class="mt-6 text-[13px] text-gray-600 text-center">
        มีบัญชีผู้ใช้งานแล้ว?
        <button
          type="button"
          @click="goLogin"
          class="text-black font-medium hover:underline"
        >
          ล็อกอินเข้าสู่ระบบ
        </button>
      </div>
    </div>
  </div>
</template>
