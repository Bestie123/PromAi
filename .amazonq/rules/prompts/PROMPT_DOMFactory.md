# ПРОМПТ: DOMFactory

## Когда использовать
- При создании новых DOM элементов в любом модуле
- Когда нужно гарантировать наличие data-атрибутов
- При рефакторинге существующего кода с document.createElement

## Что делает
Автоматически создаёт DOM элементы с обязательными data-атрибутами для Inspector:
- `data-module-id` - идентификатор модуля
- `data-component-id` - идентификатор компонента
- `data-function-id` - идентификатор функции
- `data-node-id` - идентификатор узла данных (опционально)

## Как использовать

### Шаг 1: Создать простой элемент
```javascript
const button = domFactory.create({
    tag: 'button',
    moduleId: 'MODULE_MyModule_VER_1.0',
    componentId: 'COMP_MyButton',
    functionId: 'FUNC_myFunction_001',
    textContent: 'Click me',
    className: 'btn-primary'
});
```

### Шаг 2: Создать элемент с событиями
```javascript
const button = domFactory.button({
    moduleId: 'MODULE_DataManager_VER_1.0',
    functionId: 'FUNC_deleteNode_012',
    componentId: 'COMP_DeleteBtn',
    innerHTML: '🗑️',
    className: 'delete',
    attributes: { title: 'Удалить' },
    events: { 
        click: () => dataManager.deleteNode(path, index) 
    }
});
```

### Шаг 3: Создать элемент с детьми
```javascript
const container = domFactory.create({
    tag: 'div',
    moduleId: 'MODULE_UIManager_VER_1.0',
    componentId: 'COMP_Container',
    className: 'modal-content',
    children: [
        {
            tag: 'h3',
            componentId: 'COMP_Title',
            textContent: 'Заголовок'
        },
        {
            tag: 'button',
            componentId: 'COMP_CloseBtn',
            textContent: 'Закрыть',
            events: { click: () => uiManager.hideModals() }
        }
    ]
});
```

## Примеры

### Пример 1: Замена document.createElement
**Было:**
```javascript
const btn = document.createElement('button');
btn.innerHTML = '✏️';
btn.title = 'Редактировать';
btn.onclick = () => dataManager.editNode(path, index);
// ❌ НЕТ data-атрибутов!
```

**Стало:**
```javascript
const btn = domFactory.button({
    moduleId: 'MODULE_DataManager_VER_1.0',
    functionId: 'FUNC_editNode_013',
    componentId: 'COMP_EditBtn',
    innerHTML: '✏️',
    attributes: { title: 'Редактировать' },
    events: { click: () => dataManager.editNode(path, index) }
});
// ✅ Все data-атрибуты автоматически!
```

### Пример 2: Создание сложной структуры
```javascript
const card = domFactory.create({
    tag: 'div',
    moduleId: 'MODULE_AccordionManager_VER_1.0',
    componentId: 'COMP_Card',
    className: 'card',
    children: [
        {
            tag: 'div',
            componentId: 'COMP_CardHeader',
            className: 'card-header',
            children: [
                {
                    tag: 'h4',
                    componentId: 'COMP_CardTitle',
                    textContent: 'Заголовок'
                }
            ]
        },
        {
            tag: 'div',
            componentId: 'COMP_CardBody',
            className: 'card-body',
            textContent: 'Содержимое'
        }
    ]
});
```

## API Reference

### domFactory.create(config)
Создаёт DOM элемент с конфигурацией

**Параметры config:**
- `tag` (string) - HTML тег (по умолчанию 'div')
- `moduleId` (string) - MODULE_*_VER_*
- `componentId` (string) - COMP_*
- `functionId` (string) - FUNC_*_### (опционально)
- `nodeId` (string) - ID узла данных (опционально)
- `className` (string) - CSS классы
- `textContent` (string) - Текстовое содержимое
- `innerHTML` (string) - HTML содержимое
- `attributes` (object) - Дополнительные атрибуты
- `events` (object) - Обработчики событий
- `children` (array) - Дочерние элементы

**Возвращает:** HTMLElement

### domFactory.button(config)
Создаёт кнопку (сокращение для create с tag: 'button')

**Параметры:** те же что у create (без tag)

**Возвращает:** HTMLButtonElement

## Связанные файлы
- `src/modules/DOMFactory.js` - Реализация
- `src/modules/AccordionManager.js` - Пример использования
- `src/modules/ChecklistManager.js` - Пример использования
- `src/modules/KnowledgeManager.js` - Пример использования

## Зависимости
- Нет зависимостей (LAYER_1_CORE)

## Преимущества
✅ Автоматические data-атрибуты  
✅ Inspector работает на 100%  
✅ Невозможно забыть добавить атрибуты  
✅ Единая точка создания элементов  
✅ Декларативный синтаксис  
✅ Поддержка вложенных структур  

## Правила использования
1. **ВСЕГДА** используй DOMFactory вместо document.createElement
2. **ВСЕГДА** указывай moduleId и componentId
3. **ВСЕГДА** указывай functionId для интерактивных элементов
4. Используй button() для кнопок (короче)
5. Используй children для вложенных структур
