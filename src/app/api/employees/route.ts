
import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";


export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        placements: {
          include: {
            partner: true,
          },
        },
      },
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error("GET employees error:", error);

    return NextResponse.json(
      { message: "Gagal mengambil data karyawan." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
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

    const employee = await prisma.employee.create({
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

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error("POST employees error:", error);

    return NextResponse.json(
      { message: "Gagal menyimpan karyawan. Periksa data yang dikirim." },
      { status: 500 }
    );
  }
}
