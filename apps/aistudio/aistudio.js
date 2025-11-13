/**
 * AI Studio App JavaScript
 */

let selectedComponent = null;

function selectComponent(element) {
    // Entferne Auswahl von allen Komponenten
    document.querySelectorAll('.canvas-placeholder-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Markiere ausgewählte Komponente
    if (element) {
        element.classList.add('selected');
        selectedComponent = element;
        updatePropertiesPanel(element);
    }
}

function updatePropertiesPanel(element) {
    // Aktualisiere Properties-Panel basierend auf ausgewählter Komponente
    const label = element.querySelector('.placeholder-label');
    if (label) {
        console.log('Selected component:', label.textContent);
    }
}

// Drag & Drop für Palette-Items
document.addEventListener('DOMContentLoaded', function() {
    const paletteItems = document.querySelectorAll('.palette-item');
    const canvas = document.querySelector('.canvas-workspace');
    
    paletteItems.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.textContent);
        });
    });
    
    if (canvas) {
        canvas.addEventListener('dragover', function(e) {
            e.preventDefault();
        });
        
        canvas.addEventListener('drop', function(e) {
            e.preventDefault();
            const componentType = e.dataTransfer.getData('text/plain');
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Erstelle neue Komponente
            const newComponent = document.createElement('div');
            newComponent.className = 'canvas-placeholder-item';
            newComponent.style.position = 'absolute';
            newComponent.style.left = x + 'px';
            newComponent.style.top = y + 'px';
            newComponent.onclick = function() { selectComponent(this); };
            newComponent.innerHTML = `
                <div class="placeholder-label">${componentType}</div>
                <div class="placeholder-icon">${componentType.split(' ')[0]}</div>
            `;
            
            canvas.appendChild(newComponent);
        });
    }
    
    // Klick auf Canvas-Items
    document.querySelectorAll('.canvas-placeholder-item').forEach(item => {
        item.onclick = function() { selectComponent(this); };
    });
});

