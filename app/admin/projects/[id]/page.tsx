"use client";

import { useEffect, useState } from "react";
import { ProjectEditor } from "@/components/admin/project-editor";
import { getDevProjectById, type DbDevProject } from "@/lib/supabase-queries";

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const [project, setProject] = useState<DbDevProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => {
      setId(p.id);
      getDevProjectById(p.id)
        .then((data) => setProject(data))
        .finally(() => setLoading(false));
    });
  }, [params]);

  if (loading) {
    return <div className="p-10 text-sm text-gray-400">Loading…</div>;
  }

  if (!project) {
    return (
      <div className="p-10">
        <p className="text-sm text-gray-400 mb-4">Project not found.</p>
        <a href="/admin/projects" className="text-sm font-bold underline">← Back to Projects</a>
      </div>
    );
  }

  return <ProjectEditor project={project} />;
}
