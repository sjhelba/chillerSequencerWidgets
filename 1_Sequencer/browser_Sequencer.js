function defineFuncForTabSpacing () {

	////////// Hard Coded Defs //////////
	const timerData = ['timerType', 'timerOnReason', 'timerPreset', 'timerTimeLeft']
	const removeTimerProps = key => !timerData.includes(key);
	// check non-timer related values' primitives for equivalence
	const arePrimitiveValsInObjsSame = (obj1, obj2) => !Object.keys(obj1).filter(removeTimerProps).some(key => (obj1[key] === null || (typeof obj1[key] !== 'object' && typeof obj1[key] !== 'function')) && obj1[key] !== obj2[key])
	// 0 layers means obj only has primitive values
	// this func only works with obj literals layered with obj literals until base layer only primitive
	const checkNestedObjectsEquivalence = (objA, objB, layers) => {
		if (layers === 0) {
			return arePrimitiveValsInObjsSame(objA, objB);
		} else {
			const objAKeys = Object.keys(objA);
			const objBKeys = Object.keys(objB);
			if (objAKeys.length !== objBKeys.length) return false;
			const somethingIsNotEquivalent = objAKeys.some(key => {
				return !checkNestedObjectsEquivalence(objA[key], objB[key], layers - 1);
			})
			return !somethingIsNotEquivalent;
		}
	};
	const needToRedrawWidget = (widget, newData) => {
		const lastData = widget.data;
		if (!arePrimitiveValsInObjsSame(lastData, newData)) return true;
		// // check nested objs for equivalence
		// const monthlyModulesAreSame = checkNestedObjectsEquivalence(lastData.monthlyModulesData, newData.monthlyModulesData, 3);
		// const monthlyOverallAreSame = checkNestedObjectsEquivalence(lastData.monthlyOverallData, newData.monthlyOverallData, 2);
		// const annualModulesAreSame = checkNestedObjectsEquivalence(lastData.annualModulesData, newData.annualModulesData, 2);
		// const annualOverallAreSame = checkNestedObjectsEquivalence(lastData.annualOverallData, newData.annualOverallData, 1);
		// if (!monthlyModulesAreSame || !monthlyOverallAreSame || !annualModulesAreSame || !annualOverallAreSame) return true;

		//return false if nothing prompted true
		return false;
	};
	const margin = {top: 5, left: 5, right: 5, bottom: 5};


	////////////////////////////////////////////////////////////////
		// Define Widget Constructor & Exposed Properties
	////////////////////////////////////////////////////////////////
	const properties = [
		{
			name: 'includeSpecifiedLead',
			value: true
		},
		{
			name: 'backgroundColor',
			value: 'white',
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
		data.jqHeight = 300;
		data.jqWidth = 300;

		// SIZING //
		data.graphicHeight = data.jqHeight - (margin.top + margin.bottom);
		data.graphicWidth = data.jqWidth - (margin.left + margin.right);

		// GLOBALS PER INSTANCE //
		if (!widget.hovered) widget.hovered = { optimized: false, standard: false, current: 'neither' };
		if (!widget.activeModule) widget.activeModule = 'none';
		if (!widget.percentIsHovered) widget.percentIsHovered = false;

		// DATA TO POPULATE //


		// FAKE DATA //
		const populateFakeData = () => {
			data.onTimerEnabled = true;
			data.offTimerEnabled = false;
			data.cosTimerEnabled = false;
			data.optimizationEnabled = true;
			data.specifiedLead = 'Auto';
			data.timerType = data.onTimerEnabled ? 'On' : data.offTimerEnabled ? 'Off' : data.cosTimerEnabled ? 'COS' : 'Standby';
			data.timerOnReason = 'Efficiency';
			data.timerPreset = 15; 
			data.timerTimeLeft = 15;
			data.chillersAvailable = 4;
			data.chillersNeeded = 3
			data.chillersCalled = 2;
			data.chillersRunning = 2;
			data.chillersOptHrs = 650;
			data.chillersStdHrs = 100;
					/*
						baja.Ord.make(`station:|slot:/tekWorx/Sequencing/ChillerSequencer/Sequencer`).get()
							.then(thisPoint => thisPoint.getNavChildren())
							.then(timers => {
								timers.forEach(timer => {
									timer.lease(500000);
									const preset = timer.getPreset();
									const accum = timer.getAccum();
									const presetSeconds = preset.getSeconds();
									const accumSeconds = accum.getSeconds();
									const timerType = timer.getNavName();
									const isEnabled = timer.getEnabled().getValue();
									const timeLeft = timerType === 'cosTimer' ? accumSeconds : presetSeconds - accumSeconds
									alert(
										'timertype: ' + timerType + '\n' +
										'isEnabled: ' + isEnabled + '\n' +
										'maxVal: ' + presetSeconds + '\n' +
										'timeLeft: ' + timeLeft
									);
								});
							})
							.catch(err => alert('Error:' + err));
					*/
		};



		// CALCULATED DEFS //
		const calculateDefs = () => {
			data.percentOptHrs = JsUtils.formatIntoPercentage(data.chillersOptHrs / (data.chillersOptHrs + data.chillersStdHrs))




			return data;
		};

		populateFakeData();
		return calculateDefs();
	};
		





	////////////////////////////////////////////////////////////////
		// RenderWidget Func
	////////////////////////////////////////////////////////////////

	const renderWidget = (widget, data) => {
		// Extra Definitions //
		const textColor = 'black';
		const titlesFont = 'bold 13.0pt Nirmala UI';	// Niagara: 18
		const valuesFont = 'bold 15.0pt Nirmala UI';	// Niagara: 28
		const labelsFont = '13.0pt Nirmala UI';	// Niagara: 16
		const enabledCircleColor = '#22b573';
		const disabledCircleColor = 'gray'

		const titlesHeight = JsUtils.getTextHeight(titlesFont);
		const valuesHeight = JsUtils.getTextHeight(valuesFont);
		const labelsHeight = JsUtils.getTextHeight(labelsFont);
		const optimizationWidth = JsUtils.getTextWidth('Optimization', labelsFont);
		const specifiedLeadWidth = JsUtils.getTextWidth('Specified Lead', labelsFont);
		const availableWidth = JsUtils.getTextWidth('Available', labelsFont);
		const runningWidth = JsUtils.getTextWidth('Running', labelsFont);
		const paddingUnderTitle = 15;
		const paddingUnderValues = 0;
		const paddingBetweenSections = 20;
		const paddingBetweenRows = 10;
		const circleDiameter = 15;
		const circleRadius = circleDiameter / 2;
		const paddingRightOfCircle = 3;
		const paddingBetweenTopColumns = 30;
		const paddingBetweenBottomColumns = 8;
		const additionalMarginsForNonTitles = (data.graphicWidth - (optimizationWidth + specifiedLeadWidth + circleDiameter + paddingRightOfCircle + paddingBetweenTopColumns)) / 2;
		const paddingRightOfGauge = data.graphicWidth - (additionalMarginsForNonTitles + 150 /* gaugeWidth */ + availableWidth + paddingBetweenBottomColumns + runningWidth);
		/** METER */
		const meterTitleFont = '10.0pt Nirmala UI';
		const meterUnitsFont = 'bold 10.0pt Nirmala UI';
		const meterNumFont = 'bold 10.0pt Nirmala UI';
		const meterWidth = data.graphicWidth * 0.85
		const meterHeight = 15;
		const meterObjHeight = Meter.getHeightFromMeterHeight(meterHeight, meterTitleFont, meterUnitsFont, meterNumFont);










		// ********************************************* DRAW ******************************************************* //
		widget.outerDiv 
			.style('height', data.jqHeight + 'px')	//only for browser
			.style('width', data.jqWidth + 'px')		//only for browser

		widget.svg 
			.attr('height', data.jqHeight + 'px')
			.attr('width', data.jqWidth + 'px')
			
		d3.select(widget.svg.node().parentNode).style('background-color', data.backgroundColor);
		
		// delete leftover elements from versions previously rendered
		if (!widget.svg.empty()) JsUtils.resetElements(widget.svg, '*');

		// ********************************************* GRAPHIC GROUP ******************************************************* //

		const graphicGroup = widget.svg.append('g')
			.attr('class', 'graphicGroup')
			.attr('transform', `translate(${margin.left},${margin.top})`)
			.attr('fill', textColor);

		const topGroup = graphicGroup.append('g').attr('class', 'topGroup')
		topGroup.append('text')
			.text('Status')
			.style('font', titlesFont)
			.attr('y', titlesHeight);

		const optimizationGroup = topGroup.append('g')
			.attr('class', 'optimizationGroup')
			.attr('transform', `translate(${additionalMarginsForNonTitles + circleDiameter + paddingRightOfCircle},${titlesHeight + paddingUnderTitle + valuesHeight})`);

		optimizationGroup.append('circle')
			.attr('fill', data.optimizationEnabled ? enabledCircleColor : disabledCircleColor)
			.attr('stroke', 'none')
			.attr('r', circleRadius)
			.attr('cx', -(circleRadius + paddingRightOfCircle))
			.attr('cy', -circleRadius)

		optimizationGroup.append('text')
			.text(data.optimizationEnabled ? 'Enabled' : 'Disabled')
			.style('font', valuesFont)

		optimizationGroup.append('text')
			.text('Optimization')
			.style('font', labelsFont)
			.attr('y', paddingUnderValues + labelsHeight);

		if (data.includeSpecifiedLead) {
			const specifiedLeadGroup = topGroup.append('g')
				.attr('class', 'specifiedLeadGroup')
				.attr('transform', `translate(${additionalMarginsForNonTitles + circleDiameter + paddingRightOfCircle + optimizationWidth + paddingBetweenTopColumns},${titlesHeight + paddingUnderTitle + valuesHeight})`);
	
			specifiedLeadGroup.append('text')
				.text(data.specifiedLead)
				.style('font', valuesFont)
	
			specifiedLeadGroup.append('text')
				.text('Specified Lead')
				.style('font', labelsFont)
				.attr('y', paddingUnderValues + labelsHeight);
		}

	


		const bottomGroup = graphicGroup.append('g')
			.attr('class', 'bottomGroup')
			.attr('transform', `translate(0, ${titlesHeight + paddingUnderTitle + valuesHeight + paddingUnderValues + labelsHeight + paddingBetweenSections})`)

		const timerSpot = bottomGroup.append('g').attr('class', 'timerSpot')
		widget.timer = new Gauge(timerSpot, data.timerType, data.timerOnReason, data.timerPreset, data.timerTimeLeft);
		widget.timer.create();

		const col1 = bottomGroup.append('g').attr('class', 'col1').attr('transform', `translate(${150 /* gaugeWidth */ + paddingRightOfGauge},${paddingUnderTitle + valuesHeight})`)
		col1.append('text')
			.text(data.chillersRunning)
			.style('font', valuesFont)
		col1.append('text')
			.text('Running')
			.style('font', labelsFont)
			.attr('y', paddingUnderValues + labelsHeight)
		col1.append('text')
			.text(data.chillersCalled)
			.style('font', valuesFont)
			.attr('y', paddingUnderValues + labelsHeight + paddingBetweenRows + valuesHeight)
		col1.append('text')
			.text('Called')
			.style('font', labelsFont)
			.attr('y', ((paddingUnderValues + labelsHeight) * 2) + paddingBetweenRows + valuesHeight)


		const col2 = bottomGroup.append('g').attr('class', 'col2').attr('transform', `translate(${150 /* gaugeWidth */ + paddingRightOfGauge + runningWidth + paddingBetweenBottomColumns},${paddingUnderTitle + valuesHeight})`)
		col2.append('text')
			.text(data.chillersAvailable)
			.style('font', valuesFont)
		col2.append('text')
			.text('Available')
			.style('font', labelsFont)
			.attr('y', paddingUnderValues + labelsHeight)
		col2.append('text')
			.text(data.chillersNeeded)
			.style('font', valuesFont)
			.attr('y', paddingUnderValues + labelsHeight + paddingBetweenRows + valuesHeight)
		col2.append('text')
			.text('Needed')
			.style('font', labelsFont)
			.attr('y', ((paddingUnderValues + labelsHeight) * 2) + paddingBetweenRows + valuesHeight)


		const meterGroup = graphicGroup.append('g').attr('class', 'meterGroup').attr('transform', `translate(${(data.graphicWidth / 2) - (meterWidth / 2)},${data.graphicHeight - meterObjHeight})`)
		const meter = new Meter(
			meterGroup,
			meterGroup,
			data.backgroundColor,
			enabledCircleColor,
			textColor,
			meterObjHeight,
			meterWidth,
			'Optimized Hours',
			'%',
			0,
			meterTitleFont,
			meterUnitsFont,
			meterNumFont,
			+data.percentOptHrs.slice(0,-1),
			0,
			100
		);


		/*** TOOLTIP ***/
		const tooltipMargin = 3;
		const minRightOfLabel = 8;
		const verticalPadding = 3;
		const tooltipHeight = (tooltipMargin * 3) + ( JsUtils.getTextHeight(meter.titleFont) * 2 ) + verticalPadding;
		const tooltipWidth = (tooltipMargin * 2) + JsUtils.getTextWidth('Opt Hrs:', meter.titleFont) + minRightOfLabel + meter.greatestNumWidth;
		const meterLeftTextWidth = JsUtils.getTextWidth(data.percentOptHrs, meterNumFont) + meter.horizontalTextPadding;
		const meterRightTextWidth = JsUtils.getTextWidth(meter.title, meterTitleFont);
		const sumWidthsOnBar = tooltipWidth + meterLeftTextWidth + meterRightTextWidth;
		const leftoverSpaceOnBar = meter.barLength - sumWidthsOnBar;
		const tooltipGroup = meterGroup.append('g').attr('class', 'meterGroup').attr('transform', `translate(${meterLeftTextWidth + (leftoverSpaceOnBar / 2)}, ${(meter.margin + meter.greatestTextHeight) - tooltipHeight})`).style('display', 'none');


		//rect
		tooltipGroup.append('rect')
			.attr('fill', meter.backgroundBarColor)
			.attr('stroke', 'none')
			.attr('height', tooltipHeight)
			.attr('width', tooltipWidth)
			.attr('rx', 5)
			.attr('ry', 5);
		const textGroup = tooltipGroup.append('g')
			.attr('class', 'textGroup')
			.attr('transform', `translate(${tooltipMargin}, ${tooltipMargin})`);

		const row1 = textGroup.append('g')
			.attr('class', 'labelsColumn')
			.attr('transform', `translate(0, ${JsUtils.getTextHeight(meter.numFont)})`);
		const row2 = textGroup.append('g')
			.attr('class', 'numsColumn')
			.attr('transform', `translate(0, ${( JsUtils.getTextHeight(meter.numFont) * 2 ) + verticalPadding})`);

		const labelsColumnX = 0;
		const numsColumnX = JsUtils.getTextWidth('Opt Hrs:', meter.titleFont) + minRightOfLabel;

		//Min Label
		row1.append('text')
			.text('Opt Hrs:')
			.style('font', meter.titleFont)
			.attr('x', labelsColumnX);
		//Min Val
		row1.append('text')
			.text(JsUtils.formatValueToPrecision(data.chillersOptHrs, 0))
			.style('font', meter.numFont)
			.attr('x', numsColumnX);

		//Max Label
		row2.append('text')
			.text('Std Hrs:')
			.style('font', meter.titleFont)
			.attr('x', labelsColumnX);
		//Max Val
		row2.append('text')
			.text(JsUtils.formatValueToPrecision(data.chillersStdHrs, 0))
			.style('font', meter.numFont)
			.attr('x', numsColumnX);



		const meterElement = meter.create();
		meterElement.on('mouseover', () => tooltipGroup.style('display', 'block')).on('mouseout', () => tooltipGroup.style('display', 'none'));

	};
	



/*
A. Does the circle next to Enabled change colors when not enabled? If so, to what?
B. Does 'Enabled' change when false? If so, to what?
C. Where is specified lead determined? What else would 'Auto' be besides Auto?
D. Where do I get the numbers for available, needed, called, and running?
gray
disabled
enum
sequencer components/properties
*/






	////////////////////////////////////////////////////////////////
		// Render Func
	////////////////////////////////////////////////////////////////

	function render(widget, force) {
		// invoking setupDefinitions, then returning value to renderWidget func
		let theData = setupDefinitions(widget);
		//if timer data has changed, change timer
		if (widget.data) {
			const newArgsObj = {};
			let timerChanged = false;
			timerData.forEach(prop => {
				if (widget.data[prop] !== theData[prop]) {
					newArgsObj[prop] = theData[prop];
					timerChanged = true;
				}
			});
			if (timerChanged) widget.timer.redrawWithNewArgs(newArgsObj);
		}

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