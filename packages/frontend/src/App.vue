<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue';


</script>

<template>
  <Navbar/>
  <div class="min-h-screen bg-gray-100">
    <router-view />
  </div>
</template>

<style scoped></style>
