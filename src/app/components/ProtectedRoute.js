"use client";

import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <p className="text-center mt-10">Carregando...</p>;

  return user ? children : null;
};

export default ProtectedRoute;
