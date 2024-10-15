"use client";
import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { AuthProvider } from "~/providers/authProvider";
import { DataProvider } from "~/providers/dataProvider";


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <AuthProvider>
        <DataProvider>
          <body className="dark">{children}</body>
        </DataProvider>
      </AuthProvider>
    </html>
  );
}
