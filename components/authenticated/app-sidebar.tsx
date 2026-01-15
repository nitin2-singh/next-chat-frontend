import { cookies } from "next/headers";
import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "./app-sidebar-items";
import { ReactNode } from "react";

export async function Sidebar({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="flex-1 py-3 px-4">{children}</main>
    </SidebarProvider>
  );
}
