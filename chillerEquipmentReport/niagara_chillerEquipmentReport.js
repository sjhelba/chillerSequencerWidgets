define(['bajaux/Widget', 'bajaux/mixin/subscriberMixIn', 'nmodule/COREx/rc/d3/d3.min'], function (Widget, subscriberMixIn, d3) {
	"use strict";

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


////////////////////////////////////////////////////////////////
	// Define Widget Constructor & Exposed Properties
////////////////////////////////////////////////////////////////

	var ChillerEquipmentReport = function () {
		var that = this;
		Widget.apply(this, arguments);

		that.properties().addAll([
			{
				name: 'backgroundColor',
				value: 'white',
				typeSpec: 'gx:Color'
			},
			{
				name: 'includeCTFs',
				value: true
			},
			{
				name: 'paddingUnderLegendText',
				value: 5
			},
			{
				name: 'systemName',
				value: 'systemName'
			},
			{
				name: 'tooltipFillColor',
				value: '#f2f2f2',
				typeSpec: 'gx:Color'
			},
			{
				name: 'modulePercentFont',
				value: 'bold 26.0pt Nirmala UI',
				typeSpec: 'gx:Font'
			}
		]);



		subscriberMixIn(that);
	};

	ChillerEquipmentReport.prototype = Object.create(Widget.prototype);
	ChillerEquipmentReport.prototype.constructor = ChillerEquipmentReport;



////////////////////////////////////////////////////////////////
	// /* SETUP DEFINITIONS AND DATA */
////////////////////////////////////////////////////////////////


	const setupDefinitions = widget => {
		// FROM USER // 
		const data = widget.properties().toValueMap();	//obj with all exposed properties as key/value pairs

		// FROM JQ //
		const jq = widget.jq();

		//SIZING
		data.jqHeight = jq.height();
		data.jqWidth = jq.width();
		data.graphicHeight = data.jqHeight - (margin.top + margin.bottom);
		data.graphicWidth = data.jqWidth - (margin.left + margin.right);


		// GLOBALS PER INSTANCE
		if (!widget.hovered) widget.hovered = { optimized: false, standard: false, current: 'neither' };
		if (!widget.activeModule) widget.activeModule = 'none';
		if (!widget.percentIsHovered) widget.percentIsHovered = false;


		// GET DATA
		return widget.resolve(`station:|slot:/tekWorxCEO/${data.systemName}`)	
			.then(system => system.getNavChildren())	// get children folders of system folder
			.then(folders => {
				// calculated without ords
        
        



				// calculated with ords
        
        



				return data;
			})
			.catch(err => console.error('Error (ord info promise rejected): ' + err));
	};




////////////////////////////////////////////////////////////////
	// Render Widget (invoke setupDefinitions() and, using returned data, append D3 elements into SVG)
////////////////////////////////////////////////////////////////

	const renderWidget = (widget, data) => {
    d3.select(widget.svg.node().parentNode).style('background-color', data.backgroundColor);
		// delete leftover elements from versions previously rendered
		if (!widget.svg.empty()) resetElements(widget.svg, '*');
		const graphicGroup = widget.svg.append('g').attr('class', 'graphicGroup');




    
    





	};


	function render(widget, force) {
		// invoking setupDefinitions, then returning value from successful promise to renderWidget func
		return setupDefinitions(widget)
			.then(data => {
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

	ChillerEquipmentReport.prototype.doInitialize = function (element) {
		var that = this;
		element.addClass("ChillerEquipmentReportOuter");
		const outerEl = d3.select(element[0])
			.style('overflow', 'hidden')

		that.svg = outerEl.append('svg')
			.attr('class', 'ChillerEquipmentReport')
			.style('overflow', 'hidden')
			.attr('top', 0)
			.attr('left', 0)
			.attr('width', "100%")
			.attr('height', "100%");

		that.getSubscriber().attach("changed", function (prop, cx) { render(that) });
	};


////////////////////////////////////////////////////////////////
	// Extra Widget Methods
////////////////////////////////////////////////////////////////

	ChillerEquipmentReport.prototype.doLayout = ChillerEquipmentReport.prototype.doChanged = ChillerEquipmentReport.prototype.doLoad = function () { render(this); };

	/* FOR FUTURE NOTE: 
	ChillerEquipmentReport.prototype.doChanged = function (name, value) {
		  if(name === "value") valueChanged += 'prototypeMethod - ';
		  render(this);
	};
	*/

	ChillerEquipmentReport.prototype.doDestroy = function () {
		this.jq().removeClass("ChillerEquipmentReportOuter");
	};

	return ChillerEquipmentReport;
});
