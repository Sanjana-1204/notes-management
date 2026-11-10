import { Router } from 'express';
import notesController from '../controllers/notes.controllers.js';
import authenticate from '../middleware/auth.middleware.js';

const router = Router();

// All note routes require authentication
router.use(authenticate);

/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "673a12345678901234567890"
 *         title:
 *           type: string
 *           example: "My Study Notes"
 *         content:
 *           type: object
 *           description: TipTap ProseMirror JSON document
 *           example:
 *             type: doc
 *             content:
 *               - type: paragraph
 *                 content:
 *                   - type: text
 *                     text: Hello world
 *         contentText:
 *           type: string
 *           example: "Hello world"
 *         userId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     NoteInput:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 150
 *           example: "My Study Notes"
 *         content:
 *           type: object
 *           description: TipTap ProseMirror JSON document
 *           example:
 *             type: doc
 *             content:
 *               - type: paragraph
 *                 content:
 *                   - type: text
 *                     text: Hello world
 */

// Create a note
/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NoteInput'
 *     responses:
 *       201:
 *         description: Note created successfully
 *       400:
 *         description: Invalid note data
 *       401:
 *         description: Unauthorized
 */
router.post('/', notesController.createNote);

// Get all notes belonging to the logged-in user
/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Get all notes belonging to the authenticated user
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notes retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', notesController.getNotes);

// Search notes
/**
 * @swagger
 * /notes/search:
 *   get:
 *     summary: Search notes by title or content
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search keyword
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *       400:
 *         description: Search query is required
 *       401:
 *         description: Unauthorized
 */
router.get('/search', notesController.searchNotes);

// Get a single note
/**
 * @swagger
 * /notes/{id}:
 *   get:
 *     summary: Get a note by ID
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Note not found
 */
router.get('/:id', notesController.getNote);

// Update a note
/**
 * @swagger
 * /notes/{id}:
 *   patch:
 *     summary: Update a note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 150
 *               content:
 *                 type: object
 *                 description: TipTap ProseMirror JSON document
 *     responses:
 *       200:
 *         description: Note updated successfully
 *       400:
 *         description: Invalid update data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Note not found
 */
router.patch('/:id', notesController.updateNote);

// Delete a note
/**
 * @swagger
 * /notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Note not found
 */
router.delete('/:id', notesController.deleteNote);

export default router;