// MODULE_AccordionManager_VER_1.0
const accordionManager = {
    moduleId: 'MODULE_AccordionManager_VER_1.0',
    version: '1.0',
    dependencies: ['MODULE_DataManager_VER_1.0', 'MODULE_DOMFactory_VER_1.0'],
    expandedState: {},
    checklistExpandedState: {},

    // FUNC_init_001
    init() {
        this.accordionContainer = document.getElementById('accordion') || document.getElementById('accordionContainer');
        this.expandedState = JSON.parse(localStorage.getItem('accordionExpandedState')) || {};
        this.checklistExpandedState = JSON.parse(localStorage.getItem('checklistExpandedState')) || {};
        this.renderAccordion();
    },

    // FUNC_renderAccordion_002
    renderAccordion() {
        if (!this.accordionContainer) {
            this.accordionContainer = document.getElementById('accordion') || document.getElementById('accordionContainer');
        }
        if (!this.accordionContainer) {
            console.error('Accordion container not found');
            return;
        }
        
        this.accordionContainer.innerHTML = '';
        
        if (window.techData.categories.length === 0) {
            this.accordionContainer.innerHTML = '<p style="text-align: center; color: #6c757d;">Нет данных. Добавьте первую категорию!</p>';
            return;
        }

        this.buildAccordion(window.techData.categories, this.accordionContainer, []);
        
        localStorage.setItem('accordionExpandedState', JSON.stringify(this.expandedState));
        localStorage.setItem('checklistExpandedState', JSON.stringify(this.checklistExpandedState));
    },

    // FUNC_render_003 (legacy compatibility)
    render() {
        this.renderAccordion();
    },

    // FUNC_buildAccordion_004
    buildAccordion(nodes, parentElement, path) {
        nodes.forEach((node, index) => {
            const currentPath = [...path, index];
            const pathKey = currentPath.join('-');
            
            if (this.expandedState[pathKey] === undefined) {
                this.expandedState[pathKey] = path.length === 0;
            }
            
            const item = domFactory.create({
                moduleId: this.moduleId,
                functionId: 'FUNC_buildAccordion_004',
                componentId: 'COMP_AccordionItem',
                className: 'accordion-item'
            });
            
            const nodeProgress = this.calculateNodeProgress(node);
            const progress = nodeProgress.progress;
            const hasChecklistItems = nodeProgress.hasChecklistItems;
            
            let statusText = '';
            let statusClass = '';
            
            if (node.type === 'technology') {
                if (!hasChecklistItems) {
                    statusText = node.completed ? '✅ Изучено' : '📝 В планах';
                    statusClass = node.completed ? 'status-completed' : 'status-planned';
                } else {
                    if (progress === 0) {
                        statusText = '📝 В планах';
                        statusClass = 'status-planned';
                    } else if (progress === 100) {
                        statusText = '✅ Изучено';
                        statusClass = 'status-completed';
                    } else {
                        statusText = '🚧 В процессе';
                        statusClass = 'status-in-progress';
                    }
                }
            } else {
                if (progress === 0) {
                    statusText = '📝 Не начато';
                    statusClass = 'status-planned';
                } else if (progress === 100) {
                    statusText = '✅ Завершено';
                    statusClass = 'status-completed';
                } else {
                    statusText = '🚧 В процессе';
                    statusClass = 'status-in-progress';
                }
            }

            const header = document.createElement('div');
            header.className = `accordion-header ${node.type === 'technology' ? 'technology' : 'category'}`;
            header.setAttribute('data-module-id', this.moduleId);
            header.setAttribute('data-component-id', 'COMP_AccordionHeader');
            header.setAttribute('data-node-id', pathKey);
            
            header.onclick = (e) => {
                if (!e.target.closest('.accordion-actions') && !e.target.closest('.accordion-toggle') && 
                    !e.target.closest('.technology-checkbox')) {
                    this.toggleItem(pathKey);
                }
            };
            
            const title = document.createElement('div');
            title.className = 'accordion-title';
            title.setAttribute('data-component-id', 'COMP_AccordionTitle');
            
            const icon = document.createElement('span');
            icon.className = 'accordion-icon';
            icon.setAttribute('data-component-id', 'COMP_Icon');
            icon.textContent = node.type === 'technology' ? '⚙️' : '📁';
            title.appendChild(icon);
            
            const name = document.createElement('span');
            name.setAttribute('data-component-id', 'COMP_NodeName');
            name.textContent = node.name;
            name.style.fontWeight = 'bold';
            title.appendChild(name);

            if (node.content && node.content.length > 0) {
                const badge = document.createElement('span');
                badge.className = 'knowledge-badge';
                badge.setAttribute('data-component-id', 'COMP_KnowledgeBadge');
                badge.textContent = '📚';
                badge.title = 'Есть контент в базе знаний';
                title.appendChild(badge);
            }
            
            header.appendChild(title);
            
            const stats = document.createElement('div');
            stats.className = 'accordion-stats';
            stats.setAttribute('data-component-id', 'COMP_AccordionStats');
            
            const status = document.createElement('span');
            status.className = statusClass;
            status.setAttribute('data-component-id', 'COMP_StatusBadge');
            status.textContent = statusText;
            stats.appendChild(status);
            
            const progressContainer = document.createElement('div');
            progressContainer.className = 'accordion-progress';
            progressContainer.setAttribute('data-component-id', 'COMP_ProgressContainer');
            
            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            progressBar.setAttribute('data-component-id', 'COMP_ProgressBar');
            progressBar.style.width = '100px';
            const progressFill = document.createElement('div');
            progressFill.className = 'progress-fill';
            progressFill.setAttribute('data-component-id', 'COMP_ProgressFill');
            progressFill.style.width = `${progress}%`;
            progressBar.appendChild(progressFill);
            progressContainer.appendChild(progressBar);
            
            const progressText = document.createElement('span');
            progressText.setAttribute('data-component-id', 'COMP_ProgressText');
            progressText.textContent = `${Math.round(progress)}%`;
            progressText.style.fontSize = '0.9em';
            progressText.style.color = '#6c757d';
            progressContainer.appendChild(progressText);
            
            stats.appendChild(progressContainer);
            
            if (node.type === 'technology' && (!node.checklist || node.checklist.length === 0)) {
                const checkboxContainer = document.createElement('div');
                checkboxContainer.className = 'technology-checkbox';
                checkboxContainer.setAttribute('data-component-id', 'COMP_TechCheckbox');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.setAttribute('data-component-id', 'COMP_CheckboxInput');
                checkbox.setAttribute('data-function-id', 'FUNC_toggleTech_006');
                checkbox.checked = node.completed || false;
                checkbox.onclick = function() {
                    node.completed = this.checked;
                    window.dataManager.saveToLocalStorage();
                    window.authManager.scheduleAutoSave();
                    window.accordionManager.renderAccordion();
                };
                checkboxContainer.appendChild(checkbox);
                const label = document.createElement('span');
                label.setAttribute('data-component-id', 'COMP_CheckboxLabel');
                label.textContent = 'Изучено';
                label.style.fontSize = '0.9em';
                checkboxContainer.appendChild(label);
                stats.appendChild(checkboxContainer);
            }
            
            header.appendChild(stats);
            
            const actions = document.createElement('div');
            actions.className = 'accordion-actions';
            actions.setAttribute('data-module-id', this.moduleId);
            actions.setAttribute('data-component-id', 'COMP_AccordionActions');
            
            if (node.type === 'technology') {
                actions.innerHTML = `
                    <button data-module-id="MODULE_KnowledgeManager_VER_1.0" data-function-id="FUNC_openKnowledgeBase_001" onclick="knowledgeManager.openKnowledgeBase('${JSON.stringify(path)}', ${index})" title="База знаний" style="background: #9c27b0;">📚</button>
                    <button data-module-id="MODULE_ChecklistManager_VER_1.0" data-function-id="FUNC_manageChecklist_001" onclick="checklistManager.manageChecklist('${JSON.stringify(path)}', ${index})" class="warning" title="Управление чек-листом">📋</button>
                    <button data-module-id="MODULE_DataManager_VER_1.0" data-function-id="FUNC_editTechnology_014" onclick="dataManager.editTechnology('${JSON.stringify(path)}', ${index})" title="Редактировать">✏️</button>
                    <button data-module-id="MODULE_DataManager_VER_1.0" data-function-id="FUNC_deleteTechnology_015" class="delete" onclick="dataManager.deleteTechnology('${JSON.stringify(path)}', ${index})" title="Удалить">🗑️</button>
                `;
            } else {
                const addNodeBtn = domFactory.button({
                    moduleId: 'MODULE_DataManager_VER_1.0',
                    functionId: 'FUNC_showAddNodeModal_007',
                    componentId: 'COMP_AddNodeBtn',
                    innerHTML: '+ 📁',
                    attributes: { title: 'Добавить подкатегорию' },
                    events: { click: () => uiManager.showAddNodeModal(JSON.stringify(currentPath)) }
                });
                
                const pathCopy = [...currentPath];
                const addTechBtn = domFactory.button({
                    moduleId: 'MODULE_DataManager_VER_1.0',
                    functionId: 'FUNC_addTechnology_005',
                    componentId: 'COMP_AddTechBtn',
                    innerHTML: '+ ⚙️',
                    attributes: { title: 'Добавить технологию' },
                    events: {
                        click: () => {
                            const name = prompt('Введите название технологии:');
                            if (name && name.trim()) {
                                const parent = window.dataManager.getNodeByPath(pathCopy);
                                if (parent) {
                                    const newTech = {
                                        id: 'tech_' + Date.now(),
                                        name: name.trim(),
                                        type: 'technology',
                                        completed: false
                                    };
                                    if (Array.isArray(parent)) {
                                        parent.push(newTech);
                                    } else {
                                        parent.children = parent.children || [];
                                        parent.children.push(newTech);
                                    }
                                    window.dataManager.saveToLocalStorage();
                                    window.authManager.scheduleAutoSave();
                                    window.accordionManager.renderAccordion();
                                    window.uiManager.showNotification('Технология добавлена!', 'success');
                                }
                            }
                        }
                    }
                });
                
                const editBtn = domFactory.button({
                    moduleId: 'MODULE_DataManager_VER_1.0',
                    functionId: 'FUNC_editNode_013',
                    componentId: 'COMP_EditBtn',
                    innerHTML: '✏️',
                    attributes: { title: 'Редактировать' },
                    events: { click: () => dataManager.editNode(JSON.stringify(path), index) }
                });
                
                const deleteBtn = domFactory.button({
                    moduleId: 'MODULE_DataManager_VER_1.0',
                    functionId: 'FUNC_deleteNode_012',
                    componentId: 'COMP_DeleteBtn',
                    className: 'delete',
                    innerHTML: '🗑️',
                    attributes: { title: 'Удалить' },
                    events: { click: () => dataManager.deleteNode(JSON.stringify(path), index) }
                });
                
                actions.appendChild(addNodeBtn);
                actions.appendChild(addTechBtn);
                actions.appendChild(editBtn);
                actions.appendChild(deleteBtn);
            }
            
            header.appendChild(actions);
            
            if (node.children && node.children.length > 0) {
                const toggle = document.createElement('button');
                toggle.className = 'accordion-toggle';
                toggle.setAttribute('data-module-id', this.moduleId);
                toggle.setAttribute('data-component-id', 'COMP_ToggleButton');
                toggle.setAttribute('data-function-id', 'FUNC_toggleItem_005');
                toggle.innerHTML = this.expandedState[pathKey] ? '▼' : '►';
                toggle.onclick = (e) => {
                    e.stopPropagation();
                    this.toggleItem(pathKey);
                };
                header.appendChild(toggle);
            }
            
            item.appendChild(header);
            
            if (node.children && node.children.length > 0) {
                const content = document.createElement('div');
                content.className = 'accordion-content';
                content.setAttribute('data-module-id', this.moduleId);
                content.setAttribute('data-component-id', 'COMP_AccordionContent');
                if (this.expandedState[pathKey]) {
                    content.classList.add('expanded');
                }
                
                const childContainer = document.createElement('div');
                childContainer.className = 'accordion-child';
                childContainer.setAttribute('data-component-id', 'COMP_ChildContainer');
                this.buildAccordion(node.children, childContainer, currentPath);
                content.appendChild(childContainer);
                
                item.appendChild(content);
            }
            
            if (node.type === 'technology' && node.checklist && node.checklist.length > 0) {
                const inlineChecklist = this.createInlineChecklist(node, path, index);
                item.appendChild(inlineChecklist);
            }
            
            parentElement.appendChild(item);
        });
    },

    // FUNC_toggleItem_005
    toggleItem(pathKey) {
        this.expandedState[pathKey] = !this.expandedState[pathKey];
        this.renderAccordion();
    },
    
    // FUNC_toggle_006 (legacy compatibility)
    toggle(item) {
        const content = item.querySelector('.accordion-content');
        if (content) content.classList.toggle('expanded');
    },
    
    // FUNC_createInlineChecklist_007
    createInlineChecklist(tech, path, index) {
        const checklistContainer = document.createElement('div');
        checklistContainer.className = 'inline-checklist';
        checklistContainer.setAttribute('data-module-id', this.moduleId);
        checklistContainer.setAttribute('data-component-id', 'COMP_InlineChecklist');
        
        const checklistKey = path.join('-') + '-' + index;
        const isExpanded = this.checklistExpandedState[checklistKey] !== false;
        
        const header = document.createElement('div');
        header.className = 'inline-checklist-header';
        header.setAttribute('data-component-id', 'COMP_ChecklistHeader');
        
        const title = document.createElement('div');
        title.className = 'inline-checklist-title';
        title.setAttribute('data-component-id', 'COMP_ChecklistTitle');
        
        const completedCount = tech.checklist ? tech.checklist.filter(item => item.completed).length : 0;
        const totalCount = tech.checklist ? tech.checklist.length : 0;
        
        title.innerHTML = `
            <span>📋 Чек-лист</span>
            <span style="font-size: 0.8em; color: #6c757d;">(${completedCount}/${totalCount})</span>
        `;
        
        const toggle = document.createElement('button');
        toggle.className = 'inline-checklist-toggle';
        toggle.setAttribute('data-module-id', this.moduleId);
        toggle.setAttribute('data-component-id', 'COMP_ChecklistToggle');
        toggle.setAttribute('data-function-id', 'FUNC_toggleChecklist_008');
        toggle.innerHTML = isExpanded ? '▼' : '►';
        toggle.onclick = (e) => {
            e.stopPropagation();
            this.toggleChecklist(checklistKey);
        };
        
        header.appendChild(title);
        header.appendChild(toggle);
        checklistContainer.appendChild(header);
        
        const content = document.createElement('div');
        content.className = 'inline-checklist-content';
        content.setAttribute('data-component-id', 'COMP_ChecklistContent');
        if (isExpanded) {
            content.classList.add('expanded');
        }
        
        const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        
        const stats = document.createElement('div');
        stats.className = 'inline-checklist-stats';
        stats.setAttribute('data-component-id', 'COMP_ChecklistStats');
        stats.innerHTML = `
            Прогресс: ${completedCount}/${totalCount} (${progress}%)
            <div class="progress-bar" data-component-id="COMP_ProgressBar" style="width: 100%; margin-top: 5px;">
                <div class="progress-fill" data-component-id="COMP_ProgressFill" style="width: ${progress}%"></div>
            </div>
        `;
        content.appendChild(stats);
        
        if (tech.checklist && tech.checklist.length > 0) {
            tech.checklist.forEach((item, itemIndex) => {
                const itemElement = document.createElement('div');
                itemElement.className = `inline-checklist-item ${item.completed ? 'completed' : ''}`;
                itemElement.setAttribute('data-module-id', 'MODULE_ChecklistManager_VER_1.0');
                itemElement.setAttribute('data-component-id', 'COMP_ChecklistItem');
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = item.completed;
                checkbox.setAttribute('data-function-id', 'FUNC_toggleChecklistItem_002');
                const pathCopy = [...path];
                checkbox.onclick = function() {
                    const parent = window.dataManager.getNodeByPath(pathCopy);
                    if (parent && parent[index] && parent[index].checklist) {
                        parent[index].checklist[itemIndex].completed = this.checked;
                        window.dataManager.saveToLocalStorage();
                        window.authManager.scheduleAutoSave();
                        window.accordionManager.renderAccordion();
                    }
                };
                
                const span = document.createElement('span');
                span.className = 'inline-checklist-item-text';
                span.textContent = item.text;
                
                itemElement.appendChild(checkbox);
                itemElement.appendChild(span);
                content.appendChild(itemElement);
            });
        }
        
        const actions = document.createElement('div');
        actions.className = 'inline-checklist-actions';
        actions.setAttribute('data-component-id', 'COMP_ChecklistActions');
        actions.innerHTML = `
            <button data-module-id="MODULE_ChecklistManager_VER_1.0" data-function-id="FUNC_manageChecklist_001" onclick="checklistManager.manageChecklist('${JSON.stringify(path)}', ${index})" class="warning" style="font-size: 0.8em; padding: 4px 8px;">📋 Расширенное управление</button>
            <button data-module-id="MODULE_ChecklistManager_VER_1.0" data-function-id="FUNC_addChecklistItemInAccordion_004" onclick="checklistManager.addChecklistItemInAccordion('${JSON.stringify(path)}', ${index})" style="font-size: 0.8em; padding: 4px 8px;">+ Добавить пункт</button>
        `;
        content.appendChild(actions);
        
        checklistContainer.appendChild(content);
        return checklistContainer;
    },
    
    // FUNC_toggleChecklist_008
    toggleChecklist(checklistKey) {
        this.checklistExpandedState[checklistKey] = !this.checklistExpandedState[checklistKey];
        this.renderAccordion();
    },
    
    // FUNC_calculateNodeProgress_009
    calculateNodeProgress(node) {
        if (node.type === 'technology') {
            if (node.checklist && node.checklist.length > 0) {
                const completed = node.checklist.filter(item => item.completed).length;
                const total = node.checklist.length;
                const progress = total > 0 ? (completed / total) * 100 : 0;
                return { progress, hasChecklistItems: true };
            } else {
                const progress = node.completed ? 100 : 0;
                return { progress, hasChecklistItems: false };
            }
        } else {
            if (!node.children || node.children.length === 0) {
                return { progress: 0, hasChecklistItems: false };
            }
            
            let totalProgress = 0;
            let childCount = 0;
            let hasChecklistItems = false;
            
            node.children.forEach(child => {
                const childProgress = this.calculateNodeProgress(child);
                totalProgress += childProgress.progress;
                childCount++;
                if (childProgress.hasChecklistItems) {
                    hasChecklistItems = true;
                }
            });
            
            const progress = childCount > 0 ? totalProgress / childCount : 0;
            return { progress, hasChecklistItems };
        }
    }
};

window.accordionManager = accordionManager;
