"use client";

import { useEffect, useRef, useState } from "react";
import { DeveloperProject } from "@/types/dev-project";
import QRCode from "qrcode.react";

interface DevProjectPrintViewProps {
  project: DeveloperProject;
}

export function DevProjectPrintView({ project }: DevProjectPrintViewProps) {
  const [pageCount, setPageCount] = useState(1);
  const pagesRef = useRef<HTMLDivElement[]>([]);

  // ページ数を計算するためのリサイズオブザーバー
  useEffect(() => {
    const calculatePages = () => {
      const pages = pagesRef.current;
      if (pages.length === 0) return;
      
      // 最後のページの位置から総ページ数を推定
      const lastPage = pages[pages.length - 1];
      const rect = lastPage.getBoundingClientRect();
      const pageHeight = 1122.52; // A4 height in px at 96dpi (297mm)
      const estimatedPages = Math.max(1, Math.ceil((rect.top + rect.height) / pageHeight));
      setPageCount(estimatedPages);
    };

    // 少し遅延させてレイアウトが確定してから計算
    const timer = setTimeout(calculatePages, 100);
    window.addEventListener("resize", calculatePages);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculatePages);
    };
  }, [project]);

  // 情報カテゴリのソート順
  const categoryOrder = [
    "GENERAL",
    "INFRASTRUCTURE",
    "DATA",
    "AUTHENTICATION",
    "API / INTEGRATION",
    "OTHER",
  ];

  const sortedInfo = [...project.information].sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a.category);
    const bIndex = categoryOrder.indexOf(b.category);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.category.localeCompare(b.category);
  });

  // 値のフォーマット
  const formatValue = (item: typeof project.information[0]["items"][0]) => {
    if (item.type === "Multiple Values" && Array.isArray(item.value)) {
      return item.value.map((v, i) => (
        <span key={i} className="block">{v}</span>
      ));
    }
    if (item.type === "URL") {
      const display = item.displayUrl || item.value;
      return (
        <a
          href={item.value as string}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline break-all print:text-black print:no-underline"
        >
          {display}
        </a>
      );
    }
    if (item.type === "Service" && item.serviceIconUrl) {
      return (
        <span className="flex items-center gap-2">
          <img src={item.serviceIconUrl} alt={item.serviceName || ""} className="w-4 h-4 print:hidden" />
          <span>{item.serviceName || item.value}</span>
        </span>
      );
    }
    return String(item.value);
  };

  // 詳細ブロックのレンダリング
  const renderDetailBlocks = () => {
    return project.details
      .sort((a, b) => a.order - b.order)
      .map((block) => {
        switch (block.type) {
          case "Section":
            return (
              <h3 key={block.id} className="text-xl font-bold mt-8 mb-4 pb-2 border-b border-black/10 print:page-break-inside-avoid">
                {block.content}
              </h3>
            );
          case "Text":
            return (
              <div key={block.id} className="prose prose-sm max-w-none text-gray-700 mb-6 whitespace-pre-wrap print:page-break-inside-avoid">
                {block.content}
              </div>
            );
          case "Image":
            return (
              <div key={block.id} className="mb-6 print:page-break-inside-avoid">
                {block.imageUrl && (
                  <>
                    <img
                      src={block.imageUrl}
                      alt={block.imageCaption || ""}
                      className="w-full rounded-xl object-cover aspect-video mb-2"
                    />
                    {block.imageCaption && (
                      <p className="text-xs text-gray-500 text-center italic">{block.imageCaption}</p>
                    )}
                  </>
                )}
              </div>
            );
          case "ImageText":
            return (
              <div key={block.id} className="flex flex-col md:flex-row gap-6 mb-8 print:page-break-inside-avoid">
                {block.imageUrl && (
                  <div className="md:w-1/2 flex-shrink-0">
                    <img
                      src={block.imageUrl}
                      alt={block.imageCaption || ""}
                      className="w-full rounded-xl object-cover aspect-video"
                    />
                    {block.imageCaption && (
                      <p className="text-xs text-gray-500 text-center italic mt-1">{block.imageCaption}</p>
                    )}
                  </div>
                )}
                <div className="md:w-1/2 prose prose-sm max-w-none text-gray-700">
                  {block.text}
                </div>
              </div>
            );
          case "Highlight":
            return (
              <div
                key={block.id}
                className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-xl print:page-break-inside-avoid print:bg-yellow-50 print:border-l-4 print:border-yellow-400"
              >
                <p className="font-medium text-yellow-900 print:text-black">{block.content}</p>
              </div>
            );
          default:
            return null;
        }
      });
  };

  // リンクのレンダリング（印刷用：縦方向、QRコード付き）
  const renderPrintLinks = () => {
    const sortedLinks = [...project.links].sort((a, b) => {
      const aPriority = a.title === "Website" ? 0 : a.title === "GitHub" ? 1 : 2;
      const bPriority = b.title === "Website" ? 0 : b.title === "GitHub" ? 1 : 2;
      if (aPriority !== bPriority) return aPriority - bPriority;
      return a.order - b.order;
    });

    return sortedLinks.map((link) => (
      <div
        key={link.id}
        className="mb-8 print:page-break-inside-avoid"
      >
        <div className="flex items-start gap-4 mb-2">
          <span className="font-bold text-sm shrink-0">{link.title}</span>
          <span className="text-sm text-gray-600">{link.description}</span>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all print:text-black print:no-underline"
            >
              {link.displayUrl || link.url}
            </a>
          </div>
          {/* WebsiteとGitHubのみQRコード表示 */}
          {(link.title === "Website" || link.title === "GitHub") && (
            <div className="flex-shrink-0 ml-4">
              <QRCode
                value={link.url}
                size={64}
                level="M"
                includeMargin={true}
              />
            </div>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="print-container">
      {/* ページごとのヘッダー/フッターはCSSで制御 */}
      <style jsx>{`
        @page {
          size: A4 portrait;
          margin: 0;
        }
        
        .print-container {
          width: 210mm;
          min-height: 297mm;
          padding: 20mm 15mm;
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Segoe UI", sans-serif;
          color: #111;
          line-height: 1.6;
        }
        
        /* ヘッダー：全ページ共通 */
        @page :first {
          margin-top: 0;
        }
        
        @page {
          @top-center {
            content: "RYUSEI TSUKAMOTO PORTFOLIO";
            font-size: 8pt;
            font-weight: 700;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: #000;
            padding-top: 8mm;
            border-bottom: 0.5pt solid #000;
            margin-bottom: 4mm;
          }
          
          @bottom-left {
            content: "Ryusei Tsukamoto";
            font-size: 7pt;
            font-weight: 700;
            color: #000;
            padding-bottom: 5mm;
          }
          
          @bottom-center {
            content: "${project.projectName}";
            font-size: 7pt;
            font-weight: 700;
            color: #000;
            padding-bottom: 5mm;
          }
          
          @bottom-right {
            content: "Page " counter(page) " / " counter(pages);
            font-size: 7pt;
            font-weight: 700;
            color: #000;
            padding-bottom: 5mm;
          }
        }
        
        /* 印刷時の調整 */
        @media print {
          .print-container {
            padding: 0;
            width: 100%;
            min-height: auto;
          }
          
          .print-page {
            page-break-after: always;
            page-break-inside: avoid;
          }
          
          .print-page:last-child {
            page-break-after: auto;
          }
          
          /* 最初のページのみメインビジュアルを大きく */
          .first-page .main-visual {
            height: 120mm;
          }
          
          /* 2ページ目以降はメインビジュアルなし */
          .not-first-page .main-visual {
            display: none;
          }
          
          /* 改ページ制御 */
          h3, .info-category, .detail-block, .gallery-item, .link-block {
            page-break-inside: avoid;
          }
          
          /* リンクのURLはフル表示 */
          a[href]::after {
            content: none !important;
          }
        }
        
        /* 画面表示用（印刷プレビュー以外） */
        @media screen {
          .print-container {
            max-width: 210mm;
            margin: 20px auto;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            min-height: 297mm;
          }
          
          .print-page {
            min-height: 297mm;
            padding-bottom: 40mm; /* フッター分の余白 */
            position: relative;
          }
          
          /* 画面表示用のヘッダー/フッター */
          .screen-header {
            text-align: center;
            font-size: 8pt;
            font-weight: 700;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: #000;
            padding: 10mm 0 4mm;
            border-bottom: 1px solid #000;
            margin-bottom: 8mm;
          }
          
          .screen-footer {
            position: absolute;
            bottom: 10mm;
            left: 15mm;
            right: 15mm;
            display: flex;
            justify-content: space-between;
            font-size: 7pt;
            font-weight: 700;
            color: #000;
            border-top: 1px solid #000;
            padding-top: 4mm;
          }
        }
        
        /* メインビジュアル */
        .main-visual {
          width: 100%;
          aspect-ratio: 16 / 9;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 12mm;
        }
        
        /* ラベル */
        .eyebrow {
          font-size: 7pt;
          font-weight: 700;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #666;
          margin-bottom: 4mm;
          display: block;
        }
        
        /* プロジェクト名 */
        .project-name {
          font-size: 20pt;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 4mm;
          letter-spacing: -0.02em;
        }
        
        /* 短い説明 */
        .short-description {
          font-size: 10pt;
          line-height: 1.7;
          color: #333;
          margin-bottom: 8mm;
        }
        
        /* セクション見出し */
        .section-title {
          font-size: 7pt;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #666;
          margin: 12mm 0 6mm;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .section-title::after {
          content: "";
          flex: 1;
          height: 0.5pt;
          background: #ddd;
        }
        
        /* 情報カテゴリ */
        .info-category {
          margin-bottom: 8mm;
          page-break-inside: avoid;
        }
        
        .info-category-title {
          font-size: 6pt;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #888;
          margin-bottom: 3mm;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 3mm 6mm;
        }
        
        .info-item {
          display: flex;
          flex-direction: column;
          gap: 1mm;
        }
        
        .info-label {
          font-size: 7pt;
          font-weight: 700;
          color: #555;
        }
        
        .info-value {
          font-size: 7.5pt;
          color: #111;
          word-break: break-word;
        }
        
        /* 詳細ブロック */
        .detail-block {
          page-break-inside: avoid;
        }
        
        /* ギャラリー */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4mm;
        }
        
        .gallery-item {
          page-break-inside: avoid;
        }
        
        .gallery-image {
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;
          border-radius: 6px;
          margin-bottom: 2mm;
        }
        
        .gallery-caption {
          font-size: 6pt;
          color: #888;
          text-align: center;
          font-style: italic;
        }
        
        /* リンク */
        .link-block {
          page-break-inside: avoid;
        }
        
        .link-title {
          font-size: 7.5pt;
          font-weight: 700;
          margin-bottom: 1mm;
        }
        
        .link-desc {
          font-size: 7pt;
          color: #555;
          margin-bottom: 2mm;
        }
        
        .link-url {
          font-size: 7pt;
          color: #0066cc;
          word-break: break-all;
          margin-bottom: 2mm;
        }
        
        .link-qr {
          display: inline-block;
        }
        
        /* 印刷時のQRコードサイズ調整 */
        @media print {
          .link-qr img {
            width: 20mm !important;
            height: 20mm !important;
          }
        }
      `}</style>

      {/* 画面表示用のヘッダー（印刷時は@pageで制御） */}
      <div className="screen-header print:hidden">
        RYUSEI TSUKAMOTO PORTFOLIO
      </div>

      <div className="print-page first-page" ref={(el) => { if (el) pagesRef.current[0] = el; }}>
        {/* メインビジュアル */}
        {project.mainVisualUrl && (
          <img
            src={project.mainVisualUrl}
            alt={project.projectName}
            className="main-visual"
            style={{
              objectFit: "cover",
              objectPosition: project.mainVisualFocalPoint
                ? `${project.mainVisualFocalPoint.x * 100}% ${project.mainVisualFocalPoint.y * 100}%`
                : "center"
            }}
          />
        )}

        {/* DEVELOPER PROJECT ラベル */}
        <span className="eyebrow">DEVELOPER PROJECT</span>

        {/* プロジェクト名 */}
        <h1 className="project-name">{project.projectName}</h1>

        {/* 短い説明 */}
        <p className="short-description">{project.shortDescription}</p>

        {/* プロジェクト情報 */}
        {project.information.length > 0 && (
          <>
            <div className="section-title">PROJECT INFORMATION</div>
            {sortedInfo.map((cat) => (
              <div key={cat.category} className="info-category">
                <div className="info-category-title">{cat.category}</div>
                <div className="info-grid">
                  {cat.items.map((item, idx) => (
                    <div key={idx} className="info-item">
                      <span className="info-label">{item.label}</span>
                      <span className="info-value">{formatValue(item)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {/* プロジェクト詳細 */}
        {project.details.length > 0 && (
          <>
            <div className="section-title">PROJECT DETAILS</div>
            <div className="detail-blocks">
              {renderDetailBlocks()}
            </div>
          </>
        )}

        {/* ギャラリー */}
        {project.gallery.length > 0 && (
          <>
            <div className="section-title">GALLERY</div>
            <div className="gallery-grid">
              {project.gallery
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                  <div key={item.id} className="gallery-item">
                    <img
                      src={item.imageUrl}
                      alt={item.caption || ""}
                      className="gallery-image"
                    />
                    {item.caption && (
                      <p className="gallery-caption">{item.caption}</p>
                    )}
                  </div>
                ))}
            </div>
          </>
        )}

        {/* リンク */}
        {project.links.length > 0 && (
          <>
            <div className="section-title">LINKS</div>
            <div className="link-blocks">
              {renderPrintLinks()}
            </div>
          </>
        )}

        {/* 画面表示用フッター */}
        <div className="screen-footer print:hidden">
          <span>Ryusei Tsukamoto</span>
          <span>{project.projectName}</span>
          <span>1 / {pageCount}</span>
        </div>
      </div>

      {/* 2ページ目以降のプレースホルダー（実際の改ページはCSSで制御） */}
      {/* 実際の印刷では@pageルールで自動的にページ分割される */}
    </div>
  );
}
