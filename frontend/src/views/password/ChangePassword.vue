<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { changePassword } from "@/services/userService";
import { useAuthStore } from "@/store/useAuthStore";
import eyeIcon from "@/assets/images/eye.png";
import eyeOffIcon from "@/assets/images/view.png";

const router = useRouter();
const auth = useAuthStore();
const oldPassword = ref("");
const newPassword = ref("");
const confirmNewPassword = ref("");
const showOld = ref(false);
const showNew = ref(false);
const showConfirm = ref(false);
const toggleShowOld = () => (showOld.value = !showOld.value);
const toggleShowNew = () => (showNew.value = !showNew.value);
const toggleShowConfirm = () => (showConfirm.value = !showConfirm.value);
const passHasMinLen = computed(() => newPassword.value.length >= 8);
const passHasNumber = computed(() => /\d/.test(newPassword.value));
const passHasUpperLower = computed(
  () => /[A-Z]/.test(newPassword.value) && /[a-z]/.test(newPassword.value)
);

const loading = ref(false);
const errorMsg = ref("");
const successMsg = ref("");

// disable button if invalid
const disabled = computed(
  () =>
    loading.value ||
    oldPassword.value.trim().length === 0 ||
    !passHasMinLen.value ||
    !passHasNumber.value ||
    !passHasUpperLower.value ||
    confirmNewPassword.value.trim().length === 0 ||
    newPassword.value !== confirmNewPassword.value
);

async function onSubmit() {
  loading.value = true;
  errorMsg.value = "";
  successMsg.value = "";
  try {
    if (!auth.userId) {
      throw new Error("User not authenticated. Please log in again.");
    }
    await changePassword(auth.userId,oldPassword.value, newPassword.value,confirmNewPassword.value)
    successMsg.value = 'Password changed successfully!'
    setTimeout(() => router.push('/profile'), 2000)
  } catch (err) {
    errorMsg.value =
      err?.message || "Unable to change password. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-white px-4 py-10 text-gray-900"
  >
    <div
      class="w-full max-w-md bg-white rounded-xl shadow-lg ring-1 ring-gray-200 p-8"
    >
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-[20px] font-semibold text-gray-900 leading-tight">
          Change Password
        </h1>
        <p class="text-[14px] text-gray-500 mt-1">
          Please enter your current password and set a new one.
        </p>
      </div>

      <!-- Form -->
      <form class="mt-8 space-y-6" @submit.prevent="onSubmit">
        <!-- Current Password -->
        <div>
          <label class="block text-[14px] text-gray-800 font-medium mb-2">
            Current Password
          </label>
          <div class="relative">
            <input
              v-model.trim="oldPassword"
              :type="showOld ? 'text' : 'password'"
              placeholder="••••••••"
              autocomplete="current-password"
              class="w-full py-3 px-5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-base"
              required
            />
            <button
              type="button"
              class="absolute inset-y-0 right-3 flex items-center"
              @click="toggleShowOld"
            >
              <img
                :src="showOld ? eyeOffIcon : eyeIcon"
                class="w-5 h-5 opacity-80 hover:opacity-100 transition"
              />
            </button>
          </div>
        </div>

        <!-- New Password -->
        <div>
          <label class="block text-[14px] text-gray-800 font-medium mb-2">
            New Password
          </label>
          <div class="relative">
            <input
              v-model.trim="newPassword"
              :type="showNew ? 'text' : 'password'"
              placeholder="New Password"
              autocomplete="new-password"
              class="w-full py-3 px-5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-base"
              required
            />
            <button
              type="button"
              class="absolute inset-y-0 right-3 flex items-center"
              @click="toggleShowNew"
            >
              <img
                :src="showNew ? eyeOffIcon : eyeIcon"
                class="w-5 h-5 opacity-80 hover:opacity-100 transition"
              />
            </button>
          </div>

          <!-- Password checklist -->
          <!-- password rules with checkmark -->
          <ul class="mt-3 space-y-2 text-sm text-gray-700">
            <!-- Rule 1 -->
            <li class="flex items-start gap-2">
              <span
                class="flex items-center justify-center h-4 w-4 rounded border text-[10px] font-semibold leading-none"
                :class="
                  passHasMinLen
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-400 text-transparent'
                "
              >
                ✓
              </span>
              <span>At least 8 characters</span>
            </li>

            <!-- Rule 2 -->
            <li class="flex items-start gap-2">
              <span
                class="flex items-center justify-center h-4 w-4 rounded border text-[10px] font-semibold leading-none"
                :class="
                  passHasNumber
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-400 text-transparent'
                "
              >
                ✓
              </span>
              <span>Contains at least one number</span>
            </li>

            <!-- Rule 3 -->
            <li class="flex items-start gap-2">
              <span
                class="flex items-center justify-center h-4 w-4 rounded border text-[10px] font-semibold leading-none"
                :class="
                  passHasUpperLower
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-400 text-transparent'
                "
              >
                ✓
              </span>
              <span
                >Contains both uppercase and lowercase letters (A–Z, a–z)</span
              >
            </li>
          </ul>
        </div>

        <!-- Confirm Password -->
        <div>
          <label class="block text-[14px] text-gray-800 font-medium mb-2">
            Confirm New Password
          </label>
          <div class="relative">
            <input
              v-model.trim="confirmNewPassword"
              :type="showConfirm ? 'text' : 'password'"
              placeholder="Re-enter new password"
              autocomplete="new-password"
              class="w-full py-3 px-5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-base"
              required
            />
            <button
              type="button"
              class="absolute inset-y-0 right-3 flex items-center"
              @click="toggleShowConfirm"
            >
              <img
                :src="showConfirm ? eyeOffIcon : eyeIcon"
                class="w-5 h-5 opacity-80 hover:opacity-100 transition"
              />
            </button>
          </div>
        </div>

        <!-- Password mismatch -->
        <p
          v-if="
            newPassword &&
            confirmNewPassword &&
            newPassword !== confirmNewPassword
          "
          class="text-[13px] text-red-500"
        >
          Passwords do not match.
        </p>

        <!-- Error / Success -->
        <p v-if="errorMsg" class="text-[13px] text-red-500 text-center">
          {{ errorMsg }}
        </p>
        <p v-if="successMsg" class="text-[13px] text-green-600 text-center">
          {{ successMsg }}
        </p>

        <!-- Submit button -->
        <button
          type="submit"
          :disabled="disabled"
          class="w-full flex items-center justify-center rounded-md bg-black text-white text-[15px] font-medium py-2.5 shadow disabled:opacity-60 disabled:cursor-not-allowed hover:bg-gray-800 transition"
        >
          <svg
            v-if="loading"
            class="-ml-1 mr-2 h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
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

      <!-- Back -->
      <div class="mt-8 text-[13px] text-gray-600 text-center">
        <button
          type="button"
          @click="router.push({ name: 'Profile' })"
          class="text-black font-medium hover:underline"
        >
          Back to Profile
        </button>
      </div>
    </div>
  </div>
</template>
