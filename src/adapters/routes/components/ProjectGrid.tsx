import { ProjectCard, type ProjectCardProps } from "./ProjectCard";

export interface ProjectGridProps {
  projects: ProjectCardProps[];
  title?: string;
  emptyMessage?: string;
  isLoading?: boolean;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  title = "My projects",
  emptyMessage = "No projects available at the moment.",
  isLoading = false,
}) => {
  const displayTitle = title;
  return (
    <section className="container-max py-12 md:py-20" aria-label={displayTitle || "Projects"}>
      {displayTitle && (
        <h2 className="text-heading font-extrabold text-[#0A0A0A] mb-10">
          {displayTitle}
        </h2>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7" data-testid="project-grid-loading">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="animate-pulse flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm"
              aria-hidden="true"
            >
              <div className="bg-border/30 w-full aspect-[16/10]" />
              <div className="p-6 space-y-3">
                <div className="h-5 bg-border/30 w-3/4 rounded-pill" />
                <div className="h-3 bg-border/20 w-1/2 rounded-pill" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && (!projects || projects.length === 0) && (
        <div
          className="flex flex-col items-center justify-center py-24 border-t border-border"
          data-testid="project-grid-empty"
        >
          <span className="text-sm font-semibold text-muted">
            {emptyMessage}
          </span>
        </div>
      )}

      {!isLoading && projects && projects.length > 0 && (
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-7"
          data-testid="project-grid"
        >
          {projects.map((project) => (
            <ProjectCard key={project.slug} {...project} />
          ))}
        </div>
      )}
    </section>
  );
};

ProjectGrid.displayName = "ProjectGrid";
