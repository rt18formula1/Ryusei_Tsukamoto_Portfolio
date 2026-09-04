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
