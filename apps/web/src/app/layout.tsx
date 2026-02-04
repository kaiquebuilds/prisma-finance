import type { Metadata } from "next";
import { Figtree, Roboto } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prisma",
  description: "Retome o controle das suas finanças",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      localization={ptBR}
      signUpUrl="/sign-up"
      taskUrls={{
        "reset-password": "/session-tasks/reset-password",
      }}
    >
      <html lang="en">
        <body className={`${figtree.variable} ${roboto.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
