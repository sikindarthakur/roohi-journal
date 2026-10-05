import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  RemoveFormatting,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = 'Write your travel story here...',
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
        link: false,
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-amber-400 underline hover:text-amber-300',
        },
      }),
      ImageExtension.configure({
        HTMLAttributes: {
          class: 'rounded-xl my-6 max-w-full shadow-lg',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose-editorial text-stone-200 outline-none min-h-full p-6 focus:ring-0',
      },
    },
  });

  // Synchronize external content changes if editor initialized with empty content
  useEffect(() => {
    if (editor && content !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="h-[480px] rounded-2xl bg-stone-900/60 border border-stone-800 animate-pulse flex items-center justify-center text-stone-500 text-sm">
        Loading editor...
      </div>
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="h-[480px] rounded-2xl border border-stone-800 bg-[#0e1117] shadow-xl focus-within:border-amber-500/50 transition-colors flex flex-col overflow-hidden">
      {/* Fixed Rich Text Toolbar */}
      <div className="flex-shrink-0 z-20 flex flex-wrap items-center gap-1 p-2.5 bg-[#12151f] border-b border-stone-800/90 rounded-t-2xl shadow-sm">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-amber-500 text-stone-950 font-bold'
              : 'text-stone-300 hover:text-white hover:bg-stone-800'
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-amber-500 text-stone-950 font-bold'
              : 'text-stone-300 hover:text-white hover:bg-stone-800'
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="h-5 w-[1px] bg-stone-800 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive('bold')
              ? 'bg-amber-500 text-stone-950 font-bold'
              : 'text-stone-300 hover:text-white hover:bg-stone-800'
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive('italic')
              ? 'bg-amber-500 text-stone-950 font-bold'
              : 'text-stone-300 hover:text-white hover:bg-stone-800'
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        <div className="h-5 w-[1px] bg-stone-800 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive('bulletList')
              ? 'bg-amber-500 text-stone-950 font-bold'
              : 'text-stone-300 hover:text-white hover:bg-stone-800'
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive('orderedList')
              ? 'bg-amber-500 text-stone-950 font-bold'
              : 'text-stone-300 hover:text-white hover:bg-stone-800'
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive('blockquote')
              ? 'bg-amber-500 text-stone-950 font-bold'
              : 'text-stone-300 hover:text-white hover:bg-stone-800'
          }`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="h-5 w-[1px] bg-stone-800 mx-1" />

        <button
          type="button"
          onClick={setLink}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive('link')
              ? 'bg-amber-500 text-stone-950 font-bold'
              : 'text-stone-300 hover:text-white hover:bg-stone-800'
          }`}
          title="Add/Edit Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded-lg text-sm text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
          title="Insert Image by URL"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          className="p-2 rounded-lg text-sm text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
          title="Clear Formatting"
        >
          <RemoveFormatting className="w-4 h-4" />
        </button>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 disabled:opacity-30 transition-colors"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 disabled:opacity-30 transition-colors"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Editor Content Area */}
      <div
        className="flex-1 overflow-y-auto bg-[#0b0e14] cursor-text rounded-b-2xl focus:outline-none"
        onClick={() => {
          if (editor && !editor.isFocused) {
            editor.commands.focus();
          }
        }}
      >
        <EditorContent editor={editor} className="min-h-full" />
      </div>
    </div>
  );
};
