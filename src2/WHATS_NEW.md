# 🎉 Что нового в v3.2.0

## ✨ Главная фича: FUNC_ID для JavaScript функций!

Теперь расширение автоматически находит и добавляет уникальные ID ко ВСЕМ JavaScript функциям на странице!

---

## 🚀 Что делает:

### 1. Находит функции:
```javascript
// Обычные функции
function calculateTotal(items) { ... }

// Arrow functions
const handleClick = (e) => { ... }

// Методы объектов
const myModule = {
  init() { ... },
  render() { ... }
}
```

### 2. Добавляет FUNC_ID:
```javascript
// Runtime свойство
calculateTotal.__funcId = 'FUNC_calculateTotal_001'
handleClick.__funcId = 'FUNC_handleClick_002'
myModule.init.__funcId = 'FUNC_init_003'
```

### 3. Работает везде:
- ✅ Основная страница
- ✅ Same-origin iframe
- ✅ Cross-origin iframe (YouTube, Google Docs)
- ✅ Inline scripts
- ✅ Продолжает нумерацию между фреймами

---

## 📊 Новая статистика:

**Было:**
```
✅ Success! Processed 1,234 elements across 3 frame(s)
```

**Стало:**
```
✅ Success! 1,234 elements, 56 functions across 3 frame(s)
```

---

## 🔍 Проверка работы:

### Через Console:
```javascript
// Посмотреть FUNC_ID функции
console.log(calculateTotal.__funcId)
// "FUNC_calculateTotal_001"

// Посмотреть все функции с FUNC_ID
Object.keys(window).filter(key => 
  typeof window[key] === 'function' && window[key].__funcId
)

// Посмотреть текущий счётчик функций
localStorage.getItem('promai_func_counter')
```

---

## 🎯 Примеры использования:

### Пример 1: YouTube
```
Сайт: youtube.com
Результат:
- 523 elements (COMP_10000 - COMP_10523)
- 87 functions (FUNC_play_001, FUNC_pause_002, ...)
- 5 frames
```

### Пример 2: GitHub
```
Сайт: github.com
Результат:
- 312 elements (COMP_10000 - COMP_10312)
- 45 functions (FUNC_init_001, FUNC_render_002, ...)
- 2 frames
```

---

## 🔧 Технические детали:

### Два счётчика:
- **COMP Counter:** `promai_comp_counter` (для элементов)
- **FUNC Counter:** `promai_func_counter` (для функций)

### Поддержка iframe:
- Счётчики передаются через postMessage
- Продолжают нумерацию между фреймами
- Работают с cross-origin iframe

### Паттерны функций:
```javascript
// Находит:
function name() { }           // ✅
const name = function() { }   // ✅
const name = () => { }        // ✅
name: function() { }          // ✅ (методы)
```

---

## 📚 Совместимость с PromAi:

### Стандарты PromAi:
```javascript
// Элементы
data-component-id="COMP_10000"

// Модули
data-module-id="M_AUTO_1.0"

// Функции (runtime)
functionName.__funcId = "FUNC_functionName_001"
```

---

## 🎉 Готово!

Теперь расширение делает **ЛЮБОЙ сайт** полностью совместимым с PromAi:
- ✅ Уникальные ID для элементов (COMP_XXXXX)
- ✅ Уникальные ID для функций (FUNC_name_XXX)
- ✅ Модульные ID для скриптов (M_AUTO_1.0)
- ✅ Работает во всех iframe

---

**Обновите расширение и попробуйте! 🚀**
