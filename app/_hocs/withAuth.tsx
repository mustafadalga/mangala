import { ComponentType, ReactElement } from "react";
import useAuth from "@/_providers/auth/useAuth";
import { redirect, usePathname } from "next/navigation";

type WithParamsProps = {
    params: {
        id: string;
    };
};


export default function withAuth<T extends WithParamsProps>(Component: ComponentType<T>): ComponentType<T> {
    return function Wrapper(props: T): ReactElement {
        const { user, isLoaded } = useAuth();
        const pathName = usePathname()
        if (isLoaded && !user) {
            return redirect(`/login?redirect=${pathName}`);

        }
        return <Component {...props} />;
    };
}