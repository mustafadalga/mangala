import { useContext } from "react";
import AuthContext from "./AuthContext";

/**
 * Custom hook to access the authentication context.
 *
 * @returns The authentication context containing the user and loading state.
 * @throws {Error} If the hook is not used within an `AuthProvider`.
 */
export default function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
};
