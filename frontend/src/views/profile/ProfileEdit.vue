<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/useAuthStore'
import { getUserProfile, updateUserProfile } from '@/services/userService'

const router = useRouter()
const auth = useAuthStore()

const form = ref({
  nickName: '',
  email: '',
  fullName: '',
  userType: '',
  phoneNumber: '',
  bankAccount: '',
  bankName: '',
})
const original = ref({})
const loading = ref(true)
const saving = ref(false)
const errorMsg = ref('')

const isSeller = computed(
  () => (form.value.userType || '').toUpperCase() === 'SELLER'
)

// ตัดขีดเบอร์
function stripDashes(v) {
  return (v ?? '').toString().replace(/-/g, '')
}
const cleanMobile = computed(() => stripDashes(form.value.phoneNumber))

// ปุ่ม Save เปิดเมื่อ เปลี่ยนค่า + ผ่านเกณฑ์ความยาว
const canSave = computed(() => {
  if (loading.value || saving.value) return false
  const nn = form.value.nickName?.trim() ?? ''
  const fn = form.value.fullName?.trim() ?? ''
  const nickValid = nn.length > 0 && nn.length <= 40
  const fullValid = fn.length >= 4 && fn.length <= 40
  const changed =
    nn !== (original.value.nickName || '') ||
    fn !== (original.value.fullName || '')
  return nickValid && fullValid && changed
})

async function load() {
  loading.value = true
  errorMsg.value = ''

  if (!auth.userId || !auth.isLoggedIn) {
    router.push({ name: 'LoginView' })
    return
  }

  try {
    const p = await getUserProfile(auth.userId)
    form.value = { ...p, phoneNumber: stripDashes(p.phoneNumber) }
    original.value = { nickName: p.nickName, fullName: p.fullName }
  } catch (e) {
    errorMsg.value = e?.message || 'Cannot load profile'
  } finally {
    loading.value = false
  }
}

async function save() {
  if (!canSave.value) return
  if (!auth.userId || !auth.isLoggedIn) {
    router.push({ name: 'LoginView' })
    return
  }

  saving.value = true
  errorMsg.value = ''
  try {
    await updateUserProfile(auth.userId, {
      nickName: form.value.nickName?.trim(),
      fullName: form.value.fullName?.trim(),
    })
    router.push({ name: 'ProfileView' })
  } catch (e) {
    errorMsg.value = e?.message || 'Update failed'
  } finally {
    saving.value = false
  }
}

function cancel() {
  router.push({ name: 'ProfileView' })
}

onMounted(load)
</script>

<template>
  <div class="min-h-[calc(100vh-80px)] bg-white text-gray-900">
    <!-- Header -->
    <div class="container mx-auto px-4 pt-10 text-center">
      <h1 class="text-2xl font-semibold tracking-tight">Edit Profile</h1>
      <p class="text-sm text-gray-500">Update your account information</p>
    </div>

    <!-- Card -->
    <div class="container mx-auto px-4 py-8">
      <section class="max-w-xl mx-auto rounded-2xl border border-gray-200 bg-white shadow p-8">
        <!-- Avatar center -->
        <div class="w-24 h-24 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center mx-auto">
          <svg class="w-10 h-10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-3.33 0-10 1.67-10 5v1h20v-1c0-3.33-6.67-5-10-5Z"/>
          </svg>
        </div>
        <!-- Nickname under avatar -->
        <h2 class="mt-3 text-lg font-semibold text-center">
          {{ form.nickName || '—' }}
        </h2>

        <!-- Error -->
        <div v-if="errorMsg" class="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-red-700 text-sm text-center">
          {{ errorMsg }}
        </div>

        <!-- Loading skeleton -->
        <div v-if="loading" class="mt-6 space-y-4 animate-pulse">
          <div class="h-4 w-3/4 bg-gray-200 rounded"></div>
          <div class="h-4 w-2/3 bg-gray-200 rounded"></div>
          <div class="h-4 w-5/6 bg-gray-200 rounded"></div>
        </div>

        <!-- Form -->
        <div v-else class="mt-6">
          <!-- 2 คอลัมน์: label คงที่ / input ขยาย -->
          <div class="grid grid-cols-[140px_1fr] gap-y-4 gap-x-4">
            <!-- Nickname (editable) -->
            <label class="self-center text-sm text-gray-600">Nickname</label>
            <input
              v-model.trim="form.nickName"
              type="text"
              :maxlength="40"
              class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />

            <!-- Email (readonly) -->
            <label class="self-center text-sm text-gray-600">Email</label>
            <input
              :value="form.email"
              type="text"
              readonly
              class="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-600"
            />

            <!-- Fullname (editable) -->
            <label class="self-center text-sm text-gray-600">Fullname</label>
            <input
              v-model.trim="form.fullName"
              type="text"
              :maxlength="40"
              class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />

            <!-- Type (readonly) -->
            <label class="self-center text-sm text-gray-600">Type</label>
            <input
              :value="form.userType"
              type="text"
              readonly
              class="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-600 uppercase"
            />

            <!-- Seller extras (readonly) -->
            <template v-if="isSeller">
              <label class="self-center text-sm text-gray-600">Mobile</label>
              <input
                :value="cleanMobile"
                type="text"
                readonly
                class="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-600"
              />

              <label class="self-center text-sm text-gray-600">Bank Account No</label>
              <input
                :value="form.bankAccount"
                type="text"
                readonly
                class="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-600"
              />

              <label class="self-center text-sm text-gray-600">Bank Name</label>
              <input
                :value="form.bankName"
                type="text"
                readonly
                class="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-600"
              />
            </template>
          </div>

          <!-- Actions -->
          <div class="mt-8 flex justify-center gap-3">
            <button
              :disabled="!canSave"
              @click="save"
              class="px-5 py-2 rounded-lg font-medium text-white bg-black hover:bg-gray-900 active:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
            <button
              @click="cancel"
              class="px-5 py-2 rounded-lg font-medium bg-white text-gray-900 border border-gray-800 hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
