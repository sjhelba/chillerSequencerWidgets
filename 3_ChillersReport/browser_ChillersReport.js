/* global JsUtils */

function defineFuncForTabSpacing () {

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
	const properties = [
		{
			name: 'overrideDefaultPrecisionWFacets',
			value: false
		},
		{
			name: 'overrideDefaultUnitsWFacets',
			value: false
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
		data.jqHeight = 270;
		data.jqWidth = 680;

		// SIZING //
		data.graphicHeight = data.jqHeight - (margin * 2);
		data.graphicWidth = data.jqWidth - (margin * 2);



		// DATA TO POPULATE //
		data.unsortableTableData = [];


		

		// FAKE DATA //
		const populateFakeData = () => {

			// FAKE DATA
				data.unsortableTableData.push([
					{column: 'Item', value: 0, displayValue: 'Chiller 1'},
					{column: 'Status', value: 'Running', displayValue: 'Running'},
					{column: 'Availability', value: 'Available', displayValue: 'Available'},
					{column: 'Power', value: 5, displayValue: JsUtils.formatValueToPrecision(5, 0) + ' kW'},
					{column: 'Tons', value: 30, displayValue: JsUtils.formatValueToPrecision(30, 0) + ' tR'},
					{column: 'Efficiency', value: 0.897563453, displayValue: JsUtils.formatValueToPrecision(0.897563453, 3) + ' kW/tR'},
					{column: 'Details', value: {
						evaporator: {
							dp: {value: 10, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 50, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							lwt: {value: 60, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							ewt: {value: 20, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 30, displayValue: JsUtils.formatValueToPrecision(30, 1) + ' °F'}
						},
						condenser: {
							dp: {value: 30, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 60, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							ewt: {value: 30, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							lwt: {value: 50, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 20, displayValue: JsUtils.formatValueToPrecision(20, 1) + ' °F'}
						},
						status: {value: 38, min: 0, max: 100, design: 50, precision: 0, units: '%'}
					}}
				]);

				data.unsortableTableData.push([
					{column: 'Item', value: 1, displayValue: 'Chiller 2'},
					{column: 'Status', value: 'Off', displayValue: 'Off'},
					{column: 'Availability', value: 'Available', displayValue: 'Available'},
					{column: 'Power', value: 2, displayValue: JsUtils.formatValueToPrecision(2, 0) + ' kW'},
					{column: 'Tons', value: 40, displayValue: JsUtils.formatValueToPrecision(40, 0) + ' tR'},
					{column: 'Efficiency', value: 1.0175634530, displayValue: JsUtils.formatValueToPrecision(1.0175634530, 3) + ' kW/tR'},
					{column: 'Details', value: {
						evaporator: {
							dp: {value: 20, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 90, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							lwt: {value: 40, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							ewt: {value: 20, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 50, displayValue: JsUtils.formatValueToPrecision(50, 1) + ' °F'}
						},
						condenser: {
							dp: {value: 40, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 90, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							ewt: {value: 40, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							lwt: {value: 20, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 40, displayValue: JsUtils.formatValueToPrecision(40, 1) + ' °F'}
						},
						status: {value: 38, min: 0, max: 100, design: 50, precision: 0, units: '%'}
					}}
				]);

				data.unsortableTableData.push([
					{column: 'Item', value: 2, displayValue: 'Chiller 3'},
					{column: 'Status', value: 'Off', displayValue: 'Off'},
					{column: 'Availability', value: 'Unavailable', displayValue: 'Unavailable'},
					{column: 'Power', value: 7, displayValue: JsUtils.formatValueToPrecision(7, 0) + ' kW'},
					{column: 'Tons', value: 20, displayValue: JsUtils.formatValueToPrecision(20, 0) + ' tR'},
					{column: 'Efficiency', value: 1.5475634530, displayValue: JsUtils.formatValueToPrecision(1.5475634530, 3) + ' kW/tR'},
					{column: 'Details', value: {
						evaporator: {
							dp: {value: 70, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 80, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							lwt: {value: 30, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							ewt: {value: 10, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 70, displayValue: JsUtils.formatValueToPrecision(70, 1) + ' °F'}
						},
						condenser: {
							dp: {value: 10, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 10, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							ewt: {value: 70, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							lwt: {value: 90, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 30, displayValue: JsUtils.formatValueToPrecision(30, 1) + ' °F'}
						},
						status: {value: 38, min: 0, max: 100, design: 50, precision: 0, units: '%'}
					}}
				]);

				data.unsortableTableData.push([
					{column: 'Item', value: 3, displayValue: 'Chiller 4'},
					{column: 'Status', value: 'Off', displayValue: 'Off'},
					{column: 'Availability', value: 'Available', displayValue: 'Available'},
					{column: 'Power', value: 20, displayValue: JsUtils.formatValueToPrecision(20, 0) + ' kW'},
					{column: 'Tons', value: 80, displayValue: JsUtils.formatValueToPrecision(80, 0) + ' tR'},
					{column: 'Efficiency', value: 0.688634530, displayValue: JsUtils.formatValueToPrecision(0.688634530, 3) + ' kW/tR'},
					{column: 'Details', value: {
						evaporator: {
							dp: {value: 90, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 20, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							lwt: {value: 60, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							ewt: {value: 60, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 30, displayValue: JsUtils.formatValueToPrecision(30, 1) + ' °F'}
						},
						condenser: {
							dp: {value: 50, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 90, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							ewt: {value: 20, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							lwt: {value: 60, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 50, displayValue: JsUtils.formatValueToPrecision(50, 1) + ' °F'}
						},
						status: {value: 38, min: 0, max: 100, design: 50, precision: 0, units: '%'}
					}}
				]);

				data.unsortableTableData.push([
					{column: 'Item', value: 4, displayValue: 'Chiller 5'},
					{column: 'Status', value: 'Running', displayValue: 'Running'},
					{column: 'Availability', value: 'Available', displayValue: 'Available'},
					{column: 'Power', value: 5, displayValue: JsUtils.formatValueToPrecision(5, 0) + ' kW'},
					{column: 'Tons', value: 10, displayValue: JsUtils.formatValueToPrecision(10, 0) + ' tR'},
					{column: 'Efficiency', value: 1.8975634530, displayValue: JsUtils.formatValueToPrecision(1.8975634530, 3) + ' kW/tR'},
					{column: 'Details', value: {
						evaporator: {
							dp: {value: 70, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 20, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							lwt: {value: 50, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							ewt: {value: 70, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 20, displayValue: JsUtils.formatValueToPrecision(20, 1) + ' °F'}
						},
						condenser: {
							dp: {value: 10, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 60, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							ewt: {value: 50, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							lwt: {value: 20, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 60, displayValue: JsUtils.formatValueToPrecision(60, 1) + ' °F'}
						},
						status: {value: 38, min: 0, max: 100, design: 50, precision: 0, units: '%'}
					}}
				]);

				data.unsortableTableData.push([
					{column: 'Item', value: 5, displayValue: 'Chiller 6'},
					{column: 'Status', value: 'Off', displayValue: 'Off'},
					{column: 'Availability', value: 'Unavailable', displayValue: 'Unavailable'},
					{column: 'Power', value: 7, displayValue: JsUtils.formatValueToPrecision(7, 0) + ' kW'},
					{column: 'Tons', value: 20, displayValue: JsUtils.formatValueToPrecision(20, 0) + ' tR'},
					{column: 'Efficiency', value: 1.5475634530, displayValue: JsUtils.formatValueToPrecision(1.5475634530, 3) + ' kW/tR'},
					{column: 'Details', value: {
						evaporator: {
							dp: {value: 70, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 80, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							lwt: {value: 30, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							ewt: {value: 10, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 70, displayValue: JsUtils.formatValueToPrecision(70, 1) + ' °F'}
						},
						condenser: {
							dp: {value: 10, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 10, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							ewt: {value: 70, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							lwt: {value: 90, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 30, displayValue: JsUtils.formatValueToPrecision(30, 1) + ' °F'}
						},
						status: {value: 38, min: 0, max: 100, design: 50, precision: 0, units: '%'}
					}}
				]);

				data.unsortableTableData.push([
					{column: 'Item', value: 6, displayValue: 'Chiller 7'},
					{column: 'Status', value: 'Off', displayValue: 'Off'},
					{column: 'Availability', value: 'Available', displayValue: 'Available'},
					{column: 'Power', value: 20, displayValue: JsUtils.formatValueToPrecision(20, 0) + ' kW'},
					{column: 'Tons', value: 80, displayValue: JsUtils.formatValueToPrecision(80, 0) + ' tR'},
					{column: 'Efficiency', value: 0.688634530, displayValue: JsUtils.formatValueToPrecision(0.688634530, 3) + ' kW/tR'},
					{column: 'Details', value: {
						evaporator: {
							dp: {value: 90, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 20, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							lwt: {value: 60, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							ewt: {value: 60, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 30, displayValue: JsUtils.formatValueToPrecision(30, 1) + ' °F'}
						},
						condenser: {
							dp: {value: 50, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 90, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							ewt: {value: 20, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							lwt: {value: 60, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 50, displayValue: JsUtils.formatValueToPrecision(50, 1) + ' °F'}
						},
						status: {value: 38, min: 0, max: 100, design: 50, precision: 0, units: '%'}
					}}
				]);

				data.unsortableTableData.push([
					{column: 'Item', value: 7, displayValue: 'Chiller 8'},
					{column: 'Status', value: 'Running', displayValue: 'Running'},
					{column: 'Availability', value: 'Available', displayValue: 'Available'},
					{column: 'Power', value: 5, displayValue: JsUtils.formatValueToPrecision(5, 0) + ' kW'},
					{column: 'Tons', value: 10, displayValue: JsUtils.formatValueToPrecision(10, 0) + ' tR'},
					{column: 'Efficiency', value: 1.8975634530, displayValue: JsUtils.formatValueToPrecision(1.8975634530, 3) + ' kW/tR'},
					{column: 'Details', value: {
						evaporator: {
							dp: {value: 70, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 20, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							lwt: {value: 50, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							ewt: {value: 70, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 20, displayValue: JsUtils.formatValueToPrecision(20, 1) + ' °F'}
						},
						condenser: {
							dp: {value: 10, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 60, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							ewt: {value: 50, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							lwt: {value: 20, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 60, displayValue: JsUtils.formatValueToPrecision(60, 1) + ' °F'}
						},
						status: {value: 38, min: 0, max: 100, design: 50, precision: 0, units: '%'}
					}}
				]);

				data.unsortableTableData.push([
					{column: 'Item', value: 8, displayValue: 'Chiller 9'},
					{column: 'Status', value: 'Off', displayValue: 'Off'},
					{column: 'Availability', value: 'Available', displayValue: 'Available'},
					{column: 'Power', value: 20, displayValue: JsUtils.formatValueToPrecision(20, 0) + ' kW'},
					{column: 'Tons', value: 80, displayValue: JsUtils.formatValueToPrecision(80, 0) + ' tR'},
					{column: 'Efficiency', value: 0.688634530, displayValue: JsUtils.formatValueToPrecision(0.688634530, 3) + ' kW/tR'},
					{column: 'Details', value: {
						evaporator: {
							dp: {value: 90, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 20, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							lwt: {value: 60, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							ewt: {value: 60, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 30, displayValue: JsUtils.formatValueToPrecision(30, 1) + ' °F'}
						},
						condenser: {
							dp: {value: 50, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 90, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							ewt: {value: 20, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							lwt: {value: 60, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 50, displayValue: JsUtils.formatValueToPrecision(50, 1) + ' °F'}
						},
						status: {value: 38, min: 0, max: 100, design: 50, precision: 0, units: '%'}
					}}
				]);

				data.unsortableTableData.push([
					{column: 'Item', value: 9, displayValue: 'Chiller 10'},
					{column: 'Status', value: 'Running', displayValue: 'Running'},
					{column: 'Availability', value: 'Available', displayValue: 'Available'},
					{column: 'Power', value: 5, displayValue: JsUtils.formatValueToPrecision(5, 0) + ' kW'},
					{column: 'Tons', value: 10, displayValue: JsUtils.formatValueToPrecision(10, 0) + ' tR'},
					{column: 'Efficiency', value: 1.8975634530, displayValue: JsUtils.formatValueToPrecision(1.8975634530, 3) + ' kW/tR'},
					{column: 'Details', value: {
						evaporator: {
							dp: {value: 70, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 20, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							lwt: {value: 50, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							ewt: {value: 70, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 20, displayValue: JsUtils.formatValueToPrecision(20, 1) + ' °F'}
						},
						condenser: {
							dp: {value: 10, min: 0, max: 100, design: 50, precision: 1, units: 'psi'},
							flow: {value: 60, min: 0, max: 100, design: 50, precision: 0, units: 'gpm'},
							ewt: {value: 50, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							lwt: {value: 20, min: 0, max: 100, design: 50, precision: 1, units: '°F'},
							dt: {value: 60, displayValue: JsUtils.formatValueToPrecision(60, 1) + ' °F'}
						},
						status: {value: 38, min: 0, max: 100, design: 50, precision: 0, units: '%'}
					}}
				]);

		};



		// CALCULATED DEFS //
		const calculateDefs = () => {
			// GLOBALS PER INSTANCE
			if (!widget.currentSort) widget.currentSort = { column: 'Item', ascending: true }; 
			if (!widget.sortableTableData) widget.sortableTableData = data.unsortableTableData.map(chillers => chillers.map(chiller => Object.assign({}, chiller)));


			return data;
		};

		populateFakeData();
		return calculateDefs();
	};
		




	////////////////////////////////////////////////////////////////
		// RenderWidget Func
	////////////////////////////////////////////////////////////////

	const renderWidget = (widget, data) => {

		widget.outerDiv 
			.style('height', data.jqHeight + 'px')	//only for browser
			.style('width', data.jqWidth + 'px')		//only for browser

		// ********************************************* SIZING ETC ******************************************************* //
		const tableWidth = 680;
		const colWidth = (tableWidth / 6) - 1;

		const tableHeight = data.graphicHeight;
		const headerHeight = 30;
		const maxTbodyHeight = tableHeight - headerHeight;
		const rowHeight = 25;
		const detailsHeight = 180;
		const openRowHeight = detailsHeight + rowHeight;


		const headerAndDetailsFill = '#425867'
		const evenNumberRowFill = '#e0e0e0'
		const oddNumberRowFill = '#E5E5E5'

		const fonts = {
			Item: 'bold 12pt Nirmala UI',
			Status: 'bold 12pt Nirmala UI',
			Availability: 'bold 12pt Nirmala UI',
			Power: '12pt Nirmala UI',
			Tons: '12pt Nirmala UI',
			Efficiency: '12pt Nirmala UI',
			headers: '10pt Nirmala UI',
			detailsSectionTitle: 'bold 10pt Nirmala UI',
			detailsValue: 'bold 10pt Nirmala UI',
			detailsLabel: '10pt Nirmala UI'
		}

		// ********************************************* DRAW ******************************************************* //
		widget.graphicDiv 
			.attr('width', tableWidth + 'px')
			.attr('height', tableHeight + 'px')
		d3.select(widget.graphicDiv.node().parentNode).style('background-color', data.backgroundColor);
		// delete leftover elements from versions previously rendered
		if (!widget.graphicDiv.empty()) JsUtils.resetElements(widget.graphicDiv, '*');

		widget.graphicDiv.attr('transform', `translate(${margin}, ${margin})`);

		const table = widget.graphicDiv.append('table')
			.style('background-color', 'white')
			.style('width', tableWidth + 20 + 'px')
			.style('border-collapse', 'collapse')
			.style('text-align', 'center')
			.style('cursor', 'default')
	

		const thead = table.append('thead')
			.style('display', 'block')
			.style('width', tableWidth + 'px')
			.style('height', headerHeight + 'px')
			.style('background-color', headerAndDetailsFill);

		const tbody = table.append('tbody')
			.style('display', 'block')
			.style('max-height', maxTbodyHeight + 'px')
			.style('overflow-y', 'auto')	//or scroll	
			.style('width', tableWidth + 'px')

		// ********************************************* THEAD ******************************************************* //
		const headerRow = thead.append('tr')
			.style('height', headerHeight + 'px')
			.style('color', 'white')
			// .style('border-bottom', '2px solid black')

		const headerCols = headerRow.selectAll('th')
			.data(columns.slice(0, -1))	//don't include Details
			.enter().append('th')
				.html(d => d)
				.style('width', colWidth + 'px')
				.style('font', fonts.headers)
				.attr('class', d => `header ${d}Header`)
				.on('click', function(d){
					dataSort(d, widget);
					drawTbody();
				});


		// ********************************************* TBODY ******************************************************* //
		const drawTbody = () => {
			if (!tbody.empty()) tbody.selectAll('*').remove();

			const rows = tbody.selectAll('.row')
				.data(widget.sortableTableData)
				.enter().append('tr')
					.attr('class', 'row')
					.style('background-color', (d, i) => i%2 ? evenNumberRowFill : oddNumberRowFill)
					.attr('data-index', (d, i) => i)
			
			const cells = rows.selectAll('.cell')
				.data(d => d.filter(obj => obj.column !== 'Details') )
				.enter().append('td')
					.attr('class', function(d) {return `cell ${d.column}Cell row${this.parentNode.getAttribute('data-index')}Cell`}) 
					.attr('data-index', function(){return this.parentNode.getAttribute('data-index')})
					.style('width', colWidth + 'px')
					.style('height', rowHeight + 'px')
					.style('vertical-align', 'top')
					// .attr('y', d => (rowHeight / 2) - (JsUtils.getTextHeight(fonts[d.column]) / 2) )
					.style('overflow', 'hidden')
			
			cells.append('div')
				.attr('data-index', function(){return this.parentNode.getAttribute('data-index')})
				.style('width', colWidth + 'px')
				.style('height', rowHeight + 'px')
				.style('display', 'table-cell')
				.style('vertical-align', 'middle')
				.html(d => d.displayValue)
				.style('font', d => fonts[d.column])





			// ********************************************* DETAILS ******************************************************* //

			const svgs = rows.append('svg')
				.attr('class', function(d) {return `svg row${this.parentNode.getAttribute('data-index')}Svg`})
				.attr('data-index', function(){return this.parentNode.getAttribute('data-index')})
				.style('width', tableWidth + 'px')
				.style('height', rowHeight + 'px')
				.style('margin-left', `-${tableWidth}px`)
				.on('click', function() {
					const currentHeight = d3.select(this).style('height')
					const rowIndex = +this.parentNode.getAttribute('data-index');
					const thisRowCells = d3.selectAll(`.row${rowIndex}Cell,.row${rowIndex}Svg`)
					thisRowCells.style('height', currentHeight === rowHeight + 'px' ? openRowHeight + 'px' : rowHeight + 'px');
				})

			svgs.append('rect')
				.attr('height', detailsHeight)
				.attr('x', 0)
				.attr('y', 30)
				.attr('width', tableWidth)
				.attr('fill', headerAndDetailsFill)


			const detailsHorizontalMargin = 40;
			const marginLeftOfDT = 15;
			const DTWidth = JsUtils.getTextWidth('8.8 °F', fonts.detailsValue)
			const meterWidth = (tableWidth - ( (detailsHorizontalMargin * 4) + (marginLeftOfDT * 2) + (DTWidth * 2) )) / 3;
			const detailsVerticalMargin = 10;
			const marginBelowDetailsValue = 2;
			const detailsSectionTitleHeight = JsUtils.getTextHeight(fonts.detailsSectionTitle);
			const detailsValueHeight = JsUtils.getTextHeight(fonts.detailsValue);
			const detailsLabelHeight = JsUtils.getTextHeight(fonts.detailsLabel);
			const meterHeight = (detailsHeight - ( (detailsVerticalMargin * 6) + detailsSectionTitleHeight )) / 4
			const detailsColumnIndex = columnIndeces.Details;
			const tooltipHeight = detailsHeight - (detailsSectionTitleHeight + detailsValueHeight + marginBelowDetailsValue + meterHeight + (detailsVerticalMargin * 5))
			const meterBackgroundColor = '#d4d4d4'
			const rlaMeterColor = '#22b573'
			const oddEvapMeterColor = '#1dc1e4'
			const evenEvapMeterColor = '#3Ea9f5'
			const oddCondMeterColor = '#Ecb550'
			const evenCondMeterColor = '#d53d3b'


			const detailsCol1s = svgs.append('g')
				.attr('class', 'detailsCol1s')
				.attr('data-index', function(){return this.parentNode.getAttribute('data-index')})
				.attr('transform', `translate(${detailsHorizontalMargin}, ${rowHeight + detailsSectionTitleHeight + detailsVerticalMargin})`)
			const detailsCol2s = svgs.append('g')
				.attr('class', 'detailsCol2s')
				.attr('data-index', function(){return this.parentNode.getAttribute('data-index')})
				.attr('transform', `translate(${(detailsHorizontalMargin * 2) + meterWidth}, ${rowHeight + detailsSectionTitleHeight + detailsVerticalMargin})`)
			const detailsCol3s = svgs.append('g')
				.attr('class', 'detailsCol3s')
				.attr('data-index', function(){return this.parentNode.getAttribute('data-index')})
				.attr('transform', `translate(${(detailsHorizontalMargin * 2) + (meterWidth * 2) + marginLeftOfDT}, ${rowHeight + detailsValueHeight + detailsSectionTitleHeight + (detailsVerticalMargin * 4) + detailsSectionTitleHeight + (detailsValueHeight * 3) + (marginBelowDetailsValue * 3) + meterHeight})`)
			const detailsCol4s = svgs.append('g')
				.attr('class', 'detailsCol4s')
				.attr('data-index', function(){return this.parentNode.getAttribute('data-index')})
				.attr('transform', `translate(${(detailsHorizontalMargin * 3) + (meterWidth * 2) + marginLeftOfDT + DTWidth}, ${rowHeight + detailsSectionTitleHeight + detailsVerticalMargin})`)
			const detailsCol5s = svgs.append('g')
				.attr('class', 'detailsCol5s')
				.attr('data-index', function(){return this.parentNode.getAttribute('data-index')})
				.attr('transform', `translate(${(detailsHorizontalMargin * 3) + (meterWidth * 3) + (marginLeftOfDT * 2) + DTWidth}, ${rowHeight + detailsValueHeight + detailsSectionTitleHeight + (detailsVerticalMargin * 4) + detailsSectionTitleHeight + (detailsValueHeight * 3) + (marginBelowDetailsValue * 3) + meterHeight})`)

			//Section Titles
			detailsCol1s.append('text')
				.style('font', fonts.detailsSectionTitle)
				.attr('fill', 'white')
				.text('STATUS')

			detailsCol2s.append('text')
				.style('font', fonts.detailsSectionTitle)
				.attr('fill', 'white')
				.text('EVAPORATOR')

			detailsCol4s.append('text')
				.style('font', fonts.detailsSectionTitle)
				.attr('fill', 'white')
				.text('CONDENSER')

			
			//Delta Ts
			detailsCol3s.append('text')
				.style('font', fonts.detailsValue)
				.attr('fill', 'white')
				.text(function() {
					const rowIndex = this.parentNode.getAttribute('data-index');
					const chillerObject = widget.sortableTableData[rowIndex];
					return chillerObject[detailsColumnIndex].value.evaporator.dt.displayValue;
				})
			detailsCol3s.append('text')
				.style('font', fonts.detailsLabel)
				.attr('fill', 'white')
				.attr('y', marginBelowDetailsValue + detailsLabelHeight)
				.text('DT')

			detailsCol5s.append('text')
				.style('font', fonts.detailsValue)
				.attr('fill', 'white')
				.text(function() {
					const rowIndex = this.parentNode.getAttribute('data-index');
					const chillerObject = widget.sortableTableData[rowIndex];
					return chillerObject[detailsColumnIndex].value.condenser.dt.displayValue;
				})
			detailsCol5s.append('text')
				.style('font', fonts.detailsLabel)
				.attr('fill', 'white')
				.attr('y', marginBelowDetailsValue + detailsLabelHeight)
				.text('DT')


			//Tooltip Location
			const arrayOfChillerDetails = [];
			const tooltipGroups = detailsCol1s.append('g')
				.attr('class', function() {return `tooltipGroup tooltipGroup${this.parentNode.getAttribute('data-index')}`})
				.attr('data-index', function(){return this.parentNode.getAttribute('data-index')})
				.attr('transform', `translate(0, ${detailsVerticalMargin + detailsValueHeight + marginBelowDetailsValue + meterHeight + (detailsVerticalMargin * 3)})`)
				.each(function() {
					const chillerIndex = this.getAttribute('data-index')
					arrayOfChillerDetails[chillerIndex] = widget.sortableTableData[chillerIndex][columnIndeces.Details].value;
				})

			//Col 1 Meters
			const col1MetersGroups = detailsCol1s.append('g')
				.attr('class', function() {return `meterGroup col1MeterGroup${this.parentNode.getAttribute('data-index')}`})
				.attr('transform', `translate(0, ${detailsVerticalMargin})`)


			arrayOfChillerDetails.forEach((chillerDetails, index) => {
				const chillerStatus = chillerDetails.status;
				const rlaMeter = new Meter(d3.select('.col1MeterGroup' + index), d3.select('.tooltipGroup' + index), meterBackgroundColor, rlaMeterColor, 'white', meterHeight, meterWidth, '%RLA', chillerStatus.units, chillerStatus.precision, fonts.detailsLabel, fonts.detailsValue, fonts.detailsValue, chillerStatus.value, chillerStatus.min, chillerStatus.max, true);
				rlaMeter.create();
			})


			//Col 2 Meters
			const col2Groups = detailsCol2s.append('g')
				.attr('data-index', function(){return this.parentNode.getAttribute('data-index')})
				.attr('transform', `translate(0, ${detailsVerticalMargin})`)
			
			const col2MetersGroups = col2Groups.selectAll('.col2MetersGroups')
				.data(['Dp', 'Flow', 'Lwt', 'Ewt'])
				.enter().append('g')
					.attr('class', function(d) {return `meterGroup col2MeterGroup${this.parentNode.getAttribute('data-index') + d}`})
					.attr('transform', (d, i) => `translate(0, ${(meterHeight * i) + (detailsVerticalMargin * i)})`)
					.each(function(d, i) {
							const index = this.parentNode.getAttribute('data-index');
							const typeDetails = arrayOfChillerDetails[index].evaporator[d.toLowerCase()];
							const rlaMeter = new Meter(d3.select('.col2MeterGroup' + index + d), d3.select('.tooltipGroup' + index), meterBackgroundColor, i%2 ? evenEvapMeterColor : oddEvapMeterColor, 'white', meterHeight, meterWidth, d, typeDetails.units, typeDetails.precision, fonts.detailsLabel, fonts.detailsValue, fonts.detailsValue, typeDetails.value, typeDetails.min, typeDetails.max, true, typeDetails.design);
							rlaMeter.create();
					})


			//Col 4 Meters
			const col4Groups = detailsCol4s.append('g')
				.attr('data-index', function(){return this.parentNode.getAttribute('data-index')})
				.attr('transform', `translate(0, ${detailsVerticalMargin})`)
			
			const col4MetersGroups = col4Groups.selectAll('.col4MetersGroups')
				.data(['Dp', 'Flow', 'Ewt', 'Lwt'])
				.enter().append('g')
					.attr('class', function(d) {return `meterGroup col4MeterGroup${this.parentNode.getAttribute('data-index') + d}`})
					.attr('transform', (d, i) => `translate(0, ${(meterHeight * i) + (detailsVerticalMargin * i)})`)
					.each(function(d, i) {
							const index = this.parentNode.getAttribute('data-index');
							const typeDetails = arrayOfChillerDetails[index].condenser[d.toLowerCase()];
							const rlaMeter = new Meter(d3.select('.col4MeterGroup' + index + d), d3.select('.tooltipGroup' + index), meterBackgroundColor, i%2 ? evenCondMeterColor : oddCondMeterColor, 'white', meterHeight, meterWidth, d, typeDetails.units, typeDetails.precision, fonts.detailsLabel, fonts.detailsValue, fonts.detailsValue, typeDetails.value, typeDetails.min, typeDetails.max, true, typeDetails.design);
							rlaMeter.create();
					})





		}

		drawTbody();
















		






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
		widget.graphicDiv = widget.outerDiv.append('div')
			.attr('class', 'ChillersReport')
			.style('overflow', 'hidden');

		render(widget);
	}





initialize();

}

defineFuncForTabSpacing();