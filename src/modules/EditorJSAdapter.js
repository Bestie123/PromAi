// MODULE_EditorJSAdapter_VER_1.0
const editorJSAdapter = {
    moduleId: 'MODULE_EditorJSAdapter_VER_1.0',
    version: '1.0',
    dependencies: ['MODULE_KnowledgeManager_VER_1.0', 'MODULE_UIManager_VER_1.0'],
    editor: null,
    
    // FUNC_init_001 - Инициализация Editor.js
    async init(holderId, data = null) {
        if (!window.EditorJS) {
            console.error('[MODULE_EditorJSAdapter_VER_1.0] Editor.js not loaded');
            return;
        }
        
        this.editor = new EditorJS({
            holder: holderId,
            data: data || { blocks: [] },
            tools: {
                header: window.Header,
                list: window.List,
                checklist: window.Checklist,
                quote: window.Quote,
                delimiter: window.Delimiter,
                table: window.Table,
                code: window.CodeTool,
                image: window.SimpleImage
            },
            placeholder: 'Начните писать...',
            minHeight: 300
        });
        
        console.log('[MODULE_EditorJSAdapter_VER_1.0] Editor initialized');
    },
    
    // FUNC_save_002 - Сохранение данных
    async save() {
        if (!this.editor) return null;
        
        try {
            const outputData = await this.editor.save();
            return outputData;
        } catch (error) {
            console.error('[MODULE_EditorJSAdapter_VER_1.0] Save failed:', error);
            return null;
        }
    },
    
    // FUNC_destroy_003 - Уничтожение редактора
    destroy() {
        if (this.editor) {
            this.editor.destroy();
            this.editor = null;
        }
    },
    
    // FUNC_isReady_004 - Проверка готовности
    async isReady() {
        if (!this.editor) return false;
        
        try {
            await this.editor.isReady;
            return true;
        } catch {
            return false;
        }
    }
};

window.editorJSAdapter = editorJSAdapter;
