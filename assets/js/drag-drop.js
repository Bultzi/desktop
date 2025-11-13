/**
 * Drag & Drop - Fenster verschieben
 */

function startDrag(event, windowId) {
    draggedWindow = document.getElementById(windowId);
    if (!draggedWindow) return;
    
    const rect = draggedWindow.getBoundingClientRect();
    dragOffset.x = event.clientX - rect.left;
    dragOffset.y = event.clientY - rect.top;
    
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
    
    bringToFront(draggedWindow);
    event.preventDefault();
}

function onDrag(event) {
    if (!draggedWindow) return;
    
    const desktop = document.getElementById('desktop');
    const desktopRect = desktop.getBoundingClientRect();
    
    let newX = event.clientX - dragOffset.x;
    let newY = event.clientY - dragOffset.y;
    
    // Begrenze auf Desktop-Bereich
    newX = Math.max(0, Math.min(newX, desktopRect.width - draggedWindow.offsetWidth));
    newY = Math.max(0, Math.min(newY, desktopRect.height - draggedWindow.offsetHeight));
    
    draggedWindow.style.left = newX + 'px';
    draggedWindow.style.top = newY + 'px';
}

function stopDrag() {
    draggedWindow = null;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
}

