<script setup>
import { RouterView } from 'vue-router';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
</script>
<template>
  <div class="bg-[#ffffff]">
    <Navbar />
    <main class="pt-13">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<style scoped></style>
