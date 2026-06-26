import { cookies } from "next/headers";
import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "./app-sidebar-items";
import { ReactNode } from "react";

export async function Sidebar({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen} className="h-screen w-screen overflow-hidden flex" style={{ minHeight: "0px", height: "100vh" }}>
      <AppSidebar />
      <main className="flex-1 h-full overflow-hidden flex flex-col min-h-0">{children}</main>
    </SidebarProvider>
  );
}
