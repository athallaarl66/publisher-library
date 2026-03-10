"use client";

import { useState } from "react";
import { Pencil, Trash2, BookOpen } from "lucide-react";
import { usePublishers, type Publisher } from "@/hooks/usePublishers";
import PageHeader from "@/components/shared/PageHeader";
import SearchBar from "@/components/shared/SearchBar";
import FilterChips, { type FilterChip } from "@/components/shared/FilterChips";
import Pagination from "@/components/shared/Pagination";
import Modal from "@/components/shared/Modal";
import ConfirmDelete from "@/components/shared/ConfirmDelete";
import FormField from "@/components/shared/FormField";

interface PublisherForm {
  name: string;
  address: string;
  email: string;
}

const emptyForm: PublisherForm = { name: "", address: "", email: "" };

export default function PublishersPage() {
  const {
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
  } = usePublishers();

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Publisher | null>(null);
  const [form, setForm] = useState<PublisherForm>(emptyForm);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Publisher | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (pub: Publisher) => {
    setEditing(pub);
    setForm({
      name: pub.name,
      address: pub.address ?? "",
      email: pub.email ?? "",
    });
    setFormError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setFormError("Nama tidak boleh kosong");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        address: form.address || undefined,
        email: form.email || undefined,
      };
      editing
        ? await updatePublisher(editing.id, payload)
        : await createPublisher(payload as any);
      setShowModal(false);
    } catch (err: any) {
      setFormError(err.response?.data?.message ?? "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  const activeFilters: FilterChip[] = search
    ? [{ key: "search", label: "Nama", value: search }]
    : [];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Publishers"
        subtitle={`${meta?.total ?? 0} penerbit terdaftar`}
        onAdd={openCreate}
        addLabel="Tambah Publisher"
      />

      <SearchBar
        value={search}
        onChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        placeholder="Cari nama penerbit..."
      />

      <FilterChips
        filters={activeFilters}
        onRemove={() => {
          setSearch("");
          setPage(1);
        }}
        onClearAll={() => {
          setSearch("");
          setPage(1);
        }}
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
                  Nama
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                  Alamat
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                  Email
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Buku
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
              ) : publishers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-16 text-muted-foreground"
                  >
                    <BookOpen size={32} className="mx-auto mb-2 opacity-30" />
                    <p>
                      Belum ada publisher
                      {search ? ` dengan nama "${search}"` : ""}
                    </p>
                  </td>
                </tr>
              ) : (
                publishers.map((pub) => (
                  <tr
                    key={pub.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">{pub.name}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                      {pub.address ?? <span className="text-border">—</span>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {pub.email ?? <span className="text-border">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full text-xs">
                        <BookOpen size={11} />
                        {pub._count.books}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(pub)}
                          className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(pub)}
                          className="p-1.5 hover:bg-red-50 rounded-md transition-colors text-muted-foreground hover:text-red-500"
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
          title={editing ? "Edit Publisher" : "Tambah Publisher"}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2">
                {formError}
              </div>
            )}
            <FormField label="Nama" required>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Nama penerbit"
                autoFocus
              />
            </FormField>
            <FormField label="Alamat">
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Kota / alamat"
              />
            </FormField>
            <FormField label="Email">
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="email@penerbit.com"
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
          name={deleteConfirm.name}
          description="Publisher yang masih punya buku tidak bisa dihapus."
          onConfirm={async () => {
            try {
              await deletePublisher(deleteConfirm.id);
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
