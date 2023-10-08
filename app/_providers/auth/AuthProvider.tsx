"use client"
import { ReactNode, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/_libs/firebase"
import AuthContext from "./AuthContext";
import { User } from "@/_types";
import useLoader from "@/_store/useLoader";

export default function AuthProvider({ children }: {
    children: ReactNode
}) {
    const loader = useLoader();
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

    useEffect(() => {
        isLoaded ? loader.onClose() : loader.onOpen();
    }, [ isLoaded ]);

    const contextValue = useMemo(() => {
        return {
            user,
            isLoaded
        }
    }, [ user, isLoaded ]);


    return <AuthContext.Provider value={contextValue}>
        {children}
    </AuthContext.Provider>
}