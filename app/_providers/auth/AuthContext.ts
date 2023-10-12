import { createContext } from "react";
import { User } from "@/_types";


export interface ContextType {
    user: User | null,
    isLoaded: boolean
}
/**
 * Creates a React context for authentication.
 */
export default createContext<ContextType | null>(null);
