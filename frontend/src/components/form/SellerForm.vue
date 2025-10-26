<script setup>
import { previewBinaryFile } from "@/services/previewBinary";
import { ref, watch, computed } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  isStillSubmit: Boolean,
});

const emit = defineEmits(["submitForm"]);
const router = useRouter();

const sellerForm = ref({
  nickName: "",
  userType: "SELLER",
  fullName: "",
  email: "",
  password: "",
  phoneNumber: "",
  bankAccount: "",
  bankName: "",
  idCardNumber: "",
  idCardImageFront: null,
  idCardImageBack: null,
});

// password validations
const passHasMinLen = computed(() => sellerForm.value.password.length >= 8);
const passHasNumber = computed(() => /\d/.test(sellerForm.value.password));
const passHasUpperLower = computed(
  () =>
    /[A-Z]/.test(sellerForm.value.password) &&
    /[a-z]/.test(sellerForm.value.password)
);

// toggle password visibility
import eyeIcon from "@/assets/images/eye.png";
import eyeOffIcon from "@/assets/images/view.png";
const showPassword = ref(false);
const togglePassword = () => (showPassword.value = !showPassword.value);

// preview ID card images
const previewFront = ref(null);
const previewBack = ref(null);
const inputRefsFront = ref(null);
const inputRefsBack = ref(null);

watch(
  () => sellerForm.value.idCardImageFront,
  (file) => (previewFront.value = file ? previewBinaryFile(file) : null)
);
watch(
  () => sellerForm.value.idCardImageBack,
  (file) => (previewBack.value = file ? previewBinaryFile(file) : null)
);

function removeFile(side) {
  if (side === "front") {
    sellerForm.value.idCardImageFront = null;
    previewFront.value = null;
    if (inputRefsFront.value) inputRefsFront.value.value = null;
  } else {
    sellerForm.value.idCardImageBack = null;
    previewBack.value = null;
    if (inputRefsBack.value) inputRefsBack.value.value = null;
  }
}

// disable submit logic
const isDisabled = computed(() => {
  return (
    !sellerForm.value.nickName?.trim() ||
    !sellerForm.value.fullName?.trim() ||
    !sellerForm.value.email?.trim() ||
    !sellerForm.value.password?.trim() ||
    !sellerForm.value.phoneNumber?.trim() ||
    !sellerForm.value.bankAccount?.trim() ||
    !sellerForm.value.bankName?.trim() ||
    !sellerForm.value.idCardNumber?.trim() ||
    !sellerForm.value.idCardImageFront ||
    !sellerForm.value.idCardImageBack ||
    sellerForm.value.password.length < 8 ||
    props.isStillSubmit
  );
});

function submitData() {
  emit("submitForm", sellerForm.value);
}

function handleCancel() {
  router.push({ path: "/" });
}
</script>

<template>
  <div class="mx-2 text-gray-800">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>

    <form @submit.prevent="submitData" class="space-y-6">
      <!-- Nickname -->
      <div>
        <label
          for="nickname"
          class="text-sm font-medium text-gray-700 mb-1 block"
        >
          Nickname
        </label>
        <input
          id="nickname"
          v-model.trim="sellerForm.nickName"
          type="text"
          class="w-full py-3 px-5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-base"
        />
      </div>

      <!-- Fullname -->
      <div>
        <label
          for="fullname"
          class="text-sm font-medium text-gray-700 mb-1 block"
        >
          Fullname
        </label>
        <input
          id="fullname"
          v-model.trim="sellerForm.fullName"
          type="text"
          class="w-full py-3 px-5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-base"
        />
      </div>

      <!-- Email -->
      <div>
        <label for="email" class="text-sm font-medium text-gray-700 mb-1 block">
          Email
        </label>
        <input
          id="email"
          v-model.trim="sellerForm.email"
          type="email"
          class="w-full py-3 px-5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-base"
        />
      </div>

      <!-- Password -->
      <div>
        <label
          for="password"
          class="text-sm font-medium text-gray-700 mb-1 block"
        >
          Password
        </label>
        <div class="relative">
          <input
            id="password"
            :type="showPassword ? 'text' : 'password'"
            v-model.trim="sellerForm.password"
            minlength="8"
            maxlength="14"
            autocomplete="new-password"
            class="w-full py-3 px-5 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-base"
          />
          <button
            type="button"
            @click="togglePassword"
            class="absolute inset-y-0 right-3 flex items-center focus:outline-none"
            aria-label="Toggle password visibility"
          >
            <img
              :src="showPassword ? eyeOffIcon : eyeIcon"
              alt="Toggle visibility"
              class="w-5 h-5 opacity-80 hover:opacity-100 transition"
            />
          </button>
        </div>

        <p
          v-if="sellerForm.password && sellerForm.password.length < 8"
          class="text-red-500 text-sm mt-1"
        >
          Password must be at least 8 characters
        </p>

        <!-- password checklist ✅ -->
        <ul class="mt-3 space-y-2 text-sm text-gray-700">
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

      <!-- Phone Number -->
      <div>
        <label
          for="phoneNumber"
          class="text-sm font-medium text-gray-700 mb-1 block"
        >
          Phone Number
        </label>
        <input
          id="phoneNumber"
          v-model.trim="sellerForm.phoneNumber"
          type="text"
          class="w-full py-3 px-5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-base"
        />
      </div>

      <!-- Bank Account -->
      <div>
        <label
          for="bankAccount"
          class="text-sm font-medium text-gray-700 mb-1 block"
        >
          Bank Account No
        </label>
        <input
          id="bankAccount"
          v-model.trim="sellerForm.bankAccount"
          type="text"
          class="w-full py-3 px-5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-base"
        />
      </div>

      <!-- Bank Name -->
      <div>
        <label
          for="bankName"
          class="text-sm font-medium text-gray-700 mb-1 block"
        >
          Bank Name
        </label>
        <input
          id="bankName"
          v-model.trim="sellerForm.bankName"
          type="text"
          class="w-full py-3 px-5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-base"
        />
      </div>

      <!-- ID Card Number -->
      <div>
        <label
          for="idCardNumber"
          class="text-sm font-medium text-gray-700 mb-1 block"
        >
          National Card No
        </label>
        <input
          id="idCardNumber"
          v-model.trim="sellerForm.idCardNumber"
          type="text"
          class="w-full py-3 px-5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition text-base"
        />
      </div>

      <!-- Card Front -->
      <div>
        <label class="text-sm font-medium text-gray-700 mb-1 block">
          Card Front
        </label>
        <input
          type="file"
          ref="inputRefsFront"
          accept="image/*"
          @change="(e) => (sellerForm.idCardImageFront = e.target.files[0])"
          class="w-full py-3 px-5 border border-gray-300 rounded-xl file:mr-4 file:py-2 file:px-3 file:rounded-md file:border file:border-gray-300 file:bg-gray-100 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
        />
        <div v-if="previewFront" class="relative w-40 h-24 mt-3">
          <img
            :src="previewFront"
            class="object-cover w-full h-full rounded border border-gray-300"
          />
          <button
            type="button"
            @click="removeFile('front')"
            class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Card Back -->
      <div>
        <label class="text-sm font-medium text-gray-700 mb-1 block">
          Card Back
        </label>
        <input
          type="file"
          ref="inputRefsBack"
          accept="image/*"
          @change="(e) => (sellerForm.idCardImageBack = e.target.files[0])"
          class="w-full py-3 px-5 border border-gray-300 rounded-xl file:mr-4 file:py-2 file:px-3 file:rounded-md file:border file:border-gray-300 file:bg-gray-100 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
        />
        <div v-if="previewBack" class="relative w-40 h-24 mt-3">
          <img
            :src="previewBack"
            class="object-cover w-full h-full rounded border border-gray-300"
          />
          <button
            type="button"
            @click="removeFile('back')"
            class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
          >
            ✕
          </button>
        </div>
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
