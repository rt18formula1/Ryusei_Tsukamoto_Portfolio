// Jev Dispatcher for Portfolio Admin Development
// This orchestrates Jev calls to generate Admin components

import { choice, TypeSafeClient } from "@typesafe-ai/sdk";
import { ADMIN_SPEC_STATE } from "./jev-spec";

const TYPESAFE_API_KEY = process.env.TYPESAFE_API_KEY;

export interface JevComponentGenerationResult {
  selectedComponent: string;
  implementationApproach: string;
  uiLayout: string;
}

export async function dispatchJevForAdminDevelopment(): Promise<JevComponentGenerationResult> {
  if (!TYPESAFE_API_KEY) {
    throw new Error("TYPESAFE_API_KEY is not configured");
  }

  const client = new TypeSafeClient();

  const response = await client.systemOne({
    state: ADMIN_SPEC_STATE,
    questions: {
      next_component: choice(
        "Admin仕様書に基づいて、次に実装すべき最も重要なコンポーネントを選択してください。既存コンポーネントを考慮し、不足している機能を優先してください。",
        {
          "discipline_editor": "Discipline管理インターフェース（Name, Slug, Description, Display Order, Visible）",
          "activity_list": "Activity一覧表示（DisciplineごとのActivity一覧、検索、フィルタ）",
          "project_list": "Project一覧表示（ActivityごとのProject一覧、Status, Visibility, Type）",
          "content_editor": "汎用Content Editor（Project以外のArtwork/Work/Article/Research用）",
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

  return {
    selectedComponent: response.answers.next_component.choice,
    implementationApproach: response.answers.implementation_approach.choice,
    uiLayout: response.answers.ui_layout.choice,
  };
}
