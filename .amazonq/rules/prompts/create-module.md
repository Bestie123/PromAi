# Create Module

Создай новый модуль: {название}

## Параметры
- Название модуля: {MODULE_NAME}
- Версия: 1.0 (по умолчанию)
- Слой: LAYER_1_CORE / LAYER_2_DATA / LAYER_3_UI / LAYER_4_INTEGRATION / LAYER_5_KNOWLEDGE
- Зависимости: {список MODULE_*_VER_*}

## Архитектурные слои

### LAYER_1_CORE (Базовые утилиты)
- **Может зависеть от:** никого
- **Примеры:** DOMFactory, FunctionTracer, DependencyValidator, Inspector
- **Назначение:** Базовая функциональность без зависимостей

### LAYER_2_DATA (Управление данными)
- **Может зависеть от:** LAYER_1_CORE
- **Примеры:** DataManager
- **Назначение:** CRUD операции, LocalStorage, структура данных

### LAYER_3_UI (UI компоненты)
- **Может зависеть от:** LAYER_1_CORE, LAYER_2_DATA
- **Примеры:** UIManager, AccordionManager, ChecklistManager
- **Назначение:** Отображение интерфейса, компоненты

### LAYER_4_INTEGRATION (Интеграции)
- **Может зависеть от:** LAYER_1_CORE, LAYER_2_DATA, LAYER_3_UI
- **Примеры:** AuthManager
- **Назначение:** Внешние сервисы (GitHub, API)

### LAYER_5_KNOWLEDGE (База знаний)
- **Может зависеть от:** LAYER_1_CORE, LAYER_2_DATA, LAYER_3_UI
- **Примеры:** KnowledgeManager, KnowledgeEditor
- **Назначение:** Специфичная функциональность приложения

## Требования

### 1. Структура модуля
```javascript
// MODULE_{Name}_VER_1.0
const moduleName = {
    moduleId: 'MODULE_{Name}_VER_1.0',
    version: '1.0',
    dependencies: ['MODULE_Dependency1_VER_1.0', 'MODULE_Dependency2_VER_1.0'],
    
    // FUNC_{functionName}_001 - Описание
    functionName() {
        // Реализация
    }
};

window.moduleName = moduleName;
```

### 2. Data-атрибуты для Inspector
Все создаваемые DOM элементы должны иметь:
```javascript
const element = domFactory.create({
    moduleId: 'MODULE_{Name}_VER_1.0',
    componentId: 'COMP_{ComponentName}',
    functionId: 'FUNC_{functionName}_001'
});
```

### 3. SOLID принципы
- **Single Responsibility:** Модуль отвечает за одну область
- **Open/Closed:** Расширяемый через добавление функций
- **Liskov Substitution:** Не применимо (нет наследования)
- **Interface Segregation:** Чёткие публичные методы
- **Dependency Inversion:** Зависимости через window объект

### 4. Минимальный код
- Без избыточности
- DRY (Don't Repeat Yourself)
- Чёткие имена функций
- Комментарии только для FUNC_ID

### 5. Слабая связанность
- Модуль не знает о внутренностях зависимостей
- Использует только публичные методы
- Не создаёт циклических зависимостей

## Проверки перед созданием

### 1. Проверить зависимости
```javascript
// Все зависимости существуют в project_registry.json
const dependencies = ['MODULE_DataManager_VER_1.0', 'MODULE_UIManager_VER_1.0'];
dependencies.forEach(dep => {
    if (!window[dep.split('_')[1].toLowerCase() + 'Manager']) {
        console.error(`Зависимость ${dep} не найдена!`);
    }
});
```

### 2. Проверить циклы
```javascript
// Нет циклических зависимостей в dependencies_map.json
// Используй DependencyValidator
const cycles = window.dependencyValidator.findCycles();
if (cycles.length > 0) {
    console.error('Найдены циклы:', cycles);
}
```

### 3. Проверить правила слоёв
```javascript
// Зависимости соответствуют правилам слоёв
// Например, LAYER_2_DATA не может зависеть от LAYER_3_UI
const violations = window.dependencyValidator.checkLayerViolations();
if (violations.length > 0) {
    console.error('Нарушения правил слоёв:', violations);
}
```

## Создать

### 1. Файл src/modules/{Name}.js
```javascript
// MODULE_{Name}_VER_1.0
const {name} = {
    moduleId: 'MODULE_{Name}_VER_1.0',
    version: '1.0',
    dependencies: [],
    
    // FUNC_init_001 - Инициализация модуля
    init() {
        console.log(`[${this.moduleId}] Initialized`);
    },
    
    // FUNC_{functionName}_002 - Описание функции
    {functionName}() {
        // Реализация
    }
};

window.{name} = {name};
```

### 2. Регистрация в main.js (если нужно)
```javascript
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация модуля
    if (window.{name}) {
        window.{name}.init();
    }
});
```

### 3. Документация (опционально)
Создать `docs/guides/{Name}_GUIDE.md` с:
- Обзор
- Зачем нужно
- Как работает
- API Reference
- Примеры
- Troubleshooting

## Обновить файлы

### 1. project_registry.json
```json
{
  "modules": {
    "MODULE_{Name}_VER_1.0": {
      "path": "src/modules/{Name}.js",
      "functions": ["FUNC_init_001", "FUNC_{functionName}_002"],
      "dependencies": ["MODULE_Dependency1_VER_1.0"],
      "status": "active",
      "layer": "LAYER_X_XXX"
    }
  }
}
```

### 2. dependencies_map.json
```json
{
  "nodes": [
    {"id": "MODULE_{Name}_VER_1.0", "type": "module", "layer": "LAYER_X_XXX"}
  ],
  "edges": [
    {"from": "MODULE_{Name}_VER_1.0", "to": "MODULE_Dependency1_VER_1.0", "type": "depends"}
  ]
}
```

### 3. architecture_layers.json
```json
{
  "layers": {
    "LAYER_X_XXX": {
      "modules": ["MODULE_{Name}_VER_1.0"]
    }
  },
  "moduleDetails": {
    "MODULE_{Name}_VER_1.0": {
      "layer": "LAYER_X_XXX",
      "purpose": "Описание назначения",
      "dependencies": ["MODULE_Dependency1_VER_1.0"],
      "dependents": 0
    }
  }
}
```

### 4. todo.json
```json
{
  "tasks": [{
    "id": "TASK_XXX",
    "title": "Создать тесты для MODULE_{Name}_VER_1.0",
    "status": "backlog",
    "assignedTo": "MODULE_{Name}_VER_1.0"
  }]
}
```

### 5. changelog.md
```markdown
## [1.X.0] - YYYY-MM-DD
### Added
- MODULE_{Name}_VER_1.0 - Описание функциональности
- FUNC_init_001, FUNC_{functionName}_002
```

## Примеры использования

### Пример 1: Модуль LAYER_1_CORE (без зависимостей)
```javascript
// MODULE_Logger_VER_1.0
const logger = {
    moduleId: 'MODULE_Logger_VER_1.0',
    version: '1.0',
    dependencies: [],
    
    // FUNC_log_001 - Логирование сообщения
    log(message, level = 'info') {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
    },
    
    // FUNC_error_002 - Логирование ошибки
    error(message) {
        this.log(message, 'error');
    }
};

window.logger = logger;
```

**Обновить:**
- project_registry.json: добавить MODULE_Logger_VER_1.0
- dependencies_map.json: узел без связей
- architecture_layers.json: добавить в LAYER_1_CORE
- todo.json: TASK тестирования
- changelog.md: Added MODULE_Logger_VER_1.0

### Пример 2: Модуль LAYER_3_UI (с зависимостями)
```javascript
// MODULE_NotificationManager_VER_1.0
const notificationManager = {
    moduleId: 'MODULE_NotificationManager_VER_1.0',
    version: '1.0',
    dependencies: ['MODULE_DOMFactory_VER_1.0', 'MODULE_UIManager_VER_1.0'],
    
    // FUNC_show_001 - Показать уведомление
    show(message, type = 'info') {
        const notification = window.domFactory.create({
            moduleId: this.moduleId,
            componentId: 'COMP_Notification',
            functionId: 'FUNC_show_001',
            className: `notification notification-${type}`,
            innerHTML: message
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
};

window.notificationManager = notificationManager;
```

**Обновить:**
- project_registry.json: добавить MODULE_NotificationManager_VER_1.0
- dependencies_map.json: связи с DOMFactory и UIManager
- architecture_layers.json: добавить в LAYER_3_UI
- todo.json: TASK тестирования
- changelog.md: Added MODULE_NotificationManager_VER_1.0

### Пример 3: Модуль с интеграцией Inspector
```javascript
// MODULE_SearchEngine_VER_1.0
const searchEngine = {
    moduleId: 'MODULE_SearchEngine_VER_1.0',
    version: '1.0',
    dependencies: ['MODULE_DataManager_VER_1.0', 'MODULE_DOMFactory_VER_1.0'],
    
    // FUNC_search_001 - Поиск по базе знаний
    search(query) {
        const results = [];
        const data = window.techData.categories;
        
        // Рекурсивный поиск
        const traverse = (nodes) => {
            nodes.forEach(node => {
                if (node.name.toLowerCase().includes(query.toLowerCase())) {
                    results.push(node);
                }
                if (node.children) {
                    traverse(node.children);
                }
            });
        };
        
        traverse(data);
        return results;
    },
    
    // FUNC_renderResults_002 - Отображение результатов
    renderResults(results) {
        const container = window.domFactory.create({
            moduleId: this.moduleId,
            componentId: 'COMP_SearchResults',
            functionId: 'FUNC_renderResults_002',
            className: 'search-results'
        });
        
        results.forEach(result => {
            const item = window.domFactory.create({
                moduleId: this.moduleId,
                componentId: 'COMP_SearchResultItem',
                className: 'search-result-item',
                innerHTML: result.name
            });
            container.appendChild(item);
        });
        
        return container;
    }
};

window.searchEngine = searchEngine;
```

## Проверка работы

### Консоль должна показать:
```
[MODULE_{Name}_VER_1.0] Initialized
```

### Inspector должен показать:
- MODULE_ID: MODULE_{Name}_VER_1.0
- COMPONENT_ID: COMP_{ComponentName}
- FUNCTION_ID: FUNC_{functionName}_001

### DependencyValidator должен подтвердить:
```javascript
const report = window.dependencyValidator.validate();
console.log(report.isValid); // true
console.log(report.cycles.length); // 0
console.log(report.layerViolations.length); // 0
```

## Troubleshooting

### Проблема: Модуль не инициализируется
**Решение:** Проверить загрузку скрипта
```javascript
console.log(window.{name}); // должен быть объект
```

### Проблема: Зависимости не найдены
**Решение:** Проверить порядок загрузки в index.html
```html
<!-- Сначала зависимости -->
<script src="modules/DOMFactory.js"></script>
<!-- Потом модуль -->
<script src="modules/{Name}.js"></script>
```

### Проблема: Нарушение правил слоёв
**Решение:** Проверить architecture_layers.json
```javascript
const violations = window.dependencyValidator.checkLayerViolations();
console.log(violations);
```

## Следующие шаги

### После создания модуля:
1. **Добавить функции:** `@PROMPT_add-function`
2. **Создать тесты:** `@PROMPT_create-tests`
3. **Код-ревью:** `@PROMPT_code-review`
4. **Обновить документацию:** Создать `docs/{Name}_GUIDE.md`

## См. также
- [add-function.md](add-function.md) - Добавление функций
- [create-tests.md](create-tests.md) - Создание тестов
- [project-standards.md](../project-standards.md) - Стандарты PromAi
- [architecture_layers.json](../../architecture_layers.json) - Определение слоёв
