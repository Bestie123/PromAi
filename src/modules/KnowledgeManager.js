// MODULE_KnowledgeManager_VER_1.0
// Система управления базой знаний

const knowledgeManager = {
    moduleId: 'MODULE_KnowledgeManager_VER_1.0',
    version: '1.0',
    dependencies: ['MODULE_DataManager_VER_1.0', 'MODULE_UIManager_VER_1.0', 'MODULE_DOMFactory_VER_1.0'],
    currentItem: null,
    
    // FUNC_openKnowledgeBase_001 - Открыть базу знаний для элемента
    openKnowledgeBase(pathStr, index) {
        const path = JSON.parse(pathStr);
        const item = dataManager.getNodeAtIndex(path, index);
        
        if (!item) {
            uiManager.showNotification('Элемент не найден', 'error');
            return;
        }
        
        this.currentItem = item;
        
        // Инициализируем поля если их нет
        if (!item.content) item.content = '';
        if (!item.media) item.media = [];
        if (!item.links) item.links = [];
        if (!item.id) item.id = 'tech_' + Math.random().toString(36).substr(2, 9);
        
        document.getElementById('knowledgeTitle').textContent = `База знаний: ${item.name}`;
        document.getElementById('knowledgeEditor').innerHTML = item.content || '';
        this.renderPreview();
        this.renderMedia();
        this.renderLinks();
        
        uiManager.showModal('knowledgeModal');
    },
    
    // FUNC_switchTab_002 - Переключение между вкладками
    switchTab(tabName) {
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.content-tab').forEach(tab => tab.classList.remove('active'));
        
        document.getElementById(`${tabName}Tab`).classList.add('active');
        
        document.querySelectorAll('.content-tab').forEach(tab => {
            if (tab.textContent.includes(this.getTabIcon(tabName))) {
                tab.classList.add('active');
            }
        });
        
        if (tabName === 'preview') {
            this.renderPreview();
        }
    },
    
    getTabIcon(tabName) {
        const icons = { 'editor': '✏️', 'preview': '👁️', 'media': '🖼️', 'links': '🔗' };
        return icons[tabName] || '';
    },
    
    // FUNC_renderPreview_003 - Рендер превью контента
    renderPreview() {
        const content = document.getElementById('knowledgeEditor').innerHTML;
        document.getElementById('knowledgePreview').innerHTML = content;
        this.processInternalLinks();
    },
    
    // FUNC_processInternalLinks_004 - Обработка внутренних ссылок
    processInternalLinks() {
        const internalLinks = document.querySelectorAll('.internal-link');
        internalLinks.forEach(link => {
            link.onclick = (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-target');
                this.navigateToInternalLink(targetId);
            };
        });
    },
    
    // FUNC_navigateToInternalLink_005 - Навигация по внутренним ссылкам
    navigateToInternalLink(targetId) {
        const targetTech = this.findTechnologyById(targetId);
        if (targetTech) {
            uiManager.hideModals();
            const path = this.findPathToTechnology(targetTech);
            if (path) {
                setTimeout(() => {
                    this.openKnowledgeBase(JSON.stringify(path.path), path.index);
                }, 100);
            }
        } else {
            uiManager.showNotification(`Технология не найдена: ${targetId}`, 'error');
        }
    },
    
    // FUNC_findPathToTechnology_006 - Поиск пути к технологии
    findPathToTechnology(targetTech) {
        function findPath(nodes, currentPath = []) {
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                if (node.id === targetTech.id) {
                    return { path: currentPath, index: i };
                }
                if (node.children) {
                    const result = findPath(node.children, [...currentPath, i]);
                    if (result) return result;
                }
            }
            return null;
        }
        return findPath(techData.categories);
    },
    
    // FUNC_renderMedia_007 - Рендер медиафайлов
    renderMedia() {
        const gallery = document.getElementById('mediaGallery');
        gallery.innerHTML = '';
        
        if (!this.currentItem.media || this.currentItem.media.length === 0) {
            gallery.innerHTML = '<p style="text-align: center; color: #6c757d;">Медиафайлы отсутствуют</p>';
            return;
        }
        
        this.currentItem.media.forEach((media, index) => {
            const mediaItem = domFactory.create({
                moduleId: this.moduleId,
                componentId: 'COMP_MediaItem',
                className: 'media-item'
            });
            
            if (media.type === 'image') {
                mediaItem.innerHTML = `
                    <img src="${media.data}" alt="${media.name}" data-component-id="COMP_MediaImage">
                    <div class="media-item-actions" data-component-id="COMP_MediaActions">
                        <button data-module-id="MODULE_KnowledgeManager_VER_1.0" data-function-id="FUNC_deleteMedia_013" onclick="knowledgeManager.deleteMedia(${index})" title="Удалить">🗑️</button>
                        <button data-module-id="MODULE_KnowledgeManager_VER_1.0" data-function-id="FUNC_insertMediaToEditor_014" onclick="knowledgeManager.insertMediaToEditor('${media.data}', '${media.type}')" title="Вставить в редактор">📝</button>
                    </div>
                `;
            } else if (media.type === 'video') {
                mediaItem.innerHTML = `
                    <video controls data-component-id="COMP_MediaVideo">
                        <source src="${media.data}" type="${media.mimeType}">
                    </video>
                    <div class="media-item-actions" data-component-id="COMP_MediaActions">
                        <button data-module-id="MODULE_KnowledgeManager_VER_1.0" data-function-id="FUNC_deleteMedia_013" onclick="knowledgeManager.deleteMedia(${index})" title="Удалить">🗑️</button>
                        <button data-module-id="MODULE_KnowledgeManager_VER_1.0" data-function-id="FUNC_insertMediaToEditor_014" onclick="knowledgeManager.insertMediaToEditor('${media.data}', '${media.type}')" title="Вставить в редактор">📝</button>
                    </div>
                `;
            }
            
            gallery.appendChild(mediaItem);
        });
    },
    
    // FUNC_renderLinks_008 - Рендер списка ссылок
    renderLinks() {
        const linksList = document.getElementById('linksList');
        linksList.innerHTML = '';
        
        const allTech = this.getAllTechnologies();
        
        if (allTech.length === 0) {
            linksList.innerHTML = '<p style="text-align: center; color: #6c757d;">Технологии не найдены</p>';
            return;
        }
        
        allTech.forEach(tech => {
            if (tech === this.currentItem) return;
            
            const isLinked = this.currentItem.links && 
                            this.currentItem.links.some(link => link.id === tech.id);
            
            const linkItem = domFactory.create({
                moduleId: this.moduleId,
                componentId: 'COMP_LinkItem',
                className: 'link-item'
            });
            linkItem.innerHTML = `
                <span data-component-id="COMP_LinkName">${tech.name}</span>
                <button data-module-id="MODULE_KnowledgeManager_VER_1.0" data-function-id="FUNC_toggleLink_012" onclick="knowledgeManager.toggleLink('${tech.id}')" 
                        class="${isLinked ? 'success' : ''}">
                    ${isLinked ? '✅' : '🔗'}
                </button>
            `;
            
            linksList.appendChild(linkItem);
        });
    },
    
    // FUNC_getAllTechnologies_009 - Получение всех технологий
    getAllTechnologies() {
        const technologies = [];
        function traverse(nodes) {
            nodes.forEach(node => {
                if (node.type === 'technology') {
                    if (!node.id) {
                        node.id = 'tech_' + Math.random().toString(36).substr(2, 9);
                    }
                    technologies.push(node);
                }
                if (node.children) {
                    traverse(node.children);
                }
            });
        }
        traverse(techData.categories);
        return technologies;
    },

    // FUNC_findTechnologyByName_010 - Поиск технологии по названию
    findTechnologyByName(name) {
        const allTech = this.getAllTechnologies();
        return allTech.find(tech => tech.name === name);
    },
    
    // FUNC_findTechnologyById_011 - Поиск технологии по ID
    findTechnologyById(targetId) {
        function findInNodes(nodes) {
            for (const node of nodes) {
                if (!node.id) {
                    node.id = 'tech_' + Math.random().toString(36).substr(2, 9);
                }
                if (node.id === targetId) {
                    return node;
                }
                if (node.children) {
                    const found = findInNodes(node.children);
                    if (found) return found;
                }
            }
            return null;
        }
        return findInNodes(techData.categories);
    },
    
    // FUNC_toggleLink_012 - Переключение ссылки
    toggleLink(techId) {
        if (!this.currentItem.links) {
            this.currentItem.links = [];
        }
        
        const existingIndex = this.currentItem.links.findIndex(link => link.id === techId);
        
        if (existingIndex >= 0) {
            this.currentItem.links.splice(existingIndex, 1);
        } else {
            const targetTech = this.findTechnologyById(techId);
            if (targetTech) {
                this.currentItem.links.push({
                    id: techId,
                    name: targetTech.name,
                    path: this.getPathToTechnology(targetTech)
                });
            }
        }
        
        this.renderLinks();
        this.scheduleSave();
    },
    
    // FUNC_deleteMedia_013 - Удаление медиафайла
    deleteMedia(index) {
        if (confirm('Удалить этот медиафайл?')) {
            this.currentItem.media.splice(index, 1);
            this.renderMedia();
            this.scheduleSave();
        }
    },
    
    // FUNC_insertMediaToEditor_014 - Вставка медиа в редактор
    insertMediaToEditor(data, type) {
        let insertHtml = '';
        
        if (type === 'image') {
            insertHtml = `<img src="${data}" alt="Изображение" style="max-width: 100%;">`;
        } else if (type === 'video') {
            insertHtml = `<video controls style="max-width: 100%;"><source src="${data}"></video>`;
        }
        
        knowledgeEditor.insertHtml(insertHtml);
        this.switchTab('editor');
    },
    
    // FUNC_saveContent_015 - Сохранение контента
    saveContent() {
        if (!this.currentItem) return;
        
        this.currentItem.content = document.getElementById('knowledgeEditor').innerHTML;
        this.scheduleSave();
        uiManager.showNotification('Контент сохранен!', 'success');
    },
    
    // FUNC_exportContent_016 - Экспорт контента
    exportContent() {
        const content = this.currentItem.content;
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = domFactory.create({
            tag: 'a',
            moduleId: this.moduleId,
            componentId: 'COMP_DownloadLink',
            attributes: { href: url, download: `${this.currentItem.name}.html` }
        });
        a.click();
        URL.revokeObjectURL(url);
    },
    
    // FUNC_importContent_017 - Импорт контента
    importContent() {
        const input = domFactory.create({
            tag: 'input',
            moduleId: this.moduleId,
            componentId: 'COMP_FileInput',
            attributes: { type: 'file', accept: '.html,.txt' }
        });
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('knowledgeEditor').innerHTML = e.target.result;
                this.renderPreview();
                uiManager.showNotification('Контент импортирован!', 'success');
            };
            reader.readAsText(file);
        };
        input.click();
    },
    
    // FUNC_showGlobalSearch_018 - Глобальный поиск
    showGlobalSearch() {
        uiManager.showModal('searchModal');
        document.getElementById('globalSearch').focus();
    },
    
    // FUNC_performSearch_019 - Поиск по базе знаний
    performSearch() {
        const query = document.getElementById('globalSearch').value.toLowerCase();
        const results = document.getElementById('searchResults');
        results.innerHTML = '';
        
        if (!query) {
            results.innerHTML = '<p style="text-align: center; color: #6c757d;">Введите поисковый запрос</p>';
            return;
        }
        
        const searchResults = this.searchInKnowledgeBase(query);
        
        if (searchResults.length === 0) {
            results.innerHTML = '<p style="text-align: center; color: #6c757d;">Ничего не найдено</p>';
            return;
        }
        
        searchResults.forEach(result => {
            const resultItem = domFactory.create({
                moduleId: this.moduleId,
                componentId: 'COMP_SearchResultItem',
                className: 'search-result-item'
            });
            resultItem.innerHTML = `
                <div style="font-weight: bold;" data-component-id="COMP_ResultName">${result.item.name}</div>
                <div style="font-size: 0.9em; color: #6c757d;" data-component-id="COMP_ResultContext">${result.context}</div>
            `;
            
            resultItem.onclick = () => {
                this.openKnowledgeBase(JSON.stringify(result.path), result.index);
                uiManager.hideModals();
            };
            
            results.appendChild(resultItem);
        });
    },
    
    // FUNC_searchInKnowledgeBase_020 - Поиск в базе знаний
    searchInKnowledgeBase(query) {
        const results = [];
        
        function searchInNodes(nodes, path = []) {
            nodes.forEach((node, index) => {
                if (node.name.toLowerCase().includes(query)) {
                    results.push({
                        item: node,
                        path: [...path],
                        index: index,
                        context: `Название: ${node.name}`
                    });
                }
                
                if (node.content && node.content.toLowerCase().includes(query)) {
                    const contentPreview = node.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...';
                    results.push({
                        item: node,
                        path: [...path],
                        index: index,
                        context: `Контент: ${contentPreview}`
                    });
                }
                
                if (node.children) {
                    searchInNodes(node.children, [...path, index]);
                }
            });
        }
        
        searchInNodes(techData.categories);
        return results;
    },
    
    // FUNC_scheduleSave_021 - Планирование сохранения
    scheduleSave() {
        dataManager.saveToLocalStorage();
        authManager.scheduleAutoSave();
        accordionManager.renderAccordion();
    },

    // FUNC_handleFiles_022 - Обработка загруженных файлов
    handleFiles(files) {
        for (const file of files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const mediaType = file.type.startsWith('image/') ? 'image' :
                                file.type.startsWith('video/') ? 'video' : 'other';

                if (mediaType === 'other') {
                    uiManager.showNotification('Неподдерживаемый тип файла', 'error');
                    return;
                }

                if (!this.currentItem.media) {
                    this.currentItem.media = [];
                }

                this.currentItem.media.push({
                    name: file.name,
                    type: mediaType,
                    data: e.target.result,
                    mimeType: file.type,
                    size: file.size
                });

                this.renderMedia();
                this.scheduleSave();
                uiManager.showNotification(`Файл "${file.name}" загружен`, 'success');
            };
            reader.readAsDataURL(file);
        }
    },

    // FUNC_filterLinks_023 - Фильтрация ссылок
    filterLinks() {
        const query = document.getElementById('linkSearch').value.toLowerCase();
        const linkItems = document.querySelectorAll('.link-item');

        linkItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(query) ? 'flex' : 'none';
        });
    },

    // FUNC_showInternalLinkDialog_024 - Диалог выбора внутренней ссылки
    showInternalLinkDialog() {
        const technologies = this.getAllTechnologies();
        if (technologies.length === 0) {
            uiManager.showNotification('Нет доступных технологий для ссылки', 'warning');
            return;
        }

        const modal = domFactory.create({
            moduleId: this.moduleId,
            componentId: 'COMP_InternalLinkModal',
            className: 'modal',
            attributes: { style: { display: 'block' } }
        });
        modal.innerHTML = `
            <div class="modal-content" data-component-id="COMP_ModalContent" style="max-width: 600px;">
                <div class="modal-header" data-component-id="COMP_ModalHeader">
                    <h3>Выберите технологию для ссылки</h3>
                    <button data-function-id="FUNC_closeModal_001" onclick="this.closest('.modal').remove()">✕</button>
                </div>
                <div style="max-height: 400px; overflow-y: auto;" data-component-id="COMP_ModalBody">
                    <input type="text" id="internalLinkSearch" data-component-id="COMP_SearchInput" placeholder="Поиск технологий..." style="width: 100%; margin-bottom: 10px;">
                    <div id="internalLinkList" data-component-id="COMP_LinkList">
                        ${technologies.map(tech => `
                            <div class="link-item" data-module-id="MODULE_KnowledgeManager_VER_1.0" data-component-id="COMP_LinkItem" data-function-id="FUNC_insertInternalLink_025" onclick="knowledgeManager.insertInternalLink('${tech.id}', '${tech.name}')" style="cursor: pointer;">
                                <strong>${tech.name}</strong>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const searchInput = modal.querySelector('#internalLinkSearch');
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();
            const items = modal.querySelectorAll('.link-item');
            items.forEach(item => {
                item.style.display = item.textContent.toLowerCase().includes(query) ? 'block' : 'none';
            });
        });
    },

    // FUNC_insertInternalLink_025 - Вставка внутренней ссылки
    insertInternalLink(techId, techName) {
        const linkHtml = `<a href="#" class="internal-link" data-target="${techId}">${techName}</a>`;
        knowledgeEditor.insertHtml(linkHtml);

        document.querySelectorAll('.modal').forEach(modal => {
            if (modal.innerHTML.includes('Выберите технологию для ссылки')) {
                modal.remove();
            }
        });
    },

    getPathToTechnology(tech) {
        return [];
    }
};

// Инициализация обработчиков после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('mediaDropZone');
    const fileInput = document.getElementById('mediaUpload');
    
    if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => fileInput.click());
        
        fileInput.addEventListener('change', (e) => {
            knowledgeManager.handleFiles(e.target.files);
        });
        
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            knowledgeManager.handleFiles(e.dataTransfer.files);
        });
    }
    
    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) {
        globalSearch.addEventListener('input', () => {
            knowledgeManager.performSearch();
        });
    }
    
    const linkSearch = document.getElementById('linkSearch');
    if (linkSearch) {
        linkSearch.addEventListener('input', () => {
            knowledgeManager.filterLinks();
        });
    }
});
