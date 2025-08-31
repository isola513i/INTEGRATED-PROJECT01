<script setup>

</script>
 
<template>
  <nav class="bg-gray-300 shadow-md top-0 left-0 w-full z-50">
    <div class="flex justify-end items-center h-12 px-6 space-x-4">
      <router-link
        to="/signin"
        class="relative font-semibold tracking-wide text-black hover:text-gray-500 transition duration-300"
      >
        SignIn
      </router-link>
      <router-link
        to="/registers"
        class="relative font-semibold tracking-wide text-black hover:text-gray-500 transition duration-300"
      >
        Register
      </router-link>
    </div>
  </nav>
</template>
 
<style scoped>

</style>