# Refactor to PromAi Standards

Рефактори проект под стандарты PromAi: {укажи путь к проекту}

## Параметры
- **Проект:** {путь к корню проекта}
- **Название:** {PROJECT_{Name}}
- **Язык:** {JavaScript/Python/TypeScript/другой}
- **Текущее состояние:** {описание проекта}

## Шаг 1: Анализ структуры

### Сканирование проекта
```bash
# Найти все файлы кода
find . -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx"

# Подсчитать модули
ls -la src/

# Проверить зависимости
cat package.json
```

### Создать карту архитектуры
```javascript
// Определить модули
const modules = [
    { name: 'UserManager', path: 'src/managers/UserManager.js', functions: 5 },
    { name: 'DataService', path: 'src/services/DataService.js', functions: 8 },
    // ...
];

// Определить зависимости
const dependencies = [
    { from: 'UserManager', to: 'DataService' },
    // ...
];
```

### Оценить объём работы
- Количество модулей: {число}
- Количество функций: {число}
- Количество DOM элементов: {число}
- Оценка времени: {часы}

## Шаг 2: Присвоение ID

### Проект
```javascript
const projectId = 'PROJECT_{Name}';
```

### Модули
```javascript
// Для каждого модуля
const moduleId = 'MODULE_{Name}_VER_1.0';

// Пример:
// UserManager.js → MODULE_UserManager_VER_1.0
// DataService.js → MODULE_DataService_VER_1.0
```

### Функции
```javascript
// Для каждой функции в модуле
const funcId = 'FUNC_{name}_{number}';

// Пример:
// createUser() → FUNC_createUser_001
// deleteUser() → FUNC_deleteUser_002
// updateUser() → FUNC_updateUser_003
```

### Компоненты
```javascript
// Для каждого UI компонента
const componentId = 'COMP_{Name}';

// Пример:
// <button> → COMP_SaveButton
// <div class="modal"> → COMP_Modal
```

## Шаг 3: Создание state файлов

### 1. project_registry.json
```json
{
  "projectId": "PROJECT_{Name}",
  "version": "1.0.0",
  "created": "2024-01-15",
  "description": "Рефакторинг под PromAi стандарты",
  "modules": {},
  "stats": {
    "totalModules": 0,
    "totalFunctions": 0
  }
}
```

### 2. dependencies_map.json
```json
{
  "projectId": "PROJECT_{Name}",
  "version": "1.0.0",
  "nodes": [],
  "edges": []
}
```

### 3. architecture_layers.json
```json
{
  "projectId": "PROJECT_{Name}",
  "layers": {
    "LAYER_1_CORE": {
      "name": "Core Utilities",
      "canDependOn": [],
      "modules": []
    },
    "LAYER_2_DATA": {
      "name": "Data Management",
      "canDependOn": ["LAYER_1_CORE"],
      "modules": []
    },
    "LAYER_3_UI": {
      "name": "UI Components",
      "canDependOn": ["LAYER_1_CORE", "LAYER_2_DATA"],
      "modules": []
    },
    "LAYER_4_INTEGRATION": {
      "name": "Integration Layer",
      "canDependOn": ["LAYER_1_CORE", "LAYER_2_DATA", "LAYER_3_UI"],
      "modules": []
    },
    "LAYER_5_KNOWLEDGE": {
      "name": "Knowledge Layer",
      "canDependOn": ["LAYER_1_CORE", "LAYER_2_DATA", "LAYER_3_UI", "LAYER_4_INTEGRATION"],
      "modules": []
    }
  }
}
```

### 4. function_registry.json
```json
{
  "projectId": "PROJECT_{Name}",
  "version": "1.0.0",
  "functions": {},
  "callGraph": {
    "nodes": [],
    "edges": []
  }
}
```

### 5. todo.json
```json
{
  "projectId": "PROJECT_{Name}",
  "tasks": [
    {
      "id": "TASK_001",
      "title": "Рефакторинг завершен",
      "status": "done",
      "created": "2024-01-15"
    }
  ]
}
```

### 6. changelog.md
```markdown
# Changelog

## [1.0.0] - 2024-01-15
### Added
- Рефакторинг под стандарты PromAi
- Добавлены MODULE_ID для всех модулей
- Добавлены FUNC_ID для всех функций
- Создан Inspector для отладки
- Добавлены data-атрибуты в DOM
```

### 7. metrics.json
```json
{
  "projectId": "PROJECT_{Name}",
  "version": "1.0.0",
  "lastUpdated": "2024-01-15",
  "maintainability": 100,
  "totalModules": 0,
  "totalFunctions": 0,
  "cyclicDependencies": 0,
  "unusedFunctions": 0
}
```

## Шаг 4: Модификация кода

### Добавить ID в модули
```javascript
// ❌ Было
class UserManager {
  constructor() {}
  createUser() {}
  deleteUser() {}
}

// ✅ Стало
// MODULE_UserManager_VER_1.0
const userManager = {
    moduleId: 'MODULE_UserManager_VER_1.0',
    version: '1.0',
    dependencies: [],
    
    // FUNC_createUser_001 - Создание пользователя
    createUser(data) {
        // код
    },
    
    // FUNC_deleteUser_002 - Удаление пользователя
    deleteUser(id) {
        // код
    }
};

window.userManager = userManager;
```

### Добавить data-атрибуты в DOM
```javascript
// ❌ Было
const button = document.createElement('button');
button.textContent = 'Save';
button.onclick = () => save();

// ✅ Стало
const button = domFactory.create({
    tag: 'button',
    moduleId: 'MODULE_UserManager_VER_1.0',
    componentId: 'COMP_SaveButton',
    functionId: 'FUNC_save_003',
    textContent: 'Save',
    events: {
        click: () => this.save()
    }
});
```

### Реструктуризировать под SOLID
```javascript
// ❌ Было - нарушение SRP
class UserManager {
    createUser() { /* ... */ }
    saveToDatabase() { /* ... */ }
    sendEmail() { /* ... */ }
    renderUI() { /* ... */ }
}

// ✅ Стало - разделение ответственности
// MODULE_UserManager_VER_1.0 (LAYER_2_DATA)
const userManager = {
    createUser() { /* ... */ },
    deleteUser() { /* ... */ }
};

// MODULE_UserService_VER_1.0 (LAYER_2_DATA)
const userService = {
    saveToDatabase() { /* ... */ },
    loadFromDatabase() { /* ... */ }
};

// MODULE_EmailService_VER_1.0 (LAYER_4_INTEGRATION)
const emailService = {
    sendEmail() { /* ... */ }
};

// MODULE_UserUI_VER_1.0 (LAYER_3_UI)
const userUI = {
    renderUI() { /* ... */ }
};
```

## Шаг 5: Добавить Inspector

### Создать модуль Inspector
```javascript
// MODULE_Inspector_VER_1.0
const inspector = {
    moduleId: 'MODULE_Inspector_VER_1.0',
    version: '1.0',
    dependencies: [],
    active: false,
    
    // FUNC_init_001 - Инициализация Inspector
    init() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                this.toggle();
            }
        });
        console.log('[MODULE_Inspector_VER_1.0] Press F2 to activate');
    },
    
    // FUNC_toggle_002 - Переключение Inspector
    toggle() {
        this.active = !this.active;
        console.log(`[Inspector] ${this.active ? 'Activated' : 'Deactivated'}`);
    }
};

window.inspector = inspector;
```

### Добавить DOMFactory
```javascript
// MODULE_DOMFactory_VER_1.0
const domFactory = {
    moduleId: 'MODULE_DOMFactory_VER_1.0',
    version: '1.0',
    dependencies: [],
    
    // FUNC_create_001 - Создание элемента с data-атрибутами
    create(config) {
        const el = document.createElement(config.tag || 'div');
        if (config.moduleId) el.setAttribute('data-module-id', config.moduleId);
        if (config.componentId) el.setAttribute('data-component-id', config.componentId);
        if (config.functionId) el.setAttribute('data-function-id', config.functionId);
        if (config.className) el.className = config.className;
        if (config.textContent) el.textContent = config.textContent;
        return el;
    }
};

window.domFactory = domFactory;
```

## Шаг 6: Создать правила

### .amazonq/rules/project-standards.md
```markdown
# PromAi Project Standards

## ID Naming Convention
- **Проекты:** `PROJECT_{Name}`
- **Модули:** `MODULE_{Name}_VER_{version}`
- **Функции:** `FUNC_{name}_{number}`
- **Компоненты:** `COMP_{Name}`

## Required State Files
При создании/изменении кода ВСЕГДА обновляй:
- `project_registry.json`
- `dependencies_map.json`
- `function_registry.json`
- `todo.json`
- `changelog.md`

## Code Requirements
- Используй DOMFactory для создания элементов
- Добавляй data-атрибуты для Inspector
- Следуй принципам SOLID
- Минимальный код без избыточности
```

### .amazonq/rules/auto-documentation.md
```markdown
# Автоматическая документация

## При добавлении нового функционала ВСЕГДА создавай:

1. **Промпт:** `.amazonq/prompts/PROMPT_{Name}.md`
2. **Документация:** `docs/{Name}_GUIDE.md`
3. **Обновление README.md**
4. **Обновление state файлов**
```

## Шаг 7: Обновить state файлы

### Для каждого модуля
```json
{
  "modules": {
    "MODULE_UserManager_VER_1.0": {
      "path": "src/managers/UserManager.js",
      "functions": ["FUNC_createUser_001", "FUNC_deleteUser_002"],
      "dependencies": ["MODULE_DataService_VER_1.0"],
      "status": "active",
      "layer": "LAYER_2_DATA"
    },
    "MODULE_DataService_VER_1.0": {
      "path": "src/services/DataService.js",
      "functions": ["FUNC_save_001", "FUNC_load_002"],
      "dependencies": [],
      "status": "active",
      "layer": "LAYER_1_CORE"
    }
  },
  "stats": {
    "totalModules": 2,
    "totalFunctions": 4
  }
}
```

### Обновить dependencies_map.json
```json
{
  "nodes": [
    {"id": "MODULE_UserManager_VER_1.0", "layer": "LAYER_2_DATA"},
    {"id": "MODULE_DataService_VER_1.0", "layer": "LAYER_1_CORE"}
  ],
  "edges": [
    {"from": "MODULE_UserManager_VER_1.0", "to": "MODULE_DataService_VER_1.0"}
  ]
}
```

### Обновить function_registry.json
```json
{
  "functions": {
    "FUNC_createUser_001": {
      "moduleId": "MODULE_UserManager_VER_1.0",
      "name": "createUser",
      "callers": [],
      "callees": ["FUNC_save_001"]
    },
    "FUNC_save_001": {
      "moduleId": "MODULE_DataService_VER_1.0",
      "name": "save",
      "callers": ["FUNC_createUser_001"],
      "callees": []
    }
  }
}
```

## Шаг 8: Создать документацию

### README.md
```markdown
# PROJECT_{Name}

> Описание проекта

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](changelog.md)
[![Standards](https://img.shields.io/badge/standards-PromAi-orange.svg)](.amazonq/rules/project-standards.md)

## 🚀 Быстрый старт

1. Открыть `src/index.html`
2. Активировать Inspector: `F2`
3. Готово! 🎉

## 🏗️ Архитектура

- **Модулей:** {число}
- **Функций:** {число}
- **Слоёв:** {число}

## 📚 Документация

- [QUICK_START.md](QUICK_START.md)
- [project-standards.md](.amazonq/rules/project-standards.md)
```

### QUICK_START.md
```markdown
# Быстрый старт

## 30 секунд до запуска

1. **Открыть:** `src/index.html`
2. **Активировать Inspector:** `F2`
3. **Готово!** 🎉
```

## Примеры использования

### Пример 1: Простой проект (5 модулей)
```
Проект: /path/to/simple-app
Название: PROJECT_SimpleApp
Язык: JavaScript
Модулей: 5
Функций: ~20
Время: 2-3 часа
```

### Пример 2: Средний проект (15 модулей)
```
Проект: /path/to/medium-app
Название: PROJECT_MediumApp
Язык: TypeScript
Модулей: 15
Функций: ~80
Время: 1-2 дня
```

### Пример 3: Большой проект (50+ модулей)
```
Проект: /path/to/large-app
Название: PROJECT_LargeApp
Язык: JavaScript
Модулей: 50+
Функций: ~300+
Время: 1 неделя
```

## Проверка результата

### ✅ Чеклист
- [ ] Все модули имеют MODULE_ID
- [ ] Все функции имеют FUNC_ID
- [ ] Все DOM элементы имеют data-атрибуты
- [ ] Созданы 7 state файлов (registry, dependencies, architecture_layers, function_registry, todo, changelog, metrics)
- [ ] Inspector работает (F2)
- [ ] Правила PromAi в .amazonq/rules/
- [ ] Документация создана (README, QUICK_START)
- [ ] Функциональность сохранена
- [ ] Код следует SOLID принципам
- [ ] Нет циклических зависимостей

### Консоль должна показать:
```
[MODULE_Inspector_VER_1.0] Press F2 to activate
[PROJECT_{Name}] Initializing...
[PROJECT_{Name}] Ready!
// Нет ошибок
```

### Inspector должен показать:
```
// При наведении на элементы
MODULE_ID: MODULE_UserManager_VER_1.0
COMPONENT_ID: COMP_SaveButton
FUNCTION_ID: FUNC_save_003
```

### Валидация зависимостей
```javascript
// Проверить циклы
const cycles = dependencyValidator.findCycles();
console.log('Cycles:', cycles.length); // должно быть 0

// Проверить правила слоёв
const violations = dependencyValidator.checkLayerViolations();
console.log('Violations:', violations.length); // должно быть 0
```

## Troubleshooting

### Проблема: Слишком много модулей
**Решение:** Разбить рефакторинг на этапы
```
Этап 1: LAYER_1_CORE (базовые утилиты)
Этап 2: LAYER_2_DATA (данные)
Этап 3: LAYER_3_UI (интерфейс)
```

### Проблема: Сложные зависимости
**Решение:** Использовать dependencies_map.json
```javascript
// Визуализировать граф
const graph = dependenciesMap;
console.log('Nodes:', graph.nodes.length);
console.log('Edges:', graph.edges.length);
```

### Проблема: Функциональность сломалась
**Решение:** Откатить изменения и рефакторить постепенно
```bash
git checkout -- .
git clean -fd
# Начать заново с меньшим объёмом
```

## См. также
- [init-project.md](init-project.md) - Инициализация нового проекта
- [create-module.md](create-module.md) - Создание модуля
- [add-function.md](add-function.md) - Добавление функции
- [project-standards.md](../project-standards.md) - Стандарты PromAi
