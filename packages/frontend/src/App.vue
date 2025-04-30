<script setup>
import { RouterView } from 'vue-router';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
</script>
<template>
  <div class="bg-[#d0d0d0]">
    <Navbar />
    <main class="pt-13">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<style scoped></style>
