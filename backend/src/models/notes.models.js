import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Note title is required'],
            trim: true,
            maxlength: [150, 'Title cannot exceed 150 characters']
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        content: {
            type: mongoose.Schema.Types.Mixed,
            default: {
                type: 'doc',
                content: [{ type: 'paragraph' }]
            }
        },

        contentText: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

// Fetch a user's notes, sorted by latest update
noteSchema.index({ userId: 1, updatedAt: -1 });

// Search note titles and content
noteSchema.index({
    title: 'text',
    contentText: 'text'
});

const Note = mongoose.model('Note', noteSchema);

export default Note;