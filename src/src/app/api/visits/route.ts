import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

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

export async function GET(req: NextRequest) {
  const supabase = await createServiceClient();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status"); // "active" | "all"

  let query = supabase
    .from("visits")
    .select("*")
    .order("check_in_at", { ascending: false })
    .limit(200);

  if (status === "active") {
    query = query.is("check_out_at", null);
  }

  const { data: rows, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((rows ?? []).map((r) => toVisit(r as VisitRow)));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { visitorName, visitorPhone, hostName, roomNumber, purpose, timeOfVisit } = body;
    if (!visitorName?.trim() || !visitorPhone?.trim() || !hostName?.trim() || !roomNumber?.trim()) {
      return NextResponse.json(
        { error: "visitorName, visitorPhone, hostName, and roomNumber are required" },
        { status: 400 }
      );
    }
    const supabase = await createServiceClient();
    const checkInAt = timeOfVisit ? new Date(timeOfVisit).toISOString() : new Date().toISOString();
    const { data: row, error } = await supabase
      .from("visits")
      .insert({
        visitor_name: visitorName.trim(),
        visitor_phone: visitorPhone.trim(),
        host_name: hostName.trim(),
        room_number: String(roomNumber).trim(),
        purpose: purpose?.trim() || null,
        check_in_at: checkInAt,
      })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(toVisit(row as VisitRow));
  } catch (e) {
    return NextResponse.json({ error: "Failed to check in" }, { status: 500 });
  }
}
