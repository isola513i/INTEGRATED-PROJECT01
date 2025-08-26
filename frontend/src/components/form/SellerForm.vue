<script setup>
import { previewBinaryFile } from "@/services/previewBinary";
import { ref, watch ,computed } from "vue";
import { useRouter } from "vue-router";

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

const previewFront = ref(null);
const previewBack = ref(null);


const emit = defineEmits(["submitForm"]);
const router = useRouter();

// refs สำหรับ input file
const inputRefsFront = ref(null)
const inputRefsBack = ref(null)

function removeFile(side) {
  if (side === "front") {
    sellerForm.value.idCardImageFront = null
    previewFront.value = null
    if (inputRefsFront.value) inputRefsFront.value.value = null
  } else if (side === "back") {
    sellerForm.value.idCardImageBack = null
    previewBack.value = null
    if (inputRefsBack.value) inputRefsBack.value.value = null
  }
}

function submitData() {
  emit("submitForm", sellerForm.value);
}

const handleCancel = () => {
  router.push({ path: "/" });
};

// Watch image เพื่อสร้าง preview
watch(
  () => sellerForm.value.idCardImageFront,
  (file) => {
    if (file) {
      previewFront.value = previewBinaryFile(file);
    } else {
      previewFront.value = null;
    }
  }
);

watch(
  () => sellerForm.value.idCardImageBack,
  (file) => {
    if (file) {
      previewBack.value = previewBinaryFile(file);
    } else {
      previewBack.value = null;
    }
  }
);

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
    !sellerForm.value.idCardImageBack
  );
});
</script>

<template>
  <div class="flex justify-center items-center min-h-screen text-black">
    <form
      @submit.prevent="submitData"
      class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg border border-gray-100"
    >
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
        Seller Registration
      </h2>

      <div class="grid grid-cols-12 gap-5">
        <!-- Nickname -->
        <label class="col-span-4 flex items-center font-medium text-gray-700"
          >Nickname</label
        >
        <div class="col-span-8">
          <input
            v-model.trim="sellerForm.nickName"
            type="text"
            class="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          />
        </div>

        <!-- Fullname -->
        <label class="col-span-4 flex items-center font-medium text-gray-700"
          >Fullname</label
        >
        <div class="col-span-8">
          <input
            v-model.trim="sellerForm.fullName"
            type="text"
            class="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          />
        </div>

        <!-- Email -->
        <label class="col-span-4 flex items-center font-medium text-gray-700"
          >Email</label
        >
        <div class="col-span-8">
          <input
            v-model.trim="sellerForm.email"
            type="email"
            class="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          />
        </div>

        <!-- Password -->
        <label class="col-span-4 flex items-center font-medium text-gray-700"
          >Password</label
        >
        <div class="col-span-8">
          <input
            v-model.trim="sellerForm.password"
            type="password"
            class="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          />
        </div>

        <!-- Mobile -->
        <label class="col-span-4 flex items-center font-medium text-gray-700"
          >Mobile</label
        >
        <div class="col-span-8">
          <input
            v-model.trim="sellerForm.phoneNumber"
            type="text"
            class="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          />
        </div>

        <!-- Bank Account No -->
        <label class="col-span-4 flex items-center font-medium text-gray-700"
          >Bank Account No</label
        >
        <div class="col-span-8">
          <input
            v-model.trim="sellerForm.bankAccount"
            type="text"
            class="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          />
        </div>

        <!-- Bank Name -->
        <label class="col-span-4 flex items-center font-medium text-gray-700"
          >Bank Name</label
        >
        <div class="col-span-8">
          <input
            v-model.trim="sellerForm.bankName"
            type="text"
            class="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          />
        </div>

        <!-- National Card No -->
        <label class="col-span-4 flex items-center font-medium text-gray-700"
          >National Card No</label
        >
        <div class="col-span-8">
          <input
            v-model.trim="sellerForm.idCardNumber"
            type="text"
            class="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          />
        </div>

        <!-- Card Front -->
        <label class="col-span-4 flex items-center font-medium text-gray-700"
          >Card Front</label
        >
        <div class="col-span-8 flex flex-col gap-2">
          <input
            type="file"
            ref="inputRefsFront"
            accept="image/*"
            @change="(e) => (sellerForm.idCardImageFront = e.target.files[0])"
            class="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          />
          <div v-if="previewFront" class="relative w-40 h-24 mt-2">
            <img
              :src="previewFront"
              class="object-cover w-full h-full rounded border"
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
        <label class="col-span-4 flex items-center font-medium text-gray-700"
          >Card Back</label
        >
        <div class="col-span-8 flex flex-col gap-2">
          <input
            type="file"
            ref="inputRefsBack"
            accept="image/*"
            @change="(e) => (sellerForm.idCardImageBack = e.target.files[0])"
            class="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          />
          <div v-if="previewBack" class="relative w-40 h-24 mt-2">
            <img
              :src="previewBack"
              class="object-cover w-full h-full rounded border"
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
      </div>

      <!-- Buttons -->
      <div class="flex justify-end gap-4 mt-8">
        <button
          type="button"
          @click="handleCancel"
          class="bg-gray-200 px-6 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isDisabled"
          :class="[
            'px-6 py-2.5 text-white rounded-lg font-medium shadow-md transition',
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
