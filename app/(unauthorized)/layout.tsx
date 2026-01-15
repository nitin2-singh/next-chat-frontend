import { Navbar } from "@/components/website-components/navbar";
import { ReactNode } from "react";

export default function UnauthorizedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
