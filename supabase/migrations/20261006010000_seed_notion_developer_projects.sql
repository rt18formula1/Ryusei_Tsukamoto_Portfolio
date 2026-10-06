-- Initial Developer Project records reconstructed from the user's Notion project pages
-- and the corresponding public repository READMEs. Image URLs remain NULL until a
-- canonical asset is selected in Admin.
INSERT INTO dev_projects (
  id, project_name, short_description, main_visual_url,
  main_visual_focal_point_x, main_visual_focal_point_y,
  information, details, gallery, links, discipline_id, sort_order
) VALUES
(
  '00000000-0000-4000-8000-000000000001',
  'rt18-formula1-official-site',
  'F1のニュース、スケジュール、リザルト、告知、イラスト、ポートフォリオ、プロフィール、リクエスト、コンタクトを統合した公式Webサイト。',
  NULL, 0.5, 0.5,
  '[
    {"category":"GENERAL","items":[
      {"label":"Status","value":"Public","type":"Text"},
      {"label":"Type","value":"Web Application","type":"Text"},
      {"label":"Started","value":"—","type":"Text"},
      {"label":"Platform","value":["Web"],"type":"Multiple Values"},
      {"label":"Visibility","value":"Published","type":"Text"}
    ]},
    {"category":"INFRASTRUCTURE","items":[
      {"label":"Framework","value":"Next.js","type":"Text"},
      {"label":"Deployment","value":"Vercel","type":"Service","serviceName":"Vercel","service":{"name":"Vercel","kind":"registered"}},
      {"label":"Database","value":"Supabase","type":"Service","serviceName":"Supabase","service":{"name":"Supabase","kind":"registered"}}
    ]},
    {"category":"DATA","items":[{"label":"Scope","value":["News","Schedule","Results","Portfolio","F1DB"],"type":"Multiple Values"}]}
  ]'::jsonb,
  '[
    {"id":"rt18-background","order":1,"type":"Section","content":"Background"},
    {"id":"rt18-background-text","order":2,"type":"Text","content":"F1の情報発信をSNSだけでなく、ニュース、スケジュール、リザルト、イラスト、ポートフォリオまで蓄積できるWeb基盤へ拡張したプロジェクト。"},
    {"id":"rt18-development","order":3,"type":"Section","content":"Development"},
    {"id":"rt18-development-text","order":4,"type":"Text","content":"一次データを優先し、公式サイト、Jolpica、OpenF1、LLMなど複数の取得経路とフォールバックを組み合わせている。"}
  ]'::jsonb,
  '[]'::jsonb,
  '[
    {"id":"rt18-website","order":1,"title":"Website","description":"F1公式サイトの公開ページ。","url":"https://rt18-formula1-official-site.vercel.app","buttonLabel":"Visit Site"},
    {"id":"rt18-github","order":2,"title":"GitHub","description":"公式サイトのソースコード。","url":"https://github.com/rt18formula1/rt18-formula1-official-site","buttonLabel":"View Code"}
  ]'::jsonb,
  'developer', 1
),
(
  '00000000-0000-4000-8000-000000000002',
  'calender-generator',
  '画像と年月を選択し、フォトフレームや壁紙などのテンプレートでカレンダー画像を生成・書き出しできるWebツール。',
  NULL, 0.5, 0.5,
  '[
    {"category":"GENERAL","items":[
      {"label":"Status","value":"Public","type":"Text"},
      {"label":"Type","value":"Tool","type":"Text"},
      {"label":"Started","value":"—","type":"Text"},
      {"label":"Platform","value":["Web"],"type":"Multiple Values"},
      {"label":"Visibility","value":"Published","type":"Text"}
    ]},
    {"category":"INFRASTRUCTURE","items":[
      {"label":"Deployment","value":"Vercel","type":"Service","serviceName":"Vercel","service":{"name":"Vercel","kind":"registered"}}
    ]},
    {"category":"GENERAL","items":[{"label":"Features","value":["Template selection","Artwork upload","Year/month selection","Preview","Image export"],"type":"Multiple Values"}]}
  ]'::jsonb,
  '[
    {"id":"calendar-generator-overview","order":1,"type":"Section","content":"Overview"},
    {"id":"calendar-generator-description","order":2,"type":"Text","content":"任意の画像をアップロードすると縦長・横長を自動判定し、選択したレイアウトに合わせてリアルタイムでカレンダーをプレビューできる。"}
  ]'::jsonb,
  '[]'::jsonb,
  '[
    {"id":"calendar-generator-website","order":1,"title":"Website","description":"カレンダー生成ツールの公開サイト。","url":"https://calendar-generator-six.vercel.app","buttonLabel":"Visit Site"},
    {"id":"calendar-generator-github","order":2,"title":"GitHub","description":"カレンダー生成ツールのソースコード。","url":"https://github.com/rt18formula1/calender-generator","buttonLabel":"View Code"}
  ]'::jsonb,
  'developer', 2
),
(
  '00000000-0000-4000-8000-000000000003',
  'nasu-calendar',
  'ゆる学徒界隈の動画公開スケジュールを一覧・購読できるカレンダー配信サイト。',
  NULL, 0.5, 0.5,
  '[
    {"category":"GENERAL","items":[
      {"label":"Status","value":"Public","type":"Text"},
      {"label":"Type","value":"Web Application","type":"Text"},
      {"label":"Started","value":"—","type":"Text"},
      {"label":"Platform","value":["Web","Mobile"],"type":"Multiple Values"},
      {"label":"Visibility","value":"Published","type":"Text"}
    ]},
    {"category":"INFRASTRUCTURE","items":[
      {"label":"Frontend","value":["React 18","TypeScript","Vite","Tailwind CSS"],"type":"Multiple Values"},
      {"label":"Backend","value":["Express","Node.js"],"type":"Multiple Values"},
      {"label":"Deployment","value":"Vercel","type":"Service","serviceName":"Vercel","service":{"name":"Vercel","kind":"registered"}}
    ]},
    {"category":"DATA","items":[{"label":"Calendar Source","value":"Google Calendar","type":"Service","serviceName":"Google Calendar","service":{"name":"Google Calendar","kind":"registered"}}]
  ]'::jsonb,
  '[
    {"id":"nasu-calendar-background","order":1,"type":"Section","content":"Background"},
    {"id":"nasu-calendar-description","order":2,"type":"Text","content":"株式会社pedanticの動画投稿スケジュールをGoogleカレンダーで一元管理し、曜日別の公開時間を確認・購読できるようにした。"}
  ]'::jsonb,
  '[]'::jsonb,
  '[
    {"id":"nasu-calendar-website","order":1,"title":"Website","description":"ゆる学徒公開カレンダーの公開サイト。","url":"https://yurugakuto-calendar.vercel.app","buttonLabel":"Visit Site"},
    {"id":"nasu-calendar-github","order":2,"title":"GitHub","description":"カレンダー配信サイトのソースコード。","url":"https://github.com/rt18formula1/nasu-calendar","buttonLabel":"View Code"}
  ]'::jsonb,
  'developer', 3
),
(
  '00000000-0000-4000-8000-000000000004',
  'Meteor_Creator_Studio',
  'Adobe Creative Cloudのフリーミアム代替を目指す、プロ向けのレイヤー・ツール・パネル構成を持つクリエイティブスイート。',
  NULL, 0.5, 0.5,
  '[
    {"category":"GENERAL","items":[
      {"label":"Status","value":"In Development","type":"Text"},
      {"label":"Type","value":"Design & Creative","type":"Text"},
      {"label":"Started","value":"—","type":"Text"},
      {"label":"Platform","value":["Web","Desktop"],"type":"Multiple Values"},
      {"label":"Visibility","value":"Published","type":"Text"}
    ]},
    {"category":"INFRASTRUCTURE","items":[{"label":"Deployment","value":"Netlify","type":"Service","serviceName":"Netlify","service":{"name":"Netlify","kind":"registered"}}]},
    {"category":"OTHER","items":[{"label":"Apps","value":["Meteor Photo","Meteor Vector","Meteor Video","Meteor Layout"],"type":"Multiple Values"}]}
  ]'::jsonb,
  '[
    {"id":"meteor-concept","order":1,"type":"Section","content":"Concept"},
    {"id":"meteor-concept-text","order":2,"type":"Text","content":"Canvaのテンプレート型ではなく、Adobe風のパネル・ツールバーとレイヤー構成を採用し、プロ〜中級者を対象にする。"},
    {"id":"meteor-free-pro","order":3,"type":"Highlight","content":"無料版とPro版を持つフリーミアム設計。無料版は基本ツール、Pro版は無制限レイヤー・高度な形式・AI機能を提供する。"}
  ]'::jsonb,
  '[]'::jsonb,
  '[{"id":"meteor-github","order":1,"title":"GitHub","description":"Meteor Creator Studioのソースコード。","url":"https://github.com/rt18formula1/Meteor_Creator_Studio","buttonLabel":"View Code"}]'::jsonb,
  'developer', 4
),
(
  '00000000-0000-4000-8000-000000000005',
  'fine-day-plus-official',
  'Fine Day Plusに関連するWeb・ソフトウェア実装プロジェクト。バンド活動のEntityとは分離して管理する。',
  NULL, 0.5, 0.5,
  '[
    {"category":"GENERAL","items":[
      {"label":"Status","value":"In Development","type":"Text"},
      {"label":"Type","value":"Website","type":"Text"},
      {"label":"Started","value":"—","type":"Text"},
      {"label":"Platform","value":["Web"],"type":"Multiple Values"},
      {"label":"Visibility","value":"Published","type":"Text"}
    ]},
    {"category":"OTHER","items":[{"label":"Entity Rule","value":"Development implementation is separate from the Fine Day Plus band entity.","type":"Text"}]}
  ]'::jsonb,
  '[
    {"id":"fine-day-plus-rule","order":1,"type":"Section","content":"Entity Boundary"},
    {"id":"fine-day-plus-rule-text","order":2,"type":"Text","content":"Project-specific implementation belongs here. Musical activity remains in Music Context / Fine Day Plus and should be connected as a relationship rather than merged into this project."}
  ]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  'developer', 5
)
ON CONFLICT (id) DO UPDATE SET
  project_name = EXCLUDED.project_name,
  short_description = EXCLUDED.short_description,
  main_visual_url = EXCLUDED.main_visual_url,
  main_visual_focal_point_x = EXCLUDED.main_visual_focal_point_x,
  main_visual_focal_point_y = EXCLUDED.main_visual_focal_point_y,
  information = EXCLUDED.information,
  details = EXCLUDED.details,
  gallery = EXCLUDED.gallery,
  links = EXCLUDED.links,
  discipline_id = EXCLUDED.discipline_id,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();
