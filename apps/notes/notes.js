/**
 * Notes App JavaScript
 */

function initNotesApp(windowId) {
    // Warte kurz, damit das DOM vollständig geladen ist
    setTimeout(() => {
        window[`notesWindowId_${windowId}`] = windowId;
        window[`notesData_${windowId}`] = [];
        window[`currentNoteId_${windowId}`] = null;
        
        // Initialize notes storage from localStorage
        if (!window.allNotes) {
            try {
                const savedNotes = localStorage.getItem('desktop-notes');
                window.allNotes = savedNotes ? JSON.parse(savedNotes) : {};
            } catch (e) {
                console.warn('Error loading notes from localStorage:', e);
                window.allNotes = {};
            }
        }
        
        // Load saved notes into sidebar
        loadSavedNotes();
        
        const editor = document.getElementById('notes-editor');
        if (!editor) {
            console.warn('Notes editor not found!');
            return;
        }

        // Auto-save on input
        editor.addEventListener('input', () => {
            if (window.currentNoteId && window.allNotes) {
                const noteData = window.allNotes[window.currentNoteId];
                if (noteData) {
                    noteData.content = editor.innerHTML;
                    noteData.modified = new Date().toISOString();
                    
                    // Save to localStorage
                    try {
                        localStorage.setItem('desktop-notes', JSON.stringify(window.allNotes));
                        console.log('Note saved:', window.currentNoteId);
                    } catch (e) {
                        console.warn('Could not save notes to localStorage:', e);
                    }
                    
                    // Update sidebar preview
                    const noteItem = document.querySelector(`[data-note-id="${window.currentNoteId}"]`);
                    if (noteItem) {
                        const text = editor.innerText || '';
                        const title = text.split('\n')[0].substring(0, 20) || 'Neue Notiz';
                        const preview = text.substring(0, 50) + (text.length > 50 ? '...' : '');
                        const titleEl = noteItem.querySelector('.note-item-title');
                        const previewEl = noteItem.querySelector('.note-item-preview');
                        if (titleEl) titleEl.textContent = title;
                        if (previewEl) previewEl.textContent = preview || 'Leere Notiz';
                    }
                }
            }
        });
        
        // Auch bei blur speichern (falls input-Event nicht ausreicht)
        editor.addEventListener('blur', () => {
            if (window.currentNoteId && window.allNotes) {
                const noteData = window.allNotes[window.currentNoteId];
                if (noteData) {
                    noteData.content = editor.innerHTML;
                    noteData.modified = new Date().toISOString();
                    try {
                        localStorage.setItem('desktop-notes', JSON.stringify(window.allNotes));
                    } catch (e) {
                        console.warn('Could not save notes to localStorage:', e);
                    }
                }
            }
        });
    }, 150);
}

function loadSavedNotes() {
    const notesList = document.getElementById('notes-list');
    if (!notesList) {
        console.warn('Notes list element not found!');
        return;
    }
    
    if (!window.allNotes) {
        console.warn('window.allNotes is not initialized!');
        return;
    }
    
    const noteIds = Object.keys(window.allNotes).sort((a, b) => {
        const dateA = new Date(window.allNotes[a].modified || window.allNotes[a].created);
        const dateB = new Date(window.allNotes[b].modified || window.allNotes[b].created);
        return dateB - dateA;
    });
    
    if (noteIds.length === 0) {
        notesList.innerHTML = '<div class="notes-empty-sidebar">Keine Notizen</div>';
        return;
    }
    
    notesList.innerHTML = '';
    noteIds.forEach(noteId => {
        const noteData = window.allNotes[noteId];
        if (!noteData) return;
        
        const noteItem = document.createElement('div');
        noteItem.className = 'note-item';
        noteItem.dataset.noteId = noteId;
        
        const text = noteData.content ? noteData.content.replace(/<[^>]*>/g, '') : '';
        const title = text.split('\n')[0].substring(0, 20) || 'Neue Notiz';
        const preview = text.substring(0, 50) + (text.length > 50 ? '...' : '');
        
        noteItem.innerHTML = `
            <div class="note-item-title">${title}</div>
            <div class="note-item-preview">${preview || 'Leere Notiz'}</div>
        `;
        noteItem.onclick = () => loadNote(noteId);
        notesList.appendChild(noteItem);
    });
    
    console.log(`Loaded ${noteIds.length} notes from localStorage`);
}

function createNewNote() {
    const editor = document.getElementById('notes-editor');
    const notesList = document.getElementById('notes-list');
    
    if (!editor || !notesList) {
        console.warn('Editor or notes list not found!');
        return;
    }

    // Initialize allNotes if not exists
    if (!window.allNotes) {
        try {
            const savedNotes = localStorage.getItem('desktop-notes');
            window.allNotes = savedNotes ? JSON.parse(savedNotes) : {};
        } catch (e) {
            window.allNotes = {};
        }
    }

    // Remove active from all notes
    notesList.querySelectorAll('.note-item').forEach(n => n.classList.remove('active'));

    const now = new Date();
    const noteId = 'note-' + now.getTime();
    
    // Create note item in sidebar
    const emptyMsg = notesList.querySelector('.notes-empty-sidebar');
    if (emptyMsg) emptyMsg.remove();

    const noteItem = document.createElement('div');
    noteItem.className = 'note-item active';
    noteItem.dataset.noteId = noteId;
    noteItem.innerHTML = `
        <div class="note-item-title">Neue Notiz</div>
        <div class="note-item-preview">${now.toLocaleString('de-DE', { hour: '2-digit', minute: '2-digit' })}</div>
    `;
    noteItem.onclick = () => loadNote(noteId);
    notesList.insertBefore(noteItem, notesList.firstChild);

    // Clear editor
    editor.innerHTML = '';
    editor.focus();

    // Store note data
    const noteData = {
        id: noteId,
        created: now.toISOString(),
        modified: now.toISOString(),
        content: ''
    };
    
    window.allNotes[noteId] = noteData;
    window.currentNoteId = noteId;
    
    // Save to localStorage immediately
    try {
        localStorage.setItem('desktop-notes', JSON.stringify(window.allNotes));
        console.log('New note created and saved:', noteId);
    } catch (e) {
        console.error('Could not save notes to localStorage:', e);
        alert('Fehler beim Speichern der Notiz. Bitte versuche es erneut.');
    }
}

function loadNote(noteId) {
    // Initialize allNotes if not exists
    if (!window.allNotes) {
        try {
            const savedNotes = localStorage.getItem('desktop-notes');
            window.allNotes = savedNotes ? JSON.parse(savedNotes) : {};
        } catch (e) {
            window.allNotes = {};
        }
    }
    
    const notesList = document.querySelectorAll('.note-item');
    notesList.forEach(item => item.classList.remove('active'));
    const noteItem = document.querySelector(`[data-note-id="${noteId}"]`);
    if (noteItem) noteItem.classList.add('active');

    // Load note content
    if (window.allNotes && window.allNotes[noteId]) {
        const editor = document.getElementById('notes-editor');
        if (editor) {
            editor.innerHTML = window.allNotes[noteId].content || '';
            window.currentNoteId = noteId;
            console.log('Note loaded:', noteId);
        }
    } else {
        console.warn('Note not found:', noteId);
    }
}

function deleteCurrentNote() {
    if (!window.currentNoteId) {
        alert('Keine Notiz ausgewählt.');
        return;
    }

    if (!confirm('Möchtest du diese Notiz wirklich löschen?')) return;

    // Remove from data
    if (window.allNotes) {
        delete window.allNotes[window.currentNoteId];
        
        // Save to localStorage
        try {
            localStorage.setItem('desktop-notes', JSON.stringify(window.allNotes));
        } catch (e) {
            console.warn('Could not save notes to localStorage:', e);
        }
    }

    // Remove from sidebar
    const noteItem = document.querySelector(`[data-note-id="${window.currentNoteId}"]`);
    if (noteItem) {
        noteItem.remove();
    }

    // Clear editor
    const editor = document.getElementById('notes-editor');
    if (editor) {
        editor.innerHTML = '';
    }

    // Check if empty
    const notesList = document.getElementById('notes-list');
    if (notesList && notesList.querySelectorAll('.note-item').length === 0) {
        notesList.innerHTML = '<div class="notes-empty-sidebar">Keine Notizen</div>';
    }

    window.currentNoteId = null;
}

