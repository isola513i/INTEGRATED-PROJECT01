// import { defineStore, acceptHMRUpdate } from "pinia";

// export const useFlashFormStore = defineStore("flash", {
//   state: () => ({
//     message: "",
//     style: "",
//   }),
//   actions: {
//     setMessage(message, style) {
//       this.message = message;
//       this.style = style;

//       setTimeout(() => {
//         this.message = "";
//         this.style = "";
//       }, 4000);
//     },
//     clearMessage() {
//       this.message = "";
//       this.style = "";
//     },
//   },
// });
// //hot module
// if (import.meta.hot) {
//   import.meta.hot.accept(acceptHMRUpdate(useFlashFormStore, import.meta.hot));
// }
import { defineStore, acceptHMRUpdate } from "pinia";

export const useFlashFormStore = defineStore("flashForm", {
  state: () => ({
    messages: [], // Array to hold multiple messages
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

// Hot module replacement
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFlashFormStore, import.meta.hot));
}
