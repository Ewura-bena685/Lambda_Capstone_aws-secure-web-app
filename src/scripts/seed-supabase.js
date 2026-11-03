/**
 * Seed demo users in Supabase. Run after schema.sql.
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage: node scripts/seed-supabase.js
 * (Set env vars in .env or pass inline.)
 */

const { createClient } = require("@supabase/supabase-js");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

const DEMO_PASSWORD = "password123";

const users = [
  { email: "admin@upsa.edu.gh", name: "System Admin", role: "ADMIN", phone: "+233240000000" },
  { email: "porter@upsa.edu.gh", name: "Porter Block A", role: "PORTER", phone: "+233241000001" },
  { email: "resident@upsa.edu.gh", name: "Kofi Mensah", role: "RESIDENT", phone: "+233242000002", room_no: "101", hostel: "Block A" },
  { email: "lecturer@upsa.edu.gh", name: "Dr. Ama Serwah", role: "LECTURER", phone: "+233243000003" },
  { email: "student@upsa.edu.gh", name: "Abena Osei", role: "STUDENT", phone: "+233244000004" },
];

async function main() {
  let lecturerId = null;

  for (const u of users) {
    const meta = { name: u.name, role: u.role, phone: u.phone || null, room_no: u.room_no || null, hostel: u.hostel || null };
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email: u.email,
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: meta,
    });
    if (authErr) {
      if (authErr.message && authErr.message.includes("already been registered")) {
        console.log("User already exists:", u.email);
        const { data: list } = await supabase.auth.admin.listUsers();
        const existing = list?.users?.find((x) => x.email === u.email);
        if (existing && u.role === "LECTURER") lecturerId = existing.id;
        continue;
      }
      console.error("Create user failed:", u.email, authErr.message);
      continue;
    }
    console.log("Created:", u.email);
    if (authData?.user?.id && u.role === "LECTURER") lecturerId = authData.user.id;
  }

  if (lecturerId) {
    const { error: lpErr } = await supabase.from("lecturer_profiles").upsert(
      { user_id: lecturerId, department: "Computer Science", office: "Room 205", slot_minutes: 30 },
      { onConflict: "user_id" }
    );
    if (lpErr) console.error("Lecturer profile:", lpErr.message);
    const { error: slotErr } = await supabase.from("availability_slots").upsert(
      [
        { lecturer_id: lecturerId, day_of_week: 1, start_time: "09:00", end_time: "12:00" },
        { lecturer_id: lecturerId, day_of_week: 3, start_time: "14:00", end_time: "17:00" },
      ],
      { onConflict: "lecturer_id,day_of_week,start_time" }
    );
    if (slotErr) console.error("Availability slots:", slotErr.message);
  }

  console.log("Seed done. Login with any email above and password:", DEMO_PASSWORD);
}

main().catch(console.error);
