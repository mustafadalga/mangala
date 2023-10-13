import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AuthProvider from "@/_providers/auth/AuthProvider";
import Header from "@/_components/Header";
import Loader from "@/_components/loader/Loader";

const inter = Inter({ subsets: [ 'latin' ] })

export const metadata: Metadata = {
    title: 'Realtime 2-Player Mangala Mind Game | Online Turkish Strategy Game',
    description: 'Engage in a competitive and fun game of Mangala, a traditional Turkish strategy game. Play in real-time with friends, enhance your strategic thinking, and enjoy a unique gaming experience online.',
    keywords: [
        'Mangala Game Online',
        'Turkish Strategy Game',
        'Realtime 2-Player Game',
        'Online Mind Game',
        'Competitive Strategy Game',
        'Mangala Mind Game',
        'Play Mangala Online',
        'Real-time Mangala',
        'Strategic Board Game',
        'Multiplayer Online Game'
    ],
    authors: [ { name: "Mustafa Dalga", "url": "https://github.com/mustafadalga/mangala" } ],
    icons: [
        {
            rel: "icon",
            type: "image/png",
            sizes: "32x32",
            url: "/favicon-32x32.png"
        },
        {
            rel: "apple-touch-icon",
            sizes: "180x180",
            url: "/apple-touch-icon.png"
        },
        {
            rel: "icon",
            type: "image/png",
            sizes: "16x16",
            url: "/favicon-16x16.png"
        }, {
            rel: "mask-icon",
            url: "/safari-pinned-tab.svg",
            color: "#a855f7"
        }
    ],
    themeColor: "#ffffff",
    applicationName: "Mangala",
}


export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={`${inter.className} flex flex-col min-h-screen w-full bg-gray-100`}>
        <AuthProvider>
            <Header/>
            <main className="grid flex-grow">
                {children}
            </main>
        </AuthProvider>
        <Loader/>
        <ToastContainer/>
        </body>
        </html>
    )
}
