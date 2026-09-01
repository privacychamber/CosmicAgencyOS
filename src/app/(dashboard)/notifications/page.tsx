export default function NotificationsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Notifications</h1>
          <p className="text-[var(--color-muted-foreground)]">Your recent alerts and messages.</p>
        </div>
      </div>
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-8 rounded-2xl text-center">
        <p className="text-[var(--color-muted-foreground)]">No new notifications.</p>
      </div>
    </div>
  );
}
