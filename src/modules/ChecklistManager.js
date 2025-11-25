// MODULE_ChecklistManager_VER_1.0
// Управление чек-листами для технологий

const checklistManager = {
    moduleId: 'MODULE_ChecklistManager_VER_1.0',
    version: '1.0',
    dependencies: ['MODULE_DataManager_VER_1.0', 'MODULE_UIManager_VER_1.0', 'MODULE_DOMFactory_VER_1.0'],
    currentChecklist: {
        path: [],
        techIndex: -1
    },

    // FUNC_manageChecklist_001 - Открыть модальное окно управления чек-листом
    manageChecklist(pathStr, techIndex) {
        const path = JSON.parse(pathStr);
        this.currentChecklist = { path, techIndex };
        
        const tech = this.getTechnology();
        if (!tech) return;
        
        document.getElementById('checklistTitle').textContent = `Чек-лист: ${tech.name}`;
        
        if (!tech.checklist) {
            tech.checklist = [];
        }
        
        this.renderChecklist();
        uiManager.showModal('checklistModal');
    },
    
    // FUNC_toggleChecklistItem_002 - Переключить статус пункта
    toggleChecklistItem(pathStr, techIndex, itemIndex) {
        const path = JSON.parse(pathStr);
        this.currentChecklist = { path, techIndex };
        const tech = this.getTechnology();
        if (!tech) return;
        
        if (tech.checklist && tech.checklist.length > itemIndex) {
            tech.checklist[itemIndex].completed = !tech.checklist[itemIndex].completed;
            this.renderChecklist();
            dataManager.saveToLocalStorage();
            authManager.scheduleAutoSave();
            dataManager.renderCurrentView();
        }
    },
    
    // FUNC_addChecklistItem_003 - Добавить пункт чек-листа
    addChecklistItem() {
        const input = document.getElementById('newChecklistItem');
        if (!input) return;
        
        const text = input.value.trim();
        
        if (text) {
            const tech = this.getTechnology();
            if (!tech) return;
            
            if (!tech.checklist) {
                tech.checklist = [];
            }
            
            tech.checklist.push({
                text: text,
                completed: false
            });
            
            input.value = '';
            this.renderChecklist();
            dataManager.saveToLocalStorage();
            authManager.scheduleAutoSave();
            dataManager.renderCurrentView();
        }
    },

    // FUNC_addChecklistItemInAccordion_004 - Добавить пункт из аккордеона
    addChecklistItemInAccordion(pathStr, techIndex) {
        const path = JSON.parse(pathStr);
        this.currentChecklist = { path, techIndex };
        const text = prompt('Введите новый пункт чек-листа:');
        if (text && text.trim()) {
            const tech = this.getTechnology();
            if (!tech) return;
            
            if (!tech.checklist) {
                tech.checklist = [];
            }
            
            tech.checklist.push({
                text: text.trim(),
                completed: false
            });
            
            dataManager.saveToLocalStorage();
            authManager.scheduleAutoSave();
            dataManager.renderCurrentView();
        }
    },
    
    // FUNC_removeChecklistItem_005 - Удалить пункт чек-листа
    removeChecklistItem(index) {
        const tech = this.getTechnology();
        if (!tech) return;
        
        if (tech.checklist && tech.checklist.length > index) {
            tech.checklist.splice(index, 1);
            this.renderChecklist();
            dataManager.saveToLocalStorage();
            authManager.scheduleAutoSave();
            dataManager.renderCurrentView();
        }
    },

    // FUNC_removeChecklistItemInAccordion_006 - Удалить пункт из аккордеона
    removeChecklistItemInAccordion(pathStr, techIndex, itemIndex) {
        const path = JSON.parse(pathStr);
        this.currentChecklist = { path, techIndex };
        if (confirm('Удалить этот пункт чек-листа?')) {
            const tech = this.getTechnology();
            if (!tech) return;
            
            if (tech.checklist && tech.checklist.length > itemIndex) {
                tech.checklist.splice(itemIndex, 1);
                dataManager.saveToLocalStorage();
                authManager.scheduleAutoSave();
                dataManager.renderCurrentView();
            }
        }
    },
    
    // FUNC_editChecklistItem_007 - Редактировать пункт чек-листа
    editChecklistItem(index) {
        const tech = this.getTechnology();
        if (!tech) return;
        
        if (tech.checklist && tech.checklist.length > index) {
            const newText = prompt('Редактировать пункт:', tech.checklist[index].text);
            if (newText !== null) {
                tech.checklist[index].text = newText.trim();
                this.renderChecklist();
                dataManager.saveToLocalStorage();
                authManager.scheduleAutoSave();
                dataManager.renderCurrentView();
            }
        }
    },

    // FUNC_editChecklistItemInAccordion_008 - Редактировать пункт из аккордеона
    editChecklistItemInAccordion(pathStr, techIndex, itemIndex) {
        const path = JSON.parse(pathStr);
        this.currentChecklist = { path, techIndex };
        const tech = this.getTechnology();
        if (!tech) return;
        
        if (tech.checklist && tech.checklist.length > itemIndex) {
            const newText = prompt('Редактировать пункт:', tech.checklist[itemIndex].text);
            if (newText !== null) {
                tech.checklist[itemIndex].text = newText.trim();
                dataManager.saveToLocalStorage();
                authManager.scheduleAutoSave();
                dataManager.renderCurrentView();
            }
        }
    },
    
    // FUNC_renderChecklist_009 - Отрисовка чек-листа
    renderChecklist() {
        const tech = this.getTechnology();
        if (!tech) return;
        
        const checklistItems = document.getElementById('checklistItems');
        const checklistStats = document.getElementById('checklistStats');
        
        if (!checklistItems || !checklistStats) return;
        
        checklistItems.innerHTML = '';
        
        if (tech.checklist && tech.checklist.length > 0) {
            tech.checklist.forEach((item, index) => {
                const pathStr = JSON.stringify(this.currentChecklist.path);
                const techIdx = this.currentChecklist.techIndex;
                
                const checkbox = domFactory.create({
                    tag: 'input',
                    moduleId: this.moduleId,
                    functionId: 'FUNC_toggleChecklistItem_002',
                    componentId: 'COMP_CheckboxInput',
                    attributes: {
                        type: 'checkbox',
                        checked: item.completed
                    },
                    events: {
                        click: function() {
                            const path = JSON.parse(pathStr);
                            const parent = window.dataManager.getNodeByPath(path);
                            if (parent && parent[techIdx] && parent[techIdx].checklist) {
                                parent[techIdx].checklist[index].completed = this.checked;
                                window.dataManager.saveToLocalStorage();
                                window.authManager.scheduleAutoSave();
                                window.checklistManager.renderChecklist();
                                window.accordionManager.renderAccordion();
                            }
                        }
                    }
                });
                
                const span = domFactory.create({
                    tag: 'span',
                    moduleId: this.moduleId,
                    componentId: 'COMP_ChecklistItemText',
                    className: 'checklist-item-text',
                    textContent: item.text
                });
                
                const deleteBtn = domFactory.button({
                    moduleId: this.moduleId,
                    functionId: 'FUNC_removeChecklistItem_005',
                    componentId: 'COMP_DeleteBtn',
                    className: 'delete',
                    innerHTML: '🗑️',
                    attributes: { style: { marginLeft: '10px' } },
                    events: { click: () => this.removeChecklistItem(index) }
                });
                
                const editBtn = domFactory.button({
                    moduleId: this.moduleId,
                    functionId: 'FUNC_editChecklistItem_007',
                    componentId: 'COMP_EditBtn',
                    innerHTML: '✏️',
                    attributes: { style: { marginLeft: '5px' } },
                    events: { click: () => this.editChecklistItem(index) }
                });
                
                const itemElement = domFactory.create({
                    moduleId: this.moduleId,
                    componentId: 'COMP_ChecklistItem',
                    className: `checklist-item ${item.completed ? 'completed' : ''}`,
                    children: [checkbox, span, deleteBtn, editBtn]
                });
                
                itemElement.appendChild(checkbox);
                itemElement.appendChild(span);
                itemElement.appendChild(deleteBtn);
                itemElement.appendChild(editBtn);
                
                checklistItems.appendChild(itemElement);
            });
        } else {
            checklistItems.innerHTML = '<p style="text-align: center; color: #6c757d;">Чек-лист пуст. Добавьте первый пункт!</p>';
        }
        
        const completed = tech.checklist ? tech.checklist.filter(item => item.completed).length : 0;
        const total = tech.checklist ? tech.checklist.length : 0;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        checklistStats.innerHTML = `
            Прогресс: ${completed}/${total} (${progress}%)
            <div class="progress-bar" data-component-id="COMP_ProgressBar" style="width: 100%; margin-top: 5px;">
                <div class="progress-fill" data-component-id="COMP_ProgressFill" style="width: ${progress}%"></div>
            </div>
        `;
    },
    
    // FUNC_saveChecklist_010 - Сохранить чек-лист
    saveChecklist() {
        uiManager.hideModals();
        dataManager.saveToLocalStorage();
        uiManager.showNotification('Чек-лист сохранен!', 'success');
        authManager.scheduleAutoSave();
        dataManager.renderCurrentView();
    },
    
    // FUNC_getTechnology_011 - Получить текущую технологию
    getTechnology() {
        const parent = dataManager.getNodeByPath(this.currentChecklist.path);
        return parent ? parent[this.currentChecklist.techIndex] : null;
    }
};

window.checklistManager = checklistManager;