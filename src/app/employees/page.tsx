
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Search,
  Users,
  RefreshCw,
} from "lucide-react";


type Employee = {
  id: string;
  employeeNumber: string;
  fullName: string;
  phone: string | null;
  email: string | null;
  position: string | null;
  address: string | null;
  joinDate: string | null;
  status: "ACTIVE" | "INACTIVE" | "RESIGNED";
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingEmployee, setEditingEmployee] =
  useState<Employee | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
   employeeNumber: "",
   fullName: "",
   phone: "",
   email: "",
   position: "",
   address: "",
   joinDate: "",
 });

        
    async function handleUpdate(
    event: React.FormEvent<HTMLFormElement>
    ) {
    event.preventDefault();

    if (!editingEmployee) return;

    setSaving(true);
    setFormError("");

    try {
        const response = await fetch(
        `/api/employees/${editingEmployee.id}`,
        {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        }
        );

        const result = await response.json();

        if (!response.ok) {
        throw new Error(
            result.message || "Gagal memperbarui karyawan."
        );
        }

        setEditingEmployee(null);
        await loadEmployees();
    } catch (error) {
        setFormError(
        error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat memperbarui data."
        );
    } finally {
        setSaving(false);
    }
    }

    async function handleDelete(employee: Employee) {
    const confirmed = window.confirm(
        `Yakin ingin menghapus karyawan ${employee.fullName}?`
    );

    if (!confirmed) return;

    try {
        const response = await fetch(
        `/api/employees/${employee.id}`,
        { method: "DELETE" }
        );

        const result = await response.json();

        if (!response.ok) {
        window.alert(
            result.message || "Gagal menghapus karyawan."
        );
        return;
        }

        await loadEmployees();
    } catch {
        window.alert("Terjadi kesalahan saat menghapus karyawan.");
    }
    }

  
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFormError("");

    try {
        const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (!response.ok) {
        throw new Error(
            result.message || "Gagal menyimpan data karyawan."
        );
        }

        setShowForm(false);
        setFormData({
        employeeNumber: "",
        fullName: "",
        phone: "",
        email: "",
        position: "",
        address: "",
        joinDate: "",
        });

        await loadEmployees();
    } catch (error) {
        setFormError(
        error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat menyimpan data."
        );
    } finally {
        setSaving(false);
    }
    }

    async function loadEmployees() {
     setLoading(true);
     setError("");

    try {
      const response = await fetch("/api/employees");
      if (!response.ok) throw new Error("Gagal mengambil data karyawan.");

      const data = await response.json();
      setEmployees(data);
    } catch {
      setError("Data karyawan gagal dimuat. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  
    useEffect(() => {
    const controller = new AbortController();

    async function fetchEmployees() {
        setError("");

        try {
        const response = await fetch("/api/employees", {
            signal: controller.signal,
        });

        if (!response.ok) {
            throw new Error("Gagal mengambil data karyawan.");
        }

        const data = await response.json();
        setEmployees(data);
        } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
            return;
        }

        setError("Data karyawan gagal dimuat. Silakan coba lagi.");
        } finally {
        if (!controller.signal.aborted) {
            setLoading(false);
        }
        }
    }

    fetchEmployees();

    return () => {
        controller.abort();
    };
    }, []);


  const filteredEmployees = employees.filter((employee) =>
    `${employee.employeeNumber} ${employee.fullName} ${employee.position ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#F5F7FB] p-4 text-slate-800 sm:p-8">     
    {showForm && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
            <div>
            <h2 className="text-lg font-bold text-slate-900">
                Tambah Karyawan
            </h2>
            <p className="mt-1 text-sm text-slate-500">
                Masukkan informasi karyawan outsourcing.
            </p>
            </div>

            <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-3 py-2 text-slate-500 hover:bg-slate-100"
            >
            Tutup
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5">
            {formError && (
            <div className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {formError}
            </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
            <div>
                <label className="mb-2 block text-sm font-medium">
                Nomor Karyawan *
                </label>
                <input
                required
                value={formData.employeeNumber}
                onChange={(e) =>
                    setFormData({ ...formData, employeeNumber: e.target.value })
                }
                placeholder="EMP-001"
                className="w-full border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                Nama Lengkap *
                </label>
                <input
                required
                value={formData.fullName}
                onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="Nama lengkap"
                className="w-full border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                Nomor Telepon
                </label>
                <input
                value={formData.phone}
                onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="08xxxxxxxxxx"
                className="w-full border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                Email
                </label>
                <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                }
                placeholder="nama@email.com"
                className="w-full border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                Posisi / Jabatan
                </label>
                <input
                value={formData.position}
                onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                }
                placeholder="Staff Administrasi"
                className="w-full border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                Tanggal Bergabung
                </label>
                <input
                type="date"
                value={formData.joinDate}
                onChange={(e) =>
                    setFormData({ ...formData, joinDate: e.target.value })
                }
                className="w-full border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
            </div>

            <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                Alamat
                </label>
                <textarea
                rows={3}
                value={formData.address}
                onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Alamat tempat tinggal"
                className="w-full border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
            </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border border-slate-300 px-4 py-2.5 text-sm font-medium hover:bg-slate-50"
            >
                Batal
            </button>

            <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {saving ? "Menyimpan..." : "Simpan Karyawan"}
            </button>
            </div>
        </form>
        </div>
    </div>
    )}

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
            <p className="text-sm text-slate-500">
              Workspace / Admin HR / Employee
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              Manajemen Karyawan
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Kelola data karyawan outsourcing perusahaan.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
                setFormError("");
                setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
            <Plus size={17} />
            Tambah Karyawan
            </button>
        </div>

        <section className="mb-5 grid gap-4 sm:grid-cols-3">
          <div className="border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-3 text-blue-600">
                <Users size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Karyawan</p>
                <p className="mt-1 text-2xl font-bold">{employees.length}</p>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Karyawan Aktif</p>
            <p className="mt-2 text-2xl font-bold">
              {employees.filter((employee) => employee.status === "ACTIVE").length}
            </p>
          </div>

          <div className="border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Karyawan Nonaktif</p>
            <p className="mt-2 text-2xl font-bold">
              {employees.filter((employee) => employee.status !== "ACTIVE").length}
            </p>
          </div>
        </section>

        <section className="border border-slate-200 bg-white">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold text-slate-900">Daftar Karyawan</h2>
              <p className="mt-1 text-xs text-slate-500">
                Data diambil langsung dari database PostgreSQL.
              </p>
            </div>

            <div className="flex gap-2">
              <div className="flex items-center gap-2 border border-slate-200 px-3 py-2">
                <Search size={16} className="text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari karyawan..."
                  className="w-full text-sm outline-none sm:w-48"
                />
              </div>

              <button
                type="button"
                onClick={loadEmployees}
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
              <button
                type="button"
                onClick={loadEmployees}
                className="ml-2 font-semibold underline"
              >
                Coba lagi
              </button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left">
              <thead className="bg-slate-50">
                <tr className="text-xs text-slate-500">
                  <th className="px-5 py-4 font-semibold">No. Karyawan</th>
                  <th className="px-5 py-4 font-semibold">Nama Lengkap</th>
                  <th className="px-5 py-4 font-semibold">Posisi</th>
                  <th className="px-5 py-4 font-semibold">Kontak</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-500">
                      Memuat data karyawan...
                    </td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <Users className="mx-auto mb-3 text-slate-300" size={30} />
                      <p className="text-sm font-semibold text-slate-700">
                        {search ? "Karyawan tidak ditemukan" : "Belum ada data karyawan"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {search
                          ? "Coba kata kunci pencarian lain."
                          : "Tambahkan data karyawan untuk mulai mengisi daftar."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => (
                    <tr
                        key={employee.id}
                        className="hover:bg-slate-50"
                    >
                        <td className="px-5 py-4 text-sm">
                        {employee.employeeNumber}
                        </td>

                        <td className="px-5 py-4 text-sm font-medium text-slate-900">
                        {employee.fullName}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                        {employee.position || "-"}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                        {employee.phone || employee.email || "-"}
                        </td>

                        <td className="px-5 py-4">
                        <span
                            className={`inline-block px-2.5 py-1 text-xs font-medium ${
                            employee.status === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-700"
                                : employee.status === "INACTIVE"
                                ? "bg-slate-100 text-slate-600"
                                : "bg-red-50 text-red-700"
                            }`}
                        >
                            {employee.status === "ACTIVE"
                            ? "Aktif"
                            : employee.status === "INACTIVE"
                                ? "Nonaktif"
                                : "Resign"}
                        </span>
                        </td>

                        <td className="px-5 py-4">
                            
                        <div className="flex gap-2">
                            <button
                            type="button"
                            onClick={() => {
                                setFormData({
                                employeeNumber: employee.employeeNumber,
                                fullName: employee.fullName,
                                phone: employee.phone ?? "",
                                email: employee.email ?? "",
                                position: employee.position ?? "",
                                address: employee.address ?? "",
                                joinDate: employee.joinDate
                                    ? employee.joinDate.slice(0, 10)
                                    : "",
                                });

                                setFormError("");
                                setEditingEmployee(employee);
                            }}
                            className="border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50"
                            >
                            Edit
                            </button>

                            <button
                            type="button"
                            onClick={() => handleDelete(employee)}
                            className="border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                            >
                            Hapus
                            </button>
                        </div>
                        </td>
                    </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
            Menampilkan {filteredEmployees.length} dari {employees.length} karyawan
          </div>
        </section>
      </div>
      
    {editingEmployee && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
            <div>
            <h2 className="text-lg font-bold text-slate-900">
                Edit Karyawan
            </h2>
            <p className="mt-1 text-sm text-slate-500">
                Perbarui informasi karyawan.
            </p>
            </div>

            <button
            type="button"
            onClick={() => setEditingEmployee(null)}
            className="border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
            >
            Tutup
            </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-5 p-5">
            {formError && (
            <div className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {formError}
            </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
            <div>
                <label className="mb-2 block text-sm font-medium">
                Nomor Karyawan *
                </label>
                <input
                required
                value={formData.employeeNumber}
                onChange={(e) =>
                    setFormData({ ...formData, employeeNumber: e.target.value })
                }
                className="w-full border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                Nama Lengkap *
                </label>
                <input
                required
                value={formData.fullName}
                onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                Nomor Telepon
                </label>
                <input
                value={formData.phone}
                onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                Email
                </label>
                <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                }
                className="w-full border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                Posisi / Jabatan
                </label>
                <input
                value={formData.position}
                onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                }
                className="w-full border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                Tanggal Bergabung
                </label>
                <input
                type="date"
                value={formData.joinDate}
                onChange={(e) =>
                    setFormData({ ...formData, joinDate: e.target.value })
                }
                className="w-full border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
            </div>

            <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                Alamat
                </label>
                <textarea
                rows={3}
                value={formData.address}
                onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                }
                className="w-full border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
            </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
                type="button"
                onClick={() => setEditingEmployee(null)}
                className="border border-slate-300 px-4 py-2.5 text-sm hover:bg-slate-50"
            >
                Batal
            </button>

            <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
            </div>
        </form>
        </div>
    </div>
    )}
    </main>
  );
}
