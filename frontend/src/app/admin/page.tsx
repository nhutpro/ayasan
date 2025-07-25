"use client";
import { useEffect, useState } from "react";
import { ErrorBoundary } from 'react-error-boundary';
import Worker from "@/app/components/worker";
import Service from "../components/service";
import Booking from "../components/booking";
import Announcement from "../components/announcement";
import Header from "../components/header";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { logout } from "../utils/functions";

const MENU = [
    { key: "worker", label: "Worker Management" },
    { key: "pricing", label: "Price Service Management" },
    { key: "booking", label: "Booking Management" },
    { key: "announcement", label: "Announcement Management" },
];

function ErrorFallback({ error }: { error: Error }) {

    useEffect(() => {
        console.error('Caught by ErrorBoundary:', error);

        logout();
    }, [error]);

    return null; // or loading spinner, fallback UI, etc.
}

export default function AdminPage() {
    const [active, setActive] = useState("pricing");
    const logoutButton = () => {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        window.location.href = "/login";

    };

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header onLogout={logoutButton} />
                <div className="flex flex-1">
                    {/* Sidebar Menu */}
                    <nav className="w-64 bg-white border-r p-6">
                        <ul className="space-y-2">
                            {MENU.map((item) => (
                                <li key={item.key}>
                                    <button
                                        className={`w-full text-left px-4 py-2 rounded ${active === item.key
                                            ? "bg-blue-600 text-white font-semibold"
                                            : "hover:bg-blue-100"
                                            }`}
                                        onClick={() => setActive(item.key)}
                                    >
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    {/* Main Content */}
                    <main className="flex-1 p-8">
                        {active === "worker" && (
                            <Worker />
                        )}
                        {active === "pricing" && (
                            <Service />
                        )}
                        {active === "booking" && (
                            <Booking />
                        )}
                        {active === "announcement" && (
                            <Announcement />
                        )}
                    </main>
                </div>
            </div>
        </ErrorBoundary>

    );
}