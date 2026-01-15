"use client";
import { useMe } from "@/hooks/auth";

export function PseduoComponent() {
  useMe();
  return null;
}
