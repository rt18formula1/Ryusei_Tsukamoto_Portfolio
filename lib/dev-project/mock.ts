import { DeveloperProject } from "@/types/dev-project";

export const MOCK_DEV_PROJECT: DeveloperProject = {
  id: "proj-001",
  projectName: "F1 SNS Post Automator",
  shortDescription:
    "Formula 1の最新ニュースやセッション結果を自動的に取得し、SNS用の画像とテキストを生成・投稿する自動化ツール。Vercel / Supabaseで構築されたフルスタックWebアプリケーション。",
  mainVisualUrl:
    "https://images.unsplash.com/photo-1540066019607-e5f6f4870bd8?q=80&w=2940&auto=format&fit=crop",
  information: [
    {
      category: "GENERAL",
      items: [
        { label: "Status", value: "Public", type: "Text" },
        { label: "Type", value: "Web Application", type: "Text" },
        { label: "Started", value: "2026/03/15", type: "Text" },
        { label: "Platform", value: ["Web", "Mobile"], type: "Multiple Values" },
      ],
    },
    {
      category: "INFRASTRUCTURE",
      items: [
        { label: "Framework", value: "Next.js 15 (App Router)", type: "Text" },
        { label: "Deployment", value: "Vercel", type: "Text" },
        { label: "Database", value: "Supabase (PostgreSQL)", type: "Text" },
        { label: "Storage", value: "Cloudflare R2", type: "Text" },
      ],
    },
    {
      category: "DATA",
      items: [
        { label: "F1 Data Source", value: "Jolpica API / Ergast", type: "Text" },
        { label: "Cache", value: "Supabase Edge Functions", type: "Text" },
      ],
    },
    {
      category: "API / INTEGRATION",
      items: [
        {
          label: "SNS Integration",
          value: ["X (Twitter)", "Instagram"],
          type: "Multiple Values",
        },
        { label: "Image Generation", value: "Vercel OG / html2canvas", type: "Text" },
      ],
    },
    {
      category: "OTHER",
      items: [
        { label: "Language", value: "TypeScript", type: "Text" },
        { label: "Styling", value: "Tailwind CSS", type: "Text" },
      ],
    },
  ],
  details: [
    {
      id: "d1",
      order: 1,
      type: "Section",
      content: "Background",
    },
    {
      id: "d2",
      order: 2,
      type: "Text",
      content:
        "F1ファンのための情報発信において、各セッション後のリザルト更新・ニュース配信に多くの手作業が発生していました。グランプリ中は予選・決勝・各種セッションのたびに情報をまとめてSNSに投稿する必要があり、特にレースウィークエンドには時間的な制約が大きくなります。\n\nこの課題を解決するため、データ収集から投稿までをワンストップで自動化するパイプラインを構築しました。",
    },
    {
      id: "d3",
      order: 3,
      type: "Section",
      content: "Problem",
    },
    {
      id: "d4",
      order: 4,
      type: "Highlight",
      content:
        "「レース結果が確定してから投稿できるまでの時間」を最小化する。手動作業ゼロで、正確なデータをタイムリーに届ける。",
    },
    {
      id: "d5",
      order: 5,
      type: "Text",
      content:
        "主な課題は以下の3点でした。\n\n1. F1の公式APIはリアルタイム性が低く、データの整形が必要\n2. SNS投稿ごとに画像のデザインを手動で調整する必要がある\n3. 複数のSNSプラットフォームへの同時投稿が煩雑",
    },
    {
      id: "d6",
      order: 6,
      type: "Section",
      content: "Solution",
    },
    {
      id: "d7",
      order: 7,
      type: "ImageText",
      imageUrl:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2944&auto=format&fit=crop",
      text: "Next.jsのAPI Routesを活用し、Jolpica APIと独自スクレイパーからリアルタイムにF1データを取得。Supabaseでキャッシュしてパフォーマンスを担保しつつ、Vercel OGを用いてSNS投稿用の画像を動的に生成します。",
    },
    {
      id: "d8",
      order: 8,
      type: "Section",
      content: "Development",
    },
    {
      id: "d9",
      order: 9,
      type: "Text",
      content:
        "プロジェクトはNext.js 15のApp Routerを全面採用。Server ComponentsとClient Componentsを適切に分離することで、初期ロードの高速化とインタラクティブなUI操作の両立を実現しています。\n\nSupabaseのRow Level Security (RLS)を活用して、管理者のみが投稿操作を行えるよう認証・認可を設計。Cloudflare R2で生成画像をホスティングし、配信コストを最小化しています。",
    },
    {
      id: "d10",
      order: 10,
      type: "Section",
      content: "Future Plans",
    },
    {
      id: "d11",
      order: 11,
      type: "Text",
      content:
        "今後の拡張計画:\n\n- AI要約機能の追加（Gemini API連携でレースレポートを自動生成）\n- Webhook経由でのリアルタイムデータ取得\n- 投稿スケジューリング機能の強化\n- ダークモード対応のUI刷新",
    },
  ],
  gallery: [
    {
      id: "g1",
      order: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2940&auto=format&fit=crop",
      caption: "Dashboard Overview",
      description: "管理者ダッシュボードのメインUI。F1カレンダーと直近のセッション結果を一覧表示。",
    },
    {
      id: "g2",
      order: 2,
      imageUrl:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2915&auto=format&fit=crop",
      caption: "Data Pipeline",
      description: "APIからSNS投稿まで、データフローの全体像を示すビジュアライゼーション。",
    },
    {
      id: "g3",
      order: 3,
      imageUrl:
        "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2940&auto=format&fit=crop",
      caption: "Post Generator UI",
      description: "ワンクリックで各SNS向けの投稿画像とテキストを生成するインターフェース。",
    },
    {
      id: "g4",
      order: 4,
      imageUrl:
        "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2876&auto=format&fit=crop",
      caption: "Analytics View",
      description: "過去の投稿パフォーマンスと閲覧数の分析ダッシュボード。",
    },
  ],
  links: [
    {
      id: "l1",
      order: 1,
      title: "Website",
      description: "本番環境のアプリケーション。ログイン後に各機能をご確認いただけます。",
      url: "https://rt18formula1.vercel.app",
      buttonLabel: "Visit Site",
    },
    {
      id: "l2",
      order: 2,
      title: "GitHub",
      description: "ソースコードはGitHubで公開しています。PRやIssueも歓迎します。",
      url: "https://github.com/rt18formula1/rt18-formula1-official-site",
      buttonLabel: "View Code",
    },
    {
      id: "l3",
      order: 3,
      title: "Development Log",
      description: "開発記録をnoteにまとめています。設計の意図や詰まったポイントを共有しています。",
      url: "https://note.com/rt18_formula1",
      buttonLabel: "Read Notes",
    },
  ],
};

export const MOCK_DEV_PROJECT_2: DeveloperProject = {
  id: "proj-002",
  projectName: "Portfolio Generator",
  shortDescription:
    "開発者向けのポートフォリオサイトを自動生成するCLIツール。プロジェクト情報をYAMLで定義し、Next.jsベースの静的サイトをワンコマンドで構築。",
  mainVisualUrl:
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2940&auto=format&fit=crop",
  information: [
    {
      category: "GENERAL",
      items: [
        { label: "Status", value: "Beta", type: "Text" },
        { label: "Type", value: "CLI Tool", type: "Text" },
        { label: "Started", value: "2026/01/20", type: "Text" },
        { label: "Platform", value: ["macOS", "Linux", "Windows"], type: "Multiple Values" },
      ],
    },
    {
      category: "INFRASTRUCTURE",
      items: [
        { label: "Language", value: "Rust", type: "Text" },
        { label: "Package Manager", value: "Cargo", type: "Text" },
        { label: "Template Engine", value: "Handlebars", type: "Text" },
      ],
    },
    {
      category: "AUTHENTICATION",
      items: [
        { label: "Auth Provider", value: "GitHub OAuth", type: "Service", serviceName: "GitHub", serviceIconUrl: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" },
      ],
    },
    {
      category: "API / INTEGRATION",
      items: [
        { label: "GitHub API", value: "REST / GraphQL", type: "Text" },
        { label: "Deployment", value: "Vercel CLI", type: "Service", serviceName: "Vercel" },
      ],
    },
    {
      category: "OTHER",
      items: [
        { label: "License", value: "MIT", type: "Text" },
        { label: "Documentation", value: "mdBook", type: "Text" },
      ],
    },
  ],
  details: [
    {
      id: "d1",
      order: 1,
      type: "Section",
      content: "Background",
    },
    {
      id: "d2",
      order: 2,
      type: "Text",
      content:
        "開発者は自身のスキルやプロジェクトを効果的にアピールするポートフォリオサイトを必要としますが、ゼロから構築するのは時間がかかります。特にデザインや実装に時間を割くよりも、コンテンツ作成に集中したいというニーズが高いです。\n\n既存のテンプレートベースのソリューションもありますが、カスタマイズ性が低く、特定の技術スタックに縛られることが多いです。",
    },
    {
      id: "d3",
      order: 3,
      type: "Section",
      content: "Problem",
    },
    {
      id: "d4",
      order: 4,
      type: "Highlight",
      content:
        "「コンテンツに集中できるポートフォリオ作成体験」を提供する。技術的な制約を受けず、自分だけのデザインを実現できる柔軟性を持つ。",
    },
    {
      id: "d5",
      order: 5,
      type: "Text",
      content:
        "課題点:\n\n- 既存ツールは特定の技術スタックに依存している\n- デザインのカスタマイズが難しい\n- プロジェクト情報の管理が煩雑\n- デプロイまでのフローが自動化されていない",
    },
    {
      id: "d6",
      order: 6,
      type: "Section",
      content: "Solution",
    },
    {
      id: "d7",
      order: 7,
      type: "ImageText",
      imageUrl:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2944&auto=format&fit=crop",
      text: "RustでCLIツールを開発し、YAMLベースの設定ファイルからプロジェクト情報を解析。Handlebarsテンプレートエンジンを使用して、カスタマイズ可能なNext.jsサイトを生成します。Vercel CLIとの統合でデプロイも自動化。",
    },
    {
      id: "d8",
      order: 8,
      type: "Section",
      content: "Development",
    },
    {
      id: "d9",
      order: 9,
      type: "Text",
      content:
        "Rustの強力な型システムとパフォーマンスを活用し、大規模なプロジェクトでも高速に処理可能。クロスプラットフォーム対応で、Windows/macOS/Linuxで同じ体験を提供。\n\nGitHub APIとの統合で、ユーザーのリポジトリ情報を自動取得し、ポートフォリオに反映可能。",
    },
    {
      id: "d10",
      order: 10,
      type: "Section",
      content: "Future Plans",
    },
    {
      id: "d11",
      order: 11,
      type: "Text",
      content:
        "今後の計画:\n\n- テーマシステムの拡充（複数テーマ対応）\n- プラグインシステムの実装\n- CI/CD統合機能の追加\n- マルチ言語対応",
    },
  ],
  gallery: [
    {
      id: "g1",
      order: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2940&auto=format&fit=crop",
      caption: "CLI Interface",
      description: "ターミナルでのインタラクティブなセットアップウィザード。",
    },
    {
      id: "g2",
      order: 2,
      imageUrl:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2915&auto=format&fit=crop",
      caption: "Generated Site",
      description: "ツールで生成されたポートフォリオサイトの例。",
    },
  ],
  links: [
    {
      id: "l1",
      order: 1,
      title: "GitHub",
      description: "ソースコードとドキュメント。StarやIssueを歓迎します。",
      url: "https://github.com/rt18formula1/portfolio-generator",
      buttonLabel: "View Code",
    },
    {
      id: "l2",
      order: 2,
      title: "npm",
      description: "npmパッケージとして公開中。インストールはワンコマンド。",
      url: "https://www.npmjs.com/package/portfolio-generator",
      buttonLabel: "Install",
    },
  ],
};
