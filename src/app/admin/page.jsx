"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { db } from "../firebase"; // Caminho para seu arquivo de configuração do Firebase
import { collection, addDoc, onSnapshot, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import Image from "next/image";

const AdminPage = () => {
  // Estado para os dados do novo produto, incluindo os campos de preço antigo e atual
  const [newProduct, setNewProduct] = useState({
    link: "",
    category: "",
    name: "",
    oldPrice: "",
    price: "",
    image: "",
    description: "",
  });

  // Estado para armazenar os produtos cadastrados
  const [products, setProducts] = useState([]);

  // Função para atualizar os campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Função para cadastrar um novo produto no Firestore, incluindo o campo createdAt
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "products"), {
        ...newProduct,
        createdAt: serverTimestamp(),
      });
      setNewProduct({
        link: "",
        category: "",
        name: "",
        oldPrice: "",
        price: "",
        image: "",
        description: "",
      });
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
    }
  };

  // Função para excluir um produto
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
    }
  };

  // Buscar produtos cadastrados e atualizar em tempo real
  useEffect(() => {
    const q = collection(db, "products");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = [];
      snapshot.forEach((docSnapshot) => {
        productsData.push({ id: docSnapshot.id, ...docSnapshot.data() });
      });
      setProducts(productsData);
    });
    return () => unsubscribe();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="gray p-6 rounded-lg shadow-lg text-center mb-8">
          <h1 className="text-2xl font-bold mb-4">Área Administrativa</h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleChange}
              className="border p-2"
              placeholder="Nome do produto"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="link"
                value={newProduct.link}
                onChange={handleChange}
                className="border p-2"
                placeholder="Insira seu link de afiliado"
                required
              />
              <input
                type="text"
                name="category"
                value={newProduct.category}
                onChange={handleChange}
                className="border p-2"
                placeholder="Insira a categoria do produto"
                required
              />
              <input
                type="text"
                name="oldPrice"
                value={newProduct.oldPrice}
                onChange={handleChange}
                className="border p-2"
                placeholder="Preço Antigo"
              />
              <input
                type="text"
                name="price"
                value={newProduct.price}
                onChange={handleChange}
                className="border p-2"
                placeholder="Preço Atual"
                required
              />
              <div className="flex flex-col">
                <p className="text-xs">https://drive.google.com/uc?export=view&id=</p>
                <input
                  type="text"
                  name="image"
                  value={newProduct.image}
                  onChange={handleChange}
                  className="border p-2"
                  placeholder="URL da imagem do produto"
                  required
                />
              </div>
              <textarea
                name="description"
                value={newProduct.description}
                onChange={handleChange}
                className="border p-2"
                placeholder="Descrição do produto"
                required
              />
              <input type="submit" className="border p-2 cursor-pointer" value="Criar Produto" />
            </div>
          </form>
        </div>
        <div className="w-full max-w-4xl">
          <h2 className="text-xl font-bold mb-4">Produtos Cadastrados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="gray rounded p-4 relative">
                <a href={product.link} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover mb-2"
                    width={100}
                    height={100}
                  />
                </a>
                <h3 className="font-semibold">{product.name}</h3>
                {/* Exibe o preço antigo riscado e o preço atual */}
                <div className="flex items-center gap-2">
                  {product.oldPrice && <span className="text-gray-500 line-through">{product.oldPrice}</span>}
                  <span className="font-bold text-2xl">{product.price}</span>
                </div>
                <p>{product.description}</p>
                <a href={product.link}>
                  <button className="mt-2 mb-2 p-2 bg-blue-800 hover:bg-blue-900 cursor-pointer">COMPRAR AGORA</button>
                </a>
                <p className="text-sm text-gray-600">Categoria: {product.category}</p>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
                >
                  Excluir
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminPage;
