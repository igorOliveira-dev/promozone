"use client";

import React, { useState, useEffect } from "react";
import { db } from "../../firebase"; // Caminho para seu arquivo de configuração do Firebase
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import Image from "next/image";

function Main() {
  // Estado para armazenar os produtos
  const [products, setProducts] = useState([]);
  // Estado para controlar quantos produtos serão exibidos por categoria (quando não houver busca)
  const [visibleCounts, setVisibleCounts] = useState({});
  // Estado para definir quantos cards cabem na largura da tela do usuário
  const [initialLimit, setInitialLimit] = useState(0);
  // Estado para armazenar o termo de pesquisa
  const [searchQuery, setSearchQuery] = useState("");
  // Estado para controle de carregamento
  const [loading, setLoading] = useState(true);

  // Função que calcula o número de cards com base na largura da tela
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

  // Define o initialLimit ao montar o componente e atualiza em caso de redimensionamento
  useEffect(() => {
    const limit = calculateLimit();
    setInitialLimit(limit);

    const handleResize = () => {
      setInitialLimit(calculateLimit());
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

  // Filtrar os produtos com base na pesquisa (por nome)
  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Agrupar os produtos por categoria somente quando não houver pesquisa
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category || "Sem Categoria";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  // Obter as categorias em ordem alfabética
  const sortedCategories = Object.keys(groupedProducts).sort((a, b) => a.localeCompare(b));

  // Função que renderiza o card com os preços atual e antigo
  const renderCard = (product) => (
    <div key={product.id} className="gray rounded p-4 max-w-[250px]">
      <a href={product.link} target="_blank" rel="noopener noreferrer" className="flex justify-center">
        <Image src={product.image} alt={product.name} className="w-48 h-48 object-cover mb-2" width={115} height={115} />
      </a>
      <h3 className="font-semibold">{product.name}</h3>
      <div className="flex items-center gap-2">
        {product.oldPrice && <span className="text-gray-500 line-through">{product.oldPrice}</span>}
        <span className="font-bold text-2xl">{product.price}</span>
      </div>
      <p>{product.description}</p>
      <a href={product.link} target="_blank" rel="noopener noreferrer">
        <button className="mt-2 mb-2 p-2 bg-blue-800 hover:bg-blue-900 cursor-pointer">COMPRAR AGORA</button>
      </a>
      <p className="text-sm text-gray-600">Categoria: {product.category}</p>
    </div>
  );

  // Se estiver carregando, exibe o spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Campo de pesquisa */}
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
        // Se houver termo de busca, mostra os produtos filtrados sem agrupamento
        <div>
          <h2 className="text-2xl font-bold mt-4 mb-2">Resultados da pesquisa</h2>
          <div className="flex gap-4 flex-wrap">{filteredProducts.map(renderCard)}</div>
        </div>
      ) : (
        // Se não houver pesquisa, mostra os produtos agrupados por categoria
        sortedCategories.map((category) => {
          const categoryProducts = groupedProducts[category];
          const visibleCount = visibleCounts[category] || initialLimit;

          return (
            <div key={category} className="mb-8">
              <h2 className="text-2xl font-bold mt-4 mb-2">{category} em alta</h2>
              <div className="flex gap-4 flex-wrap">{categoryProducts.slice(0, visibleCount).map(renderCard)}</div>
              {visibleCount < categoryProducts.length && (
                <button
                  className="mt-4 p-2 underline cursor-pointer text-white rounded"
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
