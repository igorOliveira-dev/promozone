"use client";

import React, { useState, useEffect } from "react";
import { db } from "../../firebase"; // Caminho para seu arquivo de configuração do Firebase
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import Image from "next/image";

function Main() {
  const [products, setProducts] = useState([]);
  const [visibleCounts, setVisibleCounts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [initialLimit, setInitialLimit] = useState(0);

  // Calcula quantos cards cabem na tela com base na largura atual
  const calculateLimit = () => {
    const width = window.innerWidth;
    let limit = 2; // valor padrão
    if (width < 640) {
      limit = 2;
    } else if (width < 768) {
      limit = 3;
    } else if (width < 1024) {
      limit = 4;
    } else {
      limit = 5;
    }
    return limit;
  };

  // Define o initialLimit ao montar e atualiza em caso de redimensionamento da tela
  useEffect(() => {
    const limit = calculateLimit();
    setInitialLimit(limit);

    const handleResize = () => {
      const newLimit = calculateLimit();
      setInitialLimit(newLimit);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Buscar produtos do Firebase
  useEffect(() => {
    const productsQuery = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(productsQuery, (snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category || "Sem Categoria";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  const sortedCategories = Object.keys(groupedProducts).sort((a, b) => a.localeCompare(b));

  const renderCard = (product) => (
    <div key={product.id} className="gray rounded-lg p-4 shadow-md">
      <a href={product.link} target="_blank" rel="noopener noreferrer" className="flex justify-center">
        <div className="w-full h-48 relative">
          <Image src={product.image} alt={product.name} layout="fill" objectFit="contain" className="mb-2" />
        </div>
      </a>
      <h3 className="font-semibold my-2">{product.name}</h3>
      <div className="flex items-center gap-2">
        {product.oldPrice && <span className="text-gray-500 line-through">{product.oldPrice}</span>}
        <span className="font-bold text-lg text-blue-700">{product.price}</span>
      </div>
      <p className="text-sm text-gray-700 mb-2">{product.description}</p>
      <a href={product.link} target="_blank" rel="noopener noreferrer">
        <button className="w-full p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">COMPRAR AGORA</button>
      </a>
      <p className="text-xs text-gray-500 mt-2">Categoria: {product.category}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Pesquisar produto..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-full max-w-[700px]"
        />
      </div>

      {searchQuery ? (
        <div>
          <h2 className="text-2xl font-bold mt-4 mb-2">Resultados da pesquisa</h2>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredProducts.map(renderCard)}
          </div>
        </div>
      ) : (
        sortedCategories.map((category) => {
          const categoryProducts = groupedProducts[category];
          // Se não houver contagem definida para a categoria, usa o initialLimit calculado
          const visibleCount = visibleCounts[category] || initialLimit;

          return (
            <div key={category} className="mb-8">
              <h2 className="text-2xl font-bold mt-4 mb-2">{category} em alta</h2>
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {categoryProducts.slice(0, visibleCount).map(renderCard)}
              </div>
              {visibleCount < categoryProducts.length && (
                <button
                  className="mt-4 p-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md"
                  onClick={() =>
                    setVisibleCounts((prev) => ({
                      ...prev,
                      [category]: (prev[category] || initialLimit) + initialLimit,
                    }))
                  }
                >
                  Expandir categoria
                </button>
              )}
              <hr className="mb-4 mt-4" />
            </div>
          );
        })
      )}
    </div>
  );
}

export default Main;
