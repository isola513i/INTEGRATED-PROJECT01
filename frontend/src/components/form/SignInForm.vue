<script setup>
import { ref, computed } from "vue";

const SignInForm = ref({
  email: "",
  password: "",
});

const isDisabled = computed(() => {
  return !SignInForm.value.email.trim() || !SignInForm.value.password.trim();
});

const emit = defineEmits(["submitForm"]);

function submitData() {
  emit("submitForm", SignInForm.value);
}

const showPassword = ref(false);
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <div class="flex justify-center min-h-screen text-black">
    <form
      @submit.prevent="submitData"
      class="p-8  h-fit w-full max-w-lg"
    >
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
        Welcome To ITB-MShop
      </h2>

      <div class="space-y-5">
        <!-- Email -->
        <div>
          <label
            for="email"
            class="block mb-2 font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            v-model.trim="SignInForm.email"
            class="itbms-email w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          />
        </div>

        <!-- Password -->
        <div>
          <label
            for="password"
            class="block mb-2 font-medium text-gray-700"
          >
            Password
          </label>
          <div class="relative">
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              v-model.trim="SignInForm.password"
              class="itbms-password w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition pr-12"
            />
            <!-- toggle button -->
            <button
              type="button"
              @click="togglePassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {{ showPassword ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex mt-8">
        <button
          type="submit"
          :disabled="isDisabled"
          :class="[ 
            'itbms-submit-button w-full px-6 py-2.5 text-white rounded-lg font-medium shadow-md transition',
            isDisabled
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600',
          ]"
        >
          Sign In
        </button>
      </div>
    </form>
  </div>
</template>
