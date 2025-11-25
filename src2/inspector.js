// Standalone Inspector для Chrome Extension
const Inspector = {
    active: false,
    panel: null,
    overlay: null,
    pinned: false,
    pinnedElement: null,
    liveTraceEnabled: false,
    traceInterval: null,
    currentTab: 'element',
    dependencyGraph: null,

    init() {
        this.createPanel();
        this.createOverlay();
        this.attachKeyboardShortcut();
        console.log('[Inspector] Initialized. Press Ctrl+Shift+I to activate');
    },

    createPanel() {
        this.panel = document.createElement('div');
        this.panel.id = 'promai-inspector-panel';
        this.panel.style.cssText = `
            position: fixed; top: 10px; right: 10px; width: 320px; background: white;
            border: 2px solid #007bff; border-radius: 8px; padding: 15px; z-index: 999999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: none; font-family: monospace;
        `;
        this.panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <strong style="color: #000;">🔍 PromAi Inspector</strong>
                <div>
                    <button id="export-btn" style="background: #17a2b8; color: white; border: none; padding: 2px 8px; border-radius: 3px; cursor: pointer; margin-right: 5px;" title="Экспорт">💾</button>
                    <button id="trace-btn" style="background: #6c757d; color: white; border: none; padding: 2px 8px; border-radius: 3px; cursor: pointer; margin-right: 5px;" title="Трассировка">📊</button>
                    <button id="pin-btn" style="background: #6c757d; color: white; border: none; padding: 2px 8px; border-radius: 3px; cursor: pointer; margin-right: 5px;" title="Закрепить">📌</button>
                    <button id="close-btn" style="background: #dc3545; color: white; border: none; padding: 2px 8px; border-radius: 3px; cursor: pointer;">✕</button>
                </div>
            </div>
            <div id="inspector-tabs" style="display: flex; gap: 5px; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">
                <button id="tab-element" style="background: #007bff; color: white; border: none; padding: 4px 10px; border-radius: 3px; cursor: pointer; font-size: 11px;">Элемент</button>
                <button id="tab-trace" style="background: #6c757d; color: white; border: none; padding: 4px 10px; border-radius: 3px; cursor: pointer; font-size: 11px;">Трассировка</button>
                <button id="tab-graph" style="background: #6c757d; color: white; border: none; padding: 4px 10px; border-radius: 3px; cursor: pointer; font-size: 11px;">Граф</button>
            </div>
            <div id="inspector-content" style="font-size: 12px; line-height: 1.6; max-height: 400px; overflow-y: auto; color: #000;"></div>
        `;
        document.body.appendChild(this.panel);

        document.getElementById('export-btn').onclick = () => this.exportReport();
        document.getElementById('trace-btn').onclick = () => this.toggleLiveTrace();
        document.getElementById('pin-btn').onclick = () => this.togglePin();
        document.getElementById('close-btn').onclick = () => this.deactivate();
        document.getElementById('tab-element').onclick = () => this.switchTab('element');
        document.getElementById('tab-trace').onclick = () => this.switchTab('trace');
        document.getElementById('tab-graph').onclick = () => this.switchTab('graph');
    },

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.id = 'promai-inspector-overlay';
        this.overlay.style.cssText = `
            position: absolute; pointer-events: none; border: 2px solid #ff0000;
            background: rgba(255,0,0,0.1); z-index: 999998; display: none;
        `;
        document.body.appendChild(this.overlay);
    },

    attachKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F2') {
                e.preventDefault();
                this.active ? this.deactivate() : this.activate();
            }
        });
    },

    activate() {
        this.active = true;
        this.panel.style.display = 'block';
        document.addEventListener('mouseover', this.handleMouseOver.bind(this));
        document.addEventListener('click', this.handleClick.bind(this), true);
        console.log('[Inspector] Activated');
    },

    deactivate() {
        this.active = false;
        this.panel.style.display = 'none';
        this.overlay.style.display = 'none';
        this.pinned = false;
        console.log('[Inspector] Deactivated');
    },

    handleMouseOver(e) {
        if (!this.active || this.pinned) return;
        if (e.target.closest('#promai-inspector-panel')) return;

        const rect = e.target.getBoundingClientRect();
        this.overlay.style.cssText = `
            position: absolute; pointer-events: none; border: 2px solid #ff0000;
            background: rgba(255,0,0,0.1); z-index: 999998; display: block;
            left: ${rect.left + window.scrollX}px; top: ${rect.top + window.scrollY}px;
            width: ${rect.width}px; height: ${rect.height}px;
        `;

        this.showInfo(e.target);
    },

    handleClick(e) {
        if (!this.active) return;
        if (e.target.closest('#promai-inspector-panel')) return;
        e.preventDefault();
        e.stopPropagation();
        this.pinElement(e.target);
    },

    togglePin() {
        this.pinned = !this.pinned;
        const btn = document.getElementById('pin-btn');
        btn.style.background = this.pinned ? '#28a745' : '#6c757d';
        btn.textContent = this.pinned ? '📍' : '📌';
        if (!this.pinned) this.pinnedElement = null;
    },

    pinElement(element) {
        this.pinned = true;
        this.pinnedElement = element;
        const btn = document.getElementById('pin-btn');
        btn.style.background = '#28a745';
        btn.textContent = '📍';
        
        const rect = element.getBoundingClientRect();
        this.overlay.style.cssText = `
            position: absolute; pointer-events: none; border: 2px solid #28a745;
            background: rgba(40,167,69,0.1); z-index: 999998; display: block;
            left: ${rect.left + window.scrollX}px; top: ${rect.top + window.scrollY}px;
            width: ${rect.width}px; height: ${rect.height}px;
        `;
        
        this.showInfo(element);
    },

    showInfo(element) {
        const moduleId = element.getAttribute('data-module-id') || 'N/A';
        const componentId = element.getAttribute('data-component-id') || 'N/A';
        const functionId = element.getAttribute('data-function-id') || 'N/A';
        
        // Проверка FUNC_ID в runtime
        let funcInfo = '';
        if (element.onclick && element.onclick.__funcId) {
            funcInfo = `<div style="margin-bottom: 8px; color: #000;">
                <strong>Runtime FUNC_ID:</strong>
                <button onclick="Inspector.copyToClipboard('${element.onclick.__funcId}')" style="float: right; padding: 2px 6px; font-size: 0.8em; cursor: pointer;">📋</button>
                <br/><code style="background: #f0f0f0; padding: 2px 4px; border-radius: 3px; color: #000;">${element.onclick.__funcId}</code>
            </div>`;
        }
        
        const content = document.getElementById('inspector-content');
        content.innerHTML = `
            <div style="margin-bottom: 8px; color: #000;"><strong>Element:</strong> ${element.tagName.toLowerCase()}</div>
            <div style="margin-bottom: 8px; color: #000;">
                <strong>Module ID:</strong>
                <button onclick="Inspector.copyToClipboard('${moduleId}')" style="float: right; padding: 2px 6px; font-size: 0.8em; cursor: pointer;">📋</button>
                <br/><code style="background: #f0f0f0; padding: 2px 4px; border-radius: 3px; color: #000;">${moduleId}</code>
            </div>
            <div style="margin-bottom: 8px; color: #000;">
                <strong>Component ID:</strong>
                <button onclick="Inspector.copyToClipboard('${componentId}')" style="float: right; padding: 2px 6px; font-size: 0.8em; cursor: pointer;">📋</button>
                <br/><code style="background: #f0f0f0; padding: 2px 4px; border-radius: 3px; color: #000;">${componentId}</code>
            </div>
            <div style="margin-bottom: 8px; color: #000;">
                <strong>Function ID:</strong>
                <button onclick="Inspector.copyToClipboard('${functionId}')" style="float: right; padding: 2px 6px; font-size: 0.8em; cursor: pointer;">📋</button>
                <br/><code style="background: #f0f0f0; padding: 2px 4px; border-radius: 3px; color: #000;">${functionId}</code>
            </div>
            ${funcInfo}
            ${element.id ? `<div style="margin-bottom: 8px; color: #000;"><strong>ID:</strong> ${element.id}</div>` : ''}
            ${element.className ? `<div style="margin-bottom: 8px; color: #000;"><strong>Class:</strong> ${element.className}</div>` : ''}
        `;
    },

    copyToClipboard(text) {
        if (text === 'N/A') return;
        navigator.clipboard.writeText(text).then(() => {
            const notification = document.createElement('div');
            notification.textContent = '✅ Скопировано!';
            notification.style.cssText = `
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: #28a745; color: white; padding: 10px 20px; border-radius: 5px;
                z-index: 1000000; font-weight: bold;
            `;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 1000);
        });
    },

    toggleLiveTrace() {
        if (!window.FunctionTracer) {
            alert('❌ FunctionTracer не загружен');
            return;
        }
        
        this.liveTraceEnabled = !this.liveTraceEnabled;
        const btn = document.getElementById('trace-btn');
        
        if (this.liveTraceEnabled) {
            window.FunctionTracer.enable();
            btn.style.background = '#28a745';
            btn.textContent = '🟢';
            this.traceInterval = setInterval(() => this.updateTraceView(), 1000);
            this.switchTab('trace');
        } else {
            window.FunctionTracer.disable();
            btn.style.background = '#6c757d';
            btn.textContent = '📊';
            if (this.traceInterval) clearInterval(this.traceInterval);
        }
    },

    switchTab(tab) {
        this.currentTab = tab;
        document.getElementById('tab-element').style.background = tab === 'element' ? '#007bff' : '#6c757d';
        document.getElementById('tab-trace').style.background = tab === 'trace' ? '#007bff' : '#6c757d';
        document.getElementById('tab-graph').style.background = tab === 'graph' ? '#007bff' : '#6c757d';
        
        if (tab === 'element') {
            this.showInfo(this.pinnedElement || document.body);
        } else if (tab === 'trace') {
            this.updateTraceView();
        } else if (tab === 'graph') {
            this.updateGraphView();
        }
    },

    updateTraceView() {
        const content = document.getElementById('inspector-content');
        
        if (!window.FunctionTracer) {
            content.innerHTML = '<div style="color: #dc3545; text-align: center; padding: 20px;">❌ FunctionTracer не загружен</div>';
            return;
        }
        
        const trace = window.FunctionTracer.getTrace(20);
        const stats = window.FunctionTracer.getStats();
        
        if (trace.length === 0) {
            content.innerHTML = '<div style="color: #6c757d; text-align: center; padding: 20px;">Нет данных трассировки</div>';
            return;
        }
        
        let html = `
            <div style="margin-bottom: 10px; padding: 8px; background: #f8f9fa; border-radius: 4px; color: #000;">
                <strong>Статистика:</strong><br/>
                Всего вызовов: ${stats.totalCalls}<br/>
                Ср. время: ${stats.avgDuration.toFixed(2)}ms<br/>
                <button onclick="FunctionTracer.clear(); Inspector.updateTraceView()" style="margin-top: 5px; padding: 2px 8px; font-size: 0.9em; cursor: pointer; color: #000;">🗑️ Очистить</button>
            </div>
            <div style="font-size: 10px; color: #000;">
        `;
        
        trace.reverse().forEach(entry => {
            const color = entry.duration > 10 ? '#dc3545' : entry.duration > 5 ? '#ffc107' : '#28a745';
            html += `
                <div style="margin-bottom: 5px; padding: 5px; background: #f8f9fa; border-left: 3px solid ${color}; border-radius: 3px;">
                    <div style="font-weight: bold; color: #212529;">${entry.funcId}</div>
                    <div style="color: ${color}; font-weight: bold;">${entry.duration.toFixed(2)}ms</div>
                </div>
            `;
        });
        
        html += '</div>';
        content.innerHTML = html;
    },

    updateGraphView() {
        const content = document.getElementById('inspector-content');
        
        // Собрать модули из DOM
        const modules = new Set();
        document.querySelectorAll('[data-module-id]').forEach(el => {
            const moduleId = el.getAttribute('data-module-id');
            if (moduleId && moduleId !== 'N/A') modules.add(moduleId);
        });
        
        const moduleArray = Array.from(modules);
        
        let html = `
            <div style="margin-bottom: 10px; padding: 8px; background: #f8f9fa; border-radius: 4px; color: #000;">
                <strong>Статистика:</strong><br/>
                Модулей: <strong>${moduleArray.length}</strong><br/>
                Элементов: <strong>${document.querySelectorAll('[data-component-id]').length}</strong><br/>
            </div>
        `;
        
        if (moduleArray.length === 0) {
            html += '<div style="color: #6c757d; text-align: center; padding: 20px;">Модули не найдены<br/><small>Используйте кнопку "Make Site PromAi-Ready"</small></div>';
        } else {
            html += '<div style="font-size: 11px; color: #000;">';
            html += '<strong>Найденные модули:</strong><br/>';
            moduleArray.forEach(moduleId => {
                const count = document.querySelectorAll(`[data-module-id="${moduleId}"]`).length;
                html += `<div style="margin: 5px 0; padding: 5px; background: #f8f9fa; border-radius: 3px; color: #000;">${moduleId}<br/><small style="color: #6c757d;">${count} элементов</small></div>`;
            });
            html += '</div>';
        }
        
        content.innerHTML = html;
    },

    loadDependencyGraph() {
        // Попытка загрузить dependencies_map.json
        fetch('./dependencies_map.json')
            .then(res => res.json())
            .then(data => {
                this.dependencyGraph = data;
                if (this.currentTab === 'graph') this.updateGraphView();
            })
            .catch(() => {
                // Создать граф из DOM
                this.dependencyGraph = this.buildGraphFromDOM();
                if (this.currentTab === 'graph') this.updateGraphView();
            });
    },

    buildGraphFromDOM() {
        const modules = new Set();
        const edges = [];
        
        document.querySelectorAll('[data-module-id]').forEach(el => {
            const moduleId = el.getAttribute('data-module-id');
            if (moduleId && moduleId !== 'N/A') modules.add(moduleId);
        });
        
        return {
            nodes: Array.from(modules).map(id => ({ id, type: 'module' })),
            edges: edges
        };
    },

    calculateGraphStats() {
        if (!this.dependencyGraph) return { totalModules: 0, totalDependencies: 0 };
        return {
            totalModules: this.dependencyGraph.nodes ? this.dependencyGraph.nodes.length : 0,
            totalDependencies: this.dependencyGraph.edges ? this.dependencyGraph.edges.length : 0
        };
    },

    checkCycles() {
        if (!this.dependencyGraph || !this.dependencyGraph.edges) return [];
        
        const graph = {};
        this.dependencyGraph.edges.forEach(edge => {
            if (!graph[edge.from]) graph[edge.from] = [];
            graph[edge.from].push(edge.to);
        });
        
        const cycles = [];
        const visited = new Set();
        const stack = new Set();
        
        const dfs = (node, path) => {
            if (stack.has(node)) {
                const cycleStart = path.indexOf(node);
                if (cycleStart !== -1) {
                    cycles.push(path.slice(cycleStart).concat(node));
                }
                return;
            }
            if (visited.has(node)) return;
            
            visited.add(node);
            stack.add(node);
            
            if (graph[node]) {
                graph[node].forEach(neighbor => {
                    dfs(neighbor, path.concat(node));
                });
            }
            
            stack.delete(node);
        };
        
        Object.keys(graph).forEach(node => dfs(node, []));
        return cycles;
    },

    exportReport() {
        const report = {
            projectId: 'PromAi_Inspector_Report',
            timestamp: new Date().toISOString(),
            url: window.location.href,
            modules: [],
            elements: document.querySelectorAll('[data-component-id]').length,
            functions: 0,
            trace: window.FunctionTracer ? window.FunctionTracer.getStats() : null,
            graph: this.dependencyGraph
        };
        
        // Собрать модули
        const modules = new Set();
        document.querySelectorAll('[data-module-id]').forEach(el => {
            const moduleId = el.getAttribute('data-module-id');
            if (moduleId && moduleId !== 'N/A') modules.add(moduleId);
        });
        report.modules = Array.from(modules);
        
        // Подсчитать функции
        document.querySelectorAll('[data-function-id]').forEach(el => {
            const funcId = el.getAttribute('data-function-id');
            if (funcId && funcId !== 'N/A') report.functions++;
        });
        
        const format = prompt('Выберите формат:\n1 - JSON\n2 - Markdown\n3 - HTML', '1');
        
        let content, filename, type;
        
        if (format === '2') {
            content = this.generateMarkdownReport(report);
            filename = 'inspector-report.md';
            type = 'text/markdown';
        } else if (format === '3') {
            content = this.generateHTMLReport(report);
            filename = 'inspector-report.html';
            type = 'text/html';
        } else {
            content = JSON.stringify(report, null, 2);
            filename = 'inspector-report.json';
            type = 'application/json';
        }
        
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        
        alert('✅ Отчёт экспортирован!');
    },

    generateMarkdownReport(report) {
        let md = `# Inspector Report\n\n`;
        md += `**Project:** ${report.projectId}\n`;
        md += `**URL:** ${report.url}\n`;
        md += `**Date:** ${report.timestamp}\n\n`;
        md += `## Statistics\n\n`;
        md += `- Modules: ${report.modules.length}\n`;
        md += `- Elements: ${report.elements}\n`;
        md += `- Functions: ${report.functions}\n\n`;
        
        if (report.modules.length > 0) {
            md += `## Modules\n\n`;
            report.modules.forEach(m => {
                md += `- ${m}\n`;
            });
            md += `\n`;
        }
        
        if (report.trace) {
            md += `## Trace Stats\n\n`;
            md += `- Total Calls: ${report.trace.totalCalls}\n`;
            md += `- Avg Duration: ${report.trace.avgDuration.toFixed(2)}ms\n\n`;
        }
        
        if (report.graph && report.graph.nodes) {
            md += `## Dependency Graph\n\n`;
            md += `\`\`\`mermaid\n`;
            md += this.generateMermaidDiagram(report.graph);
            md += `\`\`\`\n`;
        }
        
        return md;
    },

    generateHTMLReport(report) {
        let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Inspector Report</title>`;
        html += `<style>body{font-family:Arial,sans-serif;padding:20px;max-width:1200px;margin:0 auto}`;
        html += `h1{color:#007bff;border-bottom:2px solid #007bff;padding-bottom:10px}`;
        html += `h2{color:#6c757d;margin-top:30px}.stat{background:#f8f9fa;padding:15px;border-radius:5px;margin:10px 0}`;
        html += `.module{background:#e9ecef;padding:8px;margin:5px 0;border-radius:3px;font-family:monospace}</style></head><body>`;
        html += `<h1>🔍 Inspector Report</h1>`;
        html += `<div class="stat"><strong>Project:</strong> ${report.projectId}</div>`;
        html += `<div class="stat"><strong>URL:</strong> ${report.url}</div>`;
        html += `<div class="stat"><strong>Date:</strong> ${report.timestamp}</div>`;
        html += `<h2>Statistics</h2>`;
        html += `<div class="stat">Modules: <strong>${report.modules.length}</strong></div>`;
        html += `<div class="stat">Elements: <strong>${report.elements}</strong></div>`;
        html += `<div class="stat">Functions: <strong>${report.functions}</strong></div>`;
        
        if (report.modules.length > 0) {
            html += `<h2>Modules</h2>`;
            report.modules.forEach(m => {
                html += `<div class="module">${m}</div>`;
            });
        }
        
        if (report.trace) {
            html += `<h2>Trace Statistics</h2>`;
            html += `<div class="stat">Total Calls: <strong>${report.trace.totalCalls}</strong></div>`;
            html += `<div class="stat">Avg Duration: <strong>${report.trace.avgDuration.toFixed(2)}ms</strong></div>`;
        }
        
        html += `</body></html>`;
        return html;
    },

    generateMermaidDiagram(graph) {
        let mermaid = 'graph TD\n';
        
        if (graph.edges && graph.edges.length > 0) {
            graph.edges.forEach(edge => {
                const from = edge.from.replace(/[^a-zA-Z0-9]/g, '_');
                const to = edge.to.replace(/[^a-zA-Z0-9]/g, '_');
                mermaid += `    ${from}[${edge.from}] --> ${to}[${edge.to}]\n`;
            });
        } else if (graph.nodes) {
            graph.nodes.forEach(node => {
                const id = node.id.replace(/[^a-zA-Z0-9]/g, '_');
                mermaid += `    ${id}[${node.id}]\n`;
            });
        }
        
        return mermaid;
    }
};

// Автоинициализация
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Inspector.init());
} else {
    Inspector.init();
}

window.Inspector = Inspector;
