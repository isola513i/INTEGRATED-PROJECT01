<script setup>
import SignInForm from "@/components/form/SignInForm.vue";

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
        <SignInForm @submitForm="handleFormSubmit" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>