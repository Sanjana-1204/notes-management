
import api from './api';

// Get all notes belonging to the logged-in user
export const getNotes = async () => {
    const response = await api.get('/notes');
    return response.data;
};

// Get one note using its ID
export const getNote = async (noteId) => {
    const response = await api.get(`/notes/${noteId}`);
    return response.data;
};

// Create a new note
export const createNote = async (noteData) => {
    const response = await api.post('/notes', noteData);
    return response.data;
};

// Update an existing note
export const updateNote = async (noteId, noteData) => {
    const response = await api.patch(`/notes/${noteId}`, noteData);
    return response.data;
};

// Delete a note
export const deleteNote = async (noteId) => {
    const response = await api.delete(`/notes/${noteId}`);
    return response.data;
};

// Search notes by title or content
export const searchNotes = async (query) => {
    const response = await api.get('/notes/search', {
        params: { q: query }
    });

    return response.data;
};
