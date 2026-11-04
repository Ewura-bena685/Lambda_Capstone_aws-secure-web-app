import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

type VisitRow = {
  id: string;
  visitor_name: string;
  visitor_phone: string;
  host_name: string;
  room_number: string;
  purpose: string | null;
  check_in_at: string;
  check_out_at: string | null;
  created_at: string;
};

function toVisit(row: VisitRow) {
  return {
    id: row.id,
    visitorName: row.visitor_name,
    visitorPhone: row.visitor_phone,
    hostName: row.host_name,
    roomNumber: row.room_number ?? "",
    purpose: row.purpose ?? "",
    checkInAt: row.check_in_at,
    checkOutAt: row.check_out_at,
    createdAt: row.created_at,
    isActive: !row.check_out_at,
  };
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServiceClient();
  const { data: visit, error: fetchErr } = await supabase
    .from("visits")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchErr || !visit) {
    return NextResponse.json({ error: "Visit not found" }, { status: 404 });
  }
  const row = visit as VisitRow;
  if (row.check_out_at) {
    return NextResponse.json({ error: "Already checked out" }, { status: 400 });
  }
  const { data: updated, error } = await supabase
    .from("visits")
    .update({ check_out_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(toVisit(updated as VisitRow));
}
