import { Sidebar } from "@/components/authenticated/app-sidebar";
import { PseduoComponent } from "@/components/authenticated/pseudo-component";
import { SocketProvider } from "@/providers/socket-provider";
import { ReactNode } from "react";

export default function AuthorizedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <SocketProvider>
        <Sidebar>
          <PseduoComponent />
          {children}
        </Sidebar>
      </SocketProvider>
    </>
  );
}
