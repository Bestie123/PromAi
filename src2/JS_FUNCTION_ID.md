# 🔧 Генерация FUNC_ID для JavaScript функций

## 🎯 3 Варианта реализации

### **Вариант 1: Комментарии перед функциями** ⭐ (Рекомендуемый)

**Что делает:**
```javascript
// До
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// После
// FUNC_calculateTotal_001
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

**Реализация:**
- Парсит JS код через regex
- Находит все функции (function, const, arrow, методы)
- Добавляет комментарий `// FUNC_name_001` перед каждой
- Не изменяет исполняемый код

**Плюсы:**
- ✅ Совместимо с PromAi стандартами
- ✅ Не меняет runtime поведение
- ✅ Видно в исходниках
- ✅ Работает с минифицированным кодом

**Минусы:**
- ❌ Требует парсинг кода
- ❌ Может пропустить сложные паттерны

---

### **Вариант 2: Data-атрибуты в Function.name** (Легкий)

**Что делает:**
```javascript
// Исходная функция
function calculateTotal(items) { ... }

// Добавляем свойство
calculateTotal.__funcId = 'FUNC_calculateTotal_001';
calculateTotal.__moduleId = 'M_AUTO_1.0';
```

**Реализация:**
- Находит все функции в window/document
- Добавляет свойство `__funcId`
- Не меняет исходный код

**Плюсы:**
- ✅ Простая реализация
- ✅ Быстрая работа
- ✅ Доступ через console

**Минусы:**
- ❌ Изменяет runtime объекты
- ❌ Не видно в исходниках
- ❌ Может конфликтовать с кодом

---

### **Вариант 3: Обёртка функций** (Продвинутый)

**Что делает:**
```javascript
// До
function calculateTotal(items) { ... }

// После
const calculateTotal = window.__promaiWrap('FUNC_calculateTotal_001', 
  function calculateTotal(items) { ... }
);
```

**Реализация:**
- Оборачивает каждую функцию в proxy
- Добавляет трассировку вызовов
- Логирует параметры и результаты

**Плюсы:**
- ✅ Полный контроль над вызовами
- ✅ Трассировка выполнения
- ✅ Измерение производительности

**Минусы:**
- ❌ Изменяет исходный код
- ❌ Overhead на каждый вызов
- ❌ Может сломать код

---

## 🚀 Использование в расширении

### Добавить в popup.js:

```javascript
// После обработки DOM элементов
const scripts = document.querySelectorAll('script[src]');
scripts.forEach(async (script) => {
  try {
    const response = await fetch(script.src);
    const code = await response.text();
    
    // Вариант 1: Добавить комментарии
    const { code: newCode, functions } = addFuncIdComments(code);
    console.log(`Found ${functions.length} functions in ${script.src}`);
    
    // Вариант 2: Добавить свойства
    functions.forEach(func => {
      if (window[func.name]) {
        window[func.name].__funcId = func.funcId;
      }
    });
  } catch (e) {
    console.log('Cannot process:', script.src);
  }
});
```

---

## 📊 Сравнение вариантов

| Критерий | Вариант 1 | Вариант 2 | Вариант 3 |
|----------|-----------|-----------|-----------|
| Простота | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| Совместимость | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Видимость | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| Производительность | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Трассировка | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🎯 Рекомендация

### Для большинства случаев: **Вариант 1 + Вариант 2**

**Комбинированный подход:**
1. Парсим JS → Находим функции
2. Добавляем комментарии (для исходников)
3. Добавляем свойства (для runtime)

```javascript
function processJavaScript(code) {
  // 1. Найти функции
  const functions = analyzeJavaScript(code);
  
  // 2. Добавить комментарии
  const codeWithComments = addFuncIdComments(code);
  
  // 3. Добавить runtime свойства
  functions.forEach(func => {
    if (window[func.name]) {
      window[func.name].__funcId = func.funcId;
      window[func.name].__moduleId = 'M_AUTO_1.0';
    }
  });
  
  return { code: codeWithComments, functions };
}
```

---

## 🔍 Примеры обработки

### Пример 1: Обычная функция
```javascript
// До
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// После
// FUNC_calculateTotal_001
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
// Runtime: calculateTotal.__funcId = 'FUNC_calculateTotal_001'
```

### Пример 2: Arrow function
```javascript
// До
const handleClick = (e) => {
  console.log('Clicked!');
};

// После
// FUNC_handleClick_002
const handleClick = (e) => {
  console.log('Clicked!');
};
// Runtime: handleClick.__funcId = 'FUNC_handleClick_002'
```

### Пример 3: Метод объекта
```javascript
// До
const myModule = {
  init() { ... },
  render() { ... }
};

// После
const myModule = {
  // FUNC_init_003
  init() { ... },
  // FUNC_render_004
  render() { ... }
};
// Runtime: myModule.init.__funcId = 'FUNC_init_003'
```

---

## 🛠️ Интеграция в расширение

### Обновить popup.js:

```javascript
// Добавить после processPage()
async function processFunctions() {
  let funcCounter = 1;
  
  // Обработать inline scripts
  document.querySelectorAll('script:not([src])').forEach(script => {
    const code = script.textContent;
    const functions = analyzeJavaScript(code);
    
    functions.forEach(func => {
      const comment = `// FUNC_${func.name}_${String(funcCounter++).padStart(3, '0')}\n`;
      // Добавить комментарий перед функцией
    });
  });
  
  // Обработать внешние scripts
  const scripts = document.querySelectorAll('script[src]');
  for (const script of scripts) {
    try {
      const response = await fetch(script.src);
      const code = await response.text();
      const functions = analyzeJavaScript(code);
      
      functions.forEach(func => {
        if (window[func.name]) {
          window[func.name].__funcId = `FUNC_${func.name}_${String(funcCounter++).padStart(3, '0')}`;
        }
      });
    } catch (e) {
      console.log('Cannot process:', script.src);
    }
  }
  
  return funcCounter - 1;
}
```

---

## 📊 Статистика

После обработки показывается:
- ✅ Количество найденных функций
- ✅ Количество обработанных скриптов
- ✅ Список FUNC_ID

### Пример вывода:
```
✅ Success! 
- Processed 1,234 elements
- Found 56 functions
- Added FUNC_ID to 56 functions
- Processed 12 scripts
```

---

## 🔧 Настройка

### Изменить префикс:
```javascript
// В js-analyzer.js
funcId: `FUNC_${funcName}_${counter}` 
// Измените на
funcId: `FN_${funcName}_${counter}`
```

### Изменить формат номера:
```javascript
// 3 цифры: 001, 002, 003
String(counter).padStart(3, '0')

// 4 цифры: 0001, 0002, 0003
String(counter).padStart(4, '0')
```

### Фильтры функций:
```javascript
// Исключить приватные функции
if (funcName.startsWith('_')) return;

// Только публичные API
if (!funcName.match(/^[A-Z]/)) return;
```

---

## ❓ FAQ

**Q: Работает ли с минифицированным кодом?**  
A: ⚠️ Частично. Имена функций могут быть сокращены (a, b, c).

**Q: Работает ли с TypeScript?**  
A: ✅ Да, после компиляции в JS.

**Q: Можно ли обработать React компоненты?**  
A: ✅ Да, как обычные функции.

**Q: Влияет ли на производительность?**  
A: Вариант 1 - нет, Вариант 2 - минимально, Вариант 3 - да.

---

## 🎉 Готово!

Теперь расширение может добавлять FUNC_ID к JavaScript функциям!

### Следующие шаги:
1. ✅ Выберите вариант (рекомендуем Вариант 1 + 2)
2. ✅ Интегрируйте в popup.js
3. ✅ Протестируйте на разных сайтах
4. ✅ Настройте под свои нужды

---

**Приятного использования! 🚀**
