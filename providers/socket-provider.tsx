"use client";

import { useEffect } from "react";
import { getSocket } from "@/lib/socket";

export function SocketProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const socket = getSocket();
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return <>{children}</>;
}
