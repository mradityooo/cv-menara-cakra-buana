
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Search, Building2, RefreshCw } from "lucide-react";

type Partner = {
  id: string;
  companyName: string;
  contactPerson: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
};

const emptyForm = {
  companyName: "",
  contactPerson: "",
  phone: "",
  email: "",
  address: "",
};

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(emptyForm);

  async function loadPartners() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/partners");
      if (!response.ok) {
        throw new Error("Gagal mengambil data partner.");
      }

      const data = await response.json();
      setPartners(data);
    } catch {
      setError("Data partner gagal dimuat. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPartners() {
      try {
        const response = await fetch("/api/partners", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data partner.");
        }

        const data = await response.json();
        setPartners(data);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError("Data partner gagal dimuat. Silakan coba lagi.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchPartners();
    return () => controller.abort();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan partner.");
      }

      setShowForm(false);
      setFormData(emptyForm);
      await loadPartners();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan."
      );
    } finally {
      setSaving(false);
    }
  }

  const filteredPartners = partners.filter((partner) =>
    `${partner.companyName} ${partner.contactPerson ?? ""} ${partner.phone ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#F5F7FB] p-4 text-slate-800 sm:p-8">
      <div className="mx-auto max-w-[1600px]">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={17} />
          Kembali ke Dashboard
        </Link>

        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-slate-500">Workspace / Admin HR / Partner</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              Manajemen Partner
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Kelola data perusahaan mitra outsourcing.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setError("");
              setFormData(emptyForm);
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={17} />
            Tambah Partner
          </button>
        </div>

        <section className="mb-5 grid gap-4 sm:grid-cols-3">
          <div className="border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-3 text-blue-600">
                <Building2 size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Partner</p>
                <p className="mt-1 text-2xl font-bold">{partners.length}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border border-slate-200 bg-white">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold text-slate-900">Daftar Partner</h2>
              <p className="mt-1 text-xs text-slate-500">
                Data perusahaan dari PostgreSQL.
              </p>
            </div>

            <div className="flex gap-2">
              <div className="flex items-center gap-2 border border-slate-200 px-3 py-2">
                <Search size={16} className="text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari perusahaan..."
                  className="w-full text-sm outline-none sm:w-48"
                />
              </div>
              <button
                type="button"
                onClick={loadPartners}
                className="border border-slate-200 px-3 text-slate-600 hover:bg-slate-50"
                aria-label="Muat ulang data"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          {error && (
            <div className="m-5 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left">
              <thead className="bg-slate-50">
                <tr className="text-xs text-slate-500">
                  <th className="px-5 py-4">Nama Perusahaan</th>
                  <th className="px-5 py-4">PIC</th>
                  <th className="px-5 py-4">Telepon</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Alamat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500">
                      Memuat data partner...
                    </td>
                  </tr>
                ) : filteredPartners.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500">
                      {search ? "Partner tidak ditemukan." : "Belum ada data partner."}
                    </td>
                  </tr>
                ) : (
                  filteredPartners.map((partner) => (
                    <tr key={partner.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 text-sm font-medium text-slate-900">
                        {partner.companyName}
                      </td>
                      <td className="px-5 py-4 text-sm">
                        {partner.contactPerson || "-"}
                      </td>
                      <td className="px-5 py-4 text-sm">
                        {partner.phone || "-"}
                      </td>
                      <td className="px-5 py-4 text-sm">
                        {partner.email || "-"}
                      </td>
                      <td className="px-5 py-4 text-sm">
                        {partner.address || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
            Menampilkan {filteredPartners.length} dari {partners.length} partner
          </div>
        </section>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <h2 className="text-lg font-bold text-slate-900">
                Tambah Partner
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium">
                    Nama Perusahaan *
                  </label>
                  <input
                    required
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    placeholder="PT Contoh Indonesia"
                    className="w-full border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Nama PIC</label>
                  <input
                    value={formData.contactPerson}
                    onChange={(e) =>
                      setFormData({ ...formData, contactPerson: e.target.value })
                    }
                    placeholder="Nama penanggung jawab"
                    className="w-full border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Nomor Telepon</label>
                  <input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="08xxxxxxxxxx"
                    className="w-full border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="kontak@perusahaan.com"
                    className="w-full border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium">Alamat</label>
                  <textarea
                    rows={3}
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Alamat perusahaan"
                    className="w-full border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="border border-slate-300 px-4 py-2.5 text-sm hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? "Menyimpan..." : "Simpan Partner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
