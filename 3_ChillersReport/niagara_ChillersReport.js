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
		Name: 0,
		Status: 1,
		Availability: 2,
		Power: 3,
		Tons: 4,
		Efficiency: 5,
		Details: 6
	};
	const columns = ['Name', 'Status', 'Availability', 'Power', 'Tons', 'Efficiency', 'Details'];
	
	// Set up for data collection (indeces commented)
	const configEvapPoints = ['DP', 'MinimumDP', 'MaximumDP', 'Flow', 'MinimumFlow', 'MaximumFlow', 'EWT', 'LWT', 'MinimumLWT', 'MaximumLWT'];	// 0 - 9
	const configCondPoints = ['DP', 'MinimumDP', 'MaximumDP', 'Flow', 'MinimumFlow', 'MaximumFlow', 'LWT', 'EWT', 'MinimumEWT', 'MaximumEWT'];	// 10 - 19
	const operPowerPoints = ['Tons', 'PercentRLA', 'kW', 'Efficiency'];	// 20 - 23
	const operEvapPoints = ['DP', 'Flow', 'EWT', 'LWT', 'DeltaT'];	// 24 - 28
	const operCondPoints = ['DP', 'Flow', 'EWT', 'LWT', 'DeltaT'];	// 29 - 33
	const operStatusPoints = ['Available', 'Running'];	//34 - 35


	const dataSort = (column, widget) => {
		if (widget.currentSort.column === column) {
			widget.currentSort.ascending = !widget.currentSort.ascending;
		} else {
			widget.currentSort.column = column;
			widget.currentSort.ascending = true;
		}

		widget.sortableTableData = widget.sortableTableData.sort((a, b) => {
			if (widget.currentSort.ascending) {
				return a[columnIndeces[column]].value > b[columnIndeces[column]].value ? 1 : -1;
			} else {
				return b[columnIndeces[column]].value > a[columnIndeces[column]].value ? 1 : -1;
			}
		});
	};

////////////////////////////////////////////////////////////////
	// Define Widget Constructor & Exposed Properties
////////////////////////////////////////////////////////////////

	var MyWidget = function () {
		var that = this;
		Widget.apply(this, arguments);

		that.properties().addAll([
			// {
			// 	name: 'backgroundColor',
			// 	value: 'white',
			// 	typeSpec: 'gx:Color'
			// },
			// {
			// 	name: 'includeCTFs',
			// 	value: true
			// },
			// {
			// 	name: 'paddingUnderLegendText',
			// 	value: 5
			// },
			// {
			// 	name: 'systemName',
			// 	value: 'systemName'
			// },
			// {
			// 	name: 'tooltipFillColor',
			// 	value: '#f2f2f2',
			// 	typeSpec: 'gx:Color'
			// },
			// {
			// 	name: 'modulePercentFont',
			// 	value: 'bold 26.0pt Nirmala UI',
			// 	typeSpec: 'gx:Font'
			// }
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


		// DATA TO POPULATE
		data.unsortableTableData = [];


		// GET DATA
		return widget.resolve(`station:|slot:/tekWorx/Equipment/Chillers`)	
			.then(chillers => chillers.getNavChildren())	// get children folders of chillers folder
			.then(chillerFolders => {

				function getChillerData (chillerFolder) {
					chillerFolder.lease(500000);
					const chillerName = chillerFolder.getNavName()

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
							const chillerDataPoints = batchResolve.getTargetObjects().map(point => point.get('out').get('value') );
							const pointVals = {};
							chillerDataPoints.forEach((pointVal, index) => {
								let pointName;
								if (index < 10) {
									pointName = 'configEvap_' + configEvapPoints[index];
								} else if ( index < 20 ) {
									pointName = 'configCond_' + configCondPoints[index - 10];
								} else if ( index < 24 ) {
									pointName = 'operPower_' + operPowerPoints[index - 20];
								} else if ( index < 29 ) {
									pointName = 'operEvap_' + operEvapPoints[index - 24];
								} else if ( index < 34 ) {
									pointName = 'operCond_' + operCondPoints[index - 29];
								} else {
									pointName = 'operStatus_' + operStatusPoints[index - 34];
								}
								pointVals[pointName] = pointVal;
							});

							const arrForChiller = [
								{column: 'Name', value: chillerName, displayValue: chillerName},
								{column: 'Status', value: pointVals.operStatus_Running ? 'Running' : 'Off', displayValue: pointVals.operStatus_Running ? 'Running' : 'Off'},
								{column: 'Availability', value: pointVals.operStatus_Available ? 'Available' : 'Unavailable', displayValue: pointVals.operStatus_Available ? 'Available' : 'Unavailable'},
								{column: 'Power', value: pointVals.operPower_kW, displayValue: JsUtils.formatValueToPrecision(pointVals.operPower_kW, 0) + ' kW'},
								{column: 'Tons', value: pointVals.operPower_Tons, displayValue: JsUtils.formatValueToPrecision(pointVals.operPower_Tons, 0) + ' tR'},
								{column: 'Efficiency', value: pointVals.operPowerEfficiency, displayValue: JsUtils.formatValueToPrecision(pointVals.operPowerEfficiency, 3) + ' kW/tR'},
								{column: 'Details', value: {
									evaporator: {
										dp: {value: pointVals.operEvap_DP, min: pointVals.configEvap_MinimumDP, max: pointVals.configEvap_MaximumDP, design: pointVals.configEvap_DP, displayValue: JsUtils.formatValueToPrecision(pointVals.operEvap_DP, 1) + ' psi'},
										flow: {value: pointVals.operEvap_Flow, min: pointVals.configEvap_MinimumFlow, max: pointVals.configEvap_MaximumFlow, design: pointVals.configEvap_Flow, displayValue: JsUtils.formatValueToPrecision(pointVals.operEvap_Flow, 0) + ' gpm'},
										lwt: {value: pointVals.operEvap_LWT, min: pointVals.configEvap_MinimumLWT, max: pointVals.configEvap_MaximumLWT, design: pointVals.configEvap_LWT, displayValue: JsUtils.formatValueToPrecision(pointVals.operEvap_LWT, 1) + ' °F'},
										ewt: {value: pointVals.operEvap_EWT, min: pointVals.configEvap_LWT, max: pointVals.configEvap_EWT + (pointVals.configEvap_MaximumLWT - pointVals.configEvap_LWT), design: pointVals.configEvap_EWT, displayValue: JsUtils.formatValueToPrecision(pointVals.operEvap_EWT, 1) + ' °F'},
										dt: {value: pointVals.operEvap_DeltaT, displayValue: JsUtils.formatValueToPrecision(pointVals.operEvap_DeltaT, 1) + ' °F'}
									},
									condenser: {
										dp: {value: pointVals.operCond_DP, min: pointVals.configCond_MinimumDP, max: pointVals.configCond_MaximumDP, design: pointVals.configCond_DP, displayValue: JsUtils.formatValueToPrecision(pointVals.operCond_DP, 1) + ' psi'},
										flow: {value: pointVals.operCond_Flow, min: pointVals.configCond_MinimumFlow, max: pointVals.configCond_MaximumFlow, design: pointVals.configCond_Flow, displayValue: JsUtils.formatValueToPrecision(pointVals.operCond_Flow, 0) + ' gpm'},
										ewt: {value: pointVals.operCond_EWT, min: pointVals.configCond_MinimumEWT, max: pointVals.configCond_MaximumEWT, design: pointVals.configCond_EWT, displayValue: JsUtils.formatValueToPrecision(pointVals.operCond_EWT, 1) + ' °F'},
										lwt: {value: pointVals.operCond_LWT, min: pointVals.configCond_EWT, max: pointVals.configCond_LWT - (pointVals.configCond_MaximumEWT - pointVals.configCond_EWT), design: pointVals.configCond_LWT, displayValue: JsUtils.formatValueToPrecision(pointVals.operCond_LWT, 1) + ' °F'},
										dt: {value: pointVals.operCond_DeltaT, displayValue: JsUtils.formatValueToPrecision(pointVals.operCond_DeltaT, 1) + ' °F'}
									},
									status: {value: pointVals.operPower_PercentRLA, min: 0, max: 100, displayValue: JsUtils.formatValueToPrecision(pointVals.operPower_PercentRLA, 0) + ' %'}
								}}
							];
							
							data.unsortableTableData.push(arrForChiller);
						});
				}

				const chillerDataPromises = chillerFolders.map(chillerFolder => getChillerData(chillerFolder));
				return Promise.all(chillerDataPromises);
			})
			.then(() => {
				// GLOBALS PER INSTANCE
				if (!widget.currentSort) widget.currentSort = { column: 'name', ascending: true }; 
				if (!widget.sortableTableData) widget.sortableTableData = data.unsortableTableData.map(chillers => chillers.map(chiller => Object.assign({}, chiller)));


				return data;
			})
			.catch(err => console.error('Chillers Report Error (ord info promise rejected): ' + err));
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
			.style('overflow', 'hidden');

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

