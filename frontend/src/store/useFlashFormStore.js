import { defineStore, acceptHMRUpdate } from "pinia";

export const useFlashFormStore = defineStore("flashForm", {
  state: () => ({
    messages: [],
  }),

  actions: {
    setMessage(name, message, style) {
      const id = Date.now();
      this.messages.push({ id, name, message, style });
    },

    clearAllMessages() {
      this.messages = [];
    },

    removeMessage(name) {
      this.messages = this.messages.filter((msg) => msg.name !== name);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFlashFormStore, import.meta.hot));
}
