
class Gauge {
	constructor(elementToAppendGaugeTo, gaugeVal, height = 200, width = 200, minVal = 600, timer = true) {
    this.height = height;
    this.width = width;
		this.gaugeVal = gaugeVal;
    this.previousGaugeVal = gaugeVal;
    this.margin = 5;
    this.backgroundArcColor = '#e0ebeb';
    this.startAngle = -Math.PI;
    this.endAngle = Math.PI;
    this.gaugeArcThickness = 18;
    this.titleFont = '12.0pt Nirmala UI';
    this.minVal = minVal //secondsCountingFrom if timer;
    this.maxVal = 0;
    this.timer = timer;




    this.calculateCalculatedProps();
    this.element = elementToAppendGaugeTo.append('g')
      .attr('class', 'gaugeElement')
      .attr('transform', `translate(${this.margin}, ${this.margin})`);
	}

	create() {

    const chartGroup = this.element.append('g')
      .attr('class', 'chartGroup')
      .attr('transform', `translate(${this.cx}, ${this.cy})`);

    //backgroundPath
    chartGroup.append('path')
      .attr('class', 'backgroundPath')
      .attr('d', this.backgroundArcGenerator())
      .attr('fill', this.backgroundArcColor);

    //gaugeArc
    chartGroup.append('path')
      .attr('class', 'gaugeArc')
      .datum({ endAngle: this.angleScale(this.previousGaugeVal) })
      // fill nominal color for non-efficiency gauge or 3 color scale for efficiency gauge. Starts with min val color prior to transition
      .attr('fill', this.timer ? this.colorScale(this.previousGaugeVal) : '#00cc66')
      .attr('d', this.gaugeArcGenerator(this.angleScale(this.previousGaugeVal)))
      .transition()
        .duration(1000)
        // if efficiency graph, transition from min val scale color to actual val's scale color
        .attr('fill', this.timer ? this.colorScale(this.gaugeVal) : '#00cc66')
        // gradually transition end angle from minValForArc to true val angle
        .attrTween('d', this.arcTween(this.angleScale(this.gaugeVal)));

    //title1
    chartGroup.append("text")
      .attr('dominant-baseline', 'text-after-edge')
      .style("text-anchor", "middle")
      .attr('y', -(30))
      .style('font', this.titleFont)
      .text('On');

    //title2
    chartGroup.append("text")
      .attr('dominant-baseline', 'text-after-edge')
      .style("text-anchor", "middle")
      .attr('y', -(10))
      .style('font', this.titleFont)
      .text('Efficiency');


    return this.element;
  }
  
  delete() {
    this.element.remove();
  }

  calculateCalculatedProps() {
    this.gaugeArcOuterRadius = this.height < this.width ? (this.height / 2) - 5 : (this.width / 2) - 5;
    this.gaugeArcInnerRadius = this.gaugeArcOuterRadius - this.gaugeArcThickness;
    this.cx = this.width / 2;
    this.cy = this.height / 2;
    this.backgroundArcGenerator = d3.arc()
      .startAngle(this.startAngle)
      .endAngle(this.endAngle)
      .innerRadius(this.gaugeArcInnerRadius)
      .outerRadius(this.gaugeArcOuterRadius);
    // returns scaling func that returns angle in radians for a value
    this.angleScale = d3.scaleLinear()
      .domain([this.minVal, this.maxVal])
      .range([this.startAngle, this.endAngle]);
    // func returns which color arc fill should be based on curr val, efficiency thresholds, and selected arc colors for up to baseline, up to target, & nominal vals
		this.colorScale = currentValue => {
			if (currentValue >= this.minVal * 0.66) return '#cc3300';
			if (currentValue >= this.minVal * 0.33) return '#ffcc00';
			return '#00cc66';
    };
    // Arc Generators return d values for paths
    this.gaugeArcGenerator = d3.arc()
      .startAngle(this.startAngle)
      .innerRadius(this.gaugeArcInnerRadius)
      .outerRadius(this.gaugeArcOuterRadius)
      .cornerRadius('10'); // round edges of path

    /* func that returns func that returns return val of gaugeArcGenerator invoked on data with
    'end angle' property of interpolated start & end end angles for drawing arc transition */
    this.arcTween = newAngle => datum => t => {
      datum.endAngle = d3.interpolate(datum.endAngle, newAngle)(t);
      return this.gaugeArcGenerator(datum);
};
  }

  //  {paramName: newArg, paramName: newArg, paramName: newArg}
  redrawWithNewArgs(newArgsObj) {
    const that = this;
    resetElements(that.element, '*');
    that.previousGaugeVal = that.gaugeVal;
    let count = 0;
    for (let param in newArgsObj) {
      if (newArgsObj.hasOwnProperty(param)) {
        that[param] = newArgsObj[param];
        count++;
      }
    }
    // if more than one property has changed (thus properties other than gaugeVal have changed), don't use previous value
    if (count > 1) {
      that.previousGaugeVal = that.gaugeVal
    }
    that.calculateCalculatedProps();
    that.create();
  }

}