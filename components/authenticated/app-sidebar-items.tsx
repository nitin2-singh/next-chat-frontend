"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, User, LogOut, PanelLeft, Scale } from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/user";
import { ThemeToggle } from "../website-components/change-theme";
const NAV_ITEMS = [
  { label: "Chats", href: "/chat", icon: MessageSquare },
  { label: "Profile", href: "/profile", icon: User },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon" className="border-r">
      {/* ───────────── HEADER ───────────── */}
      <SidebarHeader className="h-14 px-3 flex flex-row items-center justify-between group-data-[collapsible=icon]:justify-center">
        <Link
          href="/chat"
          className="flex items-center gap-2 font-semibold text-sm group-data-[collapsible=icon]:hidden"
        >
          <Scale className="h-5 w-5 shrink-0 " />
          <span className="">ChatScale</span>
        </Link>
        {/* Collapse trigger — CORRECT PLACE */}
        <SidebarTrigger>
          <PanelLeft className="h-4 w-4" />
        </SidebarTrigger>
      </SidebarHeader>

      {/* ───────────── CONTENT ───────────── */}
      <SidebarContent className="px-2 py-2">
        <SidebarMenu className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={cn(
                    "h-10 rounded-md px-3 text-sm font-medium transition-colors",
                    "hover:bg-sidebar-accent",
                    isActive && "bg-sidebar-accent text-sidebar-foreground"
                  )}
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="group-data-[collapsible=icon]:hidden">
                      {item.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* ───────────── FOOTER ───────────── */}
      <SidebarFooter className="px-2 py-3 space-y-2">
        {/* Theme toggle */}
        <ThemeToggle open={open} variant="sidebar" />

        {/* Logout */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              className="
                h-10 rounded-md px-3
                text-sm font-medium text-red-500
                hover:bg-red-500/10
              "
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">
                Logout
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
