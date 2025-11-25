// MODULE_DependencyValidator_VER_1.0
// Валидация зависимостей и архитектурных правил

const dependencyValidator = {
    moduleId: 'MODULE_DependencyValidator_VER_1.0',
    version: '1.0',
    dependencies: [],

    // FUNC_validate_001 - Полная валидация проекта
    async validate() {
        const cycles = this.findCycles();
        const layerViolations = this.checkLayerViolations();
        const orphanModules = this.findOrphanModules();
        
        return {
            valid: cycles.length === 0 && layerViolations.length === 0,
            cycles,
            layerViolations,
            orphanModules,
            timestamp: new Date().toISOString()
        };
    },

    // FUNC_findCycles_002 - Поиск циклических зависимостей (DFS)
    findCycles() {
        const graph = this.buildGraph();
        const visited = new Set();
        const recStack = new Set();
        const cycles = [];

        const dfs = (node, path = []) => {
            if (recStack.has(node)) {
                const cycleStart = path.indexOf(node);
                cycles.push([...path.slice(cycleStart), node]);
                return;
            }
            if (visited.has(node)) return;

            visited.add(node);
            recStack.add(node);
            path.push(node);

            const neighbors = graph[node] || [];
            neighbors.forEach(neighbor => dfs(neighbor, [...path]));

            recStack.delete(node);
        };

        Object.keys(graph).forEach(node => {
            if (!visited.has(node)) dfs(node);
        });

        return cycles;
    },

    // FUNC_checkLayerViolations_003 - Проверка нарушений правил слоёв
    checkLayerViolations() {
        const layers = this.loadLayers();
        const dependencies = this.loadDependencies();
        const violations = [];

        dependencies.edges.forEach(edge => {
            const fromLayer = this.getModuleLayer(edge.from, layers);
            const toLayer = this.getModuleLayer(edge.to, layers);

            if (!fromLayer || !toLayer) return;

            const allowed = layers.layers[fromLayer].canDependOn || [];
            if (!allowed.includes(toLayer) && fromLayer !== toLayer) {
                violations.push({
                    from: edge.from,
                    to: edge.to,
                    fromLayer,
                    toLayer,
                    rule: `${fromLayer} не может зависеть от ${toLayer}`
                });
            }
        });

        return violations;
    },

    // FUNC_findOrphanModules_004 - Поиск модулей без зависимостей
    findOrphanModules() {
        const registry = this.loadRegistry();
        const dependencies = this.loadDependencies();
        const orphans = [];

        Object.keys(registry.modules).forEach(moduleId => {
            const hasDeps = dependencies.edges.some(e => e.from === moduleId);
            const isDependent = dependencies.edges.some(e => e.to === moduleId);
            
            if (!hasDeps && !isDependent && moduleId !== 'MODULE_Inspector_VER_1.0') {
                orphans.push(moduleId);
            }
        });

        return orphans;
    },

    // FUNC_buildGraph_005 - Построение графа зависимостей
    buildGraph() {
        const dependencies = this.loadDependencies();
        const graph = {};

        dependencies.edges.forEach(edge => {
            if (!graph[edge.from]) graph[edge.from] = [];
            graph[edge.from].push(edge.to);
        });

        return graph;
    },

    // FUNC_getModuleLayer_006 - Получить слой модуля
    getModuleLayer(moduleId, layers) {
        for (const [layerId, layer] of Object.entries(layers.layers)) {
            if (layer.modules.includes(moduleId)) return layerId;
        }
        return null;
    },

    // FUNC_loadRegistry_007 - Загрузка project_registry.json
    loadRegistry() {
        return window.projectRegistry || JSON.parse(localStorage.getItem('projectRegistry'));
    },

    // FUNC_loadDependencies_008 - Загрузка dependencies_map.json
    loadDependencies() {
        return window.dependenciesMap || JSON.parse(localStorage.getItem('dependenciesMap'));
    },

    // FUNC_loadLayers_009 - Загрузка architecture_layers.json
    loadLayers() {
        return window.architectureLayers || JSON.parse(localStorage.getItem('architectureLayers'));
    },

    // FUNC_generateReport_010 - Генерация отчёта о валидации
    generateReport(validationResult) {
        let report = '# Отчёт валидации зависимостей\n\n';
        report += `**Дата:** ${validationResult.timestamp}\n`;
        report += `**Статус:** ${validationResult.valid ? '✅ Валидация пройдена' : '❌ Обнаружены проблемы'}\n\n`;

        if (validationResult.cycles.length > 0) {
            report += '## ❌ Циклические зависимости\n\n';
            validationResult.cycles.forEach((cycle, i) => {
                report += `${i + 1}. ${cycle.join(' → ')}\n`;
            });
            report += '\n';
        }

        if (validationResult.layerViolations.length > 0) {
            report += '## ❌ Нарушения правил слоёв\n\n';
            validationResult.layerViolations.forEach((v, i) => {
                report += `${i + 1}. **${v.from}** → **${v.to}**\n`;
                report += `   - ${v.rule}\n`;
            });
            report += '\n';
        }

        if (validationResult.orphanModules.length > 0) {
            report += '## ⚠️ Изолированные модули\n\n';
            validationResult.orphanModules.forEach((m, i) => {
                report += `${i + 1}. ${m}\n`;
            });
            report += '\n';
        }

        if (validationResult.valid) {
            report += '## ✅ Результат\n\n';
            report += 'Все проверки пройдены успешно!\n';
            report += '- Циклических зависимостей: 0\n';
            report += '- Нарушений правил слоёв: 0\n';
        }

        return report;
    }
};

window.dependencyValidator = dependencyValidator;
