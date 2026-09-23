"use client";

import React, { useState } from "react";
import { Upload, Search, Filter, Trash2, Download, Copy, Image as ImageIcon, FileText, X } from "lucide-react";

interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: "image" | "document";
  size: number;
  uploadedAt: string;
}

interface AdminMediaLibraryProps {
  onSelect?: (media: MediaItem) => void;
  onClose?: () => void;
}

export function AdminMediaLibrary({ onSelect, onClose }: AdminMediaLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "image" | "document">("all");
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Mock data - in production, this would come from your media storage
  const [mediaItems] = useState<MediaItem[]>([
    {
      id: "1",
      url: "https://example.com/image1.jpg",
      name: "portfolio-hero.jpg",
      type: "image",
      size: 2458000,
      uploadedAt: "2024-01-15",
    },
    {
      id: "2",
      url: "https://example.com/image2.png",
      name: "project-screenshot.png",
      type: "image",
      size: 1200000,
      uploadedAt: "2024-01-16",
    },
  ]);

  const filteredMedia = mediaItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    // In production, upload to your media storage
    setTimeout(() => {
      setIsUploading(false);
    }, 2000);
  };

  const handleSelect = (media: MediaItem) => {
    setSelectedMedia(media);
    if (onSelect) {
      onSelect(media);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="rounded-md bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-700 uppercase tracking-wider">
            Media Library
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-black">
            Media ({filteredMedia.length})
          </h2>
        </div>
        <div className="flex gap-2">
          <label className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-black/80 cursor-pointer">
            <Upload size={14} />
            <span>{isUploading ? "Uploading..." : "Upload"}</span>
            <input
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              multiple
              onChange={handleUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-2 rounded-xl border border-black/10 px-4 py-2 text-xs font-bold text-black shadow-sm hover:bg-black/5"
            >
              <X size={14} />
              <span>Close</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media..."
            className="w-full rounded-xl border border-black/10 pl-9 pr-3.5 py-2.5 text-xs text-black outline-none focus:border-black/30"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as "all" | "image" | "document")}
          className="rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black/30"
        >
          <option value="all">All Types</option>
          <option value="image">Images</option>
          <option value="document">Documents</option>
        </select>
      </div>

      {/* Media Grid */}
      <div className="rounded-3xl border border-black/8 bg-white shadow-sm p-6">
        {filteredMedia.length === 0 ? (
          <div className="p-8 text-center text-xs text-black/40">
            No media found
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMedia.map((media) => (
              <div
                key={media.id}
                onClick={() => handleSelect(media)}
                className={`group relative rounded-xl border-2 overflow-hidden cursor-pointer transition-all ${
                  selectedMedia?.id === media.id
                    ? "border-black bg-black/5"
                    : "border-black/10 hover:border-black/30"
                }`}
              >
                {media.type === "image" ? (
                  <div className="aspect-square bg-black/5">
                    <img
                      src={media.url}
                      alt={media.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-square bg-black/5 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-black/30" />
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyUrl(media.url);
                    }}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                    aria-label="Copy URL"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                    aria-label="Download"
                  >
                    <Download size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="p-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white"
                    aria-label="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <div className="text-[10px] font-bold text-white truncate">
                    {media.name}
                  </div>
                  <div className="text-[9px] text-white/70">
                    {formatFileSize(media.size)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
