"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useLanguage } from "@/components/providers/language-provider";
import type { DbPortfolio, DbAlbum } from "@/lib/supabase-queries";
import { DeveloperProject } from "@/types/dev-project";
import { DevProjectModal } from "@/components/dev-project/dev-project-modal";

type Crumb = { id: string | null; title: string };

export default function PortfolioPageClient({
  portfolio,
  albums,
  mapping = [],
  devProjects = [],
}: {
  portfolio: DbPortfolio[];
  albums: DbAlbum[];
  mapping?: { portfolio_id: string; album_id: string }[];
  devProjects?: DeveloperProject[];
}) {
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<"collections" | "albums" | "dev_projects">("collections");
  const [selectedDevProject, setSelectedDevProject] = useState<DeveloperProject | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Crumb[]>([
    { id: null, title: language === "ja" ? "ホーム" : "Home" }
  ]);
  
  const currentAlbumId = breadcrumbs[breadcrumbs.length - 1]?.id ?? null;

  const currentLevelAlbums = useMemo(() => {
    if (activeTab === "albums") {
      return albums.filter(a => a.type === "portfolio" && a.parent_id === currentAlbumId);
    }
    return [];
  }, [albums, currentAlbumId, activeTab]);

  const currentLevelWorks = useMemo(() => {
    if (activeTab === "collections") {
      // Collectionsタブでは全ての作品を表示
      return portfolio;
    }
    // Albumsタブでは現在のアルバム内の作品のみを表示
    if (currentAlbumId === null) {
      // ルートレベルでは作品を表示しない（アルバムのみを表示）
      return [];
    }
    const itemIds = new Set(mapping.filter(m => m.album_id === currentAlbumId).map(m => m.portfolio_id));
    return portfolio.filter(p => itemIds.has(p.id));
  }, [portfolio, currentAlbumId, mapping, activeTab]);

  const title = language === "ja" ? "ポートフォリオ" : "Portfolio";

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <SiteHeader />
      
      <div className="flex-1">
        <header className="bg-white border-b border-black/10 py-8 md:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-6xl font-black mb-4 md:mb-8 tracking-tighter">{title}</h1>
            
            {/* Tab Navigation */}
            <div className="flex border-b border-black/10 mb-8">
              <button
                onClick={() => {
                  setActiveTab("collections");
                  setBreadcrumbs([{ id: null, title: language === "ja" ? "ホーム" : "Home" }]);
                }}
                className={`px-6 py-3 text-sm font-black uppercase tracking-widest transition-colors border-b-2 ${
                  activeTab === "collections"
                    ? "text-black border-black"
                    : "text-gray-400 border-transparent hover:text-gray-600"
                }`}
              >
                {language === "ja" ? "コレクション" : "Collections"}
              </button>
              <button
                onClick={() => {
                  setActiveTab("albums");
                  setBreadcrumbs([{ id: null, title: language === "ja" ? "ホーム" : "Home" }]);
                }}
                className={`px-6 py-3 text-sm font-black uppercase tracking-widest transition-colors border-b-2 ${
                  activeTab === "albums"
                    ? "text-black border-black"
                    : "text-gray-400 border-transparent hover:text-gray-600"
                }`}
              >
                {language === "ja" ? "アルバム" : "Albums"}
              </button>
              <button
                onClick={() => {
                  setActiveTab("dev_projects");
                  setBreadcrumbs([{ id: null, title: language === "ja" ? "ホーム" : "Home" }]);
                }}
                className={`px-6 py-3 text-sm font-black uppercase tracking-widest transition-colors border-b-2 ${
                  activeTab === "dev_projects"
                    ? "text-black border-black"
                    : "text-gray-400 border-transparent hover:text-gray-600"
                }`}
              >
                {language === "ja" ? "開発プロジェクト" : "Dev Projects"}
              </button>
            </div>
            
            {/* Breadcrumbs (only show for Albums tab) */}
            {activeTab === "albums" && (
              <nav className="flex items-center gap-2 md:gap-3 text-xs md:text-sm font-black uppercase tracking-widest text-gray-400 flex-wrap">
                {breadcrumbs.map((crumb, idx) => (
                  <div key={crumb.id || 'root'} className="flex items-center gap-3">
                    <button 
                      onClick={() => setBreadcrumbs(breadcrumbs.slice(0, idx + 1))}
                      className={`hover:text-black transition-colors ${idx === breadcrumbs.length - 1 ? 'text-black border-b-2 border-black' : ''}`}
                    >
                      {crumb.title}
                    </button>
                    {idx < breadcrumbs.length - 1 && <span className="opacity-30">/</span>}
                  </div>
                ))}
              </nav>
            )}
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8 md:py-16">
          {/* Albums section (only show in Albums tab) */}
          {activeTab === "albums" && currentLevelAlbums.length > 0 && (
            <div className="mb-20">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-10">
                {language === "ja" ? "アルバム" : "Albums"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
                {currentLevelAlbums.map((album) => (
                  <button
                    key={album.id}
                    onClick={() => setBreadcrumbs([...breadcrumbs, { id: album.id, title: language === "ja" ? album.name_ja || album.name_en : album.name_en }])}
                    className="group text-left border border-black/10 rounded-2xl overflow-hidden bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  >
                    <div className="aspect-square bg-black/5 relative overflow-hidden">
                      {album.cover_image_url ? (
                        <img 
                          src={album.cover_image_url} 
                          alt="" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl">📁</div>
                      )}
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">Explore</span>
                      </div>
                    </div>
                    <div className="p-4 md:p-8">
                      <h3 className="font-black text-lg md:text-2xl mb-2">{language === "ja" ? album.name_ja || album.name_en : album.name_en}</h3>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-2">
                        {language === "ja" ? album.description_ja || album.description_en : album.description_en}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Works / Dev Projects section */}
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-10">
              {activeTab === "collections" 
                ? (language === "ja" ? "全作品" : "All Works")
                : activeTab === "dev_projects"
                  ? (language === "ja" ? "開発プロジェクト" : "Developer Projects")
                  : (currentAlbumId ? (language === "ja" ? "このアルバム内の作品" : "Works in this album") : (language === "ja" ? "全作品" : "All Works"))
              }
            </h2>
            
            {activeTab === "dev_projects" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10 mb-20">
                {devProjects.length > 0 ? devProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => setSelectedDevProject(project)}
                    className="group cursor-pointer border border-black/10 rounded-2xl overflow-hidden bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col"
                  >
                    <div className="aspect-video bg-gray-100 relative overflow-hidden shrink-0">
                      <img 
                        src={project.mainVisualUrl} 
                        alt="" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                        Dev Project
                      </div>
                    </div>
                    <div className="p-4 md:p-6 flex-1 flex flex-col">
                      <h3 className="font-black text-lg md:text-xl group-hover:text-blue-600 transition-colors mb-2 line-clamp-1">
                        {project.projectName}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {project.shortDescription}
                      </p>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-400 font-bold italic col-span-full">No developer projects found.</p>
                )}
              </div>
            )}
            
            {selectedDevProject && (
              <DevProjectModal 
                project={selectedDevProject} 
                isOpen={true} 
                onClose={() => setSelectedDevProject(null)} 
              />
            )}

            {activeTab !== "dev_projects" && currentLevelWorks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
                {currentLevelWorks.map((work) => (
                  <Link
                    key={work.id}
                    href={`/portfolio/${work.id}`}
                    className="group border border-black/10 rounded-2xl overflow-hidden bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  >
                    <div className="aspect-square bg-black/5 relative overflow-hidden">
                      {work.image_url ? (
                        <img 
                          src={work.image_url} 
                          alt="" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl">🎨</div>
                      )}
                    </div>
                    <div className="p-4 md:p-8">
                      <h3 className="font-black text-base md:text-xl group-hover:text-blue-600 transition-colors">
                        {language === "ja" ? work.title_ja || work.title_en : work.title_en}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 font-bold italic">
                {activeTab === "collections" 
                  ? (language === "ja" ? "作品が見つかりません" : "No works found")
                  : (language === "ja" ? "このアルバム内に作品が見つかりません" : "No works found in this album")
                }
              </p>
            )}
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
