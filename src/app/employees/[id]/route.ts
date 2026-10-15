
import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const employeeNumber =
      typeof body.employeeNumber === "string"
        ? body.employeeNumber.trim()
        : "";

    const fullName =
      typeof body.fullName === "string"
        ? body.fullName.trim()
        : "";

    if (!employeeNumber || !fullName) {
      return NextResponse.json(
        { message: "Nomor karyawan dan nama lengkap wajib diisi." },
        { status: 400 }
      );
    }

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        employeeNumber,
        fullName,
        phone:
          typeof body.phone === "string" && body.phone.trim()
            ? body.phone.trim()
            : null,
        email:
          typeof body.email === "string" && body.email.trim()
            ? body.email.trim()
            : null,
        position:
          typeof body.position === "string" && body.position.trim()
            ? body.position.trim()
            : null,
        address:
          typeof body.address === "string" && body.address.trim()
            ? body.address.trim()
            : null,
        joinDate:
          typeof body.joinDate === "string" && body.joinDate
            ? new Date(body.joinDate)
            : null,
      },
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.error("PATCH employee error:", error);

    const knownError = error as { code?: string };

    if (knownError.code === "P2025") {
      return NextResponse.json(
        { message: "Data karyawan tidak ditemukan." },
        { status: 404 }
      );
    }

    if (knownError.code === "P2002") {
      return NextResponse.json(
        { message: "Nomor karyawan atau identitas sudah digunakan." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Gagal memperbarui data karyawan." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        _count: {
          select: { placements: true },
        },
      },
    });

    if (!employee) {
      return NextResponse.json(
        { message: "Data karyawan tidak ditemukan." },
        { status: 404 }
      );
    }

    if (employee._count.placements > 0) {
      return NextResponse.json(
        {
          message:
            "Karyawan memiliki riwayat penempatan dan tidak dapat dihapus.",
        },
        { status: 409 }
      );
    }

    await prisma.employee.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Data karyawan berhasil dihapus.",
    });
  } catch (error) {
    console.error("DELETE employee error:", error);

    return NextResponse.json(
      { message: "Gagal menghapus data karyawan." },
      { status: 500 }
    );
  }
}
