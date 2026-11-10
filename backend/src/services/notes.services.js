import mongoose from 'mongoose';
import notesRepository from '../repositories/notes.repositories.js';
import { AppError } from '../middleware/error.middleware.js';
import cache from '../utils/redis-cache.js';

// Extract plain text from a TipTap (ProseMirror) document
const extractText = (node) => {
    if (!node || typeof node !== 'object') return '';

    if (node.type === 'text') {
        return node.text || '';
    }

    const children = node.content || [];

    const blockContainers = [
        'doc',
        'blockquote',
        'bulletList',
        'orderedList',
        'listItem'
    ];

    const separator = blockContainers.includes(node.type) ? ' ' : '';

    return children
        .map(extractText)
        .join(separator);
};

// Validate MongoDB ObjectId
const validateNoteId = (noteId) => {
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
        throw new AppError('Invalid note ID', 400);
    }
};

// Create a note
const createNote = async (data, userId) => {
    const { title, content } = data;

    if (!title || typeof title !== 'string' || !title.trim()) {
        throw new AppError('Note title is required', 400);
    }

    if (title.trim().length > 150) {
        throw new AppError('Title cannot exceed 150 characters', 400);
    }

    if (
        !content ||
        typeof content !== 'object' ||
        Array.isArray(content) ||
        content.type !== 'doc'
    ) {
        throw new AppError('Valid TipTap document content is required', 400);
    }

    const contentText = extractText(content).replace(/\s+/g, ' ').trim();

    const note = await notesRepository.create({
        title: title.trim(),
        content,
        contentText,
        userId
    });
    await cache.deleteCache(`notes:list:${userId}`);
    return note;
};

// Get all notes belonging to a user
const getNotes = async (userId) => {
    const cacheKey = `notes:list:${userId}`;

    const cachedNotes = await cache.getCache(cacheKey);

    if (cachedNotes) {
        return cachedNotes;
    }

    const notes = await notesRepository.findAllByUser(userId);

    await cache.setCache(cacheKey, notes);

    return notes;
};

// Get one note
const getNote = async (noteId, userId) => {
    validateNoteId(noteId);

    const cacheKey = `notes:${userId}:${noteId}`;

    const cachedNote = await cache.getCache(cacheKey);

    if (cachedNote) {
        return cachedNote;
    }

    const note = await notesRepository.findByIdAndUser(noteId, userId);

    if (!note) {
        throw new AppError('Note not found', 404);
    }

    await cache.setCache(cacheKey, note);

    return note;
};

// Update a note
const updateNote = async (noteId, userId, updates) => {
    validateNoteId(noteId);

    const { title, content } = updates;
    const updateData = {};

    if (title !== undefined) {
        if (typeof title !== 'string' || !title.trim()) {
            throw new AppError('Note title cannot be empty', 400);
        }

        if (title.trim().length > 150) {
            throw new AppError('Title cannot exceed 150 characters', 400);
        }

        updateData.title = title.trim();
    }

    if (content !== undefined) {
        if (
            !content ||
            typeof content !== 'object' ||
            Array.isArray(content) ||
            content.type !== 'doc'
        ) {
            throw new AppError('Valid TipTap document content is required', 400);
        }

        updateData.content = content;
        updateData.contentText = extractText(content)
            .replace(/\s+/g, ' ')
            .trim();
    }

    if (Object.keys(updateData).length === 0) {
        throw new AppError('No valid fields provided for update', 400);
    }

    const updatedNote = await notesRepository.updateByIdAndUser(
        noteId,
        userId,
        updateData
    );

    if (!updatedNote) {
        throw new AppError('Note not found', 404);
    }

    await cache.deleteCache(`notes:list:${userId}`);
    await cache.deleteCache(`notes:${userId}:${noteId}`);

    return updatedNote;
};

// Delete a note
const deleteNote = async (noteId, userId) => {
    validateNoteId(noteId);

    const deletedNote = await notesRepository.deleteByIdAndUser(
        noteId,
        userId
    );

    if (!deletedNote) {
        throw new AppError('Note not found', 404);
    }

    await cache.deleteCache(`notes:list:${userId}`);
    await cache.deleteCache(`notes:${userId}:${noteId}`);

    return deletedNote;
};

// Search notes by title or content
const searchNotes = async (userId, query) => {
    if (!query || typeof query !== 'string' || !query.trim()) {
        throw new AppError('Search query is required', 400);
    }

    return notesRepository.searchByUser(userId, query.trim());
};

const notesService = {
    createNote,
    getNotes,
    getNote,
    updateNote,
    deleteNote,
    searchNotes
};

export default notesService;