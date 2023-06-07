import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

function Header() {
  const { data: sessionData } = useSession();
  return (
    <nav className=" flex items-center justify-between bg-[#475B63] p-3">
      <div className=" text-xl text-white lg:text-3xl">
        {sessionData?.user?.name
          ? `Event Memo for ${sessionData?.user?.name}`
          : ""}
      </div>
      <div>
        {sessionData ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => void signOut()}
              className="rounded-md bg-red-600 p-1 text-white hover:bg-red-700"
            >
              Sign Out
            </button>
            <div className="w-10 overflow-hidden rounded-full">
              <Image
                src={sessionData?.user?.image ?? ""}
                alt={sessionData?.user?.name ?? ""}
                width={500}
                height={500}
              />
            </div>
          </div>
        ) : (
          <button
            className=" cursor-pointer rounded-md bg-[#2E2C2F] p-2 text-3xl text-white duration-75 hover:bg-[#434144]"
            onClick={() => void signIn()}
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}

export default Header;
