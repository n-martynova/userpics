import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
});

const url = process.env.NODE_ENV === "production" ? "https://whatsapp-userpics.onrender.com" : "http://localhost:4000";
// const url = "https://whatsapp-userpics.onrender.com";

export const socket = io(url);

socket.on("connect", () => {
  state.connected = true;
  console.log('connected');
});

socket.on("disconnect", () => {
  state.connected = false;
  console.log('disconnected');
});