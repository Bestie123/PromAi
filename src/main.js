// PROJECT_TechKnowledgeBase - Main Entry Point
window.techData = {categories: []};
window.currentModalPath = [];

// Глобальная функция для чек-листов
window.toggleChecklistItem = function(path, techIndex, itemIndex) {
    const parent = window.dataManager.getNodeByPath(path);
    if (!parent) return;
    
    const tech = parent[techIndex];
    if (!tech || !tech.checklist || tech.checklist.length <= itemIndex) return;
    
    tech.checklist[itemIndex].completed = !tech.checklist[itemIndex].completed;
    window.dataManager.saveToLocalStorage();
    window.authManager.scheduleAutoSave();
    window.accordionManager.renderAccordion();
    
    if (window.checklistManager && window.checklistManager.renderChecklist) {
        window.checklistManager.renderChecklist();
    }
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('[PROJECT_TechKnowledgeBase] Initializing...');
    
    window.authManager.loadAuth();
    window.dataManager.loadFromLocalStorage();
    window.accordionManager.init();
    window.authManager.updateSyncStatus();
    window.inspector.init();
    
    if (window.knowledgeEditor && window.knowledgeEditor.initKeyboardShortcuts) {
        window.knowledgeEditor.initKeyboardShortcuts();
    }
    
    console.log('[PROJECT_TechKnowledgeBase] Initialized successfully');
});