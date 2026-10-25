"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import {
  Activity,
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Dumbbell,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  Settings2,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { addMember, checkIn, logout, recordPayment } from "./actions";
import { money, PLANS, today } from "@/lib/domain";
type Member = {
  id: string;
  name: string;
  phone: string;
  email: string;
  goal: string;
  membership_id: string;
  plan: string;
  start: string;
  end: string;
  fee: number;
  paid: number;
};
type Payment = {
  id: string;
  name: string;
  amount: number;
  method: string;
  created: string;
  reference: string;
  plan: string;
};
type Attendance = {
  id: string;
  member_id: string;
  name: string;
  phone: string;
  day: string;
  created: string;
};
type Props = {
  staff: { name: string; gym_name: string };
  members: Member[];
  payments: Payment[];
  attendance: Attendance[];
  params: { view?: string; error?: string; success?: string };
};
const nav = [
  ["overview", "Overview", LayoutDashboard],
  ["members", "Members", Users],
  ["payments", "Payments", Wallet],
  ["attendance", "Attendance", Activity],
  ["reports", "Reports", TrendingUp],
] as const;
const initial = (name: string) =>
  name
    .split(" ")
    .map((x) => x[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
const shortDate = (s: string) =>
  new Date(s.slice(0, 10) + "T12:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
const clock = (s: string) =>
  new Date(s).toLocaleTimeString("en-NP", {
    timeZone: "Asia/Kathmandu",
    hour: "2-digit",
    minute: "2-digit",
  });
function Submit({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button className="primary" disabled={pending}>
      {pending ? "Saving…" : children}
      <ArrowRight size={16} />
    </button>
  );
}
export default function Workspace({
  staff,
  members,
  payments,
  attendance,
  params,
}: Props) {
  const view = nav.some((n) => n[0] === params.view)
    ? params.view!
    : "overview";
  const [query, setQuery] = useState(""),
    [modal, setModal] = useState<"member" | "payment" | "checkin" | null>(null),
    [detail, setDetail] = useState<Member | null>(null),
    [receipt, setReceipt] = useState<Payment | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const day = today(),
    month = day.slice(0, 7);
  useEffect(() => {
    dialog.current?.close();
  }, [params]);
  const active = members.filter((m) => m.start <= day && m.end > day),
    dues = members.filter((m) => m.paid < m.fee),
    balance = dues.reduce((s, m) => s + m.fee - m.paid, 0);
  const checked = attendance.filter((a) => a.day === day),
    collected = payments
      .filter((p) =>
        new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Kathmandu",
          year: "numeric",
          month: "2-digit",
        })
          .format(new Date(p.created))
          .startsWith(month),
      )
      .reduce((s, p) => s + p.amount, 0);
  const soon = members.filter(
    (m) =>
      m.end > day &&
      m.end <=
        new Date(Date.parse(day) + 7 * 86400000).toISOString().slice(0, 10),
  );
  const filtered = members.filter((m) =>
    `${m.name} ${m.phone} ${m.email}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const open = (kind: typeof modal) => {
    setModal(kind);
    setDetail(null);
    setReceipt(null);
    dialog.current?.showModal();
  };
  const openMember = (m: Member) => {
    setDetail(m);
    setModal(null);
    setReceipt(null);
    dialog.current?.showModal();
  };
  const status = (m: Member) =>
    m.start > day ? "Upcoming" : m.end <= day ? "Expired" : "Active";
  const close = () => dialog.current?.close();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" href="/manage">
          <span className="brand-symbol">
            <Dumbbell size={22} />
          </span>
          gym<span className="brand-engine">engine</span>
          <i />
        </Link>
        <div className="gym-switch">
          <span className="gym-avatar">{initial(staff.gym_name)}</span>
          <div>
            <strong>{staff.gym_name}</strong>
            <small>Independent gym · Nepal</small>
          </div>
          <ChevronDown size={14} />
        </div>
        <p className="nav-caption">WORKSPACE</p>
        <nav>
          {nav.map(([key, label, Icon]) => (
            <Link
              key={key}
              href={"/manage?view=" + key}
              className={"nav-item " + (view === key ? "selected" : "")}
            >
              <Icon size={19} />
              {label}
              {key === "members" && <span>{members.length}</span>}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="future-card">
            <div className="future-icon">
              <Sparkles size={18} />
              <span>THE NEXT REP</span>
            </div>
            <strong>
              Better insights.
              <br />
              Stronger members.
            </strong>
            <p>Training and nutrition tools are on our roadmap.</p>
            <span className="subtle-label">Built one milestone at a time</span>
          </div>
          <div className="staff-card">
            <span className="avatar">{initial(staff.name)}</span>
            <div>
              <strong>{staff.name}</strong>
              <small>Gym owner</small>
            </div>
            <form action={logout}>
              <button
                className="icon-button"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut size={17} />
              </button>
            </form>
          </div>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <ChevronRight size={14} />
            <strong>{nav.find((n) => n[0] === view)?.[1]}</strong>
          </div>
          <div className="topbar-right">
            <span className="local-indicator">
              <i />
              Nepal time
            </span>
            <span className="top-date">
              <CalendarDays size={15} />
              {new Date(day + "T12:00:00Z").toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="avatar small">{initial(staff.name)}</span>
            <form action={logout}>
              <button
                className="icon-button"
                title="Sign out"
                aria-label="Sign out of workspace"
              >
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </header>
        <main className="main">
          <div className="page-heading">
            <div>
              <p className="eyebrow">LET’S KEEP THINGS MOVING</p>
              <h1>
                {view === "overview"
                  ? "Your gym, at a glance."
                  : nav.find((n) => n[0] === view)?.[1]}
              </h1>
              <p className="muted">
                {view === "overview"
                  ? `Welcome back, ${staff.name.split(" ")[0]}. Here’s where your gym stands today.`
                  : view === "members"
                    ? "A stronger community starts with knowing your people."
                    : view === "payments"
                      ? "Every payment recorded. Every balance accounted for."
                      : view === "attendance"
                        ? "Keep a pulse on who’s showing up."
                        : "Clear numbers. Better decisions."}
              </p>
            </div>
            <div className="heading-actions">
              <button className="secondary" onClick={() => open("checkin")}>
                <Activity size={16} />
                Check in
              </button>
              <button
                className="primary"
                onClick={() => open(view === "payments" ? "payment" : "member")}
              >
                <Plus size={17} />
                {view === "payments" ? "Record payment" : "Add member"}
              </button>
            </div>
          </div>
          {(params.error || params.success) && (
            <div
              className={"notice " + (params.error ? "error" : "success")}
              role="status"
            >
              {params.error || params.success}
              <Link href={"/manage?view=" + view} aria-label="Dismiss message">
                <X size={16} />
              </Link>
            </div>
          )}
          {(view === "overview" || view === "reports") && (
            <>
              <div className="metric-grid">
                <Metric
                  label="Active members"
                  value={String(active.length)}
                  icon={<Users size={19} />}
                  hint={`${members.length} total registered`}
                  color="purple"
                />
                <Metric
                  label="Collected this month"
                  value={money(collected)}
                  icon={<Wallet size={19} />}
                  hint="Actual payments · Nepal calendar month"
                  color="green"
                />
                <Metric
                  label="Today’s check-ins"
                  value={String(checked.length)}
                  icon={<Activity size={19} />}
                  hint="One entry per member per day"
                  color="orange"
                />
                <Metric
                  label="Outstanding balance"
                  value={money(balance)}
                  icon={<CreditCard size={19} />}
                  hint={`${dues.length} membership${dues.length === 1 ? "" : "s"} with a balance`}
                  color="pink"
                />
              </div>
            </>
          )}
          {view === "overview" && (
            <>
              <div className="overview-grid">
                <section className="panel">
                  <div className="panel-head">
                    <div>
                      <h2>Attendance rhythm</h2>
                      <p>Your floor activity over the last 7 days</p>
                    </div>
                    <span className="pill neutral">
                      Last 7 days
                      <ChevronDown size={12} />
                    </span>
                  </div>
                  <div className="chart-summary">
                    <strong>
                      {
                        attendance.filter(
                          (a) =>
                            a.day >=
                            new Date(Date.parse(day) - 6 * 86400000)
                              .toISOString()
                              .slice(0, 10),
                        ).length
                      }
                    </strong>
                    <span>check-ins this week</span>
                    <span className="chart-legend">
                      <i />
                      Member visits
                    </span>
                  </div>
                  <div className="bar-chart">
                    {Array.from({ length: 7 }, (_, i) => {
                      const date = new Date(
                          Date.parse(day) - (6 - i) * 86400000,
                        )
                          .toISOString()
                          .slice(0, 10),
                        count = attendance.filter((a) => a.day === date).length,
                        max = Math.max(
                          4,
                          ...Array.from(
                            { length: 7 },
                            (_, j) =>
                              attendance.filter(
                                (a) =>
                                  a.day ===
                                  new Date(Date.parse(day) - j * 86400000)
                                    .toISOString()
                                    .slice(0, 10),
                              ).length,
                          ),
                        );
                      return (
                        <div
                          className={"bar-column " + (i === 6 ? "current" : "")}
                          key={date}
                        >
                          <span>{count}</span>
                          <div className="bar-track">
                            <div
                              style={{
                                height: `${Math.max(2, (count / max) * 100)}%`,
                              }}
                            />
                          </div>
                          <small>
                            {new Date(date + "T12:00:00Z").toLocaleDateString(
                              "en-GB",
                              { weekday: "short" },
                            )}
                          </small>
                        </div>
                      );
                    })}
                  </div>
                  <div className="chart-footer">
                    <span>
                      <i className="dot" />
                      Consistency builds community.
                    </span>
                    <Link href="/manage?view=attendance">
                      View attendance
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </section>
                <section className="panel attention">
                  <div className="panel-head">
                    <div>
                      <h2>Needs a little attention</h2>
                      <p>Small actions that keep your gym moving</p>
                    </div>
                    <span className="attention-count">
                      {soon.length + dues.length}
                    </span>
                  </div>
                  <Link className="attention-row" href="/manage?view=members">
                    <span className="metric-icon orange">
                      <CalendarDays size={19} />
                    </span>
                    <div>
                      <strong>
                        {soon.length} renewal{soon.length === 1 ? "" : "s"}{" "}
                        coming up
                      </strong>
                      <p>Memberships ending in the next 7 days</p>
                    </div>
                    <ChevronRight size={17} />
                  </Link>
                  <Link className="attention-row" href="/manage?view=payments">
                    <span className="metric-icon pink">
                      <Wallet size={19} />
                    </span>
                    <div>
                      <strong>
                        {dues.length} outstanding balance
                        {dues.length === 1 ? "" : "s"}
                      </strong>
                      <p>{money(balance)} still to collect</p>
                    </div>
                    <ChevronRight size={17} />
                  </Link>
                  <div className="attention-tip">
                    <Sparkles size={17} />
                    <p>
                      {members.length
                        ? "A quick conversation goes a long way. Review dues and renewals with your members."
                        : "Your next chapter starts here. Add your first member to bring this workspace to life."}
                    </p>
                  </div>
                </section>
              </div>
              <section className="panel">
                <div className="panel-head">
                  <div>
                    <h2>Your people</h2>
                    <p>A quick look at your newest members</p>
                  </div>
                  <Link className="text-link" href="/manage?view=members">
                    View all members
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
                {membersTable(filtered.slice(0, 5))}
              </section>
            </>
          )}
          {view === "members" && (
            <section className="panel">
              <div className="panel-head">
                <div>
                  <h2>
                    Member directory{" "}
                    <span className="count-label">{members.length}</span>
                  </h2>
                  <p>Memberships, contact details, and balances in one place</p>
                </div>
                <label className="search">
                  <Search size={17} />
                  <input
                    aria-label="Search members"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search name or phone…"
                  />
                </label>
              </div>
              {membersTable(filtered)}
            </section>
          )}
          {view === "payments" && (
            <>
              <div className="payment-banner">
                <div>
                  <p className="eyebrow">STILL TO COLLECT</p>
                  <h2>{money(balance)}</h2>
                  <p>
                    Across {dues.length} memberships · partial payments
                    supported
                  </p>
                </div>
                <button className="secondary" onClick={() => open("payment")}>
                  <Plus size={17} />
                  Record a payment
                </button>
              </div>
              <section className="panel">
                <div className="panel-head">
                  <div>
                    <h2>Payment ledger</h2>
                    <p>
                      Recorded collections, including manually confirmed digital
                      payments
                    </p>
                  </div>
                  <span className="pill neutral">NPR</span>
                </div>
                {payments.length ? (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Member</th>
                          <th>Amount</th>
                          <th>Method</th>
                          <th>Date</th>
                          <th>Receipt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((p) => (
                          <tr key={p.id}>
                            <td>
                              <strong>{p.name}</strong>
                            </td>
                            <td className="amount">{money(p.amount)}</td>
                            <td>{p.method}</td>
                            <td>
                              {shortDate(p.created)} · {clock(p.created)}
                            </td>
                            <td>
                              <button
                                className="text-link"
                                onClick={() => {
                                  setReceipt(p);
                                  setDetail(null);
                                  setModal(null);
                                  dialog.current?.showModal();
                                }}
                              >
                                View receipt
                                <ArrowUpRight size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <Empty
                    icon={<Wallet />}
                    title="A clear ledger starts with the first payment."
                    text="Add a member, then record their full or partial membership payment."
                    action={() => open("payment")}
                    label="Record payment"
                  />
                )}
              </section>
              <section className="panel section-gap">
                <div className="panel-head">
                  <div>
                    <h2>Outstanding memberships</h2>
                    <p>Invoice total less recorded payments</p>
                  </div>
                </div>
                {membersTable(dues)}
              </section>
            </>
          )}
          {view === "attendance" && (
            <section className="panel">
              <div className="panel-head">
                <div>
                  <h2>
                    On the floor{" "}
                    <span className="count-label">{checked.length} today</span>
                  </h2>
                  <p>Check-ins are recorded in Nepal time</p>
                </div>
                <button className="secondary" onClick={() => open("checkin")}>
                  <Plus size={16} />
                  Check in member
                </button>
              </div>
              {attendance.length ? (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Member</th>
                        <th>Phone</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.map((a) => (
                        <tr key={a.id}>
                          <td>
                            <div className="person">
                              <span className="avatar">{initial(a.name)}</span>
                              <strong>{a.name}</strong>
                            </div>
                          </td>
                          <td>{a.phone}</td>
                          <td>{shortDate(a.day)}</td>
                          <td>{clock(a.created)}</td>
                          <td>
                            <span className="status active">
                              <Check size={12} />
                              Checked in
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Empty
                  icon={<Activity />}
                  title="Ready for the first rep."
                  text="Check in a member with an active membership. Each member can check in once a day."
                  action={() => open("checkin")}
                  label="Check in a member"
                />
              )}
            </section>
          )}
          {view === "reports" && (
            <section className="panel">
              <div className="panel-head">
                <div>
                  <h2>Membership breakdown</h2>
                  <p>Current records · no estimates or predictions</p>
                </div>
              </div>
              <div className="report-grid">
                {PLANS.map((p) => {
                  const list = members.filter((m) => m.plan === p.id);
                  return (
                    <div className="report-card" key={p.id}>
                      <span className="metric-icon purple">
                        <Dumbbell size={20} />
                      </span>
                      <h3>{p.name}</h3>
                      <strong>{list.length}</strong>
                      <p>memberships · {money(p.price)} each</p>
                      <hr />
                      <p>
                        Billed{" "}
                        <b>{money(list.reduce((s, m) => s + m.fee, 0))}</b>
                      </p>
                      <p>
                        Collected{" "}
                        <b>{money(list.reduce((s, m) => s + m.paid, 0))}</b>
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="report-note">
                <CircleHelp size={17} />
                <p>
                  Collected this month uses payment timestamps in
                  Asia/Kathmandu. Active memberships include the start date and
                  exclude the end date. Outstanding balances include all unpaid
                  membership invoices.
                </p>
              </div>
            </section>
          )}
          <footer className="workspace-footer">
            <span>
              GYM ENGINE <i />
              Built for a stronger everyday.
            </span>
            <span>Local development · data saved on this computer</span>
          </footer>
        </main>
      </div>
      <dialog
        ref={dialog}
        aria-label={
          detail
            ? "Member profile"
            : receipt
              ? "Payment receipt"
              : modal === "member"
                ? "Add member"
                : modal === "payment"
                  ? "Record payment"
                  : "Member check-in"
        }
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
      >
        <div className="dialog-body">
          <button
            className="dialog-close icon-button"
            onClick={close}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
          {modal === "member" && (
            <>
              <span className="metric-icon purple">
                <Users size={23} />
              </span>
              <h2>Make room for someone strong.</h2>
              <p className="muted">
                Add a member and create their membership invoice.
              </p>
              <form action={addMember}>
                <label>
                  Full name
                  <input
                    name="name"
                    required
                    minLength={2}
                    maxLength={100}
                    placeholder="Member’s full name"
                  />
                </label>
                <div className="form-row">
                  <label>
                    Mobile number
                    <input
                      name="phone"
                      type="tel"
                      required
                      placeholder="98XXXXXXXX"
                    />
                  </label>
                  <label>
                    Email <small>(optional)</small>
                    <input name="email" type="email" />
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    Membership plan
                    <select name="plan">
                      {PLANS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} · {money(p.price)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Start date
                    <input
                      name="start"
                      type="date"
                      required
                      defaultValue={day}
                    />
                  </label>
                </div>
                <label>
                  Fitness goal
                  <select name="goal">
                    <option>General fitness</option>
                    <option>Build strength</option>
                    <option>Build muscle</option>
                    <option>Improve endurance</option>
                    <option>Weight management</option>
                  </select>
                </label>
                <p className="form-note">
                  Payment is recorded separately. Plan prices are the initial
                  development defaults.
                </p>
                <Submit>Add member</Submit>
              </form>
            </>
          )}
          {modal === "payment" && (
            <>
              <span className="metric-icon green">
                <Wallet size={23} />
              </span>
              <h2>Every payment counts.</h2>
              <p className="muted">
                Record a confirmed payment against a membership invoice.
              </p>
              {dues.length ? (
                <form action={recordPayment}>
                  <label>
                    Member & outstanding balance
                    <select name="membership" required>
                      {dues.map((m) => (
                        <option key={m.membership_id} value={m.membership_id}>
                          {m.name} · {money(m.fee - m.paid)} due
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="form-row">
                    <label>
                      Amount (NPR)
                      <input
                        name="amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        required
                      />
                    </label>
                    <label>
                      Payment method
                      <select name="method">
                        <option>Cash</option>
                        <option>eSewa (manual)</option>
                        <option>Khalti (manual)</option>
                        <option>Bank transfer</option>
                      </select>
                    </label>
                  </div>
                  <label>
                    Reference or note <small>(optional)</small>
                    <input
                      name="reference"
                      maxLength={100}
                      placeholder="Transaction ID or receipt note"
                    />
                  </label>
                  <p className="form-note">
                    Digital payments are entered manually. Confirm the funds
                    before saving.
                  </p>
                  <Submit>Save payment</Submit>
                </form>
              ) : (
                <p className="notice success">
                  No outstanding invoices. Add a member to create an invoice.
                </p>
              )}
            </>
          )}
          {modal === "checkin" && (
            <>
              <span className="metric-icon orange">
                <Activity size={23} />
              </span>
              <h2>Another day. Another rep.</h2>
              <p className="muted">
                Check in an active member for {shortDate(day)}.
              </p>
              {active.filter((m) => !checked.some((a) => a.member_id === m.id))
                .length ? (
                <form action={checkIn}>
                  <label>
                    Member
                    <select name="member" required>
                      {active
                        .filter(
                          (m) => !checked.some((a) => a.member_id === m.id),
                        )
                        .map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} · {m.phone}
                          </option>
                        ))}
                    </select>
                  </label>
                  <p className="form-note">
                    Membership validity is checked again when you save.
                  </p>
                  <Submit>Confirm check-in</Submit>
                </form>
              ) : (
                <p className="notice">
                  {active.length
                    ? "All active members have checked in today."
                    : "Add a member with an active membership to get started."}
                </p>
              )}
            </>
          )}
          {detail && (
            <>
              <div className="profile-head">
                <span className="avatar large">{initial(detail.name)}</span>
                <div>
                  <h2>{detail.name}</h2>
                  <p className="muted">
                    {detail.phone} {detail.email && "· " + detail.email}
                  </p>
                </div>
              </div>
              <div className="profile-details">
                <div>
                  <small>Membership</small>
                  <strong>
                    {detail.plan}{" "}
                    <span className={"status " + status(detail).toLowerCase()}>
                      {status(detail)}
                    </span>
                  </strong>
                </div>
                <div>
                  <small>Valid dates</small>
                  <strong>
                    {detail.start} → {detail.end} (exclusive)
                  </strong>
                </div>
                <div>
                  <small>Fitness goal</small>
                  <strong>{detail.goal}</strong>
                </div>
                <div>
                  <small>Membership invoice</small>
                  <strong>{money(detail.fee)}</strong>
                </div>
                <div>
                  <small>Paid / outstanding</small>
                  <strong>
                    {money(detail.paid)} / {money(detail.fee - detail.paid)}
                  </strong>
                </div>
                <div>
                  <small>Total recorded visits</small>
                  <strong>
                    {attendance.filter((a) => a.member_id === detail.id).length}
                  </strong>
                </div>
              </div>
              <button className="primary" onClick={() => open("payment")}>
                Record a payment
                <ArrowRight size={15} />
              </button>
            </>
          )}
          {receipt && (
            <div className="receipt">
              <p className="eyebrow">PAYMENT RECEIPT</p>
              <h2>{staff.gym_name}</h2>
              <span className="status active">
                <Check size={13} />
                Payment recorded
              </span>
              <h1>{money(receipt.amount)}</h1>
              <div className="profile-details">
                <div>
                  <small>Member</small>
                  <strong>{receipt.name}</strong>
                </div>
                <div>
                  <small>Method</small>
                  <strong>{receipt.method}</strong>
                </div>
                <div>
                  <small>Date · Nepal time</small>
                  <strong>
                    {shortDate(receipt.created)} · {clock(receipt.created)}
                  </strong>
                </div>
                <div>
                  <small>Receipt ID</small>
                  <strong className="receipt-id">{receipt.id}</strong>
                </div>
                {receipt.reference && (
                  <div>
                    <small>Reference</small>
                    <strong>{receipt.reference}</strong>
                  </div>
                )}
              </div>
              <p className="form-note">
                Acknowledges the payment recorded by gym staff. This is not a
                tax invoice.
              </p>
              <button className="secondary" onClick={() => window.print()}>
                Print receipt
              </button>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
  function membersTable(rows: Member[]) {
    return rows.length ? (
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Member</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Ends on</th>
              <th>Balance</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.id}>
                <td>
                  <button
                    className="person person-button"
                    onClick={() => openMember(m)}
                  >
                    <span className="avatar">{initial(m.name)}</span>
                    <span>
                      <strong>{m.name}</strong>
                      <small>{m.phone}</small>
                    </span>
                  </button>
                </td>
                <td>
                  <span className="plan-badge">{m.plan}</span>
                </td>
                <td>
                  <span className={"status " + status(m).toLowerCase()}>
                    <i />
                    {status(m)}
                  </span>
                </td>
                <td>{shortDate(m.end)}</td>
                <td className={m.fee > m.paid ? "balance-due" : "muted"}>
                  {m.fee > m.paid ? money(m.fee - m.paid) : "Fully paid"}
                </td>
                <td>
                  <button
                    className="icon-button"
                    aria-label={"View " + m.name}
                    onClick={() => openMember(m)}
                  >
                    <ArrowUpRight size={17} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <Empty
        icon={<Users />}
        title={
          query
            ? "No members match your search."
            : "Your community starts with one."
        }
        text={
          query
            ? "Try a different name or mobile number."
            : "Add your first member. Their membership, payments, and attendance will all live here."
        }
        action={() => open("member")}
        label="Add your first member"
      />
    );
  }
}
function Metric({
  label,
  value,
  icon,
  hint,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  hint: string;
  color: string;
}) {
  return (
    <section className="metric">
      <div className="metric-top">
        <span>{label}</span>
        <span className={"metric-icon " + color}>{icon}</span>
      </div>
      <strong>{value}</strong>
      <small>{hint}</small>
    </section>
  );
}
function Empty({
  icon,
  title,
  text,
  action,
  label,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  action: () => void;
  label: string;
}) {
  return (
    <div className="empty">
      <span className="empty-icon">{icon}</span>
      <h3>{title}</h3>
      <p>{text}</p>
      <button className="secondary" onClick={action}>
        <Plus size={15} />
        {label}
      </button>
    </div>
  );
}
