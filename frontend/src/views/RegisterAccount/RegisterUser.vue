<script setup>
import { ref } from "vue";
import BuyerForm from "@/components/form/BuyerForm.vue";
import SellerForm from "@/components/form/SellerForm.vue";
import { registerUser } from "@/services/userService";
import { useRouter } from "vue-router";
import { useFlashStore } from "@/store/useFlashStore";
const router = useRouter();
const flash = useFlashStore();
const activeForm = ref("buyer");

const isStillSubmitting = ref(false);

async function handleFormSubmit(data) {
  const formData = new FormData();

  if (data.phoneNumber != null) {
    data.phoneNumber = String(data.phoneNumber).replace(/\D/g, "");
  }
  if (data.bankAccount != null) {
    data.bankAccount = String(data.bankAccount).replace(/\D/g, "");
  }

  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });

  try {
    isStillSubmitting.value = true;

    const response = await registerUser(formData);

    if (response) {
      flash.setMessage(
        "The user account has been successfully registered.",
        "itbms-message m-4 p-4 bg-green-100 text-green-800 shadow"
      );
      router.push("/sale-items");
    }
  } catch (error) {
    console.error("Failed to register user:", error);
  } finally {
    isStillSubmitting.value = false;
  }
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-6"
  >
    <div
      class="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8 flex flex-col gap-6"
    >
      <h2 class="text-2xl font-semibold text-gray-800 text-center">Register</h2>
      <div class="flex w-full justify-between">
        <button
          type="button"
          class="flex-1 pb-2 text-lg font-medium transition-all duration-200 text-center"
          :class="[
            activeForm === 'buyer'
              ? 'text-gray-900 border-b-4 border-gray-900'
              : 'text-gray-400 hover:text-gray-700',
          ]"
          @click="activeForm = 'buyer'"
        >
          buyer
        </button>

        <!-- seller tab -->
        <button
          type="button"
          class="flex-1 pb-2 text-lg font-medium transition-all duration-200 text-center"
          :class="[
            activeForm === 'seller'
              ? 'text-gray-900 border-b-4 border-gray-900'
              : 'text-gray-400 hover:text-gray-700',
          ]"
          @click="activeForm = 'seller'"
        >
          seller
        </button>
      </div>

      <!-- <div class="h-px w-full bg-gray-200" /> -->

      <!-- dynamic form -->
      <div class="flex-1">
        <BuyerForm
          v-if="activeForm === 'buyer'"
          :isStillSubmit="isStillSubmitting"
          @submitForm="handleFormSubmit"
        />
        <SellerForm
          v-else
          :isStillSubmit="isStillSubmitting"
          @submitForm="handleFormSubmit"
        />
      </div>
    </div>
  </div>
</template>
