import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faLinkedin,
  faDiscord,
} from "@fortawesome/free-brands-svg-icons";

import { UserProvider } from "@auth0/nextjs-auth0/client";

import { NavBarButtons } from "../components/logincheck";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DUWIT Together",
  description: "DUWIT Hacks Team Builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <UserProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen flex flex-col`}
        >
          <div className="navbar bg-base-100 shadow-sm px-5 flex-none">
            <div className="flex-1">
              <p className="font-semibold text-xl">DUWIT Together</p>
            </div>
            <div className="flex-none">
              <NavBarButtons />
            </div>
          </div>
          <div className="grow">{children}</div>
          <footer className="footer sm:footer-horizontal bg-neutral text-neutral-content items-center p-4 flex-none">
            <aside className="grid-flow-col items-center">
              <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
            </aside>
            <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
              <a>
                <FontAwesomeIcon className="size-6" icon={faDiscord} />
              </a>
              <a>
                <FontAwesomeIcon className="size-6" icon={faLinkedin} />
              </a>
              <a>
                <FontAwesomeIcon className="size-6" icon={faInstagram} />
              </a>
            </nav>
          </footer>
        </body>
      </UserProvider>
    </html>
  );
}
