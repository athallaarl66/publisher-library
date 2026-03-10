import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";

export interface Author {
  id: number;
  name: string;
  bio: string | null;
  birthDate: string | null;
  createdAt: string;
  _count: { books: number };
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useAuthors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/authors", {
        params: { page, limit: 10, search },
      });
      setAuthors(res.data.data);
      setMeta(res.data.meta);
    } catch {
      setError("Gagal memuat data authors");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const createAuthor = async (
    data: Omit<Author, "id" | "createdAt" | "_count">,
  ) => {
    await api.post("/api/authors", data);
    fetch();
  };

  const updateAuthor = async (id: number, data: Partial<Author>) => {
    await api.put(`/api/authors/${id}`, data);
    fetch();
  };

  const deleteAuthor = async (id: number) => {
    await api.delete(`/api/authors/${id}`);
    fetch();
  };

  return {
    authors,
    meta,
    loading,
    error,
    page,
    setPage,
    search,
    setSearch,
    createAuthor,
    updateAuthor,
    deleteAuthor,
    refetch: fetch,
  };
}
