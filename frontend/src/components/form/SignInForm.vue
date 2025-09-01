<script setup>
import { ref, computed } from "vue";

// ข้อมูล form
const form = ref({
  email: "",
  password: "",
});

// ตรวจสอบว่ากรอกครบไหม
const isDisabled = computed(() => {
  return !form.value.email.trim() || !form.value.password.trim();
});

// emit event ให้ parent
const emit = defineEmits(["submitForm"]);

const submitData = () => {
  console.log("Child submit:", form.value);
  emit("submitForm", form.value);
};

// toggle password
const showPassword = ref(false);
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// focus input ต่อไป
const focusNext = (nextId) => {
  const el = document.getElementById(nextId);
  if (el) el.focus();
};
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-50">
    <form
      @submit.prevent="submitData"
      class="bg-white shadow-lg rounded-xl p-10 w-full max-w-md"
    >
      <h2 class="text-3xl font-bold text-center mb-8 text-gray-800">
        Welcome Back
      </h2>

      <!-- Email -->
      <div class="mb-6">
        <label class="block mb-2 text-gray-700 font-medium">Email</label>
        <input
          id="email"
          type="email"
          v-model.trim="form.email"
          placeholder="Enter your email"
          @keydown.enter="focusNext('password')"
          class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
        />
      </div>

      <!-- Password -->
      <div class="mb-6 relative">
        <label class="block mb-2 text-gray-700 font-medium">Password</label>
        <input
          id="password"
          :type="showPassword ? 'text' : 'password'"
          v-model.trim="form.password"
          placeholder="Enter your password"
          class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition pr-12"
        />
        <button
          type="button"
          @click="togglePassword"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {{ showPassword ? "🙈" : "👁️" }}
        </button>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isDisabled"
        :class="[
          'w-full py-3 rounded-lg font-semibold text-white transition shadow-md',
          isDisabled ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
        ]"
      >
        Sign In
      </button>

      <!-- Extra Links -->
      <div class="mt-4 text-center">
        <a href="#" class="text-sm text-blue-500 hover:underline">
          Forgot password?
        </a>
      </div>
    </form>
  </div>
</template>
