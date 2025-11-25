# DOMFactory - Руководство

## Обзор
DOMFactory (MODULE_DOMFactory_VER_1.0) - утилита для создания DOM элементов с автоматической генерацией data-атрибутов для Inspector.

## Зачем нужно
**Проблема:** При ручном создании элементов через document.createElement легко забыть добавить data-атрибуты (data-module-id, data-component-id, data-function-id), что ломает работу Inspector.

**Решение:** DOMFactory автоматически добавляет все необходимые атрибуты при создании элемента.

## Как работает
DOMFactory принимает конфигурационный объект и создаёт DOM элемент со всеми указанными свойствами, автоматически добавляя data-атрибуты.

## Использование

### Базовое использование
```javascript
// Создать простую кнопку
const button = domFactory.button({
    moduleId: 'MODULE_DataManager_VER_1.0',
    functionId: 'FUNC_deleteNode_012',
    componentId: 'COMP_DeleteBtn',
    textContent: 'Удалить',
    className: 'delete'
});

// Результат:
// <button 
//   data-module-id="MODULE_DataManager_VER_1.0"
//   data-function-id="FUNC_deleteNode_012"
//   data-component-id="COMP_DeleteBtn"
//   class="delete">
//   Удалить
// </button>
```

### Продвинутое использование
```javascript
// Создать элемент с событиями и атрибутами
const button = domFactory.create({
    tag: 'button',
    moduleId: 'MODULE_AccordionManager_VER_1.0',
    functionId: 'FUNC_toggleItem_005',
    componentId: 'COMP_ToggleButton',
    innerHTML: '▼',
    className: 'accordion-toggle',
    attributes: {
        title: 'Развернуть/Свернуть',
        'aria-expanded': 'false'
    },
    events: {
        click: (e) => {
            e.stopPropagation();
            this.toggleItem(pathKey);
        }
    }
});
```

### Создание вложенных структур
```javascript
const modal = domFactory.create({
    tag: 'div',
    moduleId: 'MODULE_UIManager_VER_1.0',
    componentId: 'COMP_Modal',
    className: 'modal',
    children: [
        {
            tag: 'div',
            componentId: 'COMP_ModalContent',
            className: 'modal-content',
            children: [
                {
                    tag: 'h3',
                    componentId: 'COMP_ModalTitle',
                    textContent: 'Заголовок'
                },
                {
                    tag: 'button',
                    componentId: 'COMP_CloseBtn',
                    textContent: 'Закрыть',
                    events: {
                        click: () => uiManager.hideModals()
                    }
                }
            ]
        }
    ]
});
```

## API Reference

### Функции

#### domFactory.create(config)
Создаёт DOM элемент с полной конфигурацией

**Возвращает:** HTMLElement

#### domFactory.button(config)
Создаёт кнопку (сокращение для create с tag: 'button')

**Возвращает:** HTMLButtonElement

### Параметры

#### config (object)
- `tag` (string, default: 'div') - HTML тег элемента
- `moduleId` (string) - Идентификатор модуля (MODULE_*_VER_*)
- `componentId` (string) - Идентификатор компонента (COMP_*)
- `functionId` (string, optional) - Идентификатор функции (FUNC_*_###)
- `nodeId` (string, optional) - Идентификатор узла данных
- `className` (string, optional) - CSS классы
- `textContent` (string, optional) - Текстовое содержимое
- `innerHTML` (string, optional) - HTML содержимое
- `attributes` (object, optional) - Дополнительные атрибуты
  - Для style можно передать объект: `{ style: { color: 'red', fontSize: '14px' } }`
- `events` (object, optional) - Обработчики событий
  - Ключ: имя события (без 'on'), значение: функция-обработчик
- `children` (array, optional) - Дочерние элементы
  - Может содержать строки, HTMLElement или конфигурационные объекты

## Примеры

### Пример 1: Миграция с document.createElement

**До рефакторинга:**
```javascript
const btn = document.createElement('button');
btn.innerHTML = '+ 📁';
btn.title = 'Добавить подкатегорию';
btn.onclick = () => uiManager.showAddNodeModal(JSON.stringify(currentPath));
// Проблема: нет data-атрибутов!
```

**После рефакторинга:**
```javascript
const btn = domFactory.button({
    moduleId: 'MODULE_DataManager_VER_1.0',
    functionId: 'FUNC_showAddNodeModal_007',
    componentId: 'COMP_AddNodeBtn',
    innerHTML: '+ 📁',
    attributes: { title: 'Добавить подкатегорию' },
    events: { click: () => uiManager.showAddNodeModal(JSON.stringify(currentPath)) }
});
// ✅ Все data-атрибуты автоматически!
```

### Пример 2: Создание карточки технологии

```javascript
const techCard = domFactory.create({
    tag: 'div',
    moduleId: 'MODULE_AccordionManager_VER_1.0',
    componentId: 'COMP_TechCard',
    className: 'tech-card',
    nodeId: tech.id,
    children: [
        {
            tag: 'div',
            componentId: 'COMP_TechHeader',
            className: 'tech-header',
            children: [
                {
                    tag: 'span',
                    componentId: 'COMP_TechIcon',
                    textContent: '⚙️'
                },
                {
                    tag: 'span',
                    componentId: 'COMP_TechName',
                    textContent: tech.name
                }
            ]
        },
        {
            tag: 'div',
            componentId: 'COMP_TechActions',
            className: 'tech-actions',
            children: [
                domFactory.button({
                    moduleId: 'MODULE_KnowledgeManager_VER_1.0',
                    functionId: 'FUNC_openKnowledgeBase_001',
                    componentId: 'COMP_KnowledgeBtn',
                    textContent: '📚',
                    events: {
                        click: () => knowledgeManager.openKnowledgeBase(path, index)
                    }
                })
            ]
        }
    ]
});
```

### Пример 3: Динамические стили

```javascript
const progressBar = domFactory.create({
    tag: 'div',
    moduleId: 'MODULE_AccordionManager_VER_1.0',
    componentId: 'COMP_ProgressBar',
    className: 'progress-bar',
    attributes: {
        style: {
            width: '100%',
            height: '10px',
            backgroundColor: '#e0e0e0',
            borderRadius: '5px'
        }
    },
    children: [
        {
            tag: 'div',
            componentId: 'COMP_ProgressFill',
            className: 'progress-fill',
            attributes: {
                style: {
                    width: `${progress}%`,
                    height: '100%',
                    backgroundColor: '#4caf50',
                    borderRadius: '5px',
                    transition: 'width 0.3s ease'
                }
            }
        }
    ]
});
```

## Troubleshooting

### Проблема 1: Inspector не видит элемент
**Симптом:** Элемент создан, но Inspector не показывает информацию при наведении

**Решение:** Убедитесь, что указали moduleId и componentId:
```javascript
// ❌ Неправильно
const el = domFactory.create({ tag: 'div' });

// ✅ Правильно
const el = domFactory.create({
    tag: 'div',
    moduleId: 'MODULE_MyModule_VER_1.0',
    componentId: 'COMP_MyComponent'
});
```

### Проблема 2: События не работают
**Симптом:** Клик по кнопке не вызывает обработчик

**Решение:** Используйте объект events, а не onclick:
```javascript
// ❌ Неправильно
const btn = domFactory.button({
    moduleId: '...',
    componentId: '...',
    onclick: () => console.log('click') // Не сработает!
});

// ✅ Правильно
const btn = domFactory.button({
    moduleId: '...',
    componentId: '...',
    events: {
        click: () => console.log('click')
    }
});
```

### Проблема 3: Стили не применяются
**Симптом:** Элемент создан, но стили не видны

**Решение:** Для inline-стилей используйте объект в attributes.style:
```javascript
// ❌ Неправильно
const el = domFactory.create({
    tag: 'div',
    style: { color: 'red' } // Не сработает!
});

// ✅ Правильно
const el = domFactory.create({
    tag: 'div',
    attributes: {
        style: { color: 'red', fontSize: '14px' }
    }
});
```

## Лучшие практики

1. **Всегда указывайте moduleId и componentId**
   ```javascript
   // Обязательно для всех элементов
   domFactory.create({
       moduleId: 'MODULE_*_VER_*',
       componentId: 'COMP_*'
   });
   ```

2. **Указывайте functionId для интерактивных элементов**
   ```javascript
   // Для кнопок, ссылок, input с обработчиками
   domFactory.button({
       functionId: 'FUNC_myAction_001',
       events: { click: handler }
   });
   ```

3. **Используйте button() для кнопок**
   ```javascript
   // Короче и понятнее
   domFactory.button({ ... })
   // вместо
   domFactory.create({ tag: 'button', ... })
   ```

4. **Группируйте связанные элементы через children**
   ```javascript
   // Создавайте структуры декларативно
   const card = domFactory.create({
       children: [header, body, footer]
   });
   ```

5. **Переиспользуйте конфигурации**
   ```javascript
   const buttonConfig = {
       moduleId: 'MODULE_MyModule_VER_1.0',
       className: 'btn-primary'
   };
   
   const btn1 = domFactory.button({
       ...buttonConfig,
       componentId: 'COMP_Btn1',
       textContent: 'Button 1'
   });
   ```

## См. также
- [PROMPT_DOMFactory.md](../.amazonq/prompts/PROMPT_DOMFactory.md) - Промпт для работы с DOMFactory
- [Inspector_GUIDE.md](Inspector_GUIDE.md) - Как работает Inspector
- [project-standards.md](../.amazonq/rules/project-standards.md) - Стандарты PromAi
