# Development Guidelines - Tech Knowledge Base

## Code Quality Standards

### Module Structure Pattern
Every module follows a consistent structure observed across all 11 modules:

```javascript
// MODULE_{Name}_VER_{version}
const moduleName = {
    moduleId: 'MODULE_{Name}_VER_{version}',
    version: '{version}',
    dependencies: ['MODULE_Dependency1_VER_1.0', 'MODULE_Dependency2_VER_1.0'],
    
    // FUNC_{functionName}_{number} - Description
    functionName() {
        // Implementation
    }
};

window.moduleName = moduleName;
```

**Key Characteristics:**
- Module defined as object literal with moduleId and version properties
- Dependencies explicitly declared in array
- Functions documented with FUNC_ID comments
- Module exposed on window object for global access
- No ES6 modules - uses window-scoped pattern

### Function Documentation Pattern
Every function MUST include a comment with FUNC_ID and description:

```javascript
// FUNC_functionName_001 - Brief description of what function does
functionName(param1, param2) {
    // Implementation
}
```

**Observed in 214 functions across all modules:**
- Sequential numbering within each module (001, 002, 003...)
- Snake_case for function names in FUNC_ID
- CamelCase for actual function names
- Brief, action-oriented descriptions
- No JSDoc-style comments - simple line comments only

### Naming Conventions

#### Module IDs
- **Format:** `MODULE_{PascalCase}_VER_{version}`
- **Examples:** `MODULE_KnowledgeManager_VER_1.0`, `MODULE_AuthManager_VER_1.0`
- **Usage:** Stored in moduleId property, used in data-attributes

#### Function IDs
- **Format:** `FUNC_{snake_case}_{number}`
- **Examples:** `FUNC_openKnowledgeBase_001`, `FUNC_saveToLocalStorage_002`
- **Numbering:** Sequential within module, starts at 001
- **Usage:** In comments and data-function-id attributes

#### Component IDs
- **Format:** `COMP_{PascalCase}`
- **Examples:** `COMP_MediaItem`, `COMP_SearchResultItem`, `COMP_TableCell`
- **Usage:** In data-component-id attributes for DOM elements

#### Variable Naming
- **camelCase** for local variables: `currentItem`, `autoSaveEnabled`, `lastSyncTime`
- **UPPER_SNAKE_CASE** for constants: Not observed - no constants defined
- **Descriptive names:** `lastKnownRemoteSha`, `autoSaveInterval`, `knowledgeEditor`

### Code Formatting Standards

#### Indentation and Spacing
- **4 spaces** for indentation (consistent across all files)
- **No tabs** - spaces only
- **Blank lines** between functions for readability
- **No blank lines** within function bodies unless separating logical blocks

#### String Literals
- **Single quotes** for JavaScript strings: `'error'`, `'success'`
- **Template literals** for HTML and interpolation: `` `<div>${content}</div>` ``
- **Double quotes** in HTML attributes: `<div class="modal">`

#### Object and Array Formatting
```javascript
// Object literals - compact style
const config = {
    moduleId: this.moduleId,
    componentId: 'COMP_Name',
    className: 'class-name'
};

// Arrays - inline for short lists
dependencies: ['MODULE_A_VER_1.0', 'MODULE_B_VER_1.0']

// Multi-line for complex structures
const data = {
    name: file.name,
    type: mediaType,
    data: e.target.result,
    mimeType: file.type,
    size: file.size
};
```

#### Function Declarations
- **No semicolons** after function declarations
- **Comma-separated** methods in object literals
- **Arrow functions** for callbacks: `(e) => { ... }`
- **Traditional functions** for module methods

### Error Handling Patterns

#### Try-Catch for Async Operations
Observed in AuthManager (19 functions) and KnowledgeManager:

```javascript
async functionName() {
    try {
        const response = await fetch(url, options);
        if (response.status === 200) {
            // Success handling
        } else {
            // Error handling
        }
    } catch (error) {
        console.error('Error:', error);
        uiManager.showNotification('❌ Error', 'error');
    }
}
```

**Pattern characteristics:**
- Always catch async/await operations
- Check response.status explicitly
- Log errors to console
- Show user-friendly notifications
- No error re-throwing - handle at source

#### Validation Before Operations
```javascript
if (!token || !owner || !repo) {
    uiManager.showNotification('Configure GitHub first!', 'error');
    return;
}
```

**Common validations:**
- Check required parameters exist
- Early return on validation failure
- User notification for missing data
- No throwing exceptions - graceful degradation

#### Defensive Programming
```javascript
if (!this.currentItem) return;
if (!item.media) item.media = [];
const parent = window.dataManager.getNodeByPath(path);
if (!parent) return;
```

**Patterns observed:**
- Guard clauses at function start
- Initialize missing properties
- Null checks before operations
- Silent failures with early returns

## Semantic Patterns

### DOM Manipulation with DOMFactory

#### Factory Pattern for Element Creation
Used in 4 modules (AccordionManager, ChecklistManager, KnowledgeManager, KnowledgeEditor):

```javascript
const element = domFactory.create({
    moduleId: this.moduleId,
    componentId: 'COMP_ComponentName',
    className: 'css-class',
    tag: 'div',  // optional, defaults to 'div'
    attributes: { /* ... */ },
    innerHTML: '...'
});
```

**Benefits:**
- Automatic data-attribute injection
- Consistent element tracking
- Inspector integration
- Centralized element creation

#### Manual Data Attributes (Legacy Pattern)
Still used in some modules for inline HTML:

```javascript
innerHTML: `
    <button data-module-id="MODULE_KnowledgeManager_VER_1.0" 
            data-function-id="FUNC_deleteMedia_013"
            onclick="knowledgeManager.deleteMedia(${index})">
        🗑️
    </button>
`
```

### Async/Await Pattern

#### GitHub API Calls
Consistent pattern in AuthManager (19 functions):

```javascript
async functionName() {
    const token = localStorage.getItem('githubToken');
    const owner = localStorage.getItem('repoOwner');
    const repo = localStorage.getItem('repoName');
    
    if (!token || !owner || !repo) {
        uiManager.showNotification('Configure GitHub first!', 'error');
        return;
    }
    
    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/...`, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'TechDocs-App'
            }
        });
        
        if (response.status === 200) {
            const data = await response.json();
            // Process data
        }
    } catch (error) {
        console.error('Error:', error);
        uiManager.showNotification('❌ Error', 'error');
    }
}
```

**Key elements:**
- Load credentials from localStorage
- Validate before API call
- Proper headers (Authorization, Accept, User-Agent)
- Status code checking
- JSON parsing
- Error handling with notifications

### State Management Pattern

#### LocalStorage Persistence
Observed in DataManager and AuthManager:

```javascript
// Save
saveToLocalStorage() {
    localStorage.setItem('techData', JSON.stringify(window.techData));
}

// Load
loadFromLocalStorage() {
    const stored = localStorage.getItem('techData');
    if (stored) {
        window.techData = JSON.parse(stored);
    }
}
```

**Characteristics:**
- Global state on window object
- JSON serialization for storage
- Null checks on load
- Immediate persistence on changes

#### Auto-Save Scheduling
Pattern from AuthManager:

```javascript
scheduleAutoSave() {
    if (!this.autoSaveEnabled) return;
    
    if (this.autoSaveTimeout) {
        clearTimeout(this.autoSaveTimeout);
    }
    
    this.autoSaveTimeout = setTimeout(() => {
        this.autoSaveToGitHub();
    }, 10000);
}
```

**Debouncing pattern:**
- Clear existing timeout
- Set new timeout
- Prevents excessive saves
- Configurable delay

### Event Handling Patterns

#### DOM Event Listeners
Observed in KnowledgeManager initialization:

```javascript
document.addEventListener('DOMContentLoaded', function() {
    const element = document.getElementById('elementId');
    
    if (element) {
        element.addEventListener('event', (e) => {
            // Handle event
        });
    }
});
```

**Best practices:**
- Wait for DOMContentLoaded
- Check element exists before adding listener
- Arrow functions for callbacks
- Event parameter naming: `e` or `event`

#### Inline Event Handlers
Used for dynamic content:

```javascript
innerHTML: `
    <button onclick="moduleName.functionName(${param})">
        Action
    </button>
`
```

**When used:**
- Dynamically generated HTML
- Simple one-line handlers
- Module methods as handlers
- Parameter passing needed

### Data Traversal Pattern

#### Recursive Tree Traversal
Common pattern in KnowledgeManager and DataManager:

```javascript
function traverse(nodes, path = []) {
    nodes.forEach((node, index) => {
        // Process node
        
        if (node.children) {
            traverse(node.children, [...path, index]);
        }
    });
}

traverse(techData.categories);
```

**Characteristics:**
- Recursive function for tree structures
- Path tracking with array
- Spread operator for immutable path
- forEach for iteration

#### Path-Based Navigation
```javascript
getNodeByPath(path) {
    let current = window.techData.categories;
    for (const index of path) {
        current = current[index].children;
    }
    return current;
}
```

### UI Notification Pattern

#### Consistent User Feedback
Used across all modules:

```javascript
uiManager.showNotification('Message', 'type');
// Types: 'success', 'error', 'warning'
```

**Emoji conventions:**
- ✅ Success operations
- ❌ Errors
- ⚠️ Warnings
- 🔄 Loading/syncing
- 💾 Saving

### Module Communication Pattern

#### Direct Method Calls
No event bus - direct module references:

```javascript
// Module A calls Module B
dataManager.saveToLocalStorage();
uiManager.showNotification('Saved!', 'success');
accordionManager.renderAccordion();
```

**Dependency flow:**
- Higher layers call lower layers
- No circular calls
- Global window references
- Synchronous communication

#### Scheduled Operations
```javascript
scheduleSave() {
    dataManager.saveToLocalStorage();
    authManager.scheduleAutoSave();
    accordionManager.renderAccordion();
}
```

**Cascade pattern:**
- One function triggers multiple updates
- Maintains consistency
- Centralized coordination

## Internal API Usage

### DOMFactory API

#### Creating Elements
```javascript
// Basic element
const div = domFactory.create({
    moduleId: this.moduleId,
    componentId: 'COMP_Name',
    className: 'css-class'
});

// Button with attributes
const button = domFactory.button({
    moduleId: this.moduleId,
    componentId: 'COMP_Button',
    text: 'Click Me',
    onClick: () => this.handleClick()
});

// Custom tag with attributes
const input = domFactory.create({
    tag: 'input',
    moduleId: this.moduleId,
    componentId: 'COMP_Input',
    attributes: {
        type: 'text',
        placeholder: 'Enter text'
    }
});
```

**Required parameters:**
- `moduleId` - Always this.moduleId
- `componentId` - COMP_{Name} format

**Optional parameters:**
- `tag` - HTML tag (default: 'div')
- `className` - CSS classes
- `attributes` - Object of HTML attributes
- `innerHTML` - Inner HTML content

### UIManager API

#### Modal Management
```javascript
// Show modal
uiManager.showModal('modalId');

// Hide all modals
uiManager.hideModals();
```

#### Notifications
```javascript
// Show notification
uiManager.showNotification('Message', 'type');
// Types: 'success', 'error', 'warning'

// Auto-dismisses after 3 seconds
```

### DataManager API

#### CRUD Operations
```javascript
// Add category
dataManager.addCategory(name);

// Add technology
dataManager.addTechnology(path, name);

// Toggle completion
dataManager.toggleTech(path, index);

// Delete node
dataManager.deleteNode(path, index);

// Get node by path
const node = dataManager.getNodeByPath(path);

// Get node at index
const item = dataManager.getNodeAtIndex(path, index);
```

#### Persistence
```javascript
// Save to LocalStorage
dataManager.saveToLocalStorage();

// Load from LocalStorage
dataManager.loadFromLocalStorage();

// Export to JSON
dataManager.exportToJSON();

// Import from JSON
dataManager.importFromJSON(jsonData);
```

### KnowledgeEditor API

#### Text Formatting
```javascript
// Basic formatting
knowledgeEditor.formatText('bold');
knowledgeEditor.formatText('italic');
knowledgeEditor.formatText('underline');

// Headings
knowledgeEditor.insertHeading(1); // h1
knowledgeEditor.insertHeading(2); // h2

// Lists
knowledgeEditor.insertList('ul'); // unordered
knowledgeEditor.insertList('ol'); // ordered
```

#### Content Insertion
```javascript
// Insert HTML
knowledgeEditor.insertHtml('<p>Content</p>');

// Insert link
knowledgeEditor.insertLink();

// Insert image
knowledgeEditor.insertImage();

// Insert table
knowledgeEditor.insertTable();

// Insert internal link
knowledgeEditor.insertInternalLink();
```

#### Table Operations
```javascript
// Add/remove rows
knowledgeEditor.insertTableRow();
knowledgeEditor.deleteTableRow();

// Add/remove columns
knowledgeEditor.insertTableColumn();
knowledgeEditor.deleteTableColumn();

// Cell alignment
knowledgeEditor.alignCellLeft();
knowledgeEditor.alignCellCenter();
knowledgeEditor.alignCellRight();
```

### AuthManager API

#### GitHub Operations
```javascript
// Test connection
await authManager.testAuth();

// Save credentials
authManager.saveAuth();

// Load credentials
authManager.loadAuth();

// Load from GitHub
await authManager.loadFromGitHub();

// Save to GitHub
await authManager.saveToGitHub();

// Force sync
await authManager.forceSync();
```

#### Auto-Save
```javascript
// Enable auto-save
authManager.enableAutoSave();

// Disable auto-save
authManager.disableAutoSave();

// Toggle auto-save
authManager.toggleAutoSave();

// Schedule auto-save
authManager.scheduleAutoSave();
```

## Code Idioms

### Initialization Pattern
```javascript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize modules
    authManager.loadAuth();
    dataManager.loadFromLocalStorage();
    accordionManager.init();
    inspector.init();
    
    // Initialize keyboard shortcuts
    if (knowledgeEditor && knowledgeEditor.initKeyboardShortcuts) {
        knowledgeEditor.initKeyboardShortcuts();
    }
});
```

### Conditional Initialization
```javascript
if (!item.content) item.content = '';
if (!item.media) item.media = [];
if (!item.links) item.links = [];
if (!item.id) item.id = 'tech_' + Math.random().toString(36).substr(2, 9);
```

**Pattern:**
- Initialize missing properties inline
- No separate initialization function
- Defensive programming
- Random ID generation for missing IDs

### Array Operations
```javascript
// Find and filter
const item = array.find(x => x.name === name);
const filtered = array.filter(x => x.completed);
const exists = array.some(x => x.id === id);

// Map and join
const html = items.map(item => `<div>${item.name}</div>`).join('');

// Spread for immutability
const newPath = [...path, index];
const newArray = [...existingArray, newItem];
```

### String Manipulation
```javascript
// Template literals for HTML
const html = `
    <div class="${className}" data-id="${id}">
        ${content}
    </div>
`;

// String interpolation
const message = `Loaded ${count} items`;

// URL construction
const url = `https://api.github.com/repos/${owner}/${repo}/contents/${file}`;
```

### Object Destructuring
**Not commonly used** - explicit property access preferred:

```javascript
// Preferred pattern
const token = localStorage.getItem('githubToken');
const owner = localStorage.getItem('repoOwner');

// Not used (but valid ES6)
// const { token, owner, repo } = credentials;
```

### Ternary Operators
```javascript
// Conditional values
const icon = isLinked ? '✅' : '🔗';
const className = isActive ? 'active' : '';
const display = query ? 'block' : 'none';

// Nested ternaries (used sparingly)
const mediaType = file.type.startsWith('image/') ? 'image' :
                  file.type.startsWith('video/') ? 'video' : 'other';
```

## Annotations and Comments

### Module Header Comments
```javascript
// MODULE_{Name}_VER_{version}
// Brief description of module purpose
```

**Always includes:**
- Module ID
- Optional description line
- No author or date information

### Function Comments
```javascript
// FUNC_{functionName}_{number} - Brief description
functionName() {
    // Implementation
}
```

**Format:**
- Single line comment
- FUNC_ID followed by dash and description
- Action-oriented descriptions
- No parameter documentation
- No return value documentation

### Inline Comments
**Rarely used** - code is self-documenting:

```javascript
// Only for complex logic
console.log('🔄 Автосохранение на GitHub...');

// Or for clarification
// Инициализируем поля если их нет
if (!item.content) item.content = '';
```

### TODO Comments
**Not observed** - tasks tracked in todo.json instead

### Console Logging
```javascript
// Informational logs with emoji
console.log('✅ Автосохранение выполнено успешно');
console.log('🔄 Начинаем слияние данных...');

// Error logs
console.error('❌ Ошибка автосохранения:', error);

// Warning logs
console.warn('⚠️ Автосохранение не удалось:', response.status);
```

**Emoji conventions:**
- ✅ Success
- ❌ Error
- ⚠️ Warning
- 🔄 Processing
- 📝 Creating/Writing
- 💾 Saving

## Testing Patterns

### No Automated Tests
- No test files observed
- No test framework configured
- Manual testing approach
- Console logging for debugging

### Validation Functions
```javascript
// DependencyValidator module provides validation
async validate() {
    const cycles = this.findCycles();
    const layerViolations = this.checkLayerViolations();
    const orphanModules = this.findOrphanModules();
    
    return {
        valid: cycles.length === 0 && layerViolations.length === 0,
        cycles,
        layerViolations,
        orphanModules
    };
}
```

### Inspector for Runtime Testing
- Ctrl+Shift+I activates Inspector
- Visual element inspection
- Live function tracing
- Performance monitoring
- Export reports for analysis

## Performance Considerations

### Debouncing Pattern
```javascript
scheduleAutoSave() {
    if (this.autoSaveTimeout) {
        clearTimeout(this.autoSaveTimeout);
    }
    
    this.autoSaveTimeout = setTimeout(() => {
        this.autoSaveToGitHub();
    }, 10000);
}
```

### Rate Limiting
```javascript
const now = Date.now();
if (this.lastSaveTime && (now - this.lastSaveTime) < 30000) {
    return; // Skip if saved within last 30 seconds
}
```

### Lazy Initialization
```javascript
// Initialize only when needed
if (!this.currentItem.media) {
    this.currentItem.media = [];
}
```

### DOM Manipulation Efficiency
```javascript
// Build HTML string, then insert once
const html = items.map(item => `<div>${item.name}</div>`).join('');
container.innerHTML = html;

// Not: Multiple appendChild calls
```

## Security Practices

### XSS Prevention
**Limited sanitization** - relies on browser:

```javascript
// No explicit sanitization library
// innerHTML used directly (potential XSS risk)
editor.innerHTML = content;

// User input in template literals (potential XSS)
innerHTML: `<div>${userInput}</div>`;
```

**Recommendation:** Add sanitization for production use

### Token Storage
```javascript
// Stored in localStorage (not secure for sensitive data)
localStorage.setItem('githubToken', token);

// Better: Use secure storage or prompt each session
```

### API Security
```javascript
// Proper headers for GitHub API
headers: {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'TechDocs-App'
}
```

## Documentation Generation

### Automated Template System
Script: `scripts/generate-docs.js`

```bash
# Generate documentation for new feature
node scripts/generate-docs.js FunctionRegistry
```

**Creates:**
1. `.aws/amazonq/prompts/PROMPT_{Name}.md` - AI prompt template
2. `docs/{Name}_GUIDE.md` - User guide template

**Templates include:**
- Structured sections
- Code examples placeholders
- Consistent formatting
- Version and date stamps

### Documentation Standards
- **Prompts:** Task-oriented, step-by-step instructions
- **Guides:** Comprehensive with examples and troubleshooting
- **README:** High-level overview with quick start
- **State files:** Machine-readable JSON with schemas

## Git Workflow

### Commit Message Format
**Not enforced** but recommended in project-standards.md:

```
feat(MODULE_Name): description
fix(MODULE_Name): description
refactor(MODULE_Name): description
docs(MODULE_Name): description
```

### State File Updates
**Critical:** Always update after changes:
1. `project_registry.json` - Add/update module entries
2. `dependencies_map.json` - Update dependency graph
3. `function_registry.json` - Register new functions
4. `todo.json` - Track tasks
5. `changelog.md` - Document changes

## Architecture Principles

### Layered Architecture
**5 layers with strict dependencies:**

1. **LAYER_1_CORE** - No dependencies
   - DOMFactory, FunctionTracer, DependencyValidator, Inspector

2. **LAYER_2_DATA** - Depends on CORE
   - DataManager

3. **LAYER_3_UI** - Depends on CORE, DATA
   - UIManager, AccordionManager, ChecklistManager

4. **LAYER_4_INTEGRATION** - Depends on DATA, UI
   - AuthManager

5. **LAYER_5_KNOWLEDGE** - Depends on all below
   - KnowledgeManager, KnowledgeEditor

### Dependency Rules
- **No circular dependencies** - Enforced by DependencyValidator
- **Lower layers cannot depend on higher layers**
- **Same layer modules can depend on each other** (with caution)
- **All dependencies explicit** in module definition

### Module Independence
- Each module is self-contained
- Clear interfaces (public methods)
- No shared state between modules (except window.techData)
- Communication through method calls, not events

### SOLID Principles

#### Single Responsibility
Each module has one clear purpose:
- DataManager: Data operations only
- UIManager: UI components only
- AuthManager: GitHub integration only

#### Open/Closed
Modules extensible through:
- Adding new functions
- Inheritance not used (object literal pattern)
- Composition over inheritance

#### Dependency Inversion
- High-level modules depend on abstractions (module interfaces)
- Low-level modules provide implementations
- Dependencies injected via window object

## Best Practices Summary

### DO:
✅ Use DOMFactory for element creation  
✅ Add FUNC_ID comments to all functions  
✅ Include data-attributes (module-id, component-id, function-id)  
✅ Validate inputs before operations  
✅ Show user notifications for all actions  
✅ Use async/await for asynchronous operations  
✅ Handle errors with try-catch  
✅ Update state files after changes  
✅ Follow naming conventions strictly  
✅ Use emoji in notifications and logs  

### DON'T:
❌ Create circular dependencies  
❌ Violate layer architecture rules  
❌ Use global variables (except window.techData)  
❌ Throw exceptions - handle gracefully  
❌ Skip error handling in async functions  
❌ Forget to update documentation  
❌ Mix tabs and spaces  
❌ Use JSDoc comments (use simple comments)  
❌ Create orphan modules  
❌ Ignore validation results  

### ALWAYS:
- Check for null/undefined before operations
- Provide user feedback for actions
- Log errors to console
- Update all 4 state files together
- Follow PromAi naming conventions
- Use 4-space indentation
- Test with Inspector before committing
- Document new functions with FUNC_ID
- Validate dependencies with DependencyValidator
- Keep modules focused and cohesive
