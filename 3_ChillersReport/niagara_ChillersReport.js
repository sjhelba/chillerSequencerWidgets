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
		Item: 0,
		Status: 1,
		Availability: 2,
		Power: 3,
		Tons: 4,
		Efficiency: 5,
		Details: 6
	};
	const columns = ['Item', 'Status', 'Availability', 'Power', 'Tons', 'Efficiency', 'Details'];
	
	// Set up for data collection (indeces commented)
	const configEvapPoints = ['DP', 'MinimumDP', 'MaximumDP', 'Flow', 'MinimumFlow', 'MaximumFlow', 'EWT', 'LWT', 'MinimumLWT', 'MaximumLWT'];	// 0 - 9
	const configCondPoints = ['DP', 'MinimumDP', 'MaximumDP', 'Flow', 'MinimumFlow', 'MaximumFlow', 'LWT', 'EWT', 'MinimumEWT', 'MaximumEWT'];	// 10 - 19
	const operPowerPoints = ['Tons', 'PercentRLA', 'kW', 'Efficiency'];	// 20 - 23
	const operEvapPoints = ['DP', 'Flow', 'EWT', 'LWT', 'DeltaT'];	// 24 - 28
	const operCondPoints = ['DP', 'Flow', 'EWT', 'LWT', 'DeltaT'];	// 29 - 33
	const operStatusPoints = ['Available', 'Running', 'Called'];	//34 - 36


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
			{
				name: 'overrideDefaultPrecisionWFacets',
				value: false
			},
			{
				name: 'overrideDefaultUnitsWFacets',
				value: false
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


		// DATA TO POPULATE
		data.unsortableTableData = [];


		// GET DATA
		return widget.resolve(`station:|slot:/tekWorx/Equipment/Chillers`)	
			.then(chillers => chillers.getNavChildren())	// get children folders of chillers folder
			.then(chillerFolders => {

				function getChillerData (chillerFolder, chillerIndex) {
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
							const chillerDataPoints = batchResolve.getTargetObjects().map(point => {
								const pointValue = point.get('out').get('value');
								const obj = {val: pointValue};
								if (!isNaN(pointValue)){
									const facets = point.get('facets');
									obj.precision = data.overrideDefaultPrecisionWFacets ? facets.get('precision') : false;
									obj.units = data.overrideDefaultUnitsWFacets ? facets.get('units') : false;
								}
								return obj;
							});
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
								{column: 'Item', value: chillerIndex, displayValue: chillerName},
								{column: 'Status', value: pointVals.operStatus_Running.val ? 'Running' : 'Off', displayValue: pointVals.operStatus_Running.val ? 'Running' : 'Off', exclamation: pointVals.operStatus_Running.val && !pointVals.operStatus_Called.val ? true : false },
								{column: 'Availability', value: pointVals.operStatus_Available.val ? 'Available' : 'Unavailable', displayValue: pointVals.operStatus_Available.val ? 'Available' : 'Unavailable'},
								{column: 'Power', value: pointVals.operPower_kW.val, displayValue: JsUtils.formatValueToPrecision(pointVals.operPower_kW.val, pointVals.operPower_kW.precision || 0) + ' ' + pointVals.operPower_kW.units || 'kW'},
								{column: 'Tons', value: pointVals.operPower_Tons.val, displayValue: JsUtils.formatValueToPrecision(pointVals.operPower_Tons.val, pointVals.operPower_Tons.precision || 0) + ' ' + pointVals.operPower_Tons.units || 'tR'},
								{column: 'Efficiency', value: pointVals.operPowerEfficiency.val, displayValue: JsUtils.formatValueToPrecision(pointVals.operPowerEfficiency.val, pointVals.operPowerEfficiency.precision || 3) + ' ' + pointVals.operPowerEfficiency.units || 'kW/tR'},
								{column: 'Details', value: {
									evaporator: {
										dp: {value: pointVals.operEvap_DP.val, min: pointVals.configEvap_MinimumDP.val, max: pointVals.configEvap_MaximumDP.val, design: pointVals.configEvap_DP.val, units: pointVals.configEvap_DP.units || 'psi', precision: pointVals.configEvap_DP.precision || 1},
										flow: {value: pointVals.operEvap_Flow.val, min: pointVals.configEvap_MinimumFlow.val, max: pointVals.configEvap_MaximumFlow.val, design: pointVals.configEvap_Flow.val, units: pointVals.configEvap_Flow.units || 'gpm', precision: pointVals.configEvap_Flow.precision || 0},
										lwt: {value: pointVals.operEvap_LWT.val, min: pointVals.configEvap_MinimumLWT.val, max: pointVals.configEvap_MaximumLWT.val, design: pointVals.configEvap_LWT.val, units: pointVals.configEvap_LWT.units || '°F', precision: pointVals.configEvap_LWT.precision || 1},
										ewt: {value: pointVals.operEvap_EWT.val, min: pointVals.configEvap_LWT.val, max: pointVals.configEvap_EWT + (pointVals.configEvap_MaximumLWT - pointVals.configEvap_LWT), design: pointVals.configEvap_EWT.val, units: pointVals.operEvap_EWT.units || '°F', precision: pointVals.operEvap_EWT.precision || 1},
										dt: {value: pointVals.operEvap_DeltaT.val, displayValue: JsUtils.formatValueToPrecision(pointVals.operEvap_DeltaT.val, pointVals.operEvap_DeltaT.precision || 1) + ' ' + pointVals.operEvap_DeltaT.units || '°F'}
									},
									condenser: {
										dp: {value: pointVals.operCond_DP.val, min: pointVals.configCond_MinimumDP.val, max: pointVals.configCond_MaximumDP.val, design: pointVals.configCond_DP.val, units: pointVals.operCond_DP.units || 'psi', precision: pointVals.operCond_DP.precision || 1},
										flow: {value: pointVals.operCond_Flow.val, min: pointVals.configCond_MinimumFlow.val, max: pointVals.configCond_MaximumFlow.val, design: pointVals.configCond_Flow.val, units: pointVals.operCond_Flow.units || 'gpm', precision: pointVals.operCond_Flow.precision || 0},
										ewt: {value: pointVals.operCond_EWT.val, min: pointVals.configCond_MinimumEWT.val, max: pointVals.configCond_MaximumEWT.val, design: pointVals.configCond_EWT.val, units: pointVals.operCond_EWT.units || '°F', precision: pointVals.operCond_EWT.precision || 1},
										lwt: {value: pointVals.operCond_LWT.val, min: pointVals.configCond_EWT.val, max: pointVals.configCond_LWT - (pointVals.configCond_MaximumEWT - pointVals.configCond_EWT), design: pointVals.configCond_LWT.val, units: pointVals.operCond_LWT.units || '°F', precision: pointVals.operCond_LWT.precision || 1},
										dt: {value: pointVals.operCond_DeltaT.val, displayValue: JsUtils.formatValueToPrecision(pointVals.operCond_DeltaT.val, pointVals.operCond_DeltaT.precision || 1) + ' ' + pointVals.operCond_DeltaT.units || '°F'}
									},
									status: {value: pointVals.operPower_PercentRLA.val, min: 0, max: 100, units: pointVals.operPower_PercentRLA.units || '%', precision: pointVals.operPower_PercentRLA.precision || 0}
								}}
							];
							
							data.unsortableTableData.push(arrForChiller);
						});
				}

				const chillerDataPromises = chillerFolders.map((chillerFolder, chillerIndex) => getChillerData(chillerFolder, chillerIndex));
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

