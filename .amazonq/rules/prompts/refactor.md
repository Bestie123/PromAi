# Refactor

Выполни рефакторинг: {укажи модуль/файл}

## Параметры
- **Модуль ID:** {MODULE_ID}
- **Причина:** {причина рефакторинга}
- **Цель:** {что улучшить}

## Правила версионирования

**Когда менять версию при рефакторинге:**
- **Patch (1.0.X):** Внутренние изменения, API не меняется
- **Minor (1.X.0):** Добавлены новые функции при рефакторинге
- **Major (X.0.0):** Изменена сигнатура функций, breaking changes

**При рефакторинге:**
- Обычно Patch (1.0 → 1.0.1) если только внутренние изменения
- Minor (1.0 → 1.1) если разделили на новые функции
- Major (1.0 → 2.0) если изменили API

## Шаг 1: Загрузить контекст

### Из project_registry.json
```javascript
const module = projectRegistry.modules[moduleId];
// - path: путь к файлу
// - functions: список FUNC_ID
// - dependencies: зависимости
// - layer: архитектурный слой
```

### Из dependencies_map.json
```javascript
// Найти зависимые модули
const dependents = dependenciesMap.edges.filter(e => e.to === moduleId);
console.log('Зависимые модули:', dependents.map(e => e.from));
```

## Шаг 2: Анализ влияния

### Проверить зависимости
```javascript
// Кто зависит от этого модуля?
const dependents = dependenciesMap.edges.filter(e => e.to === moduleId);

// От кого зависит этот модуль?
const dependencies = dependenciesMap.edges.filter(e => e.from === moduleId);
```

### Оценить риски
- Сколько модулей затронуто?
- Есть ли breaking changes?
- Нужно ли обновлять версию?

## Шаг 3: Предложить варианты

### Вариант 1: {название}
**Плюсы:**
- {плюс 1}
- {плюс 2}

**Минусы:**
- {минус 1}
- {минус 2}

**Затронутые модули:** {список}

### Вариант 2: {название}
**Плюсы:**
- {плюс 1}
- {плюс 2}

**Минусы:**
- {минус 1}
- {минус 2}

**Затронутые модули:** {список}

### Вариант 3: {название}
**Плюсы:**
- {плюс 1}
- {плюс 2}

**Минусы:**
- {минус 1}
- {минус 2}

**Затронутые модули:** {список}

## Шаг 4: Выполнить рефакторинг

### 1. Сохранить ID
```javascript
// ✅ Сохранить существующие ID
const moduleId = 'MODULE_{Name}_VER_1.0'; // не менять
const funcIds = ['FUNC_existing_001', 'FUNC_existing_002']; // сохранить

// ✅ Обновить версию только если breaking changes
// 1.0 → 1.1 (новая функциональность)
// 1.0 → 2.0 (breaking changes)
```

### 2. Рефакторить код
```javascript
// ❌ Было
function complexFunction() {
    // 100 строк кода
}

// ✅ Стало
// FUNC_complexFunction_001 - Основная логика
function complexFunction() {
    const data = this.prepareData(); // FUNC_prepareData_005
    const result = this.processData(data); // FUNC_processData_006
    return result;
}

// FUNC_prepareData_005 - Подготовка данных
prepareData() {
    // логика подготовки
}

// FUNC_processData_006 - Обработка данных
processData(data) {
    // логика обработки
}
```

### 3. Обновить зависимости
```javascript
// Если изменились зависимости
const module = {
    moduleId: 'MODULE_{Name}_VER_1.0',
    dependencies: [
        'MODULE_OldDep_VER_1.0', // удалить
        'MODULE_NewDep_VER_1.0'  // добавить
    ]
};
```

### 4. Обновить тесты
```javascript
// Обновить существующие тесты
describe('FUNC_complexFunction_001', () => {
    it('должен работать после рефакторинга', () => {
        // тест
    });
});

// Добавить тесты для новых функций
describe('FUNC_prepareData_005', () => {
    it('должен подготовить данные', () => {
        // тест
    });
});
```

### 5. Проверить зависимые модули
```javascript
// Для каждого зависимого модуля
dependents.forEach(depId => {
    console.log(`Проверить модуль: ${depId}`);
    // Убедиться что рефакторинг не сломал зависимый модуль
});
```

## Шаг 5: Обновить state файлы

### 1. project_registry.json
```json
{
  "modules": {
    "MODULE_{Name}_VER_1.0": {
      "version": "1.1.0",
      "functions": [
        "FUNC_complexFunction_001",
        "FUNC_prepareData_005",
        "FUNC_processData_006"
      ],
      "dependencies": ["MODULE_NewDep_VER_1.0"]
    }
  }
}
```

### 2. dependencies_map.json
```json
{
  "edges": [
    {"from": "MODULE_{Name}_VER_1.0", "to": "MODULE_NewDep_VER_1.0"}
  ]
}
```

### 3. function_registry.json
```json
{
  "functions": {
    "FUNC_prepareData_005": {
      "moduleId": "MODULE_{Name}_VER_1.0",
      "callers": ["FUNC_complexFunction_001"]
    },
    "FUNC_processData_006": {
      "moduleId": "MODULE_{Name}_VER_1.0",
      "callers": ["FUNC_complexFunction_001"]
    }
  }
}
```

### 4. todo.json
```json
{
  "tasks": [
    {
      "id": "TASK_XXX",
      "title": "Проверить зависимые модули после рефакторинга",
      "status": "backlog",
      "priority": "high"
    }
  ]
}
```

### 5. changelog.md
```markdown
## [1.1.0] - 2024-01-15
### Refactored
- MODULE_{Name}_VER_1.0 - {описание рефакторинга}
  - Разделена функция complexFunction на 3 части
  - Улучшена читаемость кода
  - Добавлены unit тесты для новых функций
```

## Примеры использования

### Пример 1: Разделение большой функции
```
Модуль ID: MODULE_DataManager_VER_1.0
Причина: Функция saveData слишком большая (150 строк)
Цель: Разделить на 3 функции

Рефакторинг:
- saveData() → validateData() + prepareData() + persistData()
- Каждая функция < 50 строк
- Легче тестировать
```

### Пример 2: Удаление дублирования
```
Модуль ID: MODULE_UIManager_VER_1.0
Причина: Дублирование кода в 5 функциях
Цель: Вынести общую логику

Рефакторинг:
- Создать FUNC_createBaseElement_010
- Использовать в 5 функциях
- Уменьшить код на 40%
```

### Пример 3: Улучшение производительности
```
Модуль ID: MODULE_AccordionManager_VER_1.0
Причина: Медленный рендеринг (500ms)
Цель: Оптимизировать до < 100ms

Рефакторинг:
- Кэшировать DOM запросы
- Использовать DocumentFragment
- Debounce для частых вызовов
```

## Проверка работы

### ✅ Чеклист
- [ ] Все ID сохранены или корректно обновлены
- [ ] Версия модуля обновлена (если нужно)
- [ ] Зависимости актуальны
- [ ] Тесты обновлены и проходят
- [ ] Зависимые модули проверены
- [ ] project_registry.json обновлён
- [ ] dependencies_map.json обновлён
- [ ] function_registry.json обновлён
- [ ] todo.json обновлён
- [ ] changelog.md обновлён

### Консоль должна показать:
```
[MODULE_{Name}_VER_1.0] Refactored successfully
// Нет ошибок
// Все функции работают
```

### Inspector должен показать:
```
// Все ID корректны
MODULE_ID: MODULE_{Name}_VER_1.0
FUNCTION_ID: FUNC_prepareData_005
```

## Troubleshooting

### Проблема: Сломались зависимые модули
**Решение:** Откатить изменения и пересмотреть подход
```javascript
// Проверить каждый зависимый модуль
dependents.forEach(depId => {
    console.log(`Testing ${depId}...`);
    // Выполнить основные операции
});
```

### Проблема: Тесты не проходят
**Решение:** Обновить тесты под новую структуру
```javascript
// Обновить моки
// Обновить ожидаемые результаты
// Добавить тесты для новых функций
```

### Проблема: Производительность не улучшилась
**Решение:** Использовать FunctionTracer для анализа
```javascript
window.functionTracer.enable();
// Выполнить операцию
const slowest = window.functionTracer.getSlowest(10);
```

## Следующие шаги

### После рефакторинга:
1. **Обновить тесты:** `@PROMPT_create-tests`
2. **Код-ревью:** `@PROMPT_code-review`
3. **Проверить производительность:** `@PROMPT_FunctionTracer`
4. **Обновить документацию**

## См. также
- [create-tests.md](create-tests.md) - Создание тестов
- [code-review.md](code-review.md) - Код-ревью
- [add-function.md](add-function.md) - Добавление функций
- [project-standards.md](../project-standards.md) - Стандарты PromAi
