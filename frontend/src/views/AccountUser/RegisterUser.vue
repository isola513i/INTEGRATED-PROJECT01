<script setup>
import { ref } from "vue";
import BuyerForm from "@/components/form/BuyerForm.vue";
import SellerForm from "@/components/form/SellerForm.vue";
import { registerUser } from "@/services/userService";
import { useRoute, useRouter } from "vue-router";
import { useFlashStore } from "@/store/useFlashStore";
const router = useRouter();

const activeForm = ref("buyer"); // ค่าเริ่มต้น
const flash = useFlashStore();

// ฟังก์ชันรับข้อมูลจากฟอร์ม
async function handleFormSubmit(data) {
  const formData = new FormData();

  // map key และ value เข้าไปใน formData
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });

  try {
    const response = await registerUser(formData);
    if (response) {
      flash.setMessage(
          "The user account has been successfully registered.",
          "itbms-message m-4 p-4 bg-green-100 text-green-800 shadow",
        );
        router.push('/sale-items');
    }
  } catch (error) {
    console.error("Failed to register user:", error);
  }
}
</script>

<template>
  <div
    class="flex justify-center items-start min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6 pt-12"
  >
    <div
      class="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg border border-gray-100 min-h-[750px] flex flex-col"
    >
      <!-- ปุ่มสลับ -->
      <div class="flex justify-center gap-4 mb-6">
        <button
          @click="activeForm = 'buyer'"
          :class="[
            'px-6 py-2 rounded-lg font-medium shadow-md transition',
            activeForm === 'buyer'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          Buyer
        </button>
        <button
          @click="activeForm = 'seller'"
          :class="[
            'px-6 py-2 rounded-lg font-medium shadow-md transition',
            activeForm === 'seller'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          Seller
        </button>
      </div>

      <!-- ฟอร์ม -->
      <div class="flex-1">
        <BuyerForm
          v-if="activeForm === 'buyer'"
          @submitForm="handleFormSubmit"
        />
        <SellerForm v-else @submitForm="handleFormSubmit" />
      </div>
    </div>
  </div>
</template>
