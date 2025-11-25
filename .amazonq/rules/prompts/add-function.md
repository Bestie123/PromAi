# Add Function

Добавь новую функцию в модуль: {MODULE_ID}

## Параметры
- **Модуль ID:** {MODULE_ID}
- **Название функции:** {functionName}
- **Описание:** {что делает функция}
- **Параметры:** {список параметров}
- **Возвращает:** {тип возвращаемого значения}

## Правила версионирования

**Когда менять версию модуля:**
- **Patch (1.0.X):** Багфиксы, не ломающие API
- **Minor (1.X.0):** Новая функциональность, обратная совместимость
- **Major (X.0.0):** Breaking changes

**При добавлении функции:**
- Обычно НЕ меняем версию (функция добавляется в существующий модуль)
- Меняем на Minor (1.0 → 1.1) если функция значительная

## Шаг 1: Загрузить контекст

### Из project_registry.json
```javascript
const module = projectRegistry.modules[moduleId];
// - path: путь к файлу
// - functions: существующие FUNC_ID
// - dependencies: зависимости модуля
// - layer: архитектурный слой
```

### Из dependencies_map.json
```javascript
// Проверить зависимости
const deps = dependenciesMap.edges.filter(e => e.from === moduleId);
```

## Шаг 2: Определить FUNC_ID

```javascript
// Найти последний номер функции в модуле
const existingFuncs = module.functions; // ["FUNC_create_001", "FUNC_save_002"]
const lastNumber = Math.max(...existingFuncs.map(f => parseInt(f.split('_').pop())));
const newNumber = String(lastNumber + 1).padStart(3, '0');
const newFuncId = `FUNC_${functionName}_${newNumber}`;
```

## Шаг 3: Добавить функцию в модуль

### Шаблон функции
```javascript
// FUNC_{functionName}_{number} - {Описание}
{functionName}(param1, param2) {
    // Валидация параметров
    if (!param1) {
        console.error(`[${this.moduleId}] param1 is required`);
        return;
    }
    
    // Основная логика
    const result = /* ... */;
    
    // Если создаются DOM элементы - использовать DOMFactory
    if (needsDOM) {
        const element = domFactory.create({
            moduleId: this.moduleId,
            componentId: 'COMP_{ComponentName}',
            functionId: 'FUNC_{functionName}_{number}',
            // ...
        });
    }
    
    // Возврат результата
    return result;
}
```

### Пример: Добавить функцию удаления
```javascript
// MODULE_DataManager_VER_1.0

// FUNC_deleteNode_012 - Удаление узла по пути
deleteNode(path, index) {
    if (!path || index === undefined) {
        console.error('[MODULE_DataManager_VER_1.0] Invalid parameters');
        return;
    }
    
    const parent = this.getNodeByPath(path);
    if (!parent || !parent.children) return;
    
    parent.children.splice(index, 1);
    this.saveToLocalStorage();
    
    uiManager.showNotification('✅ Удалено', 'success');
}
```

## Шаг 4: Обновить state файлы

### 1. project_registry.json
```json
{
  "modules": {
    "MODULE_{Name}_VER_1.0": {
      "functions": [
        "FUNC_existing_001",
        "FUNC_{functionName}_{number}"  // ← Добавить
      ]
    }
  }
}
```

### 2. function_registry.json (если есть)
```json
{
  "functions": {
    "FUNC_{functionName}_{number}": {
      "moduleId": "MODULE_{Name}_VER_1.0",
      "name": "{functionName}",
      "description": "{описание}",
      "parameters": ["param1", "param2"],
      "returns": "{тип}",
      "callers": [],
      "callees": []
    }
  }
}
```

### 3. todo.json
```json
{
  "tasks": [
    {
      "id": "TASK_XXX",
      "title": "Создать тест для FUNC_{functionName}_{number}",
      "status": "backlog",
      "assignedTo": "MODULE_{Name}_VER_1.0"
    }
  ]
}
```

### 4. changelog.md
```markdown
## [1.X.X] - 2024-01-15
### Added
- FUNC_{functionName}_{number} - {описание}
```

## Шаг 5: Добавить вызовы (если нужно)

### Если функция вызывается из UI
```javascript
// В HTML или другом модуле
const button = domFactory.create({
    tag: 'button',
    moduleId: 'MODULE_{Name}_VER_1.0',
    componentId: 'COMP_Button',
    functionId: 'FUNC_{functionName}_{number}',
    textContent: 'Action',
    events: {
        click: () => moduleName.{functionName}(param1, param2)
    }
});
```

### Обновить function_registry.json
```json
{
  "functions": {
    "FUNC_{functionName}_{number}": {
      "callers": ["FUNC_caller_001"],  // ← Кто вызывает
      "callees": ["FUNC_callee_002"]   // ← Кого вызывает
    }
  }
}
```

## Примеры использования

### Пример 1: Добавить функцию экспорта
```
Модуль ID: MODULE_DataManager_VER_1.0
Название: exportToJSON
Описание: Экспорт данных в JSON файл
Параметры: нет
Возвращает: void

Код:
// FUNC_exportToJSON_013 - Экспорт данных в JSON
exportToJSON() {
    const dataStr = JSON.stringify(window.techData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = domFactory.create({
        tag: 'a',
        moduleId: this.moduleId,
        functionId: 'FUNC_exportToJSON_013',
        attributes: {
            href: url,
            download: 'data.json'
        }
    });
    
    a.click();
    URL.revokeObjectURL(url);
    
    uiManager.showNotification('✅ Экспортировано', 'success');
}
```

### Пример 2: Добавить функцию валидации
```
Модуль ID: MODULE_DataManager_VER_1.0
Название: validateData
Описание: Проверка корректности данных
Параметры: data (object)
Возвращает: boolean

Код:
// FUNC_validateData_014 - Валидация структуры данных
validateData(data) {
    if (!data || typeof data !== 'object') {
        console.error('[MODULE_DataManager_VER_1.0] Invalid data type');
        return false;
    }
    
    if (!data.categories || !Array.isArray(data.categories)) {
        console.error('[MODULE_DataManager_VER_1.0] Missing categories array');
        return false;
    }
    
    return true;
}
```

### Пример 3: Добавить функцию поиска
```
Модуль ID: MODULE_DataManager_VER_1.0
Название: searchByName
Описание: Поиск узлов по имени
Параметры: query (string)
Возвращает: Array<object>

Код:
// FUNC_searchByName_015 - Поиск узлов по имени
searchByName(query) {
    if (!query) return [];
    
    const results = [];
    const search = query.toLowerCase();
    
    const traverse = (nodes) => {
        nodes.forEach(node => {
            if (node.name.toLowerCase().includes(search)) {
                results.push(node);
            }
            if (node.children) {
                traverse(node.children);
            }
        });
    };
    
    traverse(window.techData.categories);
    return results;
}
```

## Проверка работы

### ✅ Чеклист
- [ ] Функция добавлена в модуль
- [ ] FUNC_ID уникален и последователен
- [ ] Комментарий с FUNC_ID и описанием
- [ ] Валидация параметров
- [ ] Использует DOMFactory (если создаёт элементы)
- [ ] project_registry.json обновлён
- [ ] function_registry.json обновлён (если есть)
- [ ] todo.json обновлён (задача на тест)
- [ ] changelog.md обновлён
- [ ] Функция работает корректно

### Консоль должна показать:
```
// При вызове функции
[MODULE_{Name}_VER_1.0] {functionName} called
// Или сообщения об ошибках если есть
```

### Inspector должен показать:
```
// Если функция создаёт элементы
MODULE_ID: MODULE_{Name}_VER_1.0
FUNCTION_ID: FUNC_{functionName}_{number}
```

## Troubleshooting

### Проблема: FUNC_ID конфликтует
**Решение:** Проверить последний номер в module.functions
```javascript
const lastNum = Math.max(...module.functions.map(f => 
    parseInt(f.split('_').pop())
));
```

### Проблема: Функция не вызывается
**Решение:** Проверить что модуль загружен
```javascript
console.log(window.moduleName); // должен быть объект
console.log(typeof window.moduleName.functionName); // 'function'
```

### Проблема: Нет data-атрибутов
**Решение:** Использовать DOMFactory
```javascript
// ❌ Не так
const el = document.createElement('div');

// ✅ Так
const el = domFactory.create({
    moduleId: this.moduleId,
    functionId: 'FUNC_{functionName}_{number}'
});
```

## Следующие шаги

### После добавления функции:
1. **Создать тесты:** `@PROMPT_create-tests`
2. **Проверить зависимости:** `@PROMPT_DependencyValidator`
3. **Обновить документацию:** Добавить в `docs/{Module}_GUIDE.md`

## См. также
- [create-tests.md](create-tests.md) - Создание тестов
- [create-module.md](create-module.md) - Создание нового модуля
- [project-standards.md](../project-standards.md) - Стандарты PromAi
