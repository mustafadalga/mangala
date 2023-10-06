"use client";
import { FaDiceFour } from "react-icons/fa"
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/_libs/firebase";
import useAuth from "@/_providers/auth/useAuth";
import { usePathname } from "next/navigation";

export default function Header() {
    const { user, isLoaded } = useAuth();
    const pathname = usePathname();
    const isRoomPage = pathname.includes("/room/");

    if (isRoomPage) return null;

    const showSignOut = isLoaded && !!user;
    return (
        <nav className=" bg-purple-800 flex items-center h-16">
            <div className="container mx-auto px-4 sm:px-0 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <FaDiceFour className="text-purple-400 text-4xl"/>
                    <Link href="/" className="text-white text-base">Home</Link>
                </div>

                {showSignOut && <button type="button"
                                        className="text-white text-base"
                                        onClick={() => signOut(auth)}>Sign Out
                </button>}

            </div>
        </nav>
    );
};