"use client"
import { ReactNode, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/_libs/firebase"
import AuthContext from "./AuthContext";
import Loader from "@/_components/loader/Loader";
import { User } from "@/_types";

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [ user, setUser ] = useState<User | null>(null);
    const [ isLoaded, setIsLoaded ] = useState<boolean>(false);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,

                });
            } else {
                setUser(null);
            }
            setIsLoaded(true);
        });

        return () => unsubscribe();
    }, []);

    const contextValue = useMemo(() => {
        return {
            user,
            isLoaded
        }
    }, [ user, isLoaded ]);

    return <AuthContext.Provider value={contextValue}>
        {!isLoaded ? <Loader/>:""}
            {children}
        </AuthContext.Provider>
        }