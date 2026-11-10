
import { useEffect, useState } from 'react';

import {
    getNotes,
    getNote,
    createNote,
    deleteNote,
    searchNotes
} from '../services/notes.services.js';

import NoteEditor from '../components/NoteEditor';

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);

    const [title, setTitle] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch all notes
    const fetchNotes = async () => {
        setLoading(true);
        setError('');

        try {
            const result = await getNotes();
            setNotes(result.data || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to load notes.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    // Create a new note
    const handleCreateNote = async (e) => {
        e.preventDefault();

        if (!title.trim()) return;

        setError('');

        try {
            const result = await createNote({
                title: title.trim(),
                content: {
                    type: 'doc',
                    content: [
                        {
                            type: 'paragraph',
                            content: []
                        }
                    ]
                }
            });

            setNotes((previousNotes) => [
                result.data,
                ...previousNotes
            ]);

            setTitle('');
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to create note.'
            );
        }
    };

    // Open a note
    const handleOpenNote = async (noteId) => {
        setError('');
        setLoading(true);

        try {
            const result = await getNote(noteId);
            setSelectedNote(result.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to open note.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Return to the notes list
    const handleCloseEditor = async () => {
        setSelectedNote(null);
        await fetchNotes();
    };

    // Delete a note
    const handleDeleteNote = async (noteId) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this note?'
        );

        if (!confirmed) return;

        try {
            await deleteNote(noteId);

            setNotes((previousNotes) =>
                previousNotes.filter(
                    (note) => note._id !== noteId
                )
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to delete note.'
            );
        }
    };

    // Search notes
    const handleSearch = async (e) => {
        e.preventDefault();

        if (!searchQuery.trim()) {
            await fetchNotes();
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await searchNotes(searchQuery.trim());
            setNotes(result.data || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Search failed.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Display the selected note in the editor
    if (selectedNote) {
        return (
            <NoteEditor
                note={selectedNote}
                onClose={handleCloseEditor}
            />
        );
    }

    return (
        <div className="notes-container">

            <div className="notes-heading">
                <h2>Your Notes</h2>
                <p>Create and manage all your notes in one place.</p>
            </div>

            {error && (
                <p className="error-message">{error}</p>
            )}

            {/* Create note */}
            <form
                className="create-note-form"
                onSubmit={handleCreateNote}
            >
                <input
                    type="text"
                    placeholder="Enter a note title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={150}
                    required
                />

                <button type="submit">
                    Create Note
                </button>
            </form>

            {/* Search notes */}
            <form
                className="search-form"
                onSubmit={handleSearch}
            >
                <input
                    type="text"
                    placeholder="Search your notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <button type="submit">
                    Search
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setSearchQuery('');
                        fetchNotes();
                    }}
                >
                    Clear
                </button>
            </form>

            {/* Notes list */}
            <div className="notes-list">

                {loading ? (
                    <p>Loading notes...</p>
                ) : notes.length === 0 ? (
                    <p>No notes found. Create your first note!</p>
                ) : (
                    notes.map((note) => (
                        <div className="note-card" key={note._id}>

                            <div
                                className="note-card-content"
                                onClick={() => handleOpenNote(note._id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <h3>{note.title}</h3>

                                <p>
                                    {note.contentText || 'No content yet'}
                                </p>

                                <small>
                                    Last updated:{' '}
                                    {new Date(
                                        note.updatedAt
                                    ).toLocaleString()}
                                </small>

                                <p>Click to open and edit</p>
                            </div>

                            <button
                                className="delete-button"
                                onClick={() => handleDeleteNote(note._id)}
                            >
                                Delete
                            </button>

                        </div>
                    ))
                )}

            </div>
        </div>
    );
};

export default Notes;
