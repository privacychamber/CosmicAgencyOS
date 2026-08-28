import { Users, Briefcase, DollarSign, Activity } from "lucide-react";

export default function ClientsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Client Dashboard</h1>
          <p className="text-[var(--color-muted-foreground)]">Aggregate portfolio metrics and client health.</p>
        </div>
      </div>

      {/* Aggregate Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-[var(--color-muted-foreground)]">Active Clients</h3>
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-4xl font-extrabold text-white">42</p>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-[var(--color-muted-foreground)]">Total Projects</h3>
            <Briefcase className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-4xl font-extrabold text-white">128</p>
          <p className="text-xs text-[var(--color-primary)] font-medium mt-2">32 Active currently</p>
        </div>

        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border border-[var(--color-primary)]/30 p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/10 rounded-full blur-2xl group-hover:bg-[var(--color-primary)]/20 transition-all"></div>
          <div className="relative z-10 flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-[var(--color-primary)]">Total Project Value</h3>
            <DollarSign className="w-5 h-5 text-[var(--color-primary)]" />
          </div>
          <p className="relative z-10 text-4xl font-extrabold text-white">$4.2M</p>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-[var(--color-muted-foreground)]">Outstanding Balances</h3>
            <Activity className="w-5 h-5 text-[var(--color-secondary)]" />
          </div>
          <p className="text-4xl font-extrabold text-white">$145k</p>
        </div>
      </div>

      {/* Client List */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--color-muted)] text-[var(--color-muted-foreground)]">
            <tr>
              <th className="px-6 py-4 font-medium">Company</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Active Projects</th>
              <th className="px-6 py-4 font-medium">LTV</th>
              <th className="px-6 py-4 font-medium">Outstanding</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            <tr className="hover:bg-[var(--color-muted)]/50 transition-colors group cursor-pointer">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
                    GC
                  </div>
                  <div>
                    <p className="text-white font-medium text-base">Globex Corp</p>
                    <p className="text-xs text-[var(--color-muted-foreground)]">Client since 2024</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                  Active
                </span>
              </td>
              <td className="px-6 py-4 text-white font-medium">3</td>
              <td className="px-6 py-4 text-white font-medium">$450,000</td>
              <td className="px-6 py-4 text-[var(--color-secondary)] font-medium">$25,000</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
