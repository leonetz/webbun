import React from "react";
import { TopNav } from "../components/nav-top";
import { Sidebar } from "../components/sidebar";

export default function Page({
    children
}: {
    children :React.ReactNode;
}) {
    return (
        <div>
            <TopNav/>
            <main className="min-w-full flex">
                <Sidebar/>
                {children}
            </main>
        </div>


    );
}