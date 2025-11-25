# ПРОМПТ: DependencyValidator

## Когда использовать
- Перед коммитом изменений в зависимостях
- При добавлении нового модуля
- При рефакторинге архитектуры
- Для проверки соблюдения правил слоёв

## Что делает
Автоматически валидирует зависимости проекта:
- Поиск циклических зависимостей (DFS алгоритм)
- Проверка нарушений правил слоёв
- Поиск изолированных модулей
- Генерация отчёта о валидации

## Как использовать

### Шаг 1: Запустить валидацию
```javascript
// Полная валидация
const report = await window.dependencyValidator.validate();
console.log(report);
```

### Шаг 2: Проверить результат
```javascript
if (report.isValid) {
    console.log('✅ Все проверки пройдены!');
} else {
    console.error('❌ Найдены проблемы:', report.errors);
}
```

### Шаг 3: Исправить проблемы
```javascript
// Если найдены циклы
report.cycles.forEach(cycle => {
    console.log('Цикл:', cycle.join(' → '));
});

// Если найдены нарушения слоёв
report.layerViolations.forEach(violation => {
    console.log(`${violation.from} → ${violation.to}: ${violation.reason}`);
});
```

## Примеры

### Пример 1: Проверка перед коммитом
```javascript
// Запустить валидацию
const report = await window.dependencyValidator.validate();

if (!report.isValid) {
    console.error('❌ Валидация не пройдена!');
    console.error('Циклов:', report.cycles.length);
    console.error('Нарушений:', report.layerViolations.length);
    process.exit(1);
}

console.log('✅ Валидация пройдена!');
// Можно коммитить
```

### Пример 2: Поиск циклических зависимостей
```javascript
// Найти циклы
const cycles = await window.dependencyValidator.findCycles();

if (cycles.length > 0) {
    console.error('❌ Найдены циклические зависимости:');
    cycles.forEach((cycle, i) => {
        console.error(`Цикл ${i + 1}:`, cycle.join(' → '));
    });
} else {
    console.log('✅ Циклических зависимостей нет');
}
```

### Пример 3: Проверка правил слоёв
```javascript
// Проверить нарушения
const violations = await window.dependencyValidator.checkLayerViolations();

if (violations.length > 0) {
    console.error('❌ Найдены нарушения правил слоёв:');
    violations.forEach(v => {
        console.error(`${v.from} (${v.fromLayer}) → ${v.to} (${v.toLayer})`);
        console.error(`Причина: ${v.reason}`);
    });
} else {
    console.log('✅ Все правила слоёв соблюдены');
}
```

### Пример 4: Поиск изолированных модулей
```javascript
// Найти orphan модули
const orphans = await window.dependencyValidator.findOrphanModules();

if (orphans.length > 0) {
    console.warn('⚠️ Найдены изолированные модули:');
    orphans.forEach(module => {
        console.warn(`- ${module} (нет зависимостей и зависимых)`);
    });
}
```

## API Reference

### dependencyValidator.validate()
Полная валидация проекта

**Параметры:** нет  
**Возвращает:** Promise<ValidationReport>

```javascript
{
    isValid: true,
    cycles: [],
    layerViolations: [],
    orphanModules: [],
    stats: {
        totalModules: 11,
        totalDependencies: 13,
        maxDepth: 3
    }
}
```

### dependencyValidator.findCycles()
Поиск циклических зависимостей (DFS)

**Параметры:** нет  
**Возвращает:** Promise<Array<Array<string>>>

```javascript
[
    ['MODULE_A_VER_1.0', 'MODULE_B_VER_1.0', 'MODULE_A_VER_1.0'],
    ['MODULE_C_VER_1.0', 'MODULE_D_VER_1.0', 'MODULE_C_VER_1.0']
]
```

### dependencyValidator.checkLayerViolations()
Проверка нарушений правил слоёв

**Параметры:** нет  
**Возвращает:** Promise<Array<LayerViolation>>

```javascript
[
    {
        from: 'MODULE_A_VER_1.0',
        fromLayer: 'LAYER_3_UI',
        to: 'MODULE_B_VER_1.0',
        toLayer: 'LAYER_5_KNOWLEDGE',
        reason: 'UI layer cannot depend on Knowledge layer'
    }
]
```

### dependencyValidator.findOrphanModules()
Поиск изолированных модулей

**Параметры:** нет  
**Возвращает:** Promise<Array<string>>

```javascript
['MODULE_Orphan_VER_1.0']
```

### dependencyValidator.buildGraph()
Построение графа зависимостей

**Параметры:** нет  
**Возвращает:** Promise<DependencyGraph>

```javascript
{
    nodes: ['MODULE_A_VER_1.0', 'MODULE_B_VER_1.0'],
    edges: [
        { from: 'MODULE_A_VER_1.0', to: 'MODULE_B_VER_1.0' }
    ]
}
```

### dependencyValidator.getModuleLayer(moduleId)
Определение слоя модуля

**Параметры:**
- `moduleId` (string) - MODULE_*_VER_*

**Возвращает:** string (LAYER_*) или null

```javascript
const layer = dependencyValidator.getModuleLayer('MODULE_DataManager_VER_1.0');
// 'LAYER_2_DATA'
```

### dependencyValidator.generateReport()
Генерация отчёта о валидации

**Параметры:** нет  
**Возвращает:** Promise<string> (Markdown)

## Правила слоёв

### LAYER_1_CORE (Базовые утилиты)
- Не зависит ни от кого
- Могут зависеть: все слои

### LAYER_2_DATA (Управление данными)
- Может зависеть от: LAYER_1_CORE
- Могут зависеть: LAYER_3_UI, LAYER_4_INTEGRATION, LAYER_5_KNOWLEDGE

### LAYER_3_UI (UI компоненты)
- Может зависеть от: LAYER_1_CORE, LAYER_2_DATA
- Могут зависеть: LAYER_4_INTEGRATION, LAYER_5_KNOWLEDGE

### LAYER_4_INTEGRATION (Интеграции)
- Может зависеть от: LAYER_1_CORE, LAYER_2_DATA, LAYER_3_UI
- Могут зависеть: LAYER_5_KNOWLEDGE

### LAYER_5_KNOWLEDGE (База знаний)
- Может зависеть от: LAYER_1_CORE, LAYER_2_DATA, LAYER_3_UI, LAYER_4_INTEGRATION
- Не может зависеть ни от кого (верхний слой)

## Связанные файлы
- `src/modules/DependencyValidator.js` - Реализация
- `project_registry.json` - Реестр модулей
- `dependencies_map.json` - Граф зависимостей
- `architecture_layers.json` - Определение слоёв

## Зависимости
- Нет зависимостей (LAYER_1_CORE)

## Алгоритмы

### DFS для поиска циклов
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

## Troubleshooting

### Проблема 1: Валидация не работает
**Симптом:** validate() возвращает ошибку  
**Решение:** Проверьте наличие файлов project_registry.json, dependencies_map.json, architecture_layers.json

### Проблема 2: Ложные циклы
**Симптом:** Найдены циклы, но их нет  
**Решение:** Проверьте dependencies_map.json на дубликаты

### Проблема 3: Нарушения слоёв не находятся
**Симптом:** checkLayerViolations() возвращает []  
**Решение:** Убедитесь что architecture_layers.json актуален

## См. также
- [dependency_matrix.md](../../dependency_matrix.md) - Визуализация зависимостей
- [architecture_layers.json](../../architecture_layers.json) - Определение слоёв
- [project-standards.md](../rules/project-standards.md) - Стандарты PromAi
