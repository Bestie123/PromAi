// MODULE_AuthManager_VER_1.0
const authManager = {
    moduleId: 'MODULE_AuthManager_VER_1.0',
    version: '1.0',
    dependencies: ['MODULE_DataManager_VER_1.0', 'MODULE_UIManager_VER_1.0'],
    autoSaveEnabled: false,
    autoSaveInterval: null,
    lastSaveTime: null,
    autoSaveTimeout: null,
    lastKnownRemoteSha: null,
    lastSyncTime: null,

    // FUNC_testAuth_001
    async testAuth() {
        const token = document.getElementById('githubToken').value;
        const owner = document.getElementById('repoOwner').value;
        const repo = document.getElementById('repoName').value;
        
        if (!token || !owner || !repo) {
            window.uiManager.showNotification('Fill all fields!', 'error');
            return;
        }
        
        try {
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
                headers: {'Authorization': `token ${token}`}
            });
            
            if (response.status === 200) {
                window.uiManager.showNotification('✅ Connected!', 'success');
                document.getElementById('authStatus').textContent = '✅ Connected';
            } else {
                window.uiManager.showNotification('❌ Failed', 'error');
            }
        } catch (error) {
            window.uiManager.showNotification('❌ Error', 'error');
        }
    },

    // FUNC_saveAuth_002
    saveAuth() {
        localStorage.setItem('githubToken', document.getElementById('githubToken').value);
        localStorage.setItem('repoOwner', document.getElementById('repoOwner').value);
        localStorage.setItem('repoName', document.getElementById('repoName').value);
        window.uiManager.showNotification('Saved!', 'success');
    },

    // FUNC_loadAuth_003
    loadAuth() {
        const token = localStorage.getItem('githubToken');
        const owner = localStorage.getItem('repoOwner');
        const repo = localStorage.getItem('repoName');
        
        if (token) document.getElementById('githubToken').value = token;
        if (owner) document.getElementById('repoOwner').value = owner;
        if (repo) document.getElementById('repoName').value = repo;
    },

    // FUNC_loadFromGitHub_004
    async loadFromGitHub() {
        const token = localStorage.getItem('githubToken');
        const owner = localStorage.getItem('repoOwner');
        const repo = localStorage.getItem('repoName');
        
        if (!token || !owner || !repo) {
            window.uiManager.showNotification('Configure GitHub first!', 'error');
            return;
        }
        
        try {
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/tech-data.json`, {
                headers: {'Authorization': `token ${token}`}
            });
            
            if (response.status === 200) {
                const data = await response.json();
                const content = decodeURIComponent(escape(atob(data.content)));
                const parsedData = JSON.parse(content);
                window.techData.categories = parsedData.categories || [];
                window.dataManager.saveToLocalStorage();
                window.accordionManager.renderAccordion();
                
                this.lastKnownRemoteSha = data.sha;
                this.lastSyncTime = Date.now();
                this.updateSyncStatus();
                
                window.uiManager.showNotification('✅ Loaded!', 'success');
            }
        } catch (error) {
            window.uiManager.showNotification('❌ Error', 'error');
        }
    },

    // FUNC_forceSync_006
    async forceSync() {
        await this.saveToGitHub();
        await this.loadFromGitHub();
    },

    // FUNC_enableAutoSave_007
    enableAutoSave() {
        if (this.autoSaveEnabled) return;
        
        this.autoSaveEnabled = true;
        this.updateAutoSaveButton();
        
        this.autoSaveInterval = setInterval(() => {
            this.autoSaveToGitHub();
        }, 2 * 60 * 1000);
        
        window.addEventListener('beforeunload', this.autoSaveToGitHub.bind(this));
        
        window.uiManager.showNotification('🔄 Автосохранение включено (каждые 2 минуты)', 'success');
    },
    
    // FUNC_disableAutoSave_008
    disableAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
        this.autoSaveEnabled = false;
        this.updateAutoSaveButton();
        window.removeEventListener('beforeunload', this.autoSaveToGitHub.bind(this));
        window.uiManager.showNotification('⏸️ Автосохранение отключено', 'warning');
    },
    
    // FUNC_toggleAutoSave_009
    toggleAutoSave() {
        if (this.autoSaveEnabled) {
            this.disableAutoSave();
        } else {
            this.enableAutoSave();
        }
    },
    
    // FUNC_updateAutoSaveButton_010
    updateAutoSaveButton() {
        const button = document.getElementById('autoSaveBtn');
        if (!button) return;
        
        if (this.autoSaveEnabled) {
            button.innerHTML = '✅ Автосохранение';
            button.className = 'auto-save-enabled';
        } else {
            button.innerHTML = '🚫 Автосохранение';
            button.className = 'auto-save-disabled';
        }
    },
    
    // FUNC_autoSaveToGitHub_011
    async autoSaveToGitHub() {
        const token = localStorage.getItem('githubToken');
        const owner = localStorage.getItem('repoOwner');
        const repo = localStorage.getItem('repoName');
        
        if (!token || !owner || !repo || !this.autoSaveEnabled) {
            return;
        }

        const now = Date.now();
        if (this.lastSaveTime && (now - this.lastSaveTime) < 30000) {
            return;
        }

        try {
            console.log('🔄 Автосохранение на GitHub...');
            
            let currentRemoteSha = null;
            let remoteData = null;
            
            try {
                const getResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/tech-data.json`, {
                    headers: {
                        'Authorization': `token ${token}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'User-Agent': 'TechDocs-App'
                    }
                });
                
                if (getResponse.status === 200) {
                    const data = await getResponse.json();
                    currentRemoteSha = data.sha;
                    
                    if (this.lastKnownRemoteSha && currentRemoteSha !== this.lastKnownRemoteSha) {
                        console.log('⚠️ Обнаружены изменения на сервере, загружаем для слияния...');
                        const remoteContent = decodeURIComponent(escape(atob(data.content)));
                        remoteData = JSON.parse(remoteContent);
                        
                        this.mergeData(remoteData);
                    }
                    
                    this.lastKnownRemoteSha = currentRemoteSha;
                } else if (getResponse.status === 404) {
                    console.log('📝 Файл не найден, будет создан новый');
                }
            } catch (e) {
                console.error('Ошибка при проверке файла для автосохранения:', e);
                return;
            }

            const content = JSON.stringify(window.techData, null, 2);
            const contentBase64 = btoa(unescape(encodeURIComponent(content)));
            const message = `Auto-save: ${new Date().toLocaleString()}`;
            
            const requestBody = {
                message: message,
                content: contentBase64
            };

            if (currentRemoteSha) {
                requestBody.sha = currentRemoteSha;
            }

            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/tech-data.json`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'TechDocs-App'
                },
                body: JSON.stringify(requestBody)
            });

            if (response.status === 200 || response.status === 201) {
                this.lastSaveTime = Date.now();
                this.lastSyncTime = Date.now();
                this.updateSyncStatus();
                console.log('✅ Автосохранение выполнено успешно');
                
                if (!document.hidden) {
                    this.showAutoSaveNotification();
                }
            } else {
                console.warn('⚠️ Автосохранение не удалось:', response.status);
                
                if (response.status === 409) {
                    this.handleSyncConflict();
                }
            }
        } catch (error) {
            console.error('❌ Ошибка автосохранения:', error);
        }
    },
    
    // FUNC_mergeData_012
    mergeData(remoteData) {
        if (!remoteData || !remoteData.categories) return;
        
        console.log('🔄 Начинаем слияние данных...');
        
        remoteData.categories.forEach(remoteCategory => {
            const localCategory = window.techData.categories.find(cat => cat.name === remoteCategory.name);
            
            if (!localCategory) {
                window.techData.categories.push(JSON.parse(JSON.stringify(remoteCategory)));
                console.log(`✅ Добавлена категория: ${remoteCategory.name}`);
            } else {
                this.mergeTechnologies(localCategory, remoteCategory);
            }
        });
        
        window.dataManager.saveToLocalStorage();
        window.dataManager.renderCurrentView();
        
        window.uiManager.showNotification('✅ Данные синхронизированы с сервером', 'success');
    },

    // FUNC_mergeTechnologies_013
    mergeTechnologies(localCategory, remoteCategory) {
        if (!remoteCategory.children) return;
        
        remoteCategory.children.forEach(remoteItem => {
            const exists = localCategory.children.some(localItem => 
                localItem.name === remoteItem.name && localItem.type === remoteItem.type
            );
            
            if (!exists) {
                localCategory.children.push(JSON.parse(JSON.stringify(remoteItem)));
                console.log(`✅ Добавлен ${remoteItem.type === 'technology' ? 'технология' : 'подкатегория'}: ${remoteItem.name}`);
            } else if (remoteItem.type === 'technology') {
                this.mergeChecklists(localCategory, remoteItem);
            }
        });
    },

    // FUNC_mergeChecklists_014
    mergeChecklists(localCategory, remoteTech) {
        const localTech = localCategory.children.find(item => 
            item.name === remoteTech.name && item.type === 'technology'
        );
        
        if (!localTech || !remoteTech.checklist) return;
        
        if (!localTech.checklist) {
            localTech.checklist = [];
        }
        
        remoteTech.checklist.forEach(remoteItem => {
            const exists = localTech.checklist.some(localItem => 
                localItem.text === remoteItem.text
            );
            
            if (!exists) {
                localTech.checklist.push(JSON.parse(JSON.stringify(remoteItem)));
                console.log(`✅ Добавлен пункт чек-листа: ${remoteItem.text}`);
            }
        });
    },

    // FUNC_handleSyncConflict_015
    handleSyncConflict() {
        if (confirm('Обнаружен конфликт версий. Хотите загрузить данные с сервера и объединить с вашими изменениями?')) {
            this.loadFromGitHubWithMerge();
        } else {
            window.uiManager.showNotification('⚠️ Автосохранение отключено из-за конфликта', 'warning');
            this.disableAutoSave();
        }
    },

    // FUNC_loadFromGitHubWithMerge_016
    async loadFromGitHubWithMerge() {
        const token = localStorage.getItem('githubToken');
        const owner = localStorage.getItem('repoOwner');
        const repo = localStorage.getItem('repoName');
        
        if (!token || !owner || !repo) {
            window.uiManager.showNotification('Сначала настройте доступ к GitHub!', 'error');
            return;
        }

        try {
            window.uiManager.showNotification('Загрузка и слияние данных с GitHub...', 'warning');
            
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/tech-data.json`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'TechDocs-App'
                }
            });

            if (response.status === 200) {
                const data = await response.json();
                const content = decodeURIComponent(escape(atob(data.content)));
                const remoteData = JSON.parse(content);
                
                this.mergeData(remoteData);
                
                this.lastKnownRemoteSha = data.sha;
                this.lastSyncTime = Date.now();
                this.updateSyncStatus();
                
                window.uiManager.showNotification('✅ Данные успешно загружены и объединены!', 'success');
                
                this.enableAutoSave();
            } else {
                throw new Error(`GitHub API error: ${response.status}`);
            }
        } catch (error) {
            console.error('GitHub load error:', error);
            window.uiManager.showNotification('❌ Ошибка загрузки: ' + error.message, 'error');
        }
    },

    // FUNC_showAutoSaveNotification_017
    showAutoSaveNotification() {
        const notification = document.createElement('div');
        notification.innerHTML = '💾 Автосохранено';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 1002;
            opacity: 0.9;
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    },
    
    // FUNC_scheduleAutoSave_018
    scheduleAutoSave() {
        if (!this.autoSaveEnabled) return;
        
        if (this.autoSaveTimeout) {
            clearTimeout(this.autoSaveTimeout);
        }
        
        this.autoSaveTimeout = setTimeout(() => {
            this.autoSaveToGitHub();
        }, 10000);
    },

    // FUNC_updateSyncStatus_019
    updateSyncStatus() {
        const syncStatus = document.getElementById('syncStatus');
        if (!syncStatus) return;
        
        if (this.lastSyncTime) {
            const lastSync = new Date(this.lastSyncTime).toLocaleString();
            syncStatus.innerHTML = `🔄 Последняя синхронизация: ${lastSync}`;
        } else {
            syncStatus.innerHTML = '⏳ Синхронизация не выполнялась';
        }
    },

    // FUNC_saveToGitHub_005
    async saveToGitHub() {
        const token = localStorage.getItem('githubToken');
        const owner = localStorage.getItem('repoOwner');
        const repo = localStorage.getItem('repoName');
        
        if (!token || !owner || !repo) {
            window.uiManager.showNotification('Configure GitHub first!', 'error');
            return;
        }
        
        try {
            let sha = null;
            try {
                const getResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/tech-data.json`, {
                    headers: {'Authorization': `token ${token}`}
                });
                if (getResponse.status === 200) {
                    sha = (await getResponse.json()).sha;
                }
            } catch (e) {}
            
            const content = btoa(unescape(encodeURIComponent(JSON.stringify(window.techData, null, 2))));
            const body = {message: `Update: ${new Date().toLocaleString()}`, content};
            if (sha) body.sha = sha;
            
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/tech-data.json`, {
                method: 'PUT',
                headers: {'Authorization': `token ${token}`, 'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            });
            
            if (response.status === 200 || response.status === 201) {
                window.uiManager.showNotification('✅ Saved!', 'success');
            }
        } catch (error) {
            window.uiManager.showNotification('❌ Error', 'error');
        }
    }
};

window.authManager = authManager;
