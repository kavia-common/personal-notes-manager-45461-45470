const express = require('express');
const notesController = require('../controllers/notes');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Notes management
 */

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: List notes
 *     description: Returns a list of notes. Supports optional text search and pagination.
 *     tags: [Notes]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search text across title and content
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Max number of items to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Number of items to skip
 *     responses:
 *       200:
 *         description: A list of notes
 */
router.get('/', notesController.list.bind(notesController));

/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Create a note
 *     description: Create a new note with a non-empty title or content.
 *     tags: [Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Note created
 *       400:
 *         description: Validation error
 */
router.post('/', notesController.create.bind(notesController));

/**
 * @swagger
 * /notes/{id}:
 *   get:
 *     summary: Get a note
 *     description: Fetch a single note by id.
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note id
 *     responses:
 *       200:
 *         description: Note found
 *       404:
 *         description: Note not found
 */
router.get('/:id', notesController.getById.bind(notesController));

/**
 * @swagger
 * /notes/{id}:
 *   put:
 *     summary: Update a note
 *     description: Update a note's title and/or content by id.
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Note updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Note not found
 */
router.put('/:id', notesController.update.bind(notesController));

/**
 * @swagger
 * /notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     description: Delete a note by id.
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note id
 *     responses:
 *       204:
 *         description: Note deleted
 *       404:
 *         description: Note not found
 */
router.delete('/:id', notesController.remove.bind(notesController));

module.exports = router;
