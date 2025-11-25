// MODULE_KnowledgeEditor_VER_1.0
// Редактор контента для базы знаний

const knowledgeEditor = {
    moduleId: 'MODULE_KnowledgeEditor_VER_1.0',
    version: '1.0',
    dependencies: ['MODULE_KnowledgeManager_VER_1.0', 'MODULE_UIManager_VER_1.0', 'MODULE_DOMFactory_VER_1.0'],
    // FUNC_initKeyboardShortcuts_001 - Инициализация клавиатурных сокращений
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (document.activeElement.id !== 'knowledgeEditor') return;
            if (!document.getElementById('knowledgeModal').style.display || 
                document.getElementById('knowledgeModal').style.display === 'none') return;

            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault();
                this.formatText('bold');
            } else if (e.ctrlKey && e.key === 'i') {
                e.preventDefault();
                this.formatText('italic');
            } else if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                this.formatText('underline');
            } else if (e.ctrlKey && e.key === 'z') {
                e.preventDefault();
                this.undo();
            } else if (e.ctrlKey && e.key === 'y') {
                e.preventDefault();
                this.redo();
            } else if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                this.insertLink();
            }
        });
    },

    // FUNC_undo_002 - Отмена действия
    undo() {
        document.execCommand('undo');
        document.getElementById('knowledgeEditor').focus();
    },

    // FUNC_redo_003 - Повтор действия
    redo() {
        document.execCommand('redo');
        document.getElementById('knowledgeEditor').focus();
    },

    // FUNC_formatText_004 - Форматирование текста
    formatText(command, value = null) {
        document.execCommand(command, false, value);
        document.getElementById('knowledgeEditor').focus();
    },
    
    // FUNC_insertHeading_005 - Вставка заголовка
    insertHeading(level) {
        this.formatText('formatBlock', `<h${level}>`);
    },
    
    // FUNC_insertList_006 - Вставка списка
    insertList(type) {
        this.formatText(type === 'ul' ? 'insertUnorderedList' : 'insertOrderedList');
    },
    
    // FUNC_insertLink_007 - Вставка ссылки
    insertLink() {
        const url = prompt('Введите URL:');
        if (url) {
            this.formatText('createLink', url);
        }
    },
    
    // FUNC_insertCode_008 - Вставка кода
    insertCode() {
        const code = prompt('Введите код:');
        if (code) {
            this.insertHtml(`<pre><code>${code}</code></pre>`);
        }
    },
    
    // FUNC_insertTable_009 - Вставка таблицы
    insertTable() {
        const rows = parseInt(prompt('Количество строк:', '3')) || 3;
        const cols = parseInt(prompt('Количество столбцов:', '3')) || 3;

        let tableHtml = '<table style="width: 100%; border-collapse: collapse;" class="editable-table">';

        for (let i = 0; i < rows; i++) {
            tableHtml += '<tr>';
            for (let j = 0; j < cols; j++) {
                tableHtml += `<td style="border: 1px solid #ddd; padding: 8px;" contenteditable="true">&nbsp;</td>`;
            }
            tableHtml += '</tr>';
        }

        tableHtml += '</table>';
        this.insertHtml(tableHtml);
        this.showTableControls();
    },

    // FUNC_showTableControls_010 - Показать контролы таблиц
    showTableControls() {
        const controls = document.getElementById('tableControls');
        if (controls) {
            controls.classList.add('show');
        }
    },

    // FUNC_hideTableControls_011 - Скрыть контролы таблиц
    hideTableControls() {
        const controls = document.getElementById('tableControls');
        if (controls) {
            controls.classList.remove('show');
        }
    },

    // FUNC_insertTableRow_012 - Добавить строку таблицы
    insertTableRow() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const cell = selection.getRangeAt(0).startContainer;
        const row = cell.closest ? cell.closest('tr') : null;
        if (!row) return;

        const newRow = row.cloneNode(true);
        const cells = newRow.querySelectorAll('td');
        cells.forEach(cell => cell.innerHTML = '&nbsp;');

        row.parentNode.insertBefore(newRow, row.nextSibling);
        this.scheduleTableSave();
    },

    // FUNC_deleteTableRow_013 - Удалить строку таблицы
    deleteTableRow() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const cell = selection.getRangeAt(0).startContainer;
        const row = cell.closest ? cell.closest('tr') : null;
        if (!row) return;

        const table = row.closest('table');
        const rows = table.querySelectorAll('tr');

        if (rows.length <= 1) {
            uiManager.showNotification('Нельзя удалить последнюю строку таблицы', 'warning');
            return;
        }

        row.remove();
        this.scheduleTableSave();
    },

    // FUNC_insertTableColumn_014 - Добавить столбец таблицы
    insertTableColumn() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const cell = selection.getRangeAt(0).startContainer;
        const currentCell = cell.closest ? cell.closest('td') : null;
        if (!currentCell) return;

        const table = currentCell.closest('table');
        const rows = table.querySelectorAll('tr');
        const cellIndex = Array.from(currentCell.parentNode.children).indexOf(currentCell);

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const newCell = domFactory.create({
                tag: 'td',
                moduleId: this.moduleId,
                componentId: 'COMP_TableCell',
                attributes: {
                    contentEditable: 'true',
                    style: { border: '1px solid #ddd', padding: '8px' }
                },
                innerHTML: '&nbsp;'
            });

            if (cellIndex < cells.length) {
                row.insertBefore(newCell, cells[cellIndex + 1]);
            } else {
                row.appendChild(newCell);
            }
        });

        this.scheduleTableSave();
    },

    // FUNC_deleteTableColumn_015 - Удалить столбец таблицы
    deleteTableColumn() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const cell = selection.getRangeAt(0).startContainer;
        const currentCell = cell.closest ? cell.closest('td') : null;
        if (!currentCell) return;

        const table = currentCell.closest('table');
        const rows = table.querySelectorAll('tr');
        const cellIndex = Array.from(currentCell.parentNode.children).indexOf(currentCell);

        const firstRowCells = rows[0].querySelectorAll('td');
        if (firstRowCells.length <= 1) {
            uiManager.showNotification('Нельзя удалить последний столбец таблицы', 'warning');
            return;
        }

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells[cellIndex]) {
                cells[cellIndex].remove();
            }
        });

        this.scheduleTableSave();
    },

    // FUNC_mergeTableCells_016 - Объединить ячейки таблицы
    mergeTableCells() {
        uiManager.showNotification('Функция объединения ячеек в разработке', 'warning');
    },

    // FUNC_splitTableCell_017 - Разделить ячейку таблицы
    splitTableCell() {
        uiManager.showNotification('Функция разделения ячеек в разработке', 'warning');
    },

    // FUNC_alignCellLeft_018 - Выровнять ячейку по левому краю
    alignCellLeft() {
        this.alignCell('left');
    },

    // FUNC_alignCellCenter_019 - Выровнять ячейку по центру
    alignCellCenter() {
        this.alignCell('center');
    },

    // FUNC_alignCellRight_020 - Выровнять ячейку по правому краю
    alignCellRight() {
        this.alignCell('right');
    },

    // FUNC_alignCell_021 - Универсальная функция выравнивания ячейки
    alignCell(alignment) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const cell = selection.getRangeAt(0).startContainer;
        const currentCell = cell.closest ? cell.closest('td, th') : null;
        if (!currentCell) return;

        currentCell.style.textAlign = alignment;
        this.scheduleTableSave();
    },

    // FUNC_showTableProperties_022 - Показать свойства таблицы
    showTableProperties() {
        uiManager.showNotification('Свойства таблицы в разработке', 'warning');
    },

    // FUNC_scheduleTableSave_023 - Планирование сохранения таблицы
    scheduleTableSave() {
        if (knowledgeManager.currentItem) {
            knowledgeManager.currentItem.content = document.getElementById('knowledgeEditor').innerHTML;
            knowledgeManager.scheduleSave();
        }
    },
    
    // FUNC_insertImage_024 - Вставка изображения
    insertImage() {
        const url = prompt('Введите URL изображения:');
        if (url) {
            this.insertHtml(`<img src="${url}" alt="Изображение" style="max-width: 100%;">`);
        }
    },
    
    // FUNC_insertVideo_025 - Вставка видео
    insertVideo() {
        const url = prompt('Введите URL видео:');
        if (url) {
            this.insertHtml(`<video controls style="max-width: 100%;"><source src="${url}"></video>`);
        }
    },
    
    // FUNC_insertInternalLink_026 - Вставка внутренней ссылки
    insertInternalLink() {
        knowledgeManager.showInternalLinkDialog();
    },

    // FUNC_insertFootnote_027 - Вставка сноски
    insertFootnote() {
        const footnoteId = 'footnote_' + Date.now();
        const footnoteText = prompt('Введите текст сноски:');
        if (footnoteText) {
            const footnoteHtml = `<sup><a href="#${footnoteId}" id="ref_${footnoteId}" class="footnote-ref">[${this.getFootnoteNumber()}]</a></sup>`;
            const footnoteContent = `<div class="footnote" id="${footnoteId}"><a href="#ref_${footnoteId}" class="footnote-back">↑</a> ${footnoteText}</div>`;

            this.insertHtml(footnoteHtml);

            const editor = document.getElementById('knowledgeEditor');
            const existingFootnotes = editor.querySelectorAll('.footnote');
            if (existingFootnotes.length > 0) {
                existingFootnotes[existingFootnotes.length - 1].insertAdjacentHTML('afterend', footnoteContent);
            } else {
                editor.insertAdjacentHTML('beforeend', '<hr class="footnotes-separator"><div class="footnotes">' + footnoteContent + '</div>');
            }
        }
    },

    // FUNC_getFootnoteNumber_028 - Получение номера сноски
    getFootnoteNumber() {
        const editor = document.getElementById('knowledgeEditor');
        const existingRefs = editor.querySelectorAll('.footnote-ref');
        return existingRefs.length + 1;
    },

    // FUNC_highlightText_029 - Выделение текста
    highlightText() {
        const color = '#ffff00';
        this.formatText('backColor', color);
    },

    // FUNC_insertBlockQuote_030 - Вставка цитаты
    insertBlockQuote() {
        const selection = window.getSelection();
        const selectedText = selection.toString();

        if (selectedText) {
            const quoteHtml = `<blockquote style="border-left: 4px solid #3498db; padding-left: 15px; margin: 15px 0; color: #555; font-style: italic;">${selectedText}</blockquote>`;
            this.insertHtml(quoteHtml);
        } else {
            this.insertHtml(`<blockquote style="border-left: 4px solid #3498db; padding-left: 15px; margin: 15px 0; color: #555; font-style: italic;">Введите цитату здесь</blockquote>`);
        }
    },

    // FUNC_insertHorizontalRule_031 - Вставка горизонтальной линии
    insertHorizontalRule() {
        this.insertHtml(`<hr style="border: none; border-top: 2px solid #ddd; margin: 20px 0;">`);
    },

    // FUNC_insertCollapsibleSection_032 - Вставка сворачиваемого раздела
    insertCollapsibleSection() {
        const title = prompt('Введите заголовок раздела:', 'Сворачиваемый раздел');
        if (title) {
            const sectionHtml = `
                <div class="collapsible-section" style="margin: 15px 0; border: 1px solid #ddd; border-radius: 5px;">
                    <div class="collapsible-header" onclick="this.nextElementSibling.classList.toggle('collapsed')" style="background: #f8f9fa; padding: 10px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                        <span>${title}</span>
                        <span class="toggle-icon" style="font-size: 1.2em;">▼</span>
                    </div>
                    <div class="collapsible-content" style="padding: 15px;">
                        Введите содержимое раздела здесь
                    </div>
                </div>
            `;
            this.insertHtml(sectionHtml);
        }
    },
    
    // FUNC_insertHtml_033 - Вставка HTML
    insertHtml(html) {
        const editor = document.getElementById('knowledgeEditor');
        const selection = window.getSelection();
        
        if (selection.rangeCount) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            
            const div = domFactory.create({
                moduleId: this.moduleId,
                componentId: 'COMP_HtmlContainer',
                innerHTML: html
            });
            const fragment = document.createDocumentFragment();
            
            while (div.firstChild) {
                fragment.appendChild(div.firstChild);
            }
            
            range.insertNode(fragment);
        } else {
            editor.innerHTML += html;
        }
        
        editor.focus();
    },

    // FUNC_showColorPalette_034 - Показать палитру цветов
    showColorPalette(command) {
        uiManager.showNotification('Палитра цветов в разработке', 'warning');
    },

    // FUNC_showEmojiPanel_035 - Показать панель эмодзи
    showEmojiPanel() {
        const emojis = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '✨', '💡', '📝', '✅', '❌', '⚠️', '🚀', '💻', '📱', '🌟'];
        const emojiHtml = emojis.map(emoji => `<span class="emoji-option" onclick="knowledgeEditor.insertHtml('${emoji}')">${emoji}</span>`).join('');
        
        const panel = domFactory.create({
            moduleId: this.moduleId,
            componentId: 'COMP_EmojiPanel',
            className: 'emoji-panel show',
            innerHTML: `<div class="emoji-grid">${emojiHtml}</div>`,
            attributes: {
                style: { position: 'absolute', top: '45px', left: '0' }
            }
        });
        
        document.querySelector('.editor-toolbar').appendChild(panel);
        
        setTimeout(() => {
            document.addEventListener('click', function closePanel(e) {
                if (!panel.contains(e.target)) {
                    panel.remove();
                    document.removeEventListener('click', closePanel);
                }
            });
        }, 100);
    },

    // FUNC_showFindReplace_036 - Показать панель поиска и замены
    showFindReplace() {
        const panel = document.getElementById('findReplacePanel');
        if (panel) {
            panel.classList.toggle('show');
        }
    },

    // FUNC_hideFindReplace_037 - Скрыть панель поиска и замены
    hideFindReplace() {
        const panel = document.getElementById('findReplacePanel');
        if (panel) {
            panel.classList.remove('show');
        }
    },

    // FUNC_findNext_038 - Найти следующее вхождение
    findNext() {
        const findText = document.getElementById('findText').value;
        if (findText) {
            window.find(findText);
        }
    },

    // FUNC_replace_039 - Заменить текущее вхождение
    replace() {
        const findText = document.getElementById('findText').value;
        const replaceText = document.getElementById('replaceText').value;
        
        if (findText) {
            const selection = window.getSelection();
            if (selection.toString() === findText) {
                document.execCommand('insertText', false, replaceText);
            }
            this.findNext();
        }
    },

    // FUNC_replaceAll_040 - Заменить все вхождения
    replaceAll() {
        const findText = document.getElementById('findText').value;
        const replaceText = document.getElementById('replaceText').value;
        
        if (findText) {
            const editor = document.getElementById('knowledgeEditor');
            const content = editor.innerHTML;
            const newContent = content.split(findText).join(replaceText);
            editor.innerHTML = newContent;
            uiManager.showNotification('Замена выполнена', 'success');
        }
    },

    // FUNC_clearFormatting_041 - Очистить форматирование
    clearFormatting() {
        this.formatText('removeFormat');
    },

    // FUNC_outdent_042 - Уменьшить отступ
    outdent() {
        this.formatText('outdent');
    },

    // FUNC_indent_043 - Увеличить отступ
    indent() {
        this.formatText('indent');
    }
};

// Инициализация клавиатурных сокращений после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    knowledgeEditor.initKeyboardShortcuts();
});
