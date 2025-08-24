<script setup>
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import SaleItemForm from "@/components/form/SaleItemForm.vue";
import {
  addSaleItem,
  updateSaleItem,
  getItem,
} from "@/services/saleItemService";
import { fetchBrands } from "@/services/brandService";
import { useFlashStore } from "@/store/useFlashStore";
import { useSaleItemValidator } from "@/validators/useValidation";
import {previewBinaryFile} from "@/services/previewBinary.js";

const route = useRoute();
const router = useRouter();
const flash = useFlashStore();

const isEditMode = computed(() => !!route.params.id);
const isSubmitting = ref(false);
const isUpdate = ref(false);
const errorMessage = ref("");
const brands = ref([]);
const originalItemData = ref(null);
const imageFiles = ref(null);
const retriveImageFiles = ref(null);
const isAlreadyFetchData = ref(false);
const isImageChange = ref(false);

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

const formData = new FormData();

const requiredFields = ["brandId", "model", "price", "quantity", "description"];

const { errors, validateAll, isFormValid, validateField } =
  useSaleItemValidator(form);

const initialForm = reactive(JSON.parse(JSON.stringify(form)));

const isDirty = computed(() => {
  const allRequiredChanged = requiredFields.every(
    (field) => form[field] !== initialForm[field]
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
    isFormValid.value &&
    isDirty.value &&
    (!isEditMode.value || isUpdate.value || isImageChange.value)
  );
});

const sortedBrands = computed(() =>
  [...brands.value].sort((a, b) =>
    a.name.localeCompare(b.name, "en", { sensitivity: "base" })
  )
);

onMounted(async () => {
  try {
    brands.value = await fetchBrands();

    if (isEditMode.value) {
      const data = await getItem(`v2/sale-items/${route.params.id}`);
      populateForm(data);
      const imagePromises = data.saleItemImages.map(async (image) => {
        const res = await fetch(
          `${API_BASE_URL}/v2/sale-items/${route.params.id}/images/${image.fileName}`
        );
        if (!res.ok) return null;
        const blob = await res.blob(); // convert response to Blob
        const file = new File([blob], image.fileName, { type: blob.type }); // create a File object
        const url = previewBinaryFile(file)
        return {
          fileName: image.fileName,
          file,
          url,
          imageViewOrder: image.imageViewOrder,
          status: "ONLINE",
        };
      });
      // Wait for all images
      const results = await Promise.all(imagePromises);
      retriveImageFiles.value = results;
      imageFiles.value = [...retriveImageFiles.value];
      isAlreadyFetchData.value = true; // use for delayed to load form component
    } else {
      isAlreadyFetchData.value = true;
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
      }
    );
  });
};

//this
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
      (b) => Number(b.brandId) === brandId
    );
    if (!selectedBrand) throw new Error("Selected brand not found");
    formData.append("saleItem.model", form.model.trim());
    formData.append("saleItem.brand.id", brandId); // required
    formData.append("saleItem.description", form.description.trim());
    formData.append("saleItem.ramGb", String(form.ramGb || null));
    formData.append(
      "saleItem.screenSizeInch",
      String(form.screenSizeInch || null)
    );
    formData.append("saleItem.price", String(form.price || 0));
    formData.append("saleItem.quantity", String(form.quantity || 1));
    formData.append("saleItem.storageGb", String(form.storageGb || 0));
    formData.append("saleItem.color", form.color?.trim() || "");

    // === Image files ===
    imageFiles.forEach((file, index) => {
      formData.append(`imageInfos[${index}].fileName`, file.fileName);
      formData.append(`imageInfos[${index}].status`, file.status);
      formData.append(
        `imageInfos[${index}].order`,
        file.status !== "DELETE" ? String(index + 1) : -1
      ); // backend expects 1,2,...
      formData.append(`imageInfos[${index}].imageFile`, file.file); // file = File/Blob
    });
    if (isEditMode.value) {
      await updateSaleItem(route.params.id, formData);
      flash.setMessage(
        "✅ The sale item has been successfully updated.",
        "m-4 p-4 bg-green-100 text-green-800 shadow itbms-message"
      );
    } else {
      await addSaleItem(formData);
      flash.setMessage(
        "✅ The sale item has been successfully added.",
        "m-4 p-4 bg-green-100 text-green-800 shadow itbms-message"
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

const checkImageUpdate = (images) => {
  const updatedImages = images.map((image) => {
    return {
      fileName: image.fileName,
      file: image.file,
      url:image.url,
      imageViewOrder: image.imageViewOrder + 1,
      status: image.status,
    };
  });
  isImageChange.value = !(
    JSON.stringify(updatedImages) === JSON.stringify(retriveImageFiles.value)
  );
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
      v-if="isAlreadyFetchData"
      :form="form"
      :brands="sortedBrands"
      :isSubmitting="isSubmitting"
      :isReadyToSubmit="isReadyToSubmit"
      :errors="errors"
      :isUpdate="isEditMode"
      :retriveImageFiles="retriveImageFiles"
      @update:form="updateForm"
      @submit="handleSubmit"
      @cancel="handleCancel"
      @blur="validateField"
      @update-image:images="checkImageUpdate"
    />
  </div>
</template>
