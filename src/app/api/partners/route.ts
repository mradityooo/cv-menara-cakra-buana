
import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

export async function GET() {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(partners);
  } catch (error) {
    console.error("Gagal mengambil data partner:", error);

    return NextResponse.json(
      { message: "Gagal mengambil data partner." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const companyName = String(body.companyName ?? "").trim();

    if (!companyName) {
      return NextResponse.json(
        { message: "Nama perusahaan wajib diisi." },
        { status: 400 }
      );
    }

    const partner = await prisma.partner.create({
      data: {
        companyName,
        contactPerson: body.contactPerson?.trim() || null,
        phone: body.phone?.trim() || null,
        email: body.email?.trim() || null,
        address: body.address?.trim() || null,
      },
    });

    return NextResponse.json(partner, { status: 201 });
  } catch (error) {
    console.error("Gagal menyimpan data partner:", error);

    return NextResponse.json(
      { message: "Gagal menyimpan data partner." },
      { status: 500 }
    );
  }
}
