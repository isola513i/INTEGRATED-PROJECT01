<script setup>
import { RouterView } from 'vue-router';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import PromoBanner from './components/PromoBanner.vue';
</script>
<template>

  <Navbar />
  <RouterView />
  <Footer />
</template>

<style scoped></style>
