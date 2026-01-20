import { UserStoreProvider } from "@/stores/user/provider";

export default function PrivateLayout(props: Readonly<{ children: React.ReactNode }>) {
    const { children } = props;

    return <UserStoreProvider> {children}</UserStoreProvider>;
}       