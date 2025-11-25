# Project Structure - Tech Knowledge Base

## Directory Organization

```
PromAi/
├── src/                          # Application source code
│   ├── modules/                  # Core application modules (11 modules)
│   ├── styles/                   # CSS stylesheets
│   ├── index.html                # Main application page
│   ├── main.js                   # Application entry point
│   └── modals-knowledge.html     # Knowledge base modal templates
│
├── .amazonq/                     # Amazon Q AI configuration
│   ├── prompts/                  # Saved AI prompts for specific tasks
│   └── rules/                    # Project standards and conventions
│       ├── memory-bank/          # AI memory bank documentation
│       ├── auto-documentation.md # Auto-documentation rules
│       └── project-standards.md  # PromAi standards
│
├── docs/                         # User documentation
│   ├── guides/                   # Feature-specific guides
│   ├── reports/                  # Analysis and optimization reports
│   └── system/                   # System architecture documentation
│
├── scripts/                      # Build and utility scripts
│   ├── generate-docs.js          # Documentation generator
│   └── optimize-artifacts.bat    # Artifact optimization
│
├── archive/                      # Historical documentation
│   ├── logs/                     # Conversation logs
│   └── reports/                  # Phase completion reports
│
├── State Files (root)            # Project state and metadata
│   ├── project_registry.json     # Module and function registry
│   ├── dependencies_map.json     # Module dependency graph
│   ├── function_registry.json    # Function call tracing
│   ├── architecture_layers.json  # Layer definitions
│   ├── todo.json                 # Task management
│   ├── metrics.json              # Code quality metrics
│   └── changelog.md              # Version history
│
└── Documentation (root)          # Project documentation
    ├── README.md                 # Main project documentation
    ├── QUICK_START.md            # Quick start guide
    └── PROJECT_STRUCTURE.md      # This file
```

## Core Components

### Application Modules (src/modules/)

#### Layer 1: CORE - Foundation utilities (4 modules)
- **DOMFactory.js** (6 functions)
  - Creates DOM elements with automatic data-attribute generation
  - Tracks element creation for debugging
  - Provides factory methods for common UI elements

- **FunctionTracer.js** (10 functions)
  - Logs function calls with timestamps and performance metrics
  - Filters traces by module or function
  - Exports trace data for analysis

- **DependencyValidator.js** (10 functions)
  - Validates module dependencies against architecture rules
  - Detects cyclic dependencies
  - Checks layer violation constraints

- **Inspector.js** (18 functions)
  - Visual debugging tool activated with Ctrl+Shift+I
  - Shows module/component/function IDs on hover
  - Live function tracing with export capabilities

#### Layer 2: DATA - Data management (1 module)
- **DataManager.js** (17 functions)
  - CRUD operations for categories and technologies
  - LocalStorage persistence
  - JSON import/export
  - Node path navigation

#### Layer 3: UI - User interface components (3 modules)
- **UIManager.js** (6 functions)
  - Modal window management
  - Toast notifications
  - Form handling utilities

- **AccordionManager.js** (9 functions)
  - Collapsible category navigation
  - Progress calculation
  - Inline checklist rendering

- **ChecklistManager.js** (11 functions)
  - Task list CRUD operations
  - Inline editing
  - Completion tracking

#### Layer 4: INTEGRATION - External services (1 module)
- **AuthManager.js** (19 functions)
  - GitHub API authentication
  - Repository operations (load/save)
  - Data merging and conflict resolution
  - Auto-save scheduling

#### Layer 5: KNOWLEDGE - Knowledge base features (2 modules)
- **KnowledgeManager.js** (25 functions)
  - Knowledge base modal management
  - Content preview and rendering
  - Media and link management
  - Global search functionality
  - Internal linking between technologies

- **KnowledgeEditor.js** (43 functions)
  - Rich text editing with formatting
  - Table creation and manipulation
  - Media insertion (images, videos)
  - Find and replace
  - Keyboard shortcuts

### State Files (Root Directory)

#### Core Registry Files
- **project_registry.json** - Central registry of all modules and functions
- **dependencies_map.json** - Graph of module dependencies with nodes and edges
- **function_registry.json** - Function call tracing with caller/callee relationships
- **architecture_layers.json** - Layer definitions and constraints

#### Analysis Files
- **dependency_matrix.md** - Visual dependency matrix
- **unused_functions.json** - Dead code analysis
- **dom_creator_map.json** - DOM element creation tracking
- **trace_log.json** - Function trace log structure

#### Context Optimization Files
- **context_pack.json** - Optimized context for AI interactions
- **context_core.json** - Core layer context
- **context_data.json** - Data layer context
- **context_ui.json** - UI layer context
- **id_mapper.json** - Full ID to compact ID mapping

#### Project Management
- **todo.json** - Task tracking with status and estimates
- **changelog.md** - Version history with semantic versioning
- **changelog_compact.json** - Compact changelog format
- **metrics.json** - Code quality metrics

## Architectural Patterns

### Layered Architecture
The application follows a strict 5-layer architecture:
1. **CORE** - No dependencies, provides utilities
2. **DATA** - Depends only on CORE
3. **UI** - Depends on CORE and DATA
4. **INTEGRATION** - Depends on DATA and UI
5. **KNOWLEDGE** - Top layer, can depend on all below

### Module Independence
- Each module is self-contained with clear interfaces
- Modules communicate through well-defined function calls
- No circular dependencies between modules
- Dependency injection for testability

### Data Attribute System
Every DOM element created includes:
- `data-module-id` - Originating module (e.g., MODULE_DataManager_VER_1.0)
- `data-component-id` - Component identifier (e.g., COMP_CategoryItem)
- `data-function-id` - Creating function (e.g., FUNC_addCategory_004)
- `data-node-id` - Data node reference (for data-bound elements)

### Function Tracing
All functions are registered with:
- Unique FUNC_ID (e.g., FUNC_saveToLocalStorage_002)
- Module association
- Caller/callee relationships
- Performance metrics

## Key Relationships

### Module Dependencies
```
DOMFactory (CORE)
  ↓
AccordionManager, ChecklistManager, KnowledgeManager, KnowledgeEditor

DataManager (DATA)
  ↓
AccordionManager, ChecklistManager, AuthManager, KnowledgeManager

UIManager (UI)
  ↓
ChecklistManager, AuthManager, KnowledgeManager, KnowledgeEditor

FunctionTracer (CORE)
  ↓
Inspector

KnowledgeManager (KNOWLEDGE)
  ↓
KnowledgeEditor
```

### Data Flow
1. **User Input** → UIManager → DataManager → LocalStorage
2. **GitHub Sync** → AuthManager → DataManager → LocalStorage
3. **Rendering** → AccordionManager → DOMFactory → DOM
4. **Knowledge Base** → KnowledgeManager → KnowledgeEditor → DataManager

## File Naming Conventions

### Module Files
- Format: `{ModuleName}.js`
- Example: `DataManager.js`, `KnowledgeEditor.js`

### State Files
- Format: `{purpose}_{type}.json` or `{purpose}.md`
- Examples: `project_registry.json`, `dependency_matrix.md`

### Documentation Files
- Format: `{TOPIC}_{TYPE}.md`
- Examples: `QUICK_START.md`, `DOMFactory_GUIDE.md`

## Configuration Files

### Amazon Q Configuration
- `.amazonq/rules/project-standards.md` - PromAi coding standards
- `.amazonq/rules/auto-documentation.md` - Documentation generation rules
- `.amazonq/prompts/*.md` - Task-specific AI prompts

### Build Scripts
- `scripts/generate-docs.js` - Generates documentation from code
- `scripts/optimize-artifacts.bat` - Optimizes project artifacts

## Entry Points

### Application Entry
- **src/index.html** - Main HTML page
- **src/main.js** - JavaScript initialization
- **src/modals-knowledge.html** - Knowledge base modal templates

### Development Entry
- **README.md** - Project overview and quick start
- **QUICK_START.md** - 30-second setup guide
- **PROJECT_STRUCTURE.md** - This file

## Build and Deployment

### No Build Required
- Pure vanilla JavaScript (ES6+)
- No transpilation or bundling needed
- Direct browser execution

### Deployment
1. Open `src/index.html` in modern browser
2. Or use `ЗАПУСК.bat` for local server
3. Or deploy to static hosting (GitHub Pages, Netlify, etc.)

## Extension Points

### Adding New Modules
1. Create module file in `src/modules/`
2. Follow MODULE_{Name}_VER_{version} naming
3. Register in `project_registry.json`
4. Update `dependencies_map.json`
5. Add to appropriate layer in `architecture_layers.json`

### Adding New Features
1. Add functions to existing module or create new module
2. Use FUNC_{name}_{number} naming
3. Register in `function_registry.json`
4. Update `changelog.md`
5. Create documentation in `docs/guides/`
