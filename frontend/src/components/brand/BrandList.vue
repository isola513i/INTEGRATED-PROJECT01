<script setup>
import { fetchSaleItems } from "@/services/saleItemService";
import { deleteBrandById } from "@/services/brandService";
import { useFlashStore } from "@/store/useFlashStore";
import { ref } from "vue";

const fields = ["Id", "Name", "Action"];
const flash = useFlashStore();
const showModal = ref(false);
const brandId = ref(0);
const brandName = ref("");
const messageDelete = ref("");
const canDelete = ref(true);
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const handleModal = async (id, name) => {
  showModal.value = !showModal.value;
  brandId.value = id;
  brandName.value = name;
  const product = await fetchSaleItems();
  const usedIn = product.filter((item) => item.brandName === name);
  if (usedIn.length > 0) {
    canDelete.value = false;
    messageDelete.value = `Delete ${name} is not allowed. There are sale items with ${name} brand.`;
  } else {
    canDelete.value = true;
    messageDelete.value = `Do you want to delete ${name} brand?`;
  }
};

async function deleteItem(id) {
  try {
    await deleteBrandById(id);
    const index = props.items.findIndex((item) => item.brandId === id);
    props.items.splice(index, 1);
    flash.setMessage(
      "The brand has been deleted.",

      "m-4 p-4 bg-green-100 text-green-800 shadow itbms-message",
    );
    handleModal();
  } catch (error) {
    flash.setMessage(
      "An error has occurred, the brand does not exist.",
      "m-4 p-4 bg-red-100 text-red-800 shadow itbms-message",
    );
  }
}
</script>

<template>
  <div class="text-gray-900 flex flex-col items-center">
    <div
      class="w-full max-w-6xl bg-white rounded-2xl shadow-md ring-1 ring-gray-200 overflow-hidden"
    >
  
      <!-- ─── Desktop / Tablet view: table ─────────────────────────── -->
      <div class="hidden md:block">
        <!-- Table header -->
        <div
          class="bg-gray-100 text-gray-600 text-sm font-semibold grid grid-cols-3 border border-gray-200"
        >
          <div
            v-for="(field, index) in fields"
            :key="index"
            class="py-3 text-center"
          >
            {{ field }}
          </div>
        </div>

        <!-- Table body -->
        <div class="divide-y divide-gray-200">
          <div
            v-for="(item, index) in items"
            :key="item.brandId"
            class="grid grid-cols-3 text-sm"
            :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-white'"
          >
            <!-- Id -->
            <div class="py-3 text-center text-gray-800 font-medium">
              {{ item.brandId }}
            </div>

            <!-- Name -->
            <div class="py-3 text-center text-gray-700">
              {{ item.name }}
            </div>

            <!-- Action -->
            <div
              class="py-3 flex items-center justify-center gap-2 text-xs"
            >
              <router-link
                :to="`/brands/${item.brandId}/edit`"
                class="inline-flex items-center rounded-md border border-blue-500 text-blue-600 px-3 py-1 font-medium hover:bg-blue-50 hover:shadow-sm transition"
              >
                Edit
              </router-link>

              <button
                class="inline-flex items-center rounded-md border border-red-500 text-red-600 px-3 py-1 font-medium hover:bg-red-50 hover:shadow-sm transition"
                @click="handleModal(item.brandId, item.name)"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ─── Mobile view: stacked cards ───────────────────────────── -->
      <div class="md:hidden divide-y divide-gray-200">
        <div
          v-for="(item, index) in items"
          :key="item.brandId"
          class="p-4 text-sm"
          :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-white'"
        >
          <!-- row 1 -->
          <div class="flex justify-between mb-2">
            <span class="text-gray-500">Brand ID</span>
            <span class="text-gray-900 font-medium">
              {{ item.brandId }}
            </span>
          </div>

          <!-- row 2 -->
          <div class="flex justify-between mb-4">
            <span class="text-gray-500">Name</span>
            <span class="text-gray-800">
              {{ item.name }}
            </span>
          </div>

          <!-- row 3: actions -->
          <div class="flex justify-end gap-2 text-xs">
            <router-link
              :to="`/brands/${item.brandId}/edit`"
              class="inline-flex items-center rounded-md border border-blue-500 text-blue-600 px-3 py-1 font-medium hover:bg-blue-50 hover:shadow-sm transition"
            >
              Edit
            </router-link>

            <button
              class="inline-flex items-center rounded-md border border-red-500 text-red-600 px-3 py-1 font-medium hover:bg-red-50 hover:shadow-sm transition"
              @click="handleModal(item.brandId, item.name)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── Modal ─────────────────────────────────────────────────── -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="bg-white rounded-xl p-6 shadow-xl ring-1 ring-gray-200 w-full max-w-sm"
      >
        <!-- Title -->
        <h2 class="text-lg font-semibold text-gray-900 mb-2">
          Delete Confirmation
        </h2>

        <!-- Message -->
        <p class="text-sm text-gray-600 mb-6">
          {{ messageDelete }}
        </p>

        <!-- Buttons -->
        <div class="flex flex-col-reverse gap-3 text-sm font-medium sm:flex-row sm:justify-end">
          <button
            @click="handleModal"
            class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:shadow-sm transition"
          >
            Cancel
          </button>

          <button
            v-if="canDelete"
            @click="deleteItem(brandId)"
            class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
