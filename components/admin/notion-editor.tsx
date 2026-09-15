"use client";

import { useEffect, useMemo } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { plainTextToHtml } from "@/lib/rich-text";
import styles from "./notion-editor.module.css";

type NotionEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeightClass?: string;
  className?: string;
  compact?: boolean;
};

function ToolbarButton({
  onClick,
  active,
  label,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`${styles.btn} ${active ? styles.btnActive : "hover:bg-black/5 hover:text-black"}`}
    >
      {label}
    </button>
  );
}

function EditorToolbar({ editor, compact }: { editor: Editor | null; compact?: boolean }) {
  if (!editor) return null;
  const addImage = () => {
    const url = window.prompt("Image URL / 画像URL");
    if (!url) return;
    editor.chain().focus().setImage({ src: url.trim() }).run();
  };
  return (
    <div className={styles.toolbar}>
      <ToolbarButton title="Heading 1" label="H1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} />
      <ToolbarButton title="Heading 2" label="H2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
      {!compact && (
        <ToolbarButton title="Heading 3" label="H3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />
      )}
      <span className={styles.sep} />
      <ToolbarButton title="Bold" label="B" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} />
      <ToolbarButton title="Italic" label="I" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} />
      <ToolbarButton title="Strike" label="S" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} />
      <span className={styles.sep} />
      <ToolbarButton title="Bullet list" label="• List" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} />
      <ToolbarButton title="Ordered list" label="1. List" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
      <ToolbarButton title="Quote" label="“”" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
      <ToolbarButton title="Divider" label="—" onClick={() => editor.chain().focus().setHorizontalRule().run()} />
      <span className={styles.sep} />
      <ToolbarButton title="Image URL" label="Img" onClick={addImage} />
      <ToolbarButton title="Clear formatting" label="Clear" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} />
    </div>
  );
}

/** Lightweight Notion-like TipTap editor for Admin CMS. Stores HTML. */
export function NotionEditor({
  value,
  onChange,
  placeholder = "Write with headings, lists, images… / 見出し・リスト・画像で執筆…",
  minHeightClass = "min-h-[160px]",
  className = "",
  compact = false,
}: NotionEditorProps) {
  const initialContent = useMemo(() => plainTextToHtml(value) || "", []);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Image.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full h-auto border border-black/10 my-3" },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:text-gray-300 before:float-left before:h-0 before:pointer-events-none",
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: `${styles.prose} focus:outline-none px-3 py-3 text-sm leading-relaxed text-black ${minHeightClass}`,
      },
    },
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;
    const next = plainTextToHtml(value) || "";
    const current = editor.getHTML();
    const a = current === "<p></p>" ? "" : current;
    const b = next === "<p></p>" ? "" : next;
    if (a !== b) editor.commands.setContent(next || "", { emitUpdate: false });
  }, [value, editor]);

  return (
    <div className={`${styles.wrap} ${className}`}>
      <EditorToolbar editor={editor} compact={compact} />
      <EditorContent editor={editor} />
    </div>
  );
}

export default NotionEditor;
