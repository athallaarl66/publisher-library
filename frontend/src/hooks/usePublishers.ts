import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";

export interface Publisher {
  id: number;
  name: string;
  address: string | null;
  email: string | null;
  createdAt: string;
  _count: { books: number };
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function usePublishers() {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/publishers", {
        params: { page, limit: 10, search },
      });
      setPublishers(res.data.data);
      setMeta(res.data.meta);
    } catch {
      setError("Gagal memuat data publishers");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const createPublisher = async (
    data: Omit<Publisher, "id" | "createdAt" | "_count">,
  ) => {
    await api.post("/api/publishers", data);
    fetch();
  };

  const updatePublisher = async (id: number, data: Partial<Publisher>) => {
    await api.put(`/api/publishers/${id}`, data);
    fetch();
  };

  const deletePublisher = async (id: number) => {
    await api.delete(`/api/publishers/${id}`);
    fetch();
  };

  return {
    publishers,
    meta,
    loading,
    error,
    page,
    setPage,
    search,
    setSearch,
    createPublisher,
    updatePublisher,
    deletePublisher,
    refetch: fetch,
  };
}
