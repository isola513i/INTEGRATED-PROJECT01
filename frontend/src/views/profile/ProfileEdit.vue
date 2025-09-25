<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/useAuthStore";
import { useFlashStore } from "@/store/useFlashStore"; // ✅ เพิ่ม
import { getUserProfile, updateUserProfile } from "@/services/userService";

const router = useRouter();
const auth = useAuthStore();
const flash = useFlashStore(); // ✅ เพิ่ม

const form = ref({
  nickName: "",
  email: "",
  fullName: "",
  userType: "",
  phoneNumber: "",
  bankAccount: "",
  bankName: "",
});
const original = ref({});
const loading = ref(true);
const saving = ref(false);
const errorMsg = ref("");

const isSeller = computed(
  () => (form.value.userType || "").toUpperCase() === "SELLER"
);

// ปุ่ม Save เปิดได้เมื่อมีการเปลี่ยนค่า + ผ่าน validation
const canSave = computed(() => {
  if (loading.value || saving.value) return false;
  const nn = form.value.nickName?.trim() ?? "";
  const fn = form.value.fullName?.trim() ?? "";
  const nickValid = nn.length > 0 && nn.length <= 40;
  const fullValid = fn.length >= 4 && fn.length <= 40;
  const changed =
    nn !== (original.value.nickName || "") ||
    fn !== (original.value.fullName || "");
  return nickValid && fullValid && changed;
});

async function load() {
  loading.value = true;
  errorMsg.value = "";
  try {
    const p = await getUserProfile(auth.user.id);
    form.value = { ...p };
    original.value = { nickName: p.nickName, fullName: p.fullName };
  } catch (e) {
    errorMsg.value = e?.message || "Cannot load profile";
  } finally {
    loading.value = false;
  }
}

async function save() {
  if (!canSave.value) return;
  saving.value = true;
  errorMsg.value = "";
  try {
    await updateUserProfile(auth.user.id, {
      nickName: form.value.nickName?.trim(),
      fullName: form.value.fullName?.trim(),
    });
    auth.nickname = form.value.nickName?.trim() || "";
    localStorage.setItem("nickname", auth.nickname);
    flash.setMessage(
      "Profile data is updated",
      "text-green-600 bg-green-50 p-2 rounded border border-green-200 shadow-sm"
    );
    router.push({ name: "ProfileView" });
  } catch (e) {
    errorMsg.value = e?.message || "Update failed";
    flash.setMessage(
      errorMsg.value,
      "itbms-message text-red-600 bg-red-50 p-2 rounded border border-red-200 shadow-sm"
    );
  } finally {
    saving.value = false;
  }
}

function cancel() {
  router.push({ name: "ProfileView" });
}

onMounted(load);
</script>

<template>
  <div class="min-h-[calc(100vh-80px)">
    <!-- Breadcrumb -->
    <div class="container mx-auto px-4 mt-4">
      <div class="flex items-center justify-between text-sm text-gray-500">
        <div>
          <router-link to="/" class="text-blue-600 hover:underline"
            >Home</router-link
          >
          <span class="mx-2">›</span>
          <router-link
            :to="{ name: 'ProfileView' }"
            class="text-blue-600 hover:underline"
            >Profile</router-link
          >
        </div>
      </div>
    </div>

    <!-- Form card -->
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <div class="bg-blue-100 rounded-xl shadow p-6 md:p-8">
          <!-- Avatar -->
          <div
            class="mx-auto -mt-16 mb-2 w-16 h-16 rounded-full bg-orange-400 flex items-center justify-center ring-4 ring-white shadow"
          >
            <svg
              class="w-9 h-9 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-3.33 0-10 1.67-10 5v1h20v-1c0-3.33-6.67-5-10-5Z"
              />
            </svg>
          </div>

          <div v-if="loading" class="py-6 text-center text-gray-500">
            Loading…
          </div>
          <div v-else>
            <div v-if="errorMsg" class="mb-4 text-red-600 text-center">
              {{ errorMsg }}
            </div>

            <div class="space-y-4">
              <!-- Nickname -->
              <div class="grid grid-cols-4 gap-3 items-center">
                <label class="col-span-1 text-right text-sm text-gray-600"
                  >Nickname :</label
                >
                <div class="col-span-3 text-black">
                  <input
                    data-testid="itbms-nickname"
                    v-model.trim="form.nickName"
                    type="text"
                    class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    :maxlength="40"
                  />
                </div>
              </div>

              <!-- Email (read-only) -->
              <div class="grid grid-cols-4 gap-3 items-center text-black">
                <label class="col-span-1 text-right text-sm text-gray-600"
                  >Email :</label
                >
                <div class="col-span-3">
                  <input
                    data-testid="itbms-email"
                    :value="form.email"
                    type="text"
                    class="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-600"
                    readonly
                  />
                </div>
              </div>

              <!-- Fullname -->
              <div class="grid grid-cols-4 gap-3 items-center text-black">
                <label class="col-span-1 text-right text-sm text-gray-600"
                  >Fullname :</label
                >
                <div class="col-span-3">
                  <input
                    data-testid="itbms-fullname"
                    v-model.trim="form.fullName"
                    type="text"
                    class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    :maxlength="40"
                  />
                </div>
              </div>

              <!-- Type (read-only) -->
              <div class="grid grid-cols-4 gap-3 items-center text-black">
                <label class="col-span-1 text-right text-sm text-gray-600"
                  >Type :</label
                >
                <div class="col-span-3">
                  <input
                    data-testid="itbms-type"
                    :value="form.userType"
                    type="text"
                    class="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-600"
                    readonly
                  />
                </div>
              </div>

              <!-- Seller extras (read-only) -->
              <template v-if="isSeller">
                <div class="grid grid-cols-4 gap-3 items-center">
                  <label class="col-span-1 text-right text-sm text-gray-600"
                    >Mobile :</label
                  >
                  <div class="col-span-3">
                    <input
                      data-testid="itbms-mobile"
                      :value="form.phoneNumber"
                      type="text"
                      class="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-600"
                      readonly
                    />
                  </div>
                </div>

                <div class="grid grid-cols-4 gap-3 items-center">
                  <label class="col-span-1 text-right text-sm text-gray-600"
                    >Bank Account No :</label
                  >
                  <div class="col-span-3">
                    <input
                      data-testid="itbms-bankAccount"
                      :value="form.bankAccount"
                      type="text"
                      class="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-600"
                      readonly
                    />
                  </div>
                </div>

                <div class="grid grid-cols-4 gap-3 items-center">
                  <label class="col-span-1 text-right text-sm text-gray-600"
                    >Bank Name :</label
                  >
                  <div class="col-span-3">
                    <input
                      data-testid="itbms-bankName"
                      :value="form.bankName"
                      type="text"
                      class="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-600"
                      readonly
                    />
                  </div>
                </div>
              </template>
            </div>

            <!-- Actions -->
            <div class="mt-6 flex items-center justify-center gap-3">
              <button
                data-testid="itbms-save-button"
                :disabled="!canSave"
                @click="save"
                class="px-5 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Save
              </button>
              <button
                data-testid="itbms-cancel-button"
                @click="cancel"
                class="px-5 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
