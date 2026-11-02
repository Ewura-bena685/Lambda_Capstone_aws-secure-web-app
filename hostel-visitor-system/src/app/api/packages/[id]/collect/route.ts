import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

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

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supabase = await createServiceClient();
  const { data: pkg, error: fetchErr } = await supabase
    .from("packages")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchErr || !pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }
  const row = pkg as PackageRow;
  if (row.collected_at) {
    return NextResponse.json({ error: "Already collected" }, { status: 400 });
  }
  const collectedAt = new Date().toISOString();
  const { data: updated, error } = await supabase
    .from("packages")
    .update({ collected_at: collectedAt })
    .eq("id", id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(toPackage(updated as PackageRow));
}
