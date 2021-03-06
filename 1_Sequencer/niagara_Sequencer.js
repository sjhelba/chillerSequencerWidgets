define(['bajaux/Widget', 'bajaux/mixin/subscriberMixIn', 'nmodule/COREx/rc/d3/d3.min', 'baja!', 'nmodule/COREx/rc/jsClasses/Meter', 'nmodule/COREx/rc/jsClasses/Gauge', 'nmodule/COREx/rc/jsClasses/JsUtils'], function (Widget, subscriberMixIn, d3, baja, Meter, Gauge, JsUtils) {
	'use strict';

////////// Hard Coded Defs //////////
	const timerData = ['timerType', 'timerOnReason', 'timerPreset', 'timerTimeLeft']
	const removeTimerProps = key => !timerData.includes(key);
	// check non-timer related values' primitives for equivalence
	const arePrimitiveValsInObjsSame = (obj1, obj2) => !Object.keys(obj1).filter(removeTimerProps).some(key => (obj1[key] === null || (typeof obj1[key] !== 'object' && typeof obj1[key] !== 'function')) && obj1[key] !== obj2[key])
	// 0 layers means obj only has primitive values
	// this func only works with obj literals layered with obj literals until base layer only primitive
	const needToRedrawWidget = (widget, newData) => {
		const lastData = widget.data;
		// check primitives for equivalence
		if (!arePrimitiveValsInObjsSame(lastData, newData)) return true;
		//return false if nothing prompted true
		return false;
	};
	const margin = {top: 5, left: 5, right: 5, bottom: 5};


////////////////////////////////////////////////////////////////
	// Define Widget Constructor & Exposed Properties
////////////////////////////////////////////////////////////////

	var ChillerSequencer = function () {
		var that = this;
		Widget.apply(this, arguments);

		that.properties().addAll([
			{
				name: 'includeSpecifiedLead',
				value: true
			},
			{
				name: 'backgroundColor',
				value: 'white',
				typeSpec: 'gx:Color'
			}
		]);



		subscriberMixIn(that);
	};

	ChillerSequencer.prototype = Object.create(Widget.prototype);
	ChillerSequencer.prototype.constructor = ChillerSequencer;



////////////////////////////////////////////////////////////////
	// /* SETUP DEFINITIONS AND DATA */
////////////////////////////////////////////////////////////////


	const setupDefinitions = widget => {
		// FROM USER // 
		const data = widget.properties().toValueMap();	//obj with all exposed properties as key/value pairs

		// FROM JQ //
		const jq = widget.jq();

		//SIZING //
		data.jqHeight = jq.height() || 300;
		data.jqWidth = jq.width() || 300;
		data.graphicHeight = data.jqHeight - (margin.top + margin.bottom);
		data.graphicWidth = data.jqWidth - (margin.left + margin.right);

		// DATA TO POPULATE //
		data.onTimerEnabled; //true;
		data.offTimerEnabled; //false;
		data.cosTimerEnabled; //false;
		data.optimizationEnabled; //true;
		data.specifiedLead; //'Auto';
		data.timerType; //data.onTimerEnabled ? 'On' : data.offTimerEnabled ? 'Off' : data.cosTimerEnabled ? 'COS' : 'Standby';
		data.timerOnReason; //'Efficiency';
		data.timerPreset; //15; 
		data.timerTimeLeft; //15;
		data.chillersAvailable; //4;
		data.chillersNeeded; //3
		data.chillersCalled; //2;
		data.chillersRunning; //2;
		data.chillersOptHrs; //650;
		data.chillersStdHrs; //100;

		const batchResolve = new baja.BatchResolve([
			'station:|slot:/tekWorx/Sequencers/ChillerSequencer/Points/Optimization/Enabled',
			'station:|slot:/tekWorx/Sequencers/ChillerSequencer/Points/Optimization/SpecifiedLead',
			'station:|slot:/tekWorx/Sequencers/ChillerSequencer/Points/Sequencing/OnReason',
			'history:^Chillers_OptHrCy',
			'history:^Chillers_StdHrCy'
		]);
		const batchSubscriber = new baja.Subscriber();

		// GET DATA //
		return widget.resolve(`station:|slot:/tekWorx/Sequencers/ChillerSequencer/Sequencer`)	
			.then(sequencer => {
				data.chillersAvailable = sequencer.get('available');
				data.chillersNeeded = sequencer.get('needed');
				data.chillersCalled = sequencer.get('called');
				data.chillersRunning = sequencer.get('running');
				return sequencer.getNavChildren()
			})
			.then(timers => {
				timers.forEach(timer => {
					// timer.attach('changed', function (prop, cx) {
					// 	if (prop === SOMETHING) render(widget)
					// });
					timer.lease(80000)
					const timerType = timer.getNavName();
					const preset = timer.getPreset();
					const accum = timer.getAccum();
					const accumSeconds = accum.getSeconds();
					const isEnabled = timerType === 'cosTimer' ? timer.getDone() : timer.getEnabled().getValue();	//if cosTimer, runs if Done is true, rather than Enabled
					data[timerType + 'Enabled'] = isEnabled;
					data[timerType + 'Preset'] = preset.getSeconds();
					data[timerType + 'TimeLeft'] = timerType === 'cosTimer' ? accumSeconds : data[timerType + 'Preset'] - accumSeconds
				});
				data.timerType = data.onTimerEnabled ? 'On' : data.offTimerEnabled ? 'Off' : data.cosTimerEnabled ? 'COS' : 'Standby';
				data.timerPreset = data[data.timerType.toLowerCase() + 'TimerPreset'];
				data.timerTimeLeft = data[data.timerType.toLowerCase() + 'TimerTimeLeft'];
				return batchResolve.resolve({subscriber: batchSubscriber});
			})
			.then(() => {
				const [enabled, lead, reason, optHrs, stdHrs] = batchResolve.getTargetObjects();
				data.timerOnReason = reason.get('out').get('value');
				data.specifiedLead = lead.get('out').get('value');
				data.optimizationEnabled = enabled.get('out').get('value');
				return Promise.all([
					optHrs.cursor({limit: 1, each: function(row) {data.chillersOptHrs = +row.get('value')}}),
					stdHrs.cursor({limit: 1, each: function(row) {data.chillersStdHrs = +row.get('value')}})
				])
			})
			.then(() => {
				data.percentOptHrs = JsUtils.formatIntoPercentage(data.chillersOptHrs / (data.chillersOptHrs + data.chillersStdHrs))
				return data;
			})
			.catch(err => console.error('Error (Chiller Sequencer data error): ' + err));
	};




////////////////////////////////////////////////////////////////
	// Render Widget (invoke setupDefinitions() and, using returned data, append D3 elements into SVG)
////////////////////////////////////////////////////////////////

	const renderWidget = (widget, data) => {
				// Extra Definitions //
				const textColor = '#404040';
				const titlesFont = 'bold 13.0pt Nirmala UI';	// Niagara: 18
				const stringValuesFont = 'bold 13.0pt Nirmala UI';	// Niagara: 28
				const numValuesFont = 'bold 15.0pt Nirmala UI';	// Niagara: 28
				const labelsFont = '12.0pt Nirmala UI';	// Niagara: 16
				const enabledCircleColor = '#22b573';
				const disabledCircleColor = 'gray'
		
				const titlesHeight = JsUtils.getTextHeight(titlesFont);
				const stringValuesHeight = JsUtils.getTextHeight(stringValuesFont);
				const numValuesHeight = JsUtils.getTextHeight(numValuesFont);
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
				const meterHeight = 12;
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
					.attr('transform', `translate(${additionalMarginsForNonTitles + circleDiameter + paddingRightOfCircle},${titlesHeight + paddingUnderTitle + stringValuesHeight})`);
		
				optimizationGroup.append('circle')
					.attr('fill', data.optimizationEnabled ? enabledCircleColor : disabledCircleColor)
					.attr('stroke', 'none')
					.attr('r', circleRadius)
					.attr('cx', -(circleRadius + paddingRightOfCircle))
					.attr('cy', -circleRadius)
		
				optimizationGroup.append('text')
					.text(data.optimizationEnabled ? 'Enabled' : 'Disabled')
					.style('font', stringValuesFont)
		
				optimizationGroup.append('text')
					.text('Optimization')
					.style('font', labelsFont)
					.attr('y', paddingUnderValues + labelsHeight);
		
				if (data.includeSpecifiedLead) {
					const specifiedLeadGroup = topGroup.append('g')
						.attr('class', 'specifiedLeadGroup')
						.attr('transform', `translate(${additionalMarginsForNonTitles + circleDiameter + paddingRightOfCircle + optimizationWidth + paddingBetweenTopColumns},${titlesHeight + paddingUnderTitle + stringValuesHeight})`);
			
					specifiedLeadGroup.append('text')
						.text(data.specifiedLead)
						.style('font', stringValuesFont)
			
					specifiedLeadGroup.append('text')
						.text('Specified Lead')
						.style('font', labelsFont)
						.attr('y', paddingUnderValues + labelsHeight);
				}
		
			
		
		
				const bottomGroup = graphicGroup.append('g')
					.attr('class', 'bottomGroup')
					.attr('transform', `translate(0, ${titlesHeight + paddingUnderTitle + stringValuesHeight + paddingUnderValues + labelsHeight + paddingBetweenSections})`)
		
				const timerSpot = bottomGroup.append('g').attr('class', 'timerSpot')
				widget.timer = new Gauge(timerSpot, data.timerType, data.timerOnReason, data.timerPreset, data.timerTimeLeft);
				widget.timer.create();
		
				const col1 = bottomGroup.append('g').attr('class', 'col1').attr('transform', `translate(${150 /* gaugeWidth */ + paddingRightOfGauge},${paddingUnderTitle + numValuesHeight})`)
				col1.append('text')
					.text(data.chillersRunning)
					.style('font', numValuesFont)
				col1.append('text')
					.text('Running')
					.style('font', labelsFont)
					.attr('y', paddingUnderValues + labelsHeight)
				col1.append('text')
					.text(data.chillersCalled)
					.style('font', numValuesFont)
					.attr('y', paddingUnderValues + labelsHeight + paddingBetweenRows + numValuesHeight)
				col1.append('text')
					.text('Called')
					.style('font', labelsFont)
					.attr('y', ((paddingUnderValues + labelsHeight) * 2) + paddingBetweenRows + numValuesHeight)
		
		
				const col2 = bottomGroup.append('g').attr('class', 'col2').attr('transform', `translate(${150 /* gaugeWidth */ + paddingRightOfGauge + runningWidth + paddingBetweenBottomColumns},${paddingUnderTitle + numValuesHeight})`)
				col2.append('text')
					.text(data.chillersAvailable)
					.style('font', numValuesFont)
				col2.append('text')
					.text('Available')
					.style('font', labelsFont)
					.attr('y', paddingUnderValues + labelsHeight)
				col2.append('text')
					.text(data.chillersNeeded)
					.style('font', numValuesFont)
					.attr('y', paddingUnderValues + labelsHeight + paddingBetweenRows + numValuesHeight)
				col2.append('text')
					.text('Needed')
					.style('font', labelsFont)
					.attr('y', ((paddingUnderValues + labelsHeight) * 2) + paddingBetweenRows + numValuesHeight)
		
		

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
		const greatestNumWidth = d3.max([JsUtils.getTextWidth(JsUtils.formatValueToPrecision(data.chillersOptHrs, 0), meterNumFont), JsUtils.getTextWidth(JsUtils.formatValueToPrecision(data.chillersStdHrs, 0), meterNumFont)])
		const tooltipHeight = (tooltipMargin * 3) + ( JsUtils.getTextHeight(meter.titleFont) * 2 ) + verticalPadding;
		const tooltipWidth = (tooltipMargin * 2) + JsUtils.getTextWidth('Opt Hrs:', meter.titleFont) + minRightOfLabel + greatestNumWidth;
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

		widget.svg.selectAll('text').attr('fill', textColor)
	};


	function render(widget, force) {
		// invoking setupDefinitions, then returning value from successful promise to renderWidget func
		return setupDefinitions(widget)
			.then(data => {
				if (widget.data) {
					const newArgsObj = {};
					let timerChanged = false;
					timerData.forEach(prop => {
						if (widget.data[prop] !== data[prop]) {
							newArgsObj[prop] = data[prop];
							timerChanged = true;
						}
					});
					if (timerChanged) widget.timer.redrawWithNewArgs(newArgsObj);
				}
				if (force || !widget.data || needToRedrawWidget(widget, data)){
					renderWidget(widget, data);
				}
				widget.data = data;
			})
			.catch(err => console.error('render did not run properly: ' + err));
	}


////////////////////////////////////////////////////////////////
	// Initialize Widget
////////////////////////////////////////////////////////////////

	ChillerSequencer.prototype.doInitialize = function (element) {
		var that = this;
		element.addClass('ChillerSequencerOuter');
		const outerEl = d3.select(element[0])
			.style('overflow', 'hidden')

		that.svg = outerEl.append('svg')
			.attr('class', 'ChillerSequencer')
			.style('overflow', 'hidden')
			.attr('top', 0)
			.attr('left', 0)
			.attr('width', '100%')
			.attr('height', '100%');

		that.getSubscriber().attach('changed', function (prop, cx) { render(that) });
		that.interval = setInterval(() => render(that), 500)
	};


////////////////////////////////////////////////////////////////
	// Extra Widget Methods
////////////////////////////////////////////////////////////////

	ChillerSequencer.prototype.doLayout = ChillerSequencer.prototype.doChanged = ChillerSequencer.prototype.doLoad = function () { render(this); };

	/* FOR FUTURE NOTE: 
	ChillerSequencer.prototype.doChanged = function (name, value) {
		  if(name === 'value') valueChanged += 'prototypeMethod - ';
		  render(this);
	};
	*/

	ChillerSequencer.prototype.doDestroy = function () {
		clearInterval(this.interval);
		this.jq().removeClass('ChillerSequencerOuter');
	};

	return ChillerSequencer;
});

