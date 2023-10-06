"use client";

import { signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, provider } from "@/_libs/firebase";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import useAuth from "@/_providers/auth/useAuth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { User } from "@/_types";

const isSameOrigin = (url: string): boolean => {
    try {
        const { origin } = new URL(url, window.location.origin);
        return origin === window.location.origin;
    } catch (error) {
        return false;
    }
};

export default function Page() {
    const { push } = useRouter()
    const { user, isLoaded } = useAuth();
    const searchParams = useSearchParams();
    const [ showScreen, setShowScreen ] = useState(false);


    const addUserToFirestore = useCallback(async (user: User) => {
        const userRef = doc(getFirestore(), 'users', user.uid);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
            });
        }
    }, []);
    const handleRedirect = useCallback(async () => {
        const redirectResult = await getRedirectResult(auth);
        if (redirectResult?.user) {
            await addUserToFirestore(redirectResult.user as User);
        }
        if (isLoaded && user) {
            const redirectTo = searchParams.get("redirect")
            if (redirectTo && isSameOrigin(redirectTo)) {
                push(redirectTo)
            } else {
                push("/")
            }
        }
    }, [ isLoaded, user, addUserToFirestore, push, searchParams ])

    useEffect(() => {
        if (isLoaded && !user) {
            setShowScreen(true);
        }

        handleRedirect();
        const timeoutID = setTimeout(() => {
            clearTimeout(timeoutID);
        }, 300)
    }, [ isLoaded, user, handleRedirect ]);

    if (!showScreen) return;

    return (
        <div
            className="fixed bg-neutral-800/70 grid place-items-center inset-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto h-screen w-screen max-h-full">
            <div
                className="mx-auto max-w-md w-full py-10 px-5 grid place-items-center bg-white rounded-lg shadow ">
                <h3 className="mb-4 text-xl font-medium text-purple-700 text-center">
                    Sign in to Mangala</h3>
                <button type="button"
                        onClick={() => signInWithRedirect(auth, provider)}
                        className="w-full max-w-sm mx-auto text-white bg-purple-700 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800">
                    Sign in / Register with Google
                </button>
            </div>
        </div>
    );
}