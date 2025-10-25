<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/useAuthStore";
import { useFlashStore } from "@/store/useFlashStore";

const router = useRouter();
const auth = useAuthStore();
const flash = useFlashStore();

const form = ref({ email: "", password: "" });
const errorMessage = ref("");
const loading = ref(false);
const buttonDisabled = ref(true);

async function handleFormSubmit() {
  errorMessage.value = "";
  loading.value = true;
  try {
    const data = await auth.login(form.value.email.trim(), form.value.password);
    flash.setMessage(
      "Login successful!",
      "text-green-600 bg-green-50 p-2 rounded border border-green-200 shadow-sm"
    );
    const user = JSON.parse(localStorage.getItem("user"));
    if (user.userType === "SELLER") {
      router.replace("/sale-items/list");
    } else {
      router.replace("/sale-items");
    }
  } catch (e) {
    const required403 = "You need to activate your accout before signing in.";
    const raw = e?.message || "";

    if (raw === required403 || raw.includes("accout before signing in")) {
      errorMessage.value = required403;
    } else if (
      raw.toLowerCase().includes("username") ||
      raw.toLowerCase().includes("password")
    ) {
      errorMessage.value = "Email or Pasword is incorrect.";
    } else {
      errorMessage.value = raw || "Sign-in failed";
    }

    flash.setMessage(
      errorMessage.value,
      "itbms-message text-red-600 bg-red-50 p-2 rounded border border-red-200 shadow-sm"
    );
    console.error(e);
  } finally {
    loading.value = false;
  }
}

const showPassword = ref(false);
const togglePassword = () => (showPassword.value = !showPassword.value);
const focusNext = (nextId) => document.getElementById(nextId)?.focus();

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // simple email regex
  return regex.test(email);
};

// Watch for changes in email or password
watch(
  () => [form.value.email, form.value.password],
  ([newEmail, newPassword]) => {
    //
    if (!newEmail || !newPassword) {
      errorMessage.value = "Email and password are required.";
      buttonDisabled.value = true;
    } else if (!validateEmail(newEmail)) {
      errorMessage.value = "Invalid email format.";
      buttonDisabled.value = true;
    } else if (newEmail.length > 50) {
      errorMessage.value = "Invalid email format.";
      buttonDisabled.value = true;
    } else {
      errorMessage.value = "";
      buttonDisabled.value = false;
    }
  }
  // { immediate: true }
);
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Left side image -->
    <div class="hidden md:flex w-1/2">
      <img
        src="../../assets/heroBanner.png"
        alt="Sign In Illustration"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Right side form -->
    <div class="flex w-full md:w-1/2 justify-center items-center p-6">
      <div class="w-full max-w-md">
        <form
          @submit.prevent="handleFormSubmit"
          class="bg-white shadow-xl rounded-xl p-10 space-y-6"
        >
          <h2 class="text-3xl font-bold text-center text-gray-900">
            Welcome to ITB-MShop
          </h2>

          <div
            v-if="errorMessage"
            class="itbms-message rounded-md border border-red-300 bg-red-50 text-red-700 text-sm p-3 flex items-start gap-2"
          >
            <span aria-hidden="true">⚠️</span>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Email -->
          <!-- Email -->
          <div class="space-y-2">
            <label for="email" class="text-black font-medium">Email</label>
            <div class="relative">
              <input
                id="email"
                type="email"
                v-model.trim="form.email"
                required
                maxlength="50"
                placeholder="Enter your email"
                @keydown.enter="focusNext('password')"
                autocomplete="email"
                class="itbms-email h-12 w-full px-4 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition shadow-sm hover:shadow-md"
              />
            </div>
          </div>

          <!-- Password -->
          <div class="space-y-2">
            <label for="password" class="text-black font-medium"
              >Password</label
            >
            <div class="relative">
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password"
                required
                maxlength="14"
                placeholder="Enter your password"
                autocomplete="current-password"
                class="itbms-password h-12 w-full px-4 pr-12 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition shadow-sm hover:shadow-md"
              />
              <button
                type="button"
                @click="togglePassword"
                class="absolute inset-y-0 right-3 flex items-center text-black hover:text-gray-700 focus:outline-none"
                aria-label="Toggle password visibility"
              >
                {{ showPassword ? "🙈" : "👁️" }}
              </button>
            </div>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading || buttonDisabled"
            :class="[
              ' itbms-signin-button w-full py-3 rounded-lg font-semibold text-white shadow-md transition',
              loading || buttonDisabled
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-black hover:bg-blue-600 hover:shadow-lg',
            ]"
          >
            {{ loading ? "Signing in…" : "Sign In" }}
          </button>

          <!-- Extra Links -->
          <div class="text-center">

            <RouterLink
                 :to="{ name: 'ForgotPassword' }"
                  class="text-sm text-zinc-500 "
                >
                  Forgot password?
                </RouterLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
