# DependencyValidator - Руководство

## Обзор

DependencyValidator - это модуль для автоматической валидации зависимостей проекта. Проверяет циклические зависимости, нарушения правил архитектурных слоёв и изолированные модули.

## Зачем нужно

**Проблемы которые решает:**
- Циклические зависимости ломают архитектуру
- Нарушения правил слоёв создают спагетти-код
- Изолированные модули - мёртвый код
- Ручная проверка зависимостей занимает время

**Решение:**
DependencyValidator автоматически проверяет все зависимости с использованием алгоритмов (DFS для циклов) и генерирует детальные отчёты.

## Как работает

### Архитектура

```
project_registry.json + dependencies_map.json + architecture_layers.json
                        ↓
            DependencyValidator.validate()
                        ↓
        ┌───────────────┼───────────────┐
        ↓               ↓               ↓
   findCycles()  checkLayerViolations()  findOrphanModules()
        ↓               ↓               ↓
            ValidationReport
                        ↓
            generateReport() (Markdown)
```

### Алгоритмы

#### DFS для поиска циклов

```javascript
function findCycles(graph) {
    const visited = new Set();
    const stack = new Set();
    const cycles = [];
    
    function dfs(node, path) {
        if (stack.has(node)) {
            // Найден цикл
            const cycleStart = path.indexOf(node);
            cycles.push(path.slice(cycleStart).concat(node));
            return;
        }
        
        if (visited.has(node)) return;
        
        visited.add(node);
        stack.add(node);
        
        graph[node].forEach(neighbor => {
            dfs(neighbor, path.concat(node));
        });
        
        stack.delete(node);
    }
    
    Object.keys(graph).forEach(node => dfs(node, []));
    return cycles;
}
```

**Сложность:** O(V + E) где V - модули, E - зависимости

#### Проверка правил слоёв

```javascript
function checkLayerViolations() {
    const violations = [];
    
    dependencies.forEach(dep => {
        const fromLayer = getModuleLayer(dep.from);
        const toLayer = getModuleLayer(dep.to);
        
        if (!isAllowedDependency(fromLayer, toLayer)) {
            violations.push({
                from: dep.from,
                fromLayer,
                to: dep.to,
                toLayer,
                reason: `${fromLayer} cannot depend on ${toLayer}`
            });
        }
    });
    
    return violations;
}
```

## Использование

### Базовое использование

```javascript
// Полная валидация
const report = await window.dependencyValidator.validate();

if (report.isValid) {
    console.log('✅ Все проверки пройдены!');
} else {
    console.error('❌ Найдены проблемы:');
    console.error('Циклов:', report.cycles.length);
    console.error('Нарушений слоёв:', report.layerViolations.length);
    console.error('Изолированных модулей:', report.orphanModules.length);
}
```

### Продвинутое использование

#### Проверка перед коммитом

```javascript
// В pre-commit hook
const report = await window.dependencyValidator.validate();

if (!report.isValid) {
    console.error('❌ Валидация не пройдена!');
    
    // Показать детали
    report.cycles.forEach(cycle => {
        console.error('Цикл:', cycle.join(' → '));
    });
    
    report.layerViolations.forEach(v => {
        console.error(`Нарушение: ${v.from} → ${v.to}`);
        console.error(`Причина: ${v.reason}`);
    });
    
    process.exit(1);
}

console.log('✅ Валидация пройдена, можно коммитить');
```

#### Детальная проверка циклов

```javascript
const cycles = await window.dependencyValidator.findCycles();

if (cycles.length > 0) {
    console.error(`❌ Найдено ${cycles.length} циклов:`);
    
    cycles.forEach((cycle, i) => {
        console.error(`\nЦикл ${i + 1}:`);
        console.error(cycle.join(' →\n'));
        
        // Рекомендация по исправлению
        console.error('\nРекомендация: Разорвать зависимость между:');
        console.error(`${cycle[cycle.length - 2]} и ${cycle[cycle.length - 1]}`);
    });
}
```

#### Проверка конкретного модуля

```javascript
// Проверить зависимости нового модуля
const moduleId = 'MODULE_NewFeature_VER_1.0';
const layer = window.dependencyValidator.getModuleLayer(moduleId);

console.log(`Модуль ${moduleId} в слое ${layer}`);

// Проверить разрешённые зависимости
const allowedLayers = getAllowedDependencies(layer);
console.log('Может зависеть от слоёв:', allowedLayers);
```

## API Reference

### Функции

#### `validate()`
Полная валидация проекта

**Параметры:** нет  
**Возвращает:** Promise<ValidationReport>

```javascript
const report = await window.dependencyValidator.validate();
// {
//   isValid: true,
//   cycles: [],
//   layerViolations: [],
//   orphanModules: [],
//   stats: { totalModules: 11, totalDependencies: 13, maxDepth: 3 }
// }
```

#### `findCycles()`
Поиск циклических зависимостей (DFS)

**Параметры:** нет  
**Возвращает:** Promise<Array<Array<string>>>

```javascript
const cycles = await window.dependencyValidator.findCycles();
// [
//   ['MODULE_A_VER_1.0', 'MODULE_B_VER_1.0', 'MODULE_A_VER_1.0'],
//   ['MODULE_C_VER_1.0', 'MODULE_D_VER_1.0', 'MODULE_C_VER_1.0']
// ]
```

#### `checkLayerViolations()`
Проверка нарушений правил слоёв

**Параметры:** нет  
**Возвращает:** Promise<Array<LayerViolation>>

```javascript
const violations = await window.dependencyValidator.checkLayerViolations();
// [
//   {
//     from: 'MODULE_A_VER_1.0',
//     fromLayer: 'LAYER_3_UI',
//     to: 'MODULE_B_VER_1.0',
//     toLayer: 'LAYER_5_KNOWLEDGE',
//     reason: 'UI layer cannot depend on Knowledge layer'
//   }
// ]
```

#### `findOrphanModules()`
Поиск изолированных модулей

**Параметры:** нет  
**Возвращает:** Promise<Array<string>>

```javascript
const orphans = await window.dependencyValidator.findOrphanModules();
// ['MODULE_Orphan_VER_1.0']
```

#### `buildGraph()`
Построение графа зависимостей

**Параметры:** нет  
**Возвращает:** Promise<DependencyGraph>

```javascript
const graph = await window.dependencyValidator.buildGraph();
// {
//   nodes: ['MODULE_A_VER_1.0', 'MODULE_B_VER_1.0'],
//   edges: [{ from: 'MODULE_A_VER_1.0', to: 'MODULE_B_VER_1.0' }]
// }
```

#### `getModuleLayer(moduleId)`
Определение слоя модуля

**Параметры:**
- `moduleId` (string) - MODULE_*_VER_*

**Возвращает:** string (LAYER_*) или null

```javascript
const layer = window.dependencyValidator.getModuleLayer('MODULE_DataManager_VER_1.0');
// 'LAYER_2_DATA'
```

#### `generateReport()`
Генерация отчёта о валидации

**Параметры:** нет  
**Возвращает:** Promise<string> (Markdown)

```javascript
const markdown = await window.dependencyValidator.generateReport();
console.log(markdown);
```

## Правила слоёв

### LAYER_1_CORE (Базовые утилиты)

**Описание:** Фундаментальные утилиты без зависимостей

**Может зависеть от:** Никого  
**Могут зависеть:** Все слои

**Модули:**
- DOMFactory
- FunctionTracer
- DependencyValidator
- Inspector

**Правило:** Базовые утилиты не должны зависеть от бизнес-логики

### LAYER_2_DATA (Управление данными)

**Описание:** Работа с данными и состоянием

**Может зависеть от:** LAYER_1_CORE  
**Могут зависеть:** LAYER_3_UI, LAYER_4_INTEGRATION, LAYER_5_KNOWLEDGE

**Модули:**
- DataManager

**Правило:** Данные могут использовать только базовые утилиты

### LAYER_3_UI (UI компоненты)

**Описание:** Компоненты пользовательского интерфейса

**Может зависеть от:** LAYER_1_CORE, LAYER_2_DATA  
**Могут зависеть:** LAYER_4_INTEGRATION, LAYER_5_KNOWLEDGE

**Модули:**
- UIManager
- AccordionManager
- ChecklistManager

**Правило:** UI может использовать данные, но не интеграции

### LAYER_4_INTEGRATION (Интеграции)

**Описание:** Внешние интеграции (GitHub, API)

**Может зависеть от:** LAYER_1_CORE, LAYER_2_DATA, LAYER_3_UI  
**Могут зависеть:** LAYER_5_KNOWLEDGE

**Модули:**
- AuthManager

**Правило:** Интеграции могут использовать UI для уведомлений

### LAYER_5_KNOWLEDGE (База знаний)

**Описание:** Специфичная функциональность приложения

**Может зависеть от:** LAYER_1_CORE, LAYER_2_DATA, LAYER_3_UI, LAYER_4_INTEGRATION  
**Могут зависеть:** Никто (верхний слой)

**Модули:**
- KnowledgeManager
- KnowledgeEditor

**Правило:** Верхний слой, может использовать всё

## Примеры

### Пример 1: CI/CD интеграция

```javascript
// В package.json
{
  "scripts": {
    "validate": "node scripts/validate-dependencies.js"
  }
}

// scripts/validate-dependencies.js
const report = await window.dependencyValidator.validate();

if (!report.isValid) {
    console.error('❌ Dependency validation failed!');
    process.exit(1);
}

console.log('✅ Dependencies are valid');
```

### Пример 2: Добавление нового модуля

```javascript
// Перед добавлением зависимости
const newModule = 'MODULE_NewFeature_VER_1.0';
const newModuleLayer = 'LAYER_3_UI';
const dependency = 'MODULE_DataManager_VER_1.0';
const dependencyLayer = 'LAYER_2_DATA';

// Проверить разрешена ли зависимость
const allowed = isAllowedDependency(newModuleLayer, dependencyLayer);

if (!allowed) {
    console.error(`❌ ${newModuleLayer} не может зависеть от ${dependencyLayer}`);
} else {
    console.log('✅ Зависимость разрешена');
    // Добавить в dependencies_map.json
}
```

### Пример 3: Рефакторинг архитектуры

```javascript
// До рефакторинга
const beforeReport = await window.dependencyValidator.validate();
console.log('До:', beforeReport.stats);

// Выполнить рефакторинг
// ...

// После рефакторинга
const afterReport = await window.dependencyValidator.validate();
console.log('После:', afterReport.stats);

// Сравнить
console.log('Циклов было:', beforeReport.cycles.length);
console.log('Циклов стало:', afterReport.cycles.length);
console.log('Улучшение:', beforeReport.cycles.length - afterReport.cycles.length);
```

## Troubleshooting

### Проблема 1: Валидация не работает

**Симптом:** validate() возвращает ошибку

**Причины:**
- Отсутствуют файлы состояния
- Неверный формат JSON

**Решение:**
```javascript
// Проверить наличие файлов
const files = [
    'project_registry.json',
    'dependencies_map.json',
    'architecture_layers.json'
];

files.forEach(file => {
    try {
        const data = require(`./${file}`);
        console.log(`✅ ${file} OK`);
    } catch (e) {
        console.error(`❌ ${file} ERROR:`, e.message);
    }
});
```

### Проблема 2: Ложные циклы

**Симптом:** Найдены циклы, но их нет

**Причины:**
- Дубликаты в dependencies_map.json
- Неверный формат edges

**Решение:**
```javascript
// Проверить дубликаты
const deps = require('./dependencies_map.json');
const edges = deps.edges;

const seen = new Set();
const duplicates = [];

edges.forEach(edge => {
    const key = `${edge.from}->${edge.to}`;
    if (seen.has(key)) {
        duplicates.push(edge);
    }
    seen.add(key);
});

if (duplicates.length > 0) {
    console.error('❌ Найдены дубликаты:', duplicates);
}
```

### Проблема 3: Нарушения слоёв не находятся

**Симптом:** checkLayerViolations() возвращает []

**Причины:**
- architecture_layers.json устарел
- Модуль не назначен слою

**Решение:**
```javascript
// Проверить все модули назначены слоям
const registry = require('./project_registry.json');
const layers = require('./architecture_layers.json');

const allModules = Object.keys(registry.modules);
const assignedModules = [];

Object.values(layers.layers).forEach(layer => {
    assignedModules.push(...layer.modules);
});

const unassigned = allModules.filter(m => !assignedModules.includes(m));

if (unassigned.length > 0) {
    console.error('❌ Модули без слоя:', unassigned);
}
```

## См. также

- [dependency_matrix.md](../dependency_matrix.md) - Визуализация зависимостей
- [architecture_layers.json](../architecture_layers.json) - Определение слоёв
- [PROMPT_DependencyValidator.md](../.amazonq/prompts/PROMPT_DependencyValidator.md) - Промпт для работы
- [project-standards.md](../.amazonq/rules/project-standards.md) - Стандарты PromAi
