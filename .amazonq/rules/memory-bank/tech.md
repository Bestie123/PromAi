# Technology Stack - Tech Knowledge Base

## Programming Languages

### JavaScript (ES6+)
- **Version:** ECMAScript 2015+ (ES6, ES7, ES8 features)
- **Usage:** 100% of application logic
- **Style:** Vanilla JavaScript, no frameworks
- **Features Used:**
  - Arrow functions
  - Template literals
  - Destructuring
  - Async/await
  - Classes
  - Modules (window-based, not ES6 modules)
  - Spread operator
  - Optional chaining

### HTML5
- **Version:** HTML5
- **Usage:** Application structure and templates
- **Key Features:**
  - Semantic elements
  - Data attributes (data-module-id, data-component-id, etc.)
  - ContentEditable for rich text editing
  - Local Storage API

### CSS3
- **Version:** CSS3
- **Usage:** All styling and animations
- **Features:**
  - Flexbox layouts
  - CSS Grid
  - CSS Variables (custom properties)
  - Transitions and animations
  - Media queries for responsiveness

## Core Technologies

### Browser APIs
- **LocalStorage API** - Primary data persistence
- **Fetch API** - GitHub API communication
- **Clipboard API** - Copy/paste functionality
- **DOM API** - Dynamic UI manipulation
- **History API** - Navigation state management

### External APIs
- **GitHub REST API v3**
  - Authentication via Personal Access Tokens
  - Repository content operations (get/create/update)
  - Base64 encoding for file content
  - SHA-based file versioning

## Architecture Standards

### PromAi Standards
- **ID Naming Convention:**
  - Projects: `PROJECT_{Name}`
  - Modules: `MODULE_{Name}_VER_{version}`
  - Functions: `FUNC_{name}_{number}`
  - Components: `COMP_{Name}`
  - Tasks: `TASK_{number}`

- **Data Attributes:**
  - `data-module-id` - Module identifier
  - `data-component-id` - Component identifier
  - `data-function-id` - Function identifier
  - `data-node-id` - Data node reference

- **State Files:**
  - `project_registry.json` - Module registry
  - `dependencies_map.json` - Dependency graph
  - `function_registry.json` - Function tracing
  - `todo.json` - Task management
  - `changelog.md` - Version history

### Design Patterns
- **Module Pattern** - Encapsulation via window-scoped objects
- **Factory Pattern** - DOMFactory for element creation
- **Observer Pattern** - Event-driven UI updates
- **Singleton Pattern** - Global manager instances
- **Strategy Pattern** - Pluggable formatting in editor

## Development Tools

### Code Quality
- **No linters configured** - Manual code review
- **No test framework** - Manual testing
- **Metrics tracking** - Via metrics.json
- **Dependency validation** - DependencyValidator module

### Debugging Tools
- **Inspector Module** - Built-in architecture debugger
  - Activated with Ctrl+Shift+I
  - Visual element inspection
  - Live function tracing
  - Export reports (JSON/Markdown/HTML)

- **FunctionTracer Module** - Performance monitoring
  - Call logging with timestamps
  - Performance metrics
  - Filter by module/function
  - Export trace data

- **Browser DevTools** - Standard debugging
  - Console logging
  - Network inspection
  - DOM inspection
  - Performance profiling

### Documentation Generation
- **scripts/generate-docs.js** - Automated documentation
  - Generates guides from code
  - Updates state files
  - Creates dependency matrices

## Build System

### No Build Process
- **Zero configuration** - No webpack, rollup, or bundlers
- **No transpilation** - Direct ES6+ execution
- **No minification** - Development-friendly code
- **No package manager** - No npm/yarn dependencies

### Deployment
- **Static hosting** - Any web server or file:// protocol
- **No server required** - Pure client-side application
- **GitHub Pages ready** - Direct deployment possible

## Browser Compatibility

### Supported Browsers
- **Chrome 90+** ✅ (Primary target)
- **Firefox 88+** ✅
- **Safari 14+** ✅
- **Edge 90+** ✅

### Required Features
- ES6+ JavaScript support
- LocalStorage API
- Fetch API
- CSS Grid and Flexbox
- ContentEditable
- Clipboard API

### Not Supported
- Internet Explorer (any version)
- Legacy browsers without ES6

## Development Commands

### Running the Application

#### Option 1: Direct File Access
```bash
# Open in browser
start src/index.html
# or double-click src/index.html
```

#### Option 2: Local Server (Windows)
```bash
# Using included batch file
ЗАПУСК.bat

# Or manually
cd src
start_server.bat
```

#### Option 3: Python Server
```bash
# Python 3
cd src
python -m http.server 8000

# Python 2
cd src
python -m SimpleHTTPServer 8000
```

### Development Workflow

#### Activating Inspector
```
Press: Ctrl+Shift+I
```

#### Viewing Function Traces
```
1. Activate Inspector (Ctrl+Shift+I)
2. Click "Live Trace" tab
3. Perform actions in app
4. View real-time function calls
```

#### Exporting Reports
```
1. Activate Inspector
2. Click "Export" button
3. Choose format (JSON/Markdown/HTML)
4. Report downloads automatically
```

## Data Storage

### LocalStorage Schema
```javascript
{
  "techData": {
    "categories": [
      {
        "name": "Category Name",
        "technologies": [
          {
            "name": "Tech Name",
            "completed": false,
            "checklist": [],
            "knowledgeBase": {
              "content": "HTML content",
              "media": [],
              "links": []
            }
          }
        ]
      }
    ]
  },
  "githubAuth": {
    "token": "...",
    "owner": "...",
    "repo": "...",
    "autoSave": false
  }
}
```

### GitHub Storage Format
```json
{
  "categories": [...],
  "lastModified": "ISO timestamp",
  "version": "3.5.0"
}
```

## Performance Characteristics

### Metrics (from metrics.json)
- **Maintainability:** 85/100
- **Total Functions:** 214
- **Total Modules:** 11
- **Lines of Code:** ~5500+
- **Cyclic Dependencies:** 0
- **Unused Functions:** 0

### Performance Targets
- **Initial Load:** < 100ms
- **Accordion Render:** < 50ms
- **LocalStorage Save:** < 10ms
- **GitHub Sync:** < 2s (network dependent)
- **Inspector Activation:** < 50ms

## Security Considerations

### Data Security
- **LocalStorage** - Browser-level security
- **GitHub Token** - Stored in LocalStorage (user responsibility)
- **No server-side** - No backend vulnerabilities
- **XSS Protection** - Manual sanitization in editor

### Best Practices
- Use Personal Access Tokens with minimal scopes
- Clear LocalStorage when using shared computers
- Review content before GitHub sync
- Regular backups via export functionality

## Dependencies

### Runtime Dependencies
**None** - Zero external dependencies

### Development Dependencies
**None** - No build tools or dev dependencies

### API Dependencies
- **GitHub REST API v3** - Optional, for sync feature only
- **No CDN dependencies** - All code is local

## Version Management

### Semantic Versioning
- **Format:** MAJOR.MINOR.PATCH
- **Current:** 3.5.0
- **Tracked in:** project_registry.json, README.md

### Version History
- **3.5.0** - All phases complete, production ready
- **3.0.0** - Phase 3 complete (metrics, tracing, inspector)
- **2.0.0** - Phase 2 complete (AI optimization)
- **1.0.0** - Phase 1 complete (foundation)

## Future Technology Considerations

### Potential Additions
- **TypeScript** - Type safety (would require build process)
- **Jest** - Unit testing framework
- **ESLint** - Code quality enforcement
- **Prettier** - Code formatting
- **Webpack** - Module bundling (if needed)
- **Service Workers** - Offline functionality
- **IndexedDB** - Enhanced storage for large datasets

### Current Philosophy
- **Keep it simple** - No unnecessary complexity
- **Zero dependencies** - Maximum portability
- **Browser-native** - Use platform features
- **Developer-friendly** - Easy to understand and modify
