<script setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { verfyByToken } from "@/services/userService.js";

const route = useRoute();
const router = useRouter();

const showModal = ref(false);
const verifiedUser = ref(null);
const verificationStatus = ref("pending"); 
// "pending" | "success" | "failed"

onMounted(async () => {
  try {
    const data = await verfyByToken(route.query.token);
    verifiedUser.value = data;
    verificationStatus.value = "success";
  } catch (err) {
    console.log("error:", err);
    verificationStatus.value = "failed";
  } finally {
    showModal.value = true; // always show modal after response
  }
});

const closeModal = () => {
  showModal.value = false;
  router.push("/sale-items");
};
</script>

<template>
  <!-- Modal -->
  <div
    v-if="showModal"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white rounded-lg p-6 w-96 text-center">
      <!-- Show content based on verification status -->
      <template v-if="verificationStatus === 'success'">
        <h2 class="text-xl font-bold mb-4 text-green-600">
          ✅ Verification Successful!
        </h2>
        <p class="mb-6">
          Welcome <b>{{ verifiedUser?.name }}</b>! Your email has been verified.
        </p>
      </template>

      <template v-else-if="verificationStatus === 'failed'">
        <h2 class="text-xl font-bold mb-4 text-red-600">
          ❌ Verification Failed
        </h2>
        <p class="mb-6">
          Sorry, your verification token is invalid or expired.
        </p>
      </template>

      <template v-else>
        <h2 class="text-xl font-bold mb-4">⏳ Verifying...</h2>
        <p class="mb-6">Please wait while we check your token.</p>
      </template>

      <button
        @click="closeModal"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Close
      </button>
    </div>
  </div>
</template>