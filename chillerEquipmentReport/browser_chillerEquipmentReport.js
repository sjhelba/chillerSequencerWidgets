'use strict';
function defineFuncForTabSpacing () {

	////////// Hard Coded Defs //////////
	const getJSDateFromTimestamp = d3.timeParse('%d-%b-%y %I:%M:%S.%L %p UTC%Z');
	const formatIntoPercentage = d3.format('.0%');
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
	const resetElements = (outerWidgetEl, elementsToReset) => {
		const selectionForCheck = outerWidgetEl.selectAll(elementsToReset)
		if (!selectionForCheck.empty()) selectionForCheck.remove();
	};
	const arePrimitiveValsInObjsSame = (obj1, obj2) => !Object.keys(obj1).some(key => (obj1[key] === null || (typeof obj1[key] !== 'object' && typeof obj1[key] !== 'function')) && obj1[key] !== obj2[key])
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
		// check primitives for equivalence
		if (!arePrimitiveValsInObjsSame(lastData, newData)) return true;
		// check nested objs for equivalence
		const monthlyModulesAreSame = checkNestedObjectsEquivalence(lastData.monthlyModulesData, newData.monthlyModulesData, 3);
		const monthlyOverallAreSame = checkNestedObjectsEquivalence(lastData.monthlyOverallData, newData.monthlyOverallData, 2);
		const annualModulesAreSame = checkNestedObjectsEquivalence(lastData.annualModulesData, newData.annualModulesData, 2);
		const annualOverallAreSame = checkNestedObjectsEquivalence(lastData.annualOverallData, newData.annualOverallData, 1);
		if (!monthlyModulesAreSame || !monthlyOverallAreSame || !annualModulesAreSame || !annualOverallAreSame) return true;

		//return false if nothing prompted true
		return false;
	};
	const margin = {top: 5, left: 5, right: 5, bottom: 5};

//chiller equipment report








	////////////////////////////////////////////////////////////////
		// Define Widget Constructor & Exposed Properties
	////////////////////////////////////////////////////////////////
	const properties = [
		/* COLORS */
		//fills
		{
			name: 'backgroundColor',
			value: 'white',
			typeSpec: 'gx:Color'
		},
		//strokes
		{
			name: 'gridStrokeColor',
			value: 'grey',
			typeSpec: 'gx:Color'
		},
		//text
		{
			name: 'xAxisTicksTextColor',
			value: 'black',
			typeSpec: 'gx:Color'
		},
		/* FONT */
		{
			name: 'xAxisTicksTextFont',
			value: 'bold 8.0pt Nirmala UI',
			typeSpec: 'gx:Font'
		},
	/* PADDING */
		{
			name: 'paddingBetweenTHINGS',
			value: 5
		},
	/* OTHER */
		{
			name: 'overrideDefaultPrecisionWFacets',
			value: false
		},
		{
			name: 'minDegreesCategory',
			value: 30
		},
	];



	////////////////////////////////////////////////////////////////
		// /* SETUP DEFINITIONS AND DATA */
	////////////////////////////////////////////////////////////////
	const setupDefinitions = widget => {
		// FROM USER // 
		const data = {};
		properties.forEach(prop => data[prop.name] = prop.value);

		// FROM JQ //
		data.jqHeight = 550;
		data.jqWidth = 550;

		// SIZING //
		data.graphicHeight = data.jqHeight - (margin.top + margin.bottom);
		data.graphicWidth = data.jqWidth - (margin.left + margin.right);

		// GLOBALS PER INSTANCE //
		if (!widget.hovered) widget.hovered = { optimized: false, standard: false, current: 'neither' };
		if (!widget.activeModule) widget.activeModule = 'none';
		if (!widget.percentIsHovered) widget.percentIsHovered = false;

		// DATA TO POPULATE //
		data.fakeData = [];

		// FAKE DATA //
		const populateFakeData = () => {
			data.fakeData.unshift('datum1');




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
		// ********************************************* DRAW ******************************************************* //
		widget.outerDiv 
			.style('height', data.jqHeight + 'px')	//only for browser
			.style('width', data.jqWidth + 'px')		//only for browser

		widget.svg 
			.attr('height', data.jqHeight + 'px')
			.attr('width', data.jqWidth + 'px')
			
		d3.select(widget.svg.node().parentNode).style('background-color', data.backgroundColor);
		
		// delete leftover elements from versions previously rendered
		if (!widget.svg.empty()) resetElements(widget.svg, '*');

		// ********************************************* GRAPHIC GROUP ******************************************************* //
		const graphicGroup = widget.svg.append('g').attr('class', 'graphicGroup');
		const tooltipGroup = graphicGroup.append('g').attr('class', 'tooltipGroup').attr('transform', 'translate(300, 140)')
		
		const DPMeter = new Meter(graphicGroup, tooltipGroup, 'white', '#33adff', 30, 150, 'DP', 'psi', 1, '10.0pt Nirmala UI', 'bold 8.0pt Nirmala UI', 'bold 11.0pt Nirmala UI', 4.7386745645, 0.1, 8.5, 4)
		DPMeter.create();

		const tonsGroup = graphicGroup.append('g').attr('transform', 'translate(0, 120)')
		const tonsMeter = new Meter(tonsGroup, tooltipGroup, 'white', '#004d80', 30, 150, 'Tons', 'tR', 0, '10.0pt Nirmala UI', 'bold 8.0pt Nirmala UI', 'bold 11.0pt Nirmala UI', 760, 0, 1000);
		tonsMeter.create();

		setTimeout(() => {
			DPMeter.redrawWithNewArgs({meterVal: 2, maxVal: 7});
		}, 2000)
		setTimeout(() => {
			DPMeter.redrawWithNewArgs({meterVal: 6});
		}, 7000)

		const efficiencyGroup = graphicGroup.append('g').attr('transform', 'translate(0, 320)')
		const efficiencyMeter = new Meter(efficiencyGroup, tooltipGroup, 'white', '#00cc00', 30, 150, 'Efficiency', 'kW/tR', 3, '10.0pt Nirmala UI', 'bold 8.0pt Nirmala UI', 'bold 11.0pt Nirmala UI', 0.540, 2, 0);
		efficiencyMeter.create();

		setTimeout(() => {
			efficiencyMeter.redrawWithNewArgs({meterVal: 0.9});
		}, 7000)
 
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