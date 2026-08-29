import type { Metadata } from "next";
import { Geist, Geist_Mono, Atkinson_Hyperlegible } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const atkinsonHyperlegible = Atkinson_Hyperlegible({
  variable: "--font-dyslexic",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Learnova — AI that supports your teachers",
  description:
    "A personalized learning companion for CBSE, ICSE, ISC, Cambridge, and Telangana State Board students.",
};

// Applies the saved reading-mode preference before first paint, so switching
// to the dyslexia-friendly typeface never causes a flash of the wrong font.
const READING_MODE_INIT_SCRIPT = `
(function () {
  try {
    if (localStorage.getItem('reading-mode') === 'dyslexia') {
      document.documentElement.setAttribute('data-reading-mode', 'dyslexia');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${atkinsonHyperlegible.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: READING_MODE_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
