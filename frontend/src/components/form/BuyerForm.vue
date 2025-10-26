<script setup>
import { useRouter } from "vue-router";
import { ref, computed } from "vue";

const props = defineProps({
  isStillSubmit: Boolean,
});

// รูปตาโชว์/ซ่อน
import eyeIcon from "@/assets/images/eye.png";
import eyeOffIcon from "@/assets/images/view.png";

const emit = defineEmits(["submitForm"]);
const router = useRouter();

const buyerForm = ref({
  nickName: "",
  fullName: "",
  email: "",
  password: "",
  userType: "BUYER",
});

const showPassword = ref(false);
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// password validation states
const passHasMinLen = computed(() => buyerForm.value.password.length >= 8);
const passHasNumber = computed(() => /\d/.test(buyerForm.value.password));
const passHasUpperLower = computed(
  () =>
    /[A-Z]/.test(buyerForm.value.password) &&
    /[a-z]/.test(buyerForm.value.password)
);

const isDisabled = computed(() => {
  return (
    !buyerForm.value.nickName.trim() ||
    !buyerForm.value.fullName.trim() ||
    !buyerForm.value.email.trim() ||
    !passHasMinLen.value ||
    !passHasNumber.value ||
    !passHasUpperLower.value ||
    props.isStillSubmit
  );
});

const focusNext = (nextId) => {
  const el = document.getElementById(nextId);
  el && el.focus();
};

function submitData() {
  const payload = {
    ...buyerForm.value,
    nickName: buyerForm.value.nickName.trim(),
    fullName: buyerForm.value.fullName.trim(),
    email: buyerForm.value.email.trim(),
    password: buyerForm.value.password,
  };
  emit("submitForm", payload);
}

const handleCancel = () => {
  router.push({ path: "/" });
};
</script>

<template>
  <div class="mx-2 text-gray-800">
    <!-- Title -->
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Buyer Information</h3>

    <form @submit.prevent="submitData" class="space-y-6">
      <!-- Nickname -->
      <div class="flex flex-col">
        <label for="nickname" class="text-sm font-medium text-gray-700 mb-1">
          Nickname
        </label>

        <input
          id="nickname"
          type="text"
          v-model.trim="buyerForm.nickName"
          class="w-full py-3 px-5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-base"
          @keydown.enter="focusNext('fullname')"
        />
      </div>

      <!-- Fullname -->
      <div class="flex flex-col">
        <label for="fullname" class="text-sm font-medium text-gray-700 mb-1">
          Fullname
        </label>

        <input
          id="fullname"
          type="text"
          v-model.trim="buyerForm.fullName"
          class="w-full py-3 px-5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-base"
          @keydown.enter="focusNext('email')"
        />
      </div>

      <!-- Email -->
      <div class="flex flex-col">
        <label for="email" class="text-sm font-medium text-gray-700 mb-1">
          Email
        </label>

        <input
          id="email"
          type="email"
          v-model.trim="buyerForm.email"
          class="w-full py-3 px-5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-base"
          @keydown.enter="focusNext('password')"
        />
      </div>

      <!-- Password -->
      <div class="flex flex-col">
        <label for="password" class="text-sm font-medium text-gray-700 mb-1">
          Password
        </label>

        <div class="relative">
          <input
            id="password"
            :type="showPassword ? 'text' : 'password'"
            v-model="buyerForm.password"
            minlength="8"
            maxlength="14"
            required
            dir="ltr"
            autocomplete="new-password"
            class="w-full py-3 px-5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-base"
            @keydown.enter.prevent
          />

          <button
            type="button"
            @click="togglePassword"
            class="absolute inset-y-0 right-3 flex items-center focus:outline-none"
            aria-label="Toggle password visibility"
          >
            <img
              :src="showPassword ? eyeOffIcon : eyeIcon"
              alt="Toggle password visibility"
              class="w-5 h-5 opacity-80 hover:opacity-100 transition"
            />
          </button>
        </div>

        <!-- error แดง -->
        <p
          v-if="buyerForm.password && buyerForm.password.length < 8"
          class="text-red-500 text-sm mt-1"
        >
          Password must be at least 8 characters
        </p>

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

      <div
        class="flex flex-col md:flex-row justify-end gap-3 pt-4 border-t border-gray-200"
      >
        <!-- Cancel -->
        <button
          type="button"
          @click="handleCancel"
          class="h-11 min-w-[96px] px-4 rounded-lg border border-gray-300 bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 active:bg-gray-300 transition-colors"
        >
          Cancel
        </button>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="isDisabled"
          :class="[
            'h-11 min-w-[96px] px-4 rounded-lg font-medium text-white shadow-sm transition-colors',
            isDisabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800',
          ]"
        >
          Save
        </button>
      </div>
    </form>
  </div>
</template>
