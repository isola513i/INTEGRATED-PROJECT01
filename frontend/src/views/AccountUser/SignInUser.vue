<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { signInUser } from "@/services/userService";
import { useFlashStore } from "@/store/useFlashStore";

const router = useRouter();
const flash = useFlashStore();
const errorMessage = ref(""); // แสดงข้อความ error ใต้ฟอร์ม
const form = ref({
  email: "",
  password: "",
});

const isDisabled = computed(() => {
  return !form.value.email.trim() || !form.value.password.trim();
});

const handleFormSubmit = async () => {
  errorMessage.value = "";
  try {
    const res = await signInUser(form.value.email, form.value.password);
    if (!res) {
      errorMessage.value = "Email or Password is Incorrect";
      flash.setMessage(
        "Email or Password is Incorrect",
        "text-red-500 bg-red-100 p-2 rounded shadow"
      );
    } else {
      errorMessage.value = "";
      flash.setMessage(
        "Login successful!",
        "text-green-500 bg-green-100 p-2 rounded shadow"
      );
      router.push("/");
    }
  } catch (err) {
    errorMessage.value = "Email or Password is Incorrect";
    flash.setMessage(
      "Email or Password is Incorrect",
      "text-red-500 bg-red-100 p-2 rounded shadow"
    );
    console.error(err);
  }
};

const showPassword = ref(false);
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const focusNext = (nextId) => {
  const el = document.getElementById(nextId);
  if (el) el.focus();
};
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
            Welcome to ITb-MShop
          </h2>
          <!-- Error message -->
          <p v-if="errorMessage" class="itbms-message text-red-500 mb-4">
            {{ errorMessage }}
          </p>

          <!-- Email -->
          <div class="flex flex-col">
            <label for="email" class="mb-2 text-black font-medium">Email</label>
            <input
              id="email"
              type="email"
              v-model.trim="form.email"
              required
              maxlength="50"
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
              placeholder="Enter your email"
              @keydown.enter="focusNext('password')"
              class="itbms-email px-4 py-3 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition shadow-sm hover:shadow-md"
            />
          </div>

          <!-- Password -->
          <div class="flex flex-col relative">
            <label for="password" class="mb-2 text-black font-medium"
              >Password</label
            >
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              v-model.trim="form.password"
              placeholder="Enter your password"
              required 
              maxlength="14"
              class="itbms-password px-4 py-3 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition shadow-sm hover:shadow-md pr-12"
            />
            <button
              type="button"
              @click="togglePassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-gray-700 focus:outline-none"
            >
              {{ showPassword ? "🙈" : "👁️" }}
            </button>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="isDisabled"
            :class="[
              'itbms-signin-button w-full py-3 rounded-lg font-semibold text-white shadow-md transition',
              isDisabled
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 hover:shadow-lg',
            ]"
          >
            Sign In
          </button>

          <!-- Extra Links -->
          <div class="text-center">
            <a href="#" class="text-sm text-blue-500 hover:underline">
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
