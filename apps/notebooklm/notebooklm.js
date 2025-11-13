/**
 * NotebookLM App JavaScript
 */

if (!window.allProjects) {
    window.allProjects = {
        'demo-1': {
            id: 'demo-1',
            name: 'Demo Projekt',
            icon: '📓',
            sources: ['Quelle 1', 'Quelle 2', 'Quelle 3'],
            created: new Date().toISOString()
        }
    };
}

function showNewProjectModal() {
    const name = prompt('Projektname:');
    if (name) {
        createProject(name);
    }
}

function createProject(name) {
    const grid = document.querySelector('#projects-grid');
    if (!grid) return;
    
    const projectId = 'project-' + Date.now();
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    projectCard.onclick = () => openProjectDetails(projectId, name, '📓');
    projectCard.innerHTML = `
        <h3>${name}</h3>
        <p>Neues Projekt</p>
        <div class="project-meta">
            <span class="project-sources">0 Quellen</span>
            <span class="project-date">Gerade eben</span>
        </div>
    `;
    grid.appendChild(projectCard);
    
    window.allProjects[projectId] = {
        id: projectId,
        name: name,
        icon: '📓',
        sources: [],
        created: new Date().toISOString()
    };
}

function openProjectDetails(projectId, projectName, projectIcon) {
    alert(`Projekt öffnen: ${projectName}\n\n(In vollständiger Version würde hier die Projekt-Detailansicht geöffnet)`);
}

