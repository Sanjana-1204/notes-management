import Note from '../models/notes.models.js';

// Create a new note
const create = async (noteData) => {
    return Note.create(noteData);
};

// Get all notes belonging to a specific user
const findAllByUser = async (userId) => {
    return Note.find({ userId })
        .sort({ updatedAt: -1 });
};

// Find a specific note belonging to a specific user
const findByIdAndUser = async (noteId, userId) => {
    return Note.findOne({
        _id: noteId,
        userId
    });
};

// Update a note belonging to a specific user
const updateByIdAndUser = async (noteId, userId, updates) => {
    return Note.findOneAndUpdate(
        {
            _id: noteId,
            userId
        },
        updates,
        {
            returnDocument: 'after',
            runValidators: true
        }
    );
};

// Delete a note belonging to a specific user
const deleteByIdAndUser = async (noteId, userId) => {
    return Note.findOneAndDelete({
        _id: noteId,
        userId
    });
};

// Search notes by title or content
const searchByUser = async (userId, query) => {
    // treat the query as a literal string and escape any special regex characters
    // then create a case-insensitive regex pattern to search for the query in both title and contentText fields
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(escapedQuery, 'i');


    // Search for notes that belong to the user
    // Match either the title or contentText fields against the search regex
    return Note.find({
        userId,
        $or: [
            { title: searchRegex },
            { contentText: searchRegex }
        ]
    }).sort({ updatedAt: -1 });
};

const notesRepository = {
    create,
    findAllByUser,
    findByIdAndUser,
    updateByIdAndUser,
    deleteByIdAndUser,
    searchByUser
};

export default notesRepository;