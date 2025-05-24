<script setup></script>
<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center text-center bg-white"
  >
    <h1 class="text-5xl font-bold text-red-700 mb-4">Oops!</h1>
    <p class="text-gray-700 mb-6">
      Something went wrong on our side. Please try again later.
    </p>
    <router-link to="/" class="btn btn-error">Back to home</router-link>
  </div>
</template>
