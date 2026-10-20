import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'Selective disclosure — educational example',
  description: 'Reveal some claims, keep the rest as salted hashes. The issuer signature is not checked.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
