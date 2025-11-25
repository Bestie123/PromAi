# Init Project

Инициализируй новый проект: {название}

## Когда использовать
- **Полная инициализация проекта** с документацией и всеми state файлами
- Когда нужна production-ready структура
- Для долгосрочных проектов

**Альтернатива:** Для быстрого прототипирования используй `create-base-system.md`

## Параметры
- **Название проекта:** {PROJECT_NAME}
- **Тип:** Web App / Library / CLI / API
- **Технологии:** JavaScript / Python / TypeScript / другое
- **Архитектура:** Модульная (PromAi стандарты)

## Шаг 1: Создать структуру директорий

```
{PROJECT_NAME}/
├── src/                              # Исходный код
│   ├── modules/                      # Модули приложения
│   ├── styles/                       # Стили (если веб)
│   ├── index.html                    # Главная страница (если веб)
│   └── main.js                       # Точка входа
│
├── .amazonq/                         # Amazon Q конфигурация
│   ├── prompts/                      # Сохранённые промпты
│   └── rules/                        # Правила проекта
│       ├── project-standards.md      # Стандарты PromAi
│       ├── auto-documentation.md     # Правила документации
│       └── memory-bank/              # База знаний ИИ
│           ├── product.md            # Описание продукта
│           ├── tech.md               # Технологии
│           ├── structure.md          # Структура проекта
│           └── guidelines.md         # Гайдлайны разработки
│
├── docs/                             # Документация
│   └── guides/                       # Руководства
│
├── scripts/                          # Скрипты
│   └── generate-docs.js              # Генератор документации
│
├── project_registry.json             # Реестр модулей
├── dependencies_map.json             # Граф зависимостей
├── architecture_layers.json          # Архитектурные слои
├── function_registry.json            # Трассировка функций
├── todo.json                         # Задачи
├── changelog.md                      # История изменений
├── metrics.json                      # Метрики качества
│
├── README.md                         # Главная документация
└── QUICK_START.md                    # Быстрый старт
```

## Шаг 2: Создать state файлы

### project_registry.json
```json
{
  "projectId": "PROJECT_{Name}",
  "version": "1.0.0",
  "created": "2024-01-15",
  "description": "Описание проекта",
  "modules": {},
  "stats": {
    "totalModules": 0,
    "totalFunctions": 0,
    "totalLayers": 5
  }
}
```

### dependencies_map.json
```json
{
  "projectId": "PROJECT_{Name}",
  "version": "1.0.0",
  "nodes": [],
  "edges": []
}
```

### architecture_layers.json
```json
{
  "projectId": "PROJECT_{Name}",
  "layers": {
    "LAYER_1_CORE": {
      "name": "Core Utilities",
      "description": "Базовые утилиты без зависимостей",
      "canDependOn": [],
      "modules": []
    },
    "LAYER_2_DATA": {
      "name": "Data Management",
      "description": "Управление данными",
      "canDependOn": ["LAYER_1_CORE"],
      "modules": []
    },
    "LAYER_3_UI": {
      "name": "UI Components",
      "description": "UI компоненты",
      "canDependOn": ["LAYER_1_CORE", "LAYER_2_DATA"],
      "modules": []
    },
    "LAYER_4_INTEGRATION": {
      "name": "Integration Layer",
      "description": "Внешние интеграции",
      "canDependOn": ["LAYER_1_CORE", "LAYER_2_DATA", "LAYER_3_UI"],
      "modules": []
    },
    "LAYER_5_KNOWLEDGE": {
      "name": "Knowledge Layer",
      "description": "Специфичная функциональность приложения",
      "canDependOn": ["LAYER_1_CORE", "LAYER_2_DATA", "LAYER_3_UI", "LAYER_4_INTEGRATION"],
      "modules": []
    }
  }
}
```

### function_registry.json
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

### todo.json
```json
{
  "projectId": "PROJECT_{Name}",
  "tasks": [
    {
      "id": "TASK_001",
      "title": "Создать первый модуль",
      "status": "backlog",
      "priority": "high",
      "created": "2024-01-15",
      "estimatedHours": 2
    }
  ],
  "backlog": ["TASK_001"],
  "inProgress": [],
  "done": []
}
```

### changelog.md
```markdown
# Changelog

## [1.0.0] - 2024-01-15
### Added
- Инициализация проекта PROJECT_{Name}
- Создана структура директорий
- Созданы state файлы
- Настроены стандарты PromAi
```

### metrics.json
```json
{
  "projectId": "PROJECT_{Name}",
  "version": "1.0.0",
  "lastUpdated": "2024-01-15",
  "maintainability": 100,
  "totalModules": 0,
  "totalFunctions": 0,
  "cyclicDependencies": 0,
  "unusedFunctions": 0,
  "codeQuality": {
    "score": 100,
    "issues": []
  }
}
```

## Шаг 3: Создать базовые модули

### src/modules/DOMFactory.js (LAYER_1_CORE)
```javascript
// MODULE_DOMFactory_VER_1.0
const domFactory = {
    moduleId: 'MODULE_DOMFactory_VER_1.0',
    version: '1.0',
    dependencies: [],
    
    // FUNC_create_001 - Создание DOM элемента с data-атрибутами
    create(config) {
        const element = document.createElement(config.tag || 'div');
        
        if (config.moduleId) element.setAttribute('data-module-id', config.moduleId);
        if (config.componentId) element.setAttribute('data-component-id', config.componentId);
        if (config.functionId) element.setAttribute('data-function-id', config.functionId);
        if (config.className) element.className = config.className;
        if (config.textContent) element.textContent = config.textContent;
        if (config.innerHTML) element.innerHTML = config.innerHTML;
        
        if (config.attributes) {
            Object.entries(config.attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
        }
        
        return element;
    }
};

window.domFactory = domFactory;
```



### src/main.js
```javascript
// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    console.log('[PROJECT_{Name}] Initializing...');
    
    // Инициализация модулей
    
    console.log('[PROJECT_{Name}] Ready!');
});
```

## Шаг 4: Создать документацию

### README.md
```markdown
# PROJECT_{Name}

> Описание проекта

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](changelog.md)
[![Standards](https://img.shields.io/badge/standards-PromAi-orange.svg)](.amazonq/rules/project-standards.md)

## 🚀 Быстрый старт

\`\`\`bash
# Открыть приложение
Открыть файл: src/index.html

# Активировать Inspector
Нажать: F2
\`\`\`

## ✨ Возможности

- ✅ Модульная архитектура
- ✅ Inspector для отладки
- ✅ Автогенерация data-атрибутов
- ✅ Стандарты PromAi

## 🏗️ Архитектура

- **Модулей:** 2
- **Функций:** 3
- **Слоёв:** 5

## 📚 Документация

- [QUICK_START.md](QUICK_START.md) - Быстрый старт
- [project-standards.md](.amazonq/rules/project-standards.md) - Стандарты

## 📝 Лицензия

MIT
```

### QUICK_START.md
```markdown
# Быстрый старт - PROJECT_{Name}

## 30 секунд до запуска

1. **Открыть:** `src/index.html`
2. **Активировать Inspector:** `F2`
3. **Готово!** 🎉

## Следующие шаги

1. Создать первый модуль: `@PROMPT_create-module`
2. Добавить функциональность
3. Обновить state файлы
```

## Шаг 5: Создать правила Amazon Q

### .amazonq/rules/project-standards.md
```markdown
# PromAi Project Standards

## ID Naming Convention
- **Проекты:** \`PROJECT_{Name}\`
- **Модули:** \`MODULE_{Name}_VER_{version}\`
- **Функции:** \`FUNC_{name}_{number}\`
- **Компоненты:** \`COMP_{Name}\`
- **Задачи:** \`TASK_{number}\`

## Required State Files
При создании/изменении кода ВСЕГДА обновляй:
- \`project_registry.json\` - реестр модулей
- \`dependencies_map.json\` - граф зависимостей
- \`function_registry.json\` - трассировка функций
- \`todo.json\` - задачи
- \`changelog.md\` - история изменений

## Code Requirements
- Добавляй \`data-module-id\`, \`data-component-id\` для Inspector
- Используй DOMFactory для создания элементов
- Следуй принципам SOLID
- Минимальный код без избыточности
```

### .amazonq/rules/auto-documentation.md
```markdown
# Автоматическая документация

## При добавлении нового функционала ВСЕГДА создавай:

1. **Промпт:** \`.amazonq/prompts/PROMPT_{Name}.md\`
2. **Документация:** \`docs/{Name}_GUIDE.md\`
3. **Обновление README.md**
4. **Обновление state файлов**
```

## Шаг 6: Обновить state файлы

### Обновить project_registry.json
```json
{
  "modules": {
    "MODULE_DOMFactory_VER_1.0": {
      "path": "src/modules/DOMFactory.js",
      "functions": ["FUNC_create_001"],
      "dependencies": [],
      "status": "active",
      "layer": "LAYER_1_CORE"
    },

  },
  "stats": {
    "totalModules": 1,
    "totalFunctions": 1,
    "totalLayers": 5
  }
}
```

### Обновить dependencies_map.json
```json
{
  "nodes": [
    {"id": "MODULE_DOMFactory_VER_1.0", "type": "module", "layer": "LAYER_1_CORE"}
  ],
  "edges": []
}
```

### Обновить architecture_layers.json
```json
{
  "layers": {
    "LAYER_1_CORE": {
      "modules": ["MODULE_DOMFactory_VER_1.0"]
    }
  }
}
```

## Проверка инициализации

### ✅ Чеклист
- [ ] Создана структура директорий
- [ ] Созданы все state файлы
- [ ] Созданы базовые модули (DOMFactory, Inspector)
- [ ] Создана документация (README, QUICK_START)
- [ ] Созданы правила Amazon Q
- [ ] Проект открывается в браузере
- [ ] Inspector активируется (F2)
- [ ] Консоль показывает инициализацию

### Консоль должна показать:
```
[MODULE_Inspector_VER_1.0] Initialized. Press F2 to activate
[PROJECT_{Name}] Initializing...
[PROJECT_{Name}] Ready!
```

## Следующие шаги

1. **Создать первый модуль:** `@PROMPT_create-module`
2. **Добавить функциональность**
3. **Обновить документацию**
4. **Запустить валидацию:** `@PROMPT_DependencyValidator`

## Примеры использования

### Пример 1: Веб-приложение
```
Название: MyWebApp
Тип: Web App
Технологии: JavaScript, HTML, CSS
Архитектура: Модульная (5 слоёв)
```

### Пример 2: Библиотека
```
Название: MyLibrary
Тип: Library
Технологии: JavaScript
Архитектура: Модульная (3 слоя: CORE, DATA, API)
```

### Пример 3: CLI инструмент
```
Название: MyTool
Тип: CLI
Технологии: Node.js
Архитектура: Модульная (4 слоя: CORE, DATA, CLI, INTEGRATION)
```

## Troubleshooting

### Проблема: Файлы не создаются
**Решение:** Проверить права доступа к директории

### Проблема: Inspector не работает
**Решение:** Проверить загрузку модуля в main.js

### Проблема: State файлы не валидны
**Решение:** Проверить JSON синтаксис

## См. также
- [project-standards.md](.amazonq/rules/project-standards.md) - Стандарты PromAi
- [create-module.md](.amazonq/rules/prompts/create-module.md) - Создание модуля
- [QUICK_START.md](QUICK_START.md) - Быстрый старт
