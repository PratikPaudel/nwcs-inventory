"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import DashboardWrapper from "./dashboardWrapper";
import { Provider } from "react-redux";
import { store } from "@/app/redux/store";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <DashboardWrapper>{children}</DashboardWrapper>
        </Provider>
      </body>
    </html>
  );
}
