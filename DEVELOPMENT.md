Developer Project Portfolio Feature — Implementation Brief

このリポジトリに、Developer Projectの詳細表示およびA4 Printable Project Sheet機能を実装してください。

First: Analyze the Existing Project

実装を開始する前に、現在のコードベースを確認してください。

特に以下を調査してください。

使用しているFrameworkおよびVersion

Routing構造

Projectデータの現在の管理方法

既存のProject一覧およびDetail UI

Modal Componentの構造

Styling System

Image管理方法

PDF / Print関連の既存実装

DatabaseまたはCMSの有無

TypeScriptの型構造

既存Componentの再利用可能性

まず既存構造を理解し、現在の設計を不必要に破壊しないでください。

既存実装に近い構造を優先し、必要な場合のみ新しい抽象化やデータ構造を追加してください。

Core Concept

Developer Projectは単なるPortfolio Cardではありません。

1つのProjectデータから、

Web Portfolio Detail

A4 Printable Project Sheet

PDF / Print Output

を生成できる構造にしてください。

Project Data
    │
    ├── Web Detail Renderer
    │
    └── Print Renderer
            │
            └── PDF / Print

Web用とPDF用で別々のProjectデータを持たないでください。

同じデータを媒体ごとに異なるLayoutでRenderしてください。

Developer Project Data Structure

Developer Projectは概念的に以下を持ちます。

Developer Project
│
├── Main Visual
│
├── Project Name
│
├── Short Description
│
├── Project Information
│
├── Project Details
│
├── Gallery
│
└── Links

Web Detail View

WebではProject詳細をLarge Detail Modalとして表示してください。

基本的な情報順：

Main Visual

Project Name

Short Description

Project Information

Project Details

Gallery

Links

Web Viewでは閲覧体験を優先してください。

A4版と同じ情報を使用しますが、Layoutまで同一にする必要はありません。

DEVELOPER PROJECTのEyebrowはWeb Viewには表示しません。

Main Visual

Main Visualの仕様：

A4では16:9固定

object-fit: cover

必要に応じて画像端部をトリミング

WebとA4で同じ画像データを使用

将来的なFocal Point対応を考慮したデータ構造にする

Main VisualとGalleryは完全に別管理です。

Project Information

Project Informationは構造化されたLabel / Value情報です。

CATEGORY

Label        Value
Label        Value

基本カテゴリ：

GENERAL
INFRASTRUCTURE
DATA
AUTHENTICATION
API / INTEGRATION
Custom Categories...
OTHER

Custom Categoryは、

基本カテゴリの後

OTHERの前

作成順

で表示してください。

OTHERは常に最後です。

GENERAL

GENERALには以下の固定項目があります。

Status
Type
Started
Platform

例：

Status        Public
Type          Web Application
Started       2026/03/15
Platform      Web / iOS

Startedの日付表示形式：

YYYY/MM/DD

Platformは複数値に対応してください。

Information Value Types

将来的に以下のValue Typeへ拡張可能な構造にしてください。

Text
Multiple Values
URL
Service

Service Valueは、

[ Service Icon ] Service Name

として表示可能にしてください。

Registered ServiceとCustom Serviceの両方を将来的に扱える設計にしてください。

URL Rules

URLには、

実際に使用するFull URL

UI上のDisplay URL

という概念を持たせてください。

表示時は長いURLを省略可能です。

ただし、

Click → Full URL

Copy → Full URL

QR Code → Full URL

PDF Link → Full URL

としてください。

Tracking ParameterやCampaign Codeなど、URLの意味に直接関係しない部分は表示上省略可能です。

Project Details

Project DetailsはProject Informationとは別です。

Project Information：

Database      Supabase
Deployment    Vercel
Framework     Next.js

Project Details：

Background
Problem
Solution
Development
Design Concept
Future Plans

などの文章・説明コンテンツです。

固定された1つの長文ではなく、Content Blockを並べる構造にしてください。

初期Block Type：

Section
Text
Image
Image + Text
Highlight

Blockは順序を持ち、将来的に並び替え可能な構造にしてください。

Gallery

Galleryは、

Main Visual

Project Details内のImage

とは別です。

GalleryはProject成果物・UI・スクリーンショットなどを一覧的に見せるためのものです。

Gallery Itemは将来的に、

Image

Caption

Description

などを持てる構造にしてください。

Links

LinksはProject Detailの最後に配置してください。

基本順：

Website
GitHub
Additional Links...

WebsiteとGitHubが存在する場合は先頭固定。

Additional Linksのみ順序変更可能な設計にしてください。

各Linkは最低限、

Title
Description
URL
Button Label

を持ちます。

Descriptionは必須です。

外部リンクは新しいタブで開いてください。

A4 Printable Project Sheet

Developer ProjectはA4縦のProject SheetとしてPrint / PDF出力可能にしてください。

用途：

PDF

印刷

提案資料

対面で直接渡す資料

Paper：

A4
Portrait

A4 Header

全ページ共通：

RYUSEI TSUKAMOTO PORTFOLIO

A4 Footer

全ページ共通：

Ryusei Tsukamoto        Project Name        1 / 3

配置：

Left: Ryusei Tsukamoto

Center: Project Name

Right: Page Number

1ページのみの場合も、

1 / 1

形式を使用してください。

First Page

基本構造：

RYUSEI TSUKAMOTO PORTFOLIO


[ MAIN VISUAL — 16:9 / cover ]


DEVELOPER PROJECT

PROJECT NAME

Short Description


PROJECT INFORMATION


GENERAL

ルール：

DEVELOPER PROJECTはA4版のみ

Projectごとに変更しない

Title Areaは左揃え

Short Descriptionに文字数制限を設けない

可能な限りGENERALまで1ページ目に配置

GENERALカテゴリ自体は途中でページ分割しない

A4 Category Layout

カテゴリ間：

Whitespace

Thin Horizontal Rule

Whitespace

カテゴリ内は基本的に余白で整理してください。

項目数が多い場合のみ、薄いRow Separatorを使用可能です。

Project Details Print Rules

以下を可能な限り分断しないでください。

Section Titleと本文先頭

ImageとCaption

Image + Text Block

Highlight Block

Block全体が入らない場合は次ページへ送ってください。

ただし、非常に長いText Blockは自然なページ分割を許可してください。

Links Print Layout

A4ではLinkを縦方向に表示してください。

Website

Description

URL                              [ QR Code ]

QR Codeは、

Website
GitHub

のみ。

Additional LinksにはQR Codeを表示しないでください。

QR CodeはWeb Viewでは表示しません。

QR Codeには必ずFull URLを使用してください。

Print Pagination

基本原則：

意味のある情報Blockを途中で不自然に分断しない。

対象：

GENERAL Category

Project Information Category

Link Block

Image + Caption

Highlight

Image + Text Block

入り切らない場合はBlock全体を次ページへ送ってください。

Implementation Approach

以下の順番で進めてください。

Step 1

既存コードを調査し、現在の構造を理解する。

Step 2

この仕様との差分を整理する。

既存構造を無駄に置き換えない。

Step 3

必要なData Model / Typeを設計する。

将来の拡張性を確保しつつ、過剰な抽象化は避ける。

Step 4

Web Detail Viewを実装する。

Step 5

A4 Print Viewを実装する。

Step 6

実際に印刷PreviewまたはPDF生成を確認し、A4でLayoutが崩れないよう調整する。

Important Constraints

既存コードを不必要に破壊しない

既存のComponent / Styling Systemを可能な限り再利用する

Web用とPDF用でProject Dataを複製しない

過剰なCMS化をしない

初期段階で不要なBlock Typeを追加しない

Mobile / Responsive Viewも既存Portfolioの設計方針に合わせる

Print Layoutは実際のA4印刷を前提とする

Web ViewとPrint Viewの責務を明確に分離する

実装後、既存機能にRegressionがないことを確認する