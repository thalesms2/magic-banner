import { AuthButton } from "@/components/auth/auth-button";
import { Suspense } from "react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-14">
                <div className="w-full max-w-5xl flex justify-end items-center px-2 text-sm">
                    <Suspense>
                        <AuthButton />
                    </Suspense>
                </div>
            </nav>
            {children}
        </>
    );
}
