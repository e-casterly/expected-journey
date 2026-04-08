"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Dropdown,
  DropdownContent,
  DropdownList,
  DropdownTrigger,
  MenuItem,
} from "@/components/shared/dropdown";
import { User } from "better-auth";
import { signOutAction } from "@/app/actions/auth";

type HeaderAuthProps = {
  user: User | undefined;
};

export default function HeaderAuth({ user }: HeaderAuthProps) {
  if (!user) {
    return (
      <Link
        href="/signin"
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
      >
        Sign in
      </Link>
    );
  }

  return (
    <Dropdown role="menu" clickToToggle>
      <DropdownTrigger asChild>
        <button type="button" className="flex items-center gap-1 cursor-pointer">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name ?? "User avatar"}
              width={28}
              height={28}
              className="h-7 w-7 rounded-full border border-zinc-200"
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 text-xs font-semibold text-zinc-700">
              {(user.name?.[0] ?? user.email?.[0] ?? "U").toUpperCase()}
            </div>
          )}
          <span className="hidden text-sm text-zinc-700 sm:inline">
            {user.name ?? user.email}
          </span>
        </button>
      </DropdownTrigger>
      <DropdownContent>
        <DropdownList>
          <MenuItem asChild>
            <Link href="/profile">Profile</Link>
          </MenuItem>
          <form action={signOutAction}>
            <MenuItem asChild>
              <button type="submit">Sign out</button>
            </MenuItem>
          </form>
        </DropdownList>
      </DropdownContent>
    </Dropdown>
  );
}
