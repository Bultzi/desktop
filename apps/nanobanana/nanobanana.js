/**
 * NanoBanana App JavaScript
 */

function initNanoBananaApp(windowId) {
    window[`gallery_${windowId}`] = [];
}

function generateImage() {
    const promptInput = document.getElementById('nano-prompt');
    const suffixInput = document.getElementById('nano-suffix');
    const gallery = document.getElementById('nano-gallery');
    
    if (!promptInput || !gallery) return;
    
    const prompt = promptInput.value.trim();
    if (!prompt) {
        alert('Bitte gib einen Prompt ein!');
        return;
    }
    
    const suffix = suffixInput ? suffixInput.value.trim() : '';
    const fullPrompt = suffix ? `${prompt}, ${suffix}` : prompt;
    
    // Entferne leere Nachricht
    const emptyMsg = gallery.querySelector('.gallery-empty');
    if (emptyMsg) emptyMsg.remove();
    
    // Erstelle Platzhalter-Bild
    const imageItem = document.createElement('div');
    imageItem.className = 'gallery-item loading';
    imageItem.innerHTML = `
        <div class="gallery-item-placeholder">
            <div class="loading-spinner"></div>
            <div class="loading-text">Generiere Bild...</div>
        </div>
        <div class="gallery-item-info">
            <div class="gallery-item-prompt">${fullPrompt.substring(0, 50)}${fullPrompt.length > 50 ? '...' : ''}</div>
        </div>
    `;
    gallery.insertBefore(imageItem, gallery.firstChild);
    
    // Simuliere Bildgenerierung
    setTimeout(() => {
        imageItem.classList.remove('loading');
        imageItem.innerHTML = `
            <div class="gallery-item-image" style="background: linear-gradient(135deg, #e8b4d0 0%, #b8d4e8 50%, #a8d5ba 100%); display: flex; align-items: center; justify-content: center; font-size: 48px; color: rgba(255,255,255,0.7);">
                🖼️
            </div>
            <div class="gallery-item-info">
                <div class="gallery-item-prompt">${fullPrompt.substring(0, 50)}${fullPrompt.length > 50 ? '...' : ''}</div>
                <div class="gallery-item-actions">
                    <button class="gallery-btn" onclick="downloadImage(this)">⬇️ Download</button>
                    <button class="gallery-btn" onclick="copyPrompt('${fullPrompt.replace(/'/g, "\\'")}')">📋 Prompt</button>
                </div>
            </div>
        `;
    }, 2000 + Math.random() * 2000);
    
    // Leere Eingabefelder
    promptInput.value = '';
}

function downloadImage(btn) {
    alert('Download-Funktion würde hier das Bild speichern.');
}

function copyPrompt(prompt) {
    const textarea = document.createElement('textarea');
    textarea.value = prompt;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        btn.textContent = '✓ Kopiert!';
        setTimeout(() => {
            btn.textContent = '📋 Prompt';
        }, 1500);
    } catch (err) {
        console.error('Copy failed:', err);
    }
    
    document.body.removeChild(textarea);
}

