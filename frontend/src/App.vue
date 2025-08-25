<script setup>
import { RouterView } from "vue-router";
import Navbar from "./components/layout/Navbar.vue";
import Footer from "./components/layout/Footer.vue";
import Register from "./components/layout/RegisterBanner.vue";
</script>

<template>
   <div class="bg-[#ffffff]">
    <!-- Register Bar -->
    <Register class="fixed top-0 left-0 w-full z-50 h-10" />

    <!-- Navbar -->
    <Navbar class="fixed top-10 left-0 w-full z-40 h-16" />

    <!-- Main content (เว้น padding-top = Register + Navbar) -->
    <main class="pt-[104px]">
      <RouterView />
    </main>

    <Footer />
  </div>
</template>

<style scoped></style>
