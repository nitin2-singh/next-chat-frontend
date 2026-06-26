import { io, Socket } from "socket.io-client";
import { getAuthCookie } from "./token";

let socket: Socket | null = null;

export function getSocket() {
  const token = getAuthCookie();
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      path: "/socket.io",
      transports: ["websocket"],
      autoConnect: false,
      auth: {
        token,
      },
    });
  } else {
    socket.auth = { token };
  }

  return socket;
}
