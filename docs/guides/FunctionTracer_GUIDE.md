# FunctionTracer - Руководство

## Обзор

FunctionTracer - это модуль для автоматического логирования и трассировки вызовов функций в реальном времени. Позволяет отслеживать порядок выполнения, время работы и частоту вызовов всех функций в приложении.

## Зачем нужно

**Проблемы которые решает:**
- Сложно понять порядок выполнения функций
- Неизвестно какие функции вызываются чаще всего
- Трудно найти узкие места по производительности
- Нет понимания цепочек вызовов

**Решение:**
FunctionTracer автоматически логирует каждый вызов функции с метаданными (модуль, функция, время, параметры) и предоставляет API для анализа.

## Как работает

### Архитектура

```
User Action → Function Call → FunctionTracer.log() → Circular Buffer (1000 записей)
                                                    ↓
                                            Inspector (визуализация)
                                                    ↓
                                            Export (JSON/MD/HTML)
```

### Circular Buffer

FunctionTracer использует circular buffer на 1000 записей:
- Автоматическая очистка старых записей
- Постоянный размер памяти (~100KB)
- Быстрая запись (O(1))

### Метаданные записи

Каждая запись содержит:
```javascript
{
    moduleId: 'MODULE_DataManager_VER_1.0',
    functionId: 'FUNC_saveToLocalStorage_002',
    timestamp: 1705315200000,
    duration: 3.5,  // мс
    params: {}      // опционально
}
```

## Использование

### Базовое использование

```javascript
// 1. Включить трассировку
window.functionTracer.enable();

// 2. Работать с приложением
// Все вызовы логируются автоматически

// 3. Получить трассировку
const trace = window.functionTracer.getTrace();
console.log(trace);

// 4. Выключить
window.functionTracer.disable();
```

### Продвинутое использование

#### Фильтрация по модулю

```javascript
// Получить только вызовы DataManager
const dataTrace = window.functionTracer.filterByModule('MODULE_DataManager_VER_1.0');

dataTrace.forEach(entry => {
    console.log(`${entry.functionId}: ${entry.duration}ms`);
});
```

#### Фильтрация по функции

```javascript
// Получить только вызовы saveToLocalStorage
const saveTrace = window.functionTracer.filterByFunction('FUNC_saveToLocalStorage_002');

console.log(`Вызвано ${saveTrace.length} раз`);
console.log(`Среднее время: ${saveTrace.reduce((sum, e) => sum + e.duration, 0) / saveTrace.length}ms`);
```

#### Поиск медленных функций

```javascript
// Получить 10 самых медленных вызовов
const slowest = window.functionTracer.getSlowest(10);

slowest.forEach((entry, i) => {
    console.log(`${i + 1}. ${entry.functionId}: ${entry.duration}ms`);
});
```

#### Статистика

```javascript
const stats = window.functionTracer.getStats();

console.log('Всего вызовов:', stats.totalCalls);
console.log('Среднее время:', stats.averageDuration, 'ms');
console.log('Самая вызываемая:', stats.mostCalled);
console.log('Самая медленная:', stats.slowest);
```

## API Reference

### Функции

#### `enable()`
Включает трассировку вызовов функций

**Параметры:** нет  
**Возвращает:** void

```javascript
window.functionTracer.enable();
```

#### `disable()`
Выключает трассировку

**Параметры:** нет  
**Возвращает:** void

```javascript
window.functionTracer.disable();
```

#### `log(moduleId, functionId, duration, params)`
Логирует вызов функции (используется автоматически)

**Параметры:**
- `moduleId` (string) - MODULE_*_VER_*
- `functionId` (string) - FUNC_*_###
- `duration` (number) - Время выполнения в мс
- `params` (object) - Параметры вызова (опционально)

**Возвращает:** void

```javascript
// Автоматически вызывается при каждом вызове функции
```

#### `getTrace()`
Получить все записи трассировки

**Параметры:** нет  
**Возвращает:** Array<TraceEntry>

```javascript
const trace = window.functionTracer.getTrace();
// [{moduleId: '...', functionId: '...', timestamp: ..., duration: ...}, ...]
```

#### `filterByModule(moduleId)`
Фильтр по модулю

**Параметры:**
- `moduleId` (string) - MODULE_*_VER_*

**Возвращает:** Array<TraceEntry>

```javascript
const trace = window.functionTracer.filterByModule('MODULE_DataManager_VER_1.0');
```

#### `filterByFunction(functionId)`
Фильтр по функции

**Параметры:**
- `functionId` (string) - FUNC_*_###

**Возвращает:** Array<TraceEntry>

```javascript
const trace = window.functionTracer.filterByFunction('FUNC_saveToLocalStorage_002');
```

#### `getSlowest(count)`
Получить самые медленные вызовы

**Параметры:**
- `count` (number) - Количество записей (по умолчанию 10)

**Возвращает:** Array<TraceEntry>

```javascript
const slowest = window.functionTracer.getSlowest(5);
```

#### `getStats()`
Получить статистику

**Параметры:** нет  
**Возвращает:** Object

```javascript
const stats = window.functionTracer.getStats();
// {
//   totalCalls: 342,
//   averageDuration: 2.3,
//   mostCalled: 'FUNC_saveToLocalStorage_002',
//   slowest: 'FUNC_loadFromGitHub_004'
// }
```

#### `clear()`
Очистить все записи

**Параметры:** нет  
**Возвращает:** void

```javascript
window.functionTracer.clear();
```

#### `export()`
Экспорт в JSON

**Параметры:** нет  
**Возвращает:** string (JSON)

```javascript
const json = window.functionTracer.export();
console.log(json);
```

## Примеры

### Пример 1: Отладка производительности

```javascript
// Включить трассировку
window.functionTracer.enable();

// Выполнить медленную операцию
await authManager.loadFromGitHub();

// Найти узкие места
const slowest = window.functionTracer.getSlowest(5);
slowest.forEach(entry => {
    console.log(`${entry.functionId}: ${entry.duration}ms`);
});

// Результат:
// FUNC_loadFromGitHub_004: 1250ms ← узкое место!
// FUNC_mergeData_012: 45ms
// FUNC_renderAccordion_002: 23ms
```

### Пример 2: Анализ частоты вызовов

```javascript
// Включить трассировку
window.functionTracer.enable();

// Работать с приложением 5 минут
// ...

// Получить статистику
const stats = window.functionTracer.getStats();
console.log('Самая вызываемая:', stats.mostCalled);

// Детальный анализ
const saveTrace = window.functionTracer.filterByFunction(stats.mostCalled);
console.log(`Вызвано ${saveTrace.length} раз`);
console.log(`Среднее время: ${saveTrace.reduce((s, e) => s + e.duration, 0) / saveTrace.length}ms`);
```

### Пример 3: Трассировка цепочки вызовов

```javascript
// Включить трассировку
window.functionTracer.enable();

// Выполнить действие
dataManager.addTechnology();

// Получить все вызовы за последние 100мс
const now = Date.now();
const recent = window.functionTracer.getTrace().filter(e => now - e.timestamp < 100);

// Показать цепочку
recent.forEach(entry => {
    console.log(`${entry.moduleId} → ${entry.functionId} (${entry.duration}ms)`);
});

// Результат:
// MODULE_DataManager_VER_1.0 → FUNC_addTechnology_005 (1.2ms)
// MODULE_DataManager_VER_1.0 → FUNC_saveToLocalStorage_002 (3.5ms)
// MODULE_AccordionManager_VER_1.0 → FUNC_renderAccordion_002 (12.3ms)
```

## Интеграция с Inspector

FunctionTracer интегрирован с Inspector для визуализации:

### Активация

1. Открыть Inspector: `Ctrl+Shift+I`
2. Переключиться на вкладку "Трассировка"
3. Нажать кнопку "📊 Трассировка"

### Возможности

- **Живое обновление:** Каждую секунду
- **Цветовая кодировка:**
  - 🟢 Зелёный: < 5ms (быстро)
  - 🟡 Жёлтый: 5-10ms (нормально)
  - 🔴 Красный: > 10ms (медленно)
- **Фильтры:** По модулю, по функции
- **Экспорт:** JSON, Markdown, HTML

### Экспорт отчётов

```javascript
// Через Inspector
// 1. Ctrl+Shift+I
// 2. Вкладка "Трассировка"
// 3. Кнопка "💾 Экспорт"
// 4. Выбрать формат (JSON/MD/HTML)

// Или программно
const json = window.functionTracer.export();
```

## Производительность

### Overhead

- **Запись:** ~0.1ms на вызов
- **Память:** ~100KB для 1000 записей
- **CPU:** Минимальное влияние

### Рекомендации

1. ✅ Включать только при отладке
2. ✅ Использовать фильтры для больших трассировок
3. ✅ Очищать buffer периодически (clear())
4. ❌ Не оставлять включённым в production

### Оптимизация

```javascript
// Плохо: получать всю трассировку каждый раз
setInterval(() => {
    const trace = window.functionTracer.getTrace(); // 1000 записей
    // ...
}, 1000);

// Хорошо: использовать фильтры
setInterval(() => {
    const recent = window.functionTracer.getTrace()
        .filter(e => Date.now() - e.timestamp < 1000); // только последние
    // ...
}, 1000);
```

## Troubleshooting

### Проблема 1: Трассировка не работает

**Симптом:** getTrace() возвращает пустой массив

**Причины:**
- Трассировка не включена
- Buffer был очищен

**Решение:**
```javascript
// Проверить статус
console.log(window.functionTracer.enabled); // должно быть true

// Включить
window.functionTracer.enable();
```

### Проблема 2: Слишком много записей

**Симптом:** Браузер тормозит

**Причины:**
- Circular buffer переполнен
- Слишком частые вызовы

**Решение:**
```javascript
// Очистить buffer
window.functionTracer.clear();

// Или использовать фильтры
const filtered = window.functionTracer.filterByModule('MODULE_DataManager_VER_1.0');
```

### Проблема 3: Не видно времени выполнения

**Симптом:** duration всегда 0

**Причины:**
- Функция выполняется слишком быстро (<1ms)
- Браузер не поддерживает performance.now()

**Решение:**
```javascript
// Проверить поддержку
console.log(typeof performance.now); // должно быть 'function'

// Для быстрых функций смотреть среднее время
const trace = window.functionTracer.filterByFunction('FUNC_fast_001');
const avg = trace.reduce((s, e) => s + e.duration, 0) / trace.length;
console.log('Среднее:', avg, 'ms');
```

## См. также

- [Inspector_GUIDE.md](Inspector_GUIDE.md) - Визуализация трассировки
- [FunctionRegistry_GUIDE.md](FunctionRegistry_GUIDE.md) - Статический анализ вызовов
- [PROMPT_FunctionTracer.md](../.amazonq/prompts/PROMPT_FunctionTracer.md) - Промпт для работы
