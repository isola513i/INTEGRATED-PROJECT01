<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import SaleItemForm from "@/components/form/SaleItemForm.vue";
import {
  fetchItemById,
  addSaleItem,
  updateSaleItem,
} from "@/services/saleItemService";
import { fetchBrands } from "@/services/brandService";
import { useFlashStore } from "@/store/useFlashStore";
import { useSaleItemValidator } from "@/validators/useValidation";

const route = useRoute();
const router = useRouter();
const flash = useFlashStore();

const isEditMode = computed(() => !!route.params.id);
const isSubmitting = ref(false);
const isUpdate = ref(false);
const errorMessage = ref("");
const brands = ref([]);
const originalItemData = ref(null);

const form = reactive({
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

const formData = new FormData()

const requiredFields = ["brandId", "model", "price", "quantity", "description"];

const { errors, validateAll, isFormValid, validateField } =
  useSaleItemValidator(form);

const initialForm = reactive(JSON.parse(JSON.stringify(form)));

const isDirty = computed(() => {
  const allRequiredChanged = requiredFields.every(
    (field) => form[field] !== initialForm[field],
  );

  const allRequiredValid = requiredFields.every((field) => {
    const value = form[field];
    return (
      value !== null &&
      value !== "" &&
      (typeof value !== "string" || value.trim() !== "")
    );
  });

  return allRequiredChanged && allRequiredValid;
});

const isReadyToSubmit = computed(() => {
  return (
    isFormValid.value && isDirty.value && (!isEditMode.value || isUpdate.value)
  );
});

const sortedBrands = computed(() =>
  [...brands.value].sort((a, b) =>
    a.name.localeCompare(b.name, "en", { sensitivity: "base" }),
  ),
);

onMounted(async () => {
  try {
    brands.value = await fetchBrands();

    if (isEditMode.value) {
      const data = await fetchItemById(route.params.id);
      populateForm(data);
      originalItemData.value = JSON.parse(JSON.stringify(form));
    } else {
      Object.assign(initialForm, JSON.parse(JSON.stringify(form)));
    }

    watchFields();
  } catch (err) {
    errorMessage.value = "Failed to load data";
    console.error("Load Error:", err);
  }
});

const watchFields = () => {
  Object.keys(form).forEach((field) => {
    watch(
      () => form[field],
      () => {
        validateField(field);
        if (isEditMode.value) {
          checkFormUpdate();
        }
      },
    );
  });
};

const checkFormUpdate = () => {
  isUpdate.value =
    JSON.stringify(form) !== JSON.stringify(originalItemData.value);
};

const populateForm = (data) => {
  Object.assign(form, {
    brandId: brands.value.find((b) => b.name === data.brandName)?.brandId || "",
    model: data.model || "",
    price: data.price ?? null,
    description: data.description || "",
    ramGb: data.ramGb ?? null,
    screenSizeInch: data.screenSizeInch ?? null,
    storageGb: data.storageGb ?? null,
    color: data.color || "",
    quantity: data.quantity ?? null,
  });
};

const updateForm = (updatedForm) => {
  Object.assign(form, updatedForm);
};

const handleSubmit = async (imageFiles) => {
  validateAll();

  if (!isFormValid.value) {
    errorMessage.value = "Please correct the form errors";
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    const brandId = Number(form.brandId);
    const selectedBrand = brands.value.find(
      (b) => Number(b.brandId) === brandId,
    );
    if (!selectedBrand) throw new Error("Selected brand not found");

    // const payload = {
    //   model: form.model.trim(),
    //   brand: { id: brandId, name: selectedBrand.name },
    //   description: form.description.trim(),
    //   price: Number(form.price),
    //   ramGb: form.ramGb !== null ? Number(form.ramGb) : null,
    //   screenSizeInch:
    //     form.screenSizeInch !== null ? Number(form.screenSizeInch) : null,
    //   quantity: Number(form.quantity),
    //   storageGb: form.storageGb !== null ? Number(form.storageGb) : null,
    //   color: form.color?.trim() || null,
    // };
    formData.append('model',form.model.trim())
    formData.append('brand' , {id:brandId , name:selectedBrand.name})
    formData.append('description', form.description.trim())
    formData.append('price', Number(form.price))
    formData.append('ramGb', form.ramGb !== null ? Number(form.ramGb) : null)
    formData.append('screenSizeInch', form.screenSizeInch !== null ? Number(form.screenSizeInch) : null)
    formData.append('quantity', Number(form.quantity))
    formData.append('storageGb', form.storageGb !== null ? Number(form.storageGb) : null)
    formData.append('color', form.color?.trim() || null)
    imageFiles.forEach(image => {
      formData.append('files' , image)
    });
    

    if (isEditMode.value) {
      await updateSaleItem(route.params.id, payload);
      flash.setMessage(
        "✅ The sale item has been successfully updated.",
        "m-4 p-4 bg-green-100 text-green-800 shadow itbms-message",
      );
    } else {
      await addSaleItem(formData);
      flash.setMessage(
        "✅ The sale item has been successfully added.",
        "m-4 p-4 bg-green-100 text-green-800 shadow itbms-message",
      );
    }

    router.back();
  } catch (error) {
    handleSubmissionError(error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleSubmissionError = (error) => {
  if (error.response) {
    errorMessage.value =
      error.response.data?.message || `Server error: ${error.response.status}`;
  } else if (error.request) {
    errorMessage.value =
      "No response from server. Please check your connection.";
  } else {
    errorMessage.value = error.message || "Failed to send request";
  }
  console.error("Submission error:", error);
};

const handleCancel = () => {
  router.back();
  resetForm();
};

const resetForm = () => {
  Object.assign(form, initialForm);
  errorMessage.value = "";
};
</script>

<template>
  <div class="p-10 max-w-7xl mx-auto text-gray-800">
    <div class="mb-8 flex items-center gap-2">
      <router-link
        to="/sale-items"
        class="text-gray-600 hover:text-black text-xl font-light itbms-home-button"
      >
        Home
      </router-link>
      <span class="text-gray-400">/</span>
      <span class="text-xl text-gray-800 font-light">
        {{ isEditMode ? "Edit Sale Item" : "New Sale Item" }}
      </span>
    </div>

    <div v-if="errorMessage" class="text-red-600 mb-4">{{ errorMessage }}</div>

    <SaleItemForm
      :form="form"
      :brands="sortedBrands"
      :isSubmitting="isSubmitting"
      :isReadyToSubmit="isReadyToSubmit"
      :errors="errors"
      :isUpdate="isEditMode"
      @update:form="updateForm"
      @submit="handleSubmit"
      @cancel="handleCancel"
      @blur="validateField"
    />
  </div>
</template>
