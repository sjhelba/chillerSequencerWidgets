/* global JsUtils */

function defineFuncForTabSpacing () {

	////////// Hard Coded Defs //////////
	const upArrow = 'data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMzUuNSA5OS4yNSI+PHRpdGxlPkdyZWVuQXJyb3dVcDwvdGl0bGU+PGxpbmUgeDE9IjY3Ljc1IiB5MT0iMTIuNSIgeDI9IjEyLjUiIHkyPSI4Ni43NSIgZmlsbD0ic2lsdmVyIiBzdHJva2U9IiMyMmI1NzMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2Utd2lkdGg9IjI1Ii8+PGxpbmUgeDE9IjY3Ljc1IiB5MT0iMTIuNSIgeDI9IjEyMyIgeTI9Ijg2Ljc1IiBmaWxsPSJzaWx2ZXIiIHN0cm9rZT0iIzIyYjU3MyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iMjUiLz48L3N2Zz4='
	const downArrow = 'data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMzUuNSA5OS4yNSI+PHRpdGxlPkdyZWVuQXJyb3dEb3duPC90aXRsZT48bGluZSB4MT0iNjcuNzUiIHkxPSI4Ni43NSIgeDI9IjEyLjUiIHkyPSIxMi41IiBmaWxsPSJzaWx2ZXIiIHN0cm9rZT0iIzIyYjU3MyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iMjUiLz48bGluZSB4MT0iNjcuNzUiIHkxPSI4Ni43NSIgeDI9IjEyMyIgeTI9IjEyLjUiIGZpbGw9InNpbHZlciIgc3Ryb2tlPSIjMjJiNTczIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLXdpZHRoPSIyNSIvPjwvc3ZnPg=='
	const bothArrows =  'data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMzUuNSAyMTIuNzgiPjx0aXRsZT5HcmV5QXJyb3dzPC90aXRsZT48bGluZSB4MT0iNjcuNzUiIHkxPSIxMi41IiB4Mj0iMTIuNSIgeTI9Ijg2Ljc1IiBmaWxsPSJzaWx2ZXIiIHN0cm9rZT0iI2UxZTFlMSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iMjUiLz48bGluZSB4MT0iNjcuNzUiIHkxPSIxMi41IiB4Mj0iMTIzIiB5Mj0iODYuNzUiIGZpbGw9InNpbHZlciIgc3Ryb2tlPSIjZTFlMWUxIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLXdpZHRoPSIyNSIvPjxsaW5lIHgxPSI2Ny43NSIgeTE9IjIwMC4yOCIgeDI9IjEyLjUiIHkyPSIxMjYuMDMiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2UxZTFlMSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iMjUiLz48bGluZSB4MT0iNjcuNzUiIHkxPSIyMDAuMjgiIHgyPSIxMjMiIHkyPSIxMjYuMDMiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2UxZTFlMSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iMjUiLz48L3N2Zz4='
	const exclamation = 'data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTkuNSAyNTkuNSI+PHRpdGxlPmV4Y2xhbWF0aW9uPC90aXRsZT48Y2lyY2xlIGN4PSIxMjkuNzUiIGN5PSIxMjkuNzUiIHI9IjEyOS43NSIgZmlsbD0iI2ZjYjU1MCIvPjxjaXJjbGUgY3g9IjEyOS43NSIgY3k9IjIwMy4yOCIgcj0iMjkuNDUiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMTc1Ljg5LDE5MUgxNDIuMTdjLTQsMC02LjM2LTMuMzQtNi40OS03LjU0TDEzMS45MSw2Mi43MWMwLTUuMzQsNS40LTkuNzEsMTItOS43MWgzMi4xOGM2LjYsMCwxMiw0LjM3LDEyLDkuNzFsLTQuNzEsMTIwLjgxQTcuNjMsNy42MywwLDAsMSwxNzUuODksMTkxWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTMwLjI1IC0zMC4yNSkiIGZpbGw9IiNmZmYiLz48L3N2Zz4='
	const triangle = 'data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMjIuMjIgMTczLjYyIj48dGl0bGU+RGV0YWlsc1RyaWFuZ2xlPC90aXRsZT48cGF0aCBkPSJNMTU0LDg4LDYyLjY2LDIyMi4yM2E3LjIxLDcuMjEsMCwwLDAsNiwxMS4yN0gyNTEuMzlhNy4yMSw3LjIxLDAsMCwwLDUuOTUtMTEuMjdMMTY2LDg4QTcuMjEsNy4yMSwwLDAsMCwxNTQsODhaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDguODkgLTcyLjM5KSIgZmlsbD0iIzQyNTg2NyIgc3Ryb2tlPSIjNDI1ODY3IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLXdpZHRoPSIyNSIvPjwvc3ZnPg=='

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


	const dataSort = (column, currentSort, sortableTableData) => {
		if (currentSort.column === column) {
			currentSort.ascending = !currentSort.ascending;
		} else {
			currentSort.column = column;
			currentSort.ascending = true;
		}

		sortableTableData = sortableTableData.sort((a, b) => {
			if (currentSort.ascending) {
				return a[columnIndeces[column]].value > b[columnIndeces[column]].value ? 1 : -1;
			} else {
				return b[columnIndeces[column]].value > a[columnIndeces[column]].value ? 1 : -1;
			}
		});
	};

	const runningColor = '#22b573'
	const unavailableColor = '#Ecb550'
	const headerAndDetailsFill = '#425867'
	const evenNumberRowFill = '#e0e0e0'
	const oddNumberRowFill = '#F5F5F5'

	const meterBackgroundColor = '#d4d4d4'
	const rlaMeterColor = '#22b573'
	const oddEvapMeterColor = '#1dc1e4'
	const evenEvapMeterColor = '#3Ea9f5'
	const oddCondMeterColor = '#Ecb550'
	const evenCondMeterColor = '#d53d3b'

	const fonts = {
		Item: 'bold 11.5pt Nirmala UI',
		Status: 'bold 11.5pt Nirmala UI',
		Availability: 'bold 11.5pt Nirmala UI',
		Power: '11.5pt Nirmala UI',
		Tons: '11.5pt Nirmala UI',
		Efficiency: '11.5pt Nirmala UI',
		headers: '10.5pt Nirmala UI',
		detailsSectionTitle: 'bold 10.5pt Nirmala UI',
		detailsValue: 'bold 10.5pt Nirmala UI',
		detailsLabel: '10.5pt Nirmala UI'
	}

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
					{column: 'Status', value: 'Running', displayValue: 'Running', exclamation: false},
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
					{column: 'Status', value: 'Off', displayValue: 'Off', exclamation: false},
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
					{column: 'Status', value: 'Off', displayValue: 'Off', exclamation: false},
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
					{column: 'Status', value: 'Off', displayValue: 'Off', exclamation: false},
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
					{column: 'Status', value: 'Running', displayValue: 'Running', exclamation: true},
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
					{column: 'Status', value: 'Off', displayValue: 'Off', exclamation: false},
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
					{column: 'Status', value: 'Off', displayValue: 'Off', exclamation: false},
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
					{column: 'Item', value: 7, displayValue: 'Chiller 888'},	//15 char max including spaces
					{column: 'Status', value: 'Running', displayValue: 'Running', exclamation: false},
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
					{column: 'Status', value: 'Off', displayValue: 'Off', exclamation: false},
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
					{column: 'Status', value: 'Running', displayValue: 'Running', exclamation: false},
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
			if (!data.sortableTableData) data.sortableTableData = data.unsortableTableData.map(chillers => chillers.map(chiller => Object.assign({}, chiller)));
			if (!widget.hoveredRowIndex) widget.hoveredRowIndex = 'none';
			if (!widget.hoveredMeter) widget.hoveredMeter = 'none';
			if (!widget.openRows) widget.openRows = new Set();


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
		const scrollbarWidth = 15 //approximate, changes per browser
		const colWidth = ((tableWidth - scrollbarWidth) / 6);
		const firstColWidth = colWidth + 20;
		const otherColWidth = ((tableWidth - scrollbarWidth) - 20) / 6

		const tableHeight = data.graphicHeight;
		const headerHeight = 30;
		const maxTbodyHeight = tableHeight - headerHeight;
		const rowHeight = maxTbodyHeight / 8;

		const detailsHeight = 180;
		const openRowHeight = detailsHeight + rowHeight;

		const hoveredRectHeight = rowHeight * 0.8;
		const hoveredRectWidth = JsUtils.getTextWidth('!', fonts.Item);
		const arrowWidth = JsUtils.getTextWidth('^', fonts.headers)
		const headerTextHeight = JsUtils.getTextHeight(fonts.headers)

		// ********************************************* DRAW ******************************************************* //
		widget.graphicDiv 
			.attr('width', tableWidth + 'px')
			.attr('height', tableHeight + 'px')
		d3.select(widget.graphicDiv.node().parentNode).style('background-color', data.backgroundColor);
		// delete leftover elements from versions previously rendered
		if (!widget.graphicDiv.empty()) JsUtils.resetElements(widget.graphicDiv, '*');

		widget.graphicDiv.attr('transform', `translate(${margin}, ${margin})`);

		const table = widget.graphicDiv.append('table')
			.attr('class', 'table')
			.style('background-color', 'white')
			.style('width', tableWidth + 20 + 'px')
			.style('border-collapse', 'collapse')
			.style('text-align', 'center')
			.style('cursor', 'default')
			.style('table-layout', 'fixed')
	

		const thead = table.append('thead')
			.attr('class', 'thead')
			.style('display', 'block')
			.style('width', tableWidth + 'px')
			.style('height', headerHeight + 'px')
			.style('background-color', 'white')

		const tbody = table.append('tbody')
			.attr('class', 'tbody')
			.style('display', 'block')
			.style('max-height', maxTbodyHeight + 'px')
			.style('overflow-y', 'scroll')	//or scroll	
			.style('width', tableWidth + 'px')
			.style('table-layout', 'fixed')


		// ********************************************* THEAD ******************************************************* //
		const headerRow = thead.append('tr')
			.style('height', headerHeight + 'px')
			.style('color', 'white')
			.style('position', 'absolute')
			.style('width', tableWidth - scrollbarWidth)


		const headerCols = headerRow.selectAll('th')
			.data(columns.slice(0, -1))	//don't include Details
			.enter().append('th')
				.html(d => d)
				.style('position', 'absolute')
				.style('width', (d, i) => i === 0 ? firstColWidth + 'px' : otherColWidth + 'px')
				.style('height', headerHeight + 'px')
				.style('font', fonts.headers)
				.attr('class', d => `header ${d}Header`)
				.style('left', (d, i) => i ? firstColWidth + ((i-1) * otherColWidth) + 'px' : '0px')
				.style('top', (headerHeight / 2) - (headerTextHeight / 1.25) + 'px')
				.style('padding-right', 0)
				.style('padding-left', 0)
				.on('click', function(d){
					dataSort(d, widget.currentSort, data.sortableTableData);
					drawTbody();
					drawHeaderArrows();
				});


		const headerSVG = headerRow.append('svg')
			.attr('position', 'absolute')
			.attr('class', 'headerSVG')
			.attr('height', headerHeight)
			.attr('width', tableWidth)
			.style('background-color', headerAndDetailsFill);


		function drawHeaderArrows() {
			JsUtils.resetElements(headerSVG, '.headerArrow')
			headerSVG.selectAll('.headerArrows')
				.data(columns.slice(0, -1))	//don't include Details
				.enter().append('svg:image')
					.attr('xlink:href', d => widget.currentSort.column === d ? (widget.currentSort.ascending ? downArrow : upArrow) : bothArrows)
					.attr('class', 'headerArrow')
					.attr('x', (d, i) => {
						const dWidth = JsUtils.getTextWidth(d, fonts.headers);
						const thisColWidth = i ? otherColWidth : firstColWidth;
						const xFromThisColStart = ((thisColWidth / 2) - (dWidth / 2)) - 21;
						if (i === 0) return xFromThisColStart;
						return firstColWidth + ((i - 1) * otherColWidth) + xFromThisColStart;
					})
					.attr('y', (headerHeight / 2) - ((headerHeight / 2) / 2))
					.attr('height', headerHeight / 2)
					.attr('width', 12)
		}
		drawHeaderArrows();




		// ********************************************* TBODY ******************************************************* //
		const drawTbody = () => {
			if (!tbody.empty()) tbody.selectAll('*').remove();

			const rows = tbody.selectAll('.row')
				.data(data.sortableTableData)
				.enter().append('tr')
					.attr('class', (d, i) => 'row row' + i)
					.style('background-color', (d, i) => i%2 ? evenNumberRowFill : oddNumberRowFill)
					.attr('data-index', (d, i) => i)
					.on('mouseenter', hoverRow)
					.on('mouseleave', unhoverRow)
					.style('height', rowHeight + 'px')



			
			const cells = rows.selectAll('.cell')
				.data(d => d.filter(obj => obj.column !== 'Details') )
				.enter().append('td')
					.attr('class', function(d) {return `cell ${d.column}Cell row${this.parentNode.getAttribute('data-index')}Cell`}) 
					.attr('data-index', function(){return this.parentNode.getAttribute('data-index')})
					.style('width', (d, i) => i === 0 ? firstColWidth + 'px' : otherColWidth + 'px')
					.style('padding', 0)
					.style('height', rowHeight + 'px')
					.style('vertical-align', 'top')
					.style('overflow', 'hidden')
					.style('display', 'table-cell')
					.on('click', function() {toggleRow(this)})



			const cellDivs = cells.append('div')
				.attr('data-index', function(){return this.parentNode.getAttribute('data-index')})
				.style('width', (d, i) => (i === 0 ? firstColWidth : otherColWidth) + 'px')
				.style('height', rowHeight + 'px')
				.style('display', 'table-cell')
				.style('position', 'relative')
				.on('click', function() {toggleRow(this)})


			const innerCellDivs = cellDivs.append('div')
				.attr('class', function() {'innerCellDiv innerCellDiv' + this.parentNode.getAttribute('data-index') })
				.attr('data-index', function(){return this.parentNode.getAttribute('data-index')})
				.style('background-color', d => d.displayValue === 'Running' ? runningColor : d.displayValue === 'Unavailable' ? unavailableColor : 'none')
				.style('color', d => d.displayValue === 'Running' || d.displayValue === 'Unavailable' ? 'white' : 'black')
				.style('border-radius', '8px')
				.style('word-break', 'break-all')
				.style('word-wrap', 'break-word')
				.attr('data-index', function(){return this.parentNode.getAttribute('data-index')})
				.style('width', (d, i) => (i === 0 ? firstColWidth : otherColWidth) - 8 + 'px')	//start at (i === 0 ? firstColWidth : otherColWidth) + 'px'
				.style('left', 4 + 'px')	//start at 0
				.style('height', rowHeight - 6 + 'px')	// start at rowHeight
				.style('display', 'table-cell')
				.style('vertical-align', 'middle')
				.style('position', 'relative')
				.style('top', '5px')	//start at 2 to center based on rowHeight
				.html(d => d.displayValue)
				.style('font', d => fonts[d.column])
				.each(function(d, i) {
					if (d.exclamation) d3.select(this).append('img')
						.attr('src', exclamation)
						.attr('height', 15)
						.attr('width', 15)
						.style('position', 'absolute')
						.style('right', '-3px')
						.style('top', '-3px')
						.attr('x', 10)
				})
				.on('click', function() {toggleRow(this)})






			const svgs = rows.append('svg')
				.attr('class', function(d) {return `svg row${this.parentNode.getAttribute('data-index')}Svg`})
				.attr('data-index', function(){return this.parentNode.getAttribute('data-index')})
				.style('width', tableWidth - scrollbarWidth + 'px')
				.style('height', function () {return widget.openRows.has(this.parentNode.getAttribute('data-index')) ? openRowHeight + 'px' : rowHeight + 'px'})
				.style('margin-left', `-${tableWidth - scrollbarWidth}px`)
				.attr('transform', 'translate(0,2)')
				.each(function() {
					const rowIndex = +this.parentNode.getAttribute('data-index');
					if (widget.openRows.has(rowIndex)) appendTriangle(rowIndex);
				})
				.on('click', function() {toggleRow(this)})


			// hovered rects 
			function hoverRow(d, i) {
				widget.hoveredRowIndex = i;
				widget.outerDiv.select(`.row${i}Svg`).append('rect')
					.attr('class', 'hoveredRect')
					.attr('height', hoveredRectWidth)
					.attr('width', hoveredRectWidth)
					.attr('fill', '#1dc1e4')
					.attr('rx', 3)
					.attr('ry', 3)
					.attr('y', (rowHeight / 2) - (hoveredRectWidth / 2) )
					.attr('x', 5)
					.transition()
						.duration(200)
						.attr('height', hoveredRectHeight)
						.attr('y', (rowHeight / 2) - (hoveredRectHeight / 2))
			}
			if (widget.hoveredRowIndex !== 'none') {
				hoverRow(null, widget.hoveredRowIndex);
			}

			function unhoverRow() {
				widget.hoveredRowIndex = 'none'
				widget.outerDiv.selectAll('.hoveredRect')
					.transition()
						.duration(200)
						.attr('height', hoveredRectWidth)
						.attr('y', (rowHeight / 2) - (hoveredRectWidth / 2))
						.remove();
			}



			function toggleRow(that){
				const rowIndex = +that.getAttribute('data-index');
				const isCurrentlyOpen = widget.openRows.has(rowIndex);
				const thatRowCells = widget.graphicDiv.selectAll(`.row${rowIndex}Cell,.row${rowIndex}Svg`)
				if (isCurrentlyOpen) {
					thatRowCells.style('height', rowHeight + 'px');
					d3.select(that).select('.triangle').remove()
					widget.openRows.delete(rowIndex)
				} else {
					thatRowCells.style('height', openRowHeight + 'px');
					appendTriangle(rowIndex);
					widget.openRows.add(rowIndex)
				}
			}

			function appendTriangle(rowIndex) {
				widget.graphicDiv.select(`.row${rowIndex}Svg`).append('svg:image')
					.attr('class', 'triangle')
					.attr('xlink:href', triangle)
					.attr('height', 10)
					.attr('width', 20)
					.attr('x', firstColWidth - 10)
					.attr('y', rowHeight - 5)
			}



			// ********************************************* DETAILS ******************************************************* //
			//details rect
			svgs.append('rect')
				.attr('height', detailsHeight)
				.attr('y', rowHeight + 4)
				.attr('width', tableWidth - scrollbarWidth)
				.attr('fill', headerAndDetailsFill)


			const detailsHorizontalMargin = 40;
			const marginLeftOfDT = 15;
			const DTWidth = JsUtils.getTextWidth('8.8 °F', fonts.detailsValue)
			const meterWidth = ((tableWidth - scrollbarWidth) - ( (detailsHorizontalMargin * 4) + (marginLeftOfDT * 2) + (DTWidth * 2) )) / 3;
			const detailsVerticalMargin = 10;
			const marginBelowDetailsValue = 2;
			const detailsSectionTitleHeight = JsUtils.getTextHeight(fonts.detailsSectionTitle);
			const detailsValueHeight = JsUtils.getTextHeight(fonts.detailsValue);
			const detailsLabelHeight = JsUtils.getTextHeight(fonts.detailsLabel);
			const meterHeight = (detailsHeight - ( (detailsVerticalMargin * 6) + detailsSectionTitleHeight )) / 4
			const detailsColumnIndex = columnIndeces.Details;


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
					const chillerObject = data.sortableTableData[rowIndex];
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
					const chillerObject = data.sortableTableData[rowIndex];
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
					arrayOfChillerDetails[chillerIndex] = data.sortableTableData[chillerIndex][columnIndeces.Details].value;
				})

			//Col 1s Meter
			const col1MetersGroups = detailsCol1s.append('g')
				.attr('class', function() {return `meterGroup col1MeterGroup${this.parentNode.getAttribute('data-index')}`})
				.attr('transform', `translate(0, ${detailsVerticalMargin})`)


			arrayOfChillerDetails.forEach((chillerDetails, index) => {
				const chillerStatus = chillerDetails.status;
				const rlaMeter = new Meter(widget.graphicDiv.select('.col1MeterGroup' + index), widget.graphicDiv.select('.tooltipGroup' + index), meterBackgroundColor, rlaMeterColor, 'white', meterHeight, meterWidth, '%RLA', chillerStatus.units, chillerStatus.precision, fonts.detailsLabel, fonts.detailsValue, fonts.detailsValue, chillerStatus.value, chillerStatus.min, chillerStatus.max, true, null, widget.hoveredMeter === '.col1MeterGroup' + index);
				rlaMeter.create();
				rlaMeter.callbackOnHover(() => widget.hoveredMeter = '.col1MeterGroup' + index);
				rlaMeter.callbackOnUnhover(() => widget.hoveredMeter = 'none')
			})


			//Col 2s Meters
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
							const col2Meters = new Meter(widget.graphicDiv.select('.col2MeterGroup' + index + d), widget.graphicDiv.select('.tooltipGroup' + index), meterBackgroundColor, i%2 ? evenEvapMeterColor : oddEvapMeterColor, 'white', meterHeight, meterWidth, d, typeDetails.units, typeDetails.precision, fonts.detailsLabel, fonts.detailsValue, fonts.detailsValue, typeDetails.value, typeDetails.min, typeDetails.max, true, typeDetails.design, widget.hoveredMeter === '.col2MeterGroup' + index + d);
							col2Meters.create();
							col2Meters.callbackOnHover(() => widget.hoveredMeter = '.col2MeterGroup' + index + d);
							col2Meters.callbackOnUnhover(() => widget.hoveredMeter = 'none')
					})


			//Col 4s Meters
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
							const col4Meters = new Meter(widget.graphicDiv.select('.col4MeterGroup' + index + d), widget.graphicDiv.select('.tooltipGroup' + index), meterBackgroundColor, i%2 ? evenCondMeterColor : oddCondMeterColor, 'white', meterHeight, meterWidth, d, typeDetails.units, typeDetails.precision, fonts.detailsLabel, fonts.detailsValue, fonts.detailsValue, typeDetails.value, typeDetails.min, typeDetails.max, true, typeDetails.design, widget.hoveredMeter === '.col4MeterGroup' + index + d);
							col4Meters.create();
							col4Meters.callbackOnHover(() => widget.hoveredMeter = '.col4MeterGroup' + index + d);
							col4Meters.callbackOnUnhover(() => widget.hoveredMeter = 'none')
					})





		}

		drawTbody();









console.log('data', data)



		






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