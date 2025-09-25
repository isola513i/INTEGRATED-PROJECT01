<script setup>
import { useRouter } from "vue-router";
import { ref, computed } from "vue";

const props = defineProps({
  isStillSubmit: Boolean,
});

const isDisabled = computed(() => {
  return (
    !buyerForm.value.nickName.trim() ||
    !buyerForm.value.fullName.trim() ||
    !buyerForm.value.email.trim() ||
    !buyerForm.value.password.trim() ||
    buyerForm.value.password.length < 8 ||
    props.isStillSubmit
  );
});
const buyerForm = ref({
  nickName: "",
  fullName: "",
  email: "",
  password: "",
  userType: "BUYER",
});

const focusNext = (nextIndex) => {
  const nextInputField = document.getElementById(nextIndex);
  if (nextInputField) nextInputField.focus();
};

const emit = defineEmits(["submitForm"]);
const router = useRouter();

function submitData() {
  emit("submitForm", buyerForm.value);
}
const handleCancel = () => {
  router.push({ path: "/" });
};
// 👇 state สำหรับเปิด/ปิด password
const showPassword = ref(false);
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <div class="flex justify-center min-h-screen text-black">
    <form
      @submit.prevent="submitData"
      class="bg-white p-8 rounded-2xl h-fit shadow-lg w-full max-w-lg border border-gray-100"
    >
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
        Buyer Registration
      </h2>

      <div class="grid grid-cols-12 gap-5">
        <!-- Nickname -->
        <label
          for="nickname"
          class="col-span-4 flex items-center font-medium text-gray-700"
        >
          Nickname
        </label>
        <div class="col-span-8">
          <input
            id="nickname"
            type="text"
            v-model.trim="buyerForm.nickName"
            class="itbms-nickname w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            @keydown.enter="focusNext('fullname')"
          />
        </div>
        <!-- Fullname -->
        <label
          for="fullname"
          class="col-span-4 flex items-center font-medium text-gray-700"
        >
          Fullname
        </label>
        <div class="col-span-8">
          <input
            id="fullname"
            type="text"
            v-model.trim="buyerForm.fullName"
            class="itbms-fullname w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            @keydown.enter="focusNext('email')"
          />
        </div>
        <!-- Email -->
        <label
          for="email"
          class="col-span-4 flex items-center font-medium text-gray-700"
        >
          Email
        </label>
        <div class="col-span-8">
          <input
            id="email"
            type="email"
            v-model.trim="buyerForm.email"
            class="itbms-email w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            @keydown.enter="focusNext('password')"
          />
        </div>

        <!-- Password -->
        <label
          for="password"
          class="col-span-4 flex items-center font-medium text-gray-700"
        >
          Password
        </label>
        <div class="col-span-8">
          <!-- กล่องเฉพาะ input -->
          <div class="relative h-12">
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              v-model.trim="buyerForm.password"
              minlength="8"
              maxlength="14"
              required
              dir="ltr"
              class="itbms-password h-full w-full border border-gray-300 rounded-lg px-4 pr-12 text-left focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition shadow-sm hover:shadow-md"
              @keydown.enter.prevent
              autocomplete="new-password"
            />
            <button
              type="button"
              @click="togglePassword"
              class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Toggle password visibility"
            >
              {{ showPassword ? "🙈" : "👁️" }}
            </button>
          </div>

          <!-- error เป็น sibling ไม่ให้ดันตำแหน่งปุ่ม -->
          <p
            v-if="buyerForm.password && buyerForm.password.length < 8"
            class="text-red-500 text-sm mt-1"
          >
            Password must be at least 8 characters
          </p>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex justify-end gap-4 mt-8">
        <button
          type="button"
          @click="handleCancel"
          class="itbms-cancel-button bg-gray-200 px-6 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isDisabled"
          :class="[
            'itbms-submit-button px-6 py-2.5 text-white rounded-lg font-medium shadow-md transition',
            isDisabled
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600',
          ]"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
