/**
 * VSCode App JavaScript
 */

function toggleFolder(element) {
    const content = element.querySelector('.folder-content');
    if (content) {
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
    }
}

function openVSFile(filename) {
    // Aktiviere Tab für diese Datei
    const tabs = document.querySelectorAll('.vscode-tab');
    tabs.forEach(tab => {
        if (tab.textContent.trim() === filename) {
            tab.classList.add('active');
            switchVSTab(filename, tab);
        } else {
            tab.classList.remove('active');
        }
    });
}

function switchVSTab(filename, tabElement) {
    // Aktiviere alle Tabs
    const tabs = document.querySelectorAll('.vscode-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    if (tabElement) {
        tabElement.classList.add('active');
    }
    
    // Zeige entsprechenden Code-Inhalt
    const codeContents = document.querySelectorAll('.code-content');
    codeContents.forEach(content => {
        content.classList.add('hidden');
        content.classList.remove('active');
    });
    
    const targetContent = document.getElementById(`code-${filename.replace('.', '-')}`);
    if (targetContent) {
        targetContent.classList.remove('hidden');
        targetContent.classList.add('active');
    }
}

function insertCodeSnippet(type) {
    const snippets = {
        'api-template': 'const response = await fetch(apiEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });',
        'prompt-guide': '// Best Practices: Sei spezifisch, gib Kontext, definiere Format, setze Rollen',
        'libraries': '// Beliebte KI-Libraries: @google/generative-ai, openai, anthropic, langchain'
    };
    
    const snippet = snippets[type] || '';
    if (snippet) {
        alert(`Code-Snippet:\n\n${snippet}\n\n(Würde hier in den Editor eingefügt)`);
    }
}

