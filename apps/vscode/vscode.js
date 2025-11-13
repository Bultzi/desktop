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
        'api-template': `const response = await fetch(apiEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
});`,
        'prompt-guide': `// Prompt Engineering Best Practices:
// 1. Sei spezifisch und klar
// 2. Gib ausreichend Kontext
// 3. Definiere das gewünschte Format
// 4. Setze Rollen und Perspektiven`,
        'libraries': `// Beliebte KI-Libraries:
// - @google/generative-ai (Gemini)
// - openai (GPT, DALL-E)
// - anthropic (Claude)
// - langchain (Multi-Provider)`
    };
    
    const snippet = snippets[type] || '';
    if (snippet) {
        // Füge Code zum aktiven Editor hinzu
        const activeContent = document.querySelector('.code-content.active');
        if (activeContent) {
            const lines = snippet.split('\n');
            lines.forEach(line => {
                const codeLine = document.createElement('div');
                codeLine.className = 'code-line';
                codeLine.innerHTML = formatCodeLine(line);
                activeContent.appendChild(codeLine);
            });
            
            // Scroll zum Ende
            activeContent.scrollTop = activeContent.scrollHeight;
            
            // Zeige Feedback im Terminal
            addTerminalOutput(`✓ Code-Snippet "${type}" wurde eingefügt`, 'success');
        }
    }
}

function formatCodeLine(line) {
    // Einfache Syntax-Hervorhebung
    return line
        .replace(/(\/\/.*)/g, '<span class="code-comment">$1</span>')
        .replace(/(const|let|var|function|async|await|import|from|return|if|else|for|while)/g, '<span class="code-keyword">$1</span>')
        .replace(/(['"`])(.*?)\1/g, '<span class="code-string">$1$2$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="code-number">$1</span>');
}

// Terminal-Funktionalität
function initTerminal() {
    const terminalInput = document.getElementById('terminal-input');
    if (terminalInput) {
        terminalInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const command = this.value.trim();
                if (command) {
                    executeTerminalCommand(command);
                    this.value = '';
                }
            }
        });
    }
}

function executeTerminalCommand(command) {
    const output = document.getElementById('terminal-output');
    if (!output) return;
    
    // Zeige den Befehl
    addTerminalOutput(`$ ${command}`, 'prompt');
    
    // Simuliere verschiedene Befehle
    setTimeout(() => {
        if (command.startsWith('npm install')) {
            const packageName = command.replace('npm install', '').trim();
            addTerminalOutput(`✓ Package "${packageName}" installed successfully`, 'success');
        } else if (command.startsWith('node')) {
            const filename = command.replace('node', '').trim();
            addTerminalOutput(`🤖 AI Response: Hallo! Ich bin bereit zu helfen.`, 'info');
        } else if (command === 'help' || command === '--help') {
            addTerminalOutput('Verfügbare Befehle:', 'info');
            addTerminalOutput('  npm install <package> - Installiert ein Package', 'info');
            addTerminalOutput('  node <file> - Führt eine JavaScript-Datei aus', 'info');
            addTerminalOutput('  help - Zeigt diese Hilfe', 'info');
        } else if (command === 'clear') {
            output.innerHTML = '';
        } else {
            addTerminalOutput(`Command not found: ${command}`, 'error');
        }
    }, 100);
}

function addTerminalOutput(text, type = 'info') {
    const output = document.getElementById('terminal-output');
    if (!output) return;
    
    const line = document.createElement('div');
    line.className = 'terminal-line-vs';
    
    if (type === 'prompt') {
        line.innerHTML = `<span class="prompt">${text}</span>`;
    } else if (type === 'success') {
        line.innerHTML = `<span class="success">${text}</span>`;
    } else if (type === 'error') {
        line.innerHTML = `<span class="error">${text}</span>`;
    } else {
        line.innerHTML = `<span class="info">${text}</span>`;
    }
    
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
}

// Initialisiere Terminal beim Laden
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTerminal);
} else {
    initTerminal();
}

