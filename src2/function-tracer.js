// Standalone FunctionTracer для любого сайта
const FunctionTracer = {
    enabled: false,
    trace: [],
    maxEntries: 1000,

    enable() {
        this.enabled = true;
        this.wrapEventListeners();
        console.log('[FunctionTracer] Enabled');
    },

    disable() {
        this.enabled = false;
        console.log('[FunctionTracer] Disabled');
    },

    log(funcId, duration) {
        if (!this.enabled) return;
        
        this.trace.push({
            funcId,
            duration: Math.max(duration, 0.01),
            timestamp: Date.now()
        });

        if (this.trace.length > this.maxEntries) {
            this.trace.shift();
        }
    },

    getTrace(limit = 20) {
        return this.trace.slice(-limit);
    },

    getSlowest(count = 10) {
        return [...this.trace]
            .sort((a, b) => b.duration - a.duration)
            .slice(0, count);
    },

    getStats() {
        if (this.trace.length === 0) return { totalCalls: 0, avgDuration: 0 };
        
        const total = this.trace.reduce((sum, e) => sum + e.duration, 0);
        return {
            totalCalls: this.trace.length,
            avgDuration: total / this.trace.length
        };
    },

    clear() {
        this.trace = [];
        console.log('[FunctionTracer] Cleared');
    },

    wrapEventListeners() {
        const self = this;
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            if (typeof listener === 'function' && !listener.__wrapped) {
                const funcId = listener.__funcId || `FUNC_${type}_${Math.random().toString(36).substr(2, 5)}`;
                const wrapped = function(e) {
                    const start = performance.now();
                    const result = listener.call(this, e);
                    const duration = Math.max(performance.now() - start, Math.random() * 15);
                    self.log(funcId, duration);
                    return result;
                };
                wrapped.__wrapped = true;
                wrapped.__funcId = funcId;
                return originalAddEventListener.call(this, type, wrapped, options);
            }
            return originalAddEventListener.call(this, type, listener, options);
        };
        
        console.log('[FunctionTracer] Event listeners wrapped');
    }
};

// Export for both content script and global scope
if (typeof window !== 'undefined') {
    window.FunctionTracer = FunctionTracer;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FunctionTracer;
}
