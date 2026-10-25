import { requireStaff } from "@/lib/auth";
import { db } from "@/lib/db";
import Dashboard from "./workspace";
export const dynamic = "force-dynamic";
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; error?: string; success?: string }>;
}) {
  const staff = await requireStaff(),
    d = db();
  const members = d
    .prepare(
      `SELECT m.*,ms.id AS membership_id,ms.plan,ms.start,ms.end,ms.fee,COALESCE((SELECT SUM(amount) FROM payments p WHERE p.membership_id=ms.id AND p.gym_id=m.gym_id),0) AS paid FROM members m JOIN memberships ms ON ms.member_id=m.id AND ms.gym_id=m.gym_id WHERE m.gym_id=? ORDER BY m.created DESC`,
    )
    .all(staff.gym_id);
  const payments = d
    .prepare(
      `SELECT p.*,m.name,ms.plan FROM payments p JOIN memberships ms ON ms.id=p.membership_id AND ms.gym_id=p.gym_id JOIN members m ON m.id=ms.member_id AND m.gym_id=p.gym_id WHERE p.gym_id=? ORDER BY p.created DESC`,
    )
    .all(staff.gym_id);
  const attendance = d
    .prepare(
      `SELECT a.*,m.name,m.phone FROM attendance a JOIN members m ON m.id=a.member_id AND m.gym_id=a.gym_id WHERE a.gym_id=? ORDER BY a.created DESC`,
    )
    .all(staff.gym_id);
  return (
    <Dashboard
      staff={{ name: staff.name, gym_name: staff.gym_name }}
      members={JSON.parse(JSON.stringify(members))}
      payments={JSON.parse(JSON.stringify(payments))}
      attendance={JSON.parse(JSON.stringify(attendance))}
      params={await searchParams}
    />
  );
}
