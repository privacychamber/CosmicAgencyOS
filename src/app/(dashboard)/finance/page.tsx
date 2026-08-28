import React from "react";
import { getFinanceDashboardData } from "@/actions/finance";
import { notFound } from "next/navigation";
import { DollarSign, AlertCircle, CheckCircle, TrendingUp } from "lucide-react";
import { hasPermission } from "@/lib/rbac";

export default async function FinanceDashboardPage() {
  const canViewFinance = await hasPermission("project.financial.view");
  if (!canViewFinance) {
    return (
      <div className="flex items-center justify-center h-full p-20">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You do not have permission to view financial data.</p>
        </div>
      </div>
    );
  }

  const { success, data } = await getFinanceDashboardData();
  
  if (!success || !data) notFound();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Finance Dashboard</h1>
        <p className="text-muted-foreground">Company-wide financial overview and outstanding balances.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border border-primary/30 p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10"><DollarSign className="w-32 h-32" /></div>
          <p className="text-sm text-primary mb-1">Total Pipeline Budget</p>
          <p className="text-3xl font-bold text-white">${data.totalBudget.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10"><CheckCircle className="w-32 h-32" /></div>
          <p className="text-sm text-muted-foreground mb-1">Total Received</p>
          <p className="text-3xl font-bold text-white">${data.totalReceived.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10"><TrendingUp className="w-32 h-32" /></div>
          <p className="text-sm text-secondary mb-1">Total Outstanding</p>
          <p className="text-3xl font-bold text-secondary">${data.totalOutstanding.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Client Summaries */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Client Summaries</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Client</th>
                  <th className="pb-3 font-medium text-right">Received</th>
                  <th className="pb-3 font-medium text-right">Outstanding</th>
                </tr>
              </thead>
              <tbody>
                {data.clientSummaries.map((client: any, i: number) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="py-4">
                      <p className="font-medium text-white">{client.clientName}</p>
                      <p className="text-xs text-muted-foreground">{client.totalProjects} Projects</p>
                    </td>
                    <td className="py-4 text-right text-green-400 font-medium">${client.totalReceived.toLocaleString()}</td>
                    <td className="py-4 text-right text-yellow-400 font-medium">${client.totalOutstanding.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Recent Payments</h3>
          <div className="space-y-4">
            {data.recentPayments.length > 0 ? data.recentPayments.map((payment: any) => (
              <div key={payment.id} className="flex justify-between items-center p-4 border border-border rounded-xl bg-background/50">
                <div>
                  <p className="font-bold text-white">${payment.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{new Date(payment.createdAt).toLocaleDateString()}</p>
                  <p className="text-xs mt-1">Logged by: {payment.addedBy?.name || 'System'}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${payment.status === 'Paid' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-muted-foreground text-sm">No recent payments.</div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
