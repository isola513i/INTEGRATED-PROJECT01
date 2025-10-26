<script setup>
import { deleteItemById } from "@/services/saleItemService";
import { ref } from "vue";
import { useFlashStore } from "@/store/useFlashStore";
import { useAuthStore } from "@/store/useAuthStore";
const auth = useAuthStore();
const flash = useFlashStore();
const showModal = ref(false);
const saleItemId = ref(0);
const handleModal = (id) => {
  showModal.value = !showModal.value;
  saleItemId.value = id;
};

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});
const fields = [
  "Id",
  "Brand",
  "Model",
  "Ram",
  "Storage",
  "Color",
  "Price",
  "Action",
];
async function deleteItem(saleItemId) {
  try {
    const sellerId = auth.user?.id; 
    if (!sellerId) throw new Error("Seller not found");
    await deleteItemById(sellerId, saleItemId);
    const index = props.items.findIndex((item) => item.id === saleItemId);
    if (index !== -1) props.items.splice(index, 1);

    flash.setMessage(
      "✅ The sale item has been deleted.",
      "m-4 p-4 bg-green-100 text-green-800 shadow itbms-message"
    );
    handleModal();
  } catch (error) {
    flash.setMessage(
      "❌ The requested sale item does not exist.",
      "m-4 p-4 bg-red-100 text-red-800 shadow itbms-message"
    );
  }
}
</script>

<template>
  <div class="flex flex-col items-center p-6">
    <div
      class="w-full max-w-6xl bg-white rounded-xl shadow-md ring-1 ring-gray-200 overflow-hidden"
    >
      <!-- header bar -->
      <div
        class="bg-zinc-900 text-white text-sm font-semibold grid grid-cols-8"
      >
        <div
          v-for="(field, i) in fields"
          :key="i"
          class="py-3 text-center"
        >
          {{ field }}
        </div>
      </div>

      <!-- rows -->
      <div class="divide-y divide-gray-200">
        <div
          v-for="(item, index) in items"
          :key="item.id"
          class="grid grid-cols-8 text-sm"
          :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-white'"
        >
          <!-- ID -->
          <div class="py-3 px-2 text-center text-gray-700 font-medium">
            {{ item.id }}
          </div>

          <!-- Brand -->
          <div class="py-3 px-2 text-center text-gray-700">
            {{ item.brandName }}
          </div>

          <!-- Model -->
          <div class="py-3 px-2 text-center text-gray-700">
            {{ item.model }}
          </div>

          <!-- RAM -->
          <div class="py-3 px-2 text-center text-gray-700">
            {{ item.ramGb ? item.ramGb : "-" }}
          </div>

          <!-- Storage -->
          <div class="py-3 px-2 text-center text-gray-700">
            {{ item.storageGb ? item.storageGb : "-" }}
          </div>

          <!-- Color -->
          <div class="py-3 px-2 text-center text-gray-700">
            {{ item.color ? item.color : "-" }}
          </div>

          <!-- Price -->
          <div class="py-3 px-2 text-center text-gray-900 font-semibold">
            ฿
            <span>
              {{
                Number(item.price).toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })
              }}
            </span>
          </div>

          <!-- Action -->
          <div
            class="py-3 px-2 flex items-center justify-center gap-2 text-xs"
          >
            <router-link
              :to="`/sale-items/${item.id}/edit`"
              class="inline-flex items-center rounded-md border border-blue-500 text-blue-600 px-2 py-1 font-medium hover:bg-blue-50"
            >
              Edit
            </router-link>

            <button
              class="inline-flex items-center rounded-md border border-red-500 text-red-600 px-2 py-1 font-medium hover:bg-red-50"
              @click="handleModal(item.id)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="w-full max-w-sm rounded-xl bg-white shadow-xl ring-1 ring-gray-200 p-6"
      >
        <h2 class="text-lg font-semibold text-gray-900 mb-2">
          Delete item?
        </h2>

        <p class="text-sm text-gray-600 mb-6">
          Do you want to delete this sale item?
        </p>

        <div class="flex justify-end gap-3 text-sm font-medium">
          <button
            @click="handleModal"
            class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            @click="deleteItem(saleItemId)"
            class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
