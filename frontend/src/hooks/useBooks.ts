import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";

export interface Book {
  id: number;
  title: string;
  isbn: string | null;
  genre: string | null;
  synopsis: string | null;
  publishedAt: string | null;
  authorId: number;
  publisherId: number;
  author: { id: number; name: string };
  publisher: { id: number; name: string };
  createdAt: string;
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [authorId, setAuthorId] = useState<number | undefined>();
  const [publisherId, setPublisherId] = useState<number | undefined>();
  const [genre, setGenre] = useState("");

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/books", {
        params: {
          page,
          limit: 10,
          search: search || undefined,
          authorId: authorId || undefined,
          publisherId: publisherId || undefined,
          genre: genre || undefined,
        },
      });
      setBooks(res.data.data);
      setMeta(res.data.meta);
    } catch {
      setError("Gagal memuat data books");
    } finally {
      setLoading(false);
    }
  }, [page, search, authorId, publisherId, genre]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const createBook = async (data: any) => {
    await api.post("/api/books", data);
    fetchBooks();
  };

  const updateBook = async (id: number, data: any) => {
    await api.put(`/api/books/${id}`, data);
    fetchBooks();
  };

  const deleteBook = async (id: number) => {
    await api.delete(`/api/books/${id}`);
    fetchBooks();
  };

  return {
    books,
    meta,
    loading,
    error,
    page,
    setPage,
    search,
    setSearch,
    authorId,
    setAuthorId,
    publisherId,
    setPublisherId,
    genre,
    setGenre,
    createBook,
    updateBook,
    deleteBook,
    refetch: fetchBooks,
  };
}
