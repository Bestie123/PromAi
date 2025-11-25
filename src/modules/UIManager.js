// MODULE_UIManager_VER_1.0
const uiManager = {
    moduleId: 'MODULE_UIManager_VER_1.0',
    version: '1.0',
    dependencies: [],

    // FUNC_showModal_001
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'block';
    },

    // FUNC_hideModals_002
    hideModals() {
        document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    },

    // FUNC_showNotification_003
    showNotification(message, type) {
        const n = DOMFactory.create('div', this.moduleId, 'FUNC_showNotification_003', {
            className: `notification ${type}`,
            textContent: message,
            'data-component-id': 'COMP_Notification'
        });
        document.body.appendChild(n);
        setTimeout(() => n.remove(), 3000);
    },

    // FUNC_showAddNodeModal_007
    showAddNodeModal() {
        const select = document.getElementById('nodeParentSelect');
        select.innerHTML = '';
        const renderOptions = (nodes, prefix = '', path = []) => {
            nodes.forEach((node, idx) => {
                const nodePath = [...path, idx];
                const div = DOMFactory.create('div', this.moduleId, 'FUNC_showAddNodeModal_007', {
                    className: 'parent-select-item',
                    textContent: prefix + node.name,
                    'data-component-id': 'COMP_ParentSelectItem',
                    'data-node-id': JSON.stringify([...path, idx]),
                    onclick: () => {
                        document.querySelectorAll('.parent-select-item').forEach(d => d.classList.remove('selected'));
                        div.classList.add('selected');
                        div.dataset.path = JSON.stringify(nodePath);
                    }
                });
                select.appendChild(div);
                if (node.children) renderOptions(node.children, prefix + '  ', nodePath);
            });
        };
        renderOptions(window.techData.categories);
        this.showModal('nodeModal');
    },

    // FUNC_hideJSON_004
    hideJSON() {
        document.getElementById('jsonSection').classList.add('hidden');
    },

    // FUNC_showAddTechModal_008
    showAddTechModal(preselectedPath) {
        const select = document.getElementById('techParentSelect');
        select.innerHTML = '';
        let preselectedDiv = null;
        const renderOptions = (nodes, prefix = '', path = []) => {
            nodes.forEach((node, idx) => {
                const nodePath = [...path, idx];
                const div = DOMFactory.create('div', this.moduleId, 'FUNC_showAddTechModal_008', {
                    className: 'parent-select-item',
                    textContent: prefix + node.name,
                    'data-component-id': 'COMP_ParentSelectItem',
                    'data-node-id': JSON.stringify([...path, idx]),
                    'data-path': JSON.stringify(nodePath),
                    onclick: () => {
                        document.querySelectorAll('.parent-select-item').forEach(d => d.classList.remove('selected'));
                        div.classList.add('selected');
                    }
                });
                select.appendChild(div);
                if (preselectedPath && JSON.stringify(nodePath) === preselectedPath) {
                    preselectedDiv = div;
                }
                if (node.children) renderOptions(node.children, prefix + '  ', nodePath);
            });
        };
        renderOptions(window.techData.categories);
        if (preselectedDiv) {
            preselectedDiv.classList.add('selected');
        }
        this.showModal('techModal');
    }
};

window.uiManager = uiManager;
window.onclick = e => e.target.classList.contains('modal') && uiManager.hideModals();
