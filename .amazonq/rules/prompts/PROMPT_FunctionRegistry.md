# ПРОМПТ: FunctionRegistry

## Когда использовать
- При анализе вызовов функций в проекте
- Когда нужно понять граф вызовов
- При рефакторинге для поиска зависимостей
- Для документирования архитектуры вызовов

## Что делает
Работает с `function_registry.json` - файлом трассировки вызовов функций:
- Регистрация всех функций проекта
- Отслеживание caller/callee связей
- Построение графа вызовов
- Поиск неиспользуемых функций

## Как использовать

### Шаг 1: Загрузить реестр
```javascript
// Загрузить function_registry.json
fetch('./function_registry.json')
    .then(res => res.json())
    .then(registry => {
        console.log('Функций:', Object.keys(registry.functions).length);
    });
```

### Шаг 2: Найти функцию
```javascript
// Получить информацию о функции
const funcInfo = registry.functions['FUNC_saveToLocalStorage_002'];
console.log('Модуль:', funcInfo.moduleId);
console.log('Вызывается из:', funcInfo.callers);
console.log('Вызывает:', funcInfo.callees);
```

### Шаг 3: Построить граф
```javascript
// Построить граф вызовов
const graph = registry.callGraph;
console.log('Узлов:', graph.nodes.length);
console.log('Связей:', graph.edges.length);
```

## Примеры

### Пример 1: Найти все вызовы функции
```javascript
// Кто вызывает saveToLocalStorage?
const funcId = 'FUNC_saveToLocalStorage_002';
const func = registry.functions[funcId];

console.log(`Функция ${funcId} вызывается из:`);
func.callers.forEach(caller => {
    console.log(`  - ${caller}`);
});

// Результат:
// FUNC_addCategory_001
// FUNC_deleteNode_012
// FUNC_toggleTech_008
```

### Пример 2: Найти неиспользуемые функции
```javascript
// Функции без callers (никто не вызывает)
const unused = Object.entries(registry.functions)
    .filter(([id, func]) => func.callers.length === 0)
    .map(([id]) => id);

console.log('Неиспользуемые функции:', unused);

// Результат:
// FUNC_oldFunction_015
// FUNC_deprecatedMethod_023
```

### Пример 3: Построить цепочку вызовов
```javascript
// Цепочка: кто вызывает кого
function getCallChain(funcId, depth = 0) {
    const func = registry.functions[funcId];
    const indent = '  '.repeat(depth);
    
    console.log(`${indent}${funcId}`);
    
    func.callees.forEach(callee => {
        getCallChain(callee, depth + 1);
    });
}

getCallChain('FUNC_addCategory_001');

// Результат:
// FUNC_addCategory_001
//   FUNC_saveToLocalStorage_002
//   FUNC_renderAccordion_003
//     FUNC_createCategoryItem_004
```

### Пример 4: Статистика по модулю
```javascript
// Сколько функций в модуле?
const moduleId = 'MODULE_DataManager_VER_1.0';
const moduleFunctions = Object.entries(registry.functions)
    .filter(([id, func]) => func.moduleId === moduleId);

console.log(`Модуль ${moduleId}:`);
console.log(`  Функций: ${moduleFunctions.length}`);
console.log(`  Публичных: ${moduleFunctions.filter(([id, f]) => f.callers.length > 0).length}`);
console.log(`  Приватных: ${moduleFunctions.filter(([id, f]) => f.callers.length === 0).length}`);
```

## API Reference

### Структура function_registry.json

```json
{
  "projectId": "PROJECT_TechKnowledgeBase",
  "version": "1.0.0",
  "functions": {
    "FUNC_saveToLocalStorage_002": {
      "moduleId": "MODULE_DataManager_VER_1.0",
      "name": "saveToLocalStorage",
      "description": "Сохранение данных в LocalStorage",
      "parameters": [],
      "returns": "void",
      "callers": [
        "FUNC_addCategory_001",
        "FUNC_deleteNode_012"
      ],
      "callees": []
    }
  },
  "callGraph": {
    "nodes": [
      {
        "id": "FUNC_saveToLocalStorage_002",
        "moduleId": "MODULE_DataManager_VER_1.0",
        "type": "function"
      }
    ],
    "edges": [
      {
        "from": "FUNC_addCategory_001",
        "to": "FUNC_saveToLocalStorage_002",
        "type": "calls"
      }
    ]
  }
}
```

### Поля функции

- **moduleId** - ID модуля (MODULE_*_VER_*)
- **name** - Имя функции
- **description** - Описание (опционально)
- **parameters** - Массив параметров
- **returns** - Тип возвращаемого значения
- **callers** - Кто вызывает эту функцию (массив FUNC_ID)
- **callees** - Кого вызывает эта функция (массив FUNC_ID)

## Связанные файлы
- `function_registry.json` - Реестр функций
- `project_registry.json` - Реестр модулей
- `src/modules/FunctionTracer.js` - Трассировка в runtime
- `src/modules/Inspector.js` - Визуализация вызовов

## Зависимости
- Нет зависимостей (статический файл)

## Интеграция с FunctionTracer

FunctionTracer дополняет function_registry.json runtime данными:

```javascript
// function_registry.json - статический анализ
const staticInfo = registry.functions['FUNC_search_001'];
console.log('Статически вызывает:', staticInfo.callees);

// FunctionTracer - runtime анализ
window.functionTracer.enable();
// ... выполнить код ...
const runtimeInfo = window.functionTracer.filterByFunction('FUNC_search_001');
console.log('Реально вызвано:', runtimeInfo.length, 'раз');
```

## Обновление реестра

### При добавлении функции
```json
{
  "functions": {
    "FUNC_newFunction_025": {
      "moduleId": "MODULE_MyModule_VER_1.0",
      "name": "newFunction",
      "callers": [],
      "callees": ["FUNC_existingFunction_010"]
    }
  }
}
```

### При изменении вызовов
```json
{
  "functions": {
    "FUNC_caller_001": {
      "callees": [
        "FUNC_oldCallee_002",
        "FUNC_newCallee_003"  // добавили
      ]
    },
    "FUNC_newCallee_003": {
      "callers": [
        "FUNC_caller_001"  // добавили
      ]
    }
  }
}
```

## Анализ архитектуры

### Найти хабы (функции с множеством вызовов)
```javascript
const hubs = Object.entries(registry.functions)
    .filter(([id, func]) => func.callers.length > 5)
    .sort((a, b) => b[1].callers.length - a[1].callers.length);

console.log('Топ-5 хабов:');
hubs.slice(0, 5).forEach(([id, func]) => {
    console.log(`${id}: ${func.callers.length} вызовов`);
});
```

### Найти листья (функции без вызовов)
```javascript
const leaves = Object.entries(registry.functions)
    .filter(([id, func]) => func.callees.length === 0);

console.log('Листовые функции:', leaves.length);
```

### Найти циклы в вызовах
```javascript
function findCycles(funcId, visited = new Set(), path = []) {
    if (visited.has(funcId)) {
        const cycleStart = path.indexOf(funcId);
        if (cycleStart !== -1) {
            return [path.slice(cycleStart).concat(funcId)];
        }
        return [];
    }
    
    visited.add(funcId);
    path.push(funcId);
    
    const func = registry.functions[funcId];
    const cycles = [];
    
    func.callees.forEach(callee => {
        cycles.push(...findCycles(callee, new Set(visited), [...path]));
    });
    
    return cycles;
}

// Проверить все функции
const allCycles = [];
Object.keys(registry.functions).forEach(funcId => {
    allCycles.push(...findCycles(funcId));
});

console.log('Циклы:', allCycles.length);
```

## Визуализация

### Mermaid диаграмма
```javascript
function generateMermaid(moduleId) {
    const funcs = Object.entries(registry.functions)
        .filter(([id, func]) => func.moduleId === moduleId);
    
    let mermaid = 'graph TD\n';
    
    funcs.forEach(([id, func]) => {
        func.callees.forEach(callee => {
            mermaid += `  ${id} --> ${callee}\n`;
        });
    });
    
    return mermaid;
}

console.log(generateMermaid('MODULE_DataManager_VER_1.0'));
```

## Troubleshooting

### Проблема: Реестр не актуален
**Симптом:** Функции есть в коде, но нет в реестре  
**Решение:** Обновить реестр после изменений
```javascript
// При добавлении функции через @PROMPT add-function
// реестр обновляется автоматически
```

### Проблема: Неверные связи caller/callee
**Симптом:** callers не соответствует реальным вызовам  
**Решение:** Проверить с FunctionTracer
```javascript
window.functionTracer.enable();
// выполнить код
const trace = window.functionTracer.getTrace();
// сравнить с function_registry.json
```

### Проблема: Слишком большой файл
**Симптом:** function_registry.json > 1MB  
**Решение:** Разбить по модулям
```javascript
// Создать отдельные файлы:
// function_registry_core.json
// function_registry_data.json
// function_registry_ui.json
```

## См. также
- [PROMPT_FunctionTracer.md](PROMPT_FunctionTracer.md) - Runtime трассировка
- [add-function.md](add-function.md) - Добавление функций
- [refactor.md](refactor.md) - Рефакторинг с учетом вызовов
- [unused_functions.json](../../unused_functions.json) - Анализ мёртвого кода
