import notesService from '../services/notes.services.js';

const createNote = async (req, res, next) => {
    try {
        const note = await notesService.createNote(req.body, req.user.id);

        res.status(201).json({
            success: true,
            message: 'Note created successfully',
            data: note
        });
    } catch (error) {
        next(error);
    }
};

const getNotes = async (req, res, next) => {
    try {
        const notes = await notesService.getNotes(req.user.id);

        res.status(200).json({
            success: true,
            results: notes.length,
            data: notes
        });
    } catch (error) {
        next(error);
    }
};

const getNote = async (req, res, next) => {
    try {
        const note = await notesService.getNote(req.params.id, req.user.id);

        res.status(200).json({
            success: true,
            data: note
        });
    } catch (error) {
        next(error);
    }
};

const updateNote = async (req, res, next) => {
    try {
        const note = await notesService.updateNote(
            req.params.id,
            req.user.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: 'Note updated successfully',
            data: note
        });
    } catch (error) {
        next(error);
    }
};

const deleteNote = async (req, res, next) => {
    try {
        await notesService.deleteNote(req.params.id, req.user.id);

        res.status(200).json({
            success: true,
            message: 'Note deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

const searchNotes = async (req, res, next) => {
    try {
        const notes = await notesService.searchNotes(
            req.user.id,
            req.query.q
        );

        res.status(200).json({
            success: true,
            results: notes.length,
            data: notes
        });
    } catch (error) {
        next(error);
    }
};

const notesController = {
    createNote,
    getNotes,
    getNote,
    updateNote,
    deleteNote,
    searchNotes
};

export default notesController;