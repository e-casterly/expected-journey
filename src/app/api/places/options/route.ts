import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { place } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const places = await db.query.place.findMany({
    where: eq(place.userId, session.user.id),
    columns: { id: true, name: true, address: true },
    orderBy: [asc(place.name), asc(place.createdAt)],
  });

  const options = places.map((item) => ({
    id: item.id,
    label: item.address ? `${item.name} - ${item.address}` : item.name,
  }));

  return NextResponse.json({ options });
}