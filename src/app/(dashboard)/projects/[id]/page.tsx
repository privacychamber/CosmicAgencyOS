import { hasPermission } from "@/lib/rbac";
import { ArrowLeft, Clock, Briefcase } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectById } from "@/actions/projects";
import { ProjectTabs } from "@/components/projects/project-tabs";

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { success, project } = await getProjectById(params.id);

  if (!success || !project) notFound();

  // RBAC Check for Financials
  const canViewFinancials = await hasPermission("project.financial.view");

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Navigation */}
      <div className="flex items-center gap-2">
        <Link href="/projects/board" className="text-[var(--color-muted-foreground)] hover:text-white transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Board
        </Link>
      </div>

      {/* Header */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 justify-between">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {project.status}
            </span>
            <span className="text-[var(--color-muted-foreground)] flex items-center gap-1 text-sm">
              <Clock className="w-4 h-4" />
              Deadline: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">{project.name}</h1>
          <p className="text-xl text-[var(--color-muted-foreground)] flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Client: {project.client?.company?.name || 'Unknown Client'}
          </p>
        </div>
        
        <div className="w-full md:w-64">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[var(--color-muted-foreground)]">Progress</span>
            <span className="text-white font-bold">{project.progress}%</span>
          </div>
          <div className="w-full bg-[var(--color-muted)] h-3 rounded-full overflow-hidden">
            <div className="bg-blue-400 h-full transition-all" style={{ width: `${project.progress}%` }}></div>
          </div>
          <div className="mt-2 text-xs text-center text-[var(--color-muted-foreground)]">
            Health: <span className={project.health === 'Critical' ? 'text-red-400 font-bold' : project.health === 'At Risk' ? 'text-yellow-400 font-bold' : 'text-green-400 font-bold'}>{project.health || 'Healthy'}</span>
          </div>
        </div>
      </div>

      <ProjectTabs project={project} canViewFinancials={canViewFinancials} />
    </div>
  );
}
