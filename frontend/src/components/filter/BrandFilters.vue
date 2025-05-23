<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2">
  <label for="pageSize" class="text-gray-700 text-sm">Page size:</label>
  <select
    id="pageSize"
    v-model="pageSize"
    class="border border-gray-300 px-3 py-2 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
  >
    <option  value="5">5</option>
    <option  value="5">10</option>
    <option  value="5">15</option>
    <option  value="5">20</option>

  </select>
</div>
    <!-- Dropdown + Add + Clear -->
    <div class="flex items-center gap-3">
      <div class="relative w-full">
        <select
          v-model="selectedBrand"
          class="appearance-none w-full border border-gray-300 px-4 py-3 rounded-lg text-gray-700 text-base focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
        >
          <option value="" disabled selected hidden>Filter by brand</option>
          <option
            v-for="brand in brandOptions"
            :key="brand.brandId"
            :value="brand.brandId"
          >
            {{ brand.name }}
          </option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <button
        @click="addBrand"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm transition"
      >
        +
      </button>

      <button
        @click="clearAll"
        class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
      >
        Clear
      </button>
    </div>

    <!-- แสดงแบรนด์ที่เลือก -->
<div class="flex flex-wrap gap-2 max-w-full">
  <div
    v-for="(brandId, index) in selectedBrands"
    :key="brandId"
    class="flex items-center bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm shadow-sm"
  >
    <span class="truncate max-w-[150px]">{{ getBrandName(brandId) }}</span>
    <button
      @click="removeBrand(index)"
      class="ml-2 text-blue-500 hover:text-red-500 font-bold"
      title="Remove"
    >
      &times;
    </button>
  </div>
</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchBrands } from '@/services/brandService'

const emit = defineEmits(['update:brands'])

const selectedBrand = ref('')
const selectedBrands = ref([])
const brandOptions = ref([])
const pageSize = ref(5)
onMounted(async () => {
  const brands = await fetchBrands()
  brandOptions.value = brands.filter(b => b.name.toLowerCase() !== 'filter by brand')
})

function addBrand() {
  const brand = selectedBrand.value
  if (brand && !selectedBrands.value.includes(brand)) {
    selectedBrands.value.push(brand)
    emit('update:brands', selectedBrands.value)
  }
  selectedBrand.value = ''
}

function removeBrand(index) {
  selectedBrands.value.splice(index, 1)
  emit('update:brands', selectedBrands.value)
}

function clearAll() {
  selectedBrands.value = []
  selectedBrand.value = ''
  emit('update:brands', selectedBrands.value)
}

function getBrandName(id) {
  const found = brandOptions.value.find(b => b.brandId === id)
  return found ? found.name : id
}
</script>
