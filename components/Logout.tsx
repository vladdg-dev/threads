"use client";

import { FC, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";

const Logout: FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();

  return (
    <SignOutButton signOutCallback={() => router.push("/sign-in")}>
      {children}
    </SignOutButton>
  );
};

export default Logout;
