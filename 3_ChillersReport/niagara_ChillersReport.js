/* global JsUtils */

define(['bajaux/Widget', 'bajaux/mixin/subscriberMixIn', 'nmodule/COREx/rc/d3/d3.min', 'baja!', 'nmodule/COREx/rc/jsClasses/JsUtils'], function (Widget, subscriberMixIn, d3, baja, JsUtils) {
	'use strict';

////////// Hard Coded Defs //////////
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
	const margin = 5;
	const columnIndeces = {
		name: 0,
		status: 1,
		availability: 2,
		power: 3,
		tons: 4,
		efficiency: 5,
		details: 6
	};
	const columns = ['name', 'status', 'availability', 'power', 'tons', 'efficiency', 'details']

////////////////////////////////////////////////////////////////
	// Define Widget Constructor & Exposed Properties
////////////////////////////////////////////////////////////////

	var MyWidget = function () {
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

	MyWidget.prototype = Object.create(Widget.prototype);
	MyWidget.prototype.constructor = MyWidget;



////////////////////////////////////////////////////////////////
	// /* SETUP DEFINITIONS AND DATA */
////////////////////////////////////////////////////////////////


	const setupDefinitions = widget => {
		// FROM USER // 
		const data = widget.properties().toValueMap();	//obj with all exposed properties as key/value pairs

		// FROM JQ //
		const jq = widget.jq();

		//SIZING
		data.jqHeight = jq.height() || 400;
		data.jqWidth = jq.width() || 350;
		data.graphicHeight = data.jqHeight - (margin * 2);
		data.graphicWidth = data.jqWidth - (margin * 2);


		// GLOBALS PER INSTANCE
		if (!widget.hovered) widget.hovered = { optimized: false, standard: false, current: 'neither' };
		if (!widget.activeModule) widget.activeModule = 'none';
		if (!widget.percentIsHovered) widget.percentIsHovered = false;


		// DATA TO POPULATE
		data.sortableTableData = [];


		// GET DATA
		return widget.resolve(`station:|slot:/tekWorx/Equipment/Chillers`)	
			.then(chillers => chillers.getNavChildren())	// get children folders of chillers folder
			.then(chillerFolders => {

				function getChillerData (chillerFolder) {
					const arrForChiller = [];
					chillerFolder.lease(500000);

					const chillerName = chillerFolder.getNavName()
					arrForChiller.push({column: 'name', value: chillerName, displayValue: chillerName})

					const configEvapPoints = [];
					const configCondPoints = [];
					const operPowerPoints = [];
					const operEvapPoints = [];
					const operCondPoints = [];
					const operStatusPoints = [];

					const arrayToResolve = configEvapPoints.map(point => `station:|slot:/tekWorx/Equipment/Chillers/${chillerName}/Configuration/Evaporator/${point}`)
						.concat(configCondPoints.map(point => `station:|slot:/tekWorx/Equipment/Chillers/${chillerName}/Configuration/Condenser/${point}`))
						.concat(operPowerPoints.map(point => `station:|slot:/tekWorx/Equipment/Chillers/${chillerName}/Operating/Power/${point}`))
						.concat(operEvapPoints.map(point => `station:|slot:/tekWorx/Equipment/Chillers/${chillerName}/Operating/Evaporator/${point}`))
						.concat(operCondPoints.map(point => `station:|slot:/tekWorx/Equipment/Chillers/${chillerName}/Operating/Condenser/${point}`))
						.concat(operStatusPoints.map(point => `station:|slot:/tekWorx/Equipment/Chillers/${chillerName}/Operating/Status/${point}`));


					const batchResolve = new baja.BatchResolve(arrayToResolve);
					const sub = new baja.Subscriber();

					return batchResolve.resolve({ subscriber: sub })
						.then(() => {
							const chillerDataPoints = batchResolve.getTargetObjects();

							const arrForChiller = [
								{column: 'name', value: chillerName, displayValue: chillerName},
								{column: 'status', value: 0, dispalyValue: ''},
								{column: 'availability', value: 0, dispalyValue: ''},
								{column: 'power', value: 0, dispalyValue: ''},
								{column: 'tons', value: 0, dispalyValue: ''},
								{column: 'efficiency', value: 0, dispalyValue: ''},
								{column: 'details', value: {
									evaporator: {
										dp: {value: 0, precision: 1, units: '°F', min: 0, max: 0, design: 0},
										flow: {value: 0, precision: 1, units: '°F', min: 0, max: 0, design: 0},
										lwt: {value: 0, precision: 1, units: '°F', min: 0, max: 0, design: 0},
										ewt: {value: 0, precision: 1, units: '°F', min: 0, max: 0, design: 0},
										dt: {value: 0, precision: 1, units: '°F'}
									},
									condenser: {
										dp: {value: 0, precision: 1, units: 'psi', min: 0, max: 0, design: 0},
										flow: {value: 0, precision: 1, units: 'gpm', min: 0, max: 0, design: 0},
										ewt: {value: 0, precision: 1, units: '°F', min: 0, max: 0, design: 0},
										lwt: {value: 0, precision: 1, units: '°F', min: 0, max: 0, design: 0},
										dt: {value: 0, precision: 1, units: '°F'}
									},
									status: {value: 0, precision: 0, units: '%', min: 0, max: 100}
								}}
							];
							data.sortableTableData.push(arrForChiller);
						})




				}

				const chillerDataPromises = chillerFolders.map(chillerFolder => getChillerData(chillerFolder));
				return Promise.all(chillerDataPromises);


			})
			.then (() => {

        
        



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
		if (!widget.svg.empty()) JsUtils.resetElements(widget.svg, '*');
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

	MyWidget.prototype.doInitialize = function (element) {
		var that = this;
		element.addClass('MyWidgetOuter');
		const outerEl = d3.select(element[0])
			.style('overflow', 'hidden')

		that.svg = outerEl.append('svg')
			.attr('class', 'MyWidget')
			.style('overflow', 'hidden')
			.attr('top', 0)
			.attr('left', 0)
			.attr('width', '100%')
			.attr('height', '100%');

		that.getSubscriber().attach('changed', function (prop, cx) { render(that) });
	};


////////////////////////////////////////////////////////////////
	// Extra Widget Methods
////////////////////////////////////////////////////////////////

	MyWidget.prototype.doLayout = MyWidget.prototype.doChanged = MyWidget.prototype.doLoad = function () { render(this); };

	/* FOR FUTURE NOTE: 
	MyWidget.prototype.doChanged = function (name, value) {
		  if(name === 'value') valueChanged += 'prototypeMethod - ';
		  render(this);
	};
	*/

	MyWidget.prototype.doDestroy = function () {
		this.jq().removeClass('MyWidgetOuter');
	};

	return MyWidget;
});

