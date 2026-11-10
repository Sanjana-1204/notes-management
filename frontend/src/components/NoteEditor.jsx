
import { useEffect, useRef, useState } from 'react';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

import { updateNote } from '../services/notes.services.js';

const NoteEditor = ({ note, onClose }) => {
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);
    const [isDirty, setIsDirty] = useState(false);
    const [saveStatus, setSaveStatus] = useState('Saved');

    const saveVersion = useRef(0);

    // Initialize the TipTap editor
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                autolink: true
            })
        ],
        content: note.content,
        onUpdate: ({ editor }) => {
            setContent(editor.getJSON());
            setIsDirty(true);
            setSaveStatus('Unsaved changes');
            saveVersion.current += 1;
        }
    });

    // Mark the note as changed when its title is edited
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        setIsDirty(true);
        setSaveStatus('Unsaved changes');
        saveVersion.current += 1;
    };

    // Automatically save changes after 1 second of inactivity
    useEffect(() => {
        if (!isDirty) return;

        const currentVersion = saveVersion.current;

        const timer = setTimeout(async () => {
            setSaveStatus('Saving...');

            try {
                await updateNote(note._id, {
                    title: title.trim(),
                    content
                });

                if (saveVersion.current === currentVersion) {
                    setIsDirty(false);
                    setSaveStatus('Saved');
                }
            } catch (error) {
                console.error('Autosave failed:', error);

                setSaveStatus('Save failed');
            }
        }, 1000);

        return () => clearTimeout(timer);

    }, [title, content, isDirty, note._id]);

    if (!editor) {
        return <p>Loading editor...</p>;
    }

    // Add or edit a hyperlink
    const handleLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Enter URL:', previousUrl || '');

        if (url === null) return;

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        const validUrl = /^https?:\/\//i.test(url)
            ? url
            : `https://${url}`;

        editor.chain().focus().extendMarkRange('link')
            .setLink({ href: validUrl })
            .run();
    };

    return (
        <div className="note-editor">

            <div className="editor-header">
                <button onClick={onClose}>
                    ← Back to Notes
                </button>

                <span className="save-status">
                    {saveStatus}
                </span>
            </div>

            <input
                className="editor-title"
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Note title..."
                maxLength={150}
            />

            {/* Formatting toolbar */}
            <div className="editor-toolbar">

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'active' : ''}
                >
                    Bold
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'active' : ''}
                >
                    Italic
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive('heading', { level: 1 }) ? 'active' : ''}
                >
                    H1
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}
                >
                    H2
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'active' : ''}
                >
                    Bullet List
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? 'active' : ''}
                >
                    Numbered List
                </button>

                <button
                    type="button"
                    onClick={handleLink}
                >
                    Link
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={editor.isActive('codeBlock') ? 'active' : ''}
                >
                    Code Block
                </button>

            </div>

            {/* Rich text editing area */}
            <div className="editor-content">
                <EditorContent editor={editor} />
            </div>

        </div>
    );
};

export default NoteEditor;
