import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/utils/ThemeProvider";
import NextAuthSessionProvider from "@/components/page/auth/NextAuthSessionProvider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import ReduxProvider from "@/components/ReduxProvider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import ReactQueryProvider from "@/components/utils/ReactQueryProvider";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hanap BH",
  description:
    "A website utilizing google maps api to locate your nearby boarding houses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("antialiased overflow-x-hidden", poppins.className)}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ReactQueryProvider>
            <NextAuthSessionProvider>
              {children}
              <Toaster position="top-center" richColors />
            </NextAuthSessionProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
