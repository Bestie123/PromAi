# Create Plugin

Создай плагин: {название}

## Параметры
- **Название:** {PLUGIN_NAME}
- **Тип:** UI / Data / Integration / Utility
- **Описание:** {что делает плагин}
- **Зависимости:** {список модулей}

## Шаг 1: Проверить систему

### Проверить PluginManager
```javascript
// Проверить что PluginManager существует
if (!window.pluginManager) {
    console.error('PluginManager не найден!');
    // Создать PluginManager сначала
}

// Проверить API версию
const apiVersion = window.pluginManager.apiVersion;
console.log('Plugin API:', apiVersion);
```

### Проверить зависимости
```javascript
// Из project_registry.json
const dependencies = ['MODULE_DataManager_VER_1.0', 'MODULE_UIManager_VER_1.0'];

dependencies.forEach(dep => {
    const moduleName = dep.split('_')[1].toLowerCase();
    if (!window[moduleName]) {
        console.error(`Зависимость ${dep} не найдена!`);
    }
});
```

## Шаг 2: Создать структуру плагина

### Структура директорий
```
src/plugins/{name}/
├── plugin.js           # Основной файл плагина
├── manifest.json       # Метаданные
├── styles.css          # Стили (опционально)
├── README.md           # Документация
└── examples/           # Примеры использования
    └── basic.html
```

## Шаг 3: Создать manifest.json

```json
{
  "id": "PLUGIN_{Name}_VER_1.0",
  "name": "{Plugin Name}",
  "version": "1.0.0",
  "description": "{Описание плагина}",
  "author": "{Автор}",
  "type": "UI|Data|Integration|Utility",
  "apiVersion": "1.0",
  "dependencies": [
    "MODULE_DataManager_VER_1.0",
    "MODULE_UIManager_VER_1.0"
  ],
  "permissions": [
    "storage",
    "dom",
    "network"
  ],
  "entry": "plugin.js",
  "styles": "styles.css",
  "icon": "icon.png"
}
```

## Шаг 4: Создать plugin.js

### Шаблон плагина
```javascript
// PLUGIN_{Name}_VER_1.0
const {name}Plugin = {
    pluginId: 'PLUGIN_{Name}_VER_1.0',
    version: '1.0.0',
    type: '{type}',
    
    // FUNC_init_001 - Инициализация плагина
    init(context) {
        console.log(`[${this.pluginId}] Initializing...`);
        
        // Сохранить контекст
        this.context = context;
        
        // Инициализация
        this.setupUI();
        this.registerHandlers();
        
        console.log(`[${this.pluginId}] Initialized`);
    },
    
    // FUNC_setupUI_002 - Настройка UI
    setupUI() {
        // Создать UI элементы через DOMFactory
        const button = domFactory.create({
            tag: 'button',
            moduleId: this.pluginId,
            componentId: 'COMP_PluginButton',
            functionId: 'FUNC_setupUI_002',
            textContent: 'Plugin Action',
            events: {
                click: () => this.handleAction()
            }
        });
        
        // Добавить в DOM
        document.body.appendChild(button);
    },
    
    // FUNC_registerHandlers_003 - Регистрация обработчиков
    registerHandlers() {
        // Подписаться на события системы
        this.context.on('data:changed', (data) => {
            this.handleDataChange(data);
        });
    },
    
    // FUNC_handleAction_004 - Обработка действия
    handleAction() {
        console.log(`[${this.pluginId}] Action triggered`);
        // Логика плагина
    },
    
    // FUNC_handleDataChange_005 - Обработка изменения данных
    handleDataChange(data) {
        console.log(`[${this.pluginId}] Data changed:`, data);
    },
    
    // FUNC_destroy_006 - Очистка ресурсов
    destroy() {
        console.log(`[${this.pluginId}] Destroying...`);
        
        // Отписаться от событий
        this.context.off('data:changed');
        
        // Удалить UI элементы
        // ...
        
        console.log(`[${this.pluginId}] Destroyed`);
    }
};

// Экспорт плагина
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {name}Plugin;
} else {
    window.{name}Plugin = {name}Plugin;
}
```

## Шаг 5: Регистрация в PluginManager

```javascript
// В main.js или отдельном файле
document.addEventListener('DOMContentLoaded', function() {
    // Загрузить плагин
    pluginManager.loadPlugin({
        id: 'PLUGIN_{Name}_VER_1.0',
        path: 'src/plugins/{name}/plugin.js',
        manifest: 'src/plugins/{name}/manifest.json'
    });
    
    // Или автоматическая загрузка
    pluginManager.loadFromDirectory('src/plugins/');
});
```

## Шаг 6: Создать документацию

### README.md
```markdown
# {Plugin Name}

> {Описание плагина}

## Установка

\`\`\`javascript
pluginManager.loadPlugin({
    id: 'PLUGIN_{Name}_VER_1.0',
    path: 'src/plugins/{name}/plugin.js'
});
\`\`\`

## Использование

\`\`\`javascript
// Получить плагин
const plugin = pluginManager.getPlugin('PLUGIN_{Name}_VER_1.0');

// Использовать
plugin.handleAction();
\`\`\`

## API

### init(context)
Инициализация плагина

### handleAction()
Выполнить действие

### destroy()
Очистка ресурсов

## Зависимости
- MODULE_DataManager_VER_1.0
- MODULE_UIManager_VER_1.0

## Лицензия
MIT
```

## Шаг 7: Обновить state файлы

### 1. project_registry.json
```json
{
  "plugins": {
    "PLUGIN_{Name}_VER_1.0": {
      "path": "src/plugins/{name}/plugin.js",
      "manifest": "src/plugins/{name}/manifest.json",
      "type": "{type}",
      "functions": [
        "FUNC_init_001",
        "FUNC_setupUI_002",
        "FUNC_registerHandlers_003",
        "FUNC_handleAction_004",
        "FUNC_destroy_006"
      ],
      "dependencies": [
        "MODULE_PluginManager_VER_1.0",
        "MODULE_DataManager_VER_1.0"
      ],
      "status": "active"
    }
  }
}
```

### 2. dependencies_map.json
```json
{
  "nodes": [
    {"id": "PLUGIN_{Name}_VER_1.0", "type": "plugin"}
  ],
  "edges": [
    {"from": "PLUGIN_{Name}_VER_1.0", "to": "MODULE_PluginManager_VER_1.0"},
    {"from": "PLUGIN_{Name}_VER_1.0", "to": "MODULE_DataManager_VER_1.0"}
  ]
}
```

### 3. todo.json
```json
{
  "tasks": [
    {
      "id": "TASK_XXX",
      "title": "Создать тесты для PLUGIN_{Name}_VER_1.0",
      "status": "backlog",
      "priority": "medium"
    }
  ]
}
```

### 4. changelog.md
```markdown
## [1.X.0] - 2024-01-15
### Added
- PLUGIN_{Name}_VER_1.0 - {описание плагина}
```

## Примеры использования

### Пример 1: UI плагин (Markdown Editor)
```javascript
// PLUGIN_MarkdownEditor_VER_1.0
const markdownEditorPlugin = {
    pluginId: 'PLUGIN_MarkdownEditor_VER_1.0',
    type: 'UI',
    
    init(context) {
        this.context = context;
        this.createEditor();
    },
    
    createEditor() {
        const editor = domFactory.create({
            tag: 'textarea',
            moduleId: this.pluginId,
            componentId: 'COMP_MarkdownEditor',
            className: 'markdown-editor',
            attributes: {
                placeholder: 'Enter markdown...'
            },
            events: {
                input: (e) => this.handleInput(e)
            }
        });
        
        document.getElementById('editor-container').appendChild(editor);
    },
    
    handleInput(e) {
        const markdown = e.target.value;
        const html = this.parseMarkdown(markdown);
        this.updatePreview(html);
    },
    
    parseMarkdown(text) {
        // Простой парсер markdown
        return text
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    },
    
    updatePreview(html) {
        const preview = document.getElementById('preview');
        preview.innerHTML = html;
    },
    
    destroy() {
        // Очистка
    }
};
```

### Пример 2: Data плагин (Auto Backup)
```javascript
// PLUGIN_AutoBackup_VER_1.0
const autoBackupPlugin = {
    pluginId: 'PLUGIN_AutoBackup_VER_1.0',
    type: 'Data',
    
    init(context) {
        this.context = context;
        this.interval = null;
        this.startAutoBackup();
    },
    
    startAutoBackup() {
        // Бэкап каждые 5 минут
        this.interval = setInterval(() => {
            this.backup();
        }, 5 * 60 * 1000);
    },
    
    backup() {
        const data = dataManager.exportToJSON();
        localStorage.setItem('backup_' + Date.now(), data);
        console.log('[AutoBackup] Backup created');
    },
    
    destroy() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
};
```

### Пример 3: Integration плагин (GitHub Sync)
```javascript
// PLUGIN_GitHubSync_VER_1.0
const githubSyncPlugin = {
    pluginId: 'PLUGIN_GitHubSync_VER_1.0',
    type: 'Integration',
    
    init(context) {
        this.context = context;
        this.setupSync();
    },
    
    setupSync() {
        // Подписаться на изменения данных
        this.context.on('data:changed', (data) => {
            this.syncToGitHub(data);
        });
    },
    
    async syncToGitHub(data) {
        const token = localStorage.getItem('githubToken');
        if (!token) return;
        
        try {
            const response = await fetch('https://api.github.com/...', {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                console.log('[GitHubSync] Synced successfully');
            }
        } catch (error) {
            console.error('[GitHubSync] Sync failed:', error);
        }
    },
    
    destroy() {
        this.context.off('data:changed');
    }
};
```

## Проверка работы

### ✅ Чеклист
- [ ] Создан manifest.json с корректными данными
- [ ] Создан plugin.js с IPlugin интерфейсом
- [ ] Все функции имеют FUNC_ID
- [ ] Используется DOMFactory для элементов
- [ ] Плагин регистрируется в PluginManager
- [ ] Создана документация (README.md)
- [ ] project_registry.json обновлён
- [ ] dependencies_map.json обновлён
- [ ] todo.json обновлён
- [ ] changelog.md обновлён

### Консоль должна показать:
```
[PLUGIN_{Name}_VER_1.0] Initializing...
[PLUGIN_{Name}_VER_1.0] Initialized
[PluginManager] Plugin loaded: PLUGIN_{Name}_VER_1.0
```

### Inspector должен показать:
```
// При наведении на элементы плагина
MODULE_ID: PLUGIN_{Name}_VER_1.0
COMPONENT_ID: COMP_PluginButton
FUNCTION_ID: FUNC_setupUI_002
```

## Troubleshooting

### Проблема: PluginManager не найден
**Решение:** Создать PluginManager сначала
```javascript
// Проверить наличие
if (!window.pluginManager) {
    console.error('Создайте MODULE_PluginManager_VER_1.0 сначала');
}
```

### Проблема: Плагин не загружается
**Решение:** Проверить manifest.json
```javascript
// Проверить синтаксис JSON
try {
    const manifest = JSON.parse(manifestContent);
    console.log('Manifest valid:', manifest);
} catch (e) {
    console.error('Invalid manifest:', e);
}
```

### Проблема: Зависимости не найдены
**Решение:** Проверить порядок загрузки
```javascript
// Загрузить зависимости сначала
const deps = manifest.dependencies;
deps.forEach(dep => {
    if (!isModuleLoaded(dep)) {
        console.error(`Dependency ${dep} not loaded`);
    }
});
```

## См. также
- [create-module.md](create-module.md) - Создание модуля
- [add-function.md](add-function.md) - Добавление функции
- [project-standards.md](../project-standards.md) - Стандарты PromAi
