import { NextResponse } from "next/server";
import { choice, TypeSafeClient } from "@typesafe-ai/sdk";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const TYPESAFE_API_KEY = process.env.TYPESAFE_API_KEY;

const ADMIN_SPEC_STATE = {
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
  adminRequirements: {
    purpose: "PortfolioのHierarchyと各コンテンツを一元管理する",
    targetUsers: "Adminユーザー（認証必須）",
    designPrinciples: ["Functional", "Clear", "Dense", "Organized"],
  },
  navigation: {
    sections: [
      "Dashboard",
      "Portfolio (Hierarchy, Disciplines, Activities)",
      "Content (Projects, Other Contents)",
      "Media",
      "Settings",
    ],
  },
  existingComponents: {
    adminSidebar: "components/admin/admin-sidebar.tsx",
    adminDashboard: "components/admin/admin-dashboard.tsx",
    adminHierarchyTree: "components/admin/admin-hierarchy-tree.tsx",
    adminActivityEditor: "components/admin/admin-activity-editor.tsx",
    adminProjectEditor: "components/admin/admin-project-editor.tsx",
    adminDisciplineEditor: "components/admin/admin-discipline-editor.tsx",
    adminContentEditor: "components/admin/admin-content-editor.tsx",
  },
  techStack: {
    framework: "Next.js 15 with App Router",
    ui: "React client components",
    styling: "Tailwind CSS",
    icons: "lucide-react",
    state: "React hooks (useState, useEffect)",
    auth: "Supabase Auth",
    database: "Supabase",
  },
};

export async function POST(request: Request) {
  if (!TYPESAFE_API_KEY) {
    return NextResponse.json(
      { error: "TYPESAFE_API_KEY is not configured" },
      { status: 500 }
    );
  }

  try {
    const client = new TypeSafeClient();

    const response = await client.systemOne({
      state: ADMIN_SPEC_STATE,
      questions: {
        next_component: choice(
          "Admin仕様書に基づいて、次に実装すべき最も重要なコンポーネントを選択してください。既存コンポーネントを考慮し、不足している機能を優先してください。",
          {
            "activity_list": "Activity一覧表示（DisciplineごとのActivity一覧、検索、フィルタ）",
            "project_list": "Project一覧表示（ActivityごとのProject一覧、Status, Visibility, Type）",
            "media_library": "Media Library（画像のアップロード、管理、検索）",
            "settings_page": "Settingsページ（全般設定、ユーザー管理、API設定）",
            "breadcrumb_component": "Breadcrumbコンポーネント（Hierarchyに基づくパンくず表示）",
          }
        ),
        implementation_approach: choice(
          "選択されたコンポーネントの実装アプローチを選択してください。既存のAdminコンポーネントのパターンを再利用してください。",
          {
            "follow_existing_pattern": "既存のadmin-project-editor.tsxやadmin-activity-editor.tsxと同様のパターンで実装",
            "create_new_pattern": "新しいパターンで実装（既存パターンが適用できない場合）",
            "extend_existing_component": "既存コンポーネントを拡張して実装",
          }
        ),
        ui_layout: choice(
          "コンポーネントのUIレイアウトを選択してください。Adminのデザイン原則（Functional, Clear, Dense, Organized）を考慮してください。",
          {
            "sidebar_with_content": "Sidebar + Main Contentエリアの2カラムレイアウト",
            "single_column": "単一カラムの縦スクロールレイアウト",
            "modal_based": "Modalベースの編集インターフェース",
            "grid_based": "Gridベースのカードレイアウト",
          }
        ),
      },
    });

    return NextResponse.json({
      selectedComponent: response.answers.next_component.choice,
      implementationApproach: response.answers.implementation_approach.choice,
      uiLayout: response.answers.ui_layout.choice,
    });
  } catch (error) {
    console.error("Jev dispatch error:", error);
    return NextResponse.json(
      { error: "Failed to dispatch Jev" },
      { status: 500 }
    );
  }
}
