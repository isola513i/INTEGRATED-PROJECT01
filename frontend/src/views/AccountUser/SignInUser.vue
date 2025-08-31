<script setup>
import SignInForm from "@/components/form/SignInForm.vue";

// // ฟังก์ชันรับข้อมูลจากฟอร์ม
// async function handleFormSubmit(data) {
//   const formData = new FormData();

//   // map key และ value เข้าไปใน formData
//   Object.entries(data).forEach(([key, value]) => {
//     formData.append(key, value);
//   });

//   try {
//     const response = await signInUser(formData);
//     if (response) {
//       flash.setMessage(
//           "The user account has been successfully registered.",
//           "itbms-message m-4 p-4 bg-green-100 text-green-800 shadow",
//         );
//         router.back();
//     }
//   } catch (error) {
//     console.error("Failed to register user:", error);
//   }
// }
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
