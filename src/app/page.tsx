
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  Wallet,
  FileText,
  Search,
  Bell,
  ChevronDown,
  ArrowUpRight,
  Clock,
  Menu,
  X,
  BriefcaseBusiness,
  CircleAlert,
} from "lucide-react";

const menus = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Employee", icon: Users },
  { name: "Partner", icon: Building2 },
  { name: "Attendance", icon: CalendarCheck },
  { name: "Payroll", icon: Wallet },
  { name: "Pembuatan Surat", icon: FileText },
];

const stats = [
  { label: "Total Employee", value: "248", note: "+12 bulan ini", icon: Users, color: "blue" },
  { label: "Total Partner", value: "18", note: "+2 bulan ini", icon: Building2, color: "violet" },
  { label: "Hadir Hari Ini", value: "226", note: "91,1% karyawan aktif", icon: CalendarCheck, color: "green" },
  { label: "Total Payroll", value: "Rp 684 jt", note: "Periode berjalan", icon: Wallet, color: "orange" },
];

const recentActivities = [
  { name: "Andi Pratama", action: "Kontrak kerja baru", type: "Employee", date: "14 Okt 2026", status: "Perlu diperiksa", color: "amber" },
  { name: "PT Maju Sejahtera", action: "Pembaruan data partner", type: "Partner", date: "14 Okt 2026", status: "Selesai", color: "green" },
  { name: "Siti Rahmawati", action: "Data absensi diperbarui", type: "Attendance", date: "13 Okt 2026", status: "Selesai", color: "green" },
  { name: "PT Sumber Makmur", action: "Tagihan termin", type: "Dokumen", date: "13 Okt 2026", status: "Menunggu", color: "blue" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-slate-800">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[255px] flex-col bg-[#10264A] text-white transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="flex h-[82px] items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-none bg-blue-500">
            <BriefcaseBusiness size={23} />
          </div>
          <div>
            <h1 className="text-sm font-bold">MCB Outsourcing</h1>
            <p className="mt-1 text-[11px] text-blue-200">HR Management System</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden" aria-label="Tutup sidebar">
            <X size={20} />
          </button>
        </div>

        <div className="px-4 pt-7">
          <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.18em] text-blue-300/70">MENU UTAMA</p>
          <nav className="space-y-1.5">
            {menus.map((menu) => {
              const Icon = menu.icon;
              const selected = activeMenu === menu.name;
              return (
                <button
                  key={menu.name}
                  onClick={() => {
                    setSidebarOpen(false);

                    if (menu.name === "Employee") {
                      router.push("/employees");
                      return;
                    }

                    setActiveMenu(menu.name);
                  }}
                  className={`flex w-full items-center gap-3 rounded-none px-3.5 py-3 text-left text-[13px] transition ${selected ? "bg-blue-600 font-semibold text-white shadow-lg" : "text-blue-100/75 hover:bg-white/10 hover:text-white"}`}
                >
                  <Icon size={19} strokeWidth={1.8} />
                  {menu.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <div className="rounded-none border border-white/10 bg-white/[0.06] p-4">
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="h-2 w-2 rounded-none bg-emerald-400" />
              HR Workspace
            </div>
            <p className="mt-2 text-[11px] text-blue-200/70">CV Menara Cakra Buana</p>
          </div>
          <p className="mt-4 text-center text-[10px] text-blue-200/50">© 2026 MCB Outsourcing</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-h-screen lg:pl-[255px]">
        <header className="sticky top-0 z-30 flex h-[82px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="rounded-none p-2 hover:bg-slate-100 lg:hidden" aria-label="Buka sidebar">
              <Menu size={21} />
            </button>
            <div>
              <p className="text-xs text-slate-400">Workspace / Admin HR</p>
              <h2 className="mt-1 text-lg font-bold">{activeMenu}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden h-10 w-56 items-center gap-2 rounded-none border border-slate-200 bg-slate-50 px-3 md:flex">
              <Search size={17} className="text-slate-400" />
              <input placeholder="Cari sesuatu..." className="w-full bg-transparent text-xs outline-none" />
            </div>
            <button className="relative rounded-none border border-slate-200 p-2.5 text-slate-500" aria-label="Notifikasi">
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-none bg-rose-500" />
            </button>
            <button className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-none bg-blue-100 text-sm font-bold text-blue-700">HR</div>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-semibold">Administrator</p>
                <p className="mt-1 text-[10px] text-slate-400">Admin HR</p>
              </div>
              <ChevronDown size={15} className="hidden text-slate-400 sm:block" />
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] p-4 sm:p-8">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-slate-500">Rabu, 14 Oktober 2026</p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">Selamat datang, Admin!</h1>
              <p className="mt-2 text-sm text-slate-500">Berikut ringkasan operasional HR hari ini.</p>
            </div>
            <button
  onClick={() => router.push("/employees")}
  className="flex items-center justify-center gap-2 self-start rounded-none bg-blue-600 px-4 py-3 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
>
              <Users size={16} /> Tambah Employee
            </button>
          </div>

          {/* Statistics */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const colors: Record<string, string> = {
                blue: "bg-blue-50 text-blue-600",
                violet: "bg-violet-50 text-violet-600",
                green: "bg-emerald-50 text-emerald-600",
                orange: "bg-orange-50 text-orange-600",
              };
              return (
                <div key={stat.label} className="rounded-none border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-slate-500">{stat.label}</span>
                    <div className={`rounded-none p-2.5 ${colors[stat.color]}`}><Icon size={19} /></div>
                  </div>
                  <p className="mt-5 text-3xl font-bold tracking-tight text-slate-900">{stat.value}</p>
                  <div className="mt-3 flex items-center gap-1.5">
                    <ArrowUpRight size={14} className="text-emerald-600" />
                    <span className="text-[11px] text-slate-500">{stat.note}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Attendance chart */}
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <section className="rounded-none border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold">Ringkasan Kehadiran</h3>
                  <p className="mt-1 text-xs text-slate-400">Tren kehadiran karyawan selama 6 bulan</p>
                </div>
                <span className="rounded-none border border-slate-200 px-3 py-2 text-[11px] text-slate-600">6 Bulan Terakhir</span>
              </div>
              <div className="mt-8 flex h-[220px] items-end justify-around gap-4 border-b border-slate-100 pb-0">
                {[
                  ["Mei", 58], ["Jun", 72], ["Jul", 65],
                  ["Agu", 82], ["Sep", 74], ["Okt", 91],
                ].map(([month, value]) => (
                  <div key={month} className="flex h-full flex-1 flex-col items-center justify-end">
                    <span className="mb-2 text-[10px] font-semibold text-blue-600">{value}%</span>
                    <div style={{ height: `${value}%` }} className="w-full max-w-12 rounded-t-lg bg-gradient-to-t from-blue-600 to-sky-400" />
                    <span className="mt-3 text-[10px] text-slate-400">{month}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-none border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="text-sm font-bold">Status Karyawan</h3>
              <p className="mt-1 text-xs text-slate-400">Ringkasan status tenaga kerja</p>
              <div className="mx-auto my-6 flex h-40 w-40 items-center justify-center rounded-full" style={{ background: "conic-gradient(#2563eb 0% 78%, #10b981 78% 91%, #f59e0b 91% 97%, #e2e8f0 97% 100%)" }}>
                <div className="flex h-[116px] w-[116px] flex-col items-center justify-center rounded-full bg-white">
                  <span className="text-3xl font-bold">248</span>
                  <span className="mt-1 text-[10px] text-slate-400">Total Employee</span>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  ["Aktif", "194", "bg-blue-500"],
                  ["Dalam penempatan", "32", "bg-emerald-500"],
                  ["Cuti / Izin", "15", "bg-amber-400"],
                  ["Nonaktif", "7", "bg-slate-300"],
                ].map(([label, value, color]) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className={`h-2.5 w-2.5 rounded-none ${color}`} />
                      <span className="text-xs text-slate-500">{label}</span>
                    </div>
                    <span className="text-xs font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Activities */}
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <section className="overflow-hidden rounded-none border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
                <div>
                  <h3 className="text-sm font-bold">Aktivitas Terbaru</h3>
                  <p className="mt-1 text-xs text-slate-400">Aktivitas administrasi terkini</p>
                </div>
                <button className="text-xs font-semibold text-blue-600">Lihat semua</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[580px] text-left">
                  <thead className="bg-slate-50">
                    <tr className="text-[10px] uppercase tracking-wider text-slate-400">
                      <th className="px-6 py-3">Nama / Partner</th>
                      <th className="px-4 py-3">Aktivitas</th>
                      <th className="px-4 py-3">Tanggal</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentActivities.map((item) => (
                      <tr key={item.name} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <p className="text-xs font-semibold">{item.name}</p>
                          <p className="mt-1 text-[10px] text-slate-400">{item.type}</p>
                        </td>
                        <td className="px-4 py-4 text-xs text-slate-500">{item.action}</td>
                        <td className="px-4 py-4 text-[11px] text-slate-500">{item.date}</td>
                        <td className="px-4 py-4">
                          <span className={`whitespace-nowrap rounded-none px-2.5 py-1 text-[10px] font-medium ${item.color === "green" ? "bg-emerald-50 text-emerald-700" : item.color === "amber" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-none border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold">Perlu Perhatian</h3>
                  <p className="mt-1 text-xs text-slate-400">Pengingat administrasi</p>
                </div>
                <CircleAlert size={19} className="text-amber-500" />
              </div>
              <div className="mt-5 space-y-3">
                <div className="flex gap-3 rounded-none border border-amber-100 bg-amber-50/70 p-3.5">
                  <Clock size={18} className="mt-1 shrink-0 text-amber-700" />
                  <div>
                    <p className="text-xs font-semibold">Kontrak segera berakhir</p>
                    <p className="mt-1 text-[11px] text-slate-500">5 kontrak perlu ditinjau</p>
                    <button onClick={() => setActiveMenu("Pembuatan Surat")} className="mt-2 text-[11px] font-semibold text-amber-700">Periksa kontrak →</button>
                  </div>
                </div>
                <div className="flex gap-3 rounded-none border border-blue-100 bg-blue-50/70 p-3.5">
                  <FileText size={18} className="mt-1 shrink-0 text-blue-700" />
                  <div>
                    <p className="text-xs font-semibold">Tagihan termin</p>
                    <p className="mt-1 text-[11px] text-slate-500">3 tagihan menunggu tindak lanjut</p>
                    <button onClick={() => setActiveMenu("Pembuatan Surat")} className="mt-2 text-[11px] font-semibold text-blue-700">Periksa tagihan →</button>
                  </div>
                </div>
                <div className="flex gap-3 rounded-none border border-emerald-100 bg-emerald-50/70 p-3.5">
                  <Wallet size={18} className="mt-1 shrink-0 text-emerald-700" />
                  <div>
                    <p className="text-xs font-semibold">Payroll bulanan</p>
                    <p className="mt-1 text-[11px] text-slate-500">Periksa status periode berjalan</p>
                    <button onClick={() => setActiveMenu("Payroll")} className="mt-2 text-[11px] font-semibold text-emerald-700">Buka payroll →</button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <footer className="pb-4 pt-8 text-center text-[11px] text-slate-400">
            HR Outsourcing Management System · CV Menara Cakra Buana
          </footer>
        </main>
      </div>

      {sidebarOpen && (
        <button className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" aria-label="Tutup menu" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
