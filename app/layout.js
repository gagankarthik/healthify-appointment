import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Healthify",
  description: "A simple way to book appointment with one click",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div>
         
        {children}
        <Toaster />
        </div>
        </body>
    </html>
  );
}
