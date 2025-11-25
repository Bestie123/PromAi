// Content script for iframe communication
(function() {
  let compCounter = parseInt(localStorage.getItem('promai_comp_counter') || '10000');
  let funcCounter = parseInt(localStorage.getItem('promai_func_counter') || '1');

  // Listen for messages from parent frame
  window.addEventListener('message', (event) => {
    if (event.data.type === 'PROMAI_PROCESS') {
      const result = processCurrentFrame(event.data.compCounter, event.data.funcCounter);
      
      // Send result back to parent
      event.source.postMessage({
        type: 'PROMAI_RESULT',
        elements: result.elements,
        functions: result.functions,
        nextCompCounter: result.nextCompCounter,
        nextFuncCounter: result.nextFuncCounter
      }, '*');
    }
  });

  // Process iframes in current frame
  function processAllFrames(compStart, funcStart) {
    let compCounter = compStart;
    let funcCounter = funcStart;
    let totalElements = 0;
    let totalFunctions = 0;

    // Process current frame
    const result = processCurrentFrame(compCounter, funcCounter);
    totalElements += result.elements;
    totalFunctions += result.functions;
    compCounter = result.nextCompCounter;
    funcCounter = result.nextFuncCounter;

    // Process all iframes
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      try {
        // Try same-origin first
        if (iframe.contentWindow && iframe.contentWindow.document) {
          const iframeResult = processFrameDocument(iframe.contentWindow.document, compCounter, funcCounter);
          totalElements += iframeResult.elements;
          totalFunctions += iframeResult.functions;
          compCounter = iframeResult.nextCompCounter;
          funcCounter = iframeResult.nextFuncCounter;
        }
      } catch (e) {
        // Cross-origin iframe - use postMessage
        iframe.contentWindow.postMessage({
          type: 'PROMAI_PROCESS',
          compCounter: compCounter,
          funcCounter: funcCounter
        }, '*');
      }
    });

    return { elements: totalElements, functions: totalFunctions, nextCompCounter: compCounter, nextFuncCounter: funcCounter };
  }

  function processCurrentFrame(compStart, funcStart) {
    let compCounter = compStart || parseInt(localStorage.getItem('promai_comp_counter') || '10000');
    let funcCounter = funcStart || parseInt(localStorage.getItem('promai_func_counter') || '1');
    let elementsProcessed = 0;
    let functionsProcessed = 0;

    // Process DOM elements
    const elements = document.querySelectorAll('*:not(script):not(style):not(noscript)');
    elements.forEach(el => {
      if (el.offsetParent !== null || el.tagName === 'BODY' || el.tagName === 'HTML') {
        if (!el.hasAttribute('data-component-id')) {
          el.setAttribute('data-component-id', `COMP_${compCounter++}`);
          elementsProcessed++;
        }
      }
    });

    // Process JavaScript functions
    const scripts = document.querySelectorAll('script:not([src])');
    scripts.forEach(script => {
      if (!script.hasAttribute('data-module-id')) {
        script.setAttribute('data-module-id', 'M_AUTO_1.0');
      }
      
      const code = script.textContent;
      const functions = analyzeJS(code);
      functionsProcessed += functions.length;
      
      functions.forEach(func => {
        if (window[func]) {
          window[func].__funcId = `FUNC_${func}_${String(funcCounter++).padStart(3, '0')}`;
        }
      });
    });

    localStorage.setItem('promai_comp_counter', compCounter.toString());
    localStorage.setItem('promai_func_counter', funcCounter.toString());
    
    return { elements: elementsProcessed, functions: functionsProcessed, nextCompCounter: compCounter, nextFuncCounter: funcCounter };
  }

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

  function processFrameDocument(doc, compStart, funcStart) {
    let compCounter = compStart;
    let funcCounter = funcStart;
    let elementsProcessed = 0;
    let functionsProcessed = 0;

    // Process DOM elements
    const elements = doc.querySelectorAll('*:not(script):not(style):not(noscript)');
    elements.forEach(el => {
      if (el.offsetParent !== null || el.tagName === 'BODY' || el.tagName === 'HTML') {
        if (!el.hasAttribute('data-component-id')) {
          el.setAttribute('data-component-id', `COMP_${compCounter++}`);
          elementsProcessed++;
        }
      }
    });

    // Process JavaScript functions
    const scripts = doc.querySelectorAll('script:not([src])');
    scripts.forEach(script => {
      const code = script.textContent;
      const functions = analyzeJS(code);
      functionsProcessed += functions.length;
    });

    return { elements: elementsProcessed, functions: functionsProcessed, nextCompCounter: compCounter, nextFuncCounter: funcCounter };
  }

  // Expose for popup.js
  if (window === window.top) {
    window.promaiProcessAll = processAllFrames;
  }
})();
