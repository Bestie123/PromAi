// MODULE_FunctionTracer_VER_1.0
const FunctionTracer = {
    moduleId: 'MODULE_FunctionTracer_VER_1.0',
    version: '1.0',
    dependencies: [],
    enabled: false,
    trace: [],
    maxEntries: 1000,
    stats: { totalCalls: 0, byModule: {}, byFunction: {} },

    // FUNC_enable_001
    enable() {
        this.enabled = true;
        this.trace = [];
        this.stats = { totalCalls: 0, byModule: {}, byFunction: {} };
        console.log('[FunctionTracer] Enabled');
    },

    // FUNC_disable_002
    disable() {
        this.enabled = false;
        console.log('[FunctionTracer] Disabled');
    },

    // FUNC_log_003
    log(moduleId, functionId, args = [], startTime) {
        if (!this.enabled) return;
        
        const duration = startTime ? performance.now() - startTime : 0;
        const entry = {
            id: `TRACE_${this.trace.length + 1}`,
            moduleId,
            functionId,
            timestamp: new Date().toISOString(),
            duration: Math.round(duration * 100) / 100,
            args: args.length > 0 ? JSON.stringify(args).substring(0, 100) : '[]'
        };

        this.trace.push(entry);
        if (this.trace.length > this.maxEntries) {
            this.trace.shift();
        }

        this.stats.totalCalls++;
        this.stats.byModule[moduleId] = (this.stats.byModule[moduleId] || 0) + 1;
        this.stats.byFunction[functionId] = (this.stats.byFunction[functionId] || 0) + 1;

        return entry;
    },

    // FUNC_getTrace_004
    getTrace(limit = 100) {
        return this.trace.slice(-limit);
    },

    // FUNC_filterByModule_005
    filterByModule(moduleId) {
        return this.trace.filter(e => e.moduleId === moduleId);
    },

    // FUNC_filterByFunction_006
    filterByFunction(functionId) {
        return this.trace.filter(e => e.functionId === functionId);
    },

    // FUNC_clear_007
    clear() {
        this.trace = [];
        this.stats = { totalCalls: 0, byModule: {}, byFunction: {} };
    },

    // FUNC_export_008
    export() {
        return {
            projectId: 'PROJECT_TechKnowledgeBase',
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            trace: this.trace,
            stats: this.stats
        };
    },

    // FUNC_getSlowest_009
    getSlowest(limit = 10) {
        return [...this.trace]
            .sort((a, b) => b.duration - a.duration)
            .slice(0, limit);
    },

    // FUNC_getStats_010
    getStats() {
        return {
            ...this.stats,
            avgDuration: this.trace.length > 0 
                ? this.trace.reduce((sum, e) => sum + e.duration, 0) / this.trace.length 
                : 0,
            slowest: this.getSlowest(5)
        };
    }
};

window.FunctionTracer = FunctionTracer;
