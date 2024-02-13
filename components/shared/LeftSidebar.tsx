import { SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import NavLinks from "./NavLinks";
import Logout from "../Logout";

const LeftSidebar = () => {
  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        <NavLinks labelClassName="text-light-1 max-lg:hidden" />
      </div>
      <div className="mt-10 px-6">
        <SignedIn>
          <Logout>
            <div className="flex cursor-pointer gap-4 p-4">
              <Image
                src="/assets/logout.svg"
                alt="logout"
                width={24}
                height={24}
              />
              <p className="text-light-2 max-lg:hidden">Log out</p>
            </div>
          </Logout>
        </SignedIn>
      </div>
    </section>
  );
};

export default LeftSidebar;
