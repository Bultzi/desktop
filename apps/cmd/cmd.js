/**
 * CMD App JavaScript
 */

function initCmdApp(windowId) {
    window[`cmdHistory_${windowId}`] = [];
    window[`currentDir_${windowId}`] = 'C:\\Users\\User';
}

function executeCmdCommand() {
    const input = document.getElementById('cmd-input');
    const output = document.getElementById('cmd-output');
    if (!input || !output) return;
    
    const command = input.value.trim();
    if (!command) return;
    
    const cmdLine = document.createElement('div');
    cmdLine.className = 'terminal-line';
    cmdLine.innerHTML = `<span class="terminal-prompt">C:\\Users\\User&gt;</span> ${command}`;
    output.insertBefore(cmdLine, output.querySelector('.terminal-input-line'));
    
    const response = getCmdResponse(command.toLowerCase());
    const responseLine = document.createElement('div');
    responseLine.className = 'terminal-line';
    responseLine.innerHTML = response;
    output.insertBefore(responseLine, output.querySelector('.terminal-input-line'));
    
    input.value = '';
    output.scrollTop = output.scrollHeight;
}

function getCmdResponse(command) {
    const responses = {
        'help': 'Verfügbare Befehle: help, dir, cls, echo, exit',
        'dir': 'Verzeichnis von C:\\Users\\User\\<br>01.01.2024  10:00    &lt;DIR&gt;          Documents<br>01.01.2024  10:00    &lt;DIR&gt;          Desktop',
        'cls': () => {
            const output = document.getElementById('cmd-output');
            const lines = output.querySelectorAll('.terminal-line');
            lines.forEach(line => {
                if (!line.querySelector('.terminal-input-line')) line.remove();
            });
            return '';
        },
        'echo': command.includes('echo ') ? command.substring(5) : 'Echo-Befehl erfordert Text.',
        'exit': 'Befehl nicht verfügbar in dieser Demo.'
    };
    
    if (command.startsWith('echo ')) {
        return command.substring(5);
    }
    
    if (command === 'cls') {
        setTimeout(() => {
            const output = document.getElementById('cmd-output');
            const lines = output.querySelectorAll('.terminal-line');
            lines.forEach(line => {
                if (!line.querySelector('.terminal-input-line')) line.remove();
            });
        }, 100);
        return '';
    }
    
    return responses[command] || `'${command}' ist nicht als interner oder externer Befehl, ausführbares Programm oder Batchdatei erkannt.`;
}

function showCmdHelp() {
    alert('CMD Hilfe:\n\nhelp - Zeigt verfügbare Befehle\n\ndir - Zeigt Verzeichnisinhalt\n\ncls - Löscht Bildschirm\n\necho [text] - Gibt Text aus');
}

