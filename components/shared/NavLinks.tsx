"use client";

import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FC } from "react";

const NavLinks: FC<{ className?: string; labelClassName: string }> = ({
  className,
  labelClassName,
}) => {
  const pathname = usePathname();

  return sidebarLinks.map((link) => {
    const isActive =
      (pathname.includes(link.route) && link.route.length > 1) ||
      pathname === link.route;

    return (
      <Link
        href={link.route}
        key={link.id}
        className={`leftsidebar_link ${className} ${
          isActive && "bg-primary-500"
        }`}
      >
        <Image src={link.imgURL} alt={link.label} width={24} height={24} />
        <p className={labelClassName}>
          {labelClassName.includes("max-sm:hidden")
            ? link.label.split(/\s+/)[0]
            : link.label}
        </p>
      </Link>
    );
  });
};

export default NavLinks;
