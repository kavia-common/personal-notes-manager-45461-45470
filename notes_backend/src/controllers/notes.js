const notesService = require('../services/notes');

/**
 * Controller for Notes resources
 * Handles HTTP requests and maps them to service operations.
 */
class NotesController {
  /**
   * PUBLIC_INTERFACE
   * List all notes with optional query filters.
   * Supports pagination via limit and offset query params.
   */
  async list(req, res) {
    try {
      const { q, limit, offset } = req.query;
      const result = notesService.list({ q, limit, offset });
      return res.status(200).json({
        status: 'success',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (err) {
      return res.status(500).json({ status: 'error', message: 'Failed to list notes' });
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Create a new note.
   * Expects JSON body with at least a non-empty title or content.
   */
  async create(req, res) {
    try {
      const { title, content } = req.body || {};
      // Basic validation
      if ((!title || typeof title !== 'string' || title.trim().length === 0) &&
          (!content || typeof content !== 'string' || content.trim().length === 0)) {
        return res.status(400).json({
          status: 'fail',
          message: 'Validation error: provide a non-empty "title" or "content".',
        });
      }

      const note = notesService.create({
        title: typeof title === 'string' ? title.trim() : '',
        content: typeof content === 'string' ? content.trim() : '',
      });

      return res.status(201).json({ status: 'success', data: note });
    } catch (err) {
      return res.status(500).json({ status: 'error', message: 'Failed to create note' });
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Get a note by its id.
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const note = notesService.getById(id);
      if (!note) {
        return res.status(404).json({ status: 'fail', message: 'Note not found' });
      }
      return res.status(200).json({ status: 'success', data: note });
    } catch (err) {
      return res.status(500).json({ status: 'error', message: 'Failed to fetch note' });
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Update a note by its id (full or partial update).
   * Accepts title and/or content in JSON body.
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, content } = req.body || {};

      if ((title !== undefined && typeof title !== 'string') ||
          (content !== undefined && typeof content !== 'string')) {
        return res.status(400).json({
          status: 'fail',
          message: 'Validation error: "title" and "content" must be strings if provided.',
        });
      }

      const updated = notesService.update(id, {
        title: typeof title === 'string' ? title.trim() : undefined,
        content: typeof content === 'string' ? content.trim() : undefined,
      });

      if (!updated) {
        return res.status(404).json({ status: 'fail', message: 'Note not found' });
      }

      return res.status(200).json({ status: 'success', data: updated });
    } catch (err) {
      return res.status(500).json({ status: 'error', message: 'Failed to update note' });
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Delete a note by its id.
   */
  async remove(req, res) {
    try {
      const { id } = req.params;
      const removed = notesService.remove(id);
      if (!removed) {
        return res.status(404).json({ status: 'fail', message: 'Note not found' });
      }
      return res.status(204).send();
    } catch (err) {
      return res.status(500).json({ status: 'error', message: 'Failed to delete note' });
    }
  }
}

module.exports = new NotesController();
