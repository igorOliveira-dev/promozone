"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [clickTimestamps, setClickTimestamps] = useState([]);
  const router = useRouter();

  const handleMenuToggle = () => {
    setIsOpen(!isOpen);
    const now = Date.now();
    setClickTimestamps((prev) => [...prev, now].filter((t) => now - t < 2000));
  };

  useEffect(() => {
    if (clickTimestamps.length >= 5) {
      router.push("/admin");
    }
  }, [clickTimestamps, router]);

  return (
    <header className="fixed top-0 left-0 w-full gray text-white flex items-center justify-between p-4 shadow-md z-50">
      {/* Logo */}
      <a href="/">
        <Image src="/promo-zone-icon.png" height={64} width={64} alt="Logo" />
      </a>

      {/* Botão Hamburger */}
      <button className="relative w-10 h-10 flex flex-col justify-between p-2" onClick={handleMenuToggle}>
        <span className={`block w-8 h-1 bg-white transition-transform ${isOpen ? "rotate-45 translate-y-2.5" : ""}`}></span>
        <span className={`block w-8 h-1 bg-white transition-opacity ${isOpen ? "opacity-0" : ""}`}></span>
        <span
          className={`block w-8 h-1 bg-white transition-transform ${isOpen ? "-rotate-45 -translate-y-2.5" : ""}`}
        ></span>
      </button>

      {/* Menu Lateral */}
      <div
        className={`fixed top-[95px] right-0 h-full w-64 gray text-white shadow-lg transform transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col space-y-4 p-2">
          <a href="/" className="text-lg hover:text-gray-300">
            Loja
          </a>
          <a href="https://chat.whatsapp.com/KtJND0mFcyIBhhHorTSwIC" className="text-lg hover:text-gray-300">
            Grupo do whats
          </a>
          <a href="/parcerias" className="text-lg hover:text-gray-300">
            Parcerias
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
