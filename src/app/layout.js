import Header from "./components/Header";
import "./globals.css";

export const metadata = {
  title: "Promo Zone",
  description: "Bem vindo ao melhor site de promoções 🔥. Temos todos os tipos de produtos com os melhores preços!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className="mt-[95px]">
        <Header />
        {children}
      </body>
    </html>
  );
}
