// MODULE_DOMFactory_VER_1.0
const DOMCreatorLogger = {
    elements: {},
    
    log(elementId, moduleId, functionId, componentId) {
        if (!elementId) return;
        this.elements[elementId] = {
            moduleId,
            functionId,
            componentId,
            timestamp: new Date().toISOString(),
            stackTrace: new Error().stack
        };
    },
    
    get(elementId) {
        return this.elements[elementId];
    },
    
    getByModule(moduleId) {
        return Object.entries(this.elements)
            .filter(([_, data]) => data.moduleId === moduleId)
            .map(([id, data]) => ({id, ...data}));
    },
    
    clear() {
        this.elements = {};
    }
};

const domFactory = {
    moduleId: 'MODULE_DOMFactory_VER_1.0',
    version: '1.0',
    dependencies: [],

    // FUNC_create_001 - Создать элемент с автоматическими data-атрибутами
    create(config) {
        const {
            tag = 'div',
            moduleId,
            componentId,
            functionId,
            nodeId,
            className,
            textContent,
            innerHTML,
            attributes = {},
            events = {},
            children = []
        } = config;

        const element = document.createElement(tag);

        // Автоматические data-атрибуты
        if (moduleId) element.setAttribute('data-module-id', moduleId);
        if (componentId) element.setAttribute('data-component-id', componentId);
        if (functionId) element.setAttribute('data-function-id', functionId);
        if (nodeId) element.setAttribute('data-node-id', nodeId);

        // Базовые атрибуты
        if (className) element.className = className;
        if (textContent) element.textContent = textContent;
        if (innerHTML) element.innerHTML = innerHTML;

        // Дополнительные атрибуты
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'style' && typeof value === 'object') {
                Object.assign(element.style, value);
            } else {
                element.setAttribute(key, value);
            }
        });

        // События
        Object.entries(events).forEach(([event, handler]) => {
            element.addEventListener(event, handler);
        });

        // Дочерние элементы
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof HTMLElement) {
                element.appendChild(child);
            } else if (typeof child === 'object') {
                element.appendChild(this.create(child));
            }
        });

        // Логирование создания элемента
        if (element.id) {
            DOMCreatorLogger.log(element.id, moduleId, functionId, componentId);
        }

        return element;
    },

    // FUNC_button_002 - Создать кнопку с data-атрибутами
    button(config) {
        return this.create({
            tag: 'button',
            ...config
        });
    }
};

window.domFactory = domFactory;
window.DOMCreatorLogger = DOMCreatorLogger;
window.DOMFactory = domFactory;
