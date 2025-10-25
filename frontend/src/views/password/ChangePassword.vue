<!-- VerifyIdentityView.vue -->
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/useAuthStore' // <- ปรับ path ให้ตรงโปรเจกต์
import { getUserProfile } from '@/services/userService'
import ForgotPassword from './ForgotPassword.vue'

const router = useRouter()
const auth = useAuthStore()

// ------- state -------
const profile = ref(null)
const loading = ref(false)
const errorMsg = ref('')

const password = ref('')
const show = ref(false)

// ------- derived -------
const displayEmail = computed(() => profile.value?.email || '—')

// ปุ่ม "ถัดไป" จะกดได้เมื่อกรอกรหัสผ่านและไม่กำลังโหลด
const disabled = computed(() => loading.value || password.value.trim().length === 0)

// ------- effects -------
async function loadProfile() {
  loading.value = true
  errorMsg.value = ''
  try {
    if (!auth?.userId) {
      throw new Error('User ID not found. Please login again.')
    }
    profile.value = await getUserProfile(auth.userId)
  } catch (e) {
    errorMsg.value = e?.message || 'Cannot load profile'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // ถ้าไม่มี userId ส่งกลับหน้าเข้าสู่ระบบ (หรือปรับตาม flow ของคุณ)
  if (!auth?.userId) {
    errorMsg.value = 'User ID not found. Please login again.'
    // router.push('/signin') // ถ้าต้องการนำทางทันที ให้ uncomment
    return
  }
  loadProfile()
})

// ------- handlers -------
async function onSubmit() {
  // TODO: ใส่ logic ตรวจรหัสผ่านจริง (เช่น verify ที่ backend)
  // ตัวอย่าง flow ชั่วคราว: แค่ console.log แล้วไปหน้าแก้ไข
  try {
    loading.value = true
    errorMsg.value = ''
    // await verifyPassword(password.value) // สมมุติ
    console.log('password input:', password.value)
    // ไปหน้าถัดไปของคุณ
    // router.push('/profile/edit')
  } catch (e) {
    errorMsg.value = e?.message || 'ยืนยันรหัสผ่านไม่สำเร็จ'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-zinc-900 text-zinc-100 antialiased">
    <div class="mx-auto max-w-[1200px] p-6 md:p-10">
      <section
        class="rounded-3xl bg-[#0e0e0f] ring-1 ring-zinc-800 shadow-2xl overflow-hidden"
      >
        <div class="p-8 md:p-12 lg:p-16">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            <!-- left: brand + identity -->
            <div>
              <img
                src="/image/ITBM_SHOP.png"
                alt="logo"
                class="h-15"
              />

              <!-- email chip -->
              <div
                class="mt-7 inline-flex items-center rounded-full bg-zinc-900 ring-1 ring-zinc-800 hover:ring-zinc-700 transition px-3 py-2 text-sm"
              >
                <span
                  class="mr-2 grid h-6 w-6 place-items-center rounded-full bg-cyan-600 text-white text-[12px]"
                  aria-hidden="true"
                ></span>
                <span class="truncate max-w-[240px] sm:max-w-none">
                  {{ displayEmail }}
                </span>
              </div>

              <!-- error -->
              <p v-if="errorMsg" class="mt-4 text-sm text-red-400">
                {{ errorMsg }}
              </p>
            </div>
            <form
              class="w-full max-w-xl lg:justify-self-end"
              @submit.prevent="onSubmit"
            >
              <p class="text-zinc-300 mb-4">
                หากต้องการดำเนินการต่อ โปรดยืนยันก่อนว่าเป็นคุณ
              </p>

              <label for="password" class="sr-only">ป้อนรหัสผ่าน</label>
              <div
                class="rounded-xl bg-zinc-950/40 ring-1 ring-zinc-800 focus-within:ring-zinc-600 transition overflow-hidden"
              >
                <input
                  id="password"
                  v-model.trim="password"
                  :type="show ? 'text' : 'password'"
                  placeholder="ป้อนรหัสผ่าน"
                  class="w-full bg-transparent px-4 py-4 text-[15px] outline-none"
                  required
                  autocomplete="current-password"
                />
              </div>

              <label
                class="mt-4 flex items-center gap-3 text-sm text-zinc-300 select-none cursor-pointer"
              >
                <input
                  v-model="show"
                  type="checkbox"
                  class="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-cyan-500 focus:ring-cyan-500"
                />
                <span>แสดงรหัสผ่าน</span>
              </label>

              <div class="mt-8 flex items-center justify-between">
                <RouterLink
                 :to="{ name: 'ForgotPassword' }"
                  class="text-sm text-zinc-300 hover:text-white"
                >
                  หากลืมรหัสผ่าน
                </RouterLink>

                <button
                  type="submit"
                  :disabled="disabled"
                  class="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-[15px] font-medium shadow-lg shadow-blue-600/20 transition disabled:opacity-60 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-500 active:bg-blue-700"
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
                  ถัดไป
                </button>
              </div>
            </form>

          </div>
        </div>
      </section>
    </div>
  </div>
</template>

