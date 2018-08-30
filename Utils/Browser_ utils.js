const sjo = {};
  sjo.getJSDateFromTimestamp = d3.timeParse('%d-%b-%y %I:%M:%S.%L %p UTC%Z');
  sjo.formatIntoPercentage = d3.format('.0%');
  sjo.getTextWidth = (text, font) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;
    const width = context.measureText(text).width;
    d3.select(canvas).remove()
    return width;
  };
  sjo.getTextHeight = font => {
    let num = '';
    const indexOfLastDigit = font.indexOf('pt') - 1;
    for (let i = 0; i <= indexOfLastDigit; i++){
      if (!isNaN(font[i]) || font[i] === '.') num += font[i];
    }
    num = +num;
    return num * 1.33333333333;
  };
  sjo.resetElements = (outerWidgetEl, elementsToReset) => {
		const selectionForCheck = outerWidgetEl.selectAll(elementsToReset)
		if (!selectionForCheck.empty()) selectionForCheck.remove();
  };
  sjo.formatValueToPrecision = (value, precision) => d3.format(',.' + precision + 'f')(value);
