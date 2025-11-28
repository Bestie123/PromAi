# PromAi Project Standards

## ID Naming Convention
- **Проекты:** `PROJECT_{Name}`
- **Модули:** `MODULE_{Name}_VER_{version}`
- **Функции:** `FUNC_{name}_{number}`
- **Задачи:** `TASK_{number}`
- **Действия:** `ACTION_{type}_{timestamp}`

## Required State Files
При создании/изменении кода ВСЕГДА обновляй:
- `project_registry.json` - реестр модулей и функций
- `dependencies_map.json` - граф зависимостей
- `architecture_layers.json` - архитектурные слои
- `function_registry.json` - трассировка вызовов
- `todo.json` - задачи
- `changelog.md` - история изменений

## State Files Location
Все файлы состояния находятся в корне проекта:
- `./project_registry.json`
- `./dependencies_map.json`
- `./todo.json`
- `./changelog.md`

## Code Requirements
- Добавляй `data-module-id`, `data-component-id` для Inspector
- Используй слабую связанность модулей
- Следуй принципам SOLID
- Минимальный код без избыточности

## File Size Limits
- **Оптимально 300-500 строк** на файл модуля (максимум 1000)
- **Оптимально 20-50 строк** на функцию (максимум 100)
- **Оптимально 2-3 параметра** на функцию (максимум 5)
- При превышении → разбить на подмодули
- Один файл = один модуль = одна ответственность
- AI-friendly: файлы ≤500 строк читаются полностью за один запрос

## Module Structure
```javascript
// MODULE_{Name}_VER_{version}
class ModuleName {
  constructor() {
    this.id = 'MODULE_{Name}_VER_{version}';
  }
}
```

## State File Formats

### project_registry.json
```json
{
  "projectId": "PROJECT_PromAi",
  "modules": {
    "MODULE_{Name}_VER_1.0": {
      "path": "src/path/to/file.js",
      "functions": ["FUNC_name_001"],
      "dependencies": [],
      "status": "active"
    }
  }
}
```

### dependencies_map.json
```json
{
  "nodes": [{"id": "MODULE_Name_VER_1.0", "type": "module"}],
  "edges": [{"from": "MODULE_A", "to": "MODULE_B", "type": "depends"}]
}
```

### todo.json
```json
{
  "tasks": [{
    "id": "TASK_001",
    "title": "Task description",
    "status": "inProgress",
    "assignedTo": "MODULE_Name_VER_1.0",
    "created": "2024-01-01",
    "estimatedHours": 4,
    "actualHours": 3.5
  }],
  "backlog": [],
  "inProgress": [],
  "done": []
}
```

### changelog.md
```markdown
## [Version] - YYYY-MM-DD
### Added/Fixed/Refactored
- Description
```

## Automatic Updates
Каждое действие ОБЯЗАТЕЛЬНО:
1. Загружает текущее состояние из файлов
2. Проверяет зависимости
3. Выполняет действие
4. Обновляет ВСЕ затронутые файлы состояния
5. Предлагает следующие действия

## Architecture Principles
- **Модульность:** слабая связанность, четкие интерфейсы
- **SOLID:** следуй всем принципам
- **DRY:** избегай дублирования кода
- **Тестируемость:** код должен легко тестироваться
- **Документация:** комментарии только где необходимо

## Plugin System
- Все плагины наследуют IPlugin интерфейс
- Регистрация через PluginManager
- Изоляция через sandbox
- Manifest.json с метаданными

## Inspector Integration
- Все DOM элементы имеют `data-module-id`
- Компоненты имеют `data-component-id`
- Функции имеют `data-function-id`
- Для отладки и анализа архитектуры


## Versioning Rules
- **Patch (1.0.X):** багфиксы, не ломающие API
- **Minor (1.X.0):** новая функциональность, обратная совместимость
- **Major (X.0.0):** breaking changes

## Testing Requirements
- Unit тесты для всех FUNC_*
- Integration тесты для MODULE_*
- Минимальное покрытие: 80%
- Обязательные регресс-тесты после багфиксов

## Error Handling
- Всегда используй try-catch для async операций
- Логируй ошибки с MODULE_ID и FUNC_ID
- Не глотай ошибки молча
- Выбрасывай понятные сообщения об ошибках

## Git Commit Format
- `feat(MODULE_Name): описание` - новая функциональность
- `fix(MODULE_Name): описание` - исправление бага
- `refactor(MODULE_Name): описание` - рефакторинг
- `test(MODULE_Name): описание` - добавление тестов
- `docs(MODULE_Name): описание` - обновление документации

## Workflow Rules
При работе с кодом следуй последовательности:
1. **После создания модуля** → предложи код-ревью
2. **После обнаружения бага** → создай TASK, исправь, добавь регресс-тест
3. **После рефакторинга** → обнови версию модуля, проверь зависимости
4. **При создании плагина** → проверь наличие PluginManager, создай manifest.json
5. **Всегда** → обнови все 4 файла состояния (registry, dependencies, todo, changelog)
6. **КРИТИЧНО** → Вся переписка сохраняется в CONVERSATION_LOG.md после КАЖДОГО сообщения (подробное логирование)

## Available Prompts
Для комплексных задач используй детальные промпты из FULL_PROMPTS_1-12.md:
- Инициализация проекта (ПРОМПТ 1-3)
- Добавление функции (ПРОМПТ 5)
- Создание тестов (ПРОМПТ 6)
- Детальный Inspector (см. шаблон в FULL_PROMPTS_1-12.md)
- Работа с function_registry.json (@PROMPT_FunctionRegistry)

## Автоматическая документация
При добавлении ЛЮБОГО нового функционала ОБЯЗАТЕЛЬНО создавай:
1. **Промпт:** `.amazonq/prompts/PROMPT_{Name}.md`
2. **Документация:** `docs/{Name}_GUIDE.md`
3. **Обновление README.md:** добавить секцию о функционале
4. **Обновление project-standards.md:** добавить правила использования
5. **Обновление всех state файлов:** registry, dependencies, todo, changelog
6. **Обновление CONVERSATION_LOG.md:** записать что было сделано

См. `.amazonq/rules/auto-documentation.md` для шаблонов

## Логирование переписки
**КРИТИЧНО:** Вся переписка с ИИ ДОЛЖНА сохраняться в `CONVERSATION_LOG.md`

**Режим логирования:** ПОДРОБНЫЙ (каждое сообщение)

**Когда обновлять:**
- После КАЖДОГО сообщения пользователя
- После создания нового функционала
- После исправления бага
- После рефакторинга
- После любого значимого изменения

**Формат записи:**
```markdown
### Запрос N: {Название}

**Пользователь:**
> {Полный текст запроса}

**Ответ:**
- {Что сделано}
- {Какие файлы созданы/изменены}

**Действия:**
1. {Действие 1}
2. {Действие 2}

**Результат:** {Итоговый результат}
```

**Обязательно включать:**
- Полный текст запроса пользователя
- Детальное описание ответа
- Список всех изменённых файлов
- Конкретные действия
- Итоговый результат
