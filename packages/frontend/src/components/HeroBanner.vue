<template>
  <div class="relative h-[900px] w-full">
    <img
      src="@/assets/heroBanner.png"
      alt="Hero Background"
      class="absolute inset-0 w-full h-full object-cover brightness-75"
    />
    <div
      class="absolute bottom-0 w-full h-48 bg-gradient-to-t from-black/80 to-transparent z-0"
    />
    <div
      class="absolute bottom-24 w-full z-10 flex flex-col justify-center items-center text-white text-center px-4"
    >
      <h1
        class="text-3xl md:text-4xl font-semibold drop-shadow-md mb-6 animate__animated animate__fadeInUp"
        style="animation-delay: 0.3s"
      >
        Choose the Style That Defines You
      </h1>

      <router-link
        to="/sale-items"
        class="bg-[#0071E3] text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300 hover:bg-[#339DFF] animate__animated animate__fadeInUp Itbms-shopnow"
        style="animation-delay: 0.6s"
      >
        Shop Now
      </router-link>
    </div>
  </div>
</template>
