const resetElements = (outerWidgetEl, elementsToReset) => {
  const selectionForCheck = outerWidgetEl.selectAll(elementsToReset)
  if (!selectionForCheck.empty()) selectionForCheck.remove();
};

const getTextWidth = (text, font) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = font;
  const width = context.measureText(text).width;
  d3.select(canvas).remove()
  return width;
};
const getTextHeight = font => {
  let num = '';
  const indexOfLastDigit = font.indexOf('pt') - 1;
  for(let i = 0; i <= indexOfLastDigit; i++){
    if(!isNaN(font[i]) || font[i] === '.') num += font[i];
  }
  num = +num;
  return num * 1.33333333333;
};
const formatValueToPrecision = (value, precision) => d3.format(',.' + precision + 'f')(value);

class MeterTooltip {
	constructor(meter, elementToAppendTo) {
    this.meter = meter;
    this.margin = 7;
    this.minRightOfLabel = 8;
    this.rightOfNum = 3;
    this.verticalPadding = 3;
    this.rightOfTitle = 10;
    this.calculateCalculatedProps();
    this.element = elementToAppendTo.append('g')
      .attr('class', 'tooltipGroup')
      .style('display', 'none');
  }

  calculateCalculatedProps() {
    this.height = (this.margin * 3) + ( getTextHeight(this.meter.titleFont) * (this.meter.isDesignVal ? 3 : 2) ) + ( this.verticalPadding * (this.meter.isDesignVal ? 2 : 1) );
    this.width = (this.margin * 2) + getTextWidth(this.meter.title, 'bold ' + this.meter.titleFont) + this.rightOfTitle + getTextWidth(this.meter.isDesignVal ? 'Design:' : 'Max:', this.meter.titleFont) + this.minRightOfLabel + this.meter.greatestNumWidth + this.rightOfNum + getTextWidth(this.meter.units, this.meter.unitsFont);
  }

  create(areNewArgs) {
    
    //if there's a change, recalculate height and width
    if (areNewArgs) this.calculateCalculatedProps();

    //rect
    this.element.append('rect')
      .attr('fill', this.meter.backgroundBarColor)
      .attr('stroke', 'none')
      .attr('height', this.height)
      .attr('width', this.width)
      .attr('rx', 5)
      .attr('ry', 5);
    const textGroup = this.element.append('g')
      .attr('class', 'textGroup')
      .attr('transform', `translate(${this.margin}, ${this.margin})`);
    //title
    textGroup.append('text')
      .text(this.meter.title)
      .style('font', 'bold ' + this.meter.titleFont)
      .attr('y', getTextHeight('bold ' + this.meter.titleFont))
    
    const row1 = textGroup.append('g')
      .attr('class', 'labelsColumn')
      .attr('transform', `translate(0, ${getTextHeight(this.meter.numFont)})`);
    const row2 = textGroup.append('g')
      .attr('class', 'numsColumn')
      .attr('transform', `translate(0, ${( getTextHeight(this.meter.numFont) * 2 ) + this.verticalPadding})`);
    const row3 = !this.meter.isDesignVal ? undefined : textGroup.append('g')
      .attr('class', 'unitsColumn')
      .attr('transform', `translate(0, ${( getTextHeight(this.meter.numFont) * 3 ) + (this.verticalPadding * 2)})`);

    const labelsColumnX = getTextWidth(this.meter.title, 'bold ' + this.meter.titleFont) + this.rightOfTitle;
    const numsColumnX = getTextWidth(this.meter.title, 'bold ' + this.meter.titleFont) + this.rightOfTitle + getTextWidth(this.meter.isDesignVal ? 'Design:' : 'Max:', this.meter.titleFont) + this.minRightOfLabel;

    //Min Label
    row1.append('text')
      .text('Min:')
      .style('font', this.meter.titleFont)
      .attr('x', labelsColumnX);
    //Min Val
    row1.append('text')
      .text(formatValueToPrecision(this.meter.minVal, this.meter.precision))
      .style('font', this.meter.numFont)
      .attr('x', numsColumnX);
    //Min Units
    row1.append('text')
      .text(this.meter.units)
      .style('font', this.meter.unitsFont)
      .attr('x', numsColumnX + getTextWidth(formatValueToPrecision(this.meter.minVal, this.meter.precision), this.meter.numFont) + this.rightOfNum);

    if (this.meter.isDesignVal) {
      //Design Label
      row2.append('text')
        .text('Design:')
        .style('font', this.meter.titleFont)
        .attr('x', labelsColumnX)
      //Design Val
      row2.append('text')
        .text(formatValueToPrecision(this.meter.designVal, this.meter.precision))
        .style('font', this.meter.numFont)
        .attr('x', numsColumnX)
      //Design Units
      row2.append('text')
        .text(this.meter.units)
        .style('font', this.meter.unitsFont)
        .attr('x', numsColumnX + getTextWidth(formatValueToPrecision(this.meter.designVal, this.meter.precision), this.meter.numFont) + this.rightOfNum);

      //Max Label
      row3.append('text')
        .text('Max:')
        .style('font', this.meter.titleFont)
        .attr('x', labelsColumnX);
      //Max Val
      row3.append('text')
        .text(formatValueToPrecision(this.meter.maxVal, this.meter.precision))
        .style('font', this.meter.numFont)
        .attr('x', numsColumnX);
      //Max Units
      row3.append('text')
        .text(this.meter.units)
        .style('font', this.meter.unitsFont)
        .attr('x', numsColumnX + getTextWidth(formatValueToPrecision(this.meter.maxVal, this.meter.precision), this.meter.numFont) + this.rightOfNum);
    } else {
      //Max Label
      row2.append('text')
        .text('Max:')
        .style('font', this.meter.titleFont)
        .attr('x', labelsColumnX);
      //Max Val
      row2.append('text')
        .text(formatValueToPrecision(this.meter.maxVal, this.meter.precision))
        .style('font', this.meter.numFont)
        .attr('x', numsColumnX);
      //Max Units
      row2.append('text')
        .text(this.meter.units)
        .style('font', this.meter.unitsFont)
        .attr('x', numsColumnX + getTextWidth(formatValueToPrecision(this.meter.maxVal, this.meter.precision), this.meter.numFont) + this.rightOfNum);
    }


  }

	show() {
    this.element.style('display', 'block')
  }

  hide() {
    this.element.style('display', 'none')
  }

}