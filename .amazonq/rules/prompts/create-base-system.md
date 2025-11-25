# ПРОМПТ: Создание базовой системы

## Когда использовать
- **Быстрое прототипирование** (20 минут до рабочей системы)
- Минимальная система с 3 модулями (DOMFactory, DataManager, UIManager)
- Когда не нужна полная документация
- Для обучения и экспериментов

**Альтернатива:** Для полной инициализации используй `init-project.md`

## Что создаёт
Минимальную рабочую систему с:
- 3 базовых модуля (CORE слой)
- Полная структура директорий
- Все state файлы
- Рабочий HTML интерфейс
- Inspector для отладки

## Параметры
```
Название проекта: {PROJECT_NAME}
Тип: Web App (по умолчанию)
Описание: {краткое описание}
```

## Шаг 1: Создать структуру

```bash
mkdir -p {PROJECT_NAME}/src/modules
mkdir -p {PROJECT_NAME}/src/styles
mkdir -p {PROJECT_NAME}/.amazonq/rules
mkdir -p {PROJECT_NAME}/docs
```

## Шаг 2: Создать 3 базовых модуля

### 1. DOMFactory (LAYER_1_CORE)
```javascript
// MODULE_DOMFactory_VER_1.0
const domFactory = {
    moduleId: 'MODULE_DOMFactory_VER_1.0',
    version: '1.0',
    dependencies: [],
    
    // FUNC_create_001
    create(config) {
        const el = document.createElement(config.tag || 'div');
        if (config.moduleId) el.setAttribute('data-module-id', config.moduleId);
        if (config.componentId) el.setAttribute('data-component-id', config.componentId);
        if (config.className) el.className = config.className;
        if (config.textContent) el.textContent = config.textContent;
        return el;
    }
};
window.domFactory = domFactory;
```

### 2. DataManager (LAYER_2_DATA)
```javascript
// MODULE_DataManager_VER_1.0
const dataManager = {
    moduleId: 'MODULE_DataManager_VER_1.0',
    version: '1.0',
    dependencies: ['MODULE_DOMFactory_VER_1.0'],
    data: {},
    
    // FUNC_save_001
    save() {
        localStorage.setItem('appData', JSON.stringify(this.data));
    },
    
    // FUNC_load_002
    load() {
        const stored = localStorage.getItem('appData');
        if (stored) this.data = JSON.parse(stored);
    }
};
window.dataManager = dataManager;
```

### 3. UIManager (LAYER_3_UI)
```javascript
// MODULE_UIManager_VER_1.0
const uiManager = {
    moduleId: 'MODULE_UIManager_VER_1.0',
    version: '1.0',
    dependencies: ['MODULE_DOMFactory_VER_1.0', 'MODULE_DataManager_VER_1.0'],
    
    // FUNC_showNotification_001
    showNotification(message, type = 'info') {
        const notification = domFactory.create({
            moduleId: this.moduleId,
            componentId: 'COMP_Notification',
            className: `notification ${type}`,
            textContent: message
        });
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
};
window.uiManager = uiManager;
```

## Шаг 3: Создать HTML

### src/index.html
```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PROJECT_{Name}</title>
    <link rel="stylesheet" href="styles/main.css">
</head>
<body>
    <div id="app">
        <h1>PROJECT_{Name}</h1>
        <p>Система готова к работе!</p>
    </div>

    <script src="modules/DOMFactory.js"></script>
    <script src="modules/DataManager.js"></script>
    <script src="modules/UIManager.js"></script>
    <script src="main.js"></script>
</body>
</html>
```

### src/main.js
```javascript
document.addEventListener('DOMContentLoaded', function() {
    console.log('[PROJECT_{Name}] Initializing...');
    dataManager.load();
    uiManager.showNotification('✅ Система запущена!', 'success');
    console.log('[PROJECT_{Name}] Ready!');
});
```

### src/styles/main.css
```css
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Arial, sans-serif; padding: 20px; }
#app { max-width: 1200px; margin: 0 auto; }
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 5px;
    background: #4CAF50;
    color: white;
    animation: slideIn 0.3s;
}
@keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
}
```

## Шаг 4: Создать state файлы

### project_registry.json
```json
{
  "projectId": "PROJECT_{Name}",
  "version": "1.0.0",
  "modules": {
    "MODULE_DOMFactory_VER_1.0": {
      "path": "src/modules/DOMFactory.js",
      "functions": ["FUNC_create_001"],
      "dependencies": [],
      "layer": "LAYER_1_CORE"
    },
    "MODULE_DataManager_VER_1.0": {
      "path": "src/modules/DataManager.js",
      "functions": ["FUNC_save_001", "FUNC_load_002"],
      "dependencies": ["MODULE_DOMFactory_VER_1.0"],
      "layer": "LAYER_2_DATA"
    },
    "MODULE_UIManager_VER_1.0": {
      "path": "src/modules/UIManager.js",
      "functions": ["FUNC_showNotification_001"],
      "dependencies": ["MODULE_DOMFactory_VER_1.0", "MODULE_DataManager_VER_1.0"],
      "layer": "LAYER_3_UI"
    }
  },
  "stats": {
    "totalModules": 3,
    "totalFunctions": 4
  }
}
```

### dependencies_map.json
```json
{
  "projectId": "PROJECT_{Name}",
  "nodes": [
    {"id": "MODULE_DOMFactory_VER_1.0", "layer": "LAYER_1_CORE"},
    {"id": "MODULE_DataManager_VER_1.0", "layer": "LAYER_2_DATA"},
    {"id": "MODULE_UIManager_VER_1.0", "layer": "LAYER_3_UI"}
  ],
  "edges": [
    {"from": "MODULE_DataManager_VER_1.0", "to": "MODULE_DOMFactory_VER_1.0"},
    {"from": "MODULE_UIManager_VER_1.0", "to": "MODULE_DOMFactory_VER_1.0"},
    {"from": "MODULE_UIManager_VER_1.0", "to": "MODULE_DataManager_VER_1.0"}
  ]
}
```

### todo.json
```json
{
  "projectId": "PROJECT_{Name}",
  "tasks": [
    {
      "id": "TASK_001",
      "title": "Добавить первую функциональность",
      "status": "backlog",
      "priority": "high"
    }
  ]
}
```

### changelog.md
```markdown
# Changelog

## [1.0.0] - 2024-01-15
### Added
- Базовая система с 3 модулями
- DOMFactory, DataManager, UIManager
- HTML интерфейс
- State файлы
```

### metrics.json
```json
{
  "projectId": "PROJECT_{Name}",
  "version": "1.0.0",
  "lastUpdated": "2024-01-15",
  "maintainability": 100,
  "totalModules": 3,
  "totalFunctions": 4,
  "cyclicDependencies": 0,
  "unusedFunctions": 0
}
```

## Шаг 5: Создать документацию

### README.md
```markdown
# PROJECT_{Name}

> {Описание проекта}

## 🚀 Быстрый старт

1. Открыть `src/index.html`
2. Готово! 🎉

## 📦 Модули

- **DOMFactory** - Создание элементов
- **DataManager** - Управление данными
- **UIManager** - UI компоненты

## 🏗️ Архитектура

3 модуля в 3 слоях (CORE → DATA → UI)
```

### .amazonq/rules/project-standards.md
```markdown
# PromAi Standards

## ID Convention
- Проекты: `PROJECT_{Name}`
- Модули: `MODULE_{Name}_VER_{version}`
- Функции: `FUNC_{name}_{number}`

## State Files
Всегда обновляй:
- project_registry.json
- dependencies_map.json
- todo.json
- changelog.md
```

## Проверка работы

### ✅ Чеклист
- [ ] Открывается src/index.html
- [ ] Показывается уведомление "Система запущена!"
- [ ] Консоль: "[PROJECT_{Name}] Ready!"
- [ ] Нет ошибок в консоли
- [ ] Все 3 модуля загружены

### Консоль должна показать:
```
[PROJECT_{Name}] Initializing...
[PROJECT_{Name}] Ready!
```

## Следующие шаги

1. **Добавить функциональность:** `@PROMPT_create-module`
2. **Добавить Inspector:** Скопировать из примера
3. **Расширить UI:** Добавить компоненты
4. **Добавить интеграции:** GitHub, API и т.д.

## Примеры использования

### Пример 1: Todo App
```
Название: TodoApp
Описание: Простой менеджер задач
Дополнительно: Добавить модуль TaskManager
```

### Пример 2: Dashboard
```
Название: Dashboard
Описание: Панель управления
Дополнительно: Добавить модуль ChartManager
```

### Пример 3: CRM
```
Название: MiniCRM
Описание: Простая CRM система
Дополнительно: Добавить модуль ContactManager
```

## Что получаем

### ✅ Готовая система
- 3 модуля (4 функции)
- Рабочий HTML интерфейс
- LocalStorage персистентность
- Уведомления
- Все state файлы
- Документация

### ✅ Готово к расширению
- Модульная архитектура
- Чистые зависимости
- Стандарты PromAi
- Data-атрибуты для Inspector

### ✅ Production-ready
- Нет ошибок
- Нет циклических зависимостей
- Следует SOLID
- Минимальный код

## Время создания

- **Структура:** 2 минуты
- **Модули:** 5 минут
- **HTML/CSS:** 3 минуты
- **State файлы:** 5 минут
- **Документация:** 5 минут

**Итого: ~20 минут до рабочей системы!**

## Troubleshooting

### Проблема: Модули не загружаются
**Решение:** Проверить порядок <script> в index.html

### Проблема: Уведомление не показывается
**Решение:** Проверить CSS загружен

### Проблема: LocalStorage не работает
**Решение:** Открыть через http:// (не file://)

## См. также
- [init-project.md](init-project.md) - Полная инициализация
- [create-module.md](create-module.md) - Добавление модулей
- [project-standards.md](../project-standards.md) - Стандарты
