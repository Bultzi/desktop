/**
 * NotebookLM – App Logik (ohne fremde Styles, token-basiert)
 */

function initNotebookLMApp(windowId) {
    // Scope alle Queries in dieses Fenster
    const root = document.getElementById(`content-${windowId}`);
    if (!root) return;

    const container = root.querySelector('.notebook-container');
    if (!container) return;

    // Elemente
    const tabs = Array.from(root.querySelectorAll('.nlm-tab'));
    const chatSection = root.querySelector('.nlm-chat');
    const notesSection = root.querySelector('.nlm-notes');
    const chatInputBar = root.querySelector('.nlm-chat-input');
    const chatInput = root.querySelector('.nlm-input');
    const sendBtn = root.querySelector('.nlm-btn-send');
    const addSourceBtn = root.querySelector('.nlm-btn-add-source');
    const sourcesList = root.querySelector('.nlm-sources-list');
    const addNoteFab = root.querySelector('.nlm-add-note');
    const modal = root.querySelector('.nlm-modal');
    const modalTitle = root.querySelector('.nlm-modal-input[data-field="title"]');
    const modalContent = root.querySelector('.nlm-modal-input[data-field="content"]');
    const modalCancel = root.querySelector('.nlm-modal [data-action="cancel"]');
    const modalConfirm = root.querySelector('.nlm-modal [data-action="confirm"]');

    // State pro Fenster
    let currentTab = 'chat';
    let selectedSource = null;
    let messageCount = 0;

    const sampleResponses = [
        'Basierend auf Ihren Dokumenten kann ich Ihnen sagen, dass die Marktanalyse ein Wachstum von 23% im Q4 zeigt. Diese Zahl wird durch mehrere Faktoren gestützt, die im Projektbericht detailliert erläutert werden.',
        'Ich sehe in Ihren Quellen, dass dies den ursprünglichen Prognosen entspricht. Die wichtigsten Treiber sind:\n• Erhöhte Nachfrage im B2B-Bereich\n• Erfolgreiche Produktlaunchs\n• Verbesserte Lieferketteneffizienz',
        'Laut Projektbericht wird dieses Wachstum voraussichtlich im nächsten Quartal anhalten, mit einer prognostizierten Rate von 18-22%.',
    ];

    // Helpers
    function switchTab(tab) {
        currentTab = tab;
        tabs.forEach(t => {
            if (t.dataset.tab === tab) t.classList.add('active');
            else t.classList.remove('active');
        });
        if (tab === 'chat') {
            chatSection.classList.remove('hidden');
            notesSection.classList.add('hidden');
            chatInputBar.classList.toggle('hidden', !selectedSource);
            addNoteFab.classList.add('hidden');
        } else {
            chatSection.classList.add('hidden');
            notesSection.classList.remove('hidden');
            chatInputBar.classList.add('hidden');
            addNoteFab.classList.remove('hidden');
        }
    }

    function clearIntroIfNeeded() {
        const intro = chatSection.querySelector('.nlm-intro');
        if (intro) intro.remove();
    }

    function selectSourceCard(card) {
        root.querySelectorAll('.nlm-source-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        selectedSource = card;
        if (currentTab === 'chat') {
            chatInputBar.classList.remove('hidden');
        }
        clearIntroIfNeeded();
    }

    function createMessageElement(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'nlm-message';

        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = `nlm-bubble ${sender === 'user' ? 'user' : 'ai'}`;

        const textDiv = document.createElement('div');
        textDiv.className = 'nlm-message-text';
        textDiv.textContent = text;

        const citationsDiv = document.createElement('div');
        citationsDiv.className = 'nlm-citations';

        bubbleDiv.appendChild(textDiv);
        bubbleDiv.appendChild(citationsDiv);
        messageDiv.appendChild(bubbleDiv);
        return messageDiv;
    }

    function scrollChatToBottom() {
        const content = root.querySelector('.nlm-content');
        if (content) content.scrollTop = content.scrollHeight;
    }

    function handleSend() {
        const value = (chatInput.value || '').trim();
        if (!value || !selectedSource) return;

        // Add user message
        const userMsg = createMessageElement(value, 'user');
        chatSection.appendChild(userMsg);
        chatInput.value = '';
        scrollChatToBottom();

        // Simulate AI response
        setTimeout(() => {
            const aiMsg = createMessageElement(sampleResponses[messageCount % sampleResponses.length], 'ai');
            chatSection.appendChild(aiMsg);

            const citations = aiMsg.querySelector('.nlm-citations');
            if (messageCount % 2 === 0) {
                citations.innerHTML = `<span class="nlm-citation-tag">[1] Marktanalyse 2024</span>`;
            } else {
                citations.innerHTML = `<span class="nlm-citation-tag">[2] Projektbericht Q4</span><span class="nlm-citation-tag">[1] Marktanalyse 2024</span>`;
            }

            messageCount++;
            scrollChatToBottom();
        }, 800);
    }

    function simulateUpload() {
        const titles = ['📄 Strategiedokument', '📈 Verkaufsdaten', '📋 Meetingprotokoll'];
        const randomTitle = titles[Math.floor(Math.random() * titles.length)];
        const card = document.createElement('div');
        card.className = 'nlm-source-card';
        card.tabIndex = 0;
        card.innerHTML = `<div class="nlm-source-title">${randomTitle}</div><div class="nlm-source-meta">Gerade eben hochgeladen</div>`;
        sourcesList.appendChild(card);
        selectSourceCard(card);
        card.scrollIntoView({ block: 'nearest' });
    }

    function openModal() {
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        modalTitle.value = '';
        modalContent.value = '';
        setTimeout(() => modalTitle.focus(), 0);
    }

    function closeModal() {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
    }

    function addNote() {
        const title = (modalTitle.value || '').trim();
        const content = (modalContent.value || '').trim();
        if (!title || !content) return;

        const noteCard = document.createElement('div');
        noteCard.className = 'nlm-note-card';
        noteCard.innerHTML = `<div class="nlm-note-title">${title}</div><div class="nlm-note-content">${content}</div>`;
        notesSection.appendChild(noteCard);
        closeModal();
        notesSection.scrollTop = notesSection.scrollHeight;
    }

    // Events
    tabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    root.addEventListener('click', (e) => {
        const card = e.target.closest('.nlm-source-card');
        if (card && root.contains(card)) {
            selectSourceCard(card);
        }
    });

    if (sendBtn) sendBtn.addEventListener('click', handleSend);
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }

    if (addSourceBtn) addSourceBtn.addEventListener('click', simulateUpload);

    if (addNoteFab) addNoteFab.addEventListener('click', openModal);
    if (modalCancel) modalCancel.addEventListener('click', closeModal);
    if (modalConfirm) modalConfirm.addEventListener('click', addNote);

    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Initial state
    switchTab('chat');
}

