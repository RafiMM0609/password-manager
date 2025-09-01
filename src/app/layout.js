import "./globals.css";

export const metadata = {
  title: "Password Manager",
  description: "Secure password manager application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
