"use client"
import { ReactNode, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/_libs/firebase"
import AuthContext from "./AuthContext";
import { User } from "@/_types";
import useLoader from "@/_store/useLoader";

/**
 * Provides an authentication context to its children.
 *
 * Listens to authentication state changes and provides the authenticated user
 * and a loading state to its descendants.
 *
 * @param props.children - The child components to be rendered within this provider.
 */
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