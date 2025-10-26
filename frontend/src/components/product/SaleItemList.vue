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
  <div class=" text-gray-900 flex flex-col items-center">
    <div
      class="w-full max-w-6xl bg-white rounded-2xl shadow-md ring-1 ring-gray-200 overflow-hidden"
    >
      <div class="hidden md:block">
        <div
          class="grid grid-cols-8 text-xs font-semibold bg-gray-100 text-gray-600 uppercase tracking-wide border-b border-gray-200"
        >
          <div
            v-for="(field, i) in fields"
            :key="i"
            class="py-3 text-center px-2"
          >
            {{ field }}
          </div>
        </div>

        <!-- Rows -->
        <div class="divide-y divide-gray-100">
          <div
            v-for="(item, index) in items"
            :key="item.id"
            class="grid grid-cols-8 text-sm hover:bg-gray-50 transition"
          >
            <div class="py-3 px-2 text-center text-gray-700 font-medium">
              {{ item.id }}
            </div>
            <div class="py-3 px-2 text-center text-gray-700">
              {{ item.brandName }}
            </div>
            <div class="py-3 px-2 text-center text-gray-700">
              {{ item.model }}
            </div>
            <div class="py-3 px-2 text-center text-gray-500">
              {{ item.ramGb ?? "-" }}
            </div>
            <div class="py-3 px-2 text-center text-gray-500">
              {{ item.storageGb ?? "-" }}
            </div>
            <div class="py-3 px-2 text-center text-gray-500">
              {{ item.color ?? "-" }}
            </div>
            <div class="py-3 px-2 text-center text-gray-900 font-semibold">
              ฿{{ Number(item.price).toLocaleString("en-US") }}
            </div>

            <div class="py-3 px-2 flex items-center justify-center gap-2 text-xs">
              <router-link
                :to="`/sale-items/${item.id}/edit`"
                class="px-3 py-1.5 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 hover:shadow-sm transition"
              >
                Edit
              </router-link>
              <button
                class="px-3 py-1.5 rounded-lg border border-red-500 text-red-600 hover:bg-red-50 hover:shadow-sm transition"
                @click="handleModal(item.id)"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile View -->
      <div class="md:hidden divide-y divide-gray-200">
        <div
          v-for="(item, index) in items"
          :key="item.id"
          class="p-4 text-sm hover:bg-gray-50 transition"
        >
          <div class="flex justify-between mb-2">
            <div>
              <span class="text-[11px] text-gray-500 uppercase">Brand / Model</span>
              <div class="text-gray-800 font-medium leading-tight">
                {{ item.brandName }} – {{ item.model }}
              </div>
            </div>
            <span class="text-[11px] text-gray-400">#{{ item.id }}</span>
          </div>

          <div class="grid grid-cols-3 gap-2 mb-3 text-center">
            <div class="bg-white rounded-xl ring-1 ring-gray-200 p-2">
              <div class="text-[10px] text-gray-500">RAM</div>
              <div class="text-gray-800 font-medium">{{ item.ramGb ?? "-" }} GB</div>
            </div>
            <div class="bg-white rounded-xl ring-1 ring-gray-200 p-2">
              <div class="text-[10px] text-gray-500">Storage</div>
              <div class="text-gray-800 font-medium">{{ item.storageGb ?? "-" }} GB</div>
            </div>
            <div class="bg-white rounded-xl ring-1 ring-gray-200 p-2">
              <div class="text-[10px] text-gray-500">Color</div>
              <div class="text-gray-800 font-medium">{{ item.color ?? "-" }}</div>
            </div>
          </div>

          <div class="flex justify-between items-end mb-4">
            <div>
              <span class="text-[11px] text-gray-500 uppercase">Price</span>
              <div class="text-gray-900 font-semibold text-base">
                ฿{{ Number(item.price).toLocaleString("en-US") }}
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-2 text-xs">
            <router-link
              :to="`/sale-items/${item.id}/edit`"
              class="px-3 py-1.5 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 transition"
            >
              Edit
            </router-link>
            <button
              class="px-3 py-1.5 rounded-lg border border-red-500 text-red-600 hover:bg-red-50 transition"
              @click="handleModal(item.id)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
    >
      <div
        class="w-full max-w-sm rounded-2xl bg-white text-gray-900 shadow-xl ring-1 ring-gray-200 p-6"
      >
        <h2 class="text-lg font-semibold mb-2">Delete Item?</h2>
        <p class="text-sm text-gray-600 mb-6">
          Are you sure you want to delete this sale item?
        </p>

        <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            @click="handleModal"
            class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            @click="deleteItem(saleItemId)"
            class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

