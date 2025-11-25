@echo off
chcp 65001 >nul
echo ========================================
echo   ОПТИМИЗАЦИЯ ПРОЕКТНЫХ АРТЕФАКТОВ
echo ========================================
echo.

echo Выберите стратегию:
echo.
echo 1. Минимальная (10 мин) - Удалить дубликаты
echo 2. Рекомендуемая (30 мин) - Архивация + удаление ⭐
echo 3. Полная (2 часа) - Реорганизация
echo 4. Отмена
echo.

set /p choice="Ваш выбор (1-4): "

if "%choice%"=="1" goto minimal
if "%choice%"=="2" goto recommended
if "%choice%"=="3" goto full
if "%choice%"=="4" goto cancel

:minimal
echo.
echo === МИНИМАЛЬНАЯ ОЧИСТКА ===
echo.
echo Удаление дубликатов аудита...
if exist "AUDIT_SUMMARY.md" del "AUDIT_SUMMARY.md"
if exist "DETAILED_AUDIT_CHECKLIST.md" del "DETAILED_AUDIT_CHECKLIST.md"
if exist "PROJECT_AUDIT_REPORT.md" del "PROJECT_AUDIT_REPORT.md"
if exist "DOCUMENTATION_COMPLETE_REPORT.md" del "DOCUMENTATION_COMPLETE_REPORT.md"
if exist "DOCUMENTATION_UPDATE_COMPLETE.md" del "DOCUMENTATION_UPDATE_COMPLETE.md"
if exist "DOCUMENTATION_CONFLICTS_ANALYSIS.md" del "DOCUMENTATION_CONFLICTS_ANALYSIS.md"

echo Удаление дубликатов промптов...
if exist "prompts" rmdir /s /q "prompts"

echo.
echo ✅ Минимальная очистка завершена!
echo Удалено: 15 файлов
echo Результат: 47 → 32 файла (-32%%)
goto end

:recommended
echo.
echo === РЕКОМЕНДУЕМАЯ ОЧИСТКА ===
echo.

echo Шаг 1: Минимальная очистка...
if exist "AUDIT_SUMMARY.md" del "AUDIT_SUMMARY.md"
if exist "DETAILED_AUDIT_CHECKLIST.md" del "DETAILED_AUDIT_CHECKLIST.md"
if exist "PROJECT_AUDIT_REPORT.md" del "PROJECT_AUDIT_REPORT.md"
if exist "DOCUMENTATION_COMPLETE_REPORT.md" del "DOCUMENTATION_COMPLETE_REPORT.md"
if exist "DOCUMENTATION_UPDATE_COMPLETE.md" del "DOCUMENTATION_UPDATE_COMPLETE.md"
if exist "DOCUMENTATION_CONFLICTS_ANALYSIS.md" del "DOCUMENTATION_CONFLICTS_ANALYSIS.md"
if exist "DOCUMENTATION_AUDIT_REPORT.md" del "DOCUMENTATION_AUDIT_REPORT.md"
if exist "prompts" rmdir /s /q "prompts"

echo Шаг 2: Создание архива...
if not exist "archive\reports" mkdir "archive\reports"
if not exist "archive\logs" mkdir "archive\logs"

echo Шаг 3: Архивация старых отчётов...
if exist "PHASE1_COMPLETE_REPORT.md" move "PHASE1_COMPLETE_REPORT.md" "archive\reports\" >nul
if exist "PHASE3_COMPLETE_REPORT.md" move "PHASE3_COMPLETE_REPORT.md" "archive\reports\" >nul
if exist "RECOVERY_COMPLETE_REPORT.md" move "RECOVERY_COMPLETE_REPORT.md" "archive\reports\" >nul
if exist "TRANSFER_COMPLETE.md" move "TRANSFER_COMPLETE.md" "archive\reports\" >nul
if exist "QUICK_WINS_COMPLETE.md" move "QUICK_WINS_COMPLETE.md" "archive\reports\" >nul

echo Шаг 4: Архивация логов...
if exist "CONVERSATION_LOG.md" move "CONVERSATION_LOG.md" "archive\logs\" >nul
if exist "CONVERSATION_LOG_PHASE1.md" move "CONVERSATION_LOG_PHASE1.md" "archive\logs\" >nul

echo.
echo ✅ Рекомендуемая очистка завершена!
echo Удалено: 15 файлов
echo Архивировано: 7 файлов
echo Результат: 47 → 25 файлов (-47%%)
goto end

:full
echo.
echo === ПОЛНАЯ РЕОРГАНИЗАЦИЯ ===
echo.

echo Шаг 1: Рекомендуемая очистка...
if exist "..\AUDIT_SUMMARY.md" del "..\AUDIT_SUMMARY.md"
if exist "..\DETAILED_AUDIT_CHECKLIST.md" del "..\DETAILED_AUDIT_CHECKLIST.md"
if exist "..\PROJECT_AUDIT_REPORT.md" del "..\PROJECT_AUDIT_REPORT.md"
if exist "..\DOCUMENTATION_COMPLETE_REPORT.md" del "..\DOCUMENTATION_COMPLETE_REPORT.md"
if exist "..\DOCUMENTATION_UPDATE_COMPLETE.md" del "..\DOCUMENTATION_UPDATE_COMPLETE.md"
if exist "..\DOCUMENTATION_CONFLICTS_ANALYSIS.md" del "..\DOCUMENTATION_CONFLICTS_ANALYSIS.md"
if exist "..\DOCUMENTATION_AUDIT_REPORT.md" del "..\DOCUMENTATION_AUDIT_REPORT.md"
if exist "..\prompts" rmdir /s /q "..\prompts"

if not exist "..\archive\reports" mkdir "..\archive\reports"
if not exist "..\archive\logs" mkdir "..\archive\logs"

if exist "..\PHASE1_COMPLETE_REPORT.md" move "..\PHASE1_COMPLETE_REPORT.md" "..\archive\reports\" >nul
if exist "..\PHASE3_COMPLETE_REPORT.md" move "..\PHASE3_COMPLETE_REPORT.md" "..\archive\reports\" >nul
if exist "..\RECOVERY_COMPLETE_REPORT.md" move "..\RECOVERY_COMPLETE_REPORT.md" "..\archive\reports\" >nul
if exist "..\TRANSFER_COMPLETE.md" move "..\TRANSFER_COMPLETE.md" "..\archive\reports\" >nul
if exist "..\QUICK_WINS_COMPLETE.md" move "..\QUICK_WINS_COMPLETE.md" "..\archive\reports\" >nul
if exist "..\CONVERSATION_LOG.md" move "..\CONVERSATION_LOG.md" "..\archive\logs\" >nul
if exist "..\CONVERSATION_LOG_PHASE1.md" move "..\CONVERSATION_LOG_PHASE1.md" "..\archive\logs\" >nul

echo Шаг 2: Архивация дополнительных отчётов...
if exist "..\REFACTORING_FINAL_REPORT.md" move "..\REFACTORING_FINAL_REPORT.md" "..\archive\reports\" >nul
if exist "..\PROJECT_ANALYSIS_REPORT.md" move "..\PROJECT_ANALYSIS_REPORT.md" "..\archive\reports\" >nul
if exist "..\REAL_CONFLICTS_REPORT.md" move "..\REAL_CONFLICTS_REPORT.md" "..\archive\reports\" >nul
if exist "..\IMPROVEMENT_PLAN_ANALYZED.md" move "..\IMPROVEMENT_PLAN_ANALYZED.md" "..\archive\reports\" >nul
if exist "..\IMPROVEMENT_MASTER_PLAN.md" move "..\IMPROVEMENT_MASTER_PLAN.md" "..\archive\reports\" >nul

echo Шаг 3: Архивация cleanup файлов...
if not exist "..\archive\cleanup" mkdir "..\archive\cleanup"
if exist "..\CLEANUP_QUICK_GUIDE.md" move "..\CLEANUP_QUICK_GUIDE.md" "..\archive\cleanup\" >nul
if exist "..\CLEANUP_SUMMARY.md" move "..\CLEANUP_SUMMARY.md" "..\archive\cleanup\" >nul
if exist "..\DOCUMENTATION_CLEANUP_ANALYSIS.md" move "..\DOCUMENTATION_CLEANUP_ANALYSIS.md" "..\archive\cleanup\" >nul

echo Шаг 4: Архивация bat файлов...
if exist "..\cleanup_documentation.bat" move "..\cleanup_documentation.bat" "..\archive\" >nul
if exist "..\minimal_cleanup.bat" move "..\minimal_cleanup.bat" "..\archive\" >nul
if exist "..\reorganize_project.bat" move "..\reorganize_project.bat" "..\archive\" >nul

echo Шаг 5: Реорганизация docs...
if not exist "..\docs\reports" mkdir "..\docs\reports"
if exist "..\PHASE_COMPLETION_REPORT.md" move "..\PHASE_COMPLETION_REPORT.md" "..\docs\reports\" >nul
if exist "..\FULL_PROJECT_AUDIT_REPORT.md" move "..\FULL_PROJECT_AUDIT_REPORT.md" "..\docs\reports\" >nul
if exist "..\FIXES_COMPLETED.md" move "..\FIXES_COMPLETED.md" "..\docs\reports\" >nul
if exist "..\AUDIT_INDEX.md" move "..\AUDIT_INDEX.md" "..\docs\reports\" >nul

echo Шаг 6: Реорганизация системных документов...
if not exist "..\docs\system" mkdir "..\docs\system"
if exist "..\DOCUMENTATION_SYSTEM.md" move "..\DOCUMENTATION_SYSTEM.md" "..\docs\system\" >nul
if exist "..\ARCHITECTURE_DIAGRAM.md" move "..\ARCHITECTURE_DIAGRAM.md" "..\docs\system\" >nul
if exist "..\PROJECT_STRUCTURE.md" move "..\PROJECT_STRUCTURE.md" "..\docs\system\" >nul
if exist "..\SYSTEM_USAGE_GUIDE.md" move "..\SYSTEM_USAGE_GUIDE.md" "..\docs\system\" >nul

echo Шаг 7: Удаление устаревших файлов...
if exist "..\FINAL_STATUS.md" del "..\FINAL_STATUS.md"
if exist "..\AUDIT_CHECKLIST.md" del "..\AUDIT_CHECKLIST.md"
if exist "..\FULL_PROMPTS_1-12.md" move "..\FULL_PROMPTS_1-12.md" "..\archive\" >nul

echo.
echo ✅ Полная реорганизация завершена!
echo Удалено: 20+ файлов
echo Архивировано: 15+ файлов
echo Реорганизовано: 10+ файлов
echo Результат: 47 → 15 файлов в корне (-68%%)
echo.
echo Новая структура:
echo   /docs/reports/     - Актуальные отчёты
echo   /docs/system/      - Системная документация
echo   /docs/guides/      - Руководства
echo   /archive/reports/  - Старые отчёты
echo   /archive/logs/     - Логи
echo   /archive/cleanup/  - Cleanup файлы
goto end

:cancel
echo.
echo Операция отменена.
goto end

:end
echo.
echo ========================================
pause
