import {
  Carattere,
  DM_Sans,
  Instrument_Serif,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["500", "700"],
  style: ["normal", "italic"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  weight: ["400"],
  style: ["normal", "italic"],
});

const carattere = Carattere({
  subsets: ["latin"],
  variable: "--font-carattere",
  weight: ["400"],
});

export const metadata = {
  title: "Hanifullah Syukri",
  description: "Catatan, karya, dan pembelajaran.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${dmSans.variable} ${playfairDisplay.variable} ${instrumentSerif.variable} ${carattere.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
