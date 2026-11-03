import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type PackageRow = {
  id: string;
  resident_name: string;
  resident_phone: string;
  room_number: string;
  sender_name: string;
  description: string | null;
  received_at: string;
  notified_at: string | null;
  collected_at: string | null;
  created_at: string;
};

function toPackage(row: PackageRow) {
  return {
    id: row.id,
    residentName: row.resident_name,
    residentPhone: row.resident_phone,
    roomNumber: row.room_number,
    senderName: row.sender_name,
    description: row.description ?? "",
    receivedAt: row.received_at,
    notifiedAt: row.notified_at,
    collectedAt: row.collected_at,
    createdAt: row.created_at,
    isNotified: !!row.notified_at,
    isCollected: !!row.collected_at,
  };
}

export async function GET(req: NextRequest) {
  const supabase = await createServiceClient();
  const { searchParams } = new URL(req.url);
  const collected = searchParams.get("collected"); // "true" | "false" | omit = all
  const phone = searchParams.get("phone"); // resident lookup by phone

  let query = supabase
    .from("packages")
    .select("*")
    .order("received_at", { ascending: false })
    .limit(200);

  if (collected === "false") query = query.is("collected_at", null);
  else if (collected === "true") query = query.not("collected_at", "is", null);

  if (phone?.trim()) {
    query = query.eq("resident_phone", phone.trim());
  }

  const { data: rows, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((rows ?? []).map((r) => toPackage(r as PackageRow)));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { residentName, residentPhone, roomNumber, senderName, description } = body;
    if (!residentName?.trim() || !residentPhone?.trim() || !roomNumber?.trim() || !senderName?.trim()) {
      return NextResponse.json(
        { error: "residentName, residentPhone, roomNumber, and senderName are required" },
        { status: 400 }
      );
    }
    const supabase = await createServiceClient();
    const { data: row, error } = await supabase
      .from("packages")
      .insert({
        resident_name: residentName.trim(),
        resident_phone: residentPhone.trim(),
        room_number: String(roomNumber).trim(),
        sender_name: senderName.trim(),
        description: description?.trim() || null,
      })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(toPackage(row as PackageRow));
  } catch (e) {
    return NextResponse.json({ error: "Failed to register package" }, { status: 500 });
  }
}
