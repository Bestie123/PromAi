# 🎨 Варианты реализации PromAi Inspector Pro v3.1

## 📊 Сравнение вариантов

| Функция | Вариант 1 (Базовый) | Вариант 2 (Расширенный) | Вариант 3 (Pro) |
|---------|---------------------|-------------------------|-----------------|
| Одна кнопка | ✅ | ✅ | ✅ |
| Auto COMP_ID | ✅ | ✅ | ✅ |
| Auto MODULE_ID | ✅ | ✅ | ✅ |
| Iframe support | ✅ | ✅ | ✅ |
| Cross-origin iframe | ✅ | ✅ | ✅ |
| MutationObserver | ❌ | ✅ | ✅ |
| Визуальный Inspector | ❌ | ❌ | ✅ |
| Настройки | ❌ | ✅ | ✅ |
| Статистика | Базовая | Расширенная | Полная |
| Размер | ~5KB | ~15KB | ~30KB |

---

## 🟢 Вариант 1: Базовый (ТЕКУЩИЙ)

### Что включено:
- ✅ Одна кнопка "Make Site PromAi-Ready"
- ✅ Автоматические `data-component-id="COMP_10000"`, `COMP_10001"`, ...
- ✅ Пропуск элементов с существующими ID
- ✅ `data-module-id="M_AUTO_1.0"` для скриптов
- ✅ Обработка всех iframe (same-origin + cross-origin)
- ✅ Только видимые элементы
- ✅ Сохранение счётчика в localStorage

### Файлы:
```
src2/
├── manifest.json          # 1KB
├── popup.html             # 1KB
├── popup.js               # 2KB
├── content.js             # 3KB
└── icons/                 # 3KB
```

### Использование:
```javascript
// 1. Нажать кнопку в popup
// 2. Готово!
```

### Плюсы:
- ✅ Минимальный код
- ✅ Быстрая работа
- ✅ Простая установка
- ✅ Нет зависимостей

### Минусы:
- ❌ Нет автообработки новых элементов
- ❌ Нет визуального Inspector
- ❌ Нет настроек

---

## 🟡 Вариант 2: Расширенный

### Дополнительно к Варианту 1:
- ✅ **MutationObserver** - автообработка динамических элементов
- ✅ **Настройки** - префикс ID, начальный счётчик, фильтры
- ✅ **Экспорт/импорт** - сохранение конфигурации
- ✅ **Расширенная статистика** - детальный отчёт
- ✅ **Фильтры** - исключение определённых элементов
- ✅ **Режимы** - одноразовый / постоянный мониторинг

### Дополнительные файлы:
```
src2/
├── ... (все из Варианта 1)
├── options.html           # Страница настроек
├── options.js             # Логика настроек
├── background.js          # Service worker для постоянного мониторинга
└── observer.js            # MutationObserver логика
```

### Код MutationObserver:

```javascript
// observer.js
class PromAiObserver {
  constructor(config) {
    this.counter = config.startCounter || 10000;
    this.prefix = config.prefix || 'COMP_';
    this.enabled = false;
  }

  start() {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            this.processElement(node);
            // Рекурсивно обработать детей
            node.querySelectorAll('*').forEach(child => {
              this.processElement(child);
            });
          }
        });
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    this.enabled = true;
  }

  stop() {
    if (this.observer) {
      this.observer.disconnect();
      this.enabled = false;
    }
  }

  processElement(el) {
    if (!el.hasAttribute('data-component-id')) {
      if (el.offsetParent !== null || el.tagName === 'BODY') {
        el.setAttribute('data-component-id', `${this.prefix}${this.counter++}`);
      }
    }
  }
}

// Использование
const observer = new PromAiObserver({ startCounter: 10000 });
observer.start();
```

### Настройки (options.html):

```html
<!DOCTYPE html>
<html>
<head>
  <title>PromAi Inspector Pro - Settings</title>
</head>
<body>
  <h1>Settings</h1>
  
  <label>
    Component ID Prefix:
    <input type="text" id="prefix" value="COMP_">
  </label>
  
  <label>
    Start Counter:
    <input type="number" id="startCounter" value="10000">
  </label>
  
  <label>
    <input type="checkbox" id="autoProcess">
    Auto-process new elements (MutationObserver)
  </label>
  
  <label>
    Exclude elements:
    <input type="text" id="exclude" placeholder="header, footer, nav">
  </label>
  
  <button id="save">Save Settings</button>
  <button id="export">Export Config</button>
  <button id="import">Import Config</button>
  
  <script src="options.js"></script>
</body>
</html>
```

### Плюсы:
- ✅ Автоматическая обработка новых элементов
- ✅ Гибкие настройки
- ✅ Экспорт/импорт конфигурации
- ✅ Постоянный мониторинг

### Минусы:
- ❌ Больше кода (~15KB)
- ❌ Выше нагрузка на CPU (MutationObserver)
- ❌ Нет визуального Inspector

---

## 🔴 Вариант 3: Pro (Максимальный)

### Дополнительно к Варианту 2:
- ✅ **Визуальный Inspector** - как в PromAi (Ctrl+Shift+I)
- ✅ **Подсветка элементов** - красная рамка при наведении
- ✅ **Панель информации** - показывает все ID
- ✅ **Копирование ID** - кнопка 📋
- ✅ **Закрепление элементов** - кнопка 📌
- ✅ **Живая трассировка** - логирование изменений
- ✅ **Экспорт отчётов** - JSON/Markdown/HTML
- ✅ **Граф зависимостей** - визуализация структуры

### Дополнительные файлы:
```
src2/
├── ... (все из Варианта 2)
├── inspector.js           # Визуальный Inspector
├── inspector.css          # Стили Inspector
├── tracer.js              # Трассировка изменений
└── graph.js               # Граф зависимостей
```

### Код Inspector:

```javascript
// inspector.js
class PromAiInspector {
  constructor() {
    this.active = false;
    this.panel = null;
    this.overlay = null;
    this.pinnedElement = null;
  }

  init() {
    // Горячая клавиша
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        this.toggle();
      }
    });
  }

  toggle() {
    this.active = !this.active;
    if (this.active) {
      this.activate();
    } else {
      this.deactivate();
    }
  }

  activate() {
    // Создать панель
    this.panel = this.createPanel();
    document.body.appendChild(this.panel);

    // Создать overlay
    this.overlay = document.createElement('div');
    this.overlay.style.cssText = `
      position: absolute;
      border: 2px solid red;
      pointer-events: none;
      z-index: 9999;
      display: none;
    `;
    document.body.appendChild(this.overlay);

    // Обработчики событий
    document.addEventListener('mouseover', this.handleMouseOver);
    document.addEventListener('click', this.handleClick);
  }

  deactivate() {
    if (this.panel) this.panel.remove();
    if (this.overlay) this.overlay.remove();
    
    document.removeEventListener('mouseover', this.handleMouseOver);
    document.removeEventListener('click', this.handleClick);
  }

  handleMouseOver = (e) => {
    if (!this.active) return;
    
    const rect = e.target.getBoundingClientRect();
    this.overlay.style.cssText = `
      position: absolute;
      top: ${rect.top + window.scrollY}px;
      left: ${rect.left + window.scrollX}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      border: 2px solid red;
      pointer-events: none;
      z-index: 9999;
      display: block;
    `;

    this.showInfo(e.target);
  }

  handleClick = (e) => {
    if (!this.active) return;
    e.preventDefault();
    e.stopPropagation();
    
    this.pinnedElement = e.target;
    this.overlay.style.borderColor = 'green';
  }

  showInfo(element) {
    const info = {
      moduleId: element.getAttribute('data-module-id') || 'N/A',
      componentId: element.getAttribute('data-component-id') || 'N/A',
      functionId: element.getAttribute('data-function-id') || 'N/A',
      nodeId: element.getAttribute('data-node-id') || 'N/A',
      tag: element.tagName,
      id: element.id || 'N/A',
      class: element.className || 'N/A'
    };

    this.updatePanel(info);
  }

  createPanel() {
    const panel = document.createElement('div');
    panel.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      width: 300px;
      background: white;
      border: 2px solid #333;
      border-radius: 8px;
      padding: 15px;
      z-index: 10000;
      font-family: monospace;
      font-size: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;

    panel.innerHTML = `
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <strong>PromAi Inspector</strong>
        <button id="closeInspector" style="cursor: pointer;">✕</button>
      </div>
      <div id="inspectorContent"></div>
    `;

    panel.querySelector('#closeInspector').addEventListener('click', () => {
      this.deactivate();
    });

    return panel;
  }

  updatePanel(info) {
    const content = this.panel.querySelector('#inspectorContent');
    content.innerHTML = `
      <div><strong>MODULE_ID:</strong> ${info.moduleId} 
        <button onclick="navigator.clipboard.writeText('${info.moduleId}')">📋</button>
      </div>
      <div><strong>COMPONENT_ID:</strong> ${info.componentId}
        <button onclick="navigator.clipboard.writeText('${info.componentId}')">📋</button>
      </div>
      <div><strong>FUNCTION_ID:</strong> ${info.functionId}
        <button onclick="navigator.clipboard.writeText('${info.functionId}')">📋</button>
      </div>
      <div><strong>NODE_ID:</strong> ${info.nodeId}</div>
      <hr>
      <div><strong>Tag:</strong> ${info.tag}</div>
      <div><strong>ID:</strong> ${info.id}</div>
      <div><strong>Class:</strong> ${info.class}</div>
    `;
  }
}

// Инициализация
const inspector = new PromAiInspector();
inspector.init();
```

### Плюсы:
- ✅ Полный функционал как в PromAi
- ✅ Визуальная отладка
- ✅ Копирование ID
- ✅ Закрепление элементов
- ✅ Экспорт отчётов

### Минусы:
- ❌ Большой размер (~30KB)
- ❌ Сложная установка
- ❌ Выше нагрузка на память

---

## 🎯 Рекомендации

### Для быстрого старта:
→ **Вариант 1 (Базовый)** - уже реализован в `src2/`

### Для постоянного использования:
→ **Вариант 2 (Расширенный)** - добавить MutationObserver

### Для разработки:
→ **Вариант 3 (Pro)** - полный Inspector

---

## 🔧 Как переключиться на другой вариант

### На Вариант 2:

1. Скопировать код из секции "Вариант 2"
2. Создать файлы `observer.js`, `options.html`, `options.js`
3. Обновить `manifest.json`:
```json
{
  "background": {
    "service_worker": "background.js"
  },
  "options_page": "options.html"
}
```

### На Вариант 3:

1. Скопировать код из секции "Вариант 3"
2. Создать файлы `inspector.js`, `inspector.css`, `tracer.js`
3. Добавить в `content.js`:
```javascript
import './inspector.js';
```

---

## 📊 Производительность

| Вариант | Время обработки | Память | CPU |
|---------|----------------|--------|-----|
| Вариант 1 | ~50ms | ~2MB | Низкая |
| Вариант 2 | ~100ms | ~5MB | Средняя |
| Вариант 3 | ~200ms | ~10MB | Высокая |

*Для страницы с 1000 элементами*

---

## 🚀 Миграция между вариантами

### Вариант 1 → Вариант 2:
```bash
# Добавить файлы
cp variant2/observer.js src2/
cp variant2/options.html src2/
cp variant2/options.js src2/

# Обновить manifest.json
```

### Вариант 2 → Вариант 3:
```bash
# Добавить файлы
cp variant3/inspector.js src2/
cp variant3/inspector.css src2/
cp variant3/tracer.js src2/

# Обновить content.js
```

---

**Выберите вариант под ваши нужды! 🎉**
