import { defineStore, acceptHMRUpdate } from "pinia";

export const useFlashStore = defineStore("flash", {
  state: () => ({
    message: "",
    style: "",
  }),
  actions: {
    setMessage(message, style) {
      this.message = message;
      this.style = style;

      setTimeout(() => {
        this.message = "";
        this.style = "";
      }, 4000);
    },
    clearMessage() {
      this.message = "";
      this.style = "";
    },
  },
});
//hot module
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFlashStore, import.meta.hot));
}
