# 🔄 GitDoc - Установка и запуск

> Автоматические Git коммиты при сохранении файлов в VS Code

**Время установки:** 5 минут

---

## 📋 Что такое GitDoc?

GitDoc - расширение VS Code для автоматического коммита изменений в Git при сохранении файлов.

**Возможности:**
- ✅ Автоматические коммиты каждые N секунд
- ✅ Работает локально или с GitHub
- ✅ Настраиваемый формат сообщений
- ✅ Не требует ручных git add/commit

---

## ⚡ Быстрая установка

### Шаг 1: Инициализировать Git

```bash
cd c:\Users\misch\source\repos\PromAi
git init
git add .
git commit -m "Initial commit"
```

### Шаг 2: Установить GitDoc

```
1. Открыть VS Code
2. Нажать Ctrl+Shift+X (Extensions)
3. Найти "GitDoc"
4. Нажать "Install"
```

### Шаг 3: Включить GitDoc

```
Ctrl+Shift+P → GitDoc: Enable
```

**Готово! GitDoc работает! 🎉**

---

## 🔧 Настройка

### Базовая настройка

Создать файл `.vscode/settings.json`:

```json
{
  "gitdoc.enabled": true,
  "gitdoc.autoCommitDelay": 30000,
  "gitdoc.commitMessageFormat": "docs: auto-save ${date}",
  "gitdoc.commitValidationLevel": "none"
}
```

### Параметры

| Параметр | Описание | Значение по умолчанию |
|----------|----------|----------------------|
| `gitdoc.enabled` | Включить GitDoc | `false` |
| `gitdoc.autoCommitDelay` | Задержка в мс | `30000` (30 сек) |
| `gitdoc.commitMessageFormat` | Формат сообщения | `"docs: ${date}"` |
| `gitdoc.commitValidationLevel` | Валидация | `"error"` |

### Форматы сообщений

```json
{
  "gitdoc.commitMessageFormat": "docs: auto-save ${date}"
}
```

**Переменные:**
- `${date}` - текущая дата/время
- `${files}` - список измененных файлов

**Примеры:**
```
"docs: auto-save ${date}"           → docs: auto-save 2024-01-15 14:30:00
"auto: ${files}"                    → auto: file1.js, file2.md
"📝 Auto-commit at ${date}"         → 📝 Auto-commit at 2024-01-15 14:30:00
```

---

## 🌐 Подключение GitHub (опционально)

### Вариант 1: Создать репозиторий на GitHub

```bash
# 1. Создать репозиторий
https://github.com/new → Создать "PromAi"

# 2. Подключить remote
git remote add origin https://github.com/Bestie123/PromAi.git
git branch -M main
git push -u origin main
```

### Вариант 2: Использовать GitHub CLI

```bash
# Установить GitHub CLI: https://cli.github.com/
gh auth login
gh repo create PromAi --public --source=. --remote=origin --push
```

### Вариант 3: Работать локально

```bash
# Удалить remote (если есть)
git remote remove origin

# GitDoc будет работать только локально
```

---

## 🎯 Использование

### Команды GitDoc

```
Ctrl+Shift+P → GitDoc: Enable          # Включить
Ctrl+Shift+P → GitDoc: Disable         # Выключить
Ctrl+Shift+P → GitDoc: Commit Now      # Коммит сейчас
```

### Автоматическая работа

```
1. Редактировать файл
2. Сохранить (Ctrl+S)
3. Подождать 30 секунд
4. GitDoc автоматически сделает коммит
```

### Проверка работы

```bash
# Посмотреть историю коммитов
git log --oneline

# Должны быть коммиты вида:
# abc1234 docs: auto-save 2024-01-15 14:30:00
# def5678 docs: auto-save 2024-01-15 14:29:30
```

---

## ⚙️ Расширенная настройка

### Полная конфигурация

`.vscode/settings.json`:

```json
{
  "gitdoc.enabled": true,
  "gitdoc.autoCommitDelay": 30000,
  "gitdoc.commitMessageFormat": "docs: auto-save ${date}",
  "gitdoc.commitValidationLevel": "none",
  "gitdoc.autoPull": "off",
  "gitdoc.autoPush": "off",
  "gitdoc.pullOnOpen": false,
  "gitdoc.filePattern": "**/*"
}
```

### Параметры автосинхронизации

```json
{
  "gitdoc.autoPull": "afterDelay",      // Автоматический pull
  "gitdoc.autoPush": "afterDelay",      // Автоматический push
  "gitdoc.pullOnOpen": true             // Pull при открытии
}
```

### Фильтр файлов

```json
{
  "gitdoc.filePattern": "**/*.{md,txt,json}"  // Только эти файлы
}
```

---

## ✅ Проверка установки

### Чеклист

- [ ] Git инициализирован (`git status` работает)
- [ ] GitDoc установлен (видно в Extensions)
- [ ] GitDoc включен (статус бар показывает "GitDoc")
- [ ] Файл `.vscode/settings.json` создан
- [ ] После сохранения файла появляются коммиты
- [ ] `git log` показывает автоматические коммиты

### Статус бар VS Code

```
✅ GitDoc активен:
[GitDoc] ← в левом нижнем углу

❌ GitDoc неактивен:
Нет индикатора
```

### Проверка коммитов

```bash
# Посмотреть последние 5 коммитов
git log --oneline -5

# Должно быть:
abc1234 docs: auto-save 2024-01-15 14:30:00
def5678 docs: auto-save 2024-01-15 14:29:30
```

---

## 🐛 Troubleshooting

### Проблема: GitDoc не работает

**Решение 1: Проверить Git**
```bash
git status
# Если ошибка "not a git repository":
git init
```

**Решение 2: Проверить настройки**
```bash
# Проверить что файл существует
type .vscode\settings.json

# Проверить синтаксис JSON
```

**Решение 3: Перезапустить VS Code**
```
Ctrl+Shift+P → Developer: Reload Window
```

### Проблема: Коммиты не появляются

**Решение:**
```bash
# 1. Проверить что GitDoc включен
Ctrl+Shift+P → GitDoc: Enable

# 2. Проверить задержку
# В settings.json должно быть:
"gitdoc.autoCommitDelay": 30000

# 3. Подождать 30 секунд после сохранения
```

### Проблема: Ошибка "Repository not found"

**Решение:**
```bash
# Работать локально без GitHub
git remote remove origin

# Или создать репозиторий на GitHub
https://github.com/new
```

### Проблема: Конфликты при push

**Решение:**
```bash
# Отключить auto-push
# В settings.json:
"gitdoc.autoPush": "off"

# Push вручную когда нужно
git push
```

### Проблема: Слишком много коммитов

**Решение:**
```json
{
  "gitdoc.autoCommitDelay": 300000  // 5 минут вместо 30 секунд
}
```

---

## 📊 Рекомендуемые настройки

### Для локальной работы

```json
{
  "gitdoc.enabled": true,
  "gitdoc.autoCommitDelay": 30000,
  "gitdoc.commitMessageFormat": "docs: auto-save ${date}",
  "gitdoc.commitValidationLevel": "none",
  "gitdoc.autoPull": "off",
  "gitdoc.autoPush": "off"
}
```

### Для работы с GitHub

```json
{
  "gitdoc.enabled": true,
  "gitdoc.autoCommitDelay": 60000,
  "gitdoc.commitMessageFormat": "docs: auto-save ${date}",
  "gitdoc.commitValidationLevel": "none",
  "gitdoc.autoPull": "afterDelay",
  "gitdoc.autoPush": "afterDelay"
}
```

### Для документации

```json
{
  "gitdoc.enabled": true,
  "gitdoc.autoCommitDelay": 30000,
  "gitdoc.commitMessageFormat": "📝 ${date}",
  "gitdoc.filePattern": "**/*.md"
}
```

---

## 🎯 Примеры использования

### Сценарий 1: Локальная разработка

```bash
# 1. Инициализировать Git
git init
git add .
git commit -m "Initial commit"

# 2. Включить GitDoc
Ctrl+Shift+P → GitDoc: Enable

# 3. Работать как обычно
# GitDoc автоматически коммитит изменения
```

### Сценарий 2: Синхронизация с GitHub

```bash
# 1. Создать репозиторий на GitHub
https://github.com/new

# 2. Подключить remote
git remote add origin https://github.com/Bestie123/PromAi.git
git push -u origin main

# 3. Включить auto-push в settings.json
"gitdoc.autoPush": "afterDelay"

# 4. GitDoc автоматически push на GitHub
```

### Сценарий 3: Только документация

```json
{
  "gitdoc.filePattern": "**/*.{md,txt}",
  "gitdoc.commitMessageFormat": "docs: update ${files}"
}
```

---

## 📚 Дополнительная информация

### Официальная документация
- GitHub: https://github.com/lostintangent/gitdoc
- VS Code Marketplace: https://marketplace.visualstudio.com/items?itemName=vsls-contrib.gitdoc

### Альтернативы
- **Git Auto Commit** - похожее расширение
- **Local History** - локальная история без Git
- **Gitlens** - расширенная работа с Git

### Полезные команды Git

```bash
# История коммитов
git log --oneline

# Отменить последний коммит
git reset --soft HEAD~1

# Очистить историю (осторожно!)
git reset --hard HEAD~10

# Squash коммитов
git rebase -i HEAD~10
```

---

## 🎉 Готово!

GitDoc установлен и настроен!

**Что дальше:**
1. Редактировать файлы
2. Сохранять (Ctrl+S)
3. GitDoc автоматически коммитит
4. Проверять историю: `git log`

**Приятной работы! 🚀**
