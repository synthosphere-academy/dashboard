import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_LOCALHOST_URL, {
  transports: ["websocket", "polling"],
});

socket.on("connect", () => {
  console.log("Socket Connected:", socket.id);
});

export default socket;