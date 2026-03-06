import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bradley Savoy | DevOps + SRE",
  description: "Synthwave-inspired blog by Bradley Savoy on DevOps, SRE, and platform reliability."
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
