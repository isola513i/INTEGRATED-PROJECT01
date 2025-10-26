<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { resetPassword } from "@/services/userService";

import eyeIcon from "@/assets/images/eye.png";
import eyeOffIcon from "@/assets/images/view.png";

const route = useRoute();
const router = useRouter();

// token from query (?token=...)
const token = route.query.token;
console.log("Reset token:", token);

const newPassword = ref("");
const confirmNewPassword = ref("");

const showNew = ref(false);
const showConfirm = ref(false);

const loading = ref(false);
const errorMsg = ref("");
const successMsg = ref("");
const passHasMinLen = computed(() => newPassword.value.length >= 8);
const passHasNumber = computed(() => /\d/.test(newPassword.value));
const passHasUpperLower = computed(
  () => /[A-Z]/.test(newPassword.value) && /[a-z]/.test(newPassword.value)
);
// button disabled state
const disabled = computed(
  () =>
    loading.value ||
    newPassword.value.trim().length < 6 ||
    confirmNewPassword.value.trim().length < 6 ||
    newPassword.value !== confirmNewPassword.value
);

function toggleShowNew() {
  showNew.value = !showNew.value;
}
function toggleShowConfirm() {
  showConfirm.value = !showConfirm.value;
}

async function onSubmit() {
  loading.value = true;
  errorMsg.value = "";
  successMsg.value = "";

  try {
    await resetPassword(token, newPassword.value, confirmNewPassword.value);
    successMsg.value =
      "Password changed successfully! Redirecting to sign-in page...";
    setTimeout(() => router.push("/signin"), 2500);
  } catch (err) {
    errorMsg.value =
      err?.message ||
      "Unable to change password. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 px-4 py-10 text-gray-900"
  >
    <div
      class="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-2xl border border-white/60 ring-1 ring-gray-200 p-8"
    >
      <!-- Header / Branding -->
      <div class="flex flex-col items-center text-center">
      
        <h1 class="mt-4 text-[20px] font-semibold text-gray-900 leading-tight">
          Set a New Password
        </h1>
        <p class="text-[14px] text-gray-500 mt-1">
          Please enter your new password to reset your account.
        </p>
      </div>

      <!-- Alerts -->
      <div v-if="errorMsg" class="mt-4 text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-center">
        {{ errorMsg }}
      </div>

      <div v-if="successMsg" class="mt-4 text-[13px] text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-center">
        {{ successMsg }}
      </div>

      <!-- Form -->
      <form class="mt-6 text-left space-y-5" @submit.prevent="onSubmit">
        <!-- New Password -->
        <div>
          <label
            for="newPassword"
            class="block text-[14px] text-gray-800 font-medium mb-2"
          >
            New Password
          </label>

          <div class="relative">
            <input
              id="newPassword"
              v-model.trim="newPassword"
              :type="showNew ? 'text' : 'password'"
              placeholder="Enter new password"
              class="w-full py-3 px-4 pr-12 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 text-[15px] shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />

            <button
              type="button"
              class="absolute inset-y-0 right-3 flex items-center"
              @click="toggleShowNew"
              tabindex="-1"
            >
              <img
                :src="showNew ? eyeOffIcon : eyeIcon"
                class="w-5 h-5 opacity-70 hover:opacity-100 transition"
                alt="toggle visibility"
              />
            </button>
          </div>

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

        <!-- Confirm New Password -->
        <div>
          <label
            for="confirmNewPassword"
            class="block text-[14px] text-gray-800 font-medium mb-2"
          >
            Confirm New Password
          </label>

          <div class="relative">
            <input
              id="confirmNewPassword"
              v-model.trim="confirmNewPassword"
              :type="showConfirm ? 'text' : 'password'"
              placeholder="Re-enter new password"
              class="w-full py-3 px-4 pr-12 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 text-[15px] shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />

            <button
              type="button"
              class="absolute inset-y-0 right-3 flex items-center"
              @click="toggleShowConfirm"
              tabindex="-1"
            >
              <img
                :src="showConfirm ? eyeOffIcon : eyeIcon"
                class="w-5 h-5 opacity-70 hover:opacity-100 transition"
                alt="toggle visibility"
              />
            </button>
          </div>

          <p
            v-if="
              newPassword &&
              confirmNewPassword &&
              newPassword !== confirmNewPassword
            "
            class="mt-2 text-[13px] text-red-500 text-center font-medium"
          >
            Passwords do not match
          </p>
        </div>

        <!-- Submit button -->
        <button
          type="submit"
          :disabled="disabled"
          class="w-full flex items-center justify-center rounded-xl bg-black text-white text-[15px] font-medium py-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 active:bg-gray-950 transition"
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

      <!-- footer nav -->
      <div class="mt-8 text-[13px] text-gray-600 text-center">
        <button
          type="button"
          @click="router.push({ name: 'SignIn' })"
          class="text-gray-800 font-medium hover:underline hover:text-black transition"
        >
          Back to Sign In
        </button>
      </div>
    </div>
  </div>
</template>
