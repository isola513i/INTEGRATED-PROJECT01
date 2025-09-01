<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import SignInForm from "@/components/form/SignInForm.vue";
import { useAuthStore } from "@/store/useAuthStore";

const router = useRouter();
const auth = useAuthStore();
const errorMsg = ref("");

async function handleFormSubmit({ email, password }) {
  errorMsg.value = "";
  try {
    await auth.login(email.trim(), password);
    router.replace("/sale-items");
  } catch (e) {
  
    const required403 = "You need to activate your account before signing in.";
    errorMsg.value =
      e.message === required403
        ? required403
        : e.message || "Sign-in failed";
  }
}


</script>

<template>
  <div class="flex min-h-screen">
    <!-- Left side (image) -->
    <div class="hidden md:flex w-1/2 bg-gray-100">
      <img
        src="../../assets/heroBanner.png"
        alt="Sign In Illustration"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Right side (form) -->
    <div class="flex w-full md:w-1/2 items-center justify-center p-8">
      <div class="w-full max-w-md">
        <SignInForm
          :errorMessage="errorMsg"
          :loading="loading"
          @submitForm="handleFormSubmit"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
