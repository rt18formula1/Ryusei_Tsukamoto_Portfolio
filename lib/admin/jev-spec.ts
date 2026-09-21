// Jev State and Questions for Portfolio Admin Development
// This file defines the state and questions to guide Jev in generating Admin components

export const ADMIN_SPEC_STATE = {
  // Portfolio Hierarchy Structure
  hierarchy: {
    levels: [
      "Portfolio (RYUSEI TSUKAMOTO)",
      "Discipline (DEVELOPER, ILLUSTRATOR, MUSICIAN, BLOGGER, INVESTOR)",
      "Activity / Brand (rt18_dev, rt18_formula1, rt18_music, Fine Day Plus)",
      "Content / Project (具体的な成果物)",
      "Detail (個別Contentの詳細)",
    ],
    disciplines: [
      { id: "developer", name: "DEVELOPER", color: "#2563eb" },
      { id: "illustrator", name: "ILLUSTRATOR", color: "#7c3aed" },
      { id: "musician", name: "MUSICIAN", color: "#db2777" },
      { id: "blogger", name: "BLOGGER", color: "#059669" },
      { id: "investor", name: "INVESTOR", color: "#d97706" },
    ],
  },

  // Admin Requirements
  adminRequirements: {
    purpose: "PortfolioのHierarchyと各コンテンツを一元管理する",
    targetUsers: "Adminユーザー（認証必須）",
    designPrinciples: [
      "Functional",
      "Clear",
      "Dense",
      "Organized",
      "Portfolio本体のDesign Systemと共有",
    ],
  },

  // Admin Navigation Structure
  navigation: {
    sections: [
      "Dashboard",
      "Portfolio (Hierarchy, Disciplines, Activities)",
      "Content (Projects, Other Contents)",
      "Media",
      "Settings",
    ],
  },

  // Existing Components
  existingComponents: {
    adminSidebar: "components/admin/admin-sidebar.tsx",
    adminDashboard: "components/admin/admin-dashboard.tsx",
    adminHierarchyTree: "components/admin/admin-hierarchy-tree.tsx",
    adminActivityEditor: "components/admin/admin-activity-editor.tsx",
    adminProjectEditor: "components/admin/admin-project-editor.tsx",
  },

  // Tech Stack
  techStack: {
    framework: "Next.js 15 with App Router",
    ui: "React client components",
    styling: "Tailwind CSS",
    icons: "lucide-react",
    state: "React hooks (useState, useEffect)",
    auth: "Supabase Auth",
    database: "Supabase",
  },

  // Data Models
  dataModels: {
    adminHierarchy: "types/admin-hierarchy.ts",
    portfolioHierarchy: "types/portfolio-hierarchy.ts",
    devProject: "types/dev-project.ts",
  },
};

export const ADMIN_SPEC_QUESTIONS = {
  // Component Selection
  next_component: {
    type: "choice" as const,
    instructions: "Admin仕様書に基づいて、次に実装すべき最も重要なコンポーネントを選択してください。既存コンポーネントを考慮し、不足している機能を優先してください。",
    criteria: {
      "discipline_editor": "Discipline管理インターフェース（Name, Slug, Description, Display Order, Visible）",
      "activity_list": "Activity一覧表示（DisciplineごとのActivity一覧、検索、フィルタ）",
      "project_list": "Project一覧表示（ActivityごとのProject一覧、Status, Visibility, Type）",
      "content_editor": "汎用Content Editor（Project以外のArtwork/Work/Article/Research用）",
      "media_library": "Media Library（画像のアップロード、管理、検索）",
      "settings_page": "Settingsページ（全般設定、ユーザー管理、API設定）",
      "breadcrumb_component": "Breadcrumbコンポーネント（Hierarchyに基づくパンくず表示）",
    },
  },

  // Implementation Approach
  implementation_approach: {
    type: "choice" as const,
    instructions: "選択されたコンポーネントの実装アプローチを選択してください。既存のAdminコンポーネントのパターンを再利用してください。",
    criteria: {
      "follow_existing_pattern": "既存のadmin-project-editor.tsxやadmin-activity-editor.tsxと同様のパターンで実装",
      "create_new_pattern": "新しいパターンで実装（既存パターンが適用できない場合）",
      "extend_existing_component": "既存コンポーネントを拡張して実装",
    },
  },

  // UI Layout
  ui_layout: {
    type: "choice" as const,
    instructions: "コンポーネントのUIレイアウトを選択してください。Adminのデザイン原則（Functional, Clear, Dense, Organized）を考慮してください。",
    criteria: {
      "sidebar_with_content": "Sidebar + Main Contentエリアの2カラムレイアウト",
      "single_column": "単一カラムの縦スクロールレイアウト",
      "modal_based": "Modalベースの編集インターフェース",
      "grid_based": "Gridベースのカードレイアウト",
    },
  },

  // Data Structure
  data_structure: {
    type: "choice" as const,
    instructions: "コンポーネントで使用するデータ構造を選択してください。既存のデータモデルを再利用してください。",
    criteria: {
      "use_admin_hierarchy": "types/admin-hierarchy.tsのAdminDiscipline/Activity/Contentを使用",
      "use_portfolio_hierarchy": "types/portfolio-hierarchy.tsのPortfolioHierarchyを使用",
      "create_new_structure": "新しいデータ構造を作成",
      "extend_existing": "既存データ構造を拡張",
    },
  },
};
