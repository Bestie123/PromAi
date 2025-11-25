# Enhance UX

Улучши UX в области: {область}

## Параметры
- **Область улучшения:** {AREA}
- **Модули:** {MODULE_ID_1, MODULE_ID_2}
- **Приоритет:** {high/medium/low}
- **Цель:** {конкретная метрика улучшения}

## Шаг 1: Загрузить контекст

### Из project_registry.json
```javascript
// Загрузить затрагиваемые модули
const modules = [moduleId1, moduleId2].map(id => projectRegistry.modules[id]);
// - path: путь к файлу
// - functions: список FUNC_ID
// - dependencies: зависимости
// - layer: архитектурный слой
```

### Из dependencies_map.json
```javascript
// Проверить зависимости
const deps = dependenciesMap.edges.filter(e => 
    [moduleId1, moduleId2].includes(e.from)
);
```

### Текущее состояние UX
```javascript
// Проанализировать текущий UX
// - Какие проблемы есть?
// - Что раздражает пользователей?
// - Какие метрики нужно улучшить?
```

## Шаг 2: Определить улучшения

### Категории улучшений

#### 1. Производительность
- Debouncing для частых операций
- Lazy loading для больших данных
- Кэширование результатов
- Оптимизация рендеринга

#### 2. Удобство
- Горячие клавиши
- Drag & Drop
- Контекстные меню
- Автозаполнение

#### 3. Обратная связь
- Индикаторы загрузки
- Прогресс-бары
- Уведомления о действиях
- Подтверждения операций

#### 4. Надёжность
- Автосохранение
- Оффлайн-режим
- Восстановление после ошибок
- Конфликт-разрешение

#### 5. Визуализация
- WYSIWYG редактирование
- Превью в реальном времени
- Анимации переходов
- Визуальные подсказки

## Шаг 3: Приоритизация

### Матрица Impact/Effort
```
Высокий Impact, Низкий Effort (Сделать первым):
- Горячие клавиши
- Автосохранение
- Индикаторы загрузки

Высокий Impact, Высокий Effort (Запланировать):
- WYSIWYG редактор
- Оффлайн-режим
- Drag & Drop

Низкий Impact, Низкий Effort (Быстрые победы):
- Анимации
- Подсказки
- Улучшенные уведомления

Низкий Impact, Высокий Effort (Отложить):
- Сложные визуализации
- Продвинутые фичи
```

## Шаг 4: Реализация

### Шаблон улучшения
```javascript
// MODULE_{Name}_VER_1.0

// FUNC_{improvementName}_{number} - Описание улучшения
{improvementName}() {
    // 1. Валидация
    if (!this.isReady()) {
        console.warn('[MODULE_ID] Not ready for improvement');
        return;
    }
    
    // 2. Реализация улучшения
    const result = this.implementImprovement();
    
    // 3. Обратная связь пользователю
    uiManager.showNotification('✅ Улучшение применено', 'success');
    
    // 4. Логирование для аналитики
    console.log('[MODULE_ID] Improvement applied:', result);
    
    return result;
}
```

## Примеры улучшений

### Пример 1: Горячие клавиши
```javascript
// MODULE_KnowledgeEditor_VER_1.0

// FUNC_initKeyboardShortcuts_044 - Инициализация горячих клавиш
initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl+S - Сохранить
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            this.saveContent();
            uiManager.showNotification('💾 Сохранено', 'success');
        }
        
        // Ctrl+B - Жирный текст
        if (e.ctrlKey && e.key === 'b') {
            e.preventDefault();
            this.formatText('bold');
        }
        
        // Ctrl+I - Курсив
        if (e.ctrlKey && e.key === 'i') {
            e.preventDefault();
            this.formatText('italic');
        }
        
        // Ctrl+K - Вставить ссылку
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            this.insertLink();
        }
    });
    
    console.log('[MODULE_KnowledgeEditor_VER_1.0] Keyboard shortcuts initialized');
}
```

### Пример 2: Автосохранение с индикацией
```javascript
// MODULE_AuthManager_VER_1.0

// FUNC_scheduleAutoSave_020 - Автосохранение с debouncing
scheduleAutoSave() {
    if (!this.autoSaveEnabled) return;
    
    // Показать индикатор
    this.showSavingIndicator();
    
    // Debouncing
    if (this.autoSaveTimeout) {
        clearTimeout(this.autoSaveTimeout);
    }
    
    this.autoSaveTimeout = setTimeout(() => {
        this.autoSaveToGitHub();
    }, 10000); // 10 секунд
}

// FUNC_showSavingIndicator_021 - Индикатор сохранения
showSavingIndicator() {
    const indicator = domFactory.create({
        moduleId: this.moduleId,
        componentId: 'COMP_SavingIndicator',
        functionId: 'FUNC_showSavingIndicator_021',
        className: 'saving-indicator',
        innerHTML: '💾 Сохранение...'
    });
    
    document.body.appendChild(indicator);
    
    // Удалить через 2 секунды
    setTimeout(() => indicator.remove(), 2000);
}
```

### Пример 3: Превью в реальном времени
```javascript
// MODULE_KnowledgeEditor_VER_1.0

// FUNC_enableLivePreview_045 - Превью в реальном времени
enableLivePreview() {
    const editor = document.getElementById('knowledgeEditor');
    const preview = document.getElementById('preview');
    
    if (!editor || !preview) return;
    
    // Debounced update
    let updateTimeout;
    editor.addEventListener('input', () => {
        if (updateTimeout) clearTimeout(updateTimeout);
        
        updateTimeout = setTimeout(() => {
            preview.innerHTML = editor.innerHTML;
            console.log('[MODULE_KnowledgeEditor_VER_1.0] Preview updated');
        }, 300); // 300ms debounce
    });
    
    console.log('[MODULE_KnowledgeEditor_VER_1.0] Live preview enabled');
}
```

### Пример 4: Индикатор прогресса
```javascript
// MODULE_AuthManager_VER_1.0

// FUNC_loadFromGitHubWithProgress_022 - Загрузка с прогрессом
async loadFromGitHubWithProgress() {
    const progressBar = this.createProgressBar();
    
    try {
        // Шаг 1: Подключение (25%)
        progressBar.update(25, 'Подключение к GitHub...');
        const response = await fetch(url, options);
        
        // Шаг 2: Загрузка (50%)
        progressBar.update(50, 'Загрузка данных...');
        const data = await response.json();
        
        // Шаг 3: Обработка (75%)
        progressBar.update(75, 'Обработка данных...');
        const processed = this.processData(data);
        
        // Шаг 4: Завершение (100%)
        progressBar.update(100, 'Готово!');
        progressBar.remove();
        
        uiManager.showNotification('✅ Загружено', 'success');
    } catch (error) {
        progressBar.remove();
        uiManager.showNotification('❌ Ошибка загрузки', 'error');
    }
}

// FUNC_createProgressBar_023 - Создание прогресс-бара
createProgressBar() {
    const container = domFactory.create({
        moduleId: this.moduleId,
        componentId: 'COMP_ProgressBar',
        className: 'progress-container'
    });
    
    const bar = domFactory.create({
        tag: 'div',
        className: 'progress-bar',
        attributes: { style: 'width: 0%' }
    });
    
    const label = domFactory.create({
        tag: 'span',
        className: 'progress-label',
        textContent: 'Начало...'
    });
    
    container.appendChild(bar);
    container.appendChild(label);
    document.body.appendChild(container);
    
    return {
        update(percent, text) {
            bar.style.width = percent + '%';
            label.textContent = text;
        },
        remove() {
            container.remove();
        }
    };
}
```

### Пример 5: Drag & Drop
```javascript
// MODULE_AccordionManager_VER_1.0

// FUNC_enableDragDrop_010 - Drag & Drop для категорий
enableDragDrop() {
    const categories = document.querySelectorAll('.category-item');
    
    categories.forEach(category => {
        category.draggable = true;
        
        category.addEventListener('dragstart', (e) => {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', category.innerHTML);
            category.classList.add('dragging');
        });
        
        category.addEventListener('dragend', () => {
            category.classList.remove('dragging');
        });
        
        category.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        
        category.addEventListener('drop', (e) => {
            e.preventDefault();
            // Логика перемещения
            this.reorderCategories(e);
            uiManager.showNotification('✅ Порядок изменён', 'success');
        });
    });
    
    console.log('[MODULE_AccordionManager_VER_1.0] Drag & Drop enabled');
}
```

### Пример 6: Оффлайн-режим
```javascript
// MODULE_AuthManager_VER_1.0

// FUNC_enableOfflineMode_024 - Оффлайн-режим
enableOfflineMode() {
    // Проверка онлайн/оффлайн
    window.addEventListener('online', () => {
        uiManager.showNotification('🌐 Онлайн', 'success');
        this.syncPendingChanges();
    });
    
    window.addEventListener('offline', () => {
        uiManager.showNotification('📴 Оффлайн режим', 'warning');
    });
    
    console.log('[MODULE_AuthManager_VER_1.0] Offline mode enabled');
}

// FUNC_syncPendingChanges_025 - Синхронизация отложенных изменений
async syncPendingChanges() {
    const pending = localStorage.getItem('pendingChanges');
    if (!pending) return;
    
    try {
        const changes = JSON.parse(pending);
        await this.saveToGitHub(changes);
        localStorage.removeItem('pendingChanges');
        uiManager.showNotification('✅ Изменения синхронизированы', 'success');
    } catch (error) {
        console.error('[MODULE_AuthManager_VER_1.0] Sync failed:', error);
    }
}
```

## Шаг 5: Обновить state файлы

### 1. project_registry.json
```json
{
  "modules": {
    "MODULE_KnowledgeEditor_VER_1.0": {
      "version": "1.1.0",
      "functions": [
        "FUNC_existing_001",
        "FUNC_initKeyboardShortcuts_044",
        "FUNC_enableLivePreview_045"
      ]
    },
    "MODULE_AuthManager_VER_1.0": {
      "version": "1.1.0",
      "functions": [
        "FUNC_existing_001",
        "FUNC_scheduleAutoSave_020",
        "FUNC_showSavingIndicator_021",
        "FUNC_loadFromGitHubWithProgress_022",
        "FUNC_createProgressBar_023",
        "FUNC_enableOfflineMode_024",
        "FUNC_syncPendingChanges_025"
      ]
    }
  }
}
```

### 2. dependencies_map.json
```json
{
  "edges": [
    {"from": "MODULE_KnowledgeEditor_VER_1.0", "to": "MODULE_UIManager_VER_1.0"},
    {"from": "MODULE_AuthManager_VER_1.0", "to": "MODULE_UIManager_VER_1.0"}
  ]
}
```

### 3. todo.json
```json
{
  "tasks": [
    {
      "id": "TASK_XXX",
      "title": "Пользовательское тестирование UX улучшений",
      "status": "backlog",
      "priority": "high",
      "estimatedHours": 4
    },
    {
      "id": "TASK_YYY",
      "title": "Собрать метрики использования горячих клавиш",
      "status": "backlog",
      "priority": "medium"
    }
  ]
}
```

### 4. changelog.md
```markdown
## [1.1.0] - 2024-01-15
### Enhanced UX
- Добавлены горячие клавиши (Ctrl+S, Ctrl+B, Ctrl+I, Ctrl+K)
- Автосохранение с индикацией (debouncing 10s)
- Превью в реальном времени (debouncing 300ms)
- Прогресс-бар для загрузки из GitHub
- Drag & Drop для изменения порядка категорий
- Оффлайн-режим с синхронизацией при подключении
```

## User Stories

### Story 1: Быстрое редактирование
```
Как пользователь,
Я хочу использовать горячие клавиши,
Чтобы быстро форматировать текст без мыши.

Критерии приёмки:
- Ctrl+S сохраняет
- Ctrl+B делает жирным
- Ctrl+I делает курсивом
- Ctrl+K вставляет ссылку
- Показывается уведомление о действии
```

### Story 2: Не терять данные
```
Как пользователь,
Я хочу автосохранение,
Чтобы не потерять данные при сбое.

Критерии приёмки:
- Автосохранение каждые 10 секунд
- Показывается индикатор "Сохранение..."
- Работает в фоне без блокировки UI
- Можно отключить в настройках
```

### Story 3: Видеть прогресс
```
Как пользователь,
Я хочу видеть прогресс загрузки,
Чтобы понимать что происходит.

Критерии приёмки:
- Прогресс-бар показывает % загрузки
- Текстовое описание текущего шага
- Можно отменить операцию
- Показывается время до завершения
```

### Story 4: Работать оффлайн
```
Как пользователь,
Я хочу работать без интернета,
Чтобы не зависеть от подключения.

Критерии приёмки:
- Все данные доступны оффлайн
- Изменения сохраняются локально
- При подключении автосинхронизация
- Уведомление о статусе подключения
```

## Технический подход

### Debouncing
```javascript
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Использование
const debouncedSave = debounce(() => this.save(), 10000);
```

### Throttling
```javascript
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Использование
const throttledScroll = throttle(() => this.handleScroll(), 100);
```

### Local-first architecture
```javascript
// 1. Сохранить локально
localStorage.setItem('data', JSON.stringify(data));

// 2. Попытаться синхронизировать
if (navigator.onLine) {
    await this.syncToServer(data);
} else {
    // Отложить до подключения
    this.queueForSync(data);
}
```

### Service Worker (опционально)
```javascript
// sw.js
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
```

## Метрики успеха

### Производительность
- ⏱️ Время отклика < 100ms
- 🚀 Время загрузки < 2s
- 💾 Автосохранение без блокировки UI

### Удобство
- ⌨️ 80% пользователей используют горячие клавиши
- 🖱️ Drag & Drop работает интуитивно
- 📱 Адаптивный дизайн на всех устройствах

### Надёжность
- 💪 0 потерь данных
- 🔄 100% успешных синхронизаций
- 📴 Работа оффлайн без ошибок

### Удовлетворённость
- ⭐ Рейтинг удобства > 4.5/5
- 😊 NPS > 50
- 📈 Рост активности на 30%

## Проверка работы

### ✅ Чеклист
- [ ] Горячие клавиши работают
- [ ] Автосохранение активно
- [ ] Индикаторы показываются
- [ ] Прогресс-бар отображается
- [ ] Drag & Drop функционирует
- [ ] Оффлайн-режим работает
- [ ] Все улучшения имеют FUNC_ID
- [ ] Используется DOMFactory
- [ ] project_registry.json обновлён
- [ ] dependencies_map.json обновлён
- [ ] todo.json обновлён
- [ ] changelog.md обновлён

### Консоль должна показать:
```
[MODULE_KnowledgeEditor_VER_1.0] Keyboard shortcuts initialized
[MODULE_KnowledgeEditor_VER_1.0] Live preview enabled
[MODULE_AuthManager_VER_1.0] Offline mode enabled
// Нет ошибок
```

### Пользовательское тестирование:
```
1. Попробовать все горячие клавиши
2. Проверить автосохранение (подождать 10 секунд)
3. Загрузить данные и посмотреть прогресс
4. Перетащить категорию
5. Отключить интернет и продолжить работу
6. Подключить интернет и проверить синхронизацию
```

## Troubleshooting

### Проблема: Горячие клавиши не работают
**Решение:** Проверить что event listener добавлен
```javascript
console.log('Keyboard shortcuts:', this.keyboardShortcutsEnabled);
```

### Проблема: Автосохранение слишком частое
**Решение:** Увеличить debounce delay
```javascript
// Было: 10000ms (10s)
// Стало: 30000ms (30s)
```

### Проблема: Прогресс-бар не показывается
**Решение:** Проверить что DOMFactory используется
```javascript
const progressBar = domFactory.create({
    moduleId: this.moduleId,
    componentId: 'COMP_ProgressBar'
});
```

## См. также
- [add-function.md](add-function.md) - Добавление функций
- [refactor.md](refactor.md) - Рефакторинг кода
- [create-tests.md](create-tests.md) - Тестирование улучшений
- [project-standards.md](../project-standards.md) - Стандарты PromAi
