import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

function Header() {
  const { data: sessionData } = useSession();
  return (
    <nav className=" flex items-center justify-between bg-[#475B63] p-3">
      <div className=" text-3xl text-white">
        {sessionData?.user?.name
          ? `Event Memo for ${sessionData?.user?.name}`
          : ""}
      </div>
      <div>
        {sessionData ? (
          <div
            className="w-10 cursor-pointer overflow-hidden rounded-full"
            onClick={() => void signOut()}
          >
            <Image
              src={sessionData?.user?.image ?? ""}
              alt={sessionData?.user?.name ?? ""}
              width={500}
              height={500}
            />
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
