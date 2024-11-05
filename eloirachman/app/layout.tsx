import { Inter } from "next/font/google";
import AuthProvider from "@/components/providers/auth-provider";
import { Nav } from "@/components/nav";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Nav />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

export const metadata = {
  title: "Project Manager",
  description: "A comprehensive project management application",
};
