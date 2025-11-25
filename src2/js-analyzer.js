// JS Function Analyzer для PromAi Inspector Pro v3.1
// Добавляет FUNC_ID комментарии к функциям

function analyzeJavaScript(code) {
  const functions = [];
  let counter = 1;
  
  // Regex для поиска функций
  const patterns = [
    /function\s+(\w+)\s*\(/g,                    // function name()
    /const\s+(\w+)\s*=\s*function/g,             // const name = function
    /const\s+(\w+)\s*=\s*\(/g,                   // const name = ()
    /(\w+)\s*:\s*function/g,                     // name: function
    /(\w+)\s*\([^)]*\)\s*{/g,                    // name() { (метод)
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(code)) !== null) {
      const funcName = match[1];
      if (funcName && !functions.find(f => f.name === funcName)) {
        functions.push({
          name: funcName,
          funcId: `FUNC_${funcName}_${String(counter).padStart(3, '0')}`,
          position: match.index
        });
        counter++;
      }
    }
  });
  
  return functions;
}

function addFuncIdComments(code) {
  const functions = analyzeJavaScript(code);
  let result = code;
  let offset = 0;
  
  // Сортируем по позиции (от конца к началу)
  functions.sort((a, b) => b.position - a.position);
  
  functions.forEach(func => {
    const comment = `// ${func.funcId}\n`;
    const pos = func.position;
    result = result.slice(0, pos) + comment + result.slice(pos);
  });
  
  return { code: result, functions };
}

// Экспорт для использования в расширении
if (typeof module !== 'undefined') {
  module.exports = { analyzeJavaScript, addFuncIdComments };
}
