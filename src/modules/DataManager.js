// MODULE_DataManager_VER_1.0
const dataManager = {
    moduleId: 'MODULE_DataManager_VER_1.0',
    version: '1.0',
    dependencies: [],
    
    // FUNC_getNodeByPath_001
    getNodeByPath(path) {
        let currentNode = window.techData.categories;
        for (const index of path) {
            if (currentNode[index]) {
                currentNode = currentNode[index].children || [];
            } else return null;
        }
        return currentNode;
    },

    // FUNC_saveToLocalStorage_002
    saveToLocalStorage() {
        localStorage.setItem('techData', JSON.stringify(window.techData));
    },

    // FUNC_loadFromLocalStorage_003
    loadFromLocalStorage() {
        const saved = localStorage.getItem('techData');
        if (saved) {
            window.techData.categories = JSON.parse(saved).categories || [];
        }
    },

    // FUNC_addCategory_004
    addCategory() {
        const name = document.getElementById('newCategoryName').value.trim();
        if (name) {
            window.techData.categories.push({
                id: 'cat_' + Date.now(),
                name: name,
                type: 'category',
                children: []
            });
            this.saveToLocalStorage();
            window.uiManager.hideModals();
            window.accordionManager.renderAccordion();
            window.uiManager.showNotification('Category added!', 'success');
            if (window.authManager && window.authManager.scheduleAutoSave) {
                window.authManager.scheduleAutoSave();
            }
            document.getElementById('newCategoryName').value = '';
        }
    },

    // FUNC_addTechnology_005
    addTechnology() {
        const name = document.getElementById('newTechName').value.trim();
        const selected = document.querySelector('.parent-select-item.selected');
        if (name && selected) {
            const path = selected.dataset.path;
            const parent = path ? this.getNodeByPath(JSON.parse(path)) : window.techData.categories;
            if (parent) {
                const newTech = {
                    id: 'tech_' + Date.now(),
                    name: name,
                    type: 'technology',
                    completed: false
                };
                if (Array.isArray(parent)) {
                    parent.push(newTech);
                } else {
                    parent.children = parent.children || [];
                    parent.children.push(newTech);
                }
                this.saveToLocalStorage();
                window.uiManager.hideModals();
                window.accordionManager.renderAccordion();
                window.uiManager.showNotification('Технология добавлена!', 'success');
                if (window.authManager && window.authManager.scheduleAutoSave) {
                    window.authManager.scheduleAutoSave();
                }
                document.getElementById('newTechName').value = '';
            }
        }
    },

    // FUNC_toggleTech_006
    toggleTech(pathStr, index) {
        const parent = this.getNodeByPath(JSON.parse(pathStr));
        if (parent && parent[index]) {
            parent[index].completed = !parent[index].completed;
            this.saveToLocalStorage();
            window.accordionManager.renderAccordion();
            if (window.authManager && window.authManager.scheduleAutoSave) {
                window.authManager.scheduleAutoSave();
            }
        }
    },

    // FUNC_deleteNode_007
    deleteNode(pathStr, index) {
        if (confirm('Delete?')) {
            const parent = this.getNodeByPath(JSON.parse(pathStr));
            if (parent) {
                parent.splice(index, 1);
                this.saveToLocalStorage();
                window.accordionManager.renderAccordion();
                if (window.authManager && window.authManager.scheduleAutoSave) {
                    window.authManager.scheduleAutoSave();
                }
            }
        }
    },

    // FUNC_addNode_008
    addNode() {
        const name = document.getElementById('newNodeName').value.trim();
        const selected = document.querySelector('.parent-select-item.selected');
        if (name && selected) {
            const path = selected.dataset.path;
            const parent = path ? this.getNodeByPath(JSON.parse(path)) : window.techData.categories;
            if (parent) {
                const newNode = {
                    id: 'node_' + Date.now(),
                    name: name,
                    type: 'category',
                    children: []
                };
                if (Array.isArray(parent)) {
                    parent.push(newNode);
                } else {
                    parent.children = parent.children || [];
                    parent.children.push(newNode);
                }
                this.saveToLocalStorage();
                window.uiManager.hideModals();
                window.accordionManager.renderAccordion();
                window.uiManager.showNotification('Подкатегория добавлена!', 'success');
                if (window.authManager && window.authManager.scheduleAutoSave) {
                    window.authManager.scheduleAutoSave();
                }
                document.getElementById('newNodeName').value = '';
            }
        }
    },

    // FUNC_exportToJSON_009
    exportToJSON() {
        const json = JSON.stringify(window.techData, null, 2);
        document.getElementById('jsonOutput').value = json;
        document.getElementById('jsonSection').classList.remove('hidden');
    },

    // FUNC_importFromJSON_010
    importFromJSON() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = event => {
                try {
                    window.techData = JSON.parse(event.target.result);
                    this.saveToLocalStorage();
                    window.accordionManager.renderAccordion();
                    window.uiManager.showNotification('Импорт выполнен!', 'success');
                    if (window.authManager && window.authManager.scheduleAutoSave) {
                        window.authManager.scheduleAutoSave();
                    }
                } catch (err) {
                    window.uiManager.showNotification('Ошибка импорта!', 'error');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    },

    // FUNC_copyToClipboard_011
    copyToClipboard() {
        const jsonOutput = document.getElementById('jsonOutput');
        jsonOutput.select();
        document.execCommand('copy');
        window.uiManager.showNotification('JSON скопирован!', 'success');
    },

    // FUNC_importFromJSONText_012
    importFromJSONText() {
        const jsonText = document.getElementById('jsonOutput').value;
        try {
            window.techData = JSON.parse(jsonText);
            this.saveToLocalStorage();
            window.accordionManager.renderAccordion();
            window.uiManager.showNotification('Импорт выполнен!', 'success');
            if (window.authManager && window.authManager.scheduleAutoSave) {
                window.authManager.scheduleAutoSave();
            }
        } catch (err) {
            window.uiManager.showNotification('Ошибка импорта!', 'error');
        }
    },

    // FUNC_editNode_013
    editNode(pathStr, index) {
        const path = JSON.parse(pathStr);
        const node = this.getNodeAtIndex(path, index);
        if (!node) return;

        const newName = prompt('Введите новое название:', node.name);
        if (newName && newName.trim()) {
            node.name = newName.trim();
            this.saveToLocalStorage();
            window.accordionManager.renderAccordion();
            window.uiManager.showNotification('Категория обновлена!', 'success');
            if (window.authManager && window.authManager.scheduleAutoSave) {
                window.authManager.scheduleAutoSave();
            }
        }
    },

    // FUNC_editTechnology_014
    editTechnology(pathStr, index) {
        const path = JSON.parse(pathStr);
        const node = this.getNodeAtIndex(path, index);
        if (!node) return;

        const newName = prompt('Введите новое название технологии:', node.name);
        if (newName && newName.trim()) {
            node.name = newName.trim();
            this.saveToLocalStorage();
            window.accordionManager.renderAccordion();
            window.uiManager.showNotification('Технология обновлена!', 'success');
            if (window.authManager && window.authManager.scheduleAutoSave) {
                window.authManager.scheduleAutoSave();
            }
        }
    },

    // FUNC_deleteTechnology_015
    deleteTechnology(pathStr, index) {
        const path = JSON.parse(pathStr);
        if (confirm('Удалить эту технологию и все её задачи?')) {
            const parent = this.getNodeByPath(path);
            if (parent) {
                parent.splice(index, 1);
                this.saveToLocalStorage();
                window.accordionManager.renderAccordion();
                window.uiManager.showNotification('Технология удалена!', 'success');
                if (window.authManager && window.authManager.scheduleAutoSave) {
                    window.authManager.scheduleAutoSave();
                }
            }
        }
    },

    // FUNC_getNodeAtIndex_016
    getNodeAtIndex(path, index) {
        const parent = this.getNodeByPath(path);
        return parent ? parent[index] : null;
    },

    // FUNC_renderCurrentView_017
    renderCurrentView() {
        window.accordionManager.renderAccordion();
    }
};

window.dataManager = dataManager;
