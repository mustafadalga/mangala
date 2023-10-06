import { createContext } from "react";
import { User } from "@/_types";


export interface ContextType {
    user: User | null,
    isLoaded: boolean
}

export default createContext<ContextType | null>(null);
