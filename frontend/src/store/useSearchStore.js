import { defineStore } from "pinia";
import { ref } from "vue";

export const useSearchStore = defineStore("search", () => {
  const search = ref(sessionStorage.getItem("search") || "");

  const setSearch = (value) => {
    search.value = value;
    if (value) {
      sessionStorage.setItem("search", value);
    } else {
      sessionStorage.removeItem("search");
    }
    };
  return { search, setSearch };
});
