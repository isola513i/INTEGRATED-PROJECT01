<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import SaleItemForm from "@/components/SaleItemForm.vue";
import { fetchBrands, fetchItemById } from "@/services/saleItemService";

const router = useRouter();
const isSubmitting = ref(false);
const errorMessage = ref("");
const brands = ref([]);
const product = ref({});

const form = ref({
  brandId: "",
  model: "",
  price: null,
  description: "",
  ramGb: null,
  screenSizeInch: null,
  storageGb: null,
  color: "",
  quantity: null,
});



const initialForm = ref({ ...form.value });
const isDirty = computed(() => {
  return JSON.stringify(form.value) !== JSON.stringify(initialForm.value);
});

const isFormValid = computed(() => {
  const f = form.value;
  return (
    !!f.brandId &&
    f.model.trim().length > 0 &&
    f.price > 0 &&
    f.quantity > 0 &&
    f.description.trim().length > 0
  );
});
const initProd = ref();
const route = useRoute();
onMounted(async () => {
  try {
    brands.value = await fetchBrands();
    const data = await fetchItemById(route.params.slug);
    DataToForm(data);
    initProd.value = JSON.parse(JSON.stringify(form.value)); 
  } catch (error) {
    errorMessage.value = "Failed to load brands";
  }
});
const isupdate = ref(false)
watch(
  form,
  () => {
    isupdate.value = JSON.stringify(form.value) !== JSON.stringify(initProd.value);
  },
  { deep: true }
);
const DataToForm = (data) => {
  form.value = {
    brandId: brands.value.find((b) => b.name === data.brandName)?.brandId || "",
    model: data.model || "",
    price: data.price ?? null,
    description: data.description || "",
    ramGb: data.ramGb ?? null,
    screenSizeInch: data.screenSizeInch ?? null,
    storageGb: data.storageGb ?? null,
    color: data.color || "",
    quantity: data.quantity ?? null,
  };
};

const updateForm = (updatedForm) => {
  form.value = updatedForm;
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    if (!form.value.brandId) {
      throw new Error("Please select a brand");
    }

    const brandId = parseInt(form.value.brandId, 10);

    if (isNaN(brandId)) {
      throw new Error("Invalid brand ID format");
    }

    const selectedBrand = brands.value.find((b) => {
      return Number(b.brandId) === brandId;
    });

    if (!selectedBrand) {
      throw new Error(`Brand with ID ${brandId} not found`);
    }

    const payload = {
      model: form.value.model.trim(),
      brand: {
        id: brandId,
        name: selectedBrand.name,
      },
      description: form.value.description.trim(),
      price: Number(form.value.price),
      ramGb: form.value.ramGb !== null ? Number(form.value.ramGb) : null,
      screenSizeInch:
        form.value.screenSizeInch !== null
          ? Number(form.value.screenSizeInch)
          : null,
      quantity: Number(form.value.quantity),
      storageGb:
        form.value.storageGb !== null ? Number(form.value.storageGb) : null,
      color: form.value.color?.trim() || null,
    };

    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/sale-items/${route.params.slug}`;

    const response = await axios.put(apiUrl, payload, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
      validateStatus: function (status) {
        return status < 500;
      },
    });

    if (response.status === 200) {
      router.push({
        path: `/sale-items/${route.params.slug}`,
        query: {
          successMessage: "The sale item has been updated.",
        },
      });
    } else {
      errorMessage.value = `Unexpected response: ${response.status} ${response.statusText}`;
    }
  } catch (error) {
    if (error.response) {
      errorMessage.value =
        error.response.data?.message ||
        `Server error: ${error.response.status}`;
    } else if (error.request) {
      errorMessage.value =
        "No response from server. Please check your connection.";
    } else {
      errorMessage.value = error.message || "Failed to send request";
    }
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  router.push('/sale-items')
};
</script>

<template>
  <div class="p-10 max-w-7xl mx-auto text-gray-800">
    <div class="mb-8 flex items-center gap-2">
      <router-link
        to="/sale-items"
        class="itbms-home-button text-gray-600 hover:text-black text-xl font-light"
        >Home
		</router-link
      >
      <span class="text-gray-400">/</span>
	  <router-link
    	to="/sale-items"
    	class="itbms-home-button text-gray-600 hover:text-black text-xl font-light"
 		>{{ product.model || 'Sale Item' }}
		</router-link>
    </div>

    <div v-if="errorMessage" class="text-red-600 mb-4">{{ errorMessage }}</div>

    <SaleItemForm
      v-if="form"
      :updatePage="true"
      :isupdate="isupdate"
      :form="form"
      :brands="brands"
      :isSubmitting="isSubmitting"
      :isFormValid="isFormValid"
      :isDirty="isDirty"
      @update:form="updateForm"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>
