"use client";

import { useState } from "react";
import { ProjectCard, type ProjectCardProps } from "./ProjectCard";
import { useTranslation } from "@/src/i18n";

const PAGE_SIZE = 10;

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
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil((projects?.length || 0) / PAGE_SIZE);
  const visible = projects?.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE) || [];

  return (
    <section className="container-max py-12 md:py-20" aria-label={title || "Projects"}>
      {title && (
        <h2 className="text-heading font-extrabold text-[#0A0A0A] mb-10">
          {title}
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

      {!isLoading && visible.length > 0 && (
        <>
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-7"
            data-testid="project-grid"
          >
            {visible.map((project) => (
              <ProjectCard key={project.slug} {...project} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-pill border-2 border-accent text-[#0A0A0A] font-bold shadow-[0_10px_20px_rgba(246,51,154,0.2)] hover:shadow-[0_14px_28px_rgba(246,51,154,0.3)] hover:bg-accent hover:text-white active:scale-95 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t.projects.prev || "Previous"}
              </button>
              <span className="text-sm text-muted tabular-nums">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-pill border-2 border-accent text-[#0A0A0A] font-bold shadow-[0_10px_20px_rgba(246,51,154,0.2)] hover:shadow-[0_14px_28px_rgba(246,51,154,0.3)] hover:bg-accent hover:text-white active:scale-95 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t.projects.next || "Next"}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

ProjectGrid.displayName = "ProjectGrid";
