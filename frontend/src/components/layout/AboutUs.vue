<template>
  <section class="min-h-screen bg-zinc-900 text-zinc-100 flex items-center justify-center p-6">
    <div class="w-full max-w-5xl flex flex-col items-center text-center">

      <!-- Project Title -->
      <header class="mb-10">
        <h1 class="text-2xl md:text-3xl font-semibold text-white tracking-tight">
          INT222 Integrated Information Technology Project
        </h1>
        <p class="text-sm text-zinc-400 mt-2">
          Faculty of Information Technology · KMUTT
        </p>
      </header>

      <!-- Advisor -->
      <div class="flex flex-col items-center">
        <div
          class="w-40 h-40 rounded-3xl bg-zinc-800/60 ring-1 ring-zinc-700/70 shadow-[0_30px_120px_rgba(0,0,0,0.8)]
                 flex items-center justify-center overflow-hidden relative"
        >
          <img
            src="../../assets/images/ajarn.png"
            alt="Advisor"
            class="w-full h-full object-cover rounded-2xl"
          />
          <div class="absolute inset-0 rounded-2xl ring-1 ring-white/10 pointer-events-none"></div>
        </div>

        <p class="mt-4 text-lg font-semibold text-white">
          Ajarn Sanit Sirisawatvatana
        </p>

        <div class="mt-2 h-[3px] w-16 rounded-full bg-gradient-to-r from-zinc-500/0 via-zinc-400/60 to-zinc-500/0"></div>

        <p class="mt-6 text-sm text-zinc-400 tracking-wide uppercase">
          Developed by
        </p>
      </div>

      <!-- Members -->
      <div class="mt-10 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- member card (no frame) -->
        <div class="flex flex-col items-center">
          <div class="w-28 h-28 rounded-2xl overflow-hidden">
            <img
              src="../../assets/images/ajarn.png"
              alt="member"
              class="w-full h-full object-cover rounded-2xl"
            />
          </div>

          <p class="mt-4 text-base font-semibold text-white leading-tight">
            Thidarat Tangnusart
          </p>
          <p class="text-sm text-zinc-400 font-normal leading-tight mt-1">
            66130500023
          </p>

          <div class="mt-3 h-[3px] w-12 rounded-full bg-gradient-to-r from-zinc-500/0 via-zinc-400/60 to-zinc-500/0"></div>
        </div>

        <!-- member 2 -->
        <div class="flex flex-col items-center">
          <div class="w-28 h-28 rounded-2xl overflow-hidden">
            <img
              src="../../assets/images/ajarn.png"
              alt="member"
              class="w-full h-full object-cover rounded-2xl"
            />
          </div>

          <p class="mt-4 text-base font-semibold text-white leading-tight">
            Thidarat Tangnusart
          </p>
          <p class="text-sm text-zinc-400 font-normal leading-tight mt-1">
            66130500031
          </p>

          <div class="mt-3 h-[3px] w-12 rounded-full bg-gradient-to-r from-zinc-500/0 via-zinc-400/60 to-zinc-500/0"></div>
        </div>

        <!-- member 3 -->
        <div class="flex flex-col items-center">
          <div class="w-28 h-28 rounded-2xl overflow-hidden">
            <img
              src="../../assets/images/ajarn.png"
              alt="member"
              class="w-full h-full object-cover rounded-2xl"
            />
          </div>

          <p class="mt-4 text-base font-semibold text-white leading-tight">
            Thidarat Tangnusart
          </p>
          <p class="text-sm text-zinc-400 font-normal leading-tight mt-1">
            66130500043
          </p>

          <div class="mt-3 h-[3px] w-12 rounded-full bg-gradient-to-r from-zinc-500/0 via-zinc-400/60 to-zinc-500/0"></div>
        </div>
      </div>

      <!-- footer small -->
      <footer class="mt-12 text-[10px] text-zinc-600">
        © 2025 SIT KMUTT
      </footer>
    </div>
  </section>
</template>
