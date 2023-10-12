import { ComponentType, ReactElement } from "react";
import useAuth from "@/_providers/auth/useAuth";
import { redirect, usePathname } from "next/navigation";

type WithParamsProps = {
    params: {
        id: string;
    };
};

/**
 * Higher-order component (HOC) that ensures a component is rendered only if the user is authenticated.
 * If the user is not authenticated, the HOC will redirect to the login page.
 *
 * @param Component - The component to be wrapped with authentication logic.
 * @returns A new component that wraps the provided component with authentication checks.
 *
 * @template T - The type of the props for the wrapped component which extends `WithParamsProps`.
 */
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