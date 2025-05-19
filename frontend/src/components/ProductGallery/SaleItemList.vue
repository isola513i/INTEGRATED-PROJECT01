<script setup>
import router from "@/router";
import { deleteItemById } from "@/services/saleItemService";
import { ref } from "vue";
import { useFlashStore } from "@/store/useFlashStore";

const flash = useFlashStore()
const showModal = ref(false);
const saleItemId = ref(0)
const handleModal = (id)=>{
 showModal.value= !showModal.value
 saleItemId.value=id
}

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
 async function deleteItem(id){
  try {
    await deleteItemById(id); // ถ้าได้ 204 ตรงนี้จะสำเร็จ
    const index = props.items.findIndex(item => item.id === id)
    props.items.splice(index,1)
    flash.setMessage(
      "✅ The sale item has been deleted.",
      "m-4 p-4 bg-green-100 text-green-800 shadow itbms-message"
    );
    handleModal()
  } catch (error) {
    flash.setMessage(
      "❌ The requested sale item does not exist.",
      "m-4 p-4 bg-red-100 text-red-800 shadow itbms-message"
    );
  }
};
</script>

<template>
  <div class="flex flex-col items-center m-5">
    <div class="w-[75em]">
      <div
        class="w-full bg-[#171717] grid grid-cols-8 text-white text-sm font-semibold"
      >
        <div
          v-for="(field, index) in fields"
          :key="index"
          class="text-center border-1 border-gray-200 py-2"
        >
          {{ field }}
        </div>
      </div>
      <div class="w-full grid grid-rows">
        <div
          v-for="(item, key, index) in items"
          class="itbms-row grid grid-cols-8"
        >
          <div
            class="itbms-id text-center border-1 border-gray-500 py-2"
            :key="index"
            :class="key % 2 === 0 ? `bg-gray-200` : 'bg-white'"
          >
            {{ item.id }}
          </div>
          <div
            class="itbms-brand text-center border-1 border-gray-500 py-2"
            :key="index"
            :class="key % 2 === 0 ? `bg-gray-200` : 'bg-white'"
          >
            {{ item.brandName }}
          </div>
          <div
            class="itbms-model text-center border-1 border-gray-500 py-2"
            :key="index"
            :class="key % 2 === 0 ? `bg-gray-200` : 'bg-white'"
          >
            {{ item.model }}
          </div>
          <div
            class="itbms-ramGb text-center border-1 border-gray-500 py-2"
            :key="index"
            :class="key % 2 === 0 ? `bg-gray-200` : 'bg-white'"
          >
            {{ item.ramGb ? item.ramGb : "-" }}
          </div>
          <div
            class="itbms-storageGb text-center border-1 border-gray-500 py-2"
            :key="index"
            :class="key % 2 === 0 ? `bg-gray-200` : 'bg-white'"
          >
            {{ item.storageGb  ? item.storageGb : "-" }}

          </div>
          <div
            class="itbms-color text-center border-1 border-gray-500 py-2"
            :key="index"
            :class="key % 2 === 0 ? `bg-gray-200` : 'bg-white'"
          >
            {{ item.color ? item.color : "-"}}

          </div>
          <div
            class="itbms-price text-center border-1 border-gray-500 py-2"
            :key="index"
            :class="key % 2 === 0 ? `bg-gray-200` : 'bg-white'"
          >

          ฿<span class="itbms-price-unit">
          {{
            Number(item.price).toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })
          }}
        </span>
          </div>
          <div
            class="flex justify-center gap-3 items-center border-1 border-gray-500"
            :key="index"
            :class="key % 2 === 0 ? 'bg-gray-200' : 'bg-white'"
          >
            <router-link
              :to="`/sale-items/edit/${item.id}`"
              class="no-underline"
            >
              <p
                class="itbms-edit-button p-1 px-3 border-1 rounded-md border-blue-400 text-sm text-blue-400"
              >
                E
              </p>
            </router-link>
            <button
              class="itbms-delete-button p-1 px-3 border-1 rounded-md border-blue-400 text-sm text-blue-400"
              @click="handleModal(item.id)"
            >
              D
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Delete Modal -->
          <div
            v-if="showModal"
            class="fixed inset-0 bg-[#ffffff8f] bg-opacity-50 flex items-center justify-center z-50"
          >
            <div
              class="itbms-message bg-white rounded-lg p-6 shadow-lg max-w-sm w-full"
            >
              <h2 class="text-xl font-semibold mb-4 text-gray-800">
                Delete Confirmation
              </h2>
              <p class="mb-6 text-gray-800">
                Do you want to delete this sale item id : {{ saleItemId }}? 
              </p>
              <div class="flex justify-end space-x-4">
                <button
                  @click="handleModal"
                  class="itbms-cancel-button bg-[#cc3535] px-4 py-2 rounded hover:bg-[#6d3e3e]"
                >
                  Cancel
                </button>
                <button
                  @click="deleteItem(saleItemId)"
                  class="itbms-confirm-button bg-[#5eb238] text-white px-4 py-2 rounded hover:bg-[#58914c]"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
  </div>
</template>

<style scoped></style>
