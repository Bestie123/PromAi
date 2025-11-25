# Create Tests

Создай тесты для: {MODULE_ID или FUNC_ID}

## Параметры
- **Компонент ID:** {MODULE_ID или FUNC_ID}
- **Тип тестов:** Unit / Integration / E2E
- **Фреймворк:** Jest / Mocha / Другой

## Шаг 1: Загрузить контекст

### Из project_registry.json
```javascript
const module = projectRegistry.modules[moduleId];
// - path: путь к файлу
// - functions: список FUNC_ID
// - dependencies: зависимости модуля
```

### Из dependencies_map.json
```javascript
// Загрузить зависимости
const deps = dependenciesMap.edges.filter(e => e.from === moduleId);
```

### Из function_registry.json
```javascript
// Загрузить информацию о функции
const func = functionRegistry.functions[funcId];
// - parameters: параметры
// - returns: возвращаемое значение
// - callers: кто вызывает
// - callees: кого вызывает
```

## Шаг 2: Определить типы тестов

### Unit тесты
- Тестирование отдельных функций
- Моки для зависимостей
- Граничные случаи
- Валидация параметров

### Integration тесты
- Взаимодействие с зависимостями
- Реальные вызовы других модулей
- Проверка data-атрибутов
- Интеграция с DOMFactory

### E2E тесты
- Пользовательские сценарии
- Полный цикл работы
- Взаимодействие с UI
- Проверка через Inspector

## Шаг 3: Создать тесты

### Структура файла тестов
```javascript
// tests/{ModuleName}.test.js
describe('MODULE_{Name}_VER_1.0', () => {
    let module;
    
    beforeEach(() => {
        // Инициализация
        module = window.moduleName;
    });
    
    afterEach(() => {
        // Очистка
    });
    
    describe('FUNC_{functionName}_{number}', () => {
        it('должен корректно работать с валидными данными', () => {
            // Arrange
            const input = {...};
            
            // Act
            const result = module.functionName(input);
            
            // Assert
            expect(result).toBe(expected);
        });
        
        it('должен обрабатывать граничные случаи', () => {
            expect(() => module.functionName(null)).not.toThrow();
        });
    });
});
```

### Шаблон Unit теста
```javascript
describe('FUNC_{functionName}_{number}', () => {
    it('должен вернуть корректный результат', () => {
        const result = module.functionName(validInput);
        expect(result).toEqual(expectedOutput);
    });
    
    it('должен валидировать параметры', () => {
        expect(() => module.functionName()).toThrow();
        expect(() => module.functionName(null)).toThrow();
    });
    
    it('должен обрабатывать ошибки', () => {
        const result = module.functionName(invalidInput);
        expect(result).toBeNull();
    });
});
```

### Шаблон Integration теста
```javascript
describe('Integration: MODULE_{Name}_VER_1.0', () => {
    it('должен корректно взаимодействовать с зависимостями', () => {
        // Проверить вызов зависимого модуля
        const spy = jest.spyOn(dependencyModule, 'method');
        
        module.functionName();
        
        expect(spy).toHaveBeenCalled();
    });
    
    it('должен создавать элементы с data-атрибутами', () => {
        const element = module.createSomething();
        
        expect(element.getAttribute('data-module-id')).toBe('MODULE_{Name}_VER_1.0');
        expect(element.getAttribute('data-component-id')).toBe('COMP_{Name}');
    });
});
```

### Шаблон E2E теста
```javascript
describe('E2E: User scenario', () => {
    it('пользователь может добавить категорию', () => {
        // 1. Открыть приложение
        // 2. Нажать кнопку "Add Category"
        const addBtn = document.querySelector('[data-function-id="FUNC_addCategory_001"]');
        addBtn.click();
        
        // 3. Ввести название
        const input = document.querySelector('input[name="categoryName"]');
        input.value = 'Test Category';
        
        // 4. Подтвердить
        const submitBtn = document.querySelector('[data-function-id="FUNC_submitCategory_002"]');
        submitBtn.click();
        
        // 5. Проверить результат
        const categories = dataManager.data.categories;
        expect(categories).toContainEqual(expect.objectContaining({
            name: 'Test Category'
        }));
    });
});
```

## Шаг 4: Создать моки

### Мок для DOMFactory
```javascript
const mockDOMFactory = {
    create: jest.fn((config) => {
        const el = document.createElement(config.tag || 'div');
        if (config.moduleId) el.setAttribute('data-module-id', config.moduleId);
        return el;
    })
};

window.domFactory = mockDOMFactory;
```

### Мок для LocalStorage
```javascript
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
};

global.localStorage = localStorageMock;
```

### Мок для зависимого модуля
```javascript
const mockDependency = {
    method: jest.fn(() => 'mocked result')
};

window.dependencyModule = mockDependency;
```

## Шаг 5: Обновить state файлы

### 1. project_registry.json
```json
{
  "modules": {
    "MODULE_{Name}_VER_1.0": {
      "tests": {
        "unit": "tests/{Name}.test.js",
        "coverage": 85,
        "lastRun": "2024-01-15"
      }
    }
  }
}
```

### 2. todo.json
```json
{
  "tasks": [
    {
      "id": "TASK_XXX",
      "title": "Создать тесты для MODULE_{Name}_VER_1.0",
      "status": "done",
      "closedDate": "2024-01-15"
    }
  ]
}
```

### 3. changelog.md
```markdown
## [1.X.X] - 2024-01-15
### Added
- Tests for MODULE_{Name}_VER_1.0 (85% coverage)
```

## Примеры использования

### Пример 1: Unit тесты для DataManager
```javascript
describe('MODULE_DataManager_VER_1.0', () => {
    let dataManager;
    
    beforeEach(() => {
        dataManager = window.dataManager;
        dataManager.data = { categories: [] };
    });
    
    describe('FUNC_addCategory_001', () => {
        it('должен добавить категорию', () => {
            dataManager.addCategory('Test');
            
            expect(dataManager.data.categories).toHaveLength(1);
            expect(dataManager.data.categories[0].name).toBe('Test');
        });
        
        it('должен валидировать название', () => {
            dataManager.addCategory('');
            
            expect(dataManager.data.categories).toHaveLength(0);
        });
    });
    
    describe('FUNC_saveToLocalStorage_002', () => {
        it('должен сохранить данные', () => {
            const spy = jest.spyOn(localStorage, 'setItem');
            
            dataManager.saveToLocalStorage();
            
            expect(spy).toHaveBeenCalledWith('techData', expect.any(String));
        });
    });
});
```

### Пример 2: Integration тесты для UIManager
```javascript
describe('Integration: MODULE_UIManager_VER_1.0', () => {
    let uiManager;
    
    beforeEach(() => {
        uiManager = window.uiManager;
        document.body.innerHTML = '';
    });
    
    describe('FUNC_showNotification_001', () => {
        it('должен создать элемент с data-атрибутами', () => {
            uiManager.showNotification('Test', 'success');
            
            const notification = document.querySelector('.notification');
            expect(notification).not.toBeNull();
            expect(notification.getAttribute('data-module-id')).toBe('MODULE_UIManager_VER_1.0');
            expect(notification.getAttribute('data-component-id')).toBe('COMP_Notification');
        });
        
        it('должен автоматически удалить уведомление', (done) => {
            uiManager.showNotification('Test', 'success');
            
            setTimeout(() => {
                const notification = document.querySelector('.notification');
                expect(notification).toBeNull();
                done();
            }, 3100);
        });
    });
});
```

### Пример 3: E2E тест полного сценария
```javascript
describe('E2E: Работа с базой знаний', () => {
    beforeEach(() => {
        // Инициализация приложения
        dataManager.data = { categories: [] };
        accordionManager.renderAccordion();
    });
    
    it('пользователь может создать категорию и добавить технологию', () => {
        // 1. Добавить категорию
        const addCategoryBtn = document.querySelector('[data-function-id="FUNC_addCategory_001"]');
        addCategoryBtn.click();
        
        const categoryInput = document.querySelector('#categoryNameInput');
        categoryInput.value = 'Frontend';
        
        const submitBtn = document.querySelector('[data-function-id="FUNC_submitCategory_002"]');
        submitBtn.click();
        
        // 2. Добавить технологию
        const addTechBtn = document.querySelector('[data-function-id="FUNC_addTechnology_003"]');
        addTechBtn.click();
        
        const techInput = document.querySelector('#techNameInput');
        techInput.value = 'React';
        
        const submitTechBtn = document.querySelector('[data-function-id="FUNC_submitTechnology_004"]');
        submitTechBtn.click();
        
        // 3. Проверить результат
        expect(dataManager.data.categories).toHaveLength(1);
        expect(dataManager.data.categories[0].name).toBe('Frontend');
        expect(dataManager.data.categories[0].technologies).toHaveLength(1);
        expect(dataManager.data.categories[0].technologies[0].name).toBe('React');
    });
});
```

## Проверка работы

### ✅ Чеклист
- [ ] Созданы unit тесты для всех функций
- [ ] Созданы integration тесты для взаимодействий
- [ ] Созданы E2E тесты для сценариев
- [ ] Покрытие кода > 80%
- [ ] Все тесты проходят
- [ ] Моки для зависимостей
- [ ] Проверка data-атрибутов
- [ ] project_registry.json обновлён
- [ ] todo.json обновлён
- [ ] changelog.md обновлён

### Запуск тестов
```bash
# Unit тесты
npm test

# С покрытием
npm test -- --coverage

# Конкретный файл
npm test -- DataManager.test.js

# Watch режим
npm test -- --watch
```

### Ожидаемый результат
```
PASS  tests/DataManager.test.js
  MODULE_DataManager_VER_1.0
    FUNC_addCategory_001
      ✓ должен добавить категорию (5ms)
      ✓ должен валидировать название (2ms)
    FUNC_saveToLocalStorage_002
      ✓ должен сохранить данные (3ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Coverage:    85%
```

## Troubleshooting

### Проблема: Тесты не находят модуль
**Решение:** Проверить загрузку модуля в setup
```javascript
beforeAll(() => {
    require('../src/modules/DataManager.js');
});
```

### Проблема: LocalStorage не работает в тестах
**Решение:** Использовать мок
```javascript
global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn()
};
```

### Проблема: DOM элементы не создаются
**Решение:** Использовать jsdom
```javascript
// jest.config.js
module.exports = {
    testEnvironment: 'jsdom'
};
```

## См. также
- [add-function.md](add-function.md) - Добавление функции
- [create-module.md](create-module.md) - Создание модуля
- [project-standards.md](../project-standards.md) - Стандарты PromAi
