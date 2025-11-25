# Fix Code

Исправь ошибку в: {укажи модуль/файл}

## Проблема
- Модуль ID: {MODULE_ID}
- Файл: {путь к файлу}
- Слой: {LAYER_X_XXX}
- Описание ошибки: {описание}
- Лог ошибки: {если есть}

## Загрузить контекст

### 1. Модуль из project_registry.json
```javascript
// Загрузить информацию о модуле
const module = projectRegistry.modules[moduleId];
// - path: путь к файлу
// - functions: список FUNC_ID
// - dependencies: зависимости
// - status: статус модуля
// - layer: архитектурный слой
```

### 2. Зависимости из dependencies_map.json
```javascript
// Найти зависимые модули
const dependents = dependenciesMap.edges.filter(e => e.to === moduleId);
console.log('Зависимые модули:', dependents.map(e => e.from));
```

### 3. Слой из architecture_layers.json
```javascript
// Проверить правила слоя
const layer = architectureLayers.layers[layerId];
// - canDependOn: разрешённые зависимости
// - rules: правила слоя
```

## Анализ с Inspector

### 1. Проверить зависимости
```javascript
// Проверить граф зависимостей
const cycles = window.dependencyValidator.findCycles();
if (cycles.length > 0) {
    console.error('❌ Циклические зависимости:', cycles);
}
```

## Действия

### 1. Проанализировать проблему
```javascript
// Проверить граф зависимостей
const cycles = window.dependencyValidator.findCycles();
if (cycles.length > 0) {
    console.error('❌ Циклические зависимости:', cycles);
}

// Проверить правила слоёв
const violations = window.dependencyValidator.checkLayerViolations();
if (violations.length > 0) {
    console.error('❌ Нарушения слоёв:', violations);
}

// Проверить трассировку
const trace = window.functionTracer.filterByModule(moduleId);
console.log('Вызовы модуля:', trace);
```

### 2. Исправить код
```javascript
// ❌ Было (с ошибкой)
function saveData() {
    const data = getData();
    localStorage.setItem('data', data); // TypeError: data is undefined
}

// ✅ Стало (исправлено)
function saveData() {
    const data = getData();
    if (data) {
        localStorage.setItem('data', JSON.stringify(data));
    } else {
        console.error('[MODULE_DataManager_VER_1.0] No data to save');
    }
}
```

### 3. Сохранить ID
```javascript
// ✅ ВСЕГДА сохраняй:
// - moduleId
// - FUNC_ID комментарии
// - data-атрибуты (moduleId, componentId, functionId)

// ❌ НЕ изменяй ID без необходимости
```

### 4. Обновить версию (если критично)
```javascript
// Критичные изменения (breaking changes):
// 1.0 → 2.0

// Новая функциональность:
// 1.0 → 1.1

// Исправление бага:
// 1.0.0 → 1.0.1
```

### 5. Проверить зависимые модули
```javascript
// Найти зависимые модули
const dependents = dependenciesMap.edges
    .filter(e => e.to === moduleId)
    .map(e => e.from);

// Проверить каждый зависимый модуль
dependents.forEach(depId => {
    console.log(`Проверить модуль: ${depId}`);
    // Убедиться что исправление не сломало зависимый модуль
});
```

## Типичные ошибки и решения

### 1. XSS уязвимость
```javascript
// ❌ Проблема
element.innerHTML = userInput; // XSS!

// ✅ Решение
const element = domFactory.create({
    moduleId: this.moduleId,
    componentId: 'COMP_Container',
    textContent: userInput // Безопасно
});
```

### 2. Утечка памяти (event listeners)
```javascript
// ❌ Проблема
element.addEventListener('click', handler);
// Listener не очищается

// ✅ Решение
this.boundHandler = this.handler.bind(this);
element.addEventListener('click', this.boundHandler);

// При деактивации:
element.removeEventListener('click', this.boundHandler);
```

### 3. Отсутствие data-атрибутов
```javascript
// ❌ Проблема
const div = document.createElement('div');
// Нет data-атрибутов, Inspector не работает

// ✅ Решение
const div = domFactory.create({
    moduleId: 'MODULE_Name_VER_1.0',
    componentId: 'COMP_Container',
    functionId: 'FUNC_render_001'
});
```

### 4. Циклическая зависимость
```javascript
// ❌ Проблема
// MODULE_A зависит от MODULE_B
// MODULE_B зависит от MODULE_A

// ✅ Решение
// Создать MODULE_C с общей функциональностью
// MODULE_A и MODULE_B зависят от MODULE_C
```

### 5. Нарушение правил слоёв
```javascript
// ❌ Проблема
// MODULE_DataManager (LAYER_2_DATA) зависит от MODULE_UIManager (LAYER_3_UI)

// ✅ Решение
// Убрать зависимость от UI
// Использовать callback или event для коммуникации
```

## Обновить файлы

### 1. project_registry.json
```json
{
  "modules": {
    "MODULE_Name_VER_1.0": {
      "status": "fixed",
      "version": "1.0.1",
      "lastFixed": "2024-01-15",
      "fixDescription": "Fixed memory leak in event listeners"
    }
  }
}
```

### 2. dependencies_map.json
```javascript
// Проверить целостность связей
// Убедиться что все зависимости корректны
// Обновить если изменились зависимости
```

### 3. architecture_layers.json
```javascript
// Проверить что модуль в правильном слое
// Обновить если изменился слой
```

### 4. todo.json
```json
{
  "tasks": [
    {
      "id": "TASK_XXX",
      "title": "Bug: Memory leak in MODULE_Name_VER_1.0",
      "status": "done",
      "closedDate": "2024-01-15"
    },
    {
      "id": "TASK_YYY",
      "title": "Создать регресс-тест для MODULE_Name_VER_1.0",
      "status": "backlog",
      "priority": "high"
    }
  ]
}
```

### 5. changelog.md
```markdown
## [1.0.1] - 2024-01-15
### Fixed
- MODULE_Name_VER_1.0 - Fixed memory leak in event listeners
  - Added proper cleanup in deactivate()
  - Bound handlers are now stored and removed correctly
```

## Примеры использования

### Пример 1: Исправление утечки памяти
**Модуль:** MODULE_Inspector_VER_1.0  
**Файл:** src/modules/Inspector.js  
**Слой:** LAYER_1_CORE  
**Проблема:** Event listeners не очищаются при деактивации  
**Лог:** Memory usage grows on each activate/deactivate cycle

**Решение:**
1. Сохранить bound handlers в this.boundMouseOver, this.boundClick
2. Использовать их в addEventListener
3. Очистить в deactivate() через removeEventListener
4. Версия: 1.0 → 1.0.1

**Код:**
```javascript
// ❌ Было
activate() {
    document.addEventListener('mouseover', (e) => this.handleMouseOver(e));
}

// ✅ Стало
activate() {
    this.boundMouseOver = this.handleMouseOver.bind(this);
    document.addEventListener('mouseover', this.boundMouseOver);
}

deactivate() {
    document.removeEventListener('mouseover', this.boundMouseOver);
}
```

### Пример 2: Исправление XSS уязвимости
**Модуль:** MODULE_KnowledgeEditor_VER_1.0  
**Файл:** src/modules/KnowledgeEditor.js  
**Слой:** LAYER_5_KNOWLEDGE  
**Проблема:** innerHTML с пользовательским вводом  
**Лог:** XSS vulnerability detected

**Решение:**
1. Заменить innerHTML на textContent
2. Или использовать DOMPurify для санитизации
3. Добавить валидацию входных данных
4. Версия: 1.0 → 1.0.1 (security fix)

**Код:**
```javascript
// ❌ Было
element.innerHTML = userInput; // XSS!

// ✅ Стало
element.textContent = userInput; // Безопасно
```

### Пример 3: Исправление циклической зависимости
**Модуль:** MODULE_KnowledgeManager_VER_1.0  
**Файл:** src/modules/KnowledgeManager.js  
**Слой:** LAYER_5_KNOWLEDGE  
**Проблема:** Циклическая зависимость с KnowledgeEditor  
**Лог:** DependencyValidator found cycle

**Решение:**
1. Проверить граф зависимостей в Inspector (вкладка "Граф")
2. Убрать зависимость KnowledgeEditor → KnowledgeManager
3. Использовать callback для коммуникации
4. Обновить dependencies_map.json

**Код:**
```javascript
// ❌ Было
// KnowledgeEditor зависит от KnowledgeManager
// KnowledgeManager зависит от KnowledgeEditor

// ✅ Стало
// KnowledgeManager зависит от KnowledgeEditor
// KnowledgeEditor использует callback
knowledgeEditor.onSave = (data) => {
    knowledgeManager.handleSave(data);
};
```

## Проверка исправления

### 1. Консоль
```javascript
// Проверить что ошибка не повторяется
console.log('[MODULE_Name_VER_1.0] Fixed successfully');
```

### 2. Inspector
```
1. Активировать Inspector (F2)
2. Проверить элементы (data-атрибуты)
3. Проверить трассировку (нет ошибок)
4. Проверить граф (нет циклов)
```

### 3. DependencyValidator
```javascript
const report = window.dependencyValidator.validate();
console.log('Valid:', report.isValid); // должно быть true
console.log('Cycles:', report.cycles.length); // должно быть 0
console.log('Violations:', report.layerViolations.length); // должно быть 0
```

### 4. Зависимые модули
```javascript
// Проверить что зависимые модули работают
dependents.forEach(depId => {
    console.log(`Testing ${depId}...`);
    // Выполнить основные операции зависимого модуля
});
```

## Troubleshooting

### Проблема: Ошибка повторяется
**Решение:** Проверить все места использования
```javascript
// Найти все вызовы функции
const trace = window.functionTracer.filterByFunction('FUNC_problematic_001');
console.log('Вызовы:', trace);
```

### Проблема: Сломались зависимые модули
**Решение:** Откатить изменения и пересмотреть подход
```javascript
// Проверить зависимые модули
const dependents = dependenciesMap.edges.filter(e => e.to === moduleId);
console.log('Проверить:', dependents);
```

### Проблема: Не могу воспроизвести ошибку
**Решение:** Использовать трассировку
```javascript
// Включить трассировку
window.functionTracer.enable();
// Воспроизвести сценарий
// Проверить трассировку
const trace = window.functionTracer.getTrace();
```

## Следующие шаги

### После исправления:
1. **Создать регресс-тест:** `@PROMPT_create-tests`
2. **Код-ревью:** `@PROMPT_code-review`
3. **Проверить зависимые модули**
4. **Обновить changelog.md**

## См. также
- [create-tests.md](create-tests.md) - Создание тестов
- [code-review.md](code-review.md) - Код-ревью после исправления
- [project-standards.md](../project-standards.md) - Стандарты PromAi
