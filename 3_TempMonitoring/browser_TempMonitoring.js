/* global sjo */
function defineFuncForTabSpacing () {

	////////// Hard Coded Defs //////////
	const arePrimitiveValsInObjsSame = (obj1, obj2) => !Object.keys(obj1).some(key => (obj1[key] === null || (typeof obj1[key] !== 'object' && typeof obj1[key] !== 'function')) && obj1[key] !== obj2[key])
	const isDataNotEquivalent = (lastData, newData, dataName) => {
		if (lastData[dataName].length !== newData[dataName].length) return true;
		const somethingIsNotEquivalent = lastData[dataName].some((lastDatum, index) => {
			const newDatum = newData[dataName][index]
			if (lastDatum.time.getTime() !== newDatum.time.getTime() || lastDatum.value !== newDatum.value) return true;
			return false;
		});
		return somethingIsNotEquivalent;
	};
	const needToRedrawWidget = (widget, newData) => {
		const lastData = widget.data;
		// check primitives for equivalence
		if (!arePrimitiveValsInObjsSame(lastData, newData)) return true;
		// check nested arrays/objs for equivalence
		if (isDataNotEquivalent(lastData, newData, 'CHWSupplyTrendData') || isDataNotEquivalent(lastData, newData, 'CHWSetpointTrendData') || isDataNotEquivalent(lastData, newData, 'CHWSequenceTrendData') || isDataNotEquivalent(lastData, newData, 'CDWSupplyTrendData') || isDataNotEquivalent(lastData, newData, 'CDWSetpointTrendData')) return true;
		//return false if nothing prompted true
		return false;
	};
	const margin = 5;
	const timeFormat = live => d3.timeFormat(live ? '%I:%M' : '%I:%M %p');
	const formatTimeForClass = time => 'time' + d3.timeFormat('%I%M%p')(time);
	// const averageHoursInData = dayDataArr => {
	// 	const newDataArr = [];
	// 	let currentHourIndex = dayDataArr.length - 1;
	// 	for (let count = 0; count < 24; count++) {
	// 		let nextHourIndex = currentHourIndex - 60;
	// 		const currentHourObject = dayDataArr[currentHourIndex];
	// 		const sumOfHourData = dayDataArr.slice(nextHourIndex + 1, currentHourIndex + 1).reduce((accum, curr) => accum + curr.value, 0);
	// 		const objToInsert = {time: currentHourObject.time, value: sumOfHourData / 60};
	// 		newDataArr.unshift(objToInsert);
	// 		currentHourIndex -= 60;
	// 	}
	// 	return newDataArr;
	// }







	////////////////////////////////////////////////////////////////
		// Define Widget Constructor & Exposed Properties
	////////////////////////////////////////////////////////////////
	const properties = [
		/* TREND COLORS */
		{
			name: 'measuredCHWTrendColor',
			value: 'rgb(105,202,210)',
			typeSpec: 'gx:Color'
		},
		{
			name: 'setpointCHWTrendColor',
			value: 'rgb(252, 181, 80)',
			typeSpec: 'gx:Color'
		},
		{
			name: 'sequenceCHWTrendColor',
			value: 'rgb(66,88,103)',
			typeSpec: 'gx:Color'
		},
		{
			name: 'measuredCDWTrendColor',
			value: '#fcb550',
			typeSpec: 'gx:Color'
		},
		{
			name: 'setpointCDWTrendColor',
			value: '#d55d3b',
			typeSpec: 'gx:Color'
		},
		/* FONT SIZES */
		{
			name: 'titleFont',
			value: 'bold 14.0pt Nirmala UI',
			typeSpec: 'gx:Font'
		},
		{
			name: 'tooltipTitleFont',
			value: 'bold 11.0pt Nirmala UI',
			typeSpec: 'gx:Font'
		},
		{
			name: 'tooltipFont',
			value: '10.0pt Nirmala UI',
			typeSpec: 'gx:Font'
		},
		{
			name: 'labelFont',
			value: 'bold 9.0pt Nirmala UI',
			typeSpec: 'gx:Font'
		},
		{
			name: 'legendFont',
			value: '9.0pt Nirmala UI',
			typeSpec: 'gx:Font'
		},
		{
			name: 'tickFont',
			value: '10.0pt Nirmala UI',
			typeSpec: 'gx:Font'
		},
		/* OTHER */
		{
			name: 'overridePrecisionWFacets',
			value: 'false'
		},
		{
			name: 'overrideUnitsWFacets',
			value: 'false'
		},
		{
			name: 'backgroundColor',
			value: 'rgb(245,245,245)',
			typeSpec: 'gx:Color'
		},
		{
			name: 'tooltipColor',
			value: 'rgb(255,255,255)',
			typeSpec: 'gx:Color'
		},
		{
			name: 'textColor',
			value: 'black',
			typeSpec: 'gx:Color'
		}
	];



	////////////////////////////////////////////////////////////////
		// /* SETUP DEFINITIONS AND DATA */
	////////////////////////////////////////////////////////////////
	const setupDefinitions = widget => {
		// FROM USER // 
		const data = {};
		properties.forEach(prop => data[prop.name] = prop.value);

		// FROM JQ //
		data.jqHeight = 340;
		data.jqWidth = 785;


		// GLOBALS PER INSTANCE //
		if (!widget.waterSupplyTempType) widget.waterSupplyTempType = 'CHW' // CHW or CDW (Chilled Water Supply or Condenser Water Supply)
		if (!widget.timeView) widget.timeView = 'live' // live or day
		// Live displays last 10 min in 1 min intervals
		// 24 Hours displays last 24 hrs in 1 min intervals
		if (!widget.MSCHWHidden) widget.MSCHWHidden = false;
		if (!widget.SPCHWHidden) widget.SPCHWHidden = false;
		if (!widget.SQCHWHidden) widget.SQCHWHidden = false;
		if (!widget.MSCDWHidden) widget.MSCDWHidden = false;
		if (!widget.SPCDWHidden) widget.SPCDWHidden = false;
		if (!widget.hoveredDatum) widget.hoveredDatum = 'none';	// else data object by time (see hoverable rects section for details)
		if (!widget.pinned) widget.pinned = 'none'; // else same d as hoveredDatum;


		// DATA TO POPULATE //
		data.precision = 1;
		data.units = '°F';
		//CHW Trends
		data.CHWSupplyTrendData = [];
		data.CHWSetpointTrendData = [];
		data.CHWSequenceTrendData = [];
		//CDW Trends
		data.CDWSupplyTrendData = [];
		data.CDWSetpointTrendData = [];



		// FAKE DATA //
		const populateFakeData = () => {
			const batchResolveTrends = ['history:^System_ChwSupply', 'history:^System_ChwSupplySp', 'history:^System_ChwSupplySq', 'history:^System_CdwSupply', 'history:^System_CdwSupplySp'];
			batchResolveTrends.forEach(trend => {
				//in Niagara get minutely data for 24 hrs
				// create objs with timestamp and value data to look like:

				// {time: new JS date/time, value: 44}

				//in Niagara, collect precision and change if overridePrecisionWFacets true
				//in Niagara, collect units and change if overrideUnitsWFacets true

			});
			function fillFakeArray(min, max, arrayToFill){
				for (let i = 0; i <=1439; i++) {
					let now = new Date();
					now.setMinutes(now.getMinutes() - i);
					arrayToFill.unshift({time: now, value: (Math.random() * (max - min)) + min});
				}
			}
			//CHW Trends
			fillFakeArray(41, 44.5, data.CHWSupplyTrendData);
			fillFakeArray(42, 42, data.CHWSetpointTrendData);
			fillFakeArray(44.5, 44.5, data.CHWSequenceTrendData);
			//CDW Trends
			fillFakeArray(41, 44.5, data.CDWSupplyTrendData);
			fillFakeArray(42, 42, data.CDWSetpointTrendData);

		};



		// CALCULATED DEFS //
		const calculateDefs = () => {







			return data;
		};

		populateFakeData();
		return calculateDefs();
	};
		




	////////////////////////////////////////////////////////////////
		// RenderWidget Func
	////////////////////////////////////////////////////////////////

	const renderWidget = (widget, data) => {
		// ********************************************* Additional Definitions ******************************************************* //
		const CHWTrendData = [
			{ type: 'MS', legendName: 'Measured', liveData: data.CHWSupplyTrendData.slice(1430), dayData: data.CHWSupplyTrendData, color: data.measuredCHWTrendColor },
			{ type: 'SP', legendName: 'Setpoint', liveData: data.CHWSetpointTrendData.slice(1430), dayData: data.CHWSetpointTrendData, color: data.setpointCHWTrendColor },
			{ type: 'SQ', legendName: 'Sequence', liveData: data.CHWSequenceTrendData.slice(1430), dayData: data.CHWSequenceTrendData, color: data.sequenceCHWTrendColor }
		];
		const CDWTrendData = [
			{ type: 'MS', legendName: 'Measured', liveData: data.CDWSupplyTrendData.slice(1430), dayData: data.CDWSupplyTrendData, color: data.measuredCDWTrendColor },
			{ type: 'SP', legendName: 'Setpoint', liveData: data.CDWSetpointTrendData.slice(1430), dayData: data.CDWSetpointTrendData, color: data.setpointCDWTrendColor }
		];
		const CHWLegendCategories = ['measured', 'setpoint', 'sequence'];
		const CDWLegendCategories = ['measured', 'setpoint'];

		// SIZES
			//horizontal
		const graphicWidth = data.jqWidth - (margin * 2);
		const chartHorizontalMargins = margin * 8;
		const tickSize = 5
		const spaceLeftOfTick = 5;
		const chartWidth = graphicWidth - (chartHorizontalMargins * 2);
		const radioButtonSize = 12;
		const legendCircleSize = 9;
		const maxTitleWidth = sjo.getTextWidth('Condenser Water Supply', data.titleFont);

		const tooltipMargin = 3;
		const highestValue = [...data.CHWSupplyTrendData, ...data.CHWSetpointTrendData, ...data.CHWSequenceTrendData, ...data.CDWSupplyTrendData, ...data.CDWSetpointTrendData].reduce((accum, curr) => accum > curr.value ? accum : curr.value, 0)
		const tooltipCategoryWidth = sjo.getTextWidth('SQ:', 'bold ' + data.tooltipFont);
		const maxTooltipValueWidth = sjo.getTextWidth(sjo.formatValueToPrecision(highestValue, data.precision) + ' ' + data.units, data.tooltipFont);
		const spaceRightOfTooltipCategory = sjo.getTextWidth('W', 'bold ' + data.tooltipFont);
		const tooltipWidth = tooltipCategoryWidth + maxTooltipValueWidth + (tooltipMargin * 2) + spaceRightOfTooltipCategory;

		const radioButtonMargin = 3;
		const spaceBetweenRadioSelections = sjo.getTextWidth('W', data.legendFont)
		const tempsHeaderWidth = (radioButtonSize * 2) + sjo.getTextWidth('CHW', data.legendFont) + spaceBetweenRadioSelections + sjo.getTextWidth('CDW', data.legendFont);
		const viewHeaderWidth = (radioButtonSize * 2) + sjo.getTextWidth('Live', data.legendFont) + spaceBetweenRadioSelections + sjo.getTextWidth('24 Hours', data.legendFont);
		const legendWidth = legendCircleSize + radioButtonMargin + sjo.getTextWidth('Measured', data.legendFont);

		const spaceBetweenHeaders = ( graphicWidth - (chartHorizontalMargins + maxTitleWidth + tooltipWidth + tempsHeaderWidth + viewHeaderWidth + legendWidth) ) / 4;

			//vertical
		const graphicHeight = data.jqHeight - (margin * 2);
		const titleHeight = sjo.getTextHeight(data.titleFont)
		const legendTextHeight = sjo.getTextHeight(data.legendFont);
		const spaceUnderLabels = 8;

		const tooltipTimeHeight = sjo.getTextHeight(data.tooltipTitleFont);
		const tooltipCategoryHeight = sjo.getTextHeight('bold ' + data.tooltipFont);
		const paddingBetweenTooltipCategories = 5;
		const paddingUnderTooltipTime = paddingBetweenTooltipCategories * 1.25;
		const tooltipHeight = tooltipTimeHeight + (tooltipCategoryHeight * 3) + (paddingBetweenTooltipCategories * 2) + paddingUnderTooltipTime + (tooltipMargin * 2);
		
		const xAxisTicksHeight = tooltipHeight / 1.5;
		const chartHeight = graphicHeight - (tooltipHeight + xAxisTicksHeight);
		const pathStrokeWidth = 2.5;
	

		// COLORS
		const unselectedRadioButton = '#C0C0C0';
		const CHWRadioButtonColor = '#3fa9f5';
		const CDWRadioButtonColor = '#E4b550';
		const viewRadioButtonColor = '#22b573';
		const gridColor = '#D3D3D3';



		// TICKS
		//always 5 ticks, whole numbers, with at least a half degree buffer between top and bottom
		function getYTickValues() {
			const valsToDisplay = [];
			const trendData = widget.waterSupplyTempType === 'CHW' ? CHWTrendData : CDWTrendData;
			trendData.forEach(category => {
				const catData = category[widget.timeView + 'Data'];
				catData.forEach(time => {
					valsToDisplay.push(time.value);
				});
			});
			const highestVal = d3.max(valsToDisplay);
			const lowestVal = d3.min(valsToDisplay);
			const highestValCeil = Math.ceil(highestVal);
			const lowestValFloor = Math.floor(lowestVal)
			const highestValDecimals = highestVal % 1;
			const lowestValDecimals = lowestVal - lowestValFloor;
			const highestTickVal = highestValDecimals > 0.5 ? highestValCeil + 1 : highestValCeil;
			const lowestTickVal = lowestValDecimals < 0.5 ? lowestValFloor - 1 : lowestValFloor;
			const range = highestTickVal - lowestTickVal;
			if (range <= 4) return [highestTickVal - 4, highestTickVal - 3, highestTickVal - 2, highestTickVal - 1, highestTickVal];
			const interval = range % 4 === 0 ? range / 4 : Math.ceil(range / 4);
			return [highestTickVal - (interval * 4), highestTickVal - (interval * 3), highestTickVal - (interval * 2), highestTickVal - interval, highestTickVal];
		}

		const yTickValues = getYTickValues();

		function getXTickValues() {
			let times = widget.waterSupplyTempType === 'CHW' ? CHWTrendData[0][widget.timeView + 'Data'].map(datum => datum.time) : CDWTrendData[0][widget.timeView + 'Data'].map(datum => datum.time);
			if (widget.timeView === 'day') {
				let dayTimes = [];
				const lastIndex = times.length - 1;
				let index = 0;
				for (let count = 0; count < 12; count++) {
					dayTimes.unshift(times[lastIndex - index]);
					index += 120;
				}
				return dayTimes;
			}
			// if (widget.timeView === 'day') {
			// 	let dayTimes = [];
			// 	const lastIndex = times.length - 1;
			// 	let index = 0;
			// 	for (let count = 0; count < 12; count++) {
			// 		dayTimes.unshift(times[lastIndex - index]);
			// 		index += 2;
			// 	}
			// 	return dayTimes;
			// }
			return times;
		}
		const xTickValues = getXTickValues();


		// SCALING FUNCS	
		const getTimeScale = () => {
			const data = widget.waterSupplyTempType === 'CHW' ? CHWTrendData[0][widget.timeView + 'Data'] : CDWTrendData[0][widget.timeView + 'Data'];
			const first = data[0].time;
			const last = data[data.length - 1].time;
			return d3.scaleTime()
				.domain([first, last])
				.range([0, chartWidth]);
		}
		const xScale = getTimeScale();

		const yScale = d3.scaleLinear() 
			.domain([yTickValues[0], yTickValues[4]]) //can be whatever you want the axis to cover
			.range([chartHeight, 0]);

		
		// GENERATORS
		const yAxisGenerator = d3.axisLeft(yScale)
			.tickValues(yTickValues) 
			.tickSize(tickSize)
			.tickFormat(Math.round)

		const xAxisGenerator = d3.axisBottom( xScale )
			.tickFormat(timeFormat(widget.timeView === 'live'))
			.tickSizeOuter(0)
			.tickValues(xTickValues)



		const topBorderPathGenerator = d3.line()
			.x(d => xScale(d.time))
			.y(d => yScale(d.value))
			.curve(d3.curveCardinal);

		const areaPathGenerator = d3.area()
			.x(d => xScale(d.time))
			.y0(chartHeight) //bottom line of area ( where x axis would go for most area charts)
			.y1(d => yScale(d.value)) //top line of area (we'd take d off of the height because y works upside down by default if we did this w/o scale)
			.curve(d3.curveCardinal)


			







		// ********************************************* DRAW ******************************************************* //
		widget.outerDiv 
			.style('height', data.jqHeight + 'px')	//only for browser
			.style('width', data.jqWidth + 'px')		//only for browser

		widget.svg 
			.attr('height', data.jqHeight + 'px')
			.attr('width', data.jqWidth + 'px')
			
		d3.select(widget.svg.node().parentNode).style('background-color', data.backgroundColor);
		
		// delete leftover elements from versions previously rendered
		if (!widget.svg.empty()) sjo.resetElements(widget.svg, '*');

		// ********************************************* GRAPHIC GROUP ******************************************************* //

		const graphicGroup = widget.svg.append('g').attr('class', 'graphicGroup').attr('transform', `translate(${margin},${margin})`);
		graphicGroup.append('rect')
			.attr('height', graphicHeight)
			.attr('width', graphicWidth)
			.attr('fill', data.backgroundColor)
			.on('click', resetPins);

		// ********************************************* HEADER GROUP ******************************************************* //
		const headerGroup = graphicGroup.append('g').attr('class', 'headerGroup')
		headerGroup.append('text')
			.attr('fill', data.textColor)
			.style('font', data.titleFont)
			.attr('y', titleHeight)
			.text(widget.waterSupplyTempType === 'CHW' ? 'Chilled Water Supply' : 'Condenser Water Supply')





			



		// ********************************************* TOOLTIP GROUP ******************************************************* //		

		//tooltip group
		const tooltipGroup = headerGroup.append('g')
			.attr('class', 'tooltipGroup')
			.attr('transform', `translate(${maxTitleWidth + spaceBetweenHeaders}, 0)`)
		function drawTooltip () {
			sjo.resetElements(tooltipGroup, '*');
			//tooltip rect
			tooltipGroup.append('rect')
				.attr('fill', data.tooltipColor)
				.attr('rx', 5)
				.attr('ry', 5)
				.attr('height', tooltipHeight)
				.attr('width', tooltipWidth)
			//tooltip time
			tooltipGroup.append('text')
				.attr('fill', data.textColor)
				.style('font', data.tooltipTitleFont)
				.attr('x', tooltipMargin)
				.attr('y', tooltipMargin + tooltipTimeHeight)
				.text((d, i) => timeFormat(widget.timeView === 'live')(widget.hoveredDatum.time));
			//tooltip text groups
			const textGroups = tooltipGroup.selectAll('.textGroup')
				.data(widget.waterSupplyTempType === 'CHW' ? CHWLegendCategories : CDWLegendCategories)
				.enter().append('g')
					.attr('class', d => `textGroup ${d}TextGroup ${d}`)
					.attr('transform', (d, i) => `translate(${tooltipMargin}, ${tooltipMargin + tooltipTimeHeight + paddingUnderTooltipTime + (tooltipCategoryHeight * (i + 1)) + (paddingBetweenTooltipCategories * i)})`)
			//tooltip categories
			textGroups.append('text')
				.attr('fill', d => data[d + widget.waterSupplyTempType + 'TrendColor'])
				.style('font', 'bold ' + data.tooltipFont)
				.text(d => d === 'measured' ? 'MS:' : d === 'setpoint' ? 'SP:' : 'SQ:');
			//tooltip values
			textGroups.append('text')
				.attr('x', tooltipCategoryWidth + spaceRightOfTooltipCategory)
				.attr('fill', data.textColor)
				.style('font', data.tooltipFont)
				.text(d => sjo.formatValueToPrecision(widget.hoveredDatum[d === 'measured' ? 'MS' : d === 'setpoint' ? 'SP' : 'SQ'], data.precision) + ' ' + data.units);
		}
			
		










		// *********************************************  Temps Header ******************************************************* //		
		const tempsHeader = headerGroup.append('g').attr('class', 'tempsHeader').attr('transform', `translate(${maxTitleWidth + (spaceBetweenHeaders * 2) + tooltipWidth}, ${sjo.getTextHeight(data.labelFont)})`)
		tempsHeader.append('text')
			.attr('fill', data.textColor)
			.style('font', data.labelFont)
			.text('Temps')
	
		//CHW Radio Button
		tempsHeader.append('circle')
			.attr('cx', radioButtonSize / 2)
			.attr('cy', spaceUnderLabels + (legendTextHeight / 2))
			.attr('r', radioButtonSize / 2)
			.attr('fill', data.backgroundColor)
			.attr('stroke', widget.waterSupplyTempType === 'CHW' ? CHWRadioButtonColor : unselectedRadioButton)
			.style('stroke-width', '3px')
			.on('click', () => {
				resetPins();
				widget.waterSupplyTempType = 'CHW';
				renderWidget(widget, data);
			})
			.on('mouseover', () => CHWText.style('font', 'bold ' + data.legendFont))
			.on('mouseout', () => CHWText.style('font', data.legendFont))

		const CHWText = tempsHeader.append('text')
			.attr('fill', data.textColor)
			.style('font', data.legendFont)
			.attr('x', radioButtonSize + radioButtonMargin)
			.attr('y', spaceUnderLabels + legendTextHeight)
			.text('CHW')
			.on('click', () => {
				resetPins();
				widget.waterSupplyTempType = 'CHW';
				renderWidget(widget, data);
			})
			.on('mouseover', () => CHWText.style('font', 'bold ' + data.legendFont))
			.on('mouseout', () => CHWText.style('font', data.legendFont))

	//CDW Radio Button
	tempsHeader.append('circle')
		.attr('cy', spaceUnderLabels + (legendTextHeight / 2) )
		.attr('cx', radioButtonSize + radioButtonMargin + sjo.getTextWidth('CHW', data.legendFont) + spaceBetweenRadioSelections + (radioButtonSize / 2)  )
		.attr('r', radioButtonSize / 2)
		.attr('fill', data.backgroundColor)
		.style('stroke-width', '3px')
		.attr('stroke', widget.waterSupplyTempType === 'CDW' ? CDWRadioButtonColor : unselectedRadioButton)
		.on('click', () => {
			resetPins();
			widget.waterSupplyTempType = 'CDW';
			renderWidget(widget, data);
		})
		.on('mouseover', () => CDWText.style('font', 'bold ' + data.legendFont))
		.on('mouseout', () => CDWText.style('font', data.legendFont))
	const CDWText = tempsHeader.append('text')
		.attr('fill', data.textColor)
		.style('font', data.legendFont)
		.attr('x', (radioButtonSize * 2) + (radioButtonMargin * 2) + sjo.getTextWidth('CHW', data.legendFont) + spaceBetweenRadioSelections)
		.attr('y', spaceUnderLabels + legendTextHeight)
		.text('CDW')
		.on('click', () => {
			resetPins();
			widget.waterSupplyTempType = 'CDW';
			renderWidget(widget, data);
		})
		.on('mouseover', () => CDWText.style('font', 'bold ' + data.legendFont))
		.on('mouseout', () => CDWText.style('font', data.legendFont))


	//middle of selected radio button
	if (widget.waterSupplyTempType === 'CHW') {
		tempsHeader.append('circle')
			.attr('cx', radioButtonSize / 2)
			.attr('cy', spaceUnderLabels + (legendTextHeight / 2))
			.attr('r', radioButtonSize / 6)
			.attr('fill', widget.waterSupplyTempType === 'CHW' ? CHWRadioButtonColor : unselectedRadioButton)
			.on('click', () => {
				resetPins();
				widget.waterSupplyTempType = 'CHW';
				renderWidget(widget, data);
			})
			.on('mouseover', () => CHWText.style('font', 'bold ' + data.legendFont))
			.on('mouseout', () => CHWText.style('font', data.legendFont))
	} else {
		tempsHeader.append('circle')
			.attr('cy', spaceUnderLabels + (legendTextHeight / 2) )
			.attr('cx', radioButtonSize + radioButtonMargin + sjo.getTextWidth('CHW', data.legendFont) + spaceBetweenRadioSelections + (radioButtonSize / 2)  )
			.attr('r', radioButtonSize / 6)
			.attr('fill', widget.waterSupplyTempType === 'CDW' ? CDWRadioButtonColor : unselectedRadioButton)
			.on('click', () => {
				resetPins();
				widget.waterSupplyTempType = 'CDW';
				renderWidget(widget, data);
			})
			.on('mouseover', () => CDWText.style('font', 'bold ' + data.legendFont))
			.on('mouseout', () => CDWText.style('font', data.legendFont))
	}


	// *********************************************  View Header ******************************************************* //		
	const viewHeader = headerGroup.append('g').attr('class', 'viewHeader').attr('transform', `translate(${maxTitleWidth + (spaceBetweenHeaders * 3) + tooltipWidth + tempsHeaderWidth}, ${sjo.getTextHeight(data.labelFont)})`)
	viewHeader.append('text')
		.attr('fill', data.textColor)
		.style('font', data.labelFont)
		.text('View')

	//Live Radio Button
	viewHeader.append('circle')
		.attr('cx', radioButtonSize / 2)
		.attr('cy', spaceUnderLabels + (legendTextHeight / 2))
		.attr('r', radioButtonSize / 2)
		.attr('fill', data.backgroundColor)
		.attr('stroke', widget.timeView === 'live' ? viewRadioButtonColor : unselectedRadioButton)
		.style('stroke-width', '3px')
		.on('click', () => {
			resetPins();
			widget.timeView = 'live';
			renderWidget(widget, data);
		})
		.on('mouseover', () => liveText.style('font', 'bold ' + data.legendFont))
		.on('mouseout', () => liveText.style('font', data.legendFont))

	const liveText = viewHeader.append('text')
		.attr('fill', data.textColor)
		.style('font', data.legendFont)
		.attr('x', radioButtonSize + radioButtonMargin)
		.attr('y', spaceUnderLabels + legendTextHeight)
		.text('Live')
		.on('click', () => {
			resetPins();
			widget.timeView = 'live';
			renderWidget(widget, data);
		})
		.on('mouseover', () => liveText.style('font', 'bold ' + data.legendFont))
		.on('mouseout', () => liveText.style('font', data.legendFont))

	//Day Radio Button
	viewHeader.append('circle')
		.attr('cy', spaceUnderLabels + (legendTextHeight / 2) )
		.attr('cx', radioButtonSize + radioButtonMargin + sjo.getTextWidth('Live', data.legendFont) + spaceBetweenRadioSelections + (radioButtonSize / 2)  )
		.attr('r', radioButtonSize / 2)
		.attr('fill', data.backgroundColor)
		.style('stroke-width', '3px')
		.attr('stroke', widget.timeView === 'day' ? viewRadioButtonColor : unselectedRadioButton)
		.on('click', () => {
			resetPins();
			widget.timeView = 'day';
			renderWidget(widget, data);
		})
		.on('mouseover', () => dayText.style('font', 'bold ' + data.legendFont))
		.on('mouseout', () => dayText.style('font', data.legendFont))
	const dayText = viewHeader.append('text')
		.attr('fill', data.textColor)
		.style('font', data.legendFont)
		.attr('x', (radioButtonSize * 2) + (radioButtonMargin * 2) + sjo.getTextWidth('Live', data.legendFont) + spaceBetweenRadioSelections)
		.attr('y', spaceUnderLabels + legendTextHeight)
		.text('24 Hours')
		.on('click', () => {
			resetPins();
			widget.timeView = 'day';
			renderWidget(widget, data);
		})
	.on('mouseover', () => dayText.style('font', 'bold ' + data.legendFont))
	.on('mouseout', () => dayText.style('font', data.legendFont))


	//middle of selected radio button
	if (widget.timeView === 'live') {
		viewHeader.append('circle')
			.attr('cx', radioButtonSize / 2)
			.attr('cy', spaceUnderLabels + (legendTextHeight / 2))
			.attr('r', radioButtonSize / 6)
			.attr('fill', widget.timeView === 'live' ? viewRadioButtonColor : unselectedRadioButton)
			.on('click', () => {
				resetPins();
				widget.timeView = 'live';
				renderWidget(widget, data);
			})
			.on('mouseover', () => liveText.style('font', 'bold ' + data.legendFont))
			.on('mouseout', () => liveText.style('font', data.legendFont))
	} else {
		viewHeader.append('circle')
			.attr('cy', spaceUnderLabels + (legendTextHeight / 2) )
			.attr('cx', radioButtonSize + radioButtonMargin + sjo.getTextWidth('Live', data.legendFont) + spaceBetweenRadioSelections + (radioButtonSize / 2)  )
			.attr('r', radioButtonSize / 6)
			.attr('fill', widget.timeView === 'day' ? viewRadioButtonColor : unselectedRadioButton)
			.on('click', () => {
				resetPins();
				widget.timeView = 'day';
				renderWidget(widget, data);
			})
			.on('mouseover', () => dayText.style('font', 'bold ' + data.legendFont))
			.on('mouseout', () => dayText.style('font', data.legendFont))
	}
















		// *********************************************  Legend ******************************************************* //		
		const legend = headerGroup.append('g').attr('class', 'legend').attr('transform', `translate(${maxTitleWidth + (spaceBetweenHeaders * 4) + tooltipWidth + tempsHeaderWidth + viewHeaderWidth}, 0)`)

		const legendCategories = legend.selectAll('.legendCategories')
			.data(widget.waterSupplyTempType === 'CHW' ? CHWTrendData : CDWTrendData)
			.enter().append('g')
				.attr('class', d => `legendCategory ${d.legendName}legendCategory`)
				.attr('transform', (d, i) => `translate(0, ${i * (legendCircleSize + spaceUnderLabels)})`)
				.on('mouseover', function(d) {
					d3.selectAll('.' + d.legendName + 'legendCircle').attr('stroke-width', 2)
					d3.selectAll('.' + d.legendName + 'legendText').style('font', 'bold ' + data.legendFont )
				})
				.on('mouseout', function(d) {
					d3.selectAll('.' + d.legendName + 'legendCircle').attr('stroke-width', 1)
					d3.selectAll('.' + d.legendName + 'legendText').style('font', data.legendFont )
				})
				.on('click', function(d) {
					let legendCategoryHidden = !widget[d.type + widget.waterSupplyTempType + 'Hidden'];
					widget[d.type + widget.waterSupplyTempType + 'Hidden'] = legendCategoryHidden;
					if (legendCategoryHidden) {
						d3.selectAll('.' + d.legendName + 'legendText').style('text-decoration', 'line-through' );
						d3.selectAll('.' + d.type + 'CategoryGroup').attr('display', 'none');
					} else {
						d3.selectAll('.' + d.legendName + 'legendText').style('text-decoration', 'none' );
						d3.selectAll('.' + d.type + 'CategoryGroup').attr('display', 'block');
					}
				})

		legendCategories.append('circle')
			.attr('class', d => `legendCircle ${d.legendName}legendCircle`)
			.attr('cx', legendCircleSize / 2)
			.attr('cy', legendTextHeight / 2)
			.attr('r', legendCircleSize / 2)
			.attr('fill', d => d.color)
			.attr('stroke', d => d.color)
			.attr('stroke-width', 1)


		legendCategories.append('text')
			.attr('class', d => `legendText ${d.legendName}legendText`)
			.text(d => d.legendName)
			.attr('x', legendCircleSize + radioButtonMargin)
			.attr('y', legendTextHeight)
			.attr('fill', data.textColor)
			.style('font', data.legendFont )
			.style('text-decoration', d => widget[d.type + widget.waterSupplyTempType + 'Hidden'] ? 'line-through' : 'none' )


























		// ********************************************* CHART  ******************************************************* //		
		const chartGroup = graphicGroup.append('g')
			.attr('class', 'chartGroup')
			.attr('transform', `translate(${chartHorizontalMargins},${tooltipHeight})`)

		// grid lines
		chartGroup.selectAll('.grid')
			.data(yTickValues)
			.enter().append('line')
				.attr('class', 'grid')
				.attr('x1', 0)
				.attr('x2', chartWidth)
				.attr('y1', d => yScale(d))
				.attr('y2', d => yScale(d))
				.attr('stroke', gridColor)
				.attr('stroke-width', 0.5)

		const categoryGroups = chartGroup.selectAll('.categoryGroup')
			.data(widget.waterSupplyTempType === 'CHW' ? CHWTrendData : CDWTrendData)
			.enter().append('g')
				.attr('class', d => `categoryGroup ${d.type}CategoryGroup`)
				.attr('display', d => widget[`${d.type + widget.waterSupplyTempType}Hidden`] ? 'none' : 'block')
				
		// Top Border For Paths
		categoryGroups.append('path')
			.attr('d', d => topBorderPathGenerator(d[widget.timeView + 'Data']))
			.attr('class', d => d.type + 'Path')
			.attr('stroke', d => d.color)
			.attr('stroke-width', pathStrokeWidth)
			.attr('fill', 'none');
				
		// Area Paths
		categoryGroups.filter(d => d.type === 'MS').append('path')
			.attr('d', d => areaPathGenerator(d[widget.timeView + 'Data']))
			.attr('class', d => d.type + 'Path')
			.attr('fill', d => d.color)
			.attr('fill-opacity', 0.42)


		/* AXES */
		chartGroup.append('g')
			.attr('class', 'axisY')
			.call(yAxisGenerator);

		chartGroup.append('g')
			.attr('class', 'axisX')
			.attr('transform', `translate(0,${chartHeight})`)
			.call(xAxisGenerator)
				.selectAll('text')
					.attr('text-anchor', 'end')
					.attr('transform', 'rotate(-25)');

		d3.selectAll('.axisY text').style('fill', data.textColor).style('font', data.tickFont)
		d3.selectAll('.axisX text').style('fill', data.textColor).style('font', data.tickFont)


		chartGroup.append('text')
			.attr('x', spaceLeftOfTick)
			.attr('dominant-baseline', 'central')
			.style('font', data.labelFont)
			.attr('fill', data.textColor)
			.text(data.units)








		/* DATAPOINTS */
		// datapoints
		categoryGroups.selectAll('.circle')
			.data(d => d[widget.timeView + 'Data']) //get day or live data points within each category
			.enter().append('circle')
				.attr('class', (d, i, nodes) => `${nodes[i].parentNode.__data__.type}Circle ${formatTimeForClass(d.time)}Circle circle`)
				.attr('fill', (d, i, nodes) => nodes[i].parentNode.__data__.color)
				.attr('stroke', data.backgroundColor)
				.attr('stroke-width', 2)
				.attr('cx', d => xScale(d.time))
				.attr('cy', d => yScale(d.value))
				.attr('r', 4)
				.style('opacity', 0)


		// hoverable rectangles
		const dataPerCat = widget.waterSupplyTempType === 'CHW' ? CHWTrendData.map(cat => cat[widget.timeView + 'Data']) : CDWTrendData.map(cat => cat[widget.timeView + 'Data']);
		const dataByTime = dataPerCat[0].map((timeObj, index) => {
			const objToReturn = {time: timeObj.time, MS: timeObj.value, SP: dataPerCat[1][index].value}
			if (widget.waterSupplyTempType === 'CHW') objToReturn.SQ = dataPerCat[2][index].value
			return objToReturn;
		})
		const dataByTimeLastIndex = dataByTime.length - 1;
		const hoverableRectWidth = xScale(dataByTime[dataByTimeLastIndex].time) - xScale(dataByTime[dataByTimeLastIndex - 1].time);
		chartGroup.selectAll('.hoverableRect')
			.data(dataByTime)
			.enter().append('rect')
				.attr('class', d => `hoverableRect ${formatTimeForClass(d.time)}Rect`)
				.attr('height', chartHeight + xAxisTicksHeight)
				.attr('width', (d, i) => i === dataByTimeLastIndex ? hoverableRectWidth / 2 : hoverableRectWidth)
				.attr('x', (d, i) => i === 0 ? xScale(d.time) : xScale(d.time) - (hoverableRectWidth / 2))
				.attr('y', 0)
				.style('opacity', '0')
				.on('mouseover', attemptHover)
				.on('mouseout', attemptUnhover)
				.on('click', togglePin);













		// *********************************************  HOVERS, CLICKS, AND STICKS  ******************************************************* //		
		function hover (d) {
			widget.hoveredDatum = d;
			d3.selectAll('.' + formatTimeForClass(d.time) + 'Circle').style('opacity', 1);
			drawTooltip();
		}
		
		function attemptHover (d) {
			if (widget.pinned === 'none') hover(d);
		}
		
		function unhover () {
			widget.hoveredDatum = 'none'
			d3.selectAll('.circle').style('opacity', 0)
			sjo.resetElements(d3.select('.tooltipGroup'), '*')
		}
		
		function attemptUnhover () {
			if (widget.pinned === 'none') unhover();
		}

		function resetPins() {
			widget.pinned = 'none';
			unhover();
		}
		
		function pin (d) {
			if (widget.pinned !== 'none') resetPins();
			widget.pinned = d;
			hover(d);
		}
		
		function togglePin (d) {
			if (widget.pinned === d) {
				resetPins()
			} else {
				pin(d)
			}
		}








		// *********************************************  CURSOR STYLING  ******************************************************* //		

		widget.svg.selectAll('text').style('cursor', 'default');


		console.log('data: ', data)

	};
	






	////////////////////////////////////////////////////////////////
		// Render Func
	////////////////////////////////////////////////////////////////

	function render(widget, force) {
		// invoking setupDefinitions, then returning value to renderWidget func
		let theData = setupDefinitions(widget);
		if (force || !widget.data || needToRedrawWidget(widget, theData)){
			renderWidget(widget, theData);	
		}
		widget.data = theData;
	}






	////////////////////////////////////////////////////////////////
		// Initialize Widget
	////////////////////////////////////////////////////////////////
	function initialize() {
		const widget = {};

		widget.outerDiv = d3.select('#outer')
			.style('overflow', 'hidden');
		widget.svg = widget.outerDiv.append('svg')
			.attr('class', 'log')
			.style('overflow', 'hidden');

		render(widget);
	}





initialize();

}

defineFuncForTabSpacing();