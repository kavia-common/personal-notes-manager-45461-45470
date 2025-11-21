const fs = require('fs');
const path = require('path');

/**
 * Simple NotesService using in-memory storage with optional file persistence.
 * Not intended for production use.
 */
class NotesService {
  constructor() {
    this.notes = [];
    this.dataFile = path.join(__dirname, '../../data/notes.json');
    this._loadFromDisk();
  }

  _ensureDataDir() {
    const dir = path.dirname(this.dataFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  _loadFromDisk() {
    try {
      if (fs.existsSync(this.dataFile)) {
        const raw = fs.readFileSync(this.dataFile, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.notes = parsed;
        }
      }
    } catch (e) {
      // Fallback to empty in case of parse error
      this.notes = [];
    }
  }

  _saveToDisk() {
    try {
      this._ensureDataDir();
      fs.writeFileSync(this.dataFile, JSON.stringify(this.notes, null, 2));
    } catch (e) {
      // swallow errors to keep API responsive, but log for debugging
      console.error('Failed to persist notes:', e.message);
    }
  }

  _generateId() {
    // Simple unique id: timestamp + counter
    const ts = Date.now().toString(36);
    const rand = Math.random().toString(36).substring(2, 8);
    return `${ts}-${rand}`;
  }

  /**
   * PUBLIC_INTERFACE
   * List notes with optional text query and pagination.
   */
  list({ q, limit, offset } = {}) {
    let data = this.notes.slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    if (q && typeof q === 'string' && q.trim().length > 0) {
      const needle = q.toLowerCase();
      data = data.filter(
        n =>
          (n.title && n.title.toLowerCase().includes(needle)) ||
          (n.content && n.content.toLowerCase().includes(needle))
      );
    }

    let lim = Number.isFinite(Number(limit)) ? Math.max(0, parseInt(limit, 10)) : undefined;
    let off = Number.isFinite(Number(offset)) ? Math.max(0, parseInt(offset, 10)) : 0;

    const total = data.length;
    if (lim !== undefined) {
      data = data.slice(off, off + lim);
    } else if (off > 0) {
      data = data.slice(off);
    }

    return {
      data,
      pagination: {
        total,
        limit: lim ?? null,
        offset: off || 0,
      },
    };
  }

  /**
   * PUBLIC_INTERFACE
   * Create a new note.
   */
  create({ title = '', content = '' }) {
    const now = new Date().toISOString();
    const note = {
      id: this._generateId(),
      title,
      content,
      createdAt: now,
      updatedAt: now,
    };
    this.notes.push(note);
    this._saveToDisk();
    return note;
  }

  /**
   * PUBLIC_INTERFACE
   * Get a note by id.
   */
  getById(id) {
    return this.notes.find(n => n.id === id);
  }

  /**
   * PUBLIC_INTERFACE
   * Update a note by id.
   */
  update(id, { title, content }) {
    const idx = this.notes.findIndex(n => n.id === id);
    if (idx === -1) return null;
    const current = this.notes[idx];
    const updated = {
      ...current,
      title: title !== undefined ? title : current.title,
      content: content !== undefined ? content : current.content,
      updatedAt: new Date().toISOString(),
    };
    this.notes[idx] = updated;
    this._saveToDisk();
    return updated;
  }

  /**
   * PUBLIC_INTERFACE
   * Remove a note by id.
   */
  remove(id) {
    const idx = this.notes.findIndex(n => n.id === id);
    if (idx === -1) return false;
    this.notes.splice(idx, 1);
    this._saveToDisk();
    return true;
  }
}

module.exports = new NotesService();
