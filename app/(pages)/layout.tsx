"use client";
import type { Metadata } from "next";
import { Mukta } from "next/font/google";
import Header from "../(components)/header/Header";
import Sidebar from "../(components)/sidebar/Sidebar";
import { useEffect, useState } from "react";

export const inter = Mukta({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});


const metadata: Metadata = {
  title: "Medicare app",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebar, setSidebar] = useState<boolean>(true);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggleSidebar = () => {
    if (isSmallScreen) {
      setSidebar((prevSidebar) => !prevSidebar);
    }
  };
  return (
    <html lang="en">
    <body className={inter.className}>
        <div>
          <Header handleToggleSidebar={handleToggleSidebar} />
          <div>
            <Sidebar
              sidebar={!isSmallScreen || sidebar}
              handleToggleSidebar={handleToggleSidebar}
            />
            <main
              className={` ${
                isSmallScreen && !sidebar ? "ml-2" : "sm:ml-64 ml-35"
              }`}
            >
              {children}
            </main>
          </div>
        </div>
        </body>
    </html>
  );
}
