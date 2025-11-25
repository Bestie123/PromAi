document.getElementById('activateInspector').addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const event = new KeyboardEvent('keydown', { key: 'F2', bubbles: true, cancelable: true });
        document.dispatchEvent(event);
      }
    });
  } catch (error) {
    console.error('Error:', error);
  }
});

document.getElementById('makeReady').addEventListener('click', async () => {
  const status = document.getElementById('status');
  status.style.display = 'block';
  status.className = 'info';
  status.textContent = '⏳ Processing...';

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      func: processPage
    });

    const stats = result.reduce((acc, r) => ({
      elements: acc.elements + (r.result?.elements || 0),
      functions: acc.functions + (r.result?.functions || 0)
    }), { elements: 0, functions: 0 });
    
    status.className = 'success';
    status.textContent = `✅ Success! ${stats.elements} elements, ${stats.functions} functions across ${result.length} frame(s)`;
  } catch (error) {
    status.className = 'error';
    status.textContent = `❌ Error: ${error.message}`;
  }
});

function processPage() {
  // Helper function for JS analysis
  function analyzeJS(code) {
    const functions = [];
    const patterns = [
      /function\s+(\w+)\s*\(/g,
      /const\s+(\w+)\s*=\s*function/g,
      /const\s+(\w+)\s*=\s*\(/g,
      /(\w+)\s*:\s*function/g
    ];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(code)) !== null) {
        const name = match[1];
        if (name && !functions.includes(name)) {
          functions.push(name);
        }
      }
    });
    
    return functions;
  }

  let compCounter = parseInt(localStorage.getItem('promai_comp_counter') || '10000');
  let funcCounter = parseInt(localStorage.getItem('promai_func_counter') || '1');
  let elementsProcessed = 0;
  let functionsProcessed = 0;

  // 1. Process DOM elements
  const elements = document.querySelectorAll('*:not(script):not(style):not(noscript)');
  elements.forEach(el => {
    if (el.offsetParent !== null || el.tagName === 'BODY' || el.tagName === 'HTML') {
      if (!el.hasAttribute('data-component-id')) {
        el.setAttribute('data-component-id', `COMP_${compCounter++}`);
        elementsProcessed++;
      }
    }
  });

  // 2. Process JavaScript functions
  const scripts = document.querySelectorAll('script:not([src])');
  scripts.forEach(script => {
    if (!script.hasAttribute('data-module-id')) {
      script.setAttribute('data-module-id', 'M_AUTO_1.0');
    }
    
    const code = script.textContent;
    const functions = analyzeJS(code);
    functionsProcessed += functions.length;
    
    // Add runtime properties
    functions.forEach(func => {
      if (window[func]) {
        window[func].__funcId = `FUNC_${func}_${String(funcCounter++).padStart(3, '0')}`;
      }
    });
  });

  // 3. Save counters
  localStorage.setItem('promai_comp_counter', compCounter.toString());
  localStorage.setItem('promai_func_counter', funcCounter.toString());
  
  return { elements: elementsProcessed, functions: functionsProcessed };
}
