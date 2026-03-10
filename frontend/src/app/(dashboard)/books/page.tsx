"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, BookOpen, Filter } from "lucide-react";
import { useBooks, type Book } from "@/hooks/useBooks";
import api from "@/lib/axios";
import PageHeader from "@/components/shared/PageHeader";
import SearchBar from "@/components/shared/SearchBar";
import FilterChips, { type FilterChip } from "@/components/shared/FilterChips";
import Pagination from "@/components/shared/Pagination";
import Modal from "@/components/shared/Modal";
import ConfirmDelete from "@/components/shared/ConfirmDelete";
import FormField from "@/components/shared/FormField";

interface BookForm {
  title: string;
  isbn: string;
  genre: string;
  synopsis: string;
  publishedAt: string;
  authorId: string;
  publisherId: string;
}

const emptyForm: BookForm = {
  title: "",
  isbn: "",
  genre: "",
  synopsis: "",
  publishedAt: "",
  authorId: "",
  publisherId: "",
};

// Genre yang tersedia — sesuai seed data
const GENRES = [
  "Absurdist Fiction",
  "Drama",
  "Dystopian Fiction",
  "Historical Fiction",
  "Literary Fiction",
  "Philosophy",
  "Philosophical Fiction",
  "Political Satire",
  "Psychological Fiction",
  "Thriller",
];

export default function BooksPage() {
  const {
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
  } = useBooks();

  const [authors, setAuthors] = useState<{ id: number; name: string }[]>([]);
  const [publishers, setPublishers] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [form, setForm] = useState<BookForm>(emptyForm);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Book | null>(null);

  useEffect(() => {
    api
      .get("/api/authors", { params: { limit: 100 } })
      .then((r) => setAuthors(r.data.data));
    api
      .get("/api/publishers", { params: { limit: 100 } })
      .then((r) => setPublishers(r.data.data));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (book: Book) => {
    setEditing(book);
    setForm({
      title: book.title,
      isbn: book.isbn ?? "",
      genre: book.genre ?? "",
      synopsis: book.synopsis ?? "",
      publishedAt: book.publishedAt ? book.publishedAt.split("T")[0] : "",
      authorId: String(book.authorId),
      publisherId: String(book.publisherId),
    });
    setFormError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setFormError("Judul tidak boleh kosong");
      return;
    }
    if (!form.authorId) {
      setFormError("Pilih penulis");
      return;
    }
    if (!form.publisherId) {
      setFormError("Pilih penerbit");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        isbn: form.isbn || undefined,
        genre: form.genre || undefined,
        synopsis: form.synopsis || undefined,
        publishedAt: form.publishedAt
          ? new Date(form.publishedAt).toISOString()
          : undefined,
        authorId: parseInt(form.authorId),
        publisherId: parseInt(form.publisherId),
      };
      editing
        ? await updateBook(editing.id, payload)
        : await createBook(payload);
      setShowModal(false);
    } catch (err: any) {
      setFormError(err.response?.data?.message ?? "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  const activeFilters: FilterChip[] = [
    ...(search ? [{ key: "search", label: "Judul", value: search }] : []),
    ...(authorId
      ? [
          {
            key: "author",
            label: "Penulis",
            value:
              authors.find((a) => a.id === authorId)?.name ?? String(authorId),
          },
        ]
      : []),
    ...(publisherId
      ? [
          {
            key: "publisher",
            label: "Penerbit",
            value:
              publishers.find((p) => p.id === publisherId)?.name ??
              String(publisherId),
          },
        ]
      : []),
    ...(genre ? [{ key: "genre", label: "Genre", value: genre }] : []),
  ];

  const removeFilter = (key: string) => {
    if (key === "search") setSearch("");
    if (key === "author") setAuthorId(undefined);
    if (key === "publisher") setPublisherId(undefined);
    if (key === "genre") setGenre("");
    setPage(1);
  };

  const clearAllFilters = () => {
    setSearch("");
    setAuthorId(undefined);
    setPublisherId(undefined);
    setGenre("");
    setPage(1);
  };

  const hasActiveDropdownFilters = !!(authorId || publisherId || genre);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Books"
        subtitle={`${meta?.total ?? 0} buku terdaftar`}
        onAdd={openCreate}
        addLabel="Tambah Buku"
      />

      {/* Search + Filter toggle */}
      <div className="flex gap-3">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Cari judul buku..."
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
            showFilters || hasActiveDropdownFilters
              ? "border-primary bg-primary/10 text-primary"
              : "border-border hover:bg-muted text-muted-foreground"
          }`}
        >
          <Filter size={15} />
          <span className="hidden sm:inline">Filter</span>
          {hasActiveDropdownFilters && (
            <span className="w-4 h-4 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
              {[authorId, publisherId, genre].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Dropdown filter panel */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-muted/50 border border-border rounded-lg">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Penulis
            </label>
            <select
              value={authorId ?? ""}
              onChange={(e) => {
                setAuthorId(
                  e.target.value ? parseInt(e.target.value) : undefined,
                );
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Semua penulis</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Penerbit
            </label>
            <select
              value={publisherId ?? ""}
              onChange={(e) => {
                setPublisherId(
                  e.target.value ? parseInt(e.target.value) : undefined,
                );
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Semua penerbit</option>
              {publishers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Genre
            </label>
            <select
              value={genre}
              onChange={(e) => {
                setGenre(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Semua genre</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <FilterChips
        filters={activeFilters}
        onRemove={removeFilter}
        onClearAll={clearAllFilters}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Judul
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                  Penulis
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                  Penerbit
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">
                  Genre
                </th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-16 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm">Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : books.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-16 text-muted-foreground"
                  >
                    <BookOpen size={32} className="mx-auto mb-2 opacity-30" />
                    <p>
                      Belum ada buku{search ? ` dengan judul "${search}"` : ""}
                    </p>
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr
                    key={book.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">{book.title}</div>
                      {book.isbn && (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {book.isbn}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                      {book.author.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {book.publisher.name}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {book.genre ? (
                        <span className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full text-xs">
                          {book.genre}
                        </span>
                      ) : (
                        <span className="text-border">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(book)}
                          className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(book)}
                          className="p-1.5 hover:bg-red-50 rounded-md transition-colors text-muted-foreground hover:text-red-500"
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {meta && (
        <Pagination
          page={page}
          totalPages={meta.totalPages}
          total={meta.total}
          limit={meta.limit}
          onPageChange={setPage}
        />
      )}

      {showModal && (
        <Modal
          title={editing ? "Edit Buku" : "Tambah Buku"}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2">
                {formError}
              </div>
            )}
            <FormField label="Judul" required>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Judul buku"
                autoFocus
              />
            </FormField>
            <FormField label="Penulis" required>
              <select
                value={form.authorId}
                onChange={(e) => setForm({ ...form, authorId: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Pilih penulis</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Penerbit" required>
              <select
                value={form.publisherId}
                onChange={(e) =>
                  setForm({ ...form, publisherId: e.target.value })
                }
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Pilih penerbit</option>
                {publishers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="ISBN">
              <input
                type="text"
                value={form.isbn}
                onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="978-xxx-xxx-xxx-x"
              />
            </FormField>
            <FormField label="Genre">
              <select
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Pilih genre</option>
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Tanggal Terbit">
              <input
                type="date"
                value={form.publishedAt}
                onChange={(e) =>
                  setForm({ ...form, publishedAt: e.target.value })
                }
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </FormField>
            <FormField label="Sinopsis">
              <textarea
                value={form.synopsis}
                onChange={(e) => setForm({ ...form, synopsis: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Deskripsi singkat buku"
              />
            </FormField>
            <div className="flex gap-3 pt-2 pb-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {submitting ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteConfirm && (
        <ConfirmDelete
          name={deleteConfirm.title}
          onConfirm={async () => {
            try {
              await deleteBook(deleteConfirm.id);
              setDeleteConfirm(null);
            } catch (err: any) {
              alert(err.response?.data?.message ?? "Gagal menghapus");
            }
          }}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}
