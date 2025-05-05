<script setup>
import { RouterView } from "vue-router";
import Navbar from "./components/UI/Navbar.vue";
import Footer from "./components/UI/Footer.vue";
</script>
<template>
  <div class="bg-[#ffffff]">
    <Navbar />
    <main class="pt-15">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<style scoped></style>
